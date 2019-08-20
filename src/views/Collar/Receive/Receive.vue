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
          @click="addCollarDialogVisible = true"
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
      @selection-change="handleSelectionChange"
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
                format="yyyy 年 MM 月 dd 日"
                value-format="timestamp"
                placeholder="选择领用日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="归还时间">
              <el-date-picker
                v-model="addCollarForm.expect_retreat"
                type="date"
                format="yyyy 年 MM 月 dd 日"
                value-format="timestamp"
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
        <el-row>
          <el-button :size="$store.state.size" @click="selectAssetsDialogVisible=true">选择资产</el-button>
          <el-button type="danger" :size="$store.state.size">删除</el-button>
        </el-row>
        <el-table
          :data="selectCollarAssetsData"
          border
          style="width: 100%;margin:10px 0;"
          @selection-change="handleSelectionChange"
        >
          <el-table-column fixed type="selection" width="55"></el-table-column>
          <el-table-column prop="bar_code" label="资产条码" width="140"></el-table-column>
          <el-table-column prop="name" label="资产名称" width="150"></el-table-column>
          <el-table-column prop="type_id" label="资产类型" width="150"></el-table-column>
          <el-table-column prop="company" label="使用公司" width="100"></el-table-column>
          <el-table-column prop="department" label="使用部门" width="100"></el-table-column>
          <el-table-column prop="user_id" label="使用人" width="100"></el-table-column>
          <el-table-column prop="manager_id" label="管理员" width="100"></el-table-column>
          <el-table-column prop="address" label="存放地点" width="100"></el-table-column>
        </el-table>
      </el-form>

      <!-- 选择资产弹窗 -->
      <el-dialog title="选择资产" :visible.sync="selectAssetsDialogVisible" width="70%" append-to-body>
        <da-select-assets :handle="handleAddGetAssets"></da-select-assets>
        <span slot="footer" class="dialog-footer">
          <el-button :size="$store.state.size" @click="selectAssetsDialogVisible = false">取 消</el-button>
          <el-button :size="$store.state.size" type="primary" @click="handleSelectionDone">确 定</el-button>
        </span>
      </el-dialog>
      <span slot="footer" class="dialog-footer">
        <el-button :size="$store.state.size" @click="addCollarDialogVisible = false">取 消</el-button>
        <el-button
          :size="$store.state.size"
          type="primary"
          @click="addCollarDialogVisible = false"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import daSelectPerson from "@/components/da-select-person";
import daSelectAssets from "@/components/da-select-assets";
import organSelect from "../../sys/OrganSelect";
export default {
  data() {
    return {
      searchDate: [],
      addCollarDialogVisible: false,
      selectPersonDialogVisible: false, //选择联系人对话框状态
      addCollarForm: {},
      departments: [], //某公司下所有部门数据
      showCollarDialogVisible: false,
      selectAssetsDialogVisible: false,
      selectedCollarAssetsData: [], //已选择资产
      selectCollarAssetsData: [], //正在选择资产
      classAssetsData: [], //指定分类的资产数据
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
    handleSelectionDone() {
      this.selectAssetsDialogVisible = false; //隐藏选择资产弹窗
      //this.selectedCollarAssetsData = this.selectCollarAssetsData; //将选择的资产放入已选择资产中
    }
  },
  components: {
    daSelectPerson,
    daSelectAssets,
    organSelect
  },
  watch: {
    "addCollarForm.company_name": function(val) {
      //获取该公司下所有部门数据
      this.departments = [
        { id: 1, department_name: "研发部" },
        { id: 2, department_name: "人事部" },
        { id: 3, department_name: "财务部" }
      ];
    }
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

