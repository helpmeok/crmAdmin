import request from '@/utils/request'
export function listFinancialDetail(data) {
  return request({
    url: '/api/FinancialDetail/GetList',
    method: 'post',
    data
  })
}
export function getPreDepositRecordInfo(data) {
  return request({
    url: '/api/PreDepositRecord/GetHeadInfo',
    method: 'post',
    data
  })
}
export function listPreDepositRecord(data) {
  return request({
    url: '/api/PreDepositRecord/GetList',
    method: 'post',
    data
  })
}
export function savePreDepositRecord(data) {
  return request({
    url: '/api/PreDepositRecord/Save',
    method: 'post',
    data
  })
}


export function listCreditQuota(data) {
  return request({
    url: '/api/CreditQuota/GetList',
    method: 'post',
    data
  })
}

export function saveCreditQuota(data) {
  return request({
    url: '/api/CreditQuota/Save',
    method: 'post',
    data
  })
}
export function listFundRecord(data) {
  return request({
    url: '/api/FundRecord/GetList',
    method: 'post',
    data
  })
}

export function saveFundRecord(data) {
  return request({
    url: '/api/FundRecord/Save',
    method: 'post',
    data
  })
}



