import Resource from '../api/resource';
import request from "../utils/request";

class Document extends Resource {
    constructor() {
        super('log');
    }

    list(query) {
        return request({
            url: `/document/pre/documents`,
            method: 'post',
            params: query,
        })
    }

}

export {Document as default};
