<template>
  <div>
    <da-breadcrumb></da-breadcrumb>
    <el-row :gutter="10">
      <el-col :span="24">
        <el-card class="box-card">
          <!-- 按钮组 + 搜索栏 -->
          <el-row>
            <!-- 按钮组 -->
            <el-col :span="12">
              <el-button
                type="primary"
                :size="$store.state.size"
                icon="el-icon-plus"
                @click="addForm={};saveBtnDisabed=false;addDialogVisible=true;dialogTitle='新增分类'"
              >新增分类</el-button>
            </el-col>
          </el-row>

          <!-- 数据表格 -->
          <el-table :data="datas" border style="width: 100%;margin:10px 0;">
            <el-table-column align="center" prop="name" label="分类名称"></el-table-column>
            <el-table-column align="center" prop="code" label="分类编码"></el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button @click="del(scope.row)" type="text" :size="$store.state.size">删除</el-button>
                <el-button type="text" :size="$store.state.size" @click="edit(scope.row)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <!-- 新增用户 -->
    <el-dialog :title="dialogTitle" :visible.sync="addDialogVisible" width="40%">
      <el-form ref="form" :model="addForm" label-width="80px" :rules="rules">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="分类编码" prop="code">
          <el-input v-model="addForm.code"></el-input>
        </el-form-item>
        <el-row>
          <el-button :size="$store.state.size" @click="save" :disabled="saveBtnDisabed">保存</el-button>
          <el-button
            type="danger"
            :size="$store.state.size"
            @click="addDialogVisible=false;addForm={}"
          >取消</el-button>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import daBreadcrumb from "@/components/da-breadcrumb";
export default {
  components: {
    daBreadcrumb
  },
  data: function() {
    return {
      rules: {
        name: [{ required: true, message: "请输入", trigger: "blur" }],
        code: [{ required: true, message: "请输入", trigger: "blur" }]
      },
      addDialogVisible: false,
      saveBtnDisabed: false,
      addForm: {},
      datas: [],
      dialogTitle:"新增资产分类"
    };
  },

  methods: {
    
    load() {
        let _self=this;
        this.$api.get("/classes/list").then(res=>{
            if(res.code==0 && res.data){
                _self.datas=res.data;
            }
        })
    },
    save() {
      let _self = this;
      this.$refs["form"].validate(valid => {
        if (valid) {
          _self.saveBtnDisabed = true;
          _self.$api
            .post("/classes/save", _self.addForm)
            .then(res => {
              if (res.code == 0) {
                _self.$message({
                  type: "success",
                  message: "添加成功!"
                });
                this.addDialogVisible=false;
                this.load();
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
    },
    del(row){
      this.$confirm('此操作将永久删除该数据, 是否继续?', '删除确认提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                //要删除的ID
                this.$api.post("/classes/delete",{id:row.id}).then(res=>{
                    if(res.code==0){
                      this.$message({
                        type: 'success',
                        message: '删除成功!'
                      });
                      this.load();
                    }
                })
            });
    },
    edit(row){
      this.dialogTitle='修改资产分类';
      this.addForm=row;
      this.addDialogVisible=true;
      this.saveBtnDisabed=false;
    }
  },
  created() {
      this.load();
  }
};
</script>
