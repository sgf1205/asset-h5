<template>
    <div>
        <da-breadcrumb></da-breadcrumb>
        <!--
        <el-row :gutter="20">
            <el-col :span="4">
                <top-panel title="待签字" :number="221"></top-panel>
            </el-col>
            <el-col :span="4">
                <top-panel title="待签字" :number="43"></top-panel>
            </el-col>
            <el-col :span="4">
                <top-panel title="待签字" :number="234"></top-panel>
            </el-col>
            <el-col :span="4">
                <top-panel title="待签字" :number="878"></top-panel>
            </el-col>
            <el-col :span="4">
                <top-panel title="待签字" :number="53"></top-panel>
            </el-col>
            <el-col :span="4">
                <top-panel title="待签字" :number="23"></top-panel>
            </el-col>
        </el-row>
        -->
        <el-row :gutter="20" class="num-panel">
            <el-col :span="12">
                <el-card class="box-card">
                    <div slot="header" class="header">
                        <i class="el-icon-bingtu"></i> 
                        <span>资产概况</span>
                    </div>
                    <el-row class="circle-list">
                        <el-col :span="12">
                            <h4>在用</h4>
                            <el-progress :stroke-width="14" color="#409EFF" type="circle" :percentage="assetsProfile.use" :width="160"></el-progress>
                        </el-col>
                        <el-col :span="12">
                            <h4>闲置</h4>
                            <el-progress :stroke-width="14" color="#67C23A" type="circle" :percentage="assetsProfile.unused" :width="160"></el-progress>
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card class="box-card">
                    <div slot="header" class="header">
                        <i class="el-icon-bingtu"></i> 
                        <span>资产状态占比</span>
                    </div>
                    <el-row class="circle-list" >
                        <el-col :span="24">
                            <ve-pie  height="193px" 
                            :legend="{type: 'scroll', orient: 'vertical',right: 30,top: 10,bottom: 10,data:assetsState.cloumns}"
                            :tooltip="{trigger: 'item',formatter: '{a} <br/>{b}: {c} ({d}%)'}"
                            :series="{name:'资产状态',type:'pie',radius : 70,center : ['35%', '50%'],data:assetsState.rows}"
                            :colors="chartSettings.colors"
                            ></ve-pie>
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>
        </el-row>
        <el-row class="num-panel">
            <el-col :span="24">
                <el-card class="box-card">
                    <div slot="header" class="header">
                        <i class="el-icon-bingtu"></i> 
                        <span>资产分类统计</span>
                    </div>
                    <ve-histogram 
                    :data="classCensus" 
                    :colors="chartSettings.colors"
                    :tooltip="{trigger: 'item'}"
                    
                    ></ve-histogram>
                </el-card>
            </el-col>
        </el-row>
       
        
    </div>
</template>
<script>
import daBreadcrumb from "@/components/da-breadcrumb";
import TopPanel from "./TopPanel.vue";
export default {
    data:function(){
        this.chartSettings = {
           colors: ['#67C23A','#409EFF','#F56C6C','#7465EA','#1898D1','#E6A23C']
        }
        return {
            assetsProfile:{
                use:0,
                unused:0
            },
            assetsState: {
                columns: ['闲置', '在用', '报废','维修'],
                rows: [
                    { 'name': '闲置', 'value': 0 },
                    { 'name': '在用', 'value': 0 },
                    { 'name': '维修', 'value': 0 },
                    { 'name': '报废', 'value': 0 },
                ]
            },
            classCensus: {
                columns: ['分类', '数量'],
                rows: [ ]
            }
        }
    },
    created(){
        // console.log(this)
        let _this=this;
        this.$api.get("/asset/statistics?type=classes").then(
            res=>{
                if(res.code==0){
                    res.data.forEach(
                        statistics=>{
                            
                            _this.assetsState.rows[0].value+=statistics.freeNum;
                            _this.assetsState.rows[1].value+=statistics.usedBorrowNum+statistics.usedReceiveNum;
                            _this.assetsState.rows[2].value+=statistics.maintainNum;
                            _this.assetsState.rows[3].value+=statistics.scrappedNum;
                        }
                    );
                    _this.assetsProfile.use=_this.assetsState.rows[1].value*100/(_this.assetsState.rows[0].value+_this.assetsState.rows[1].value);
                    _this.assetsProfile.unused=_this.assetsState.rows[0].value*100/(_this.assetsState.rows[0].value+_this.assetsState.rows[1].value);
                }
            }
        )
        this.$api.get("/asset/statistics?type=organ").then(
            res=>{
                if(res.code==0){
                    res.data.forEach(
                        statistics=>{
                            _this.classCensus.rows.push({'分类': statistics.type, '数量': (statistics.freeNum+statistics.usedBorrowNum+statistics.usedReceiveNum+statistics.maintainNum)});
                        }
                    );
                }
            }
        )
    },
    components:{
        daBreadcrumb,
        TopPanel
    }
}
</script>
<style lang="less">
.num-panel{
    margin:20px 0;
    .circle-list{
        text-align: center;
        h4{
            height: 30px;
        }
        .el-progress-circle{
            width: 100%;
        }
    }
    .box-card{
        .header{
            i,span{
                vertical-align: middle;
            }
            i{
                font-size: 24px;
            }
        }
    }
}
.copyright{
    font-size: 12px;
    text-align: right;
    color: #999;
}
</style>

