<template>
<div>
    <!-- 按钮组 + 搜索栏 -->
    <el-row>
        <!-- 按钮组 -->
        <el-col :span="12">
            <el-button type="primary" :size="$store.state.size" icon="el-icon-plus" @click="addDialogVisible = true">新增</el-button>
            <!--
            <el-button :size="$store.state.size" icon="el-icon-printer">打印</el-button>
            <el-button :size="$store.state.size" icon="el-icon-daochu">导出</el-button>
            -->
        </el-col>
        <!-- 搜索栏 -->
        <el-col :span="12" :offset="0">
            <el-button :size="$store.state.size" icon="el-icon-search" style="margin-left:10px;float:right;"></el-button>
            <el-date-picker
            v-model="searchDate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :size="$store.state.size"
            style="float:right;"
            >
            </el-date-picker>  
        </el-col>
    </el-row>

    <!-- 数据表格 -->
    <el-table
    :data="maintenanceData"
    border
    style="width: 100%;margin:10px 0;" @selection-change="handleSelectionChange">
        <el-table-column fixed type="selection" width="55"></el-table-column>
        <el-table-column
        prop="modify_number"
        label="变更单号"
        width="160">
        </el-table-column>
        <el-table-column
        prop="modify_time"
        label="变更时间"
        width="120">
            <template slot-scope="scope">
                {{scope.row.modify_time|date}}
            </template>
        </el-table-column>
        <el-table-column
        prop="name"
        label="资产名称"
        width="140">
        </el-table-column>
        <el-table-column
        prop="supplier"
        label="供应商"
        width="140">
        </el-table-column>
        <el-table-column
        prop="contacts"
        label="联系人"
        width="140">
        </el-table-column>
        <el-table-column
        prop="tell"
        label="联系方式"
        width="140">
        </el-table-column>
        <el-table-column
        prop="expiry_time"
        label="维保到期时间"
        width="120">
            <template slot-scope="scope">
                {{scope.row.expiry_time|date}}
            </template>
        </el-table-column>
        <el-table-column
        prop="type_name"
        label="资产类型"
        width="160">
        </el-table-column>
        <el-table-column
        prop="personnel_name"
        label="使用人"
        width="100">
        </el-table-column>
        <el-table-column
        prop="company"
        label="使用公司"
        width="100">
        </el-table-column>
        <el-table-column
        prop="department"
        label="使用部门"
        width="100">
        </el-table-column>
        <el-table-column
        prop="manager_name"
        label="管理员"
        width="100">
        </el-table-column>
        <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope">
            <el-button @click="handleClickShow(scope.row)" type="text" :size="$store.state.size">查看</el-button>
        </template>
        </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
    background
    :page-sizes="[10, 20, 30, 50]"
    :page-size="10"
    layout="sizes, prev, pager, next"
    :total="100">
    </el-pagination>


    <!-- 新增领用 -->
    <el-dialog
    title="变更单"
    :visible.sync="addDialogVisible"
    width="70%">

        <el-form ref="form" :model="addDataForm" label-width="80px" :size="$store.state.size">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="变更单号">
                        <el-input v-model="addDataForm.modify_number" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="处理时间">
                        <el-date-picker
                        v-model="addDataForm.modify_time"
                        type="date"
                        format="yyyy 年 MM 月 dd 日"
                        value-format="timestamp"
                        style="width:100%;"
                        placeholder="选择领用日期">
                        </el-date-picker>
                    </el-form-item>
                </el-col>  
            </el-row>
        </el-form>
        <el-form ref="editform" :model="editAssetsForm" label-width="80px" :size="$store.state.size">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="资产名称">
                        <el-input v-model="editAssetsForm.name" placeholder="资产名称">
                            <el-button slot="append" type="primary" icon="el-icon-zichan" @click="selectAssetsDialogVisible=true"></el-button>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="供应商">
                        <el-input v-model="editAssetsForm.supplier" placeholder="供应商"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="联系人">
                        <el-input v-model="editAssetsForm.contacts" placeholder="联系人"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="联系方式">
                        <el-input v-model="editAssetsForm.tell" placeholder="联系方式"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="到期时间">
                        <el-date-picker
                        v-model="editAssetsForm.expiry_time"
                        type="date"
                        format="yyyy 年 MM 月 dd 日"
                        value-format="timestamp"
                        style="width:100%;"
                        placeholder="维保到期时间">
                        </el-date-picker>
                    </el-form-item>
                </el-col> 
                <el-col :span="24">
                    <el-form-item label="备注">
                        <el-input type="textarea" v-model="editAssetsForm.explain" placeholder="备注"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <!-- 选择资产弹窗 -->
        <el-dialog
        title="选择资产"
        :visible.sync="selectAssetsDialogVisible"
        width="70%" 
        append-to-body>
            <da-select-assets :handle="handleAddGetAssets"></da-select-assets>
            <span slot="footer" class="dialog-footer">
                <el-button :size="$store.state.size" @click="selectAssetsDialogVisible = false">取 消</el-button>
                <el-button :size="$store.state.size" type="primary" @click="handleSelectionDone">确 定</el-button>
            </span>
        </el-dialog>
        <span slot="footer" class="dialog-footer">
            <el-button :size="$store.state.size" @click="addDialogVisible = false">取 消</el-button>
            <el-button :size="$store.state.size" type="primary" @click="addDialogVisible = false">确 定</el-button>
        </span>
    </el-dialog>

    <el-dialog
    title="查看变更单"
    :visible.sync="showDialogVisible"
    width="70%" class="show-dialog">

        <el-form ref="form" :model="showDataForm" label-width="80px" :size="$store.state.size">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="变更单号">
                        <el-input v-model="addDataForm.modify_number" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="处理时间">
                        <el-date-picker
                        v-model="addDataForm.modify_time"
                        type="date"
                        format="yyyy 年 MM 月 dd 日"
                        value-format="timestamp"
                        style="width:100%;"
                        placeholder="选择领用日期" disabled>
                        </el-date-picker>
                    </el-form-item>
                </el-col>  
            </el-row>
        </el-form>
        <el-form ref="editform" :model="showAssetsForm" label-width="80px" :size="$store.state.size">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="资产名称">
                        <el-input v-model="editAssetsForm.name" placeholder="资产名称" disabled>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="供应商">
                        <el-input v-model="editAssetsForm.supplier" placeholder="供应商" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="联系人">
                        <el-input v-model="editAssetsForm.contacts" placeholder="联系人" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="联系方式">
                        <el-input v-model="editAssetsForm.tell" placeholder="联系方式" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="到期时间">
                        <el-date-picker
                        v-model="editAssetsForm.expiry_time"
                        type="date"
                        format="yyyy 年 MM 月 dd 日"
                        value-format="timestamp"
                        style="width:100%;"
                        placeholder="维保到期时间" disabled>
                        </el-date-picker>
                    </el-form-item>
                </el-col> 
                <el-col :span="24">
                    <el-form-item label="备注">
                        <el-input type="textarea" v-model="editAssetsForm.explain" placeholder="备注" disabled></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <el-table :data="showAssetsData" border style="width: 100%;margin:10px 0;">
            <el-table-column prop="bar_code" label="资产条码" width="140"> </el-table-column>
            <el-table-column prop="name" label="资产名称" width="150"> </el-table-column>
            <el-table-column prop="supplier" label="供应商" width="140"> </el-table-column>
            <el-table-column prop="contacts" label="联系人" width="140"> </el-table-column>
            <el-table-column prop="tell" label="联系方式" width="140"> </el-table-column>
            <el-table-column prop="expiry_time" label="维保到期时间" width="120">
                <template slot-scope="scope">
                    {{scope.row.expiry_time|date}}
                </template>
            </el-table-column>
            <el-table-column prop="type_id" label="资产类型" width="150"> </el-table-column>
            <el-table-column prop="company" label="使用公司" width="100"> </el-table-column>
            <el-table-column prop="department" label="使用部门" width="100"> </el-table-column>
            <el-table-column prop="user_id" label="使用人" width="100"> </el-table-column>
            <el-table-column prop="manager_id" label="管理员" width="100"> </el-table-column>
            <el-table-column prop="address" label="存放地点" width="100"> </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
            <el-button :size="$store.state.size" @click="showDialogVisible = false">取 消</el-button>
            <el-button :size="$store.state.size" type="primary" @click="showDialogVisible = false">确 定</el-button>
        </span>
    </el-dialog>
