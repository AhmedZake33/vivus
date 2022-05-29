import Resource from '../api/resource';
import request from '../utils/request';

class Ticket extends Resource {
  constructor() {
    super('ticket');
  }

  index(query) {
    return request({
      url: `/ticket/tickets`,
      method: 'post',
      params: query,
    });
  }

  get(payload) {
    return request({
      url: `/ticket/get/${payload.id}`,
      method: 'get',
      params:payload.query,
    });
  }

  add(ticket) {
    return request({
      url: `ticket/add/${ticket.id}`,
      method: 'post',
      data: ticket.query,
    });
  }
}

export { Ticket as default };
