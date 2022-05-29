import Resource from '../api/resource';
import request from '../utils/request';

class Finance extends Resource {
  constructor() {
    super('form');
  }

  list(query) {
    return request({
      url: `finance/submission/index`,
      method: 'post',
      params: query,
    });
  }

  users(query) {
    return request({
      url: `finance/users/index`,
      method: 'post',
      params: query,
    });
  }

  saveWallet(payload) {
    return request({
      url: `credit/add${payload.id ? '/' + payload.id : ''}`,
      method: 'post',
      data: payload.query,
    });
  }

  saveTransaction(payload) {
    return request({
      url: `credit/save${payload.id ? '/' + payload.id : ''}`,
      method: 'post',
      data: payload.query,
    });
  }

  saveGpTransfer(payload) {
    return request({
      url: `credit/transfer${payload.id ? '/' + payload.id : ''}`,
      method: 'post',
      data: payload.query,
    });
  }

  wallets(query) {
    return request({
      url: `credit/index`,
      method: 'post',
      data: query,
    });
  }


  wallet(id) {
    return request({
      url: `credit/show/${id}`,
      method: 'GET',
    });
  }
  saveBonus(id, query) {
    return request({
      url: `/finance/bonus/save${id}`,
      method: 'post',
      data: query,
    });
  }
  cancelTransaction(id) {
    return request({
      url: `/credit/change/${id}`,
      method: 'post',
    });
  }
  cancelBonus(id) {
    return request({
      url: `/finance/bonus/cancel/${id}`,
      method: 'post',
    });
  }

  show(id) {
    return request({
      url: `/finance/submission/show/${id}`,
      method: 'get',
    });
  }
}

export { Finance as default };
