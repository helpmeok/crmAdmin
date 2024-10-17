<template>
  <div class='factory-info-container'>
    <div class="form-container">
      <dept-form ref="deptFormRef" isFooter @confirm="confirm" @cancel="cancel"></dept-form>
    </div>
  </div>
</template>

<script setup name=''>
import {
  saveFactoryOrg,
  getFactoryOrgById,
} from "@/api/system/factoryOrg/index";
import deptForm from "../../deptForm";
const { proxy } = getCurrentInstance();
const deptFormRef = ref(null);
let currentTreeNode = inject("currentTreeNode");
watch(
  currentTreeNode,
  (node) => {
    if (node.id) {
      getFactoryOrgById({ id: node.id }).then((res) => {
        res.data.parentOrgName = res.data.parentOrgName || "总部工厂组织";
        deptFormRef.value.form = res.data;
      });
    }
  },
  { immediate: true }
);
const confirm = (data) => {
  saveFactoryOrg(data).then((res) => {
    proxy.$modal.msgSuccess("保存成功");
    proxy.emitter.emit("refreshFactoryTreeNode", {
      id:
        currentTreeNode.value.orgType === "FACTORY"
          ? "0"
          : currentTreeNode.value.parentOrgId,
      currentId: currentTreeNode.value.id,
    });
  });
};
const emit = defineEmits(["closePage"]);
const cancel = () => {};
</script>

<style lang='scss' scoped>
.factory-info-container {
  width: 100%;
  height: 100%;
  .form-container {
    height: calc(100vh - 175px);
    overflow: auto;
  }
}
</style>