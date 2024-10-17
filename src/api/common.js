import request from '@/utils/request'

// 获取省市区
export function getRegionTree() {
  return request({
    url: '/api/Region/GetRegionTree',
    method: 'get'
  })
}
// 获取单个文件
export function getFileById(params) {
  return request({
    url: '/api/FileStorage/GetById',
    method: 'get',
    params
  })
}
// 获取文件列表
export function getFileList(data) {
  return request({
    url: '/api/FileStorage/GetList',
    method: 'post',
    data
  })
}
// 上传文件
export function uploadFile(data) {
  return request({
    url: '/api/FileStorage/UploadFile',
    method: 'post',
    data
  })
}
// 下载文件
export function downLoadFile(data) {
  return request({
    url: '/api/FileStorage/DownLoadFile',
    method: 'post',
    responseType: 'blob',
    data
  })
}
// 删除文件
export function delFile(data) {
  return request({
    url: '/api/FileStorage/Del',
    method: 'post',
    data
  })
}
