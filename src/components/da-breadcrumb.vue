<template>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: v.path }" v-for="v in lists" :key="v.path">{{v.meta.title}}</el-breadcrumb-item>
    </el-breadcrumb>
</template>
<script>
export default {
    name:"da-breadcrumb",
    data:function(){
        return {
            lists:[],
        }
    },
    created(){
        this.getBreadcrumb();
    },
    methods:{
        getBreadcrumb(){
            this.lists = this.$route.matched;
        }
    }
}
</script>
<style lang="less">
.el-breadcrumb{
    display: block;
    height: 50px;
    line-height: 50px;
}
</style>

