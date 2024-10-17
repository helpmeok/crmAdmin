import request from '@/utils/request'

// 获取树列表
export function getFactoryOrgTree(params) {
  return request({
    url: '/api/FactoryOrg/GetTree',
    method: 'get',
    params
  })
}
// 获取单条记录
export function getFactoryOrgById(params) {
  return request({
    url: '/api/FactoryOrg/GetById',
    method: 'get',
    params
  })
}

// 获取下拉
export function listAllFactoryOrg(data) {
  return request({
    url: '/api/FactoryOrg/GetAll',
    method: 'post',
    data: data,
  })
}
// 获取列表
export function listFactoryOrg(data) {
  return request({
    url: '/api/FactoryOrg/Get',
    method: 'post',
    data: data,
  })
}
// 保存
export function saveFactoryOrg(data) {
  return request({
    url: '/api/FactoryOrg/Save',
    method: 'post',
    data: data,
  })
}
// 删除
export function delFactoryOrg(params) {
  return request({
    url: '/api/FactoryOrg/Del',
    method: 'post',
    params
  })
}
