import request from '@/utils/request'

/**
 * 创建预约表（仅管理员）
 * @param data
 * @returns
 */
export function addTicket(data: any): Promise<any> {
  return request({
    url: '/ticket/add',
    method: 'post',
    data
  })
}

/**
 * 删除预约表
 * @param data
 * @returns
 */
export function deleteTicket(data: any): Promise<any> {
  return request({
    url: '/ticket/delete',
    method: 'post',
    data
  })
}

/**
 * 更新预约表（仅管理员）
 * @param data
 * @returns
 */
export function updateTicket(data: any): Promise<any> {
  return request({
    url: '/ticket/update',
    method: 'post',
    data
  })
}

/**
 * 根据 id 获取预约表
 * @param id
 * @returns
 */
export function getTicketVOById(id: number): Promise<any> {
  return request({
    url: `/ticket/get/vo`,
    method: 'get',
    params: { id }
  })
}

/**
 * 分页获取预约表列表
 * @param queryParams
 * @returns
 */
export function listTicketByPage(queryParams: any): Promise<any> {
  return request({
    url: '/ticket/list/page/vo',
    method: 'post',
    data: queryParams
  })
}