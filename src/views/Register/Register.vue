<template>
    <div>
        <da-breadcrumb></da-breadcrumb>
        <el-card class="box-card">
            <el-tabs v-model="activeName">
                <el-tab-pane label="资产登记" name="register">
                    <el-row>
                        <el-col :span="18">
                            <el-button type="primary" :size="$store.state.size" @click="addDialogTableVisible=true" icon="el-icon-plus">新增</el-button>
                            <el-button type="danger" :size="$store.state.size" @click="delRegister" icon="el-icon-delete">删除</el-button>
                            <!--
                            <el-dropdown split-button type="primary" :size="$store.state.size" style="margin-left:10px;">
                                <i class="el-icon-daochu"></i> 导入/导出
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item>下载导入模板</el-dropdown-item>
                                    <el-dropdown-item>批量导入资产</el-dropdown-item>
                                    <el-dropdown-item divided>导出资产</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                            <el-dropdown split-button type="primary" :size="$store.state.size" style="margin-left:10px;">
                                <i class="el-icon-printer"></i> 打印
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item>打印资产标签</el-dropdown-item>
                                    <el-dropdown-item divided>打印资产卡片</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                            -->
                        </el-col>
                        <el-col :span="6">
                            <el-input placeholder="请输入搜索内容" v-model="searchKey" class="input-with-select" :size="$store.state.size">
                                <el-button slot="append" icon="el-icon-search"></el-button>
                            </el-input>
                        </el-col>
                    </el-row>
                    <el-table :data="registerData" border style="width: 100%;margin:10px 0;" @selection-change="handleSelectionChange">
                        <el-table-column align="center" fixed type="selection" width="55"></el-table-column>
                        <el-table-column align="center" prop="status" label="资产状态" width="80">
                            <template slot-scope="scope">
                                <da-assets-status :status="scope.row.status"></da-assets-status>
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" label="资产名称" width="150"> </el-table-column>
                        <el-table-column prop="classesName" label="资产类型" width="150"> </el-table-column>
                        <el-table-column prop="specification" label="规格型号" width="100"> </el-table-column>
                        <el-table-column prop="sn" label="序列号" width="100"> </el-table-column>
                        <el-table-column align="center" prop="metering" label="计量单位" width="80"> </el-table-column>
                        <el-table-column prop="money" label="金额" width="100">
                            <template slot-scope="scope">
                                {{scope.row.money|currency}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="purchaseTime" label="购买时间" width="120">
                            <template slot-scope="scope">
                                {{scope.row.purchaseTime|date}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="registerTime" label="登记时间" width="120">
                            <template slot-scope="scope">
                                {{scope.row.registerTime|date}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="registerUserName" label="登记人" width="120"></el-table-column>
                        <el-table-column fixed="right" label="操作" width="100">
                            <template slot-scope="scope">
                                <el-button @click="showRegister(scope.row)" type="text" :size="$store.state.size">查看</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                    background
                    :page-sizes="[10, 20, 30, 50]"
                    :page-size="10"
                    layout="sizes, prev, pager, next"
                    :total="100">
                    </el-pagination>
                </el-tab-pane>
            </el-tabs>
        </el-card>

        <!-- 资产登记 弹窗 -->
        <el-dialog title="资产登记" width="70%" :visible.sync="addDialogTableVisible">
            <el-form ref="addform" :model="addRegisterData" label-width="80px" >
                <el-tabs tab-position="left">
                    <el-tab-pane label="基本信息">
                        <el-row>
                            <el-col v-if="showModel" :span="8" align="center">
                                <vue-qr 
                                    :size="150"
                                    :margin="0"
                                    :auto-color="true"
                                    :dot-scale="1"
                                    :text="addRegisterData.code" />
                            </el-col>
                            
                            <el-col :span="8">
                                <el-form-item label="资产名称">
                                    <el-input v-model="addRegisterData.name" placeholder="资产名称"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="资产类型">
                                    <classes-select v-model="addRegisterData.classesId"></classes-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="规格型号">
                                    <el-input v-model="addRegisterData.specification" placeholder="规格型号"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="SN号">
                                    <el-input v-model="addRegisterData.sn" placeholder="SN号"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="计量单位">
                                    <el-input v-model="addRegisterData.metering" placeholder="计量单位"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="金额">
                                    <el-input v-model="addRegisterData.money" placeholder="金额"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="购买时间">
                                    <el-date-picker
                                    v-model="addRegisterData.purchaseTime"
                                    type="date"
                                    style="width:100%;"
                                    placeholder="购买时间">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                           
                            <el-col :span="16">
                                <el-form-item label="备注">
                                    <el-input type="textarea" v-model="addRegisterData.remark" placeholder="备注"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-tab-pane>
                    <el-tab-pane label="维保信息">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="供应商">
                                    <el-input v-model="addRegisterData.supplier" placeholder="供应商名称"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="联系人">
                                    <el-input v-model="addRegisterData.contacts" placeholder="联系人"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="联系方式">
                                    <el-input v-model="addRegisterData.tell" placeholder="联系方式"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="维保到期">
                                    <el-date-picker
                                    v-model="addRegisterData.expiryTime"
                                    type="date"
                                    style="width:100%;"
                                    placeholder="维保到期时间">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>

                            <el-col :span="24">
                                <el-form-item label="维保说明">
                                    <el-input type="textarea" v-model="addRegisterData.explain" placeholder="维保说明"></el-input>
                                </el-form-item>
                            </el-col>

                        </el-row>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button v-if="!showModel" type="primary" @click="addRegister">确 定</el-button>
                <el-button @click="addDialogTableVisible = false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import VueQr from 'vue-qr';
import daBreadcrumb from "@/components/da-breadcrumb";
import daAssetsStatus from "@/components/da-assets-status";
import classesSelect from "../Classes/classesSelect"
export default {
    components: {
        'classes-select':classesSelect,
        daBreadcrumb,
        daAssetsStatus,
        VueQr
    },
    data(){
        return {
            activeName:'register',
            searchKey:'',
            addDialogTableVisible:false,
            editDialogTableVisible:false,
            showModel:false,
            addRegisterData:{},
            delRegisterIds:[],
            registerData: []
        }
    },
    methods:{
        addRegister(){
            //addRegisterData 要添加的资产数据
            
            if(true){
                let _self=this;
                this.addDialogTableVisible = false;
                this.$api.post("/asset/save",_self.addRegisterData).then((res)=>{
                    _self.addRegisterData = {};
                    _self.$message({
                        type: 'success',
                        message: '添加成功!'
                    });       
                    _self.addDialogTableVisible=false;
                    _self.load();  
                })
            }else{
                this.$message({
                    type: 'warning',
                    message: '添加失败!'
                });
            }
        },
        showRegister(row){
            this.showModel = true;
            this.addRegisterData = row;
            this.addDialogTableVisible=true;
        },
        delRegister(){
            let _self=this;
            if(this.delRegisterIds.length==0){
                this.$message('请选中要删除的数据条目！');
                return;
            }
            this.$confirm('此操作将永久删除该数据, 是否继续?', '资产删除确认提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                //要删除的ID数组 this.delRegisterIds
                _self.$api.post("/asset/delete",{ids:_self.delRegisterIds}).then(
                    res =>{
                        if(res.code==0){
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            _self.load();
                        }else{
                            this.$message({
                                type: 'warning',
                                message: res.msg
                            });
                        }
                    }

                )   
            }).catch((error) => {
                console.log(error)
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        handleSelectionChange(val){
            //获取选中的删除条目ID
            //console.log(val)
            this.delRegisterIds = val.map((val)=>{
                return val.id
            })
        },
        load() {
            let _self=this;
            this.$api.get("/asset/list").then(res=>{
                if(res.code==0 && res.data){
                    _self.registerData=res.data;
                }
            })
        }
    },
    mounted(){
        this.load()
    }
}
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
        border-color: #409EFF;
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
    .el-input input,.el-textarea textarea{
        background-color: #fff!important; 
        color: #606266!important;
        cursor: default!important;
    }
}
</style>

