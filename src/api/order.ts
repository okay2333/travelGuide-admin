import request from '@/utils/request'

/**
 * 分页获取订单列表
 * @param queryParams
 * @returns
 */
export function listOrdersVOByPage(queryParams: any): Promise<any> {
  return request({
    url: '/orders/list/page/vo',
    method: 'post',
    data: queryParams
  })
}

/**
 * 创建订单
 * @param data
 * @returns
 */
export function addOrder(data: any): Promise<any> {
  return request({
    url: '/orders/add',
    method: 'post',
    data
  })
}

/**
 * 删除订单
 * @param data
 * @returns
 */
export function deleteOrder(data: any): Promise<any> {
  return request({
    url: '/orders/delete',
    method: 'post',
    data
  })
}

/**
 * 更新订单
 * @param data
 * @returns
 */
export function updateOrder(data: any): Promise<any> {
  return request({
    url: '/orders/update',
    method: 'post',
    data
  })
}

/**
 * 根据 id 获取订单
 * @param id
 * @returns
 */
export function getOrderById(id: number): Promise<any> {
  return request({
    url: `/orders/get`,
    method: 'get',
    params: { id }
  })
}