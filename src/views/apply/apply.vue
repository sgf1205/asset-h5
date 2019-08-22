<template>
    <div>
        <da-breadcrumb></da-breadcrumb>
        <el-card>
            <el-tabs v-model="activeTabName">
                <el-tab-pane label="领用" name="collar"> 
                    <Receive></Receive>
                </el-tab-pane>
                <!--
                <el-tab-pane label="退库" name="retiring">
                    <Retiring></Retiring>
                </el-tab-pane>
                -->
            </el-tabs>
        </el-card>
    </div>
</template>
<script>
import daBreadcrumb from "@/components/da-breadcrumb";
import Receive from "./Receive/Receive";
import Retiring from "./Retiring/Retiring";
export default {
    data:function(){
        return {
            activeTabName:'collar', 
        }
    },
    
    components:{
        daBreadcrumb,
        Receive,
        Retiring
    }
}
</script>
<style lang="less">

</style>