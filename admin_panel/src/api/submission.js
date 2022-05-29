import Resource from '../api/resource';
import request from '../utils/request';
import store from '../store/store';

class Submission extends Resource {
  constructor() {
    super('submission');
  }

  get(id) {
    return request({
      url: `/submissions/${id}`,
      method: 'get',
    });
  }

  move(query) {
    return request({
      url: `/move/${query.submission}/${query.stage}`,
      method: 'post',
    });
  }

  subSetting(query) {
    return request({
      url: `stage/index`,
      method: 'post',
      params: query,
    });
  }

  SCactiveSubmission(query) {
    return request({
      url: `submissions/pre/submission/active/${query.id}`,
      method: 'post',
      data: query.query,
    });
  }

  getPre(id) {
    return request({
      url: `/submissions/pre/${id}`,
      method: 'get',
    });
  }

  showUpload(query) {
    return request({
      url: `/submissions/file/allow/${query.id}`,
      method: 'post',
      params: query.query,
    });
  }

  split(id, query) {
    return request({
      url: `/submissions/split/${id}`,
      method: 'post',
      params: query,
    });
  }
  exportSubPdf(payload){
    return request({
      url: `/submissionsQuery`,
      method: 'post',
      responseType: 'blob',
      params:payload.query
    });
  }
  exportSubWord(payload){
    return request({
      url: `/word/submissionsQuery`,
      method: 'post',
      responseType: 'blob',
      params:payload.query
    });
  }
  exportHEPdf(payload) {
    return request({
      url: `/${payload.type}`,
      responseType: 'blob',
      method: 'post',
      params:payload.query
    });
  }
  groupWord(payload) {
    return request({
      url: `/word/MembersConfirmQuery`,
      responseType: 'blob',
      method: 'post',
      params:payload.query
    });
  }
  groupPdf(payload) {
    return request({
      url: `/MembersConfirmQuery`,
      responseType: 'blob',
      method: 'post',
      params:payload.query
    });
  }

  groupSubmissions(id) {
    return request({
      url: `/submissions/group/${id}`,
      method: 'get',
    });
  }

  edit(query) {
    return request({
      url: `/submissions/submission/edit${query.id ? '/' + query.id : ''}`,
      method: 'post',
      data: query.query,
    });
  }

  SCedit(query) {
    return request({
      url: `/submissions/pre/edit${query.id ? '/' + query.id : ''}`,
      method: 'post',
      data: query.query,
    });
  }

  undoRedo(type, submission) {
    return request({
      url: `submissions/undoRedo/${type}/${submission}`,
      method: 'post',
    });
  }

  PreundoRedo(type, submission) {
    return request({
      url: `submissions/pre/undoRedo/${type}/${submission}`,
      method: 'post',
    });
  }

  followVisit(id) {
    return request({
      url: `submissions/follow/${id}`,
      method: 'post',
    });
  }

  changeDisabilityStatus(evaluation) {
    return request({
      url: `submissions/disability/change/${evaluation}`,
      method: 'post',
    });
  }

  export(query) {
    return request({
      url: `submissions/export/file`,
      method: 'get',
      responseType: 'blob',
      params: query,
    });
  }

  teamState(query) {
    return request({
      url: `/teams/excused/${query.id}`,
      method: 'post',
      data: query.query,
    });
  }

  saveTeam(payload) {
    return request({
      url: `/teams/save${payload.id ? `/${payload.id}` : ''}`,
      method: 'post',
      data: payload.query,
    });
  }
  saveEnhancement(payload) {
    return request({
      url: `evaluation/pre/enhancement${payload.id}`,
      method: 'post',
      data: payload.query,
    });
  }
  saveStandards(payload) {
    return request({
      url: `evaluation/pre/data/standards${payload.id}`,
      method: 'post',
      data: payload.query,
    });
  }
  saveFinance(payload) {
    return request({
      url: `/Finance/submission/save/${payload.id}`,
      method: 'post',
      data: payload.query,
      onUploadProgress: function (progressEvent) {
        store.commit('SET_UPLOAD_PROGRESS', parseInt(Math.round((progressEvent.loaded / progressEvent.total) * 100)));
      }.bind(store),
    });
  }

  getDocument(evaluation_id) {
    return request({
      url: `/document/evaluation/attachments/${evaluation_id}`,
      method: 'get',
    });
  }

  deleteDoc(id) {
    return request({
      url: `/document/delete/${id}`,
      method: 'delete',
    });
  }

