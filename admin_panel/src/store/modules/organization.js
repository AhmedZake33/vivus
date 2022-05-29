import Organizations from '../../api/organizations';
import router from '../../router';

const organization = new Organizations();

const organizationModule = {
  namespaced: true,
  state: {
    organizations: [],
    organizationNames: [],
    organizationNamesDegree: [],
    organizationsLoad: false,
    totalOrganizations: 0,
    organization: {},
    representative: {},
    organizationLoad: Boolean,
    educationTypes: [],
    types: null,
    programs: [],
    governments: [],
    cities: [],
    lookups: [],
    sectors: [],
    stages: null,
    organization_edu_names:null,
    decisions:[]
  },
  getters: {
    decisions(state){
      return state.decisions;
    },
    organizations(state) {
      return state.organizations;
    },
    governments(state) {
      return state.governments;
    },
    cities(state) {
      return state.cities;
    },
    organizationNames(state) {
      return state.organizationNames;
    },
    programs: state => state.programs,
    educationTypes(state) {
      return state.educationTypes;
    },
    sectors(state) {
      return state.sectors;
    },
    types(state) {
      return state.types;
    },
    organizationsLoad(state) {
      return state.organizationsLoad;
    },
    totalOrganizations(state) {
      return state.totalOrganizations;
    },
    organizationLocation(state) {
      if (state.organization) {
        if (state.organization.latitude && state.organization.longitude) {
          return [{ latitude: state.organization.latitude, longitude: state.organization.longitude }];
        } else {
          return false;
        }
      }
    },

    lookup(state) {
      return state.lookups;
    },
    organization(state) {
      if (state.organization) {
        return Object.entries(state.organization)
          .map(([key, value]) => {
            return { key, value };
          })
          .filter(
            param =>
              !param.key.includes('id') &&
              param.key !== 'sector' &&
              param.key !== 'representative' &&
              param.key !== 'name' &&
              param.key !== 'alt_email' &&
              param.key !== 'org_type' &&
              param.key !== 'azhar_building_number' &&
              param.key !== 'school_code' &&
              param.key !== 'institute' &&
              param.key !== 'evaluations' &&
              param.key !== 'education_type' &&
              param.key !== 'governmental' &&
              param.key !== 'high' &&
              param.key !== 'school_day_type' &&
              param.key !== 'system' &&
              param.key !== 'university' &&
              param.key !== 'created_by' &&
              param.key !== 'search_text' &&
              param.key !== 'latitude' &&
              param.key !== 'longitude' &&
              param.key !== 'removed' &&
              param.key !== 'created_at' &&
              param.key !== 'updated_at' &&
              param.key !== 'last_submission' &&
              param.value !== null
          );
      } else {
        return false;
      }
    },
    representative(state) {
      if (state.representative) {
        return state.representative;
      }
      return false;
    },
    governmental(state) {
      if (state.organization) {
        return state.organization.governmental;
      }
      return '';
    },

    evaluations(state) {
      if (state.organization) {
        return state.organization.evaluations;
      }
      return '';
    },

    high(state) {
      if (state.organization) {
        return state.organization.high;
      }
      return '';
    },
    university(state) {
      if (state.organization) {
        return state.organization.university;
      }
      return '';
    },
    name(state) {
      if (state.organization) {
        return state.organization.name + `${state.organization.university?.name ? ' - ' + state.organization.university.name : ''} `;
      }
      return '';
    },
    status(state) {
      if (state.organization) {
        return state.organization.removed;
      }
      return '';
    },
    organizationLoad(state) {
      return state.organizationLoad;
    },
  },
  mutations: {
    SET_DECISIONS(state,decisions){
      state.decisions = decisions;
    },
    SET_TOTAL_ORGANIZATIONS(state, total) {
      state.totalOrganizations = total;
    },
    SET_ORGANIZATIONS(state, organizations) {
      state.organizations = organizations;
    },
    SET_ORGANIZATIONS_NAMES(state, organizations) {
      state.organizationNames = organizations;
    },
    SET_ORGANIZATIONS_NAMES_DEGREE(state, organizations) {
      state.organizationNamesDegree = organizations;
    },
    SET_EDU_ORGANIZATIONS_NAMES(state, organizations) {
        state.organization_edu_names = organizations;
      },
    SET_ORGANIZATIONS_LOAD(state, load) {
      state.organizationsLoad = load;
    },
    SET_ORGANIZATION_LOAD(state, load) {
      state.organizationLoad = load;
    },
    SET_ORGANIZATION(state, organization) {
      state.organization = organization;
    },
    SET_LOOKUPS(state, lookups) {
      state.lookups = lookups;
    },
    SET_REPRESENTATIVE(state, representative) {
      state.representative = representative;
    },
    SET_EDUCATION_TYPES(state, types) {
      state.educationTypes = types;
    },
    SET_SECTORS(state, sectors) {
      state.sectors = sectors;
    },
    SET_TYPES(state, types) {
      state.types = types;
    },
    SET_STAGES(state, stages) {
      state.stages = stages;
    },
    SET_GOVERNMENTS(state, governments) {
      state.governments = governments;
    },
    SET_CITIES(state, cities) {
      state.cities = cities;
    },
    SET_PROGRAMS(state, programs) {
      state.programs = programs;
    },
  },
  actions: {
    delete({ commit }, payload) {
      return new Promise((resolve, reject) => {
        organization
          .delete(payload.id, payload.query)
          .then(response => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    organizations({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_ORGANIZATIONS_LOAD', true);
        organization
          .list(payload.query)
          .then(response => {
            commit('SET_ORGANIZATIONS', response.organizations);
            commit('SET_TYPES', response.types);
            commit('SET_EDUCATION_TYPES', response.eductionTypes);
            commit('SET_SECTORS', response.sectors);
            commit('SET_TOTAL_ORGANIZATIONS', response.count);
            // commit('SET_DECISIONS',response.decisions);
            commit('submission/SET_SCGENDER', response.schoolGenders, { root: true });
            commit('submission/SET_DIRECTORATE', response.directorate, { root: true });
            commit('submission/SET_ADMINISTRATION', response.administration, { root: true });
            commit('submission/SET_STAGE', response.stages, { root: true });
            commit('submission/SET_DAY_TYPE', response.dayTypes, { root: true });
            commit('SET_ORGANIZATIONS_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    organization({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_ORGANIZATION_LOAD', true);
        organization
          .get(payload)
          .then(response => {
            commit('SET_ORGANIZATION', response.organization);
            commit('SET_REPRESENTATIVE', response.representative);
            commit('SET_PROGRAMS', response.programs);
            commit('SET_LOOKUPS', response.lk_organization || response.organization_lk);
            // commit('SET_TYPES', response.types);
            // commit('SET_STAGES', response.stages);
            // commit('submission/SET_DAY_TYPE', response.dayTypes, { root: true });
            commit('SET_EDUCATION_TYPES', response.organization ? response.organization.education_type : null);
            // commit('SET_SECTORS', response.sectors);
            // commit('SET_CITIES', response.cities);
            // commit('submission/SET_SCGENDER', response.schoolGenders, { root: true });
            commit('submission/SET_LOOKUPS', response.lookups, { root: true });
            // commit('submission/SET_LOOKUPS', response.lookups, {root: true});
            // commit('SET_GOVERNMENTS', response.governments);
            commit('SET_ORGANIZATION_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    save({ commit }, payload) {
      return new Promise((resolve, reject) => {
        organization
          .save(payload)
          .then(response => {
            // return router.push(`/higher/organization/${response.organization.id}`);
            return router.go(-1);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    saveDepartment({ commit }, payload) {
      return new Promise((resolve, reject) => {
        organization
          .saveDepartment(payload.id, payload.query)
          .then(response => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    deleteDepartment({ commit }, id) {
      return new Promise((resolve, reject) => {
        organization
          .deleteDepartment(id)
          .then(response => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    saveProgram({ commit }, payload) {
      return new Promise((resolve, reject) => {
        organization
          .saveProgram(payload.id, payload.query)
          .then(response => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    deleteProgram({ commit }, id) {
      return new Promise((resolve, reject) => {
        organization
          .deleteProgram(id)
          .then(response => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    names({ commit }, payload) {
      return new Promise((resolve, reject) => {
        organization
          .names(payload.query)
          .then(response => {
            if (payload.degree) {
              commit('SET_ORGANIZATIONS_NAMES_DEGREE', response.organizations);
            } else if (payload.edu) {
              commit('SET_EDU_ORGANIZATIONS_NAMES', response.organizations);
            } else {
              commit('SET_ORGANIZATIONS_NAMES', response.organizations);
            }
            commit('SET_ORGANIZATIONS', response.organizations);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
  },
};

export default organizationModule;
