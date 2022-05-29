import Resource from '../api/resource';
import request from '../utils/request';

class Organizations extends Resource {
  constructor() {
    super('organization');
  }

  get(payload) {
    return request({
      url: `/organizations${payload.id ? `/${payload.id}` : ''}`,
      method: 'get',
      params:payload.query
    });
  }
  saveDepartment(id , query) {
    return request({
      url: `/organizations/department/save${id}`,
      method: 'post',
      data: query,
    });
  }

  deleteDepartment(id) {
    return request({
      url: `/organizations/department/delete/${id}`,
      method: 'post',
    });
  }

  saveProgram(id , query) {
    return request({
      url: `/organizations/program/save${id}`,
      method: 'post',
      data: query,
    });
  }

  deleteProgram(id) {
    return request({
      url: `/organizations/program/delete/${id}`,
      method: 'post',
    });
  }


  delete(id, query ) {
    return request({
      url: `/organizations/organization/${id}`,
      method: 'post',
      params: query,
    });
  }

  save(payload) {
    return request({
      url: `/organizations/submission/save${payload.id ? `/${payload.id}` : ''}`,
      method: 'post',
      params: payload.query,
    });
  }

  names(resource) {
    return request({
      url: `/organizations/names`,
      method: 'post',
      data: resource,
    });
  }
}

export { Organizations as default };
