<template>
  <div>
    <da-breadcrumb></da-breadcrumb>
    <el-card class="box-card">
      <!-- 按钮组 + 搜索栏 -->
      <el-row>
        <!-- 按钮组 -->
        <el-col :span="12">
          <el-button
            type="primary"
            :size="$store.state.size"
            icon="el-icon-plus"
            @click="addOrganForm={};saveBtnDisabed=false;addDialogVisible=true"
          >新增机构</el-button>
          <el-button
            type="primary"
            :size="$store.state.size"
            @click="search"
          >查询</el-button>
        </el-col>
      
      </el-row>

      <!-- 数据表格 -->
      <el-table :data="organs" border style="width: 100%;margin:10px 0;">
        <el-table-column align="center" prop="name" label="名称" ></el-table-column>
        <el-table-column align="center" prop="code" label="编码" >
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增维修单 -->
    <el-dialog title="新增机构" :visible.sync="addDialogVisible" width="40%">
      <el-form ref="form" :model="addOrganForm" label-width="80px" :rules="rules">
        <el-form-item label="机构名称" prop="name">
          <el-input v-model="addOrganForm.name"></el-input>
        </el-form-item>
        <el-form-item label="机构编码">
          <el-input v-model="addOrganForm.code"></el-input>
        </el-form-item>
        <el-row>
          <el-button :size="$store.state.size" @click="saveOrgan" :disabled="saveBtnDisabed">新增</el-button>
          <el-button type="danger" :size="$store.state.size" @click="addDialogVisible=false">取消</el-button>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data: function() {
    return {
      rules: {
        name: [{ required: true, message: "请输入", trigger: "blur" }]
      },
      searchDate: "",
      addDialogVisible: false,
      editDialogVisible: false,
      showDialogVisible: false,
      selectAssetsDialogVisible: false,
      selectPersonDialogVisible: false,
      saveBtnDisabed: false,
      addOrganForm: {},
      organs: []
    };
  },

  methods: {
    search(row) {
        this.$api.get("/sys/organ/list").then(res=>{
            if(res.data.code==0){
                this.organs=res.data.data;
            }
        })
    },
    saveOrgan() {
      let _self = this;
      this.$refs["form"].validate(valid => {
        if (valid) {
          _self.saveBtnDisabed = true;
          _self.$api
            .post("/sys/organ/save", _self.addOrganForm)
            .then(res => {
              if (res.data.code == 0) {
                _self.$message({
                  type: "success",
                  message: "添加成功!"
                });
              } else {
                _self.$message({
                  type: "error",
                  message: "添加失败!"
                });
                _self.saveBtnDisabed = false;
              }
            })
            .catch(err => {
              _self.saveBtnDisabed = false;
              throw new Error("请求报错");
            });
        }
      });
    }
  }
};
</script>
<style lang="less">
.show-dialog {
  .el-input input,
  .el-textarea textarea {
    background-color: #fff !important;
    color: #606266 !important;
    cursor: default !important;
  }
}
</style>