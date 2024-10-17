import request from '@/utils/request'
export function listBankView(data) {
  return request({
    url: '/api/BankAuditRecord/GetList',
    method: 'post',
    data
  })
}
export function listBankAuditRecord(data) {
  return request({
    url: '/api/BankAuditRecord/GetAuditRecord',
    method: 'post',
    data
  })
}

export function saveBankAuditRecord(data) {
  return request({
    url: '/api/BankAuditRecord/Save',
    method: 'post',
    data
  })
}