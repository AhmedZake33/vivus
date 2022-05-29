import Resource from '../api/resource';
import request from "../utils/request";

class Forms extends Resource {
    constructor() {
        super('form');
    }

    get(id) {
        return request({
            url: `/forms/${id}`,
            method: 'get',
        });
    }
    add(payload){
        return request({
            url: `/forms/save${payload.id ? '/'+payload.id : '' }`,
            method: 'post',
            data:payload.query
        });
    }
    addRubric(payload){
        return request({
            url: `/forms/rubrics/save${payload.id ? '/'+payload.id : '' }`,
            method: 'post',
            data:payload.query
        });
    }
    addTool(payload){
        return request({
            url: `/forms/tool/save${payload.id ? '/'+payload.id : '' }`,
            method: 'post',
            data:payload.query
        });
    }
    getsubform(id) {
        return request({
            url: `/forms/question/${id}`,
            method: 'get',
        });
    }

    addQuestion(payload) {
        return request({
            url: `/forms/question/save${payload.id?`/${payload.id}`:''}`,
            method: 'post',
            data:payload.query
        });
    }


}

export {Forms as default};
