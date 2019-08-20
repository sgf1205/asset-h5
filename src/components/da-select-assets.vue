<template>
    <div>
      <el-table
        :data="assetDatas"
        border
        style="width: 100%;"
        height="300"
        @selection-change="handleSelectionChange"
      >
        <el-table-column fixed type="selection" width="55"></el-table-column>
        <el-table-column align="center" prop="status" label="资产状态" width="80">
          <template slot-scope="scope">
            <da-assets-status :status="scope.row.status"></da-assets-status>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="name" label="资产名称" ></el-table-column>
        <el-table-column prop="classesName" label="资产类型" ></el-table-column>
        <el-table-column prop="specification" label="规格型号" ></el-table-column>
        <el-table-column prop="sn" label="序列号" ></el-table-column>
        <el-table-column align="center" prop="metering" label="计量单位" ></el-table-column>
        <el-table-column prop="money" label="金额" >
          <template slot-scope="scope">{{scope.row.money|currency}}</template>
        </el-table-column>
        <el-table-column prop="purchaseTime" label="购买时间" >
          <template slot-scope="scope">{{scope.row.purchaseTime|date}}</template>
        </el-table-column>
        <el-table-column prop="registerTime" label="登记时间" >
          <template slot-scope="scope">{{scope.row.registerTime|date}}</template>
        </el-table-column>
        <el-table-column prop="registerUserName" label="登记人" ></el-table-column>
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
  data() {
    return {
      selectAssetsData: [],
      assetDatas: [],
      searchAssetName: "",
      pageSize: 10,
      currentPage: 1,

      totalSize: 0
    };
  },
  methods: {
    handleSelectionChange(val) {
      //选中指定分类下资产方法
      this.selectAssetsData = val;
      this.$emit('handle',val);
    },
    handleSelectionDone() {
      //将选择的资产放入传递
      this.handle(this.selectAssetsData);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.load();
    },
    load() {
      let _self = this;
      this.$api
        .get("/asset/list", {
          name: this.searchAssetName,
          status: 0,
          pageSize: this.pageSize,
          currentPage: this.currentPage
        })
        .then(res => {
          if (res.code == 0 && res.data) {
            _self.assetDatas = res.data.result;
            _self.totalSize = res.data.totalSize;
          }
        });
    }
  },
  mounted(){
      this.load()
  },
  computed: {
    classesData: function() {
      return this.$store.state.classesData;
    }
  },
  props: {
    handle: {
      type: Function,
      default: function() {}
    }
  }
};
</script>
<style lang="less">
</style>


