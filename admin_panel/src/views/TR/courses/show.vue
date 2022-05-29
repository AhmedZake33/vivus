<template>
  <div v-loading="$store.getters['course/coursesLoad']" class="custom_info_alert" v-if="$store.getters['course/course']">
    <Show id="submission_id" icon="el-icon-message" :items="$store.getters['course/course']" :name="course_name" except="team" v-if="hasPermission('show_courses')">
      <template #show_status>
        <CBadge color="success" v-if="$store.state.course.course && $store.state.course.course.removed === 0" style="margin: 4px">
          {{ $t('Global.active') }}
        </CBadge>
        <CBadge color="danger" v-if="$store.state.course.course && $store.state.course.course.removed === 1" style="margin: 4px">
          {{ $t('Global.remove') }}
        </CBadge>
      </template>
      <template #show_action>
        <CDropdown v-if="ifFound" color="success" placement="bottom-end" size="sm" class="d-inline customDrop print_hide">
          <template #toggler-content>
            <CIcon name="cil-settings" />
            <span style="font-weight: bold">{{ $t('Global.action') }}</span>
          </template>
          <router-link v-if="hasPermission('edit_courses')" class="iF_found item d-block" :to="{ path: `/course/courses/edit/${$route.params.id}` }">
            <div style="text-align: initial">
              <i class="el-icon-s-marketing"></i>
              {{ $t('Global.editCourse') }}
            </div>
          </router-link>
          <router-link @click.native="cancelPlan($route.params.id)" v-if="hasPermission('admin_courses')" class="iF_found item d-block" to="">
            <div style="text-align: initial">
              <template v-if="$store.state.course.course && $store.state.course.course.removed == 0">
                <i class="el-icon-delete"></i>
                {{ $t('Global.cancelCourse') }}
              </template>
              <template v-else>
                <i class="el-icon-refresh"></i>
                {{ $t('Global.activateCourse') }}
              </template>
            </div>
          </router-link>
        </CDropdown>
      </template>
    </Show>

    <CCard>
      <CCardHeader>
        <div class="d-flex justify-content-between align-items-baseline w-100" :class="$i18n.locale === 'ar' ? 'card-header-actions' : ''" style="display: inline-block; font-weight: bold">
          <div><i class="el-icon-data-board"></i> {{ $t('Global.plans') }}</div>
        </div>
      </CCardHeader>
      <CCardBody>
        <CRow class="mt-3" v-loading="$store.state.course.plansLoad">
          <CCol class="pb-3 pr-2" lg="4" sm="12" md="6" v-for="(course, index) in $store.state.course.plans" :key="index">
            <el-card shadow="hover" class="position-relative" style="overflow: visible" :body-style="{ padding: '0px' }">
              <el-tooltip effect="dark" placement="top">
                <div slot="content">
                  {{ course.place }}
                </div>
                <CBadge color="info badge-pill" class="topLeft text-truncate" style="max-width:300px">{{ course.place }}</CBadge>
              </el-tooltip>
              <div slot="header" class="d-flex justify-content-between pt-2">
                <el-tooltip effect="dark" placement="top">
                  <div slot="content">
                    {{ course.name }}
                  </div>
                  <div class="text-initial" style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 100%">
                    <span class="font-weight-bolder">
                      {{ course.name }}
                    </span>
                  </div>
                </el-tooltip>
              </div>
              <div style="padding: 14px">
                <div class="bottom">
                  <div class="d-flex justify-content-between">
                    <div>
                      <span class="d-flex font-weight-bolder">{{ $t('Global.courseStart') }}</span>
                      <time class="time small d-flex">{{ DateFormat(course.start) }}</time>
                    </div>

                    <div>
                      <span class="d-flex font-weight-bolder">{{ $t('Global.courseEnd') }}</span>
                      <time class="time small d-flex">{{ DateFormat(course.end) }}</time>
                    </div>
                  </div>
                  <el-divider class="my-1"></el-divider>
                  <div class="d-flex justify-content-between">
                    <div>
                      <span class="d-flex font-weight-bolder">{{ $t('Global.attend_time') }}</span>
                      <time class="time small d-flex">{{ course.start_time }}</time>
                    </div>
                    <div>
                      <span class="d-flex font-weight-bolder">{{ $t('Global.leave_time') }}</span>
                      <time class="time small d-flex"> {{ course.end_time }}</time>
                    </div>
                  </div>
                  <el-divider class="my-1"></el-divider>
                  <div class="d-flex justify-content-between">
                    <div>
                      <span class="d-flex font-weight-bolder">{{ $t('Global.code_plan') }}</span>
                      <time class="time small d-flex">{{ course.code_plan }}</time>
                    </div>
                    <div>
                      <span class="d-flex font-weight-bolder">{{ $t('Global.coursePrice') }}</span>
                      <time class="time small d-flex">{{ course.price }}</time>
                    </div>
                  </div>

                  <el-divider class="my-1"></el-divider>
                  <div class="d-flex justify-content-between">
                    <div>
                      <span class="d-flex font-weight-bolder">{{ $t('Global.area') }}</span>
                      <time class="time small d-flex">{{ course.area }}</time>
                    </div>
                    <div>
                      <span class="d-flex font-weight-bolder">{{ $t('Global.coursePeriod') }}</span>
                      <time class="time small d-flex">{{ course.period }}</time>
                    </div>
                  </div>
                  <el-divider class="my-1"></el-divider>
                  <div class="d-flex justify-content-between">
                    <!-- <router-link to="">
                      <el-button @click="booking(course.id)" icon="el-icon-right" round size="mini" class="mx-1 right_icon mt-2" type="primary">
                        {{ $t('Global.join') }}
                      </el-button>
                    </router-link> -->
                    <div>
                      <el-tooltip effect="dark" placement="top">
                        <div slot="content">
                          {{ $t('Global.participants') }}
                        </div>
                        <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 100%">
                          <span class="font-weight-bolder"> {{ course.trainees_submissions_count }} \ {{ course.max_trainer }} </span>
                        </div>
                      </el-tooltip>
                    </div>
                    <router-link :to="`/course/plans/plan/${course.id}`">
                      <el-button icon="el-icon-view" round size="mini" class="mx-1 mt-2" type="primary">
                        {{ $t('Global.show') }}
                      </el-button>
                    </router-link>
                  </div>
                </div>
              </div>
            </el-card>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
  </div>
