import request from '@/utils/request'

export function addScenic(scenicAddRequest: any) {
  return request({
    url: '/scenic/add',
    method: 'post',
    data:scenicAddRequest
  })
}

export function deleteScenic(deleteRequest:any) {
  return request({
    url: '/scenic/get/login',
    method: 'post',
    data:deleteRequest
  })
}


export function updateScenic(scenicUpdateRequest:any) {
  return request({
    url: '/scenic/update',
    method: 'post',
    data:scenicUpdateRequest
  })
}

/**
 * 根据 id 获取用户（仅管理员）
 */
export function getScenicById(id: number): Promise<any> {
  return request({
    url: `/scenic/get`,
    params: { id }
  })
}

/**
 * 根据 id 获取用户封装类（仅管理员）
 */
export function getScenicVOById(id: number): Promise<any> {
  return request({
    url: `/scenic/get/vo`,
    params: { id }
  })
}

/**
 * 分页获取用户列表
 */
export function listScenicVOByPage(queryParams: any): Promise<any> {
  return request({
    url: '/scenic/list/page/vo',
    method: 'post',
    data:queryParams
  })
}


