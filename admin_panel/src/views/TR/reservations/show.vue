<template>
  <div v-loading="$store.state.course.coursesLoad" class="custom_info_alert">
    <el-alert v-if="lastAlert && !trainer" effect="dark" class="mb-2 animate" :title="lastAlert && evaluatorCheck(['TRAINEE_TYPE'], 3) ? $t('Global.SystemManagement') : lastAlert.ar_name" :type="getAlert(lastAlert.status)" show-icon style="width: 100%">
      <div class="d-flex flex-wrap">
        <div v-if="showAction">
          {{ lastAlert.task_message }}
          <router-link v-if="lastAlert.task_id == 2" class="text-white custom_link" :to="{ path: `/course/plans/editpayment/${$route.params.id}` }">
            <div style="margin: 0 5px">{{ $t('Global.pressNow') }}</div>
          </router-link>
        </div>
        <div v-else>
          {{ lastAlert && evaluatorCheck(['TRAINEE_TYPE'], 3) ? lastAlert.contact_message : lastAlert.alert_message }}
        </div>
        <span v-if="lastAlert.message && (!evaluatorCheck(['TRAINEE_TYPE'], 3) || showAction || isAuthUser(lastAlert.user_id))" v-html="'( ' + ntBr(lastAlert.message) + ' )'"></span>
      </div>
    </el-alert>
    <CRow v-if="trainer" class="user_icons d-flex justify-content-center flex-wrap gap-1" :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'" style="text-align: initial">
      <div class="statistcColor no-padding">
        <router-link class="text_right" to="">
          <CWidgetIcon class="pa-0" :header="trainer.attend || '-'" :text="$t('Global.attend_time')" color="white" :icon-padding="false">
            <el-progress type="circle" :percentage="Number(trainer.attend) || '-'"></el-progress>
          </CWidgetIcon>
        </router-link>
      </div>
      <div class="statistcColor no-padding">
        <router-link class="text_right" to="">
          <CWidgetIcon class="pa-0" :header="trainer.evaluation_plan || '-'" :text="$t('Global.evaluation_plan')" color="white" :icon-padding="false">
            <el-progress type="circle" :percentage="Number(trainer.evaluation_plan) || '-'"></el-progress>
          </CWidgetIcon>
        </router-link>
      </div>
      <div class="statistcColor no-padding">
        <router-link class="text_right" to="">
          <CWidgetIcon class="pa-0" :header="trainer.evaluation_trainer || '-'" :text="$t('Global.evaluation_trainer')" color="white" :icon-padding="false">
            <el-progress type="circle" :percentage="Number(trainer.evaluation_trainer) || '-'"></el-progress>
          </CWidgetIcon>
        </router-link>
      </div>
      <div class="statistcColor no-padding">
        <router-link class="text_right" to="">
          <CWidgetIcon class="pa-0" :header="trainer.exam_degree || '-'" :text="$t('Global.exam_degree')" color="white" :icon-padding="false">
            <el-progress type="circle" :percentage="Number(trainer.exam_degree) || '-'"></el-progress>
          </CWidgetIcon>
        </router-link>
      </div>
      <div class="statistcColor no-padding">
        <router-link class="text_right" to="">
          <CWidgetIcon class="pa-0" :header="trainer.post_exam || '-'" :text="$t('Global.post_exam')" color="white" :icon-padding="false">
            <el-progress type="circle" :percentage="Number(trainer.post_exam) || '-'"></el-progress>
          </CWidgetIcon>
        </router-link>
      </div>
      <div class="statistcColor no-padding">
        <router-link class="text_right" to="">
          <CWidgetIcon class="pa-0" :header="trainer.pre_exam || '-'" :text="$t('Global.pre_exam')" color="white" :icon-padding="false">
            <el-progress type="circle" :percentage="Number(trainer.pre_exam) || '-'"></el-progress>
          </CWidgetIcon>
        </router-link>
      </div>
      <div class="statistcColor no-padding">
        <router-link class="text_right" to="">
          <CWidgetIcon class="pa-0" :header="trainer.total || '-'" :text="$t('Global.total_deg')" color="white" :icon-padding="false">
            <el-progress type="circle" :percentage="Number(trainer.total) || '-'"></el-progress>
          </CWidgetIcon>
        </router-link>
      </div>
    </CRow>
    <Show id="submission_id" icon="el-icon-message" :items="$store.getters['course/course']" except="team">
      <template #link>
        <router-link :to="`/course/plans/plan/${$store.state.course.course.id}`">{{ submission_name }}</router-link>
      </template>
      <template #show_action>
        <el-button v-if="trainer && evaluatorCheck(['TRAINING_MANAGER_TYPE', 'COACH_TYPE'], 3)" icon="el-icon-edit" @click="EmitMethods('edit')" round size="mini" class="mx-1 right_icon" type="success">
          {{ $t('Global.degrees') }}
        </el-button>
        <router-link :to="`/management/logs/${$route.params.id}/2`" class="mx-2 print_hide" v-if="hasPermission('admin_submissions')">
          <fa-icon :icon="['fas', 'bug']" />
        </router-link>
        <div class="d-flex print_hide" v-if="hasPermission('stage_update')">
          <el-tooltip :content="$t('Global.redo')" placement="top">
            <fa-icon :icon="['fas', 'redo']" class="mr-2" @click="undoRedo('redo')" />
          </el-tooltip>
          <el-tooltip :content="$t('Global.undo')" placement="top">
            <fa-icon :icon="['fas', 'undo']" class="ml-2 mr-2" @click="undoRedo('undo')" />
          </el-tooltip>
        </div>
        <a v-if="trainer && (hasPermission('decision_approval') || hasPermission('admin_submissions'))" class="mr-2" :href="`${baseUrl}reservation/certificate/${$route.params.id}/ar`" target="_blank">
          <fa-icon :icon="['fas', 'file-pdf']" size="md" />
          {{ $t('Global.ar_certificate') }}
        </a>
        <a v-if="trainer && (hasPermission('decision_approval') || hasPermission('admin_submissions'))" class="mx-3" :href="`${baseUrl}reservation/certificate/${$route.params.id}/en`" target="_blank">
          <fa-icon :icon="['fas', 'file-pdf']" size="md" />
          {{ $t('Global.en_certificate') }}
        </a>
        <CDropdown v-if="ifFound" color="success" placement="bottom-end" size="sm" class="d-inline customDrop print_hide">
          <template #toggler-content>
            <CIcon name="cil-settings" />
            <span style="font-weight: bold">{{ $t('Global.action') }}</span>
          </template>
          <a v-if="hasPermission('admin_submissions') || showType == showConstants('string', 'FINANCE_UPDATE')" class="iF_found item d-block" :href="`${baseUrl}reservation/payment_permission/${$route.params.id}`">
            <div style="text-align: initial">
              <i class="el-icon-s-marketing"></i>
              {{ $t('Global.payment_permission') }}
            </div>
          </a>

          <router-link v-if="hasPermission('finance_update') || (evaluatorCheck(['TRAINING_MANAGER_TYPE', 'TRAINEE_TYPE'], 3) && showAction && showType == showConstants('string', 'FINANCE_UPDATE'))" class="iF_found item d-block" :to="{ path: `/course/plans/editpayment/${$route.params.id}` }">
            <div style="text-align: initial">
              <i class="el-icon-s-marketing"></i>
              {{ $t('Global.addCoursePayment') }}
            </div>
          </router-link>

          <router-link @click.native="cancel($route.params.id)" v-if="hasPermission('deactive_submissions') || evaluatorCheck(['TRAINING_MANAGER_TYPE'], 3)" class="iF_found item d-block" to="">
            <div style="text-align: initial">
              <template v-if="$store.state.course.course && $store.state.course.course.removed == 0"> <i class="el-icon-delete"></i> {{ $t('Global.activate_0') }} </template>
              <template v-else> <i class="el-icon-refresh"></i> {{ $t('Global.activate_1') }} </template>
            </div>
          </router-link>
        </CDropdown>
      </template>
      <template #bottom_other_data>
        <tr>
          <th scope="row" width="20%">{{ $t('Global.trainee') }}</th>
          <td width="80%" v-if="$store.state.course.course">
            <router-link class="custom-link" :to="{ path: `/users/${$store.state.course.course.representative.id}` }">
              {{ $store.state.course.course.representative.ar_name }}
            </router-link>
          </td>
        </tr>
        <tr v-if="$store.state.course.course && $store.state.course.course.payment">
          <th scope="row" width="20%">{{ $t('Global.uploadLetterOrgFile') }}</th>
          <td width="80%">
            <div class="mb-2">
              <span>{{ $t('Global.pay_value') + ': ' }} </span>
              <span style="font-weight: bolder" class="ml-3"> ({{ $store.state.course.course.payment.pay_value || '-' }}),</span>
              <span>{{ $t('Global.pay_number') + ': ' }} </span>
              <span style="font-weight: bolder" class="ml-3"> ({{ $store.state.course.course.payment.pay_number || '-' }}),</span>
              <span>{{ $t('Global.payment_date') + ': ' }} </span>
              <span style="font-weight: bolder" class="ml-3"> ({{ $store.state.course.course.payment.payment_date ? toLocalDatetime($store.state.course.course.payment.payment_date, `${$i18n.locale == 'ar' ? 'ar' : 'en'}`) : '-' }})</span>
              <span>{{ $t('Global.FINANCIAL_LETTER') + ': ' }} </span>
              <a :href="$store.state.course.course.payment.document" download target="_blank">{{ $t('Global.FINANCIAL_LETTER') }}</a>
            </div>
          </td>
        </tr>
      </template>
      <template #show_status>
        <CBadge color="success" v-if="$store.state.course.course && $store.state.course.course.removed === 0" style="margin: 4px">
          {{ $t('Global.active') }}
        </CBadge>
        <CBadge color="danger" v-if="$store.state.course.course && $store.state.course.course.removed === 1" style="margin: 4px">
          {{ $t('Global.remove') }}
        </CBadge>
        <CBadge color="info" style="margin: 4px" v-if="lastAlert">
          <!--          <template v-if="!$store.state.course.coursesLoad">-->
          <!--            <template>-->
          {{ lastAlert.title }}
          <!--            </template>-->
          <!--          </template>-->
        </CBadge>
      </template>
    </Show>
    <ButtonApproval @refresh="Refresh"></ButtonApproval>
    <CCard>
      <CCardHeader>
        <div class="d-flex justify-content-between align-items-baseline w-100" :class="$i18n.locale === 'ar' ? 'card-header-actions' : ''" style="display: inline-block; font-weight: bold">
          <div><i class="el-icon-data-board"></i> {{ $t('Global.coachs') }}</div>
        </div>
      </CCardHeader>
      <CCardBody>
        <CRow class="mt-3" v-loading="$store.state.course.coursesLoad">
          <CCol class="pb-3 pr-2" lg="4" md="6" sm="12" v-for="trainer in $store.state.course.trainers">
            <CCard class="position-relative">
              <div class="topLeft">
                <el-avatar fit="contain" class="border border-white" src="/logo.png" :size="70">
                  <img :src="trainer.photo ? trainer.photo : `/logo.png`" />
                </el-avatar>
              </div>
              <CCardHeader>
                <div class="w-100" :class="$i18n.locale === 'ar' ? 'card-header-actions' : ''" style="display: inline-block; font-weight: bold">
                  <el-tooltip effect="dark" placement="top">
                    <div slot="content">
                      {{ trainer.trainer }}
                    </div>
                    <div class="text-initial" style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 80%">
                      <router-link :to="`/users/${trainer.id || trainer.pivot.member_id}`"
                        ><span class="text-initial">{{ trainer.trainer }}</span></router-link
                      >
                    </div>
                  </el-tooltip>
                </div>
              </CCardHeader>
            </CCard>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
    <CCard v-if="hasPermission('admin_system') || !evaluatorCheck(['COACH_TYPE'], 3)">
      <CCardBody>
        <el-tabs v-model="activeNameSelected" v-loading="$store.getters['notes/notesLoading']" type="card" class="right" dir="rtl" tab-position="top" stretch>
          <el-tab-pane v-if="hasPermission('admin_system') || hasPermission('all_submissions')  || evaluatorCheck(['TRAINING_MANAGER_TYPE'], 3)" name="1" lazy>
            <span slot="label"><i class="el-icon-chat-round"></i> {{ $t('Global.subState') }}</span>
            <SubStateReply></SubStateReply>
          </el-tab-pane>
          <el-tab-pane v-if="hasPermission('admin_system') || (!evaluatorCheck(['COACH_TYPE'], 3) && !time)" name="2" lazy>
            <span slot="label"><i class="el-icon-chat-round"></i> {{ $t('Global.TRevaluationCourse') }}</span>
            <CEvaluation></CEvaluation>
          </el-tab-pane>
          <el-tab-pane v-if="hasPermission('admin_system') || (!evaluatorCheck(['COACH_TYPE'], 3) && !time)" name="4" lazy>
            <span slot="label"><i class="el-icon-chat-round"></i> {{ $t('Global.TRevaluation') }}</span>
            <Evaluation></Evaluation>
          </el-tab-pane>
          <el-tab-pane v-if="hasPermission('admin_system') || (!evaluatorCheck(['COACH_TYPE'], 3) && !time)" name="3" lazy>
            <span slot="label"><i class="el-icon-chat-round"></i> {{ $t('Global.other_notes') }}</span>
            <STEvaluation></STEvaluation>
          </el-tab-pane>
        </el-tabs>
      </CCardBody>
    </CCard>
  </div>
