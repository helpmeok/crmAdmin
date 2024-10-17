<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="4" :xs="24" style="border-right: 1px solid #f1f1f1;">
        <div class="head-container">
          <el-input v-model="dealerName" placeholder="经销商名称" clearable prefix-icon="el-icon-search" style="margin-bottom: 20px" />
        </div>
        <div class="tree-container">
          <el-tree ref="treeRef" :props="defaultProps" :expand-on-click-node="false" :filter-node-method="filterNode" node-key="dealerId" lazy :load="loadNode"
                   highlight-current @node-click="handleNodeClick" @node-contextmenu="openMenu">
          </el-tree>
          <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
            <li @click="addDealer"><i class="el-icon-plus"></i> 增加经销商</li>
            <li @click="refreshTreeNode('0')"><i class="el-icon-refresh"></i> 刷新</li>
          </ul>
          <dealer-add-dialog ref="dealerAddDialogRef"></dealer-add-dialog>
        </div>
      </el-col>
      <el-col :span="20" :xs="24">
        <headquarter-tabs v-if="!orgType"></headquarter-tabs>
        <dealer-tabs v-if="orgType === 'SGDEALERORG'"></dealer-tabs>
        <region-tabs v-if="orgType === 'COMPANY'"></region-tabs>
        <store-tabs v-if="orgType === 'STORE'"></store-tabs>
      </el-col>
    </el-row>
  </div>
</template>
<script setup name="DealerOrg">
import { getDealerOrgTree } from "@/api/system/dealerOrg/index";
import headquarterTabs from "./headquarterTabs";
import dealerTabs from "./dealerTabs";
import regionTabs from "./regionTabs";
import storeTabs from "./storeTabs";
import dealerAddDialog from "./dealerAddDialog";
const { proxy } = getCurrentInstance();
const left = ref(0);
const top = ref(0);
const visible = ref(false);
const dealerName = ref("");
const orgType = ref("");
const orgId = ref("0");
const orgName = ref("");
const defaultProps = reactive({
  children: "children",
  label: "orgName",
  value: "dealerId",
  isLeaf: "isLeaf",
});
const closeMenu = () => {
  visible.value = false;
};
watch(dealerName, (val) => {
  proxy.$refs["treeRef"].filter(val);
});
watch(visible, (val) => {
  if (val) {
    document.body.addEventListener("click", closeMenu);
  } else {
    document.body.removeEventListener("click", closeMenu);
  }
});
onMounted(() => {
  proxy.$refs["treeRef"].setCurrentKey("0");
  refreshTreeNode("0");
  proxy.emitter.on("refreshDealerTreeNode", ({ id, currentId }) => {
    refreshTreeNode(id);
    setTimeout(() => {
      proxy.$refs["treeRef"].setCurrentKey(currentId);
    }, 500);
  });
  proxy.emitter.on("locationDealerTree", (orgObj) => {
    if (orgObj?.orgType === "SGDEALERORG") {
      proxy.emitter.emit("refreshDealerTreeNode", {
        id: orgObj.orgId,
        currentId: orgObj.orgId,
      });
    }
    if (orgObj?.orgType === "COMPANY") {
      proxy.emitter.emit("refreshDealerTreeNode", {
        id: orgObj.parentOrgId,
        currentId: orgObj.orgId,
      });
    }
  });
});
onUnmounted(() => {
  proxy.emitter.off("refreshDealerTreeNode");
  proxy.emitter.off("refreshDealerTabs");
});
const handleNodeClick = (data) => {
  orgId.value = data.dealerId;
  orgName.value = data.orgName;
  orgType.value = "";
  orgType.value = data.orgType;
  proxy.emitter.emit("refreshDealerTabs");
};
const filterNode = (value, data) => {
  if (!value) return true;
  return data.orgName.indexOf(value) !== -1;
};
const openMenu = (e, data, node) => {
  if (data.dealerId !== "0") return;
  const menuMinWidth = 105;
  const offsetLeft = proxy.$el.getBoundingClientRect().left; // container margin left
  const offsetWidth = proxy.$el.offsetWidth; // container width
  const maxLeft = offsetWidth - menuMinWidth; // left boundary
  const l = e.clientX - offsetLeft;
  if (l > maxLeft) {
    left.value = maxLeft;
  } else {
    left.value = l;
  }
  top.value = e.clientY - 125;
  visible.value = true;
};
const addDealer = () => {
  proxy.$refs["dealerAddDialogRef"].open();
};
const loadNode = async (node, resolve) => {
  if (node.level === 0) {
    return resolve([{ orgName: "总部经销商组织", dealerId: "0" }]);
  } else {
    const res = await getDealerOrgTree({ id: node.data.dealerId });
    return resolve(res.data);
  }
};
const refreshTreeNode = (id) => {
  let node = proxy.$refs["treeRef"].getNode(id);
  if (node) {
    node.loaded = false; //告诉组件这个节点需要加载
    node.expand(); // 主动调用展开节点方法，重新查询该节点下的所有子节点
  }
};

provide("orgId", orgId);
provide("orgName", orgName);
provide("orgType", orgType);
provide("userOrgType", 0);
</script>

<style lang="scss"  scoped>
.app-container {
  height: 100%;
  .tree-container {
    height: calc(100vh - 160px);
    overflow: auto;
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>