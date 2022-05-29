import Resource from './resource';
import request from '../utils/request';

class evaluationNotes extends Resource {
  constructor() {
    super('evaluation');
  }

  list(organization, query) {
    return request({
      url: `/evaluations/${organization}`,
      method: 'post',
      params: query,
    });
  }
  changeSubState(payload) {
    return request({
      url: `/evaluation/reports/change/${payload.id}`,
      method: 'post',
      data: payload.query,
    });
  }
  get(evaluation) {
    return request({
      url: `/evaluation/reports/notes/${evaluation}`,
      method: 'get',
    });
  }

  itemsList(evaluation, query) {
    return request({
      url: `/evaluation/items/${evaluation}`,
      method: 'post',
      params: query,
    });
  }

  item(evaluation, item) {
    return request({
      url: `/evaluation/report/${evaluation}/${item}`,
      method: 'post',
    });
  }

  decision(evaluation) {
    return request({
      url: `/evaluation/decisions/${evaluation}`,
      method: 'post',
    });
  }

  questions(evaluation_id, query) {
    return request({
      url: `evaluation/form/${evaluation_id}`,
      method: 'post',
      data: query,
    });
  }

  saveEvaluation(evaluation) {
    return request({
      url: `/evaluation/save/${evaluation.evaluation_id}`,
      method: 'post',
      data: evaluation.query,
    });
  }
  editDecision(payload) {
    return request({
      url: `evaluation/update/decision${payload.id ? '/' + payload.id : ''}`,
      method: 'post',
      data: payload.query,
    });
  }
  getEvaluation(evaluation) {
    return request({
      url: `/evaluation/${evaluation.evaluation_id}/${evaluation.question_id}`,
      method: 'get',
    });
  }
}

export { evaluationNotes as default };
