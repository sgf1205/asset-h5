<template>
  <div>
    <el-row>
      <el-col :span="6">
                <el-input
                  placeholder="请输入资产编码"
                  v-model="searchAssetCode"
                  class="input-with-select"
                  :size="$store.state.size"
                >
                  <el-button slot="append" icon="el-icon-search" @click="load"></el-button>
                </el-input>
      </el-col>
    </el-row>
    <el-table
      :data="assetDatas"
      border
      style="width: 100%;margin-top:10px"
      height="300"
      @selection-change="handleSelectionChange"
    >
      <el-table-column fixed type="selection" width="55"></el-table-column>
      <el-table-column align="center" prop="name" label="资产名称"></el-table-column>
      <el-table-column align="center" prop="code" label="资产编码"></el-table-column>
      <el-table-column align="center" prop="classesName" label="资产类别"></el-table-column>
      <el-table-column align="center" prop="specification" label="品牌型号"></el-table-column>
      <el-table-column align="center" prop="source" label="资产来源"></el-table-column>
      <el-table-column align="center" prop="money" label="单价">
        <template slot-scope="scope">{{scope.row.money|currency}}</template>
      </el-table-column>
      <el-table-column align="center" prop="purchaseTime" label="购置时间">
        <template slot-scope="scope">{{scope.row.purchaseTime|date}}</template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      :page-sizes="[5,10, 20, 30, 50]"
      :page-size="pageSize"
      layout="sizes, prev, pager, next"
      :total="totalSize"
      :current-page="currentPage"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>
<script>
export default {
  props:["neStatus","status"],
  data() {
    return {
      selectAssetsData: [],
      assetDatas: [],
      searchAssetCode: "",
      pageSize: 10,
      currentPage: 1,
      code:'',
      totalSize: 0
    };
  },
  methods: {
    handleSelectionChange(val) {
      //选中指定分类下资产方法
      this.selectAssetsData = val;
      //this.$emit("handle", val);
    },
    handleSelectionDone() {
      //将选择的资产放入传递
      this.$emit("handle", this.selectAssetsData);
      //this.handle(this.selectAssetsData);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.load();
    },
    load() {
      let _self = this;
      let searchParam={};
      searchParam.code=this.searchAssetCode;
      searchParam.pageSize=this.pageSize;
      searchParam.currentPage=this.currentPage;
      if(this.neStatus){
        searchParam.neStatuss=this.neStatus
      }else{
        searchParam.status=0
      }
      this.$api
        .get("/asset/list",searchParam)
        .then(res => {
          if (res.code == 0 && res.data) {
            _self.assetDatas = res.data.result;
            _self.totalSize = res.data.totalSize;
          }
        });
    }
  },
  mounted() {
    this.load();
  }
};
</script>
<style lang="less">
</style>


