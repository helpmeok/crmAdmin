<template>
  <div class=''>
    <base-form ref="baseFormRef" :formItems="formItems" :isFooter="isFooter" :form="form" @confirm="confirm" @cancel="cancel"></base-form>
  </div>
</template>

<script setup name=''>
import { patternPhone } from "@/utils/validate";
const props = defineProps({
  isFooter: { type: Boolean, default: false },
});
const baseFormRef = ref(null);
const formData = reactive({
  formItems: {
    orgName: { type: "input", label: "组织名称", rule: [{ required: true }] },
    orgCode: {
      type: "input",
      label: "组织编码",
      rule: [{ required: true }],
      inputAttrs: { disabled: true },
    },
    parentOrgName: {
      type: "input",
      label: "上级组织",
      inputAttrs: { disabled: true, placeholder: "" },
    },
    status: {
      type: "select",
      label: "组织状态",
      dictType: "SYS_STATUS",

      rule: [{ required: true }],
    },
    linkMan: { type: "input", label: "负责人" },
    phone: {
      type: "input",
      label: "联系号码",
      rule: [
        { required: false },
        {
          pattern: patternPhone(),
          message: "联系号码格式不正确",
          trigger: "blur",
        },
      ],
    },
    remark: { type: "textarea", label: "备注", span: 24 },
  },
  form: {
    orgType: "FACTORY",
  },
});
const { formItems, form } = toRefs(formData);
const emit = defineEmits(["cancel", "confirm"]);
const cancel = () => {
  emit("cancel");
};
const confirm = () => {
  baseFormRef.value.validate((valid) => {
    if (valid) {
      emit("confirm", form.value);
    }
  });
};
defineExpose({ formItems, form, baseFormRef });
</script>

<style lang='scss' scoped>
</style>