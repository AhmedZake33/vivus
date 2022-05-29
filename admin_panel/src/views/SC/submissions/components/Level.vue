<template>
  <CCard>
    <CCardHeader>
      <div class="direction d-flex justify-content-between" style="display: inline-block">
        <div>
          <i class="el-icon-tickets" style="vertical-align: middle"></i>
          <span> {{ $t('Global.Reqstate') }} </span>
        </div>
        <div v-if="hasPermission('stage_update')">
          <el-button @click="removeSignature($route.params.id)" round size="mini" class="mx-1 right_icon" type="danger">
            <template>
              {{ $t('Global.removeSignature') }}
            </template>
          </el-button>
        </div>
      </div>
    </CCardHeader>
    <CCardBody>
      <el-row class="sub_state_show">
        <div class="grid-content flex_notes" style="width: 35%">
          <el-steps v-if="evSteps" :space="90" class="sub_state" :active="Object.keys(evAlerts).length" finish-status="success" dir="rtl" direction="vertical" align-right>
            <el-step v-for="(item, num) in evSteps" style="width: 100%">
              <template #title>
                <span class="ml-1 mr-1">{{ $t(`Global.approvals_status_${num}`) }}</span>
              </template>
              <template #description>
                <div v-for="(user, i) in item" :key="i" class="timeBlock">
                  <div style="width: 100%">
                    <span v-if="checkIfApprove(user.evaluator_type, item.approval)" style="margin-bottom: 7px; text-align: right" class="member">
                      <div v-if="i != 'approval' ? user.evaluator_type : ''" v-for="approve in getApproval(user.evaluator_type, item.approval)">
                        <div class="timeBlock" style="font-weight: bold; color: #939292">
                          <small dir="rtl">
                            <i class="el-icon-time"></i>
                            {{ approve.created_at ? toLocalDatetime(approve.created_at, `${$i18n.locale == 'ar' ? 'ar' : 'en'}`, false) : '' }}
                          </small>
                        </div>
                        <router-link v-if="!evaluatorCheck(['TEAM_TYPE', 'ORGANIZATION_TYPE', 'COMMITTEE_TYPE'])" :to="{ path: `/users/${approve.user_id}` }">{{ approve.ar_name }}{{ approve.created_by ? ' (' + $t(`Global.role_${approve.created_by}`) + ')' : '' }}</router-link>
                        <router-link v-else class="ml-1 mr-1" to="">
                          <template v-if="evaluatorConstants('num', user.evaluator_type) == 'TEAM_TYPE' && evaluatorCheck(['TEAM_TYPE'])"> {{ approve.ar_name }}{{ approve.created_by ? ' (' + $t(`Global.role_${approve.created_by}`) + ')' : '' }} </template>
                          <template v-else-if="evaluatorConstants('num', user.evaluator_type) == 'COMMITTEE_TYPE' && evaluatorCheck(['COMMITTEE_TYPE'])"> {{ approve.ar_name }}{{ approve.created_by ? ' (' + $t(`Global.role_${approve.created_by}`) + ')' : '' }} </template>
                          <template v-else>
                            {{ $t('Global.SystemManagement') }}
                          </template>
                        </router-link>
                        <fa-icon :icon="['fas', 'user-check']" size="sm" style="color: #246303" />
                        <!-- <div v-if="Object.keys(evAlerts).length == num" class="d-inline">
                          <el-tooltip v-if="checkIfApprove(user.evaluator_type, item.approval)" content="إلغاء التوقيع" placement="top-start">
                            <el-button icon="el-icon-close" circle size="mini" class="xs_mini mx-1 right_icon" type="danger"></el-button>
                          </el-tooltip>
                          <el-tooltip v-else content="توقيع" placement="top-start">
                            <el-button icon="el-icon-check" circle size="mini" class="xs_mini mx-1 right_icon" type="success"></el-button>
                          </el-tooltip>
                        </div> -->
                        <br />
                      </div>
                    </span>
                    <span v-else style="margin-bottom: 7px; text-align: right" class="member">
                      <router-link v-if="user.evaluator_type" to=""> {{ `${$t(`Global.${evaluatorConstants('num', user.evaluator_type)}`)}` }}</router-link>
                      <fa-icon v-if="user.evaluator_type" :icon="['fas', 'user-times']" size="sm" class="red" />
                      <!-- <div v-if="Object.keys(evAlerts).length == num && user.evaluator_type" class="d-inline">
                        <el-tooltip v-if="checkIfApprove(user.evaluator_type, item.approval)" content="إلغاء التوقيع" placement="top-start">
                          <el-button icon="el-icon-close" circle size="mini" class="xs_mini mx-1 right_icon" type="danger"></el-button>
                        </el-tooltip>
                        <el-tooltip v-else content="توقيع" placement="top-start">
                          <el-button icon="el-icon-check" circle size="mini" class="xs_mini mx-1 right_icon" type="success"></el-button>
                        </el-tooltip>
                      </div> -->
                      <br />
                    </span>
                  </div>
                </div>
              </template>
            </el-step>
          </el-steps>
        </div>

        <div class="grid-content flex_thread" style="width: 65%">
          <div dir="rtl" style="text-align: initial" v-if="evAlerts && evAlerts.length">
            <div :key="i" v-for="(alert, i) in evAlerts">
              <el-divider class="success" v-if="alert && alert[0]">
                <i class="el-icon-star-on"></i>
                {{ $t(`Global.approvals_status_${alert[0].level}`) }}
