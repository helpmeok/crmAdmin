<template>
  <div class="app-container">
    <base-table-search :queryFormItems="queryFormItems" :queryParams="queryParams" @getQuerySelectChange="getQuerySelectChange" @handleQuery="handleQuery"
                       @resetQuery="resetQuery">
    </base-table-search>
    <div class="pb10 flex">
      <el-button type="primary" icon="Plus" @click="add">新增</el-button>
    </div>
    <base-table :columns="columns" :loading="loading" :data="tableData">
      <template #operations="{scope}">
        <el-button link type="primary" @click="editRow(scope.row)">编辑</el-button>
      </template>
    </base-table>
    <pagination :total="total" v-model:page="queryParams.pageIndex" v-model:limit="queryParams.pageSize" @pagination="getList" />
    <base-dialog :title="title" ref="baseDialogRef" @confirm="confirm" @cancel="cancel">
      <base-form ref="baseFormRef" :formItems="formItems" :form="form" @getFormSelectChange="getFormSelectChange">
      </base-form>
    </base-dialog>
  </div>
</template>

<script setup name="FundProportion">
import {
  listFundProportion,
  saveFundProportion,
  getFundProportionById,
} from "@/api/system/fundProportion/index";
import { getDicts } from "@/api/system/dict/data";
import { useDict } from "@/utils/dict";
const { proxy } = getCurrentInstance();
const queryFormItems = reactive({
  channelType: { label: "渠道类型", type: "select", dictType: "CHANNEL_TYPE" },
  channel: { label: "渠道", type: "select", options: [] },
});
const loading = ref(false);
const title = ref("");
const total = ref(0);
const queryParams = reactive({
  pageIndex: 1,
  pageSize: 15,
});
const columns = reactive({
  channelType: { label: "渠道类型" },
  channel: { label: "渠道" },
  channelProportion: { label: "资金池比例", suffix: "%" },
  lastUpdateTime: { label: "最后更新时间", width: 180 },
  operations: { label: "操作", slot: "operations", width: 100, fixed: "right" },
});
const tableData = ref([]);
const formData = reactive({
  formItems: {
    channelType: {
      type: "select",
      label: "渠道类型",
      dictType: "CHANNEL_TYPE",
      span: 12,
      rule: [{ required: true }],
      inputAttrs: {
        disabled: false,
      },
    },
    channel: {
      type: "select",
      label: "渠道",
      span: 12,
      dictType: "",
      rule: [{ required: true }],
      inputAttrs: {
        disabled: false,
      },
      options: [],
    },
    channelProportion: {
      type: "number",
      label: "资金池比例",
      span: 12,
      rule: [{ required: true }],
      inputAttrs: {
        step: 5,
        precision: 2,
        min: 0,
        max: 100,
      },
    },
  },
  form: {},
});
const { formItems, form } = toRefs(formData);
const getList = () => {
  loading.value = true;
  listFundProportion(proxy.addDateRange(queryParams, queryParams.date))
    .then((res) => {
      tableData.value = res.data.items;
      total.value = res.data.total;
    })
    .finally(() => {
      loading.value = false;
    });
};
const handleQuery = (data) => {
  queryParams.pageIndex = 1;
  getList();
};
const resetQuery = (data) => {
  getList();
};
const add = () => {
  title.value = "新增记录";
  proxy.$refs["baseDialogRef"].open();
  formItems.value.channelType.inputAttrs.disabled = false;
  formItems.value.channel.inputAttrs.disabled = false;
  delete form.value.id;
};
const getQuerySelectChange = (name) => {
  if (name === "channelType") {
    if (queryParams[name]) {
      getDicts(queryParams[name]).then((res) => {
        queryFormItems.channel.options = filterDictData(res.data);
      });
    } else {
      queryFormItems.channel.options = [];
    }
    queryParams.channel = "";
  }
};
const getFormSelectChange = (name) => {
  if (name === "channelType") {
    if (form.value[name]) {
      getDicts(form.value[name]).then((res) => {
        formItems.value.channel.options = filterDictData(res.data);
      });
    } else {
      formItems.value.channel.options = [];
    }
    form.value.channel = "";
  }
};
const confirm = () => {
  proxy.$refs["baseFormRef"].validate((valid) => {
    if (valid) {
      saveFundProportion(form.value).then((res) => {
        proxy.$modal.msgSuccess(form.value.id ? "修改成功" : "添加成功");
        proxy.$refs["baseDialogRef"].close();
        getList();
      });
    }
  });
};
const editRow = (row) => {
  title.value = "修改记录";
  proxy.$refs["baseDialogRef"].open();
  proxy.$refs["baseDialogRef"].isLoading(true);
  formItems.value.channelType.inputAttrs.disabled = true;
  formItems.value.channel.inputAttrs.disabled = true;
  getFundProportionById({ id: row.id })
    .then((res) => {
      proxy.setFormData(formItems.value, form.value, res.data);
      getDicts(res.data.channelType).then((res) => {
        formItems.value.channel.options = filterDictData(res.data);
      });
    })
    .finally(() => {
      proxy.$refs["baseDialogRef"].isLoading(false);
    });
};
const filterDictData = (data) => {
  return data
    .filter((el) => el.status == "0")
    .map((p) => ({
      label: p.dictLabel,
      value: p.dictValue,
    }));
};
const cancel = () => {
  proxy.$refs["baseFormRef"].resetForm();
};
getList();
</script>

<style lang='scss' scoped>
</style>