<template>
    <div>
        <da-breadcrumb></da-breadcrumb>
        <el-card class="box-card">
            <el-form ref="form" :model="addForm" label-width="80px" >
                <el-form-item label="姓名" prop="name" :rules="[{required:true,message:'请输入姓名',trigger:'blur'}]">
                    <el-input v-model="addForm.name"  ></el-input>
                </el-form-item>
                <el-form-item label="登陆账号" >
                    <el-input v-model="addForm.account" :disabled="true"></el-input>
                </el-form-item>        
                <el-form-item label="所属机构" >
                    <el-input v-model="addForm.organName" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="角色"  >
                    <el-input v-model="addForm.roleName" :disabled="true"></el-input>
                </el-form-item>
                <el-row>
                    <el-button :size="$store.state.size" @click="save" :disabled="saveBtnDisabed">保存</el-button>
                </el-row>
            </el-form>
        </el-card>
    </div>
</template>
<script>
import daBreadcrumb from "@/components/da-breadcrumb";
export default {
    components:{
        daBreadcrumb
    },
    data:function(){
        return{
            addForm:this.$store.state.currentUser,
            saveBtnDisabed:false
        }
    },
    methods:{
        save(){
            let _self = this;
            this.$refs["form"].validate(valid => {
                if (valid) {
                _self.saveBtnDisabed = true;
                _self.$api
                    .post("/user/save", _self.addForm)
                    .then(res => {
                    if (res.code == 0) {

                        _self.$message({
                            type: "success",
                            message: "修改成功!"
                        });
                        this.addDialogVisible=false;
                        this.$store.commit("saveCurrentUser",_self.addForm);
                    } else {
                        _self.$message({
                            type: "error",
                            message: res.msg
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
}
</script>
<style lang="less">

</style>