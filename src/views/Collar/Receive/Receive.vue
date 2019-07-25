<template>
    <div>
        <!-- 按钮组 + 搜索栏 -->
        <el-row>
            <!-- 按钮组 -->
            <el-col :span="12">
                <el-button type="primary" :size="$store.state.size" icon="el-icon-plus" @click="addCollarDialogVisible = true">新增</el-button>
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
            :data="collars"
            border
            style="width: 100%;margin:10px 0;" @selection-change="handleSelectionChange">
            <el-table-column fixed type="selection" width="55"></el-table-column>
            <el-table-column
            prop="collar_number"
            label="领用单号"
            width="160">
            </el-table-column>
            <el-table-column
            prop="collar_time"
            label="领用时间"
            width="120">
                <template slot-scope="scope">
                    {{scope.row.expect_retreat|date}}
                </template>
            </el-table-column>
            <el-table-column
            prop="personnel_name"
            label="领用人"
            width="100">
            </el-table-column>
            <el-table-column
            prop="department_name"
            label="领用部门"
            width="140">
            </el-table-column>
            <el-table-column
            prop="company_name"
            label="领用使用公司"
            >
            </el-table-column>
            <el-table-column
            prop="expect_retreat"
            label="预计退库时间"
            width="120">
                <template slot-scope="scope">
                    {{scope.row.expect_retreat|date}}
                </template>
            </el-table-column>
            <el-table-column
            fixed="right"
            label="操作"
            width="100">
            <template slot-scope="scope">
                <el-button @click="handleClickShowCollar(scope.row)" type="text" :size="$store.state.size">查看</el-button>
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
        title="领用单"
        :visible.sync="addCollarDialogVisible"
        width="70%">
            <el-form ref="form" :model="addCollarForm" label-width="80px" :size="$store.state.size">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="领用人">
                            <el-input v-model="addCollarForm.personnel_name">
                                <el-button slot="append" icon="el-icon-user-list" @click="selectPersonDialogVisible=true"></el-button>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="领用时间">
                            <el-date-picker
                            v-model="addCollarForm.collar_time"
                            type="date"
                            format="yyyy 年 MM 月 dd 日"
                            value-format="timestamp"
                            style="width:100%;"
                            placeholder="选择领用日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="预计退库">
                            <el-date-picker
                            v-model="addCollarForm.expect_retreat"
                            type="date"
                            format="yyyy 年 MM 月 dd 日"
                            value-format="timestamp"
                            style="width:100%;"
                            placeholder="选择预计退库日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="领用公司">
                            <el-select v-model="addCollarForm.company_name" placeholder="请选择领用公司" style="width:100%;">
                                <el-option :value="v.company_name" v-for="v in $store.state.companyData" :key="v.id">{{v.company_name}}</el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="领用部门">
                            <el-select v-model="addCollarForm.department_name" placeholder="请先选择公司再选部门" style="width:100%;">
                                <el-option :value="v.department_name" v-for="v in departments" :key="v.id">{{v.department_name}}</el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="存放地点">
                            <el-input v-model="addCollarForm.collar_address" placeholder="领用后存放地点"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="处理人">
                            <el-input v-model="addCollarForm.handle_name" placeholder="处理人" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="16">
                        <el-form-item label="说明">
                            <el-input type="textarea" v-model="addCollarForm.collar_remarks" placeholder="领用备注"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-button :size="$store.state.size" @click="selectAssetsDialogVisible=true">选择资产</el-button>
                    <el-button type="danger" :size="$store.state.size">删除</el-button>
                </el-row>
                <el-table :data="selectCollarAssetsData" border style="width: 100%;margin:10px 0;" @selection-change="handleSelectionChange">
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
                <el-button :size="$store.state.size" @click="addCollarDialogVisible = false">取 消</el-button>
                <el-button :size="$store.state.size" type="primary" @click="addCollarDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 查看领用 -->
        <el-dialog
        title="领用单"
        :visible.sync="showCollarDialogVisible"
        width="70%">
            <el-form ref="form" :model="showCollarForm" disabled label-width="80px" :size="$store.state.size" class="show-collar-form">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="领用人">
                            <el-input v-model="showCollarForm.personnel_name" disabled>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="领用时间">
                            <el-date-picker
                            v-model="showCollarForm.collar_time"
                            type="date"
                            format="yyyy 年 MM 月 dd 日"
                            value-format="timestamp"
                            style="width:100%;"
                            placeholder="选择领用日期" disabled>
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="预计退库">
                            <el-date-picker
                            v-model="showCollarForm.expect_retreat"
                            type="date"
                            format="yyyy 年 MM 月 dd 日"
                            value-format="timestamp"
                            style="width:100%;"
                            placeholder="选择预计退库日期" disabled>
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="领用公司">
                            <el-input v-model="showCollarForm.company_name" placeholder="请选择领用公司" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="领用部门">
                            <el-input v-model="showCollarForm.department_name" placeholder="请选择领用部门" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="存放地点">
                            <el-input v-model="showCollarForm.collar_address" disabled placeholder="领用后存放地点"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="处理人">
                            <el-input v-model="showCollarForm.handle_name" disabled placeholder="处理人"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="16">
                        <el-form-item label="说明">
                            <el-input type="textarea" v-model="showCollarForm.collar_remarks" placeholder="领用备注" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-table :data="selectCollarAssetsData" border style="width: 100%;margin:10px 0;">
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
                <el-button :size="$store.state.size" type="primary" @click="showCollarDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import daSelectPerson from "@/components/da-select-person";
