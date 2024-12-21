import request from '@/utils/request';

// 请求参数类型定义
export interface FeedBackAddRequest {
  title: string;
  content: string;
  realName: string;
  phone: string;
}

export interface FeedBackUpdateRequest {
  id: number;
  status: string; // "0": 未处理, "1": 已处理
}

export interface FeedBackQueryRequest {
  current: number;
  pageSize: number;
  title?: string;
  status?: string;
  userAccount?: string;
}

export interface DeleteRequest {
  id: number;
}

// 反馈信息类型
export interface FeedBackVO {
  id: string;
  title: string;
  content: string;
  status: string;
  userId: string;
  fullName: string;
  phoneNumber: string;
  createTime: string;
  updateTime: string;
  user: any;
}

// 修改返回类型定义
interface PageResult<T> {
  records: T[];
  total: string;
  size: string;
  current: string;
  pages: string;
}

interface BaseResponse<T> {
  code: number;
  data: T;
  message: string;
}

// 添加反馈
export function addFeedBack(data: FeedBackAddRequest) {
  return request.post('/feedback/add', data);
}

// 删除反馈
export function deleteFeedBack(data: DeleteRequest) {
  return request.post('/feedback/delete', data);
}

// 更新反馈状态
export function updateFeedBack(data: FeedBackUpdateRequest) {
  return request.post('/feedback/update', data);
}

// 根据 ID 获取反馈详情
export function getFeedBackById(id: number) {
  return request.get('/feedback/get/vo', { params: { id } });
}

// 分页获取反馈列表
export function listFeedBackByPage(data: FeedBackQueryRequest) {
  return request.post<BaseResponse<PageResult<FeedBackVO>>>('/feedback/list/page/vo', data);
}

// 获取当前用户的反馈列表
export function listMyFeedBack() {
  return request.post('/feedback/list/my/page/vo');
}