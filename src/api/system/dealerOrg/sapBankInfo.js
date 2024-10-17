import request from '@/utils/request'

// 根据id获取单条信息
export function getBankInfoById(params) {
  return request({
    url: '/api/SAPBankInfo/GetById',
    method: 'get',
    params
  })
}

// 获取列表
export function listBankInfo(data) {
  return request({
    url: '/api/SAPBankInfo/Get',
    method: 'post',
    data: data,
  })
}
// 保存银行信息
export function saveBankInfo(data) {
  return request({
    url: '/api/SAPBankInfo/Save',
    method: 'post',
    data: data,
  })
}
// 删除银行信息
export function delBankInfo(data) {
  return request({
    url: '/api/SAPBankInfo/Del',
    method: 'post',
    data: data,
  })
}
// 更改银行信息状态
export function updateBankInfoStatus(data) {
  return request({
    url: '/api/SAPBankInfo/EditStatus',
    method: 'post',
    data: data,
  })
}

// 更改银行信息审核状态
export function updateBankInfoAudit(data) {
  return request({
    url: '/api/SAPBankInfo/EditAuditStatus',
    method: 'post',
    data: data,
  })
}