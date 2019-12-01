<template>
  <div>
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
                @click="revertReceive"
              >退库</el-button>
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
    <el-table :data="applys" border style="width: 100%;margin:10px 0;" @selection-change="handleSelectionChange">
      <el-table-column fixed type="selection" width="55" :selectable="chkstu"></el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <da-assets-status :status="scope.row.status"></da-assets-status>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="领用时间" align="center">
        <template slot-scope="scope">{{scope.row.createTime|date}}</template>
      </el-table-column>
      <el-table-column prop="organ.name" label="领用部门"  align="center"></el-table-column>
      <el-table-column prop="applyUser" label="领用人"  align="center"></el-table-column>
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
    <el-dialog title="领用单" :visible.sync="addApplyDialogVisible" width="70%">
      <el-form ref="form" :model="addApplyForm" :rules="rules" label-width="80px" :size="$store.state.size">
        <el-row>
          <el-col :span="8">
            <el-form-item
              label="领用部门"
              prop="organId"
            >
              <organSelect :organId="addApplyForm.organId" @changeId="changeOrganId"></organSelect>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="领用人" prop="applyUser">
              <el-input type="text" v-model="addApplyForm.applyUser" placeholder="领用人"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
              <el-form-item   label="领用时间" prop="applyTime">
                  <el-date-picker
                    v-model="addApplyForm.applyTime"
                    type="date"
                    style="width:100%;"
                    placeholder="领用时间"
                    format="yyyy-MM-dd"
                  ></el-date-picker>
              </el-form-item>
           
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="存放地点" prop="storagePlace">
              <el-input type="text" v-model="addApplyForm.storagePlace" placeholder="存放地点"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="使用人" prop="useUser">
              <el-input type="text" v-model="addApplyForm.useUser" placeholder="使用人"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="说明">
              <el-input type="textarea" v-model="addApplyForm.remarks" placeholder="领用备注"></el-input>
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
          <el-table-column align="center" prop="code" label="资产编码"></el-table-column>
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
      <el-dialog title="选择资产" :visible.sync="selectAssetsDialogVisible" width="70%" append-to-body>
        <da-select-assets v-if="assetsCompentReset" @handle="handleAddGetAssets" ref="assetsSelect"></da-select-assets>
        <span  slot="footer" class="dialog-footer">
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
          <el-button :size="$store.state.size" @click="addApplyDialogVisible = false;newModel=false">关 闭</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
import daSelectAssets from "@/components/da-select-assets"
import daAssetsStatus from "@/components/da-assets-status"
import organSelect from "../../sys/OrganSelect"
export default {
  data() {

    return {
      rules: {
        applyUser: [{ required: true, message: "请输入", trigger: "blur" }],
        organId: [{ required: true, message: "请选择", trigger: "blur" }]
      },
      searchDate: [],
      revertReceiveIds:[],
      addApplyDialogVisible: false,
      addApplyForm: {},
      selectAssetsDialogVisible: false,
      assetsCompentReset: false,
      selectApplyAssetsData: [], //正在选择资产
      selectAssetsIds: [],
      newModel: false,
      applys: [],
      pageSize: 10,
      currentPage: 1,

      totalSize: 0
    };
  },
  methods: {
    chkstu(row, index) {
      return row.status == 3 ? true : false;
    },
    changeOrganId(organId) {
      this.addApplyForm.organId = organId;
    },
    handleSelectionChange(val) {
      //获取选中的删除条目ID
      this.revertReceiveIds = val.map(val => {
        return val.id;
      });
    },
    revertReceive() {
      if (this.revertReceiveIds.length == 0) {
        this.$message("请选中要退还的数据条目！");
        return;
      }
      let _self = this;
      this.$confirm("领用资产退库操作, 是否继续?", "资产退库确认提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //要归还的ID数组 this.revertBorrowIds
          _self.$api
            .post("/asset/apply/revert", { ids: this.revertReceiveIds })
            .then(res => {
              if (res.code == 0) {
                this.$message({
                  type: "success",
                  message: "退库成功!"
                });
                _self.load();
              } else {
                this.$message({
                  type: "warning",
                  message: "退库失败!" + res.msg
                });
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消退库"
          });
        });
    },
    handleClickShowApply(data) {
      this.addApplyDialogVisible = true;

      this.addApplyForm.organId=data.organ.id;
      this.addApplyForm.applyUser=data.applyUser;
      this.addApplyForm.applyTime=data.applyTime
      this.addApplyForm.storagePlace=data.storagePlace
      this.addApplyForm.useUser=data.useUser
      this.addApplyForm.remarks=data.remarks;
      this.selectApplyAssetsData=data.items.map(item=>item.asset)
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
          _self.addApplyForm.type = 1;
          _self.addApplyForm.status=3;
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
      let searchForm={};
      searchForm.pageSize=this.pageSize;
      searchForm.currentPage=this.currentPage;
      searchForm.type=1;
      if(this.searchDate.length!=0){
        searchForm.startCreateDate = this.searchDate[0];
        searchForm.endCreateDate = this.searchDate[1];
      }
     
      this.$api.post("/asset/apply/list",searchForm).then(res => {
        if(res.code==0 && res.data){
          this.applys = res.data.result;
          this.totalSize = res.data.totalSize;
        }

      });
    }
  },
  mounted(){
    this.load();
  },
  components: {
    daSelectAssets,
    organSelect,
    daAssetsStatus
  }
};
</script>


