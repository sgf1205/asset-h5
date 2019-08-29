<template>
  <div>
    <da-breadcrumb></da-breadcrumb>
    <el-card>
      <el-tabs v-model="activeTabName">
        <el-tab-pane label="借用" name="borrow">
          <!-- 按钮组 + 搜索栏 -->
          <el-row>
            <!-- 按钮组 -->
            <el-col :span="12">
              <el-button
                type="primary"
                :size="$store.state.size"
                icon="el-icon-plus"
                @click="addApplyDialogVisible = true;newModel=true;addApplyForm={};selectApplyAssetsData=[]"
              >新增</el-button>
              <el-button
                type="primary"
                :size="$store.state.size"
                icon="el-icon-xiugai"
                @click="revertBorrow"
              >归还</el-button>
            </el-col>

            <!-- 搜索栏 -->
            <el-col :span="12" :offset="0">
              <el-button
                :size="$store.state.size"
                icon="el-icon-search"
                style="margin-left:10px;float:right;"
                @click="load"
              ></el-button>
              <el-date-picker
                v-model="searchDate"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :size="$store.state.size"
                style="float:right;"
              ></el-date-picker>
            </el-col>
          </el-row>
          <!-- 数据表格 -->
          <el-table
            :data="applys"
            border
            style="width: 100%;margin:10px 0;"
            @selection-change="handleSelectionChange"
           
          >
            <el-table-column fixed type="selection" :selectable="chkstu" width="55"></el-table-column>
            <el-table-column prop="createTime" label="状态" align="center">
              <template slot-scope="scope">
                <da-assets-status :status="scope.row.status"></da-assets-status>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="借用时间" align="center">
              <template slot-scope="scope">{{scope.row.createTime|date}}</template>
            </el-table-column>
            <el-table-column prop="expectRetreatTime" label="预计归还时间" align="center">
              <template slot-scope="scope">{{scope.row.expectRetreatTime|date}}</template>
            </el-table-column>
            <el-table-column prop="expectRetreatTime" label="实际归还时间" align="center">
              <template slot-scope="scope">{{scope.row.realRetreatTime|date}}</template>
            </el-table-column>
            <el-table-column prop="organ.name" label="借用部门" align="center"></el-table-column>
            <el-table-column prop="applyUser" label="借用人" align="center"></el-table-column>
            <el-table-column fixed="right" label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  @click="handleClickShowApply(scope.row)"
                  type="text"
                  :size="$store.state.size"
                >查看</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination
            background
            :page-sizes="[5,10, 20, 30, 50]"
            :page-size="pageSize"
            layout="sizes, prev, pager, next"
            :total="totalSize"
            :current-page="currentPage"
            @current-change="handleCurrentChange"
          ></el-pagination>

          <!-- 新增领用 -->
          <el-dialog title="借用单" :visible.sync="addApplyDialogVisible" width="70%">
            <el-form
              ref="form"
              :model="addApplyForm"
              :rules="rules"
              label-width="80px"
              :size="$store.state.size"
            >
              <el-row>
                <el-col :span="8">
                  <el-form-item label="借用部门" prop="organId">
                    <organSelect :organId="addApplyForm.organId" @changeId="changeOrganId"></organSelect>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="借用人" prop="applyUser">
                    <el-input type="text" v-model="addApplyForm.applyUser" placeholder="借用人"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="预计归还时间" prop="expectRetreatTime" label-width="100px">
                    <el-date-picker
                      v-model="addApplyForm.expectRetreatTime"
                      type="date"
                      style="width:100%;"
                      placeholder="预计归还时间"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col v-if="!newModel && addApplyForm.status==6" :span="8">
                  <el-form-item label="实际归还时间" label-width="100px">
                    <el-date-picker
                      v-model="addApplyForm.realRetreatTime"
                      type="date"
                      style="width:100%;"
                      placeholder="预计归还时间"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="16">
                  <el-form-item label="说明">
                    <el-input type="textarea" v-model="addApplyForm.remarks" placeholder="借用备注"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row v-if="newModel">
                <el-button :size="$store.state.size" @click="openSelectAssetsDialog">选择资产</el-button>
                <el-button type="danger" :size="$store.state.size" @click="removeSelectedAsset">删除</el-button>
              </el-row>
              <el-table
                :data="selectApplyAssetsData"
                border
                style="width: 100%;margin:10px 0;"
                @selection-change="handleAssetSelectionChange"
              >
                <el-table-column fixed type="selection" width="55"></el-table-column>
                <el-table-column align="center" prop="name" label="资产名称"></el-table-column>
                <el-table-column align="center" prop="classes.name" label="资产类别"></el-table-column>
                <el-table-column align="center" prop="specification" label="品牌型号"></el-table-column>
                <el-table-column align="center" prop="life" label="预计使用年限"></el-table-column>
                <el-table-column align="center" prop="money" label="单价">
                  <template slot-scope="scope">{{scope.row.money|currency}}</template>
                </el-table-column>
                <el-table-column align="center" prop="purchaseTime" label="购置时间">
                  <template slot-scope="scope">{{scope.row.purchaseTime|date}}</template>
                </el-table-column>
                <el-table-column prop="accountingDate" label="财务记账日期">
                  <template slot-scope="scope">{{scope.row.accountingDate|date}}</template>
                </el-table-column>
              </el-table>
            </el-form>

            <!-- 选择资产弹窗 -->
            <el-dialog
              title="选择资产"
              :visible.sync="selectAssetsDialogVisible"
              width="70%"
              append-to-body
            >
              <da-select-assets
                v-if="assetsCompentReset"
                @handle="handleAddGetAssets"
                ref="assetsSelect"
              ></da-select-assets>
              <span slot="footer" class="dialog-footer">
                <el-button :size="$store.state.size" @click="selectAssetsDialogVisible = false">取 消</el-button>
                <el-button :size="$store.state.size" type="primary" @click="handleSelectionDone">确 定</el-button>
              </span>
            </el-dialog>
            <span v-if="newModel" slot="footer" class="dialog-footer">
              <el-button
                :size="$store.state.size"
                @click="addApplyDialogVisible = false;newModel=false"
              >取 消</el-button>
              <el-button :size="$store.state.size" type="primary" @click="handleAddApplyDone">确 定</el-button>
            </span>
            <span v-else slot="footer" class="dialog-footer">
              <el-button
                :size="$store.state.size"
                @click="addApplyDialogVisible = false;newModel=false"
              >关 闭</el-button>
            </span>
          </el-dialog>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script>
