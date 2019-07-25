<template>
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
</template>
<script>
export default {
    data(){
        return {
            classAssetsData:[],
            selectAssetsData:[]
        }
    },
    methods:{
        handleSelectionChange(){ //选中指定分类下资产方法
            this.selectAssetsData = val;
        },
        selectClassesHandle(data){//选择资产分类
            console.log(data);
        },
        handleSelectionDone(){
            //将选择的资产放入传递
            this.handle(this.selectAssetsData);
        }
    },
    computed:{
        classesData:function(){
            return this.$store.state.classesData;
        }
    },
    props:{
        handle:{
            type:Function,
            default:function(){}
        }
    },
}
</script>
<style lang="less">

</style>


