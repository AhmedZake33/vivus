import Hotels from '../../api/hotels';

const hotel = new Hotels();

const hotelModule = {
  namespaced: true,
  state: {
    hotels: [],
    hotelsLoad: false,
    totalHotels: 0,
    hotel: Object,
    hotelLoad: Boolean,
    reservation_info: Object,
    reservation: Object,
    reservationLoad: false,
    questions: [],
    questionsLoad: false,
    levels: null,
    services: null,
    selected: null,
    totalQuestions: 0,
    reservations: null,
    selected_reservation: null,
  },
  getters: {
    hotels(state) {
      return state.hotels;
    },
    hotelsLoad(state) {
      return state.hotelsLoad;
    },
    hotelLocation(state) {
      return [{ latitude: state.hotel.latitude, longitude: state.hotel.longitude }];
    },
    totalHotels(state) {
      return state.totalHotels;
    },
    reservations(state) {
      if (state.reservations) {
        return state.reservations;
      }
    },
    reservation_info(state) {
      return Object.entries(state.reservation_info)
        .map(([key, value]) => {
          return { key, value };
        })
        .filter(
          param =>
            !param.key.includes('id') &&
            param.key !== 'city' &&
            param.key !== 'government' &&
            param.value !== null
        );
    },

    reservation(state) {
      return state.reservation;
    },
    services(state) {
      return state.services;
    },
    reservationLoad(state) {
      return state.reservationLoad;
    },
    hotel(state) {
      return Object.entries(state.hotel)
        .map(([key, value]) => {
          return { key, value };
        })
        .filter(
          param =>
            !param.key.includes('id') &&
            param.key !== 'contact' &&
            param.key !== 'city' &&
            param.key !== 'government' &&
            param.key !== 'level' &&
            param.key !== 'reservations' &&
            param.key !== 'created_by' &&
            param.key !== 'search_text' &&
            param.key !== 'latitude' &&
            param.key !== 'longitude' &&
            param.key !== 'removed' &&
            param.key !== 'created_at' &&
            param.key !== 'updated_at' &&
            param.value !== null
        );
    },
    name(state) {
      if (state.hotel) {
        return state.hotel.name;
      }
      return '';
    },
    status(state) {
      if (state.hotel) {
        return state.hotel.removed;
      }
      return '';
    },
    hotelLoad(state) {
      return state.hotelLoad;
    },
    selected_reservation: state => state.selected_reservation,
    questionsLoad(state) {
      return state.questionsLoad;
    },
    questions(state) {
      return state.questions;
    },
    totalQuestions(state) {
      return state.totalQuestions;
    },
  },
  mutations: {
    SET_TOTAL_HOTELS(state, total) {
      state.totalHotels = total;
    },
    SET_RESERVATIONS(state, reservations) {
      state.reservations = reservations;
    },
    SET_HOTELS(state, hotels) {
      state.hotels = hotels;
    },
    SET_HOTELS_LOAD(state, load) {
      state.hotelsLoad = load;
    },
    SET_HOTEL_LOAD(state, load) {
      state.hotelLoad = load;
    },
    SET_HOTEL(state, hotel) {
      state.hotel = hotel;
    },
    SET_RESERVATION(state, reservation) {
      state.reservation = reservation;
    },
    SET_SERVICES(state, services) {
      state.services = services;
    },
    SET_RESERVATION_INFO(state, info) {
      state.reservation_info = info;
    },
    SET_RESERVATION_LOAD(state, load) {
      state.reservationLoad = load;
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
    SET_LEVELS: (state, levels) => {
      state.levels = levels;
    },
    SET_SELECTED_RESERVATION: (state, reservation) => {
      state.selected_reservation = reservation;
    },
    SET_SELECTED: (state, selected) => {
      state.selected = selected;
    },
  },
  actions: {
    hotels({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_HOTELS_LOAD', true);
        hotel
          .list(payload.query)
          .then(response => {
            commit('SET_HOTELS', response.hotels);
            commit('SET_TOTAL_HOTELS', payload.query.search_text !== '' ? response.hotels.length : response.count);
            commit('SET_HOTELS_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    hotel({ commit }, id) {
      return new Promise((resolve, reject) => {
        commit('SET_HOTEL_LOAD', true);
        hotel
          .get(id)
          .then(response => {
            commit('SET_HOTEL', response.hotel);
            commit('SET_RESERVATIONS', response.hotel ? response.hotel.reservations : null);
            commit('SET_HOTEL_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    edit({ commit }, id) {
      return new Promise((resolve, reject) => {
        commit('SET_HOTEL_LOAD', true);
        hotel
          .edit(id)
          .then(response => {
            commit('SET_LEVELS', response.levels);
            commit('SET_SELECTED', response.selected);
            commit('SET_SELECTED_RESERVATION', response.reservation);
            commit('team/SET_TEAMS', response.teams, { root: true });
            commit('organization/SET_CITIES', response.cities, { root: true });
            commit('organization/SET_GOVERNMENTS', response.governments, { root: true });
            commit('SET_HOTEL_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    add({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_HOTEL_LOAD', true);
        hotel
          .add(payload)
          .then(response => {
            commit('SET_HOTEL_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    addReservation({ commit }, payload) {
      return new Promise((resolve, reject) => {
        hotel
          .addReservation(payload)
          .then(response => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    deleteReservation({ commit }, id) {
      return new Promise((resolve, reject) => {
        hotel
          .deleteReservation(id)
          .then(response => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    approve({ commit }, id) {
      return new Promise((resolve, reject) => {
        hotel
          .approve(id)
          .then(response => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    reservation({ commit }, id) {
      return new Promise((resolve, reject) => {
        commit('SET_RESERVATION_LOAD', true);
        hotel
          .reservation(id)
          .then(response => {
            commit('SET_RESERVATION_INFO', response.info);
            commit('SET_RESERVATION', response.reservation);
            commit('SET_SERVICES', response.services);
            commit('SET_RESERVATION_LOAD', false);
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
        hotel
          .questions(payload.id, payload.query)
          .then(response => {
            commit('SET_QUESTIONS', response.questions);
            commit('SET_TOTAL_QUESTIONS', response.count);
            commit('SET_QUESTIONS_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    saveService({ commit }, payload) {
      return new Promise((resolve, reject) => {
        hotel
          .saveService(payload.id, payload.query)
          .then(response => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    addService({ commit }, payload) {
      console.log(payload.query)
      return new Promise((resolve, reject) => {
        hotel.addService(payload.query)
            .then(response => {
              resolve();
            })
            .catch(error => {
              reject(error);
            });
      });
    },

    deleteService({ commit }, id) {
      return new Promise((resolve, reject) => {
        hotel
          .deleteService(id)
          .then(response => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
  },
};

export default hotelModule;
