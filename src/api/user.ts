import request from '@/utils/request'

export function login(data: any) {
  return request({
    url: '/user/login/admin',
    method: 'post',
    data
  })
}

export function getUserInfo(): Promise<any> {
  return request({
    url: '/user/get/login'
  })
}


/**
 * 分页获取用户列表
 */
export function listUserByPage(queryParams: any): Promise<any> {
  return request({
    url: '/user/list/page',
    method: 'post',
    data:queryParams
  })
}

/**
 * 根据 id 获取用户（仅管理员）
 */
export function getUserById(id: number): Promise<any> {
  return request({
    url: `/user/get`,
    params: { id }
  })
}
/**
 * 更新用户（仅管理员）
 */
export function updateUser(data: object): Promise<any> {
  return request({
    url: '/user/update',
    method: 'post',
    data
  })
}
/**
 * 更新密码
 * **/
export function updatePassword(data: object) {
  return request({
    url: '/sys/user/updatePass',
    method: 'put',
    data
  })
}
