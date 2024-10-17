import {
  addUser,
  updateUser,
  listUser,
  getUser,
  showUserPwd,
  updateUserPwd,
  delUser
} from "@/api/system/user";
export default function () {
  const title = ref("");
  const loading = ref(false);
  const total = ref(0);
  const tableData = ref([]);
  const orgId = inject("orgId");
  const userOrgType = inject("userOrgType");
  const queryParams = reactive({
    pageIndex: 1,
    pageSize: 15,
    userPageOrgInParam: {
      orgId: orgId.value === "0" ? null : orgId.value,
      orgType: userOrgType,
    }
  });
  const handleQuery = () => {
    queryParams.pageIndex = 1;
    getList();
  };
  const resetQuery = () => {
    queryParams.userPageOrgInParam.orgId = orgId.value === "0" ? null : orgId.value;
    handleQuery();
  };
  const { proxy } = getCurrentInstance();
  const addUserInfo = (row) => {
    title.value = "添加人员";
    proxy.$refs["baseDialogRef"].open();
    nextTick(() => {
      proxy.$refs["userFormRef"].add();
      proxy.$refs["userFormRef"].form.orgId = orgId.value;
    });
  };
  const editRow = (row) => {
    title.value = "修改人员";
    proxy.$refs["baseDialogRef"].open();
    proxy.$refs["baseDialogRef"].isLoading(true);
    nextTick(() => {
      proxy.$refs["userFormRef"].update();
      getUser({ id: row.id })
        .then((res) => {
          proxy.setFormData(
            proxy.$refs["userFormRef"].formItems,
            proxy.$refs["userFormRef"].form,
            res.data
          );
          proxy.$refs["userFormRef"].form.orgId = res.data.org?.orgId;
          console.log(proxy.$refs["userFormRef"].form)
        })
        .finally(() => {
          proxy.$refs["baseDialogRef"].isLoading(false);
        });
    });
  };
  // 重置密码
  const resetPwd = (row) => {
    proxy.$modal.confirm("确定将密码重置为000000？").then(() => {
      updateUserPwd({ id: row.id, password: "000000" }).then((res) => {
        proxy.$modal.msgSuccess("重置成功");
      });
    });
  };
  // 显示密码
  const showPwd = (row) => {
    showUserPwd({ id: row.id }).then((res) => {
      proxy.$alert(res.data, "用户密码");
    });
  };
  // 删除人员
  const delUserInfo = (row) => {
    proxy.$modal.confirm("确认删除？").then(function () {
      delUser(row.id).then((res) => {
        proxy.$modal.msgSuccess("删除成功");
        getList();
      });
    });

  };
  const getList = () => {
    loading.value = true;
    queryParams.userPageOrgInParam.orgId = queryParams?.orgId || queryParams.userPageOrgInParam.orgId;
    delete queryParams?.orgId;
    listUser(queryParams)
      .then((res) => {
        tableData.value = res.data.items.map((item) => {
          item.orgName = item.org?.orgName;
          return item;
        });
        total.value = res.data.total;
      })
      .finally(() => {
        loading.value = false;
      });
  };
  const cancel = () => {
    proxy.$refs["userFormRef"].baseFormRef.resetForm();
  };
  const confirm = () => {
    proxy.$refs["userFormRef"].baseFormRef.validate((valid) => {
      if (valid) {
        proxy.$refs["userFormRef"].form.orgType = userOrgType;
        if (proxy.$refs["userFormRef"].form.id) {
          updateUser(proxy.$refs["userFormRef"].form).then((res) => {
            proxy.$modal.msgSuccess("修改成功");
            proxy.$refs["baseDialogRef"].close();
            getList();
          });
        } else {
          addUser(proxy.$refs["userFormRef"].form).then((res) => {
            proxy.$modal.msgSuccess("添加成功");
            proxy.$refs["baseDialogRef"].close();
            getList();
          });
        }
      }
    });
  };
  // 向外部提供东西
  return { tableData, title, loading, total, queryParams, handleQuery, resetQuery, showPwd, addUserInfo, delUserInfo, editRow, resetPwd, cancel, confirm, getList }
}