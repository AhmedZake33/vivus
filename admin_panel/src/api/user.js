import Resource from '../api/resource';
import request from '../utils/request';

class User extends Resource {
  constructor() {
    super('user');
  }

  listContact(query) {
    return request({
      url: '/contacts',
      method: 'post',
      params: query,
    });
  }
  excused(payload) {
    return request({
      url: `user/available/${payload.id}`,
      method: 'post',
      data: payload.query,
    });
  }
  qualificationsSearch(payload) {
    return request({
      url: `qualifications/names`,
      method: 'post',
      data: payload.query,
    });
  }

  removeRecovery(id) {
    return request({
      url: `recovery/delete/${id}`,
      method: 'post',
    });
  }
  applyTo(query) {
    return request({
      url: `user/apply/${query.id}`,
      method: 'post',
      data: query.query,
    });
  }

  resetUser(id) {
    return request({
      url: `/user/reset/${id}`,
      method: 'post',
    });
  }

  getTasks(payload) {
    return request({
      url: `/user/tasks${payload.id ? `/${payload.id}` : ''}`,
      method: 'post',
      params: payload.query,
    });
  }
  active(query) {
    return request({
      url: '/user/verify',
      method: 'post',
      params: query,
    });
  }
  recoveryactive(query) {
    return request({
      url: '/recovery/verify',
      method: 'post',
      params: query,
    });
  }
  approve(user) {
    return request({
      url: `user/activate/${user}`,
      method: 'put',
    });
  }
  Recovery(user) {
    return request({
      url: `add/user/resolved`,
      method: 'post',
      data: user,
    });
  }

  restore(user, recovery) {
    return request({
      url: `user/restore/${user}/${recovery}`,
      method: 'post',
    });
  }

  reset(query) {
    return request({
      url: `reset`,
      method: 'post',
      params: query,
    });
  }

  resetPassword(query) {
    return request({
      url: `/resetPassword`,
      method: 'post',
      params: query,
    });
  }

  questions(id, query) {
    return request({
      url: `/user/evaluation/${id}`,
      method: 'post',
      params: query,
    });
  }

  contact(id) {
    return request({
      url: `/contact/${id}`,
      method: 'post',
    });
  }

  archive(id, query) {
    return request({
      url: `/user/archive/${id}`,
      method: 'get',
      params: query,
    });
  }

  notifications(query) {
    return request({
      url: `user/notifications`,
      method: 'post',
      params: query,
    });
  }

  seen(id) {
    return request({
      url: `user/notifications/see/${id}`,
      method: 'post',
    });
  }

  deleteNotification(id) {
    return request({
      url: `notification/delete/${id}`,
      method: 'delete',
    });
  }

  deleteAllNotification() {
    return request({
      url: `notifications/all/delete`,
      method: 'post',
    });
  }
}

export { User as default };