<!--                {{ $t(`Global.approvals_status_${evAlerts.length - i}`) }}-->
              </el-divider>
              <div class="adminReply mb-4" v-for="note in alert">
                <div class="reply_header">
                  <router-link v-if="!evaluatorCheck(['TEAM_TYPE', 'ORGANIZATION_TYPE', 'COMMITTEE_TYPE'])" :to="{ path: `/users/${note.user_id}` }" class="ml-1 mr-1"> {{ note.ar_name }}</router-link>
                  <router-link v-else class="ml-1 mr-1" to=""> {{ $t('Global.SystemManagement') }}</router-link>
                  <CBadge v-if="note.level" color="info">{{ $t(`Global.approvals_status_${note.level}`) }}</CBadge>
                  <div class="ml-1 mr-1" v-if="note.created_at">
                    <i class="el-icon-time small"></i>
                    <small style="color: #909399"> {{ DateFormat(note.created_at) }}</small>
                  </div>
                </div>
                <div class="reply_body justify-content-start" :class="note.status == 0 ? 'error_message' : ''">
                  <p class="ml-1 mr-1">
                    {{ note.thread_message }}
                    <span v-if="note.message" v-html="'( ' + ntBr(note.message) + ' )'"></span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-row>
    </CCardBody>
  </CCard>
</template>

<script>
import { toLocalDatetime } from '../../../../utils/helper';

export default {
  name: 'Level',
  data() {
    return {
      staticStatus: [1, 2, 3, 4, 5, 6],
    };
  },
  computed: {
    evAlerts() {
      if (this.$store.getters['submission/evAlerts']) {
        let main = this.$store.getters['submission/evAlerts'];
        let reversed = Object.values(main);
        let final = this.ReverseObject(reversed);
        return final.reverse();
      } else {
        return false;
      }
    },
    evSteps() {
      if (this.$store.getters['submission/evSteps']) {
        return this.$store.getters['submission/evSteps'];
      } else {
        return false;
      }
    },
  },
  methods: {
    removeSignature(id) {
      this.$confirm(`${this.$t('Global.ensureBeforeRequest')}`, {
        confirmButtonText: `${this.$t('Global.accept')}`,
        cancelButtonText: `${this.$t('Global.cancel')}`,
        type: 'success',
      }).then(_ => {
        this.$store
          .dispatch('evaluation/removeSignature',id)
          .then(() => {
            this.$notify({
              type: 'success',
              message: `${this.$t('Global.successMessage')}`,
            });
            this.$store.dispatch('submission/preSubmission', this.$route.params.id).then(() => {
              this.$store.commit('SET_PATH_TITLE', this.$store.getters['submission/name'].name ? this.$store.getters['submission/name'].name : null);
            });
          });
      });
    },
    ReverseObject(array) {
      let newArr = [];
      array.forEach(element => {
        let reversedEl = element.reverse();
        newArr.push(reversedEl);
      });
      return newArr;
    },
    checkIfApprove(evaluator_type, approvals) {
      if (approvals && approvals.length && evaluator_type != 'undefined') {
        return approvals.some(user => user.created_by == evaluator_type);
      }
    },
    getApproval(evaluator_type, approvals) {
      if (evaluator_type) {
        return approvals.filter(user => user.created_by == evaluator_type);
      }
    },
    getCreatedAt(id, approvals) {
      let date = approvals.find(user => user.id == id);
      if (date) return date.created_at;
    },
    getCreatedAtManger(type, approvals) {
      let date = approvals.find(user => user.type == type);
      if (date) return date.created_at;
    },
    checkViceApprove(type, approvals) {
      return approvals.some(user => user.type == type && user.status == 1);
    },
    ifCommittee(num, approvals) {
      return approvals.some(user => user.team_job == num);
    },
    DateFormat(date) {
      return toLocalDatetime(date, `${this.$i18n.locale == 'ar' ? 'ar' : 'en'}`, true);
    },
  },
};
</script>

