import Courses from '../../api/courses';
import router from '../../router';

const courses = new Courses();

const coursesModule = {
  namespaced: true,
  state: {
    courses: [],
    answer: null,
    evaluation: null,
    member_evaluation: null,
    course: null,
    coursesNames: [],
    coursesNamesDegree: [],
    totalcourses: 0,
    plans: [],
    trainees: [],
    coursesLoad: false,
    types: [],
    governments: [],
    cities: [],
    lookups: [],
    plansLoad: false,
    plan: null,
    reservationsLoad: false,
    reservations: [],
    trainers: [],
    places: [],
    count: null,
  },
  getters: {
    courses(state) {
      return state.courses;
    },
    governments(state) {
      return state.governments;
    },
    cities(state) {
      return state.cities;
    },

    coursesNames(state) {
      return state.coursesNames;
    },
    types(state) {
      return state.types;
    },
    coursesLoad(state) {
      return state.coursesLoad;
    },
    totalcourses(state) {
      return state.totalcourses;
    },

    lookup(state) {
      return state.lookups;
    },
    course(state) {
      if (state.course) {
        state.course['days_count'] = state.course['days'];
        // state.course['hours_count'] = state.course['hours'];
        delete state.course['days'];
        // delete state.course['hours'];
        // delete state.course[ 'name' ];
        return Object.entries(state.course)
          .map(([key, value]) => {
            return { key, value };
          })
          .filter(
            param =>
              !param.key.includes('id') &&
              param.key !== 'scores' &&
              param.key !== 'representative' &&
              param.key !== 'notes' &&
              param.key !== 'system' &&
              param.key !== 'payment' &&
              param.key !== 'expired' &&
              param.key !== 'full_name' &&
              param.key !== 'removed' &&
              param.key !== 'type' &&
              param.key !== 'search_text' &&
              param.key !== 'updated_at' &&
              param.value !== null
          );
      } else {
        return false;
      }
    },
    plan(state) {
      if (state.plan) {
        return Object.entries(state.plan)
          .map(([key, value]) => {
            return { key, value };
          })
          .filter(
            param =>
              !param.key.includes('id') &&
              param.key !== 'system' &&
              param.key !== 'ar_name' &&
              param.key !== 'code' &&
              param.key !== 'has_exam' &&
              param.key !== 'search_text' &&
              param.key !== 'date' &&
              param.key !== 'updated_at' &&
              param.key !== 'stoped' &&
              param.key !== 'removed' &&
              param.key !== 'expired' &&
              param.key !== 'created_at' &&
              param.value !== null
          );
      } else {
        return false;
      }
    },
    name(state) {
      if (state.courses) {
        return state.courses.name;
      }
      return '';
    },
    status(state) {
      if (state.courses) {
        return state.courses.removed;
      }
      return '';
    },
  },
  mutations: {
    SET_TOTAL_COURSES(state, total) {
      state.totalcourses = total;
    },
    SET_COURSES(state, courses) {
      state.courses = courses;
    },
    SET_TRAINEES(state, trainees) {
      state.trainees = trainees;
    },
    SET_TRAINERS(state, trainers) {
      state.trainers = trainers;
    },
    SET_COURSE(state, course) {
      state.course = course;
    },
    SET_PLANS(state, plans) {
      state.plans = plans;
    },
    SET_PLAN(state, plan) {
      state.plan = plan;
    },
    SET_COURSES_NAMES(state, courses) {
      state.coursesNames = courses;
    },
    SET_COURSES_NAMES_DEGREE(state, courses) {
      state.coursesNamesDegree = courses;
    },
    SET_COURSES_LOAD(state, load) {
      state.coursesLoad = load;
    },
    SET_PLANS_LOAD(state, load) {
      state.plansLoad = load;
    },
    SET_LOOKUPS(state, lookups) {
      state.lookups = lookups;
    },
    SET_RESERVATIONS(state, reservations) {
      state.reservations = reservations;
    },
    SET_RESERVATIONS_LOAD(state, load) {
      state.reservationsLoad = load;
    },
    SET_EVALUATION(state, evaluation) {
      state.evaluation = evaluation;
    },
    SET_ANSWER(state, answer) {
      state.answer = answer;
    },
    SET_PLACES(state, places) {
      state.places = places;
    },
    SET_TOTAL_PLACES(state, count) {
      state.count = count;
    },

    SET_MEMBER_EVALUATION(state, evaluation) {
      state.member_evaluation = evaluation;
    },
  },
  actions: {
    delete({ commit }, payload) {
      return new Promise((resolve, reject) => {
        courses
          .delete(payload.id, payload.query)
          .then(response => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    courses({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_COURSES_LOAD', true);
        courses
          .courses(payload.query)
          .then(response => {
            commit('SET_COURSES', response.courses);
            commit('SET_TOTAL_COURSES', response.count);
            commit('SET_LOOKUPS', response.lookups);
            commit('SET_COURSES_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    places({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_COURSES_LOAD', true);
        courses
          .places(payload.query)
          .then(response => {
            commit('SET_PLACES', response.places);
            commit('SET_TOTAL_PLACES', response.count);
            commit('SET_COURSES_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    sync_lms({ commit }, id) {
      return new Promise((resolve, reject) => {
        commit('SET_COURSES_LOAD', true);
        courses
          .sync_lms(id)
          .then(response => {
            commit('SET_COURSES_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    reservations({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_RESERVATIONS_LOAD', true);
        courses
          .reservations(payload.query)
          .then(response => {
            commit('SET_RESERVATIONS', response.submissions);
            commit('SET_TOTAL_COURSES', response.count);
            commit('submission/SET_LEVELS', response.levels, { root: true });
            commit('SET_LOOKUPS', response.lookups);
            commit('SET_RESERVATIONS_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    plans({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_PLANS_LOAD', true);
        courses
          .plans(payload.query)
          .then(response => {
            commit('SET_PLANS', response.plans);
            commit('SET_TOTAL_COURSES', response.count);
            commit('SET_LOOKUPS', response.lookups);
            commit('SET_PLANS_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    getEvaluation({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_COURSES_LOAD', true);
        courses
          .getEvaluation(payload)
          .then(response => {
            commit('SET_MEMBER_EVALUATION', response.evaluation);
            commit('SET_COURSES_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    course({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_COURSES_LOAD', true);
        courses
          .course(payload)
          .then(response => {
            commit('SET_COURSE', response.course);
            commit('SET_PLANS', response.plans);
            commit('SET_COURSES_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    savePlace({ commit }, payload) {
      return new Promise((resolve, reject) => {
        courses
          .savePlace(payload)
          .then(response => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    saveNotes({ commit }, payload) {
      return new Promise((resolve, reject) => {
        courses
          .saveNotes(payload)
          .then(response => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    plan({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_PLANS_LOAD', true);
        courses
          .plan(payload)
          .then(response => {
            commit('SET_PLAN', response.plan);
            commit('SET_TRAINEES', response.trainees);
            commit('SET_TRAINERS', response.trainers);
            commit('evaluation/SET_EVALUATOR', response.evaluator || null, { root: true });
            commit('SET_PLANS_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    submission({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_COURSES_LOAD', true);
        courses
          .submission(payload)
          .then(response => {
            commit('SET_COURSE', response.submission);
            commit('SET_EVALUATION', response.evaluation);
            commit('SET_ANSWER', response.answer_types);
            commit('submission/SET_LAST_ALERT', response.last_alert || null, { root: true });
            commit('submission/SET_ALERTS', response.alert, { root: true });
            commit('evaluation/SET_EVALUATOR', response.evaluator || null, { root: true });
            commit('SET_TRAINERS', response.trainers);
            commit('SET_COURSES_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    getPlan({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_PLANS_LOAD', true);
        courses
          .getPlan(payload)
          .then(response => {
            commit('SET_LOOKUPS', response.lookup);
            commit('SET_PLAN', response.plan);
            commit('SET_PLANS_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    getCourse({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_COURSES_LOAD', true);
        courses
          .getCourse(payload)
          .then(response => {
            commit('SET_LOOKUPS', response.lookups);
            commit('SET_COURSE', response.course);
            commit('SET_COURSES_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    saveCourse({ commit }, payload) {
      return new Promise((resolve, reject) => {
        courses
          .saveCourse(payload)
          .then(response => {
            // return router.push(`/higher/courses/${response.courses.id}`);
            return router.go(-1);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    saveEvaluation({ commit }, payload) {
      return new Promise((resolve, reject) => {
        courses
          .saveEvaluation(payload)
          .then(response => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    deleteCourse({ commit }, id) {
      return new Promise((resolve, reject) => {
        courses
          .deleteCourse(id)
          .then(response => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    deletePlace({ commit }, id) {
      return new Promise((resolve, reject) => {
        courses
          .deletePlace(id)
          .then(response => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    booking({ commit }, id) {
      commit('SET_PLANS_LOAD', true);
      return new Promise((resolve, reject) => {
        courses
          .booking(id)
          .then(response => {
            commit('SET_PLANS_LOAD', false);
            return router.push(`/course/reservations/reservation/${response.submission.id}`);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    addTrainers({ commit }, payload) {
      return new Promise((resolve, reject) => {
        courses
          .addTrainers(payload)
          .then(response => {
            // return router.push(`/higher/courses/${response.courses.id}`);
            // return router.go(-1);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    savePlan({ commit }, payload) {
      return new Promise((resolve, reject) => {
        courses
          .savePlan(payload)
          .then(response => {
            // return router.push(`/higher/courses/${response.courses.id}`);
            return router.go(-1);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    deletePlan({ commit }, id) {
      return new Promise((resolve, reject) => {
        courses
          .deletePlan(id)
          .then(response => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    save({ commit }, payload) {
      return new Promise((resolve, reject) => {
        courses
          .save(payload)
          .then(response => {
            // return router.push(`/higher/courses/${response.courses.id}`);
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
        courses
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
        courses
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
        courses
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
        courses
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
        courses
          .names(payload.query)
          .then(response => {
            if (payload.degree) {
              commit('SET_COURSES_NAMES_DEGREE', response.courses);
            } else {
              commit('SET_COURSES_NAMES', response.courses);
            }
            commit('SET_COURSES', response.courses);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
  },
};

export default coursesModule;
