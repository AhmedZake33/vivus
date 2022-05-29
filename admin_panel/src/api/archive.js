import Resource from "../api/resource";
import request from "../utils/request";
import { getToken } from "../utils/auth";
class Archive extends Resource {
  constructor() {
    super("archive");
  }


  list(query, id) {
    return request({
      url: `/archive${id ? "/" + id : ""}`,
      method: "post",
      params: query,
    });
  }


  getParents(id , locale , root_id = 0) {
    return request({
      url: `/archive/parents/${id}/${locale}/${root_id}`,
      method: "get",
    });
  }

  download(id) {
    return request({
      url: `/archive/download/${id}`,
      method: "get",
    });
  }

  downloadFiles(id) {
    return request({
      url: `/archive/zip/files/${id}?token=${getToken()}`,
      method: "get",
    });
  }

  upload(resource,id) {
    return request({
      url: `/archive/upload/${id}`,
      method: "post",
      data: resource,
    });
  }

  reOrder(data) {
    return request({
      url: `/archive/order/${data.fid}/${data.ordertype}/${data.sid}`,
      method: "post",
      data: data.pid,
    });
  }

  createDirectories(resource) {
    return request({
      url: `/archive`,
      method: "put",
      data: resource,
    });
  }

  destroy(resource) {
    return request({
      url: `/archive/${resource.id}`,
      method: "delete",
      data: resource,
    });
  }

  rename(resource) {
    return request({
      url: `/archive/${resource.id.id}`,
      method: "put",
      data: resource.resource,
    });
  }

  content(id, query) {
    return request({
      url: `/archive/page/${id}`,
      method: "get",
      params: query,
    });
  }

  usersRoles(resource) {
    return request({
      url: `/archive/names/users_roles`,
      method: "post",
      data: resource,
    });
  }

  setContent(payload) {
    return request({
      url: `/archive/content/${payload.id}`,
      method: "put",
      data: {content:payload.content , language:payload.language},
    });
  }

  move(resource) {
    return request({
      url: `/archive/move_to/${resource.currentId}`,
      method: "post",
      data: resource,
    });
  }
  checkShortName(name) {
    return request({
      url: `/archive/check_short_name/${name.id}/${
        name.name
      }`,
      method: "post",
    });
  }
  paste(resource) {
    return request({
      url: `/archive/paste_to/${resource.currentId}`,
      method: "post",
      data: resource,
    });
  }
}

export { Archive as default };
