<template>
  <CHeader fixed with-subheader light :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'">
    <CToggler in-header class="ml-3 d-lg-none" @click="$store.commit('toggleSidebarMobile')" />
    <CToggler in-header class="ml-3 d-md-down-none" @click="$store.commit('toggleSidebarDesktop')" />

    <CHeaderBrand class="mr-auto ml-3 d-lg-none" to="/">
      <h1>NAQAAE</h1>
    </CHeaderBrand>

    <CHeaderNav class="d-md-down-none m-auto">
      <CCard v-if="$route.name == 'editReport'" style="width: 100%" id="smallfixedprogress" class="mystyle">
        <CRow v-if="$store.getters['evaluation/evaluator'] !== evConstants('ORGANIZATION_TYPE')" class="no-gutters pl-2 pr-2 report_progress" style="border: 1px solid #eee">
          <b-progress class="w-100 my-2" style="height: 2rem" show-value>
            <b-progress-bar v-for="state in status" :value="state.value ? ((state.value.count / $store.getters['evaluation/questions'].length) * 100).toFixed(2) : 0" :variant="getAnswer(state.label).type">
              <el-tooltip effect="dark" :content="$t(`Global.${state.name}`)" placement="top">
                <strong>
                  <span> %{{ state.value ? ((state.value.count / $store.getters['evaluation/questions'].length) * 100).toFixed(2) : 0 }} </span>
                </strong>
              </el-tooltip>
            </b-progress-bar>
          </b-progress>
        </CRow>
      </CCard>

      <CCard v-if="$route.name == 'editPreReport' && !Pu" style="width: 100%" id="smallfixedprogress" class="mystyle">
        <CRow v-if="!evaluatorCheck(['ORGANIZATION_TYPE'])" class="no-gutters pl-2 pr-2 report_progress" style="border: 1px solid #eee">
          <b-progress class="w-100 my-2" style="height: 2rem" show-value>
            <b-progress-bar v-for="state in Prestatus" :value="state.value ? ((state.value.count / $store.state.evaluation.standerdsCount) * 100).toFixed(2) : 0" :variant="getpreAnswer(state.label).type">
              <el-tooltip effect="dark" :content="state.value ? $t(`Global.${state.name}`) + ' %' + ((state.value.count / $store.state.evaluation.standerdsCount) * 100).toFixed(2) : '0'" placement="top">
                <span
                  ><strong>%{{ state.value ? ((state.value.count / $store.state.evaluation.standerdsCount) * 100).toFixed(2) : 0 }}</strong></span
                >
              </el-tooltip>
            </b-progress-bar>
          </b-progress>
        </CRow>
      </CCard>
    </CHeaderNav>
    <CHeaderNav class="mr-lg-4 justify-content-between w-sm-100">
      <div class="c-header-nav mr-lg-4">
        <ul class="p-0">
          <li style="display: inline-block; margin-right: 10px; cursor: pointer" v-if="$i18n.locale === 'en'" @click="changeLocal('ar')">
            <CIcon name="cil-globe-alt" style="margin-right: 5px; margin-left: 5px" />
            {{ $t('Global.arabic') }}
          </li>
          <li style="display: inline-block; margin-right: 10px; margin-left: 10px; cursor: pointer" v-if="$i18n.locale === 'ar'" @click="changeLocal('en')">
            <CIcon name="cil-globe-alt" style="margin-right: 5px; margin-left: 5px" />
            {{ $t('Global.english') }}
          </li>
        </ul>
        <router-link to="/management/ticket/add">
          <fa-icon :icon="['fas', 'question-circle']" size="lg" />
        </router-link>
        <Notifications v-if="!$store.getters['user/isRequired']"> </Notifications>
      </div>
      <TheHeaderDropdownAccnt />
    </CHeaderNav>
    <!-- <el-alert effect="dark" v-if="Pu" class="mb-2 mx-3" :closable="false" :title="$t('Global.attention')" type="warning" show-icon>
      <div class="d-flex flex-wrap">
        <span>  منظومة التعليم قبل الجامعي للاطلاع فقط. سيتم تشغيل المنظومه بالكامل قريبا. في حالة وجود اي استفسار برجاء التواصل مع.  </span>
        <span > . عمرو محمد احمد سيد ( 01098899982 )  - </span>
        <span>   </span>
        <span> - محمد ابراهيم انور حسن ( 01098889994 )</span>
      </div>
    </el-alert> -->
    <CSubheader class="px-3 custom_font_size" id="c-subheader" v-if="rerender">
      <CBreadcrumb id="breadcrumb" :items="items"></CBreadcrumb>
      <i v-if="$route.name != 'editReport'" :class="$i18n.locale === 'ar' ? 'el-icon-back custom-icon' : 'el-icon-right custom-icon'" @click="goBack()"></i>
    </CSubheader>
  </CHeader>
</template>

<script>
import TheHeaderDropdownAccnt from './TheHeaderDropdownAccnt';
import Cookies from 'js-cookie';
import Notifications from './notifications';

