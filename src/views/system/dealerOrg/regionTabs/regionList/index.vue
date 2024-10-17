<template>
  <div class='region-list-container'>
    <div class="form-container">
      <base-form ref="baseFormRef" label-width="120px" :formItems="formItems" :form="form" isFooter @confirm="confirm">
      </base-form>
    </div>
  </div>
</template>

<script setup name=''>
import {
  getAreaCompanyById,
  saveAreaCompany,
} from "@/api/system/dealerOrg/index";
import { patternPhone } from "@/utils/validate";
const { proxy } = getCurrentInstance();
const formData = reactive({
  formItems: {
    orgName: {
      type: "input",
      label: "区域公司名称",
      rule: [{ required: true }],
    },
    orgCode: {
      type: "input",
      label: "区域公司编码",
      inputAttrs: { disabled: true, placeholder: "" },
    },
    parentOrgName: {
      type: "input",
      label: "上级组织",
      inputAttrs: { disabled: true, placeholder: "" },
    },
    alias: {
      type: "input",
      label: "别名",
      rule: [{ required: true }],
    },
    status: {
      type: "select",
      label: "状态",
      dictType: "SYS_STATUS",

      rule: [{ required: true }],
    },
    empty: {},
    province: {
      type: "select",
      label: "省",
      span: 8,
      optionLabelKey: "name",
      optionValueKey: "code",
      rule: [{ required: true }],
    },
    city: {
      type: "select",
      label: "市",
      span: 8,
      optionLabelKey: "name",
      optionValueKey: "code",
      rule: [{ required: true }],
    },
    town: {
      type: "select",
      label: "县区镇",
      span: 8,
      optionLabelKey: "name",
      optionValueKey: "code",
    },
    address: {
      type: "input",
      label: "地址",
      span: 24,
      rule: [{ required: true }],
    },
  },
  form: {},
});
const { formItems, form } = toRefs(formData);
let orgId = inject("orgId");
watch(
  orgId,
  (id) => {
    if (id) {
      getAreaCompanyById({ id }).then((res) => {
        form.value = res.data;
      });
    }
  },
  { immediate: true }
);
const confirm = (valid) => {
  if (valid) {
    saveAreaCompany(form.value).then((res) => {
      proxy.$modal.msgSuccess("保存成功");
      proxy.emitter.emit("refreshDealerTreeNode", {
        id: form.value.parentOrgId,
        currentId: orgId.value,
      });
    });
  }
};
</script>

<style lang='scss' scoped>
.region-list-container {
  width: 100%;
  height: 100%;
  .form-container {
    height: calc(100vh - 175px);
    overflow: auto;
  }
}
</style>