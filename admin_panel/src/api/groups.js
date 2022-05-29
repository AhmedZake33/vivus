import Resource from './resource';
import request from '../utils/request';

class Groups extends Resource {
  constructor() {
    super('group');
  }

  get(payload) {
    return request({
      url: `/groups${payload.id ? `/${payload.id}` : ''}`,
      method: 'get',
    });
  }
  addSubToGroup(query) {
    return request({
      url: `/groups/submissions`,
      method: 'post',
      data: query.query,
    });
  }
  actionGroup(payload) {
    return request({
      url: `/groups/action/${payload.id}`,
      method: 'post',
      data:payload.query
    });
  }
  removeSubmission(id) {
    return request({
      url: `/groups/submission/remove/${id}`,
      method: 'post',
    });
  }


  delete(id) {
    return request({
      url: `/groups/remove/${id}`,
      method: 'DELETE',
    });
  }

  save(payload) {
    return request({
      url: `/groups/save${payload.id ? `/${payload.id}` : ''}`,
      method: 'PUT',
      data: payload.query,
    });
  }

}

export { Groups as default };
