import Roles from '../../api/roles';
import { Message } from 'element-ui';
import Cookies from 'js-cookie';

const role = new Roles();

const roleModule = {
  namespaced: true,
  state: {
    roles: [],
    permissions: [],
    permissionsGroups: [],
    rolePermissions: [],
    rolesLoad: false,
    addLoad: false,
    newRoleId: null,
    userRoles: [],
    userPermission: [],
    userRolePermission: [],
    authUserRoles: [],
    authUserPermission: [],
    authUserRolePermission: [],
  },
  getters: {
    roles(state) {
      return state.roles;
    },
    permissions(state) {
      return state.permissions;
    },
    permissionsGroups(state) {
      return state.permissionsGroups;
    },
    rolePermissions(state) {
      return Object.entries(state.rolePermissions).map(([key, value]) => {
        return key;
      });
    },
    rolesLoad(state) {
      return state.rolesLoad;
    },
    addLoad(state) {
      return state.addLoad;
    },
    newRoleId(state) {
      return state.newRoleId;
    },
    userRoles(state) {
      return Object.entries(state.userRoles).map(([key, value]) => {
        return value;
      });
    },
    userPermissions(state) {
      return Object.entries(state.userPermission).map(([key, value]) => {
        return key;
      });
    },
    userRolesPermissions(state) {
      return Object.entries(state.userRolePermission).map(([key, value]) => {
        return key;
      });
    },
    userRolesPermissionsName(state) {
      return Object.entries(state.userRolePermission).map(([key, value]) => {
        return value;
      });
    },
    userPermissionsName(state) {
      return Object.entries(state.userPermission).map(([key, value]) => {
        return value;
      });
    },

    authUserRolesPermissionsName(state) {
      return Object.entries(state.authUserRolePermission).map(([key, value]) => {
        return value;
      });
    },
    authUserPermissionsName(state) {
      return Object.entries(state.authUserPermission).map(([key, value]) => {
        return value;
      });
    },
  },
  mutations: {
    SET_ROLES(state, roles) {
      state.roles = roles;
    },
    SET_PERMISSIONS(state, permissions) {
      state.permissions = permissions;
    },
    SET_PERMISSIONS_GROUPS(state, permissionsGroups) {
      state.permissionsGroups = permissionsGroups;
    },
    SET_ROLES_LOAD(state, load) {
      state.rolesLoad = load;
    },
    SET_ADD_LOAD(state, load) {
      state.addLoad = load;
    },
    SET_NEW_ROLE_ID(state, id) {
      state.newRoleId = id;
    },
    SET_ROLE_PERMISSIONS(state, permissions) {
      state.rolePermissions = permissions;
    },
    SET_USER_ROLES(state, roles) {
      state.userRoles = roles;
    },
    SET_USER_PERMISSIONS(state, permissions) {
      state.userPermission = permissions;
    },
    SET_USER_ROLES_PERMISSIONS(state, rolesPermissions) {
      state.userRolePermission = rolesPermissions;
    },
    SET_AUTH_USER_ROLES(state, roles) {
      state.authUserRoles = roles;
    },
    SET_AUTH_USER_PERMISSIONS(state, permissions) {
      state.authUserPermission = permissions;
    },
    SET_AUTH_USER_ROLES_PERMISSIONS(state, rolesPermissions) {
      state.authUserRolePermission = rolesPermissions;
    },
  },
  actions: {
    getRoles({ commit }) {
      return new Promise((resolve, reject) => {
        commit('SET_ROLES_LOAD', true);
        role
          .list()
          .then(response => {
            commit('SET_ROLES', response.roles);
            commit('SET_PERMISSIONS', response.permissions);
            commit('SET_PERMISSIONS_GROUPS', response.permissions_groups);
            commit('SET_ROLES_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    getRolePermissions({ commit }, id) {
      return new Promise((resolve, reject) => {
        commit('SET_ROLES_LOAD', true);
        role
          .get(id)
          .then(response => {
            commit('SET_ROLE_PERMISSIONS', response.permissions);
            commit('SET_ROLES_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    addRole({ commit }, data) {
      return new Promise((resolve, reject) => {
        commit('SET_ADD_LOAD', true);
        role
          .add(data)
          .then(response => {
            commit('SET_NEW_ROLE_ID', response.success.id);
            commit('SET_ADD_LOAD', false);
            Message({
              message: 'تم اضافة المهنة بنجاح',
              type: 'success',
              duration: 2 * 1000,
            });
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    updateRole({ commit }, payload) {
      commit('SET_ROLES_LOAD', true);
      return new Promise((resolve, reject) => {
        role
          .update(payload.data, payload.id)
          .then(response => {
            Message({
              message: 'تم تحديث المهنة بنجاح',
              type: 'success',
              duration: 2 * 1000,
            });
            commit('SET_ROLES_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    deleteRole({ commit }, id) {
      return new Promise((resolve, reject) => {
        role
          .delete(id)
          .then(response => {
            Message({
              message: 'تمت العملية بنجاح',
              type: 'success',
              duration: 2 * 1000,
            });
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    getUserRolesPermissions({ commit }, user_id) {
      return new Promise((resolve, reject) => {
        role
          .userRoleAndPermissions(user_id)
          .then(response => {
            commit('SET_USER_ROLES', response.roles);
            commit('SET_USER_PERMISSIONS', response.direct_permissions);
            commit('SET_USER_ROLES_PERMISSIONS', response.role_permissions);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    getAuthUserRolesPermissions({ commit }, user_id) {
      return new Promise((resolve, reject) => {
        role
          .userRoleAndPermissions(user_id)
          .then(response => {
            commit('SET_AUTH_USER_ROLES', response.roles);
            commit('SET_AUTH_USER_PERMISSIONS', response.direct_permissions);
            commit('SET_AUTH_USER_ROLES_PERMISSIONS', response.role_permissions);
            commit('user/SET_ALLOW_NEW_SUBMISSION', response.setting.all,{root:true});
            commit('user/SET_ALLOW_NEW_HR_SUBMISSION', response.setting.hr,{root:true});
            commit('user/SET_ALLOW_NEW_PU_SUBMISSION', response.setting.pu,{root:true});
            commit('user/SET_ALLOW_NEW_TR_SUBMISSION', response.setting.tr,{root:true});
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    updateUserRolesPermissions({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_ROLES_LOAD', true);
        role
          .updateUserRoleAndPermissions(payload.data, payload.id)
          .then(response => {
            commit('SET_ROLES_LOAD', false);
            Message({
              message: 'تمت العملية بنجاح',
              type: 'success',
              duration: 2 * 1000,
            });
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
  },
};

export default roleModule;
