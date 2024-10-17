<template>
  <div class='store-info-container'>
    <div>
      <el-button type="primary" icon="Refresh" disabled>同步至SAP</el-button>
    </div>
    <div class="form-container">
      <base-form ref="baseFormRef" :formItems="formItems" :form="form" isFooter @confirm="confirm">
      </base-form>
    </div>
  </div>
</template>

<script setup name=''>
import { getStoreById, saveStore } from "@/api/system/dealerOrg/index";
import { patternPhone } from "@/utils/validate";
const { proxy } = getCurrentInstance();
let orgId = inject("orgId");
const formData = reactive({
  formItems: {
    dealerInfoTitle: { isTitleBar: true, label: "经销商组织信息", span: 24 },
    orgName: { type: "input", label: "门店名称", rule: [{ required: true }] },
    orgCode: {
      type: "input",
      label: "门店编码",
      inputAttrs: { disabled: true, placeholder: "" },
    },
    parentOrgName: {
      type: "input",
      label: "上级组织",
      inputAttrs: { disabled: true, placeholder: "" },
    },
    alias: { type: "input", label: "别名", rule: [{ required: true }] },
    dealerChannel: {
      type: "select",
      label: "经销商渠道",
      dictType: "CHANNEL_ORG",
      rule: [{ required: true }],
    },
    status: {
      type: "select",
      label: "状态",
      dictType: "SYS_STATUS",

      rule: [{ required: true }],
    },
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
    square: {
      type: "number",
      label: "面积",
      inputAttrs: { precision: 2, step: 100 },
    },
    SAPInfoTitle: { isTitleBar: true, label: "SAP信息", span: 24 },
    sapzzbm: { type: "text", label: "SAP组织编码", text: "", span: 24 },
    businessLicence: { type: "input", label: "营业执照号", span: 12 },
    idCard: { type: "input", label: "身份证号", span: 12 },
    storeChannel: {
      type: "select",
      label: "门店分销渠道",
      showLabelTip: true,
      span: 12,
      dictType: "DISTRIBUTION_CHANNEL",
      rule: [{ required: true }],
    },
    storeProductGroup: {
      type: "select",
      label: "门店产品组",
      span: 12,
      dictType: "PRODUCT_GROUP",
      rule: [{ required: true }],
    },
  },
  form: {},
});
const { formItems, form } = toRefs(formData);
watch(
  orgId,
  (id) => {
    if (id) {
      getStoreById({ id }).then((res) => {
        form.value = res.data;
      });
    }
  },
  { immediate: true }
);
const confirm = (valid) => {
  if (valid) {
    saveStore(form.value).then((res) => {
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
.store-info-container {
  width: 100%;
  height: 100%;
  .form-container {
    height: calc(100vh - 200px);
    padding-top: 10px;
    overflow: auto;
  }
}
</style>