<template>
    <div class="top-panel">
        <div class="title">{{title}}</div>
        <div class="number">{{number}}</div>
    </div>
</template>
<script>
export default {
    props:{
        title:{
            type:String,
            required:true
        },
        number:{
            type:Number,
            required:0
        }
    }
}
</script>
<style lang="less">
.top-panel{
    background:#409EFF url(./images/well-overlay.png) center bottom/auto no-repeat;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    border-radius: 4px;
    padding:10px 20px;
    color: #fff;
    display: flex;
    flex-direction: column;
    
    .title{
        font-size: 12px;
        line-height: 30px;
    }
    .number{
        font-size: 24px;
        height: 40px;
        line-height: 50px;
    }
}
</style>

