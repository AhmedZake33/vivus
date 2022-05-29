import Resource from '../api/resource';
import request from '../utils/request';

class Statistics extends Resource {
  constructor() {
    super('statistic');
  }

  get(query) {
    return request({
      url: '/statistics',
      method: 'get',
      params: query,
    });
  }

  organizations(query) {
    return request({
      url: '/statistics/organizations',
      method: 'get',
      params: query,
    });
  }

  submissions(organization_id = '') {
    return request({
      url: `/organization/submissions${organization_id}`,
      method: 'get',
    });
  }

  decisions(query) {
    return request({
      url: `/statistics/decisions`,
      method: 'get',
      params: query,
    });
  }

  activities(query) {
    return request({
      url: `/statistics/activities`,
      method: 'get',
      params: query,
    });
  }

  userActivities(query) {
    return request({
      url: `/statistics/user/activities`,
      method: 'post',
      params: query,
    });
  }

  locations() {
    return request({
      url: '/locations',
      method: 'get',
    });
  }
}

export { Statistics as default };
