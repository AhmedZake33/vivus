import Resource from '../api/resource';
import request from "../utils/request";

class Hotels extends Resource {
    constructor() {
        super('hotel');
    }

    get(id) {
        return request({
            url: `/hotels/${id}`,
            method: 'get',
        });
    }
    edit(id) {
        return request({
            url: `/hotels/edit${id}`,
            method: 'post',
        });
    }
    add(data) {
        return request({
            url: `/hotels/save${data.id?'/'+data.id:''}`,
            method: 'post',
            data:data.query
        });
    }

    addReservation(data) {
        return request({
            url: `hotels/reservation/save${data.id?'/'+data.id:''}`,
            method: 'post',
            data:data.query
        });
    }

    deleteReservation(id) {
        return request({
            url: `hotels/reservation/delete/${id}`,
            method: 'post',
        });
    }
    reservation(id) {
        return request({
            url: `/hotels/reservation/${id}`,
            method: 'get',
        });
    }

    approve(id) {
        return request({
            url: `/hotels/reservation/approve/${id}`,
            method: 'post',
        });
    }

    saveService(id , query) {
        return request({
            url: `/hotels/service/save${id}`,
            method: 'post',
            data: query,
        });
    }
    addService(query) {
        console.log(query)
        return request({
            url: `/hotels/service/add`,
            method: 'post',
            data: query,
        });
    }

    deleteService(id) {
        return request({
            url: `/hotels/service/delete/${id}`,
            method: 'post',
        });
    }

    questions(id , query) {
        return request({
            url: `/hotels/evaluation/${id}`,
            method: 'post',
            params:query
        });
    }


}

export {Hotels as default};