</template>
<script>
import Show from '../../components/Show.vue';
import * as helper from '../../../utils/helper';
export default {
  components: { Show },
  props: { type: String },
  name: 'info',
  data() {
    return {
      isLoad: false,
      dialogVisible: false,
      user_id: null,
      team_id: null,
      ifFound: true,
      form: {
        comment: null,
      },
    };
  },
  // updated() {
  //   this.$nextTick(() => {
  //     let foundClass = document.querySelector(`.customDrop .iF_found`);
  //     if (foundClass) {
  //       this.ifFound = true;
  //     } else {
  //       this.ifFound = false;
  //     }
  //   });
  // },
  mounted() {
    this.Refresh();
  },
  computed: {
    course_name: function () {
      if (this.$store.state.course.course && this.$store.state.course.course.ar_name) {
        return this.$store.state.course.course.ar_name;
      }
    },
  },
  methods: {
    checkFound() {
      this.$nextTick(() => {
        let foundClass = document.querySelector(`.customDrop .iF_found`);
        if (foundClass) {
          this.ifFound = true;
        } else {
          this.ifFound = false;
        }
      });
    },
    DateFormat(date) {
      return helper.toLocalDatetime(date, `${this.$i18n.locale == 'ar' ? 'ar' : 'en'}`);
    },
    cancelPlan(id) {
      this.$confirm(`${this.$t('Global.ensureBeforeRequest')}`, {
        confirmButtonText: `${this.$t('Global.accept')}`,
        cancelButtonText: `${this.$t('Global.cancel')}`,
        type: 'success',
      }).then(_ => {
        this.$store.dispatch('course/deleteCourse', id).then(() => {
          this.Refresh();
        });
      });
    },
    Refresh() {
      this.$store.dispatch('course/course', this.$route.params.id).then(() => {
        this.$store.commit('SET_PATH_TITLE', this.course_name ? this.course_name : null);
        this.checkFound();
      });
    },
  },
  destroyed() {
    this.$store.commit('SET_PATH_TITLE', null);
  },
};
</script>

<style lang="scss">
.custom_link_white {
  a,
  span {
    &:hover {
      color: #fff;
    }
  }
}

.text_nobreak {
  word-break: normal !important;
}

.fab-wrapper {
  position: fixed;
  bottom: 3rem;
  left: 3rem;
  width: 100%;
  z-index: 99999;
}

.fab-checkbox {
  display: none;
}

.fab {
  position: absolute;
  bottom: -1rem;
  left: -1rem;
  width: 3.4rem;
  height: 3.4rem;
  border-radius: 50%;
  background: #3c4b64;
  box-shadow: 0px 5px 20px #3f5271;
  transition: all 0.3s ease;
  z-index: 99999;
  border: 1px solid #3c4d6a;
}

.fab-icon {
  font-size: 32px;
  position: absolute;
  bottom: 0.7rem;
  left: 0.7rem;
  color: white;
}

@keyframes blink {
  50% {
    opacity: 0.25;
  }
}

.fab-wheel {
  position: absolute;
  bottom: 4rem;
  left: 0;
  transition: all 0.3s ease;
  transform-origin: bottom right;
  transform: scale(0);
}

.fab-checkbox:checked ~ .fab-wheel {
  transform: scale(1);
}

.fab-action {
  background: #3c4b64;
  border-radius: 25px;
  display: flex;
  align-items: center;
  color: White;
  box-shadow: 0 0.1rem 1rem rgba(24, 66, 154, 0.82);
  transition: all 1s ease;
  opacity: 0;
}

.fab-checkbox:checked ~ .fab-wheel .fab-action {
  opacity: 1;
  padding: 7px;
}

.fab-action:hover {
  text-decoration: underline;
}

.float_action {
  position: absolute;
  bottom: 10px;
  left: 10px;
  z-index: 9999;

  .el-dropdown-menu {
    background: #000;
  }
}

.kc_fab_main_btn {
  background-color: #39f;
  width: 60px;
  height: 60px;
  border-radius: 100%;
  background: #39f;
  position: absolute;
  bottom: 10px;
  left: 10px;
  z-index: 9999;
  border: none;
  outline: none;
  color: #fff;
  font-size: 36px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  transition: 0.3s;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

.kc_fab_main_btn:hover {
  transform: scale(1.1);
  transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
}
</style>
