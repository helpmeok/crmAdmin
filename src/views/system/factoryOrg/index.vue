<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="4" :xs="24" style="border-right: 1px solid #f1f1f1;">
        <div class="tree-container">
          <el-tree ref="treeRef" :props="defaultProps" :expand-on-click-node="false" node-key="id" highlight-current lazy :load="loadNode"
                   @node-click="handleNodeClick" @node-contextmenu="openMenu">
          </el-tree>
          <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
            <template v-if="!openMenuType">
              <li @click="addFactory"><i class="el-icon-plus"></i> 增加工厂</li>
            </template>
            <template v-else>
              <li @click="addDept"><i class="el-icon-plus"></i> 增加部门</li>
              <li @click="addUserInfo"><i class="el-icon-plus"></i> 增加人员</li>
            </template>
            <li @click="refreshTreeNode(contextmenuNode.id)"><i class="el-icon-refresh"></i> 刷新</li>
          </ul>
          <base-dialog title="新增工厂" ref="addfactoryDialogRef" size="large" @confirm="addFactoryConfirm" @cancel="addFactoryCancel">
            <dept-form ref="factoryFormRef"></dept-form>
          </base-dialog>
          <base-dialog title="新增部门" ref="addDeptDialogRef" size="large" @confirm="addDeptConfirm" @cancel="addDeptCancel">
            <dept-form ref="deptFormRef"></dept-form>
          </base-dialog>
          <base-dialog title="新增人员" ref="addUserDialogRef" size="large" @confirm="addUserConfirm" @cancel="addUserCancel">
            <user-form ref="userFormRef"></user-form>
          </base-dialog>
        </div>
      </el-col>
      <el-col :span="20" :xs="24">
        <headquarter-tabs v-if="!orgType"></headquarter-tabs>
        <factory-tabs :type="orgType" v-if="orgType === 'FACTORY'"></factory-tabs>
        <factory-tabs :type="orgType" v-if="orgType === 'DEPARTMENT'"></factory-tabs>
      </el-col>
    </el-row>
  </div>
</template>
<script setup name="FactoryOrg">
import {
  saveFactoryOrg,
  getFactoryOrgTree,
} from "@/api/system/factoryOrg/index";
import { addUser } from "@/api/system/user";
import headquarterTabs from "./headquarterTabs";
import factoryTabs from "./factoryTabs";
import deptForm from "./deptForm";
import userForm from "./userForm";
const { proxy } = getCurrentInstance();
const addDeptDialogRef = ref(null);
const addUserDialogRef = ref(null);
const addfactoryDialogRef = ref(null);
const factoryFormRef = ref(null);
const deptFormRef = ref(null);
const userFormRef = ref(null);
const left = ref(0);
const top = ref(0);
const visible = ref(false);
const orgType = ref("");
const openMenuType = ref("");
const contextmenuNode = ref({});
const currentTreeNode = ref({});
let id = "0";
const orgId = ref(id);
let name = "总部工厂组织";
const orgName = ref(name);
const defaultProps = reactive({
  children: "children",
  label: "orgName",
  value: "id",
  isLeaf: "isLeaf",
});
const closeMenu = () => {
  visible.value = false;
};
watch(visible, (val) => {
  if (val) {
    document.body.addEventListener("click", closeMenu);
  } else {
    document.body.removeEventListener("click", closeMenu);
  }
});
const refreshFactoryTreeNode = () => {};
onMounted(() => {
  proxy.$refs["treeRef"].setCurrentKey("0");
  refreshTreeNode("0");
  proxy.emitter.on("refreshFactoryTreeNode", ({ id, currentId }) => {
    refreshTreeNode(id);
    setTimeout(() => {
      proxy.$refs["treeRef"].setCurrentKey(currentId);
    }, 1000);
  });
});

onUnmounted(() => {
  proxy.emitter.off("refreshFactoryTreeNode");
  proxy.emitter.off("refreshFactoryTabs");
});
const handleNodeClick = (data) => {
  currentTreeNode.value = data;
  orgId.value = data.id;
  orgName.value = data.orgName;
  orgType.value = "";
  orgType.value = data.orgType;
  proxy.emitter.emit("refreshFactoryTabs");
};
const openMenu = (e, data, node) => {
  contextmenuNode.value = data;
  openMenuType.value = data.orgType;
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
// 新增工厂
const addFactory = () => {
  addfactoryDialogRef.value.open();
  nextTick(() => {
    factoryFormRef.value.form.parentOrgName = contextmenuNode.value.orgName;
    factoryFormRef.value.formItems.orgCode.inputAttrs.disabled = false;
  });
};
const addFactoryConfirm = () => {
  factoryFormRef.value.baseFormRef.validate((valid) => {
    if (valid) {
      saveFactoryOrg(factoryFormRef.value.form).then((res) => {
        proxy.$modal.msgSuccess("添加成功");
        addfactoryDialogRef.value.close();
        proxy.emitter.emit("refreshFactoryTreeNode", {
          id: "0",
          currentId: "0",
        });
      });
    }
  });
};
const addFactoryCancel = () => {
  factoryFormRef.value.baseFormRef.resetForm();
};
// 新增部门
const addDept = () => {
  addDeptDialogRef.value.open();
  nextTick(() => {
    deptFormRef.value.form.parentOrgName = contextmenuNode.value.orgName;
    deptFormRef.value.formItems.orgCode.inputAttrs.disabled = false;
  });
};
const addDeptConfirm = () => {
  deptFormRef.value.baseFormRef.validate((valid) => {
    if (valid) {
      deptFormRef.value.form.parentOrgId = contextmenuNode.value.id;
      deptFormRef.value.form.orgType = "DEPARTMENT";
      saveFactoryOrg(deptFormRef.value.form).then((res) => {
        proxy.$modal.msgSuccess("添加成功");
        addDeptDialogRef.value.close();
        proxy.emitter.emit("refreshFactoryTreeNode", {
          id: contextmenuNode.value.id,
          currentId: contextmenuNode.value.id,
        });
      });
    }
  });
};
const addDeptCancel = () => {
  deptFormRef.value.baseFormRef.resetForm();
};
// 新增人员
const addUserInfo = () => {
  addUserDialogRef.value.open();
};
const addUserConfirm = () => {
  userFormRef.value.baseFormRef.validate((valid) => {
    if (valid) {
      userFormRef.value.form.orgId = contextmenuNode.value.id;
      userFormRef.value.form.orgType = 1;
      addUser(userFormRef.value.form).then((res) => {
        proxy.$modal.msgSuccess("添加成功");
        addUserDialogRef.value.close();
      });
    }
  });
};
const addUserCancel = () => {
  userFormRef.value.baseFormRef.resetForm();
};
const loadNode = async (node, resolve) => {
  if (node.level === 0) {
    return resolve([{ orgName: name, id: id }]);
  } else {
    const res = await getFactoryOrgTree({ id: node.data.id });
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
provide("currentTreeNode", currentTreeNode);
provide("userOrgType", 1);
</script>

<style lang="scss"  scoped>
.app-container {
  height: 100%;
  .tree-container {
    height: calc(100vh - 120px);
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