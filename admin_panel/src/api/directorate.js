import Resource from './resource';
import request from '../utils/request';

class Directorate extends Resource {
  constructor() {
    super('directorate');
  }

  list() {
    return request({
      url: `/lookup/directorates`,
      method: 'get',
    });
  }
  getMyGovernment(payload){
    return request({
      url: `user/sync/directorates/${payload.id}`,
      method: 'post',
      data: payload.query,
    });
  }
  schools(parent_id) {
    return request({
      url: `/lookup/schools`,
      method: 'post',
      data: parent_id,
    });
  }

  get(parent_id) {
    return request({
      url: `/lookup/institutes/${parent_id}`,
      method: 'get',
    });
  }

  listInstitutes(parent_id) {
    return request({
      url: `/lookup/institutes`,
      method: 'post',
      data: parent_id,
    });
  }
}

export { Directorate as default };
