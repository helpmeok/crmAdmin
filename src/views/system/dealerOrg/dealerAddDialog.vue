<template>
  <div class="dealer-add-dialog">
    <base-dialog title="新增经销商" ref="baseDialogRef" size="large" @confirm="confirm" @cancel="cancel">
      <base-form ref="baseFormRef" :formItems="formItems" :form="form" @getFormSelectChange="getFormSelectChange">
      </base-form>
    </base-dialog>
  </div>
</template>
<script setup>
import { patternPhone } from "@/utils/validate";
import { saveDealerOrg } from "@/api/system/dealerOrg/index";
import cache from "@/plugins/cache";
import { watch } from "vue";
const { proxy } = getCurrentInstance();
const formData = reactive({
  formItems: {
    dealerInfoTitle: { isTitleBar: true, label: "经销商组织信息", span: 24 },
    orgName: { type: "input", label: "经销商名称", rule: [{ required: true }] },
    parentOrgId: {
      type: "input",
      label: "上级组织",
      inputAttrs: { disabled: true, placeholder: "" },
    },
    dealerTypeArr: {
      type: "select",
      label: "经销商类型",
      dictType: "ISPROJECT",
      rule: [{ required: true }],
      inputAttrs: {
        multiple: true,
      },
    },
    sapCustomerName: {
      type: "input",
      label: "SAP客户名",
      rule: [{ required: true }],
    },
    phone: {
      type: "input",
      label: "手机号码",
      rule: [
        { required: true },
        {
          pattern: patternPhone(),
          message: "手机号码格式不正确",
          trigger: "blur",
        },
      ],
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
    level: {
      type: "select",
      label: "等级",
      dictType: "DEALER_GRADE",
      rule: [{ required: true }],
    },
    businessScopeArr: {
      type: "cascader",
      label: "业务范围",
      span: 24,
      options: cache.local.getJSON("region-tree-data"),
      inputAttrs: {
        disabledChild: true,
        props: {
          multiple: true,
          value: "code",
          label: "name",
          leaf: "isLeaf",
          checkStrictly: true,
        },
      },
      rule: [{ required: true }],
    },
    SAPInfoTitle: { isTitleBar: true, label: "SAP信息", span: 24 },
    country: { type: "text", label: "国家", text: "中国" },
    language: { type: "text", label: "语言", text: "中文" },
    title: {
      type: "select",
      label: "标题",
      dictType: "SAP_TITLE",
      rule: [{ required: true }],
    },
    fax: { type: "input", label: "传真号" },
    dealerContact: { type: "input", label: "经销商联系人" },
    contactPhone: {
      type: "input",
      label: "联系人电话",
      rule: [
        { required: false },
        {
          pattern: patternPhone(),
          message: "联系人电话格式不正确",
          trigger: "blur",
        },
      ],
    },
    cashGroup: {
      type: "select",
      label: "现金管理组",
      span: 12,
      dictType: "CASHMANAGEMENTTEAM",
      rule: [{ required: true }],
    },
    paymentTerm: {
      type: "select",
      label: "付款条件",
      span: 12,
      dictType: "PAYMENTTERM",
      rule: [{ required: true }],
    },
    businessLicence: {
      type: "input",
      label: "营业执照号",
      span: 12,
      rule: [{ required: false }],
    },
    idCard: {
      type: "input",
      label: "身份证号",
      span: 12,
      rule: [{ required: false }],
    },
  },
  form: {
    orgType: "SGDEALERORG",
    country: "CN",
    language: "中文",
  },
});
const { formItems, form } = toRefs(formData);
const getFormSelectChange = (name) => {
  if (name === "title") {
    if (form.value.title) {
      if (form.value.title === "1") {
        formItems.value.businessLicence.rule[0].required = true;
        formItems.value.idCard.rule[0].required = false;
      } else {
        formItems.value.businessLicence.rule[0].required = false;
        formItems.value.idCard.rule[0].required = true;
      }
    } else {
      formItems.value.businessLicence.rule[0].required = false;
      formItems.value.idCard.rule[0].required = false;
    }
  }
};
const open = () => {
  proxy.$refs["baseDialogRef"].open();
};
const cancel = () => {
  proxy.$refs["baseFormRef"].resetForm();
};
const emit = defineEmits(["refreshTreeNode"]);
const confirm = () => {
  proxy.$refs["baseFormRef"].validate((valid) => {
    if (valid) {
      form.value.businessScope = form.value.businessScopeArr
        .map((item) => item.join("_"))
        .join(",");
      form.value.dealerType = form.value.dealerTypeArr.join(",");
      saveDealerOrg(form.value).then((res) => {
        proxy.$modal.msgSuccess("添加成功");
        proxy.$refs["baseDialogRef"].close();
        proxy.emitter.emit("refreshDealerTreeNode", {
          id: "0",
          currentId: "0",
        });
        cancel();
      });
    }
  });
};
defineExpose({ open, cancel });
</script>
<style lang="scss"  scoped>
.dealer-add-dialog {
  .form-title {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    margin-bottom: 5px;
  }
}
</style>