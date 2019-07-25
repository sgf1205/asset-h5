<template>
<el-dialog :title="title" :visible.sync="collarDialogVisible" width="70%">
    <el-form ref="form" :model="data" label-width="80px" :size="$store.state.size">
        <el-row>
            <el-col :span="8">
                <el-form-item label="领用人">
                    <el-input v-model="data.personnel_id">
                        <el-button slot="append" icon="el-icon-user-list" v-if="type=='add'"></el-button>
                    </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="领用时间">
                    <el-date-picker
                    v-model="data.collar_time"
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
                    v-model="data.expect_retreat"
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
                    <el-select v-model="data.company_name" placeholder="请选择领用公司" style="width:100%;">
                        <el-option value="kangda">康达</el-option>
                        <el-option value="kangda">康达</el-option>
                        <el-option value="kangda">康达</el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="领用部门">
                    <el-select v-model="data.department_name" placeholder="请选择领用部门" style="width:100%;">
                        <el-option value="kangda">康达</el-option>
                        <el-option value="kangda">康达</el-option>
                        <el-option value="kangda">康达</el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="存放地点">
                    <el-input v-model="data.collar_address" placeholder="领用后存放地点"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="处理人">
                    <el-input v-model="data.handle_name" placeholder="处理人"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="16">
                <el-form-item label="说明">
                    <el-input type="textarea" v-model="data.collar_remarks" placeholder="领用备注"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row v-if="type==='add'">
            <el-button :size="$store.state.size" @click="selectCollarDialogVisible=true">选择资产</el-button>
            <el-button type="danger" :size="$store.state.size">删除</el-button>
        </el-row>
        <el-table :data="selectCollarAssetsData" border style="width: 100%;margin:10px 0;" @selection-change="handleSelectionChange">
            <el-table-column fixed type="selection" width="55"></el-table-column>
            <el-table-column prop="bar_code" label="资产条码" width="100"> </el-table-column>
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
    width="70%"
    title="选择资产"
    :visible.sync="selectDialogVisible"
    append-to-body>
        <el-row :gutter="0">
            <el-col :span="5">
                <el-tree :data="classesData" style="border:1px solid #ebeef5;height:300px;box-sizing:border-box;"  @node-click="selectClassesHandle" node-key="type_id" ref="classesTree" highlight-current></el-tree>
            </el-col>
            <el-col :span="18" :offset="1">
                <el-table :data="classAssetsData" border style="width: 100%;" height="300" @selection-change="handleSelectionChange">
                    <el-table-column fixed type="selection" width="55"></el-table-column>
                    <el-table-column prop="bar_code" label="资产条码" width="100"> </el-table-column>
                    <el-table-column prop="name" label="资产名称" width="150"> </el-table-column>
                    <el-table-column prop="type_id" label="资产类型" width="150"> </el-table-column>
                    <el-table-column prop="specification" label="规格型号" width="100"> </el-table-column>
                    <el-table-column prop="sn" label="产品序列" width="100"> </el-table-column>
                    <el-table-column prop="metering" label="计量单位" width="100"> </el-table-column>
                    <el-table-column prop="money" label="金额" width="100"> </el-table-column>
                    <el-table-column prop="company" label="使用公司" width="100"> </el-table-column>
                    <el-table-column prop="department" label="使用部门" width="100"> </el-table-column>
                    <el-table-column prop="purchase_time" label="购买时间" width="120"> </el-table-column>
                    <el-table-column prop="user_id" label="使用人" width="100"> </el-table-column>
                    <el-table-column prop="manager_id" label="管理员" width="100"> </el-table-column>
                    <el-table-column prop="address" label="存放地点" width="100"> </el-table-column>
                    <el-table-column prop="duration_use" label="使用期限" width="120"> </el-table-column>
                    <el-table-column prop="source" label="来源" width="80"> </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
            <el-button :size="$store.state.size" @click="selectDialogVisible = false">取 消</el-button>
            <el-button :size="$store.state.size" type="primary" @click="handleSelectionDone">确 定</el-button>
        </span>
    </el-dialog>
    <span slot="footer" class="dialog-footer">
        <el-button :size="$store.state.size" @click="collarDialogVisible = false">取 消</el-button>
        <el-button :size="$store.state.size" type="primary" @click="addCollarDialogVisible = false">确 定</el-button>
    </span>
</el-dialog>    
</template>
<script>
export default {
    data(){
        return {
            collarDialogVisible:false,
            selectDialogVisible:false,
            data:this.showData
        }
    },
    props:{
        title:{
            required:true,
            type:String,
            default:"提示"
        },
        showData:{
            type:[Array,Object],
            default:[]
        },
        type:{
            validator: function (value) {
                // 这个值必须匹配下列字符串中的一个
                return ['add', 'show'].indexOf(value) !== -1;
            },
            default:'add'
        },
        hidden:{
            required:false,
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