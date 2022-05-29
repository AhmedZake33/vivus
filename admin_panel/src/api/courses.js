import Resource from '../api/resource';
import request from '../utils/request';

class courses extends Resource {
  constructor() {
    super('course');
  }

  courses(query) {
    return request({
      url: `/courses/index`,
      method: 'post',
      params: query,
    });
  }

  plans(query) {
    return request({
      url: `/plans/index`,
      method: 'post',
      params: query,
    });
  }
  
  getEvaluation(query) {
    return request({
      url: `/plans/user/evaluation/${query.id}`,
      method: 'post',
      data:query.query
    });
  }
  places(query) {
    return request({
      url: `/plans/places`,
      method: 'post',
      params: query,
    });
  }

  reservations(query) {
    return request({
      url: `/plans/submissions`,
      method: 'post',
      params: query,
    });
  }

  get(payload) {
    return request({
      url: `/courses${payload.id ? `/${payload.id}` : ''}`,
      method: 'get',
      params: payload.query,
    });
  }

  plan(payload) {
    return request({
      url: `/plans/show${payload ? `/${payload}` : ''}`,
      method: 'get',
    });
  }

  submission(payload) {
    return request({
      url: `/plans/submission${payload ? `/${payload}` : ''}`,
      method: 'get',
    });
  }

  course(payload) {
    return request({
      url: `/courses/show${payload ? `/${payload}` : ''}`,
      method: 'get',
    });
  }

  getPlan(payload) {
    return request({
      url: `/plans/edit${payload ? `/${payload}` : ''}`,
      method: 'post',
    });
  }

  getCourse(payload) {
    return request({
      url: `/courses/edit${payload ? `/${payload}` : ''}`,
      method: 'post',
    });
  }

  delete(id, query) {
    return request({
      url: `/courses/course/${id}`,
      method: 'post',
      params: query,
    });
  }

  deletePlan(id, query) {
    return request({
      url: `/plans/delete/${id}`,
      method: 'DELETE',
      params: query,
    });
  }
  deletePlace(id) {
    return request({
      url: `/place/delete/${id}`,
      method: 'DELETE',
    });
  }
  savePlace(payload) {
    return request({
      url: `/place/save${payload.id ? `/${payload.id}` : ''}`,
      method: 'post',
      params: payload.query,
    });
  }
  save(payload) {
    return request({
      url: `/courses/submission/save${payload.id ? `/${payload.id}` : ''}`,
      method: 'post',
      params: payload.query,
    });
  }

  saveNotes(payload) {
    return request({
      url: `/plans/notes${payload.id ? `/${payload.id}` : ''}`,
      method: 'post',
      data: payload.query,
    });
  }

  savePlan(payload) {
    return request({
      url: `/plans/save${payload.id ? `/${payload.id}` : ''}`,
      method: 'put',
      data: payload.query,
    });
  }

  addTrainers(payload) {
    return request({
      url: `/plans/add_trainers${payload.id ? `/${payload.id}` : ''}`,
      method: 'post',
      data: payload.query,
    });
  }

  deleteCourse(id, query) {
    return request({
      url: `/courses/delete/${id}`,
      method: 'DELETE',
      params: query,
    });
  }

  booking(id, query) {
    return request({
      url: `/plans/reservation/${id}`,
      method: 'POST',
    });
  }

  saveEvaluation(payload) {
    return request({
      url: `/plans/submission/evaluation/save/${payload.submission}${payload.answer ? `/${payload.answer}` : ''}`,
      method: 'post',
      data: payload.data,
    });
  }

  sync_lms(id) {
    return request({
      url: `plans/sync/lms/${id}`,
      method: 'post',
    });
  }

  saveCourse(payload) {
    return request({
      url: `/courses/save${payload.id ? `/${payload.id}` : ''}`,
      method: 'post',
      data: payload.query,
    });
  }
}

export { courses as default };
