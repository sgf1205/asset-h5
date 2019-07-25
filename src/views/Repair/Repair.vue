<template>
    <div>
        <da-breadcrumb></da-breadcrumb>
        <el-card class="box-card">
            <!-- 按钮组 + 搜索栏 -->
            <el-row>
                <!-- 按钮组 -->
                <el-col :span="12">
                    <el-button type="primary" :size="$store.state.size" icon="el-icon-plus" @click="addRepair">新增</el-button>
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
            :data="repairs"
            border
            style="width: 100%;margin:10px 0;" @selection-change="handleSelectionChange">
                <el-table-column fixed type="selection" width="55"></el-table-column>
                <el-table-column align="center" prop="status" label="状态" width="100">
                        <template slot-scope="scope">
                            <da-assets-status :status="scope.row.status"></da-assets-status>
                        </template>
                    </el-table-column>
                <el-table-column
                prop="repair_number"
                label="维修单号"
                >
                </el-table-column>
                <el-table-column
                prop="repair_time"
                label="报修时间"
                >
                    <template slot-scope="scope">
                        {{scope.row.repair_time|date}}
                    </template>
                </el-table-column>
                <el-table-column
                prop="report_repair_name"
                label="报修人"
                >
                </el-table-column>
                <el-table-column
                prop="repair_handle_name"
                label="维修人"
                >
                </el-table-column>
                <el-table-column
                prop="cost"
                label="维修花费"
                >
                    <template slot-scope="scope">
                        {{scope.row.cost|currency}}
                    </template>
                </el-table-column>                
                <el-table-column
                fixed="right"
                label="操作"
                width="100">
                <template slot-scope="scope">
                    <el-button @click="showRepair(scope.row)" type="text" :size="$store.state.size">查看</el-button>
                    <el-button type="text" :size="$store.state.size" @click="editRepair(scope.row)">编辑</el-button>
                </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <el-pagination
            background
            :page-sizes="$store.state.pageSize"
            :page-size="$store.state.pageSize[0]"
            layout="sizes, prev, pager, next"
            :total="100">
            </el-pagination>
        </el-card>

        <!-- 新增维修单 -->
        <el-dialog
        title="新增维修单"
        :visible.sync="addDialogVisible"
        width="70%">
            <el-steps :active="addDataForm.status-10" style="margin:0 20px 20px;">
                <el-step title="报修"></el-step>
                <el-step title="已接单"></el-step>
                <el-step title="维修中"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <el-form ref="form" :model="addDataForm" label-width="80px" :size="$store.state.size">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="维修单号">
                            <el-input v-model="addDataForm.repair_number" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="报修时间">
                            <el-date-picker
                            v-model="addDataForm.report_time"
                            type="date"
                            format="yyyy 年 MM 月 dd 日"
                            value-format="timestamp"
                            style="width:100%;"
                            placeholder="选择报修时间">
                            </el-date-picker>
                        </el-form-item>
                    </el-col> 
                    <el-col :span="8">
                        <el-form-item label="报修人">
                            <el-input v-model="addDataForm.repair_handle_name">
                                <el-button slot="append" icon="el-icon-user-list" @click="selectPersonDialogVisible=true"></el-button>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    
                    <el-col :span="24">
                        <el-form-item label="说明">
                            <el-input type="textarea" v-model="addDataForm.repair_content" placeholder="报修说明"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-button :size="$store.state.size" @click="selectAssetsDialogVisible=true">选择资产</el-button>
                    <el-button type="danger" :size="$store.state.size">删除</el-button>
                </el-row>
                <el-table :data="selectAssetsData" border style="width: 100%;margin:10px 0;" @selection-change="handleSelectionChange">
                    <el-table-column fixed type="selection" width="55"></el-table-column>
                    <el-table-column prop="bar_code" label="资产条码" width="140"> </el-table-column>
                    <el-table-column prop="name" label="资产名称" width="150"> </el-table-column>
                    <el-table-column prop="type_id" label="资产类型" width="150"> </el-table-column>
                    <el-table-column prop="company" label="使用公司" width="100"> </el-table-column>
                    <el-table-column prop="department" label="使用部门" width="100"> </el-table-column>
                    <el-table-column prop="user_id" label="使用人" width="100"> </el-table-column>
                    <el-table-column prop="manager_id" label="管理员" width="100"> </el-table-column>
                    <el-table-column prop="address" label="存放地点" width="100"> </el-table-column>
                </el-table>
            </el-form>
            <!-- 选择领用人 -->
            <el-dialog
            title="选择用户"
            :visible.sync="selectPersonDialogVisible"
            width="70%" 
            append-to-body>
                <daSelectPerson :handle="handleAddGetPerson"></daSelectPerson>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="selectPersonDialogVisible = false">取 消</el-button>
                </span>
            </el-dialog>
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
                <el-button :size="$store.state.size" type="primary" @click="addRepairDone">确 定</el-button>
            </span>
        </el-dialog>

         <!-- 编辑维修单 -->
        <el-dialog
        title="编辑维修单"
        :visible.sync="editDialogVisible"
        width="70%">
            <el-form ref="form" :model="editDataForm" label-width="80px" :size="$store.state.size" :disabled="editDataForm.status == 9">
                <el-steps :active="editDataForm.status-9" style="margin:0 20px 20px;" :finish-status="editDataForm.status|repairStatus" >
                    <el-step title="报修"></el-step>
                    <el-step title="已接单"></el-step>
                    <el-step title="维修中"></el-step>
                    <el-step v-if="editDataForm.status==13" title="维修成功"></el-step>
                    <el-step v-else-if="editDataForm.status==14" title="维修失败"></el-step>
                    <el-step v-else title="维修结果"></el-step>
                </el-steps>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="维修单号">
                            <el-input v-model="editDataForm.repair_number" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="报修时间">
                            <el-date-picker
                            v-model="editDataForm.repair_time"
                            type="date"
                            format="yyyy 年 MM 月 dd 日"
                            value-format="timestamp"
                            style="width:100%;"
                            placeholder="报修时间" disabled>
                            </el-date-picker>
                        </el-form-item>
                    </el-col> 
                    <el-col :span="8">
                        <el-form-item label="报修人">
                            <el-input v-model="editDataForm.report_repair_name" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="维修状态">
                            <el-select v-model="editDataForm.status" placeholder="维修状态" style="width:100%;">
                                <el-option 
                                :value="v.s" 
                                v-for="v in repairStatus" 
                                :key="v.s">{{v.m}}</el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="维修人">
                            <el-input v-model="editDataForm.repair_handle_name">
                                <el-button slot="append" icon="el-icon-user-list" @click="selectPersonDialogVisible=true" placeholder="选择维修人"></el-button>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="维修时间">
                            <el-date-picker
                            v-model="editDataForm.repair_time"
                            type="date"
                            format="yyyy 年 MM 月 dd 日"
                            value-format="timestamp"
                            style="width:100%;"
                            placeholder="选择维修时间">
                            </el-date-picker>
                        </el-form-item>
                    </el-col> 
                    <el-col :span="24">
                        <el-form-item label="报修说明">
                            <el-input type="textarea" v-model="editDataForm.repair_content" placeholder="报修说明" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="16">
                        <el-form-item label="维修说明">
                            <el-input type="textarea" v-model="editDataForm.repair_remarks" placeholder="维修说明"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="维修花费">
                            <el-input v-model="editDataForm.cost"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-table :data="selectAssetsData" border style="width: 100%;margin:10px 0;">
                    <el-table-column prop="bar_code" label="资产条码" width="140"> </el-table-column>
                    <el-table-column prop="name" label="资产名称" width="150"> </el-table-column>
                    <el-table-column prop="type_id" label="资产类型" width="150"> </el-table-column>
                    <el-table-column prop="company" label="使用公司" width="100"> </el-table-column>
                    <el-table-column prop="department" label="使用部门" width="100"> </el-table-column>
                    <el-table-column prop="user_id" label="使用人" width="100"> </el-table-column>
                    <el-table-column prop="manager_id" label="管理员" width="100"> </el-table-column>
                    <el-table-column prop="address" label="存放地点" width="100"> </el-table-column>
                </el-table>
            </el-form>
            <!-- 选择领用人 -->
            <el-dialog
            title="选择用户"
            :visible.sync="selectPersonDialogVisible"
            width="70%" 
            append-to-body>
                <daSelectPerson :handle="handleAddGetPerson"></daSelectPerson>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="selectPersonDialogVisible = false">取 消</el-button>
                </span>
            </el-dialog>
            <span slot="footer" class="dialog-footer">
                <el-button :size="$store.state.size" @click="editDialogVisible = false">取 消</el-button>
                <el-button :size="$store.state.size" type="primary" @click="editRepairDone">确 定</el-button>
            </span>
        </el-dialog>

         <!-- 查看维修单 -->
        <el-dialog
        title="查看维修单"
        :visible.sync="showDialogVisible"
        width="70%" class="show-dialog">
            <el-form ref="form" :model="showDataForm" label-width="80px" :size="$store.state.size" disabled>
                <el-steps :active="showDataForm.status-9" style="margin:0 20px 20px;" :finish-status="showDataForm.status|repairStatus" >
                    <el-step title="报修"></el-step>
                    <el-step title="已接单"></el-step>
                    <el-step title="维修中"></el-step>
                    <el-step v-if="showDataForm.status==13" title="维修成功"></el-step>
                    <el-step v-else-if="showDataForm.status==14" title="维修失败"></el-step>
                    <el-step v-else title="维修结果"></el-step>
                </el-steps>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="维修单号">
                            <el-input v-model="showDataForm.repair_number" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="报修时间">
                            <el-date-picker
                            v-model="showDataForm.repair_time"
                            type="date"
                            format="yyyy 年 MM 月 dd 日"
                            value-format="timestamp"
                            style="width:100%;"
                            placeholder="报修时间" disabled>
                            </el-date-picker>
                        </el-form-item>
                    </el-col> 
                    <el-col :span="8">
                        <el-form-item label="报修人">
                            <el-input v-model="showDataForm.report_repair_name" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="维修状态">
                            <el-input :value="showDataForm.status|repairStatus('label')" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="维修人">
                            <el-input v-model="showDataForm.repair_handle_name">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="维修时间">
                            <el-date-picker
                            v-model="showDataForm.repair_time"
                            type="date"
                            format="yyyy 年 MM 月 dd 日"
                            value-format="timestamp"
                            style="width:100%;"
                            placeholder="选择维修时间">
                            </el-date-picker>
                        </el-form-item>
                    </el-col> 
                    <el-col :span="24">
                        <el-form-item label="报修说明">
                            <el-input type="textarea" v-model="showDataForm.repair_content" placeholder="报修说明" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="16">
                        <el-form-item label="维修说明">
                            <el-input type="textarea" v-model="showDataForm.repair_remarks" placeholder="维修说明"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="维修花费">
                            <el-input v-model="showDataForm.cost"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-table :data="showAssetsData" border style="width: 100%;margin:10px 0;">
                    <el-table-column prop="bar_code" label="资产条码" width="140"> </el-table-column>
                    <el-table-column prop="name" label="资产名称" width="150"> </el-table-column>
                    <el-table-column prop="type_id" label="资产类型" width="150"> </el-table-column>
                    <el-table-column prop="company" label="使用公司" width="100"> </el-table-column>
                    <el-table-column prop="department" label="使用部门" width="100"> </el-table-column>
                    <el-table-column prop="user_id" label="使用人" width="100"> </el-table-column>
                    <el-table-column prop="manager_id" label="管理员" width="100"> </el-table-column>
                    <el-table-column prop="address" label="存放地点" width="100"> </el-table-column>
                </el-table>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button :size="$store.state.size" @click="showDialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import daBreadcrumb from "@/components/da-breadcrumb";
