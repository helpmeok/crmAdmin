<template>
  <el-form :model="form" :rules="rules" ref="elFormRef"
           v-bind="{inline: true, 'label-width': labelWidth, 'label-position': 'right', 'scroll-to-error':true,'label-suffix':labelSuffix, ...$attrs}"
           style="width:100%;">
    <el-row :gutter="0">
      <el-col :span="8">
        <el-form-item class="base-form-item" label="省" prop="province">
          <div class="base-form-item-input">
            <el-select v-model="form.province" clearable filterable placeholder="请选择" @change="provinceChange">
              <el-option v-for="province in provinceList" :key="province.code" :label="province.name" :value="province.code">
              </el-option>
            </el-select>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item class="base-form-item" label="市" prop="city">
          <div class="base-form-item-input">
            <el-select v-model="form.city" clearable filterable placeholder="请选择" @change="cityChange">
              <el-option v-for="city in cityList" :key="city.code" :label="city.name" :value="city.code"></el-option>
            </el-select>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item class="base-form-item" label="县区镇" prop="town">
          <div class="base-form-item-input">
            <el-select v-model="form.town" clearable filterable placeholder="请选择">
              <el-option v-for="town in townList" :key="town.code" :label="town.name" :value="town.code"></el-option>
            </el-select>
          </div>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
 
<script setup>
import cache from "@/plugins/cache";
const props = defineProps({
  labelWidth: { type: String, default: () => "110px" },
  labelSuffix: { type: String, default: () => ":" },
  labelAlign: { type: String, default: () => "right" },
});
const { proxy } = getCurrentInstance();
const provinceList = ref(cache.local.getJSON("region-tree-data"));
const cityList = ref([]);
const townList = ref([]);
const form = ref({
  province: "",
  city: "",
  town: "",
});
const rules = ref({
  province: [{ required: true, message: "请选择省份", trigger: "change" }],
  city: [{ required: true, message: "请选择城市", trigger: "change" }],
  town: [{ required: true, message: "请选择县区镇", trigger: "change" }],
});
const resetForm = () => {
  proxy.resetForm("elFormRef");
};
const validate = (fn) => {
  proxy.$refs["elFormRef"].validate((valid) => fn(valid));
};
const provinceChange = (val) => {
  townList.value = [];
  form.value.city = "";
  form.value.town = "";
  if (val) {
    cityList.value =
      provinceList.value.find((el) => el.code === val)?.children || [];
  } else {
    cityList.value = [];
  }
};
const cityChange = (val) => {
  form.value.town = "";
  if (val) {
    townList.value =
      cityList.value.find((el) => el.code === val)?.children || [];
  } else {
    townList.value = [];
  }
};
watch(form.value, (val) => {
  if (val.province) {
    cityList.value =
      provinceList.value.find((el) => el.code === val.province)?.children || [];
  }
  if (val.city) {
    townList.value =
      cityList.value.find((el) => el.code === val.city)?.children || [];
  }
});
defineExpose({ validate, resetForm, form });
</script>
<style lang="scss" scoped>
.base-form-item {
  display: flex;
  margin: 0 10px 0 0px;
  .base-form-item-input {
    display: flex;
    align-items: center;
    width: 100%;
  }
}
</style>