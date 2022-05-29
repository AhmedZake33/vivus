import Resource from '../api/resource';
import request from '../utils/request';

class Notes extends Resource {
  constructor() {
    super('note');
  }

  getSubState(id) {
    return request({
      url: `/submissions/submission/notes/${id}`,
      method: 'get',
    });
  }
  changeSubState(payload) {
    if (payload.system == 1) {
      return request({
        url: `/submissions/submission/updateStage/${payload.id}`,
        method: 'post',
        data: payload.query,
      });
    } else if(payload.system == 2){
      return request({
        url: `evaluation/changeStage/status/${payload.id}`,
        method: 'post',
        data: payload.query,
      });
    }
    else if(payload.system == 3){
      return request({
        url: `plans/change/stage/${payload.id}`,
        method: 'post',
        data: payload.query,
      });
    }else{
      return request({
        url: `plans/evaluation/${payload.id}`,
        method: 'post',
        data: payload.query,
      });
    }
  }

  preChangeSubState(payload) {
    if (payload.system == 1) {
      return request({
        url: `/submissions/submission/updateStage/${payload.id}`,
        method: 'post',
        data: payload.query,
      });
    } else if(payload.system == 2){
      return request({
        url: `evaluation/changeStage/status/${payload.id}`,
        method: 'post',
        data: payload.query,
      });
    } else if(payload.system == 3){
      return request({
        url: `plans/change/stage/${payload.id}`,
        method: 'post',
        data: payload.query,
      });
    }else{
      return request({
        url: `plans/evaluation/${payload.id}`,
        method: 'post',
        data: payload.query,
      });
    }
  }
}

export { Notes as default };