<style lang="scss">
.success {
  background-color: #2eb85c !important;
  color: #fff;
}

.info {
  background-color: #39f !important;
  color: #fff;
}

.error_message {
  border: 1px solid #f56c6c;
}
.update_message {
  border: 1px solid #efb41f;
}

.ar .el-message-box {
  .el-message-box__btns {
    text-align: right;
    direction: ltr;

    .el-button {
      margin: 0 0.5rem;
    }
  }

  .el-message-box__title {
    text-align: end;
  }

  .el-message-box__headerbtn {
    right: unset;
    left: 15px;
  }

  .el-message-box__container {
    display: flex;
    justify-content: flex-end;

    .el-message-box__message {
      padding: 0 0.5rem;
    }

    .el-message-box__status {
      position: unset !important;
      transform: translateY(0) !important;
    }

    .el-message-box__message {
      p {
        text-align: right;
      }
    }
  }
}

.en .el-message-box {
  .el-message-box__btns {
    text-align: left;
    direction: rtl;

    .el-button {
      margin: 0 0.5rem;
    }
  }

  .el-message-box__title {
    text-align: start;
  }

  .el-message-box__container {
    display: flex !important;
    justify-content: flex-start !important;

    .el-message-box__message {
      padding: 0 0.5rem;
    }

    .el-message-box__status {
      position: unset !important;
      order: 5;
      margin-top: 0.7rem;
    }

    .el-message-box__message {
      p {
        text-align: left;
      }
    }
  }
}

.sub_state {
  .el-step__title {
    margin: 0 0.5rem;
    text-align: right !important;
  }

  .timeBlock {
    margin: 0 0.7rem;
  }

  .el-step::before {
    content: none !important;
  }
}

.reply_header {
  font-size: 0.8rem;
  font-weight: bolder;
  padding: 0.2rem;
  display: inline-block;
  margin-bottom: 0.2rem;
  margin-right: 0.5rem;
  background-color: #fff;
}

.stateForm .el-form-item__error {
  margin: 0 1rem;
}

.reply_body {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  font-size: 0.75rem;
  border-radius: 30px;
  padding: 0.5rem;
  display: -webkit-box !important;
  margin-bottom: 1rem;
  margin-right: 1.7rem;
  justify-content: space-between;
  align-items: center;
  background-color: #eee;

  p {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
}

.el-step.is-vertical {
  margin-bottom: 1rem;
}

.el-step.is-vertical .el-step__line {
  bottom: -20px !important;
}

// .el-step.is-vertical .el-step__head {
//   order: 1;
// }

.sub_state_show {
  .el-steps {
    &.el-steps--vertical {
      //   height: 30rem;
    }

    .el-step {
      &:last-child {
        flex-basis: 0 !important;
      }

      .el-step__icon-inner {
        // transform: rotateX(180deg);
      }
    }

    // transform: rotateX(180deg);

    .el-step__main {
      .el-step__title,
      .el-step__description {
        padding-bottom: 2px;
        // transform: rotateX(180deg);
      }
    }
  }
}

.ar {
  .flex_notes,
  .sub_state_show {
    direction: rtl;

    .el-step.is-vertical {
      flex-direction: row;
    }
  }
}

.flex_notes {
  display: flex;
  justify-content: flex-end;
  width: 50%;
  direction: ltr;
  order: 1;
  align-items: flex-start;

  .el-step.is-vertical {
    flex-direction: row-reverse;
  }
}

.ar .sub_state_show .sub_state .el-step__title {
  text-align: left !important;
}

.sub_state_show {
  flex-wrap: wrap;
  display: flex;
  direction: ltr;
  justify-content: space-between;
}
</style>