</template>
<script>
import Show from '../../components/Show.vue';
import { EventBus } from '../../../main';
import ButtonApproval from './components/ButtonApproval.vue';
import SubStateReply from './components/SubStateReply.vue';
import Evaluation from './components/trevaluation.vue';
import CEvaluation from './components/cevaluation.vue';
import STEvaluation from './components/stevaluation.vue';

export default {
  components: { Show, ButtonApproval, Evaluation, SubStateReply, STEvaluation , CEvaluation},
  props: { type: String },
  name: 'info',
  data() {
    return {
      isLoad: false,
      mainAnswer: null,
      editField: true,
      dialogVisible: false,
      traineeDialog: false,
      coachDialog: false,
      user_id: null,
      team_id: null,
      baseUrl: process.env.VUE_APP_BASE_URL,
      ifFound: true,
      form: {
        comment: null,
      },
      ruleForm: {
        name: null,
        n_id: null,
        exam_degree: null,
        attend_hour: null,
        evaluationValues: null,
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
  computed: {
    time: function () {
      if (this.$store.state.course.course && this.$store.state.course.course.course_end) {
        const now = new Date();
        const end = new Date(Date.parse(this.$store.state.course.course.course_end.replace(/-/g, ' ')));
        let endTime = end - now;
        if (endTime > 0) {
          return end - now;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    activeNameSelected: {
      get: function () {
        if (this.evaluatorCheck(['TRAINING_MANAGER_TYPE'], 3) || this.hasPermission('admin_system')) {
          return '1';
        } else {
          return '2';
        }
      },
      // setter
      set: function (newValue) {},
    },
    trainer: function () {
      if (this.$store.state.course.course && this.$store.state.course.course.scores) {
        return this.$store.state.course.course.scores;
      }
    },

    submission_name: function () {
      if (this.$store.state.course.course && this.$store.state.course.course.full_name) {
        return this.$store.state.course.course.full_name;
      }
    },
    showAction: function () {
      if (this.$store.state.submission.last_alert && this.$store.state.evaluation.evaluator.includes(this.$store.state.submission.last_alert.evaluator_type)) {
        return true;
      }
      return false;
    },
    lastAlert: function () {
      if (this.$store.state.submission.last_alert) {
        return this.$store.state.submission.last_alert;
      }
      return false;
    },
    showType: function () {
      if (this.$store.state.submission.last_alert) {
        return this.$store.state.submission.last_alert.show_type;
      }
      return false;
    },
    allowUpdate: function () {
      if (this.$store.state.submission.last_alert) {
        return this.$store.state.submission.last_alert.allow_update;
      }
      return false;
    },
  },
  mounted() {
    this.Refresh();
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
    EmitMethods(data) {
      EventBus.$emit('openTrDesicionDialog', data);
    },
    cancel(id) {
      this.$confirm(this.$t('Global.delete_submission_message'), `${this.$t('Global.warning')}`, {
        confirmButtonText: `${this.$t('Global.accept')}`,
        cancelButtonText: `${this.$t('Global.cancel')}`,
        type: 'warning',
      }).then(() => {
        this.$store.dispatch('submission/delete', id).then(() => {
          this.Refresh();
          this.$message({ message: this.$t('Global.successMessage'), type: 'success' });
        });
      });
    },
    getAlert(status) {
      switch (status) {
        case 0:
          return 'error';
        case 1:
          return 'info';
        case 2:
          return 'success';
        default:
          return 'info';
      }
    },
    undoRedo(type) {
      this.$confirm(this.$t('Global.changeMessage'), `${this.$t('Global.warning')}`, {
        confirmButtonText: `${this.$t('Global.accept')}`,
        cancelButtonText: `${this.$t('Global.cancel')}`,
        type: 'warning',
      }).then(() => {
        this.$store
          .dispatch('submission/PreundoRedo', {
            type: type,
            submission: this.$route.params.id,
          })
          .then(_ => {
            this.Refresh();
          });
      });
    },
    Refresh() {
      this.$store.dispatch('course/submission', this.$route.params.id).then(() => {
        let arry = [];
        this.$store.state.course.evaluation.forEach((element, index) => {
          let obj = {};
          obj['key'] = Number(index);
          obj['id'] = Number(element.question_id);
          obj['value'] = element.answer && element.answer.comment ? element.answer.comment : element.answer && element.answer.value ? Number(element.answer.value) : '';
          arry.push(obj);
        });
        this.ruleForm.evaluationValues = arry;
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
.statistcColor .el-progress .el-progress__text {
  display: none;
}

.el-alert__content {
  width: 100%;
}

.gap-1 {
  gap: 1rem;
}

.no-padding {
  width: 150px;

  .p-4 {
    padding: 1rem !important;
  }

  .text-white {
    color: #000 !important;
  }
}

.el-progress-circle {
  height: 29px !important;
  width: 29px !important;
}

.el-progress__text {
  font-size: 8px !important;
}

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
