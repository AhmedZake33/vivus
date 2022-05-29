import Resource from '../api/resource';
import request from '../utils/request';

class Evaluation extends Resource {
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

  get(evaluation) {
    return request({
      url: `/evaluation/${evaluation}`,
      method: 'post',
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
  removeSignature(evaluation_id) {
    return request({
      url: `/evaluation/cancel_signature/${evaluation_id}`,
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

  preQuestions(evaluation_id, query) {
    return request({
      url: `evaluation/pre/form/${evaluation_id}`,
      method: 'post',
      data: query,
    });
  }

  getCouncil(payload) {
    return request({
      url: `/evaluation/council/${payload.id}`,
      method: 'post',
      data: payload.query,
    });
  }

  getPreCouncil(payload) {
    return request({
      url: `/evaluation/pre/council/${payload.id}`,
      method: 'post',
      data: payload.query,
    });
  }

  initDecision(id, query) {
    return request({
      url: `evaluation/init/${id}`,
      method: 'post',
      data: query,
    });
  }

  saveProgram(id, query) {
    return request({
      url: `/evaluation/program/save${id}`,
      method: 'post',
      data: query,
    });
  }

  deleteProgram(id) {
    return request({
      url: `/evaluation/program/delete/${id}`,
      method: 'post',
    });
  }

  saveEvaluation(evaluation) {
    return request({
      url: `/evaluation/save/${evaluation.evaluation_id}`,
      method: 'post',
      data: evaluation.query,
    });
  }
  saveMemberEvaluation(payload) {
    return request({
      url: `teams/add/evaluation/${payload.id}/${payload.member}`,
      method: 'post',
      data: payload.data,
    });
  }
  getEvaluation(evaluation) {
    return request({
      url: `/evaluation/${evaluation.evaluation_id}/${evaluation.question_id}`,
      method: 'get',
    });
  }
  getPreEvaluation(evaluation) {
    return request({
      url: `/evaluation/pre/questions/${evaluation.question_id}`,
      method: 'post',
    });
  }
  getPreReportsEvaluation(evaluation) {
    return request({
      url: `evaluation/pre/reports/${evaluation.evaluation_id}/${evaluation.question_id}`,
      method: 'post',
    });
  }
  getTeamEvaluations(data) {
    return request({
      url: `teams/member/evaluation/${data.submission}/${data.member}`,
      method: 'post',
    });
  }
}

export { Evaluation as default };
