import Resource from '../api/resource';
import request from "../utils/request";

class Question extends Resource {
    constructor() {
        super('question');
    }

    list(form , query) {
        return request({
            url: `/questions/${form}`,
            method: 'post',
            params: query,
        });
    }

}

export {Question as default};
