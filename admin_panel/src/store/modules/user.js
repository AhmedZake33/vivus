import { login, logout, Register, registerData } from '../../api/auth'; // getInfo
import User from '../../api/user'; // getInfo
import Recovery from '../../api/recovery'; // getInfo
import { Message } from 'element-ui';
import { Auth, deleteToken, removeAuth, removeToken, resetPermission, setLogged, setToken } from '../../utils/auth';
import routes from '../../router'
const user = new User();
const recovery = new Recovery();

const userModule = {
  namespaced: true,
  state: {
    selectedUser: null,
    allowNewSubmission: null,
    allowHr: null,
    allowPu: null,
    allowTr: null,
    recoveryMode: null,
    auth: null,
    oldEmail: null,
    user: {},
    system: null,
    lastTeam: {},
    userLoad: false,
    questions: [],
    teams: [],
    questionsLoad: false,
    totalQuestions: 0,
    token: null,
    roles: [],
    qualifications: [],
    specifications: [],
    degrees: [],
    details: {},
    levels: [],
    universities: [],
    collages: [],
    users: [],
    grades: [],
    places: [],
    governments: [],
    notifications: [],
    totalNotifications: 0,
    loadNotifications: false,
    unseen: 0,
    usersLoad: false,
    totalUsers: 0,
    archives: [],
    archiveLoad: false,
    totalTasks: null,
    loadTasks: false,
    tasks: null,
    apply_to_id: null,
    photo: null,
    userId: null,
    userCv: null,
    statistic: null,
    rerender: true,
    members: null,
    degree_qualifications:[],
    degree_specifications:[],
    edu_qualifications:[],
    edu_specifications:[],
    all_qualifications:[],
    pre_qualifications:[],
    load_qualifications:false,
  },
  getters: {
    Auth(state) {
      return state.auth;
    },
    members(state) {
      return state.members;
    },
    statistic(state) {
      return state.statistic;
    },
    user(state) {
      return Object.entries(state.user)
        .map(([key, value]) => {
          return { key, value };
        })
        .filter(
          param =>
            param.key !== 'id' &&
            param.key !== 'directorate_ids' &&
            param.key !== 'status' &&
            param.key !== 'current_job' &&
            param.key !== 'work_government' &&
            param.key !== 'allowNewSubmission' &&
            param.key !== 'allowHr' &&
            param.key !== 'allowPu' &&
            param.key !== 'allowTr' &&
            param.key !== 'grade' &&
            param.key !== 'university' &&
            param.key !== 'organization_id' &&
            param.key !== 'apply_to_id' &&
            param.key !== 'userId' &&
            param.key !== 'userCv' &&
            param.key !== 'task' &&
            param.key !== 'photo' &&
            param.key !== 'current_job_place' &&
            param.key !== 'birth_government' &&
            param.key !== 'grade_id' &&
            param.key !== 'degree_specification_id' &&
            param.key !== 'degree_education_level_id' &&
            param.key !== 'education_degree_id' &&
            param.key !== 'collage_id' &&
            param.key !== 'university_id' &&
            param.key !== 'dataRequired' &&
            param.key !== 'canMakeRequest' &&
            param.key !== 'university_education_id' &&
            param.key !== 'qualification_id' &&
            param.key !== 'specification_id' &&
            param.key !== 'degree_org_name' &&
            param.key !== 'education_level_id' &&
            param.key !== 'submissions' &&
            param.key !== 'organization_education_id' &&
            param.key !== 'education_org_name' &&
            param.key !== 'degree_qualification_id' &&
            param.key !== 'organization_degree_id' &&
            param.key !== 'university_degree_id' &&
            param.key !== 'temp_university_degree_name' &&
            param.key !== 'temp_organization_degree_name' &&
            param.key !== 'removed' &&
            (param.value !== null || param.key == 'job_title')
        );
    },
    // directorateIds(state){
    //   return state.user.directorate_ids
    // },
    status(state) {
      return state.user.removed;
    },
    task(state) {
      return state.user.task;
    },
    name(state) {
      if (state.user) {
        return state.user.ar_name;
      }
      return '';
    },
    userLoad(state) {
      return state.userLoad;
    },
    users(state) {
      return state.users;
    },
    totalUsers(state) {
      return state.totalUsers;
    },
    questionsLoad(state) {
      return state.questionsLoad;
    },
    questions(state) {
      return state.questions;
    },
    teams(state) {
      return state.teams;
    },
    totalQuestions(state) {
      return state.totalQuestions;
    },
    usersLoad(state) {
      return state.usersLoad;
    },
    roles(state) {
      return state.roles;
    },
    qualifications(state) {
      return state.qualifications;
    },
    specifications(state) {
      return state.specifications;
    },
    degrees(state) {
      return state.degrees;
    },
    levels(state) {
      return state.levels;
    },
    universities(state) {
      return state.universities;
    },
    collages(state) {
      return state.collages;
    },
    lastTeams(state) {
      return state.lastTeam;
    },
    submissions(state) {
      return state.user.submissions;
    },
    isRequired(state) {
      return state.user.dataRequired;
    },
    canMakeRequest(state) {
      return state.user.canMakeRequest;
    },
    details(state) {
      return Object.entries(state.details)
        .map(([key, value]) => {
          return { key, value };
        })
        .filter(param => param.value !== null);
    },
    archives(state) {
      return state.archives;
    },
    archiveLoad(state) {
      return state.archiveLoad;
    },
    tasks(state) {
      return state.tasks;
    },
    totalTasks(state) {
      return state.totalTasks;
    },
    loadTasks(state) {
      return state.loadTasks;
    },
    grades(state) {
      return state.grades;
    },
    places(state) {
      return state.places;
    },
    governments(state) {
      return state.governments;
    },
    notifications(state) {
      return state.notifications;
    },
    totalNotifications(state) {
      return state.totalNotifications;
    },
    loadNotifications(state) {
      return state.loadNotifications;
    },
    unseen(state) {
      return state.unseen;
    },
  },
  mutations: {
    SET_RERENDER(state, rerender) {
      state.rerender = rerender;
    },
    SET_AUTH: (state, user) => {
      state.auth = user;
    },
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_USERS: (state, users) => {
      state.users = users;
    },
    SET_TOTAL_USERS: (state, total) => {
      state.totalUsers = total;
    },
    SET_USERS_LOAD: (state, load) => {
      state.usersLoad = load;
    },
    SET_QUESTIONS: (state, questions) => {
      state.questions = questions;
    },
    SET_TOTAL_QUESTIONS: (state, total) => {
      state.totalQuestions = total;
    },
    SET_QUESTIONS_LOAD: (state, load) => {
      state.questionsLoad = load;
    },
    SET_TEAMS: (state, teams) => {
      state.teams = teams;
    },
    SET_USER: (state, user) => {
      state.user = user;
    },
    SET_USER_DETAILS: (state, details) => {
      state.details = details;
    },
    SET_LOAD_USER: (state, load) => {
      state.userLoad = load;
    },
    SET_ROLES(state, roles) {
      state.roles = roles;
    },
    SET_DEGREE_QUALIFICATIONS(state, data) {
      state.degree_qualifications = data;
    },
    SET_PRE_QUALIFICATIONS(state, data) {
      state.pre_qualifications = data;
    },
    SET_DEGREE_SPECIFICATIONS(state, data) {
      state.degree_specifications = data;
    },
    SET_QUALIFICATIONS(state, qualifications) {
      state.qualifications = qualifications;
    },
    SET_SPECIFICATIONS(state, specifications) {
      state.specifications = specifications;
    },
    SET_DEGREES(state, degrees) {
      state.degrees = degrees;
    },
    SET_LEVELS(state, levels) {
      state.levels = levels;
    },
    SET_UNIVERSITIES(state, universities) {
      state.universities = universities;
    },
    SET_SYSTEM(state, system) {
      state.system = system;
    },
    SET_COLLAGES(state, collages) {
      state.collages = collages;
    },
    SET_LAST_TEAMS(state, team) {
      state.lastTeam = team;
    },
    SET_ARCHIVES(state, archives) {
      state.archives = archives;
    },
    SET_ARCHIVES_LOAD(state, load) {
      state.archiveLoad = load;
    },
    SET_TOTAL_TASKS(state, totalTasks) {
      state.totalTasks = totalTasks;
    },
    SET_TASKS(state, tasks) {
      state.tasks = tasks;
    },
    SET_TASKS_LOAD(state, loadTasks) {
      state.loadTasks = loadTasks;
    },
    SET_NOTIFICATIONS(state, notifications) {
      if (typeof notifications == 'number') {
        state.notifications = state.notifications.filter(notify => notify.id != notifications);
      } else {
        state.notifications = notifications;
      }
    },
    SET_TOTAL_NOTIFICATIONS(state, total) {
      state.totalNotifications = total;
    },
    SET_UNSEEN_NOTIFICATIONS_COUNT(state, total) {
      state.unseen = total;
    },
    SET_NOTIFICATIONS_LOAD(state, load) {
      state.loadNotifications = load;
    },
    SET_GRADES(state, grades) {
      state.grades = grades;
    },
    SET_PLACES(state, places) {
      state.places = places;
    },
    SET_ALLOW_NEW_SUBMISSION(state, allowNewSubmission) {
      state.allowNewSubmission = allowNewSubmission;
    },
    SET_ALLOW_NEW_HR_SUBMISSION(state, allowHr) {
      state.allowHr = allowHr;
    },
    SET_ALLOW_NEW_PU_SUBMISSION(state, allowPu) {
      state.allowPu = allowPu;
    },
    SET_ALLOW_NEW_TR_SUBMISSION(state, allowTr) {
      state.allowTr = allowTr;
    },
    SET_APPLY_TO_ID(state, apply_to_id) {
      state.apply_to_id = apply_to_id;
    },
    SET_GOVERNMENTS(state, governments) {
      state.governments = governments;
    },
    SET_PHOTO(state, photo) {
      state.photo = photo;
    },
    SET_NATIONAL_ID(state, userId) {
      state.userId = userId;
    },
    SET_RECOVERY(state, recoveryMode) {
      state.recoveryMode = recoveryMode;
    },
    SET_STATISTIC(state, stat) {
      state.statistic = stat;
    },
    SET_OLD_EMAIL(state, oldEmail) {
      state.oldEmail = oldEmail;
    },
    SET_CV(state, userCv) {
      state.userCv = userCv;
    },
    SET_MEMBERS(state, members) {
      state.members = members;
    },
    SET_SELECTED_USER(state, selectedUser) {
      state.selectedUser = selectedUser;
    },
    SET_EDU_QUALIFICATIONS(state, data) {
      state.edu_qualifications = data;
    },
    SET_EDU_SPECIFICATIONS(state, data) {
      state.edu_specifications = data;
    },
    SET_ALL_QUALIFICATIONS(state, data) {
      state.all_qualifications = data;
    },
    SET_QUALIFICATIONS_LOAD(state, data) {
      state.load_qualifications = data;
    },
  },
  actions: {
    excused({ commit }, payload) {
      return new Promise((resolve, reject) => {
        user
          .excused(payload)
          .then(response => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    removeRecovery({ commit }, id) {
      return new Promise((resolve, reject) => {
        user
          .removeRecovery(id)
          .then(response => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // user login
    login({ commit, dispatch }, userInfo) {
      const { email, password } = userInfo;
      return new Promise((resolve, reject) => {
        login({ email: email.trim(), password: password })
          .then(response => {
            commit('SET_RECOVERY', response.status ? true : false);
            commit('SET_OLD_EMAIL', response.email ? response.email : null);
            if (!response.status) {
              setLogged('1');
              setToken(response.success.token);
              Auth(response.success.user);
              commit('SET_TOKEN', response.success.token);
              commit('SET_AUTH', response.success.user);
              dispatch('roles/getAuthUserRolesPermissions', response.success.user.id, { root: true });
            }
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    getTasks({ commit }, payload) {
      commit('SET_TASKS_LOAD', true);
      return new Promise((resolve, reject) => {
        user
          .getTasks(payload)
          .then(response => {
            commit('SET_TASKS', response.tasks);
            commit('SET_TOTAL_TASKS', response.count);
            commit('SET_TASKS_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    getNotifications({ commit }, payload) {
      commit('SET_NOTIFICATIONS_LOAD', true);
      return new Promise((resolve, reject) => {
        user
          .notifications(payload.query)
          .then(response => {
            commit('SET_NOTIFICATIONS', response.notifications);
            commit('SET_TOTAL_NOTIFICATIONS', response.count);
            commit('SET_UNSEEN_NOTIFICATIONS_COUNT', response.unseen_count);
            commit('SET_NOTIFICATIONS_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    applyTo({ commit }, payload) {
      return new Promise((resolve, reject) => {
        user
          .applyTo(payload)
          .then(response => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    seen({ commit }, id) {
      return new Promise((resolve, reject) => {
        user
          .seen(id)
          .then(response => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    deleteNotification({ commit }, id) {
      return new Promise((resolve, reject) => {
        user
          .deleteNotification(id)
          .then(response => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    deleteAllNotification({ commit }) {
      return new Promise((resolve, reject) => {
        user
          .deleteAllNotification()
          .then(response => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    Register({ commit }, payload) {
      return new Promise((resolve, reject) => {
        Register(payload.user)
          .then(response => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    Recovery({ commit }, payload) {
      return new Promise((resolve, reject) => {
        user
          .Recovery(payload.user)
          .then(response => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    restore({ commit }, payload) {
      return new Promise((resolve, reject) => {
        user
          .restore(payload.user, payload.recovery)
          .then(response => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    resetUser({ commit }, id) {
      return new Promise((resolve, reject) => {
        user
          .resetUser(id)
          .then(response => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    qualificationsSearch({ commit }, payload) {
      commit('SET_QUALIFICATIONS_LOAD', true);
      console.log('vuex', payload);
      return new Promise((resolve, reject) => {
        user
          .qualificationsSearch(payload)
          .then(response => {
            commit('SET_ALL_QUALIFICATIONS', response.qualifications);
            commit('SET_QUALIFICATIONS_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    lookup({ commit }, payload) {
      return new Promise((resolve, reject) => {
        registerData(payload)
          .then(response => {
            commit('SET_DEGREES', response.degrees);
            commit('SET_LEVELS', response.levels);
            commit('SET_EDU_QUALIFICATIONS', response.qualifications);
            commit('SET_EDU_SPECIFICATIONS', response.specifications);
            commit('SET_QUALIFICATIONS', response.degree_qualifications);
            commit('SET_SPECIFICATIONS', response.degree_specifications);
            commit('SET_PRE_QUALIFICATIONS', response.pre_qualifications);
            commit('SET_DEGREE_QUALIFICATIONS', response.degree_qualifications || null);
            commit('SET_DEGREE_SPECIFICATIONS', response.degree_specifications || null);
            commit('SET_UNIVERSITIES', response.universities);
            commit('SET_COLLAGES', response.collages);
            commit('SET_GRADES', response.grades);
            commit('SET_PLACES', response.places);
            commit('SET_GOVERNMENTS', response.governments);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    reset({ commit }, payload) {
      return new Promise((resolve, reject) => {
        user
          .reset(payload.query)
          .then(response => {
            commit('SET_RECOVERY', response.status ? true : false);
            commit('SET_OLD_EMAIL', response.email ? response.email : null);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    resetPassword({ commit }, payload) {
      return new Promise((resolve, reject) => {
        user
          .resetPassword(payload.query)
          .then(() => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    active({ commit }, payload) {
      return new Promise((resolve, reject) => {
        user
          .active(payload.query)
          .then(() => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    recoveryactive({ commit }, payload) {
      return new Promise((resolve, reject) => {
        user
          .recoveryactive(payload.query)
          .then(() => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    logout({ commit }) {
      return new Promise((resolve, reject) => {
        logout()
          .then(() => {
            commit('SET_TOKEN', '');
            commit('SET_AUTH', []);
            removeToken();
            deleteToken();
            removeAuth();
            resetPermission();
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    users({ commit }, payload) {
      if (routes.currentRoute.name == 'team') {
        var key = 'submission_id';
        delete payload.query[key];
      }
      return new Promise((resolve, reject) => {
        commit('SET_USERS_LOAD', true);
        user
          .list(payload.query)
          .then(response => {
            commit('SET_USERS', response.users);
            commit('SET_ROLES', response.roles);
            commit('SET_QUALIFICATIONS', response.qualifications);
            commit('SET_SPECIFICATIONS', response.specifications);
            commit('SET_DEGREE_QUALIFICATIONS', response.degree_qualifications);
            commit('SET_PRE_QUALIFICATIONS', response.pre_qualifications);
            commit('SET_DEGREE_SPECIFICATIONS', response.degree_specifications);
            commit('group/SET_GROUPS', response.groups, { root: true });
            commit('SET_DEGREES', response.degrees);
            commit('SET_LEVELS', response.levels);
            commit('SET_UNIVERSITIES', response.universities);
            commit('SET_COLLAGES', response.collages);
            commit('SET_TOTAL_USERS', response.count);
            commit('SET_USERS_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    recoveries({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_USERS_LOAD', true);
        recovery
          .list(payload.query)
          .then(response => {
            commit('SET_USERS', response.recoveries);
            commit('SET_QUALIFICATIONS', response.qualifications);
            commit('SET_SPECIFICATIONS', response.specifications);
            commit('SET_DEGREE_QUALIFICATIONS', response.degree_qualifications || null);
            commit('SET_PRE_QUALIFICATIONS', response.pre_qualifications);
            commit('SET_DEGREE_SPECIFICATIONS', response.degree_specifications || null);
            commit('SET_DEGREES', response.degrees);
            commit('SET_LEVELS', response.levels);
            commit('SET_TOTAL_USERS', response.count);
            commit('SET_USERS_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    questions({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_QUESTIONS_LOAD', true);
        user
          .questions(payload.id, payload.query)
          .then(response => {
            commit('SET_QUESTIONS', response.questions);
            commit('SET_TEAMS', response.teams);
            commit('SET_MEMBERS', response.members);
            commit('SET_SELECTED_USER', response.user);
            commit('SET_STATISTIC', response.statistic);
            commit('SET_LAST_TEAMS', response.last_team);
            commit('SET_TOTAL_QUESTIONS', response.count);
            commit('SET_QUESTIONS_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    delete({ commit }, payload) {
      return new Promise((resolve, reject) => {
        user
          .destroy(payload.id)
          .then(response => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    user({ commit }, id) {
      return new Promise((resolve, reject) => {
        commit('SET_LOAD_USER', true);
        commit('SET_USER', {});
        user
          .get(id)
          .then(response => {
            commit('SET_USER', response.user);
            commit('SET_USER_DETAILS', response.details);
            commit('SET_SYSTEM', response.system);
            commit('SET_APPLY_TO_ID', response.user.apply_to_id);
            commit('SET_NATIONAL_ID', response.user.userId);
            commit('SET_CV', response.user.userCv);
            commit('SET_PHOTO', response.user.photo);
            commit('SET_ALLOW_NEW_SUBMISSION', response.user.allowNewSubmission);
            commit('SET_ALLOW_NEW_HR_SUBMISSION', response.user.allowHr);
            commit('SET_ALLOW_NEW_PU_SUBMISSION', response.user.allowPu);
            commit('SET_ALLOW_NEW_TR_SUBMISSION', response.user.allowTr);
            commit('SET_LOAD_USER', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    approve({ commit }, id) {
      return new Promise((resolve, reject) => {
        user
          .approve(id)
          .then(response => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    archive({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_ARCHIVES_LOAD', true);
        user
          .archive(payload.id, payload.query)
          .then(response => {
            commit('SET_ARCHIVES', response.archives);
            commit('SET_ARCHIVES_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
  },
};

export default userModule;
