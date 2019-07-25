<template>
    <el-row :gutter="0">
        <el-col :span="5">
            <el-tree :data="companyData" style="border:1px solid #ebeef5;height:300px;box-sizing:border-box;"  @node-click="selectHandle" node-key="id" ref="classesTree" highlight-current >
                <span slot-scope="{ node, data }">
                    <span v-if="data.company_name">{{data.company_name}}</span>
                    <span v-else>{{data.department_name}}</span>
                </span>
            </el-tree>
        </el-col>
        <!-- personnel_id
password
personnel_number
personnel_name
company_id
dep_id
department_name
email
phone -->
        <el-col :span="18" :offset="1">
            <el-table :data="persons" border style="width: 100%;" height="300" :size="$store.state.size">
                <el-table-column width="50">
                    <template slot-scope="scope" >
                        <el-button @click="handleSelectPerson(scope.row)" type="text" :size="$store.state.size">选择</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="personnel_number" label="员工工号" width="100"> </el-table-column>
                <el-table-column prop="personnel_name" label="员工姓名" width="100"> </el-table-column>
                <el-table-column prop="company_name" label="所属公司" width="150"></el-table-column>
                <el-table-column prop="department_name" label="所属部门" width="100"> </el-table-column>
                <el-table-column prop="email" label="邮箱" width="160"> </el-table-column>
                <el-table-column prop="phone" label="手机" width="140"> </el-table-column>
            </el-table>
        </el-col>
    </el-row>
</template>
<script>
export default {
    data(){
        return {
           persons:[
               {
                    personnel_id:1,
                    personnel_number:1001,
                    personnel_name:"张三",
                    company_id:1,
                    company_name:"康佳",
                    dep_id:1,
                    department_name:"研发部",
                    email:"zhangsan@qq.com",
                    phone:13800002222
               },
               {
                    personnel_id:2,
                    personnel_number:1002,
                    personnel_name:"李四",
                    company_id:1,
                    company_name:"康佳",
                    dep_id:2,
                    department_name:"人事部",
                    email:"lisi@qq.com",
                    phone:13800002233
               }
           ] 
        }
    },
    computed:{
        companyData:function(){
            return this.$store.state.companyData;
        }
    },
    props:{
        handle:{
            type:Function,
            default:function(){}
        }
    },
    methods:{
        selectHandle:function(){
            //选中 指定公司 或 指定部门 获取该部门员工 
            console.log(arguments);
        },
        handleSelectPerson:function(row){
            this.handle(row);
        },
        treeRenderFn:function(h, { node, data, store }){
            console.log(arguments)
            return <span>{data.company_name}</span>
        }
    }
}
</script>
<style lang="less">

</style>



