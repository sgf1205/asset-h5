<template>
    <div>
        <da-breadcrumb></da-breadcrumb>
        <el-card>
            分类使用情况
        </el-card>
        <el-table
                :data="statistics"
                border
                style="width: 100%;margin:10px 0;"
            >
                <el-table-column align="center" prop="type" label="所在部门"></el-table-column>
                <el-table-column align="center" label="资产总价值">
                     <template slot-scope="scope">{{scope.row.totalPrice|currency}}元</template>
                </el-table-column>
                <el-table-column align="center" prop="freeNum" label="空闲数量"></el-table-column>
                <el-table-column align="center" prop="usedBorrowNum" label="借用数量"></el-table-column>
                <el-table-column align="center" prop="usedReceiveNum" label="领用数量"></el-table-column>
                <el-table-column align="center" prop="maintainNum" label="维修中数量"></el-table-column>
                <el-table-column align="center" prop="scrappedNum" label="报废数量"></el-table-column>
        </el-table>
     </div>
</template>
<script>
import daBreadcrumb from "@/components/da-breadcrumb";
export default {
    components:{
        daBreadcrumb
    },
    data(){
        return{
            statistics:[]
        }
    },
    mounted(){
        this.$api.get("/asset/statistics?type=classes").then(
            res=>{
                if(res.code==0){
                    this.statistics=res.data;
                }
            }
        )
    }
}
</script>
<style lang="less">

</style>