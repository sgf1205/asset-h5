<template>
    <el-select :value="value" @change="selectChange">
        <el-option v-for="(opt ,index) in roles" :key="index" :label="opt.name" :value="opt.id"></el-option>
    </el-select>
</template>
<script>

export default {
  name: 'Role-Select',
  props: ['value'],
  data: function() {
    return {
      roles: [{name:'系统管理员',id:1},{name:'普通管理员',id:2}],
      organId:""
    };
  },

  methods: {
    

    selectChange(newVal){
        this.$emit('input', newVal);
        this.$emit('change', newVal);
    }
  }
};
</script>