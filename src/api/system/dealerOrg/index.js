import request from '@/utils/request'

// 获取树列表
export function getDealerOrgTree(params) {
  return request({
    url: '/api/DealerOrg/GetTree',
    method: 'get',
    params
  })
}
// 获取组织编码
export function getGenerateOrgCode(params) {
  return request({
    url: '/api/DealerOrg/GenerateOrgCode',
    method: 'get',
    params
  })
}
// 获取单条记录经销商
export function getDealerOrgById(params) {
  return request({
    url: '/api/DealerOrg/GetDealerOrgById',
    method: 'get',
    params
  })
}
// 获取单条记录区域
export function getAreaCompanyById(params) {
  return request({
    url: '/api/DealerOrg/GetAreaCompanyById',
    method: 'get',
    params
  })
}
// 获取单条记录门店
export function getStoreById(params) {
  return request({
    url: '/api/DealerOrg/GetStoreById',
    method: 'get',
    params
  })
}

// 获取下拉
export function listAllDealerOrg(data) {
  return request({
    url: '/api/DealerOrg/GetAll',
    method: 'post',
    data: data,
  })
}
// 获取列表
export function listDealerOrg(data) {
  return request({
    url: '/api/DealerOrg/Get',
    method: 'post',
    data: data,
  })
}
// 保存经销商
export function saveDealerOrg(data) {
  return request({
    url: '/api/DealerOrg/SaveDealerOrg',
    method: 'post',
    data: data,
  })
}
// 保存区域公司
export function saveAreaCompany(data) {
  return request({
    url: '/api/DealerOrg/SaveAreaCompany',
    method: 'post',
    data: data,
  })
}
// 保存门店
export function saveStore(data) {
  return request({
    url: '/api/DealerOrg/SaveStore',
    method: 'post',
    data: data,
  })
}
// 删除
export function delDealerOrg(params) {
  return request({
    url: '/api/DealerOrg/Del',
    method: 'post',
    params
  })
}
// 编辑SAP组织编码
export function updateSapOrgCode(data) {
  return request({
    url: '/api/DealerOrg/UpdateSapOrgCode',
    method: 'post',
    data
  })
}
