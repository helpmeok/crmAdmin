<template>
  <div class='user-info-container'>
    <base-table :columns="columns" :loading="loading" :data="tableData" :bottomHeight="15">
    </base-table>
  </div>
</template>

<script setup name=''>
import { listUser } from "@/api/system/user";
const columns = reactive({
  juese: { label: "角色" },
  xingming: { label: "人员姓名" },
  geshu: { label: "人员个数" },
});
const tableData = ref([]);
const queryParams = reactive({
  pageIndex: 1,
  pageSize: 15,
});
const loading = ref(false);
const getList = () => {
  loading.value = true;
  listUser(queryParams)
    .then((res) => {
      // tableData.value = res.data.items;
      // total.value = res.data.total;
    })
    .finally(() => {
      loading.value = false;
    });
};
getList();
</script>

<style lang='scss' scoped>
</style>