<template>
    <div>
        <da-breadcrumb></da-breadcrumb>
        <el-card class="box-card">
            <el-tabs v-model="activeTabName">
                <el-tab-pane label="基本信息变更" name="Basics"> 
                    <Basics></Basics>
                </el-tab-pane>
                <el-tab-pane label="维保信息变更" name="Maintenance"> 
                    <Maintenance></Maintenance>
                </el-tab-pane>
            </el-tabs>   
        </el-card>
    </div>
</template>
<script>
import daBreadcrumb from "@/components/da-breadcrumb";
import Basics from "./Basics";
import Maintenance from "./Maintenance";
export default {
    data(){
        return {
            activeTabName:'Basics'
        }
    },
    components:{
        daBreadcrumb,
        Basics,
        Maintenance
    }
}
</script>
<style lang="less">

</style>