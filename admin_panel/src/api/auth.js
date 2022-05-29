import request from '../utils/request';

export function login(data) {
    return request({
        url: '/login',
        method: 'post',
        data: data,
    });
}


export function logout(token) {
    return request({
        url: '/logout',
        method: 'post',
    });
}

export function Register(data) {
    return request({
        url: '/register',
        method: 'post',
        data:data
    });
}

export function registerData(data) {
    return request({
        url: 'user/register/data',
        method: 'post',
        params:data
    });
}
