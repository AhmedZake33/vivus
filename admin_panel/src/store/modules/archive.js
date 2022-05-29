import Archive from '../../api/archive';
const archive = new Archive();

const archiveModule = {
  namespaced: true,
  state: {
    files: [],
    selectedItem: [],
    binaries: [],
    archiveLoad: false,
    contentLoad: false,
    totalArchive: 0,
    imageFolder: null,
    content: '',
    loadingUpload: null,
    fullPath: [],
    parents: [],
    parentsBrowser: [],
    currentId: '',
    currentIdBrowser: '',
    totalBin: null,
    checkShortName: null,
    usersLoad: false,
    users: [],
    roles: [],
    currentIdEditor: null,
    editorParent: null,
    generalLoad:false,
  },
  getters: {
    selectedItem(state) {
      return state.selectedItem;
    },
    contentLoad(state) {
      return state.contentLoad;
    },
    content(state) {
      return state.content;
    },
    binaries(state) {
      return state.binaries;
    },
    archiveLoad(state) {
      return state.archiveLoad;
    },
    totalArchive(state) {
      return state.totalArchive;
    },
    imageFolder(state) {
      return state.imageFolder;
    },
    fullPath(state) {
      return state.fullPath;
    },
    parents(state) {
      return state.parents;
    },
    parentsBrowser: state => state.parentsBrowser,
    currentId(state) {
      return state.currentId;
    },
    currentIdBrowser(state) {
      return state.currentIdBrowser;
    },
    totalBin(state) {
      return state.totalBin;
    },
    users(state) {
      return state.users;
    },
    roles(state) {
      return state.roles;
    },
    loadingUpload(state) {
      return state.loadingUpload;
    },
    usersLoad(state) {
      return state.usersLoad;
    },
  },
  mutations: {
    SET_CONTENT_LOAD(state, load) {
      state.contentLoad = load;
    },
    SET_BINARIES(state, binaries) {
      state.binaries = binaries;
    },
    SET_ARCHIVE_LOAD(state, load) {
      state.archiveLoad = load;
    },
    SET_USERS(state, users) {
      state.users = users;
    },
    SET_ROLES(state, roles) {
      state.roles = roles;
    },
    SET_TOTAL_ARCHIVE(state, total) {
      state.totalArchive = total;
    },
    SET_SELECTED_ITEM(state, item) {
      state.selectedItem.push(item);
    },
    REMOVE_SELECTED_ITEM(state, i) {
      state.selectedItem.splice(i, 1);
    },
    SET_RESET(state) {
      state.selectedItem = [];
    },
    SET_CONTENT(state, content) {
      state.content = content;
    },
    SET_FULL_PATH(state, path) {
      if (path === 'archive') {
        state.fullPath = [];
      }
      state.fullPath = path.split('/');
    },
    SET_PARENTS(state, parents) {
      state.parents = parents;
    },
    SET_PARENTS_BROWSER(state, parentsBrowser) {
      state.parentsBrowser = parentsBrowser;
    },
    SET_CURRENT_ID(state, currentId) {
      state.currentId = currentId;
    },
    SET_CURRENT_ID_EDITOR(state, currentIdEditor) {
      state.currentIdEditor = currentIdEditor;
    },
    SET_CURRENT_ID_BROWSER(state, currentIdBrowser) {
      state.currentIdBrowser = currentIdBrowser;
    },
    SET_TOTAL_BINARIES(state, totalBin) {
      state.totalBin = totalBin;
    },
    SET_CHECK_SHORT_NAME(state, checkShortName) {
      state.checkShortName = checkShortName;
    },
    SET_IMAGE_FOLDER(state, imageFolder) {
      state.imageFolder = imageFolder;
    },
    SET_USERS_LOAD(state, load) {
      state.usersLoad = load;
    },
    SET_LODGING_UPLOAD_IMG(state, loadingUpload) {
      state.loadingUpload = loadingUpload;
    },
    SET_EDITOR_PARENT(state, editorParent) {
      state.editorParent = editorParent;
    },
    SET_GENERAL_LOAD(state,generalLoad){
        state.generalLoad = generalLoad
    }
  },
  actions: {
    getArchive({ commit, getters }, payload = null) {
      return new Promise((resolve, reject) => {
        if (payload) {
          if (payload.load == false) {
            commit('SET_ARCHIVE_LOAD', payload.load);
          } else {
            commit('SET_ARCHIVE_LOAD', true);
          }
        }
        archive
          .list(payload ? payload.query : null, payload ? payload.id : null)
          .then(response => {
            commit('SET_BINARIES', response.items);
            commit('SET_TOTAL_ARCHIVE', response.count);
            commit('SET_ARCHIVE_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    getParents({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_ARCHIVE_LOAD', true);
        archive
          .getParents(payload.id, payload.locale, payload.root_id ? payload.root_id : 0)
          .then(response => {
            commit('SET_PARENTS', response.parents);
            commit('SET_ARCHIVE_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    getParentsBrowser({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_ARCHIVE_LOAD', true);
        archive
          .getParents(payload.id, payload.locale)
          .then(response => {
            commit('SET_PARENTS_BROWSER', response.parents);
            commit('SET_ARCHIVE_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    upload({ commit }, payload) {
      return new Promise((resolve, reject) => {
        archive
          .upload(payload.resource, payload.id)
          .then(response => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    reOrder({ commit, dispatch, getters }, payload) {
      return new Promise((resolve, reject) => {
        archive
          .reOrder(payload)
          .then(response => {
            // console.log("in upload file in store", response);
            // dispatch("getArchive", { id: getters["currentId"], load: false });
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    createDirectories({ commit }, payload) {
      return new Promise((resolve, reject) => {
        archive
          .createDirectories(payload.resource)
          .then(response => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    delete({ commit }, payload) {
      commit('SET_GENERAL_LOAD', true);
      return new Promise((resolve, reject) => {
        archive
          .destroy(payload.resource)
          .then(response => {
            commit('SET_GENERAL_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    rename({ commit }, payload) {
      return new Promise((resolve, reject) => {
        if (payload.resource) {
          archive
            .rename(payload)
            .then(response => {
              resolve();
            })
            .catch(error => {
              reject(error);
            });
        }
      });
    },
    move({ commit }, payload) {
      return new Promise((resolve, reject) => {
        archive
          .move(payload)
          .then(response => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
        // });
      });
    },
    paste({ commit }, payload) {
      return new Promise((resolve, reject) => {
        archive
          .paste(payload)
          .then(response => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    getContent({ commit }, payload) {
      commit('SET_CONTENT_LOAD', true);
      return new Promise((resolve, reject) => {
        if (payload.id) {
          archive
            .content(payload.id, payload.query)
            .then(response => {
              commit('SET_CONTENT_LOAD', false);
              commit('SET_CONTENT', response.content);
              commit('SET_IMAGE_FOLDER', response.imageFolder);
              commit('SET_EDITOR_PARENT', response.parent);
              resolve();
            })
            .catch(error => {
              commit('SET_CONTENT_LOAD', false);
              reject(error);
            });
        }
      });
    },
    checkShortName({ commit }, shortName) {
      return new Promise((resolve, reject) => {
        if (shortName) {
          archive
            .checkShortName(shortName)
            .then(response => {
              commit('SET_CHECK_SHORT_NAME', response);
              resolve();
            })
            .catch(error => {
              reject(error);
            });
        }
      });
    },
    setContent({ commit }, payload) {
      return new Promise((resolve, reject) => {
        archive
          .setContent({ content: payload.content, language: payload.language, id: payload.id })
          .then(response => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    usersRoles({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_USERS_LOAD', true);
        archive
          .usersRoles(payload.query)
          .then(response => {
            commit('SET_USERS', response.users);
            commit('SET_ROLES', response.roles);
            commit('SET_USERS_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
  },
};

export default archiveModule;