import daBreadcrumb from "@/components/da-breadcrumb";
import daAssetsStatus from "@/components/da-assets-status";
import daSelectAssets from "@/components/da-select-assets";
import organSelect from "../sys/OrganSelect";
export default {
  data() {
    return {
      rules: {
        applyUser: [{ required: true, message: "请输入", trigger: "blur" }],
        organId: [{ required: true, message: "请选择", trigger: "blur" }]
      },
      activeTabName: "borrow",
      searchDate: [],
      addApplyDialogVisible: false,
      addApplyForm: {},
      selectAssetsDialogVisible: false,
      assetsCompentReset: false,
      selectApplyAssetsData: [], //正在选择资产
      selectAssetsIds: [],
      revertBorrowIds: [],
      newModel: false,
      applys: [],
      pageSize: 10,
      currentPage: 1,
      totalSize: 0
    };
  },
  methods: {
    chkstu(row, index) {
      return row.status == 2 ? true : false;
    },
    revertBorrow() {
      if (this.revertBorrowIds.length == 0) {
        this.$message("请选中要归还的数据条目！");
        return;
      }
      let _self = this;
      this.$confirm("是否已经检查归还资产, 是否继续?", "资产归还确认提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //要归还的ID数组 this.revertBorrowIds
          _self.$api
            .post("/asset/apply/return", { ids: this.revertBorrowIds })
            .then(res => {
              if (res.code == 0) {
                this.$message({
                  type: "success",
                  message: "归还成功!"
                });
                _self.load();
              } else {
                this.$message({
                  type: "warning",
                  message: "归还失败!" + res.msg
                });
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消归还"
          });
        });
    },
    handleSelectionChange(val) {
      //获取选中的删除条目ID
      this.revertBorrowIds = val.map(val => {
        return val.id;
      });
    },

    changeOrganId(organId) {
      this.addApplyForm.organId = organId;
    },
    handleClickShowApply(data) {
      this.addApplyDialogVisible = true;

      this.addApplyForm.organId = data.organ.id;
      this.addApplyForm.applyUser = data.applyUser;
      this.addApplyForm.remarks = data.remarks;
      this.addApplyForm.expectRetreatTime = data.expectRetreatTime;
      this.addApplyForm.status = data.status;
      this.addApplyForm.realRetreatTime = data.realRetreatTime;
      this.selectApplyAssetsData = data.items.map(item => item.asset);
      this.newModel = false;
    },
    handleAddGetAssets(data) {
      //正在选择资产
      this.selectApplyAssetsData = data;
    },
    openSelectAssetsDialog() {
      this.selectAssetsDialogVisible = true;
      this.assetsCompentReset = false;
      this.$nextTick(() => {
        this.assetsCompentReset = true;
      });
    },
    handleSelectionDone() {
      this.$refs.assetsSelect.handleSelectionDone();
      this.selectAssetsDialogVisible = false;
    },
    handleAssetSelectionChange(val) {
      this.selectAssetsIds = val.map(v => v.id);
    },
    removeSelectedAsset() {
      if (this.selectAssetsIds.length > 0) {
        this.selectApplyAssetsData = this.selectApplyAssetsData.filter(
          asset => this.selectAssetsIds.indexOf(asset.id) == -1
        );
      }
    },
    handleAddApplyDone() {
      let _self = this;
      if (this.selectApplyAssetsData.length == 0) {
        _self.$message({
          type: "error",
          message: "请先选择资产"
        });
        return;
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          _self.addApplyForm.assetIds = _self.selectApplyAssetsData.map(
            val => val.id
          );
          _self.addApplyForm.type = 2;
          _self.addApplyForm.status = 2;
          _self.$api.post("/asset/apply/save", _self.addApplyForm).then(res => {
            if (res.code == 0) {
              _self.addApplyForm = {};
              _self.$message({
                type: "success",
                message: "添加成功!"
              });
              _self.addApplyDialogVisible = false;
              _self.load();
            }
          });
        }
      });
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.load();
    },
    load() {
      let searchForm = {};
      searchForm.pageSize = this.pageSize;
      searchForm.currentPage = this.currentPage;
      searchForm.type = 2;
      if (this.searchDate.length != 0) {
        searchForm.startCreateDate = this.searchDate[0];
        searchForm.endCreateDate = this.searchDate[1];
      }

      this.$api.post("/asset/apply/list", searchForm).then(res => {
        if (res.code == 0 && res.data) {
          this.applys = res.data.result;
          this.totalSize = res.data.totalSize;
        }
      });
    }
  },
  mounted() {
    this.load();
  },
  components: {
    daBreadcrumb,
    daAssetsStatus,
    daSelectAssets,
    organSelect
  }
};
</script>


