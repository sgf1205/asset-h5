<template>
    <div>
        <da-breadcrumb></da-breadcrumb>
        <el-card class="box-card">
            <el-form ref="form" :model="addForm" label-width="280px" :rules="rules">
                <el-form-item label="原密码" prop="oldPassword">
                    <el-input v-model="addForm.oldPassword"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword">
                    <el-input type="password" v-model="addForm.newPassword"></el-input>
                </el-form-item>        
                <el-form-item label="再次输入新密码" prop="newPasswordRepeat">
                   <el-input type="password" v-model="addForm.newPasswordRepeat"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" :size="$store.state.size" @click="save" :disabled="saveBtnDisabed">保存</el-button>
                </el-form-item>
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
        var checkPwd = (rule, value, callback) => {
            if (value !== this.addForm.newPassword) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback()
            }
        };
        return{
             rules: {
                oldPassword: [{ required: true, message: "请输入", trigger: "blur" }],
                newPassword: [{ required: true, message: "请输入", trigger: "blur" }],
                newPasswordRepeat: [
                    { required: true, message: "请输入", trigger: "blur" },
                    { validator: checkPwd, message: "两次密码输入不一致", trigger: "blur" }
                ]
            },
            saveBtnDisabed:false,
            addForm:{},

        }
       
    },
    methods:{
        save() {
            let _self = this;
            this.$refs["form"].validate(valid => {
                if (valid) {
                _self.saveBtnDisabed = true;
                _self.$api
                    .post("/user/editSelfPwd", _self.addForm)
                    .then(res => {
                    if (res.code == 0) {
                        _self.$message({
                        type: "success",
                        message: "修改成功!"
                        });
                        this.addDialogVisible=false;
                        this.load();
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