</div>
</template>
<script>
import daSelectPerson from "@/components/da-select-person";
import daSelectAssets from "@/components/da-select-assets";
export default {
    data:function(){
        return {
            searchDate:"",
            addDialogVisible:false,
            showDialogVisible:false,
            selectAssetsDialogVisible:false,
            selectPersonDialogVisible:false,
            selectAssetsData:[],
            addDataForm:{modify_time:Date.now()},
            editAssetsForm:{},
            showDataForm:{},
            showAssetsForm:{},
            showAssetsData:[],
            maintenanceData:[
                {
                    "modify_id":1,
                    modify_number:"WB20180608001",
                    modify_time:"1529254718034",
                    "id":1,
                    "bar_code":"0191063662278",
                    "name":"打印机",
                    "type_name":"电气设备",
                    "type_id":"02",
                    "specification":"索尼3000",
                    "sn":49090343,
                    "metering":"台",
                    "company":"光威",
                    "department":"",
                    "purchase_time":"Sat Aug 25 2018 23:25:52 GMT+0800 (中国标准时间)",
                    "personnel_name":"张三",
                    "user_id":1001,
                    "manager_id":102,
                    "manager_name":"allcky",
                    "status":0,
                    "address":"办公室北区",
                    "duration_use":"",
                    "source":"购入",
                    "supplier":"佳明",
                    "contacts":"制作",
                    "tell":"13888888888",
                    "expiry_time":1529254718034,
                    "explain":"",
                    "remarks":"",
                    "image":"http://placeholder.qiniudn.com/200x200",
                }
            ]
        }
    },
    methods:{
        //选择 发生变化
        handleSelectionChange:function(){

        },
        handleAddGetPerson:function(){ //确认选择联系人

        },
        handleSelectionDone:function(){ //确认选择
            this.selectAssetsDialogVisible = false;
        },
        handleAddGetAssets:function(){

        },
        handleClickShow:function(row){
            this.showDialogVisible = true;
        },
        handleAvatarSuccess:function(){},
        beforeAvatarUpload:function(){}
    },
    components:{
        daSelectPerson,
        daSelectAssets
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