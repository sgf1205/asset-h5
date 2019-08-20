<template>
  <div>
    <el-select :value="value" @change="selectChange">
      <el-option v-for="(opt ,index) in datas" :key="index" :label="opt.name" :value="opt.id"></el-option>
    </el-select>
  </div>
</template>
<script>
export default {
  name: "classes-Select",
  props: ["value"],
  data: function() {
    return {
      datas: [],
      classesId: ""
    };
  },

  methods: {
    selectChange(newVal) {
      this.$emit("input", newVal);
      this.$emit("change", newVal);
    }
  },
  mounted() {
    this.$api.get("/classes/list").then(res => {
      if (res.code == 0 && res.data) {
        this.datas = res.data;
      }
    });
  }
};
</script>