import daSelectAssets from "@/components/da-select-assets";
export default {
    data(){
        return {
            searchDate:[],
            addCollarDialogVisible:false,
            selectPersonDialogVisible:false, //选择联系人对话框状态
            addCollarForm:{},
            showCollarForm:{},
            departments:[], //某公司下所有部门数据
            showCollarDialogVisible:false,
            selectAssetsDialogVisible:false,
            selectedCollarAssetsData:[], //已选择资产
            selectCollarAssetsData:[],   //正在选择资产
            classAssetsData:[], //指定分类的资产数据
            collars: [
                {
                    id:1,
                    collar_number:'LY20180618003',
                    collar_time:'1529254718034',
                    personnel_name:'张三',
                    department_name:'研发部',
                    company_name:'康达',
                    expect_retreat:'1529254718034'
                },
                {
                    id:2,
                    collar_number:'LY20180618013',
                    collar_time:'1529254718034',
                    personnel_name:'李四',
                    department_name:'研发部',
                    company_name:'康达',
                    expect_retreat:'1529254718034'
                },
                {
                    id:3,
                    collar_number:'LY20180618012',
                    collar_time:'1529254718034',
                    personnel_name:'王五',
                    department_name:'研发部',
                    company_name:'康达',
                    expect_retreat:'1529254718034'
                },
                {
                    id:4,
                    collar_number:'LY20180618009',
                    collar_time:'1529254718034',
                    personnel_name:'赵柳',
                    department_name:'研发部',
                    company_name:'康达',
                    expect_retreat:'1529254718034'
                },
            ],
        }
    },
    methods:{
        handleClickShowCollar(data){
            this.showCollarDialogVisible = true;
            this.showCollarForm = data;
        },
        handleAddGetAssets(data){ //正在选择资产
            this.selectCollarAssetsData = data;
        },
        handleAddGetPerson(row){
            this.selectPersonDialogVisible = false;
            this.addCollarForm.personnel_id = row.personnel_id;
            this.addCollarForm.personnel_name = row.personnel_name;
        },
        handleSelectionDone(){
            this.selectAssetsDialogVisible = false; //隐藏选择资产弹窗
            this.selectedCollarAssetsData = this.selectCollarAssetsData; //将选择的资产放入已选择资产中
        }
    },
    components:{
        daSelectPerson,
        daSelectAssets
    },
    watch:{
        'addCollarForm.company_name':function(val){
            //获取该公司下所有部门数据
            this.departments = [
                {id:1,department_name:"研发部"},
                {id:2,department_name:"人事部"},
                {id:3,department_name:"财务部"}
            ]
        }
    }
}
</script>
<style lang="less">
.show-collar-form .el-input input,.show-collar-form .el-textarea textarea{
    background-color: #fff!important;
    color:#333!important;
    cursor:default!important;
}
</style>

