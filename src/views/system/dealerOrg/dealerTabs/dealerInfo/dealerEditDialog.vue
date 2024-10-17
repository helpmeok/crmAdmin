<template>
  <div class="dealer-edit-dialog">
    <base-dialog title="编辑SAP组织编码" ref="baseDialogRef" size="mini" @confirm="confirm" @cancel="cancel">
      <base-form ref="baseFormRef" labelWidth="120px" :formItems="formItems" :form="form">
      </base-form>
    </base-dialog>
  </div>
</template>
<script setup>
import { updateSapOrgCode } from "@/api/system/dealerOrg/index";
import { nextTick } from "vue";
const { proxy } = getCurrentInstance();
const props = defineProps({
  formData: { type: Object, default: () => {} },
});
const formData = reactive({
  formItems: {
    sapOrgCode: {
      type: "input",
      label: "SAP组织编码",
      span: 24,
      rule: [{ required: true }],
    },
  },
  form: {},
});
const { formItems, form } = toRefs(formData);
const open = () => {
  proxy.$refs["baseDialogRef"].open();
  nextTick(() => {
    form.value.sapOrgCode = props.formData.sapOrgCode;
  });
};
const cancel = () => {
  proxy.$refs["baseFormRef"].resetForm();
};
const emit = defineEmits(["editRefresh"]);
const confirm = () => {
  proxy.$refs["baseFormRef"].validate((valid) => {
    if (valid) {
      form.value.id = props.formData.id;
      updateSapOrgCode(form.value).then((res) => {
        proxy.$modal.msgSuccess("编辑成功");
        proxy.$refs["baseDialogRef"].close();
        emit("editRefresh", props.formData.id);
        cancel();
      });
    }
  });
};
defineExpose({ open, cancel });
</script>
<style lang="scss"  scoped>
.dealer-edit-dialog {
  .form-title {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    margin-bottom: 5px;
  }
}
</style>