import daSelectPerson from "@/components/da-select-person";
import daSelectAssets from "@/components/da-select-assets";
import daAssetsStatus from "@/components/da-assets-status";
export default {
    data:function(){
        return {
            searchDate:'',
            addDialogVisible:false,
            editDialogVisible:false,
            showDialogVisible:false,
            selectAssetsDialogVisible:false,
            selectPersonDialogVisible:false,
            repairs:[
                {
                    "repair_number":"WX20180608001",
                    "report_time":"1529254718034",
                    "repair_handle_id":1,
                    "repair_handle_name":"张三",
                    "report_repair_id":3,
                    "report_repair_name":"李四",
                    "cost":98,
                    status:9,
                    "repair_time":"1529254718034",
                    repair_content:"不能打字",
                    repair_remarks:"更换墨盒",
                    asset_id:[11,23,43]
                },
                {
                    "repair_number":"WX20180608001",
                    "report_time":"1529254718034",
                    "repair_handle_id":1,
                    "repair_handle_name":"张三",
                    "report_repair_id":3,
                    "report_repair_name":"李四",
                    "cost":98,
                    status:10,
                    "repair_time":"1529254718034",
                    repair_content:"不能打字",
                    repair_remarks:"更换墨盒",
                    asset_id:[11,23,43]
                },
                {
                    "repair_number":"WX20180623001",
                    "report_time":"1529254718034",
                    "repair_handle_id":1,
                    "repair_handle_name":"王五",
                    "report_repair_id":3,
                    "report_repair_name":"李四",
                    "cost":98,
                    status:11,
                    "repair_time":"1529254718034",
                    repair_content:"不能打字",
                    repair_remarks:"更换墨盒",
                    asset_id:[11,23,43]
                },
                {
                    "repair_number":"WX20180623004",
                    "report_time":"1529254718034",
                    "repair_handle_id":1,
                    "repair_handle_name":"王五",
                    "report_repair_id":3,
                    "report_repair_name":"李四",
                    "cost":98,
                    status:14,
                    "repair_time":"1529254718034",
                    repair_content:"不能打字",
                    repair_remarks:"更换墨盒",
                    asset_id:[11,23,43]
                }
            ],
            repairStatus:[
                {s:9,m:"已取消",status:'error'},
                {s:10,m:"已报修",status:'process'},
                {s:11,m:"已接单",status:'process'},
                {s:12,m:"维修中",status:'process'},
                {s:13,m:"维修成功",status:'error'},
                {s:14,m:"维修失败",status:'success'},
            ],
            addDataForm:{},
            editDataForm:{},
            showDataForm:{},
            showAssetsData:[],  //查看资产列表
            selectAssetsData:[],//正在选择资产
            selectedAssetsData:[], //确认选择资产
        }
    },
    methods:{
        showRepair(row){
            this.showDataForm = row;
            this.showDialogVisible = true;
            //ajax 获取 该条目的资产数据列表
            this.showAssetsData = [];
        },
        addRepair(){
            this.addDialogVisible = true;
            this.addDataForm = {
                status:10,
                report_time:Date.now()
            }
        },
        addRepairDone:function(){
            //确认添加维修单
            this.addDialogVisible = false;

            //过滤出 维修资产ID this.selectedAssetsData
            this.addDataForm.asset_id = this.selectedAssetsData.map(function(v){
               return v.id;
            })
            /*
                ajax 发送维修单数据 this.addDataForm
            */
           
        },
        editRepair(row){ //要编辑的维修单
            this.editDialogVisible = true;
            this.editDataForm = JSON.parse(JSON.stringify(row));
        },
        editRepairDone(){
            this.editDialogVisible = false;
            //确定 修改   ajax发送 this.editDataForm
        },
        handleAddGetPerson(row){
            this.selectPersonDialogVisible = false;
            this.addDataForm.report_repair_id = row.personnel_id;
            this.addDataForm.report_repair_name = row.personnel_name;
        },
        handleSelectionChange:function(){
            //获取指定资产 对已选择资产中 进行删除
        },

        handleAddGetAssets(data){ //正在选择资产
            this.selectAssetsData = data;
        },
        handleSelectionDone:function(){
            this.selectAssetsDialogVisible = false; //隐藏选择资产弹窗
            this.selectedAssetsData = this.selectAssetsData; //将选择的资产放入已选择资产中
        }
    },
    components:{
        daBreadcrumb,
        daSelectPerson,
        daSelectAssets,
        daAssetsStatus
    },
    filters:{
        repairStatus:function(val=10,type="status"){
            console.log(val);
            let s = {
                9:{label:"已取消",color:"#E6A23C",status:'error'},
                10:{label:"已报修",color:"#409EFF",status:'finish'},
                11:{label:"已接单",color:"#1898D1",status:'finish'},
                12:{label:"维修中",color:"#67C23A",status:'finish'},
                13:{label:"维修成功",color:"#67C23A",status:'success'},
                14:{label:"维修失败",color:"#F56C6C",status:'error'}
            };
            return s[val][type];
        }
    }
}
</script>
<style lang="less">
.show-dialog {
    .el-input input,.el-textarea textarea{
        background-color: #fff!important; 
        color: #606266!important;
        cursor: default!important;
    }
}
</style>