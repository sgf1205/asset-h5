<template>
  <div>
    <da-breadcrumb></da-breadcrumb>
    <el-card>
          <!-- 按钮组 + 搜索栏 -->
          <el-row>
            <!-- 按钮组 -->
            <el-col :span="12">
              <el-button
                type="primary"
                :size="$store.state.size"
                icon="el-icon-plus"
                @click="addScrapDialogVisible = true;newModel=true;addScrapForm={};selectScrapAssetsData=[]"
              >新增</el-button>
              <el-button
                type="primary"
                :size="$store.state.size"
                icon="el-icon-xiugai"
                @click="recovery"
              >还原</el-button>
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
            :data="scraps"
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
            <el-table-column prop="createTime" label="报废时间" align="center">
              <template slot-scope="scope">{{scope.row.createTime|date}}</template>
            </el-table-column>
            <el-table-column prop="scrapUser" label="处理人" align="center"></el-table-column>
            <el-table-column fixed="right" label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  @click="handleClickShowScrap(scope.row)"
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

          <!-- 新增报废 -->
          <el-dialog title="报废单" :visible.sync="addScrapDialogVisible" width="80%">
            <el-form
              ref="form"
              :model="addScrapForm"
              :rules="rules"
              label-width="80px"
              :size="$store.state.size"
            >
              <el-row>
                <el-col :span="8">
                  <el-form-item label="报废人" prop="scrapUser">
                    <el-input type="text" v-model="addScrapForm.scrapUser" placeholder="报废人"></el-input>
                  </el-form-item>
                </el-col>
                    <el-col :span="8" v-if="!newModel">
                        <el-form-item label="报废时间">
                            <el-date-picker v-model="addScrapForm.createTime" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" v-if="addScrapForm.status==7">
                        <el-form-item label="恢复时间">
                            <el-date-picker v-model="addScrapForm.recoveryTime" />
                        </el-form-item>
                    </el-col>
              </el-row>
             
              <el-row>
                
                <el-col :span="16">
                  <el-form-item label="说明">
                    <el-input type="textarea" v-model="addScrapForm.remarks" placeholder="备注"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row v-if="newModel">
                <el-button :size="$store.state.size" @click="openSelectAssetsDialog">选择资产</el-button>
                <el-button type="danger" :size="$store.state.size" @click="removeSelectedAsset">删除</el-button>
              </el-row>
              <el-table
                :data="selectScrapAssetsData"
                border
                style="width: 100%;margin:10px 0;"
                @selection-change="handleAssetSelectionChange"
              >
                <el-table-column fixed type="selection" width="55"></el-table-column>
                <el-table-column align="center" prop="name" label="资产名称"></el-table-column>
                <el-table-column prop="classesName" label="资产类型"></el-table-column>
                <el-table-column prop="specification" label="规格型号"></el-table-column>
                <el-table-column prop="sn" label="序列号"></el-table-column>
                <el-table-column prop="money" label="金额">
                  <template slot-scope="scope">{{scope.row.money|currency}}</template>
                </el-table-column>
                <el-table-column prop="purchaseTime" label="购买时间">
                  <template slot-scope="scope">{{scope.row.purchaseTime|date}}</template>
                </el-table-column>
                <el-table-column prop="registerTime" label="登记时间">
                  <template slot-scope="scope">{{scope.row.registerTime|date}}</template>
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
                @click="addScrapDialogVisible = false;newModel=false"
              >取 消</el-button>
              <el-button :size="$store.state.size" type="primary" @click="handleAddScrapDone">确 定</el-button>
            </span>
            <span v-else slot="footer" class="dialog-footer">
              <el-button
                :size="$store.state.size"
                @click="addScrapDialogVisible = false;newModel=false"
              >关 闭</el-button>
            </span>
          </el-dialog>
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
        scrapUser: [{ required: true, message: "请输入", trigger: "blur" }]
      },
      searchDate: [],
      addScrapDialogVisible: false,
      addScrapForm: {},
      selectAssetsDialogVisible: false,
      assetsCompentReset: false,
      selectScrapAssetsData: [], //正在选择资产
      selectAssetsIds: [],
      revertBorrowIds: [],
      newModel: false,
      scraps: [],
      pageSize: 10,
      currentPage: 1,
      totalSize: 0
    };
  },
  methods: {
    chkstu(row, index) {
      return row.status == 5 ? true : false;
    },
    recovery() {
      if (this.revertBorrowIds.length == 0) {
        this.$message("请选中要恢复的数据条目！");
        return;
      }
      let _self = this;
      this.$confirm("是否确认已报废的资产?", "资产恢复确认提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //要归还的ID数组 this.revertBorrowIds
          _self.$api
            .post("/asset/scrap/recovery", { ids: this.revertBorrowIds })
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
      this.addScrapForm.organId = organId;
    },
    handleClickShowScrap(data) {
      this.addScrapDialogVisible = true;
      this.addScrapForm = data;
      this.selectScrapAssetsData = data.items.map(item => item.asset);
      this.newModel = false;
    },
    handleAddGetAssets(data) {
      //正在选择资产
      this.selectScrapAssetsData = data;
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
        this.selectScrapAssetsData = this.selectScrapAssetsData.filter(
          asset => this.selectAssetsIds.indexOf(asset.id) == -1
        );
      }
    },
    handleAddScrapDone() {
      let _self = this;
      if (this.selectScrapAssetsData.length == 0) {
        _self.$message({
          type: "error",
          message: "请先选择资产"
        });
        return;
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          _self.addScrapForm.assetIds = _self.selectScrapAssetsData.map(
            val => val.id
          );
          _self.$api.post("/asset/scrap/save", _self.addScrapForm).then(res => {
            if (res.code == 0) {
              _self.addScrapForm = {};
              _self.$message({
                type: "success",
                message: "添加成功!"
              });
              _self.addScrapDialogVisible = false;
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

      this.$api.post("/asset/scrap/list", searchForm).then(res => {
        if (res.code == 0 && res.data) {
          this.scraps = res.data.result;
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


