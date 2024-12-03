import request from '@/utils/request';

export interface ArticleAddRequest {
  title: string;
  content: string;
  coverUrl?: string;
  // 其他字段
}

export interface ArticleUpdateRequest {
  id: number;
  title: string;
  content: string;
  coverUrl?: string;
  // 其他字段
}

export interface ArticleQueryRequest {
  current: number;
  pageSize: number;
  title?: string;
  // 其他查询条件
}

export interface DeleteRequest {
  id: number;
}

// 创建文章
export function addArticle(data: ArticleAddRequest) {
  return request.post('/article/add', data);
}

// 删除文章
export function deleteArticle(data: DeleteRequest) {
  return request.post('/article/delete', data);
}

// 更新文章
export function updateArticle(data: ArticleUpdateRequest) {
  return request.post('/article/update', data);
}

// 根据 ID 获取文章
export function getArticleById(id: number) {
  return request.get(`/article/get/vo`, { params: { id } });
}

// 分页获取文章列表
export function listArticleByPage(data: ArticleQueryRequest) {
  return request.post('/article/list/page', data);
}