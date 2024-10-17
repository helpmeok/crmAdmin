import request from '@/utils/request'
export function listFundProportion(data) {
  return request({
    url: '/api/FundProportion/GetList',
    method: 'post',
    data
  })
}

export function getFundProportionById(params) {
  return request({
    url: '/api/FundProportion/GetById',
    method: 'get',
    params
  })
}
export function saveFundProportion(data) {
  return request({
    url: '/api/FundProportion/Save',
    method: 'post',
    data
  })
}