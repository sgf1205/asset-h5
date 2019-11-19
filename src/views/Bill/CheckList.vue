<template>
  <div>
    <da-breadcrumb></da-breadcrumb>
    <el-card class="box-card">
      <el-form
        :model="searchForm"
        ref="searchForm"
        label-width="100px"
        class="demo-ruleForm"
        size="mini"
      >
        <el-row>
          <el-col :span="6">
            <el-form-item label="被盘点部门">
              <organ-select :v-model="searchForm.organId" @changeId="changeOrganId"></organ-select>
            </el-form-item>
          </el-col>
          
       
          <el-col :span="18">
            <el-form-item>
              <el-button type="primary" :size="$store.state.size" @click="load">查询</el-button>
              <el-button
                type="primary"
                :size="$store.state.size"
                icon="el-icon-plus"
                style="margin-left:10px;"
                @click="$router.push({name:'Check'})"
              >资产盘点</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table
        :data="registerData"
        border
        style="width: 100%;margin:10px 0;"
      >
       
        <el-table-column align="center" prop="organName" label="被盘点部门" ></el-table-column>
        <el-table-column align="center" prop="needCheckSize" label="应盘点数量" ></el-table-column>
   
        <el-table-column align="center" prop="alreadyCheckSize" label="已盘点数量" ></el-table-column>
        <el-table-column align="center" prop="user" label="盘点人" ></el-table-column>
        <el-table-column align="center" prop="checkTime" label="盘点时间" >
          <template slot-scope="scope">{{scope.row.checkTime|date}}</template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        :page-sizes="[5,10, 20, 30, 50]"
        :page-size="pageSize"
        layout="sizes, prev, pager, next"
        :total="totalSize"
        :current-page="currentPage"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </el-card>  
  </div>
</template>
<script>
import QRCode from "qrcodejs2";
import daBreadcrumb from "@/components/da-breadcrumb";
import organSelect from "../sys/OrganSelect";
import { isDecimal } from "@/libs/validator.js";
export default {
  components: {
    "organ-select": organSelect,
    daBreadcrumb
  },
  data() {
    return {
      rules: {
        name: [{ required: true, message: "请输入" }],
        classesId: [{ required: true, message: "请选择" }],
        money: [{ validator: isDecimal }],
        purchaseTime: [{ required: true, message: "请输入" }],
        organId: [{ required: true, message: "请选择" }]
      },
      status:[
        {label:'空闲',value:0},
        {label:'借用',value:2},
        {label:'领用',value:3},
        {label:'维修',value:4},
        {label:'报废',value:5}
      ],
      addDialogTableVisible: false,
      editDialogTableVisible: false,
      showModel: false,
      addRegisterData: {},
      searchForm: {},
      selectedRows: [],
      registerData: [],
      pageSize: 10,
      currentPage: 1,
      totalSize: 0
    };
  },
  methods: {
   
    handleSelectionChange(val) {
      //获取选中的删除条目ID
      //console.log(val)
      this.selectedRows = val;
    },
    changeOrganId(organId) {
      this.searchForm.organId = organId;
    },
    load() {
      let _self = this;
      this.searchForm.pageSize=this.pageSize;
      this.searchForm.currentPage=this.currentPage;
      this.$api
        .get("/check/list", this.searchForm)
        .then(res => {
          if (res.code == 0 && res.data) {
            _self.registerData = res.data.result;
            //_self.currentPage=res.data.currentPage;
            _self.totalSize = res.data.totalSize;
          }
        });
    },
   
    handleSizeChange(val) {
      this.pageSize = val;
      this.load();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.load();
    }
  },
  mounted() {
    this.load();
  }
};
</script>
<style lang="less">
.assets-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
  &:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100%;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .avatar {
    width: 100%;
    height: 100px;
    display: block;
  }
}
.show-dialog {
  .el-input input,
  .el-textarea textarea {
    background-color: #fff !important;
    color: #606266 !important;
    cursor: default !important;
  }
}
</style>