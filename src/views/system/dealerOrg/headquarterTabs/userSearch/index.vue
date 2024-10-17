<template>
  <div class='user-search-container'>
    <base-table-search ref="baseTableSearchRef" :queryFormItems="queryFormItems" :queryParams="queryParams" @handleQuery="handleQuery" @resetQuery="resetQuery">
    </base-table-search>
    <base-table :columns="columns" :loading="loading" :data="tableData">
      <template #operations="{scope}">
        <el-button link type="primary" @click="editRow(scope.row)">
          编辑
        </el-button>
        <el-button link type="primary" @click="locationTree(scope.row)">定位</el-button>
        <!-- <el-button link type="primary" @click="delUserInfo(scope.row)">删除</el-button> -->
      </template>
    </base-table>
    <pagination :total="total" v-model:page="queryParams.pageIndex" v-model:limit="queryParams.pageSize" @pagination="getList" />
    <base-dialog title="修改人员信息" ref="baseDialogRef" size="medium" @confirm="confirm" @cancel="cancel">
      <user-form ref="userFormRef"></user-form>
    </base-dialog>
  </div>
</template>

<script setup>
import userForm from "@/views/system/factoryOrg/userForm.vue";
import useUser from "@/views/system/factoryOrg/hooks/useUser";
import { listAllDealerOrg } from "@/api/system/dealerOrg/index";
const { proxy } = getCurrentInstance();
const allOrgOptions = ref([]);
const queryFormItems = reactive({
  name: { label: "姓名", type: "input" },
  userName: { label: "账号", type: "input" },
  status: {
    label: "状态",
    type: "select",
    dictType: "SYS_STATUS",
    options: [],
  },
  orgId: {
    label: "所属组织",
    type: "select",
    options: allOrgOptions,
  },
});
const columns = reactive({
  name: { label: "姓名" },
  userName: { label: "账号" },
  // role: { label: "角色" },
  orgName: { label: "组织名称" },
  status: { label: "状态", dictType: "SYS_STATUS" },
  operations: { label: "操作", slot: "operations" },
});
const {
  tableData,
  title,
  loading,
  total,
  queryParams,
  handleQuery,
  resetQuery,
  editRow,
  cancel,
  confirm,
  getList,
  delUserInfo,
} = useUser();

getList();
const getOrgs = () => {
  listAllDealerOrg().then((res) => {
    allOrgOptions.value = res.data;
  });
};
const locationTree = (row) => {
  proxy.emitter.emit("locationDealerTree", row.org);
};
getOrgs();
</script>

<style lang='scss' scoped>
.user-search-container {
  padding-bottom: 10px;
}
</style>