<template>
  <div class='dealer-info-container'>
    <div>
      <el-button type="primary" icon="Refresh" disabled>同步至SAP</el-button>
      <el-button type="primary" @click="edit">编辑</el-button>
    </div>
    <div class="form-container">
      <base-form ref="baseFormRef" :formItems="formItems" :form="form" isFooter @getFormSelectChange="getFormSelectChange" @confirm="confirm">
      </base-form>
    </div>
    <dealer-edit-dialog :formData="form" ref="dealerEditDialogRef" @editRefresh="getInfo"></dealer-edit-dialog>
  </div>
</template>

<script setup name=''>
import { patternPhone } from "@/utils/validate";
import dealerEditDialog from "./dealerEditDialog.vue";
import { getDealerOrgById, saveDealerOrg } from "@/api/system/dealerOrg/index";
import cache from "@/plugins/cache";
import { set } from "@vueuse/core";
import { nextTick, provide, reactive } from "vue";
const { proxy } = getCurrentInstance();
const formData = reactive({
  formItems: {
    dealerInfoTitle: { isTitleBar: true, label: "经销商组织信息", span: 24 },
    orgName: {
      type: "input",
      label: "经销商名称",
      rule: [{ required: true }],
    },
    orgCode: {
      type: "input",
      label: "经销商编号",
      inputAttrs: { disabled: true, placeholder: "" },
    },
    parentOrgName: {
      type: "input",
      label: "上级组织",
      inputAttrs: { disabled: true, placeholder: "" },
    },
    sapCustomerName: {
      type: "input",
      label: "SAP客户主数据名称",
      showLabelTip: true,
      rule: [{ required: true }],
    },
    tishi: {
      type: "text",
      label: "提示",
      span: 16,
      text: "对应SAP客户主数据名称，请勿擅自修改！影响银行打款入账!",
      dangerText: true,
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
    dealerTypeArr: {
      type: "select",
      label: "经销商类型",
      dictType: "ISPROJECT",
      rule: [{ required: true }],
      inputAttrs: {
        multiple: true,
      },
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
    dealerContact: { type: "input", label: "经销商联系人", span: 12 },
    contactPhone: {
      type: "input",
      label: "联系人电话",
      span: 12,
      rule: [
        { required: false },
        {
          pattern: patternPhone(),
          message: "联系人电话格式不正确",
          trigger: "blur",
        },
      ],
    },
    sapOrgCode: {
      type: "input",
      label: "SAP组织编码",
      span: 12,
      inputAttrs: {
        disabled: true,
        placeholder: "",
      },
    },
    fax: { type: "input", label: "传真号", span: 12 },
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
  form: {},
});
const { formItems, form } = toRefs(formData);
let dealerId = inject("orgId");
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
const getInfo = (id) => {
  if (!id) return;
  getDealerOrgById({ id }).then((res) => {
    res.data.businessScopeArr = res.data.businessScope
      .split(",")
      .map((el) => el.split("_"));
    res.data.dealerTypeArr = res.data.dealerType.split(",");
    form.value = res.data;
  });
};
watch(
  dealerId,
  (id) => {
    getInfo(id);
  },
  { immediate: true }
);
const edit = () => {
  proxy.$refs["dealerEditDialogRef"].open();
};
const confirm = (valid) => {
  if (valid) {
    form.value.businessScope = form.value.businessScopeArr
      .map((item) => item.join("_"))
      .join(",");
    form.value.dealerType = form.value.dealerTypeArr.join(",");
    saveDealerOrg(form.value).then((res) => {
      proxy.$modal.msgSuccess("保存成功");
      getInfo(form.value.id);
      proxy.emitter.emit("refreshDealerTreeNode", {
        id: "0",
        currentId: dealerId.value,
      });
    });
  }
};
</script>

<style lang='scss' scoped>
.dealer-info-container {
  width: 100%;
  height: 100%;
  .form-container {
    height: calc(100vh - 200px);
    padding-top: 10px;
    overflow: auto;
  }
}
</style>