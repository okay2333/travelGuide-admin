import request from '@/utils/request'

/**
 * 创建预约表（仅管理员）
 * @param data
 * @returns
 */
export function addReservations(data: any): Promise<any> {
  return request({
    url: '/reservations/add',
    method: 'post',
    data
  })
}

/**
 * 删除预约表（仅管理员）
 * @param data
 * @returns
 */
export function deleteReservations(data: any): Promise<any> {
  return request({
    url: '/reservations/delete',
    method: 'post',
    data
  })
}

/**
 * 更新预约表（仅管理员）
 * @param data
 * @returns
 */
export function updateReservations(data: any): Promise<any> {
  return request({
    url: '/reservations/update',
    method: 'post',
    data
  })
}

/**
 * 根据 id 获取预约表
 * @param id
 * @returns
 */
export function getReservationsVOById(id: number): Promise<any> {
  return request({
    url: `/reservations/get/vo`,
    method: 'get',
    params: { id }
  })
}

/**
 * 分页获取预约表列表
 * @param queryParams
 * @returns
 */
export function listReservationsVOByPage(queryParams: any): Promise<any> {
  return request({
    url: '/reservations/list/page/vo',
    method: 'post',
    data: queryParams
  })
}

/**
 * 查询所有开放日期
 * @returns
 */
export function listOpenDateTime(): Promise<any> {
  return request({
    url: '/reservations/listOpenDateTime',
    method: 'post'
  })
}