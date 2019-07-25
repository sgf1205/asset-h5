<template>
    <div>
        <!-- 按钮组 + 搜索栏 -->
        <el-row>
            <el-col :span="12">
                <el-button type="primary" :size="$store.state.size" icon="el-icon-plus" @click="addRetiringDialogVisible = true">新增</el-button>
                <el-button :size="$store.state.size" icon="el-icon-printer">打印</el-button>
                <el-button :size="$store.state.size" icon="el-icon-daochu">导出</el-button>
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
            :data="retirings"
            border
            style="width: 100%;margin:10px 0;" @selection-change="handleSelectionChange">
            <el-table-column fixed type="selection" width="55"></el-table-column>
            <el-table-column
            prop="retiring_number"
            label="退库单号"
            width="160">
            </el-table-column>
            <el-table-column
            prop="retiring_time"
            label="退库时间"
            width="120">
                <template slot-scope="scope">
                    {{scope.row.retiring_time|date}}
                </template>
            </el-table-column>
            <el-table-column
            prop="warehouse_name"
            label="仓库名称"
            >
            </el-table-column>
            <el-table-column
            prop="company_name"
            label="退库使用公司"
            >
            </el-table-column>
            <el-table-column
            prop="handle_name"
            label="处理人"
            width="100">
            </el-table-column>
            <el-table-column
            fixed="right"
            label="操作"
            width="100">
            <template slot-scope="scope">
                <el-button @click="handleClickShowRetiring(scope.row)" type="text" :size="$store.state.size">查看</el-button>
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


        <!-- 新增退库 -->
        <el-dialog
        title="退库单"
        :visible.sync="addRetiringDialogVisible"
        width="70%">
            <el-form ref="form" :model="addRetiringForm" label-width="100px" :size="$store.state.size">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="退库处理人">
                            <el-input v-model="addRetiringForm.personnel_name" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="退库时间">
                            <el-date-picker
                            v-model="addRetiringForm.retiring_time"
                            type="date"
                            format="yyyy 年 MM 月 dd 日"
                            value-format="timestamp"
                            style="width:100%;"
                            placeholder="选择领用日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="退库使用公司">
                            <el-select v-model="addRetiringForm.company_name" placeholder="请选择公司" style="width:100%;">
                                <el-option :value="v.company_name" v-for="v in $store.state.companyData" :key="v.id">{{v.company_name}}</el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="退库仓库">
                            <el-select v-model="addRetiringForm.warehouse_name" placeholder="请先选择退库仓库" style="width:100%;">
                                <el-option :value="v.warehouse_name" v-for="v in warehouses" :key="v.warehouse_id">{{v.warehouse_name}}</el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    
                    <el-col :span="24">
                        <el-form-item label="退库说明">
                            <el-input type="textarea" v-model="addRetiringForm.retiring_remarks" placeholder="退库备注"></el-input>
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
                <el-button :size="$store.state.size" @click="addRetiringDialogVisible = false">取 消</el-button>
                <el-button :size="$store.state.size" type="primary" @click="addRetiringDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 查看退库 -->
        <el-dialog
        title="退库单"
        :visible.sync="showRetiringDialogVisible"
        width="70%">
            <el-form ref="form" :model="showRetiringForm" label-width="100px" :size="$store.state.size" class="show-collar-form">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="退库处理人">
                            <el-input v-model="showRetiringForm.personnel_name" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="退库时间">
                            <el-date-picker
                            v-model="showRetiringForm.retiring_time"
                            type="date"
                            format="yyyy 年 MM 月 dd 日"
                            value-format="timestamp"
                            style="width:100%;"
                            placeholder="选择领用日期" disabled>
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="退库使用公司">
                            <el-input v-model="showRetiringForm.company_name" placeholder="请选择公司" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="退库仓库">
                            <el-input v-model="showRetiringForm.warehouse_name" placeholder="请先选择退库仓库" disabled> </el-input>
                        </el-form-item>
                    </el-col>
                    
                    <el-col :span="24">
                        <el-form-item label="退库说明">
                            <el-input type="textarea" v-model="showRetiringForm.retiring_remarks" placeholder="退库备注" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-table :data="selectedAssetsData" border style="width: 100%;margin:10px 0;" @selection-change="handleSelectionChange">
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
 
            <span slot="footer" class="dialog-footer">
                <el-button :size="$store.state.size" @click="showRetiringDialogVisible = false">取 消</el-button>
                <el-button :size="$store.state.size" type="primary" @click="showRetiringDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import daSelectAssets from "@/components/da-select-assets";
export default {
    data(){
        return {
            searchDate:'',
            selectAssetsDialogVisible:false,
            addRetiringDialogVisible:false,
            showRetiringDialogVisible:false,
            addRetiringForm:{},
            showRetiringForm:{},
            selectedAssetsData:[], //已选择资产
            selectAssetsData:[],   //正在选择资产
            retirings: [
                {
                    retiring_id:1,
                    retiring_number:'TK20180618003',
                    retiring_time:'1529254718034',
                    handle_id:1,
                    handle_name:'张三',
                    warehouse_name:'北区仓库',
                    warehouse_id:9,
                    retiring_remarks:'资产退库，没有问题~~'
                },
                {
                    retiring_id:2,
                    retiring_number:'TK20180618003',
                    retiring_time:'1529254718034',
                    handle_id:2,
                    handle_name:'张伟',
                    warehouse_name:'北区仓库',
                    warehouse_id:9,
                    retiring_remarks:'资产退库，没有问题~~'
                },
                {
                    retiring_id:3,
                    retiring_number:'TK20180618003',
                    retiring_time:'1529254718034',
                    handle_id:3,
                    handle_name:'刘莉',
                    warehouse_name:'北区仓库',
                    warehouse_id:9,
                    retiring_remarks:'资产退库，没有问题~~'
                }
            ]
        }
    },
    computed:{
        warehouses:function(){
            return this.$store.state.warehouses;
        }
    },
    methods:{
        handleClickShowRetiring:function(data){
            this.showRetiringDialogVisible = true;
            this.showRetiringForm = data;
        },
        handleAddGetAssets(data){ //正在选择资产
            this.selectAssetsData = data;
        },
        handleSelectionDone(){
            this.selectAssetsDialogVisible = false; //隐藏选择资产弹窗
            this.selectedAssetsData = this.selectAssetsData; //将选择的资产放入已选择资产中
        }
    },
    components:{
        daSelectAssets
    },
}
</script>
<style lang="less">
.show-collar-form .el-input input,.show-collar-form .el-textarea textarea{
    background-color: #fff!important;
    color:#333!important;
    cursor:default!important;
}
</style>


