import Statistic from '../../api/statistics';
import { getMonth } from '../../utils/helper';

const statistic = new Statistic();

const statisticsModule = {
  namespaced: true,
  state: {
    totalUsers: 0,
    totalOrganizations: 0,
    totalSubmissions: 0,
    totalTeams: 0,
    locations: [],
    organizationsData: null,
    organizationsLabel: null,
    organizations: [],
    selectedOrganizations: [],
    decisions: null,
    users: [],
    submissions: null,
    fieldBackground: null,
    submissionData: null,
    submissionLabel: null,
    decisionsData: null,
    decisionsLabel: null,
    usersActivitiesData: null,
    usersActivitiesLabel: null,
    usersActivitiesLoad: false,
    nonAccreditationLoad: false,
    nonDeAccreditationLoad: false,
    accreditationData: null,
    nonAccreditationAccreditationLabel: null,
    nonAccreditationData: null,
    otherData: null,
    delayData: null,
    organization_id: '',
    service_id: '',
    business_id: '',
    dataLoad: false,
    accessUsers:null,
    activeUsers:null,
    taskUsers:null,
    decBackgroundColor: '#39f',
  },
  getters: {
    totalUsers(state) {
      return state.totalUsers;
    },
    users(state) {
      return state.users;
    },
    nonDeAccreditationLoad(state) {
      return state.nonDeAccreditationLoad;
    },
    totalTeams(state) {
      return state.totalTeams;
    },
    totalSubmissions(state) {
      return state.totalSubmissions;
    },
    totalOrganizations(state) {
      return state.totalOrganizations;
    },
    usersActivitiesLoad(state) {
      return state.usersActivitiesLoad;
    },
    nonAccreditationLoad(state) {
      return state.nonAccreditationLoad;
    },
    locations(state) {
      return state.locations;
    },
    dataLoad(state) {
      return state.dataLoad;
    },
    organizations(state) {
      return state.organizations;
    },
    selectedOrganizations(state) {
      return state.selectedOrganizations;
    },
    decisions(state) {
      return state.decisions;
    },
    submissions(state) {
      return state.submissions;
    },
    organizationsDataSet(state) {
      return [
        {
          backgroundColor: state.fieldBackground,
          data: state.organizationsData,
        },
      ];
    },
    organizationsLabel(state) {
      return state.organizationsLabel;
    },
    submissionDataSet(state) {
      return [
        {
          label: 'طلبات',
          backgroundColor: '#3C4B64',
          data: state.submissionData,
        },
      ];
    },
    submissionLabel(state) {
      return state.submissionLabel;
    },
    decisionsDataSet(state) {
      return [
        {
          label: 'قرار',
          categoryPercentage: 0.6,
          backgroundColor: state.decBackgroundColor,
          data: state.decisionsData ? [...state.decisionsData, 0] : [],
        },
      ];
    },
    decisionsLabel(state) {
      return state.decisionsLabel;
    },
    nonAccreditationAccreditationDataSet(state) {
      return [

        {
          label: 'اخرى',
          backgroundColor: '#f9b115',
          data: state.otherData,
        },
        {
          label: 'منح مهلة',
          backgroundColor: '#39f',
          data: state.delayData,
        },
        {
          label: 'عــدم اعــتمــاد',
          backgroundColor: '#e55353',
          data: state.nonAccreditationData,
        },
        {
          label: 'اعـتـماد',
          backgroundColor: '#2eb85c',
          data: state.accreditationData,
        },
      ];
    },
    userActivitiesDataSet(state) {
      return [
        {
          label: 'عدد التفاعلات ',
          backgroundColor: '#39f',
          data: state.usersActivitiesData,
        },
      ];
    },
    nonAccreditationAccreditationLabel(state) {
      return state.nonAccreditationAccreditationLabel;
    },
    userActivitiesLabel(state) {
      return state.usersActivitiesLabel;
    },
    organizationID(state) {
      return state.organization_id;
    },
    serviceID(state) {
      return state.service_id;
    },
    businessID(state) {
      return state.business_id;
    },
  },
  mutations: {
    SET_DEC_BACKGROUND_COLOR(state, color) {
      state.decBackgroundColor = color;
    },
    SET_TOTAL_USERS: (state, total) => {
      state.totalUsers = total;
    },
    SET_TOTAL_ORGANIZATIONS: (state, total) => {
      state.totalOrganizations = total;
    },
    SET_TOTAL_SUBMISSIONS: (state, total) => {
      state.totalSubmissions = total;
    },
    SET_TOTAL_TEAMS: (state, total) => {
      state.totalTeams = total;
    },
    SET_LOCATIONS: (state, locations) => {
      state.locations = locations;
    },
    SET_ORGANIZATIONS: (state, organizations) => {
      state.organizations = organizations;
    },
    SET_SELECTED_ORGANIZATIONS: (state, organizations) => {
      state.selectedOrganizations = organizations;
    },
    SET_DECISIONS: (state, decisions) => {
      state.decisions = decisions;
    },
    SET_SUBMISSIONS: (state, submissions) => {
      state.submissions = submissions;
    },
    SET_ORGANIZATIONS_DATA: (state, data) => {
      state.organizationsData = data;
    },
    SET_ORGANIZATIONS_Label: (state, label) => {
      state.organizationsLabel = label;
    },
    SET_BACKGROUND_COLOR: (state, color) => {
      state.fieldBackground = color;
    },
    SET_SUBMISSIONS_DATA: (state, data) => {
      state.submissionData = data;
    },
    SET_SUBMISSIONS_LABEL: (state, label) => {
      state.submissionLabel = label;
    },
    SET_USERS: (state, users) => {
      state.users = users;
    },
    SET_ORGANIZATION_ID: (state, id) => {
      state.organization_id = id;
    },
    SET_DECISIONS_DATA: (state, data) => {
      state.decisionsData = data;
    },
    SET_DECISIONS_LABEL: (state, label) => {
      state.decisionsLabel = label;
    },
    SET_ACCREDITATION_DATA: (state, data) => {
      state.accreditationData = data;
    },
    SET_OTHER_DATA: (state, data) => {
      state.otherData = data;
    },
    SET_DELAY_DATA: (state, data) => {
      state.delayData = data;
    },
    SET_NON_ACCREDITATION_DATA: (state, data) => {
      state.nonAccreditationData = data;
    },
    SET_ACCREDITATION_NON_ACCREDITATION_LABEL: (state, label) => {
      state.nonAccreditationAccreditationLabel = label;
    },
    SET_USERS_ACTIVITIES_DATA: (state, data) => {
      state.usersActivitiesData = data;
    },
    SET_USERS_ACTIVITIES_LABEL: (state, label) => {
      state.usersActivitiesLabel = label;
    },
    SET_USERS_ACTIVITIES_LOAD: (state, load) => {
      state.usersActivitiesLoad = load;
    },
    SET_NON_ACTIVITIES_LOAD: (state, load) => {
      state.nonAccreditationLoad = load;
    },

    SET_NON_DE_ACTIVITIES_LOAD: (state, load) => {
      state.nonDeAccreditationLoad = load;
    },
    SET_BUSINESS_ID: (state, id) => {
      state.business_id = id;
    },
    SET_DATA_LOAD(state, load) {
      state.dataLoad = load;
    },
    SET_ACCESS_USERS(state, accessUsers) {
      state.accessUsers = accessUsers;
    },
    SET_ACTIVE_USERS(state, activeUsers) {
      state.activeUsers = activeUsers;
    },
    SET_TASK_USERS(state, taskUsers) {
      state.taskUsers = taskUsers;
    },
  },
  actions: {
    setStatistics({ commit }, payload) {
      return new Promise((resolve, reject) => {
        statistic
          .get(payload.query)
          .then(res => {
            commit('SET_TOTAL_USERS', res.totalUser);
            commit('SET_TOTAL_SUBMISSIONS', res.totalSubmissions);
            commit('SET_TOTAL_ORGANIZATIONS', res.totalOrganization);
            commit('SET_TOTAL_TEAMS', res.totalTeams);
            commit('SET_ACCESS_USERS', res.accessUsers);
            commit('SET_ACTIVE_USERS', res.activeUsers);
            commit('SET_TASK_USERS', res.taskUsers);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    setLocations({ commit }) {
      return new Promise((resolve, reject) => {
        statistic
          .locations()
          .then(res => {
            commit('SET_LOCATIONS', res.locations);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    setOrganization({ commit }, payload) {
      return new Promise((resolve, reject) => {
        statistic
          .organizations(payload.query)
          .then(res => {
            commit('SET_ORGANIZATIONS', res.organizations);
            let sum = res.organizations
              ? Array.from(res.organizations.slice(23), statistic => statistic.count).reduce(function (a, b) {
                  return a + b;
                }, 0)
              : 0;
            let showOrganizations = res.organizations.slice(0, 22);
            showOrganizations.push({ count: sum, name: 'اخري' });
            commit('SET_ORGANIZATIONS_DATA', showOrganizations);
            commit(
              'SET_ORGANIZATIONS_Label',
              Array.from(showOrganizations, statistic => statistic.name)
            );
            commit('SET_BACKGROUND_COLOR', [
              '#A93226',
              '#CB4335',
              '#884EA0',
              '#2471A3',
              '#17A589',
              '#27AE60',
              '#F1C40F',
              '#F39C12',
              '#D35400',
              '#6E2C00',
              '#2E4053',
              '#17202A',
              '#ff6361',
              '#bc5090',
              '#58508d',
              '#003f5c',
              '#665191',
              '#2f4b7c',
              '#f95d6a',
              '#ffa600',
              '#e74c3c',
              '#3498db',
              '#16a085',
              '#ddd',
            ]); // Array.from(showFields, statistic => helper.getRandomColor())
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    setSubmissions({ commit }, payload) {
      commit('SET_ORGANIZATION_ID', payload.organization_id);
      return new Promise((resolve, reject) => {
        statistic
          .submissions(payload.organization_id)
          .then(res => {
            commit('SET_SUBMISSIONS', res.submission);
            commit(
              'SET_SUBMISSIONS_DATA',
              Array.from(res.submission.slice(0, 10), statistic => statistic.count)
            );
            commit(
              'SET_SUBMISSIONS_LABEL',
              Array.from(res.submission.slice(0, 10), statistic => statistic.name.split('-')[0])
            );
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    setDecisions({ commit }, payload) {
      commit('SET_NON_ACTIVITIES_LOAD', true);
      return new Promise((resolve, reject) => {
        statistic
          .decisions(payload.query)
          .then(res => {
            commit('SET_DECISIONS', res.decisions);
            payload.backgroundColor ? commit('SET_DEC_BACKGROUND_COLOR', payload.backgroundColor) : '';
            commit(
              'SET_DECISIONS_DATA',
              Array.from(res.decisions, statistic => statistic.count)
            );
            commit(
              'SET_DECISIONS_LABEL',
              Array.from(res.decisions, statistic => (statistic.name ? statistic.name : 'لايوجد'))
            );
            commit('SET_NON_ACTIVITIES_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    setDecisionsActivities({ commit }, payload) {
      commit('SET_NON_DE_ACTIVITIES_LOAD', true);
      return new Promise((resolve, reject) => {
        statistic
          .activities(payload.query)
          .then(res => {
            commit(
              'SET_ACCREDITATION_DATA',
              Array.from(res.accreditation, statistic => statistic.count)
            );
            commit(
              'SET_NON_ACCREDITATION_DATA',
              Array.from(res.non_accreditation, statistic => statistic.count)
            );
            commit(
              'SET_OTHER_DATA',
              Array.from(res.other_accreditation, statistic => statistic.count)
            );
            commit(
              'SET_DELAY_DATA',
              Array.from(res.delay_accreditation, statistic => statistic.count)
            );
            commit(
              'SET_ACCREDITATION_NON_ACCREDITATION_LABEL',
              Array.from(res.labels, statistic => statistic)
            );
            commit('SET_NON_DE_ACTIVITIES_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    setUsersActivities({ commit }, payload) {
      commit('SET_USERS_ACTIVITIES_LOAD', true);
      return new Promise((resolve, reject) => {
        statistic
          .userActivities(payload.query)
          .then(res => {
            commit(
              'SET_USERS_ACTIVITIES_DATA',
              Array.from(res.activities, statistic => statistic.count)
            );
            commit('SET_USERS', res.users);
            commit(
              'SET_USERS_ACTIVITIES_LABEL',
              Array.from(res.activities, statistic => statistic.label)
            );
            commit('SET_USERS_ACTIVITIES_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
  },
};

export default statisticsModule;
