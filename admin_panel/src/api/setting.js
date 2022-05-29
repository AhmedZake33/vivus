import Resource from '../api/resource';
import request from '../utils/request';

class Setting extends Resource {
    constructor() {
        super('setting');
    }

    index(query) {
        return request({
            url: `setting/index`,
            method: 'post',
            params: query,
        });
    }

    change(setting) {
        return request({
            url: `setting/change/${setting}`,
            method: 'post',
        });
    }
}

export { Setting as default };
