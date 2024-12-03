import request from '@/utils/request'

/**
 * 创建 VR 旅游
 * @param data
 * @returns
 */
export function addVRTour(data: any): Promise<any> {
  return request({
    url: '/vrtour/add',
    method: 'post',
    data
  })
}

/**
 * 删除 VR 旅游（仅管理员）
 * @param data
 * @returns
 */
export function deleteVRTour(data: any): Promise<any> {
  return request({
    url: '/vrtour/delete',
    method: 'post',
    data
  })
}

/**
 * 更新 VR 旅游（仅管理员）
 * @param data
 * @returns
 */
export function updateVRTour(data: any): Promise<any> {
  return request({
    url: '/vrtour/update',
    method: 'post',
    data
  })
}

/**
 * 根据 id 获取 VR 旅游
 * @param id
 * @returns
 */
export function getVRTourById(id: number): Promise<any> {
  return request({
    url: `/vrtour/get`,
    method: 'get',
    params: { id }
  })
}

/**
 * 分页获取 VR 旅游列表
 * @param queryParams
 * @returns
 */
export function listVRTourByPage(queryParams: any): Promise<any> {
  return request({
    url: '/vrtour/list/page',
    method: 'post',
    data: queryParams
  })
}