export default {
  name: 'TheHeader',
  data() {
    return {
      rerender: false,
    };
  },
  components: {
    Notifications,
    TheHeaderDropdownAccnt,
  },
  methods: {
    changeLocal(locale) {
      localStorage.setItem('lang', locale);
      this.$i18n.locale = locale;
    },
    goToNext() {
      this.$store.commit('archive/SET_FULL_PATH', this.$route.path);
    },
    goBack() {
      this.$router.go(-1);
    },
  },
  watch: {
    items: function () {
      this.rerender = false;
      setTimeout(() => {
        this.rerender = true;
      }, 300);
    },
    $route(to, from) {
      if (to.path == '/school/submissions/add/1' && from.name == 'EditSubmission') {
        this.$router.push(`/school/submissions/edit/${from.params.id}/1`);
      }
      if (this.authUser().id) {
        this.$store.dispatch('roles/getAuthUserRolesPermissions', this.authUser().id);
      }
      if (to.name == 'higherEducation') {
        this.$router.push('/higher');
      }
      if (to.name == 'trainingSystem') {
        this.$router.push('/course');
      }
      if (to.name == 'SchoolSystem') {
        this.$router.push('/school');
      }
      if (to.name == 'SchoolSystem') {
        this.$router.push('/school');
      }
      if (to.name == 'submissions') {
        if (from.fullPath.includes('school')) {
          this.$router.push('/school/submissions');
        }
      }
      this.$store.commit('archive/SET_FULL_PATH', this.$route.path);
      if (to.name == 'submission' || to.name == 'submissions') return;
      this.$store.commit('set', ['decision_id', null]);
      this.$store.commit('set', ['level_sub', null]);
      this.$store.commit('set', ['new_request', null]);
      this.$store.commit('set', ['stage', null]);
      this.$store.commit('set', ['type_sub', null]);
      this.$store.commit('set', ['SCgender', null]);
      this.$store.commit('set', ['dayType', null]);
      this.$store.commit('set', ['administration', null]);
      this.$store.commit('set', ['directorate_id', null]);
      this.$store.commit('set', ['organization_sub', null]);
      this.$store.commit('set', ['university_sub', null]);
      this.$store.commit('set', ['educationType_sub', null]);
      this.$store.commit('set', ['search_all', null]);
      this.$store.commit('set', ['roles_sub', null]);
      this.$store.commit('set', ['user_id_sub', null]);
      if (to.name == 'organization' || to.name == 'organizations') return;
      this.$store.commit('set', ['SCgender_org', null]);
      this.$store.commit('set', ['stage_org', null]);
      this.$store.commit('set', ['administration_org', null]);
      this.$store.commit('set', ['directorate_id_org', null]);
      this.$store.commit('set', ['sector', null]);
      this.$store.commit('set', ['range', null]);
      this.$store.commit('set', ['search_all', null]);
      this.$store.commit('set', ['university_id_org', null]);
      this.$store.commit('set', ['type_org', null]);
      this.$store.commit('set', ['eduactionType_org', null]);
    },
  },
  computed: {
    Pu() {
      if (this.$route.path) {
        if (this.$route.path.includes('school')) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    status() {
      return this.$store.getters['evaluation/editStatistics'];
    },
    Prestatus() {
      return this.$store.getters['evaluation/editPreStatistics'];
    },
    items() {
      setTimeout(() => {
        this.rerender = true;
      }, 300);
      var plans = { beforeEnter: undefined, name: 'plans', path: '/course/plans', fullPath: '/course/plans' };
      var filtered;
      var newroutes = [];
      if (this.$route.name == 'coursesSettings') {
        filtered = this.$route.matched.filter(function (value, index, arr) {
          return value.name != 'courses';
        });
      } else {
        filtered = this.$route.matched.filter(function (value, index, arr) {
          return value;
        });
      }
      let routes = filtered.filter(route => {
        return route.name || (route.meta && route.meta.label);
      });
      let last = routes[routes.length - 1];
      this.$store.getters['pathTitle']
        ? (routes[routes.length - 1] = {
            path: last.path,
            title: `${this.$t(`Global.${last.name}`)} (${this.$store.getters['pathTitle']})`,
          })
        : routes;
      return routes.map(route => {
        const meta = route.meta || {};
        return {
          to: route,
          text: meta.label ? this.$t(`Global.${meta.label}`) : '' || route.name ? this.$t(`Global.${route.name}`) : '' || route.title ? route.title : '',
        };
      });
    },
  },
  mounted() {
    this.goToNext();
    this.$i18n.locale = localStorage.getItem('lang') ? localStorage.getItem('lang') : 'ar';
  },
};
</script>

<style lang="scss">
@media (max-width: 600px) {
  .w-sm-100 {
    width: 100% !important;
  }
}
.breadcrumb-item {
  text-align: initial;
}
.c-subheader {
  min-height: auto;
}

.c-subheader {
  justify-content: space-between;
  align-items: center;
}

.custom-icon {
  cursor: pointer;
  font-size: 1.5rem;
  transition: all ease-in-out 0.3s;

  &:hover {
    margin-left: 0.2rem;
  }
}

.custom_back_btn {
  background-color: #173f5f !important;
  border: none;
  margin: 0.5rem !important;
  color: white !important;
  opacity: 0.8 !important;
  width: 40px;
  height: 40px;
}

.custom_back_btn:hover {
  opacity: 1;
}

.c-header.c-header-fixed {
  // z-index: 9999;
}

.breadcrumb {
  border: none;
  margin: 0;
  align-items: center;
}
</style>