  editDoc(payload) {
    return request({
      url: `/document/save${payload.id ? '/' + payload.id : ''}`,
      method: 'put',
      data: payload.query,
    });
  }

  getStatisticsData(id) {
    return request({
      url: `/evaluation/activities/${id}`,
      method: 'post',
    });
  }

  getSCStatisticsData(id) {
    return request({
      url: `/evaluation/pre/statistics/${id}`,
      method: 'post',
    });
  }

  getStandards(id, data) {
    return request({
      url: `/evaluation/pre/standards/${id}`,
      method: 'post',
      data: data,
    });
  }

  saveNote(id, data) {
    return request({
      url: `/evaluation/note/save${id}`,
      method: 'post',
      data: data,
    });
  }

  saveStatisticStaff(data) {
    return request({
      url: `/evaluation/staff/save`,
      method: 'post',
      data: data,
    });
  }

  saveDepartment(id, data) {
    return request({
      url: `/evaluation/department/save${id}`,
      method: 'post',
      data: data,
    });
  }

  saveSCstatistic(id, type, data) {
    return request({
      url: `evaluation/pre/${type}${id}`,
      method: 'post',
      data: data,
    });
  }

  saveSCsubSetting(id, data) {
    return request({
      url: `stage/save${id}`,
      method: 'post',
      data: data,
    });
  }

  saveProgram(id, data) {
    return request({
      url: `/evaluation/data/program/save${id}`,
      method: 'post',
      data: data,
    });
  }

  saveActivity(id, data) {
    return request({
      url: `/evaluation/activity/save${id}`,
      method: 'post',
      data: data,
    });
  }

  saveBulding(id, data) {
    return request({
      url: `/evaluation/pre/school${id}`,
      method: 'post',
      data: data,
    });
  }

  saveDetials(id, data) {
    return request({
      url: `/evaluation/pre/details/save${id}`,
      method: 'post',
      data: data,
    });
  }

  getAllDocument() {
    return request({
      url: `/document/documents`,
      method: 'post',
    });
  }

  getSubmissionDocument(submission_id) {
    return request({
      url: `/document/submission/attachments/${submission_id}`,
      method: 'get',
    });
  }

  excusedRepresentative(query) {
    return request({
      url: `teams/excused/representative/${query.id}`,
      method: 'post',
      data: query.query,
    });
  }

  save(query) {
    return request({
      url: `/submissions/submission/save${query.id ? '/' + query.id : ''}`,
      method: 'post',
      data: query.query,
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: function (progressEvent) {
        store.commit('SET_UPLOAD_PROGRESS', parseInt(Math.round((progressEvent.loaded / progressEvent.total) * 100)));
      }.bind(store),
    });
  }

  SCsave(query) {
    return request({
      url: `/submissions/pre/save${query.id ? '/' + query.id : ''}`,
      method: 'post',
      data: query.query,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  saveAdditionalData(query) {
    return request({
      url: `submissions/submission/update${query.id ? '/' + query.id : ''}`,
      method: 'post',
      data: query.query,
    });
  }

  savePreRport(query) {
    return request({
      url: `evaluation/pre/save/${query.evaluation_id}${query.id ? '/' + query.id : ''}`,
      method: 'post',
      data: query.query,
    });
  }

  rubrics(query){
    return request({
      url: 'rubrics',
      method: 'post',
      params: query,
    });

  }

  activeSubmission(query) {
    return request({
      url: `submissions/submission/active/${query.id}`,
      method: 'post',
      data: query.query,
    });
  }

  

  addVisit(query) {
    return request({
      url: `/submissions/submission/visit`,
      method: 'post',
      data: query,
    });
  }

  saveAdministration(query) {
    return request({
      url: `institute/save${query.id ? '/' + query.id : ''}`,
      method: 'post',
      data: query.query,
    });
  }

  saveOrganization(query) {
    return request({
      url: `/organizations/submission/save${query.id ? '/' + query.id : ''}`,
      method: 'post',
      params: query.query,
    });
  }

  questions(id, query) {
    return request({
      url: `/submissions/questions/${id}`,
      method: 'post',
      params: query,
    });
  }

  approveQuality(id) {
    return request({
      url: `/submission/approve/${id}`,
      method: 'get',
    });
  }

  details(question_id, questionnaire) {
    return request({
      url: `/submissions/question/${question_id}/${questionnaire}`,
      method: 'post',
    });
  }
}

export { Submission as default };
