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
          @click="addCollarDialogVisible = true;newModel=true"
        >新增</el-button>
      </el-col>

      <!-- 搜索栏 -->
      <el-col :span="12" :offset="0">
        <el-button
          :size="$store.state.size"
          icon="el-icon-search"
          style="margin-left:10px;float:right;"
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
      :data="collars"
      border
      style="width: 100%;margin:10px 0;"
    >
      <el-table-column fixed type="selection"></el-table-column>
      <el-table-column prop="collarTime" label="领用时间">
        <template slot-scope="scope">{{scope.row.collarTime|date}}</template>
      </el-table-column>
      <el-table-column prop="collarOrganName" label="领用部门"></el-table-column>

      <el-table-column prop="retreatTime" label="归还时间">
        <template slot-scope="scope">{{scope.row.retreatTime|date}}</template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button
            @click="handleClickShowCollar(scope.row)"
            type="text"
            :size="$store.state.size"
          >查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      :page-sizes="[10, 20, 30, 50]"
      :page-size="10"
      layout="sizes, prev, pager, next"
      :total="100"
    ></el-pagination>

    <!-- 新增领用 -->
    <el-dialog title="领用单" :visible.sync="addCollarDialogVisible" width="70%">
      <el-form ref="form" :model="addCollarForm" label-width="80px" :size="$store.state.size">
        <el-row>
          <el-col :span="8">
            <el-form-item label="领用部门">
              <organSelect :organId="addCollarForm.collarOrganId" @changeId="changeOrganId"></organSelect>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="领用时间">
              <el-date-picker
                v-model="addCollarForm.collarTime"
                type="date"
                placeholder="选择领用日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="归还时间">
              <el-date-picker
                v-model="addCollarForm.retreatTime"
                type="date"
                placeholder="选择归还时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="16">
            <el-form-item label="说明">
              <el-input type="textarea" v-model="addCollarForm.remarks" placeholder="领用备注"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="newModel">
          <el-button :size="$store.state.size" @click="openSelectAssetsDialog">选择资产</el-button>
          <el-button type="danger" :size="$store.state.size" @click="removeSelectedAsset">删除</el-button>
        </el-row>
        <el-table
          :data="selectCollarAssetsData"
          border
          style="width: 100%;margin:10px 0;"
          @selection-change="handleAssetSelectionChange"
        >
          <el-table-column fixed type="selection" width="55"></el-table-column>
           <el-table-column align="center" prop="name" label="资产名称" ></el-table-column>
          <el-table-column prop="classesName" label="资产类型" ></el-table-column>
          <el-table-column prop="specification" label="规格型号" ></el-table-column>
          <el-table-column prop="sn" label="序列号" ></el-table-column>
          <el-table-column prop="money" label="金额" >
            <template slot-scope="scope">{{scope.row.money|currency}}</template>
          </el-table-column>
          <el-table-column prop="purchaseTime" label="购买时间" >
            <template slot-scope="scope">{{scope.row.purchaseTime|date}}</template>
          </el-table-column>
          <el-table-column prop="registerTime" label="登记时间" >
            <template slot-scope="scope">{{scope.row.registerTime|date}}</template>
          </el-table-column>
          <el-table-column prop="registerUserName" label="登记人" ></el-table-column>
        </el-table>
      </el-form>

      <!-- 选择资产弹窗 -->
      <el-dialog title="选择资产" :visible.sync="selectAssetsDialogVisible" width="70%" append-to-body>
        <da-select-assets v-if="assetsCompentReset" @handle="handleAddGetAssets" ref="assetsSelect" ></da-select-assets>
        <span slot="footer" class="dialog-footer">
          <el-button :size="$store.state.size" @click="selectAssetsDialogVisible = false">取 消</el-button>
          <el-button :size="$store.state.size" type="primary" @click="handleSelectionDone">确 定</el-button>
        </span>
      </el-dialog>
      <span slot="footer" class="dialog-footer">
        <el-button :size="$store.state.size" @click="addCollarDialogVisible = false;newModel=false">取 消</el-button>
        <el-button
          :size="$store.state.size"
          type="primary"
          @click="handleAddCollarDone"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import daSelectAssets from "@/components/da-select-assets";
import organSelect from "../../sys/OrganSelect";
export default {
  data() {
    return {
      searchDate: [],
      addCollarDialogVisible: false,
      addCollarForm: {},
      showCollarDialogVisible: false,
      selectAssetsDialogVisible: false,
      assetsCompentReset:false,
      selectCollarAssetsData: [], //正在选择资产
      selectAssetsIds:[],
      newModel:false,
      collars: []
    };
  },
  methods: {
    changeOrganId(organId) {
      this.addCollarForm.collarOrganId = organId;
    },
    handleClickShowCollar(data) {
      this.showCollarDialogVisible = true;
      this.showCollarForm = data;
      this.newModel=false;
    },
    handleAddGetAssets(data) {
      //正在选择资产
      this.selectCollarAssetsData = data;
    },
    handleAddGetPerson(row) {
      this.selectPersonDialogVisible = false;
      this.addCollarForm.personnel_id = row.personnel_id;
      this.addCollarForm.personnel_name = row.personnel_name;
    },
    openSelectAssetsDialog(){
      this.selectAssetsDialogVisible=true;
      this.assetsCompentReset = false
      this.$nextTick(() => {
        this.assetsCompentReset = true
      })

    },
    handleSelectionDone() {
      this.$refs.assetsSelect.handleSelectionDone();
      this.selectAssetsDialogVisible = false;
    },
    handleAssetSelectionChange(val){
      this.selectAssetsIds = val.map(v=>v.id);
    },
    removeSelectedAsset(){
      if(this.selectAssetsIds.length>0){
        this.selectCollarAssetsData=this.selectCollarAssetsData.filter(asset=>this.selectAssetsIds.indexOf(asset.id)==-1);
      }
    },
    handleAddCollarDone(){
      let _self=this;
      this.addCollarForm.assetIds=this.selectCollarAssetsData
                                    .map(val=>val.id);
      this.$api
        .post("/asset/collar/save", this.addCollarForm)
        .then(res => {
          if (res.code == 0 && res.data) {
             _self.addCollarForm = {};
            _self.$message({
              type: "success",
              message: "添加成功!"
            });
            this.addCollarDialogVisible = false;
          }
        });
    }
  },
  components: {
    daSelectAssets,
    organSelect
  }
};
</script>
<style lang="less">
.show-collar-form .el-input input,
.show-collar-form .el-textarea textarea {
  background-color: #fff !important;
  color: #333 !important;
  cursor: default !important;
}
</style>

