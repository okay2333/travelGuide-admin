import request from '@/utils/request'

export function listPostVOByPage(data: any): Promise<any> {
  return request({
    url: '/post/list/page/vo',
    method: 'post',
    data
  })
}

export function getPostVOById(id: number): Promise<any> {
  return request({
    url: `/post/get/vo`,
    params: { id }
  })
}