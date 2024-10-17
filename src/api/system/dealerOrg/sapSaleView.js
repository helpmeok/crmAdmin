import request from '@/utils/request'

// 根据id获取单条信息
export function getSaleViewById(params) {
  return request({
    url: '/api/SAPSaleView/GetById',
    method: 'get',
    params
  })
}

// 获取列表
export function listSaleView(data) {
  return request({
    url: '/api/SAPSaleView/Get',
    method: 'post',
    data: data,
  })
}
// 保存销售视图
export function saveSaleView(data) {
  return request({
    url: '/api/SAPSaleView/Save',
    method: 'post',
    data: data,
  })
}
// 删除销售视图
export function delSaleView(data) {
  return request({
    url: '/api/SAPSaleView/Del',
    method: 'post',
    data: data,
  })
}
// 更改销售视图
export function updateSaleViewStatus(data) {
  return request({
    url: '/api/SAPSaleView/EditStatus',
    method: 'post',
    data: data,
  })
}

