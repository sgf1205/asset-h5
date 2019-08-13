<template>
  <treeselect
    v-model="selectId"
    :multiple="false"
    :options="organs"
    placeholder="请选择"
    :normalizer="normalizer"
    @input="selectHandler"
  />
</template>
<script>
import tree from "@/libs//tree";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  name: "Organ-Select",
  components: { Treeselect },
  props: ["organId"],
  data: function() {
    return {
      organs: [],
      selectId: 0,
      styles: {
        width: "300px"
      },
      normalizer(node) {
        return {
          label: node.name
        };
      }
    };
  },

  methods: {
    load() {
      let _self = this;
      this.$api.get("/sys/organ/list").then(res => {
        if (res.code == 0 && res.data) {
          // 属性配置设置
          let attr = {
            id: "id",
            parendId: "pid",
            name: "name",
            rootId: 0
          };
          //res.data.push({ id: 0, name: "组织机构"});
          let treeData = tree.toTreeData(res.data, attr);
          _self.organs = treeData;
        }
      });
    },

    // 树点击
    selectHandler(value, vm) {
      this.$emit("changeId", value);
    }
  },
  mounted() {
    this.load();
  },
  watch: {
    organId: {
      immediate: true, // 这句重要
      handler(val) {
        this.selectId = val;
      }
    }
  }
};
</script>