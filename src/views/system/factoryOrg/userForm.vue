<template>
  <div class=''>
    <base-form ref="baseFormRef" :formItems="formItems" :form="form"></base-form>
  </div>
</template>

<script setup name=''>
import { patternPhone, patternEmail } from "@/utils/validate";
import { getUserNameForAdd } from "@/api/system/user";
const baseFormRef = ref(null);
const formData = reactive({
  formItems: {
    userName: {
      type: "input",
      label: "用户账号",
      span: 12,
      inputAttrs: { disabled: true },
      rule: [{ required: true }],
    },
    password: {
      type: "password",
      label: "用户密码",
      span: 12,
      rule: [{ required: true }],
    },
    name: {
      type: "input",
      label: "用户姓名",
      span: 12,
      rule: [{ required: true }],
    },
    sex: {
      type: "select",
      label: "性别",
      span: 12,
      dictType: "SYS_SEX",
      rule: [{ required: true }],
    },
    status: {
      type: "select",
      label: "用户状态",
      span: 12,
      dictType: "SYS_STATUS",
      rule: [{ required: true }],
    },
    phone: {
      type: "input",
      label: "电话",
      span: 12,
      rule: [
        { required: true },
        {
          pattern: patternPhone(),
          message: "电话格式不正确",
          trigger: "blur",
        },
      ],
    },
    email: {
      type: "input",
      label: "邮箱地址",
      span: 24,
      rule: [
        { required: false },
        {
          pattern: patternEmail(),
          message: "邮箱地址格式不正确",
          trigger: "blur",
        },
      ],
    },
    contactAddress: {
      type: "input",
      label: "联系地址",
      span: 24,
    },
  },
  form: {},
});
const { formItems, form } = toRefs(formData);
const orgId = inject("orgId");
const orgType = inject("userOrgType");
const add = () => {
  getUserNameForAdd({
    orgId: orgId.value,
    orgType,
  }).then((res) => {
    form.value.userName = res.data;
  });
  form.value.password = "Jomoo123"; //默认密码
  formItems.value.password.isHide = false;
  formItems.value.email.span = 24;
};
const update = () => {
  formItems.value.password.isHide = true;
  formItems.value.email.span = 12;
};
defineExpose({ formItems, form, baseFormRef, update, add });
</script>

<style lang='scss' scoped>
</style>