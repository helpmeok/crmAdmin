import request from '@/utils/request'

export function listAllType(data) {
  return request({
    url: '/api/SysDictType/GetAll',
    method: 'post',
    data: data,
  })
}
// 查询字典类型列表
export function listType(data) {
  return request({
    url: '/api/SysDictType/list',
    method: 'post',
    data: data,
  })
}

// 查询字典类型详细
export function getType(dictId) {
  return request({
    url: '/api/SysDictType/' + dictId,
    method: 'get'
  })
}

// 新增字典类型
export function addType(data) {
  return request({
    url: '/api/SysDictType/Add',
    method: 'post',
    data: data
  })
}

// 修改字典类型
export function updateType(data) {
  return request({
    url: '/api/SysDictType/Update',
    method: 'post',
    data: data
  })
}

// 删除字典类型
export function delType(data) {
  return request({
    url: '/api/SysDictType/Delete',
    method: 'post',
    data: data
  })
}

