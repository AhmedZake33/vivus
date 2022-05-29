<template>
  <CCard>
    <CCardHeader>
      <div class="direction d-flex justify-content-between" style="display: inline-block">
        <div>
          <i class="el-icon-tickets" style="vertical-align: middle"></i>
          <span> {{ $t('Global.subState') }} </span>
        </div>
      </div>
    </CCardHeader>
    <CCardBody>
      <el-row class="sub_state_show">
        <div class="grid-content flex_notes" style="width: 35%">
          <el-steps v-if="$store.state.submission.alerts" :space="90" class="sub_state" :active="Object.keys(customAlerts).length" finish-status="success" dir="rtl" direction="vertical" align-right>
            <el-step v-for="(item, num) in customSteps" style="width: 100%">
              <template #title>
                <span class="ml-1 mr-1">{{ $t(`Global.state_${num}`) }}</span>
              </template>
              <template #description>
                <div v-for="(user, i) in item" :key="i" class="timeBlock">
                  <div style="width: 100%">
                    <div v-if="user.created_at" class="timeBlock" style="font-weight: bold; color: #939292">
                      <small dir="rtl">
                        <i class="el-icon-time"></i>
                        {{ toLocalDatetime(user.created_at, `${$i18n.locale == 'ar' ? 'ar' : 'en'}`, false) }}
                      </small>
                    </div>
                    <span style="color: green">
                      <!-- {{createdByConstants('num', user.created_by)}} -->
                      <span style="margin-bottom: 7px; text-align: right" class="member">
                        <router-link :to="{ path: `/users/${user.user_id}` }"> {{ `${user.ar_name ? $t(`Global.${createdByConstants('num', user.created_by)}`) : $t(`Global.${createdByConstants('num', user.created_by)}`)}` }} </router-link>
                        <fa-icon v-if="user.status == 1" :icon="['fas', 'user-check']" size="sm" class="" style="color: #246303" />
                        <fa-icon v-else :icon="['fas', 'user-times']" size="sm" class="red" />
                        <br />
                      </span>
                    </span>
                  </div>
                </div>
              </template>
            </el-step>
          </el-steps>
        </div>
        <div class="grid-content flex_thread" style="width: 65%">
          <div dir="rtl" style="text-align: initial" v-if="customAlerts && customAlerts.length">
            <div :key="i" v-for="(alert, i) in customAlerts">
              <el-divider class="success">
                <i class="el-icon-star-on"></i>
                {{ $t(`Global.state_${customAlerts.length - i}`) }}
              </el-divider>
              <div class="adminReply mb-4" v-for="note in alert">
                <div class="reply_header">
                  <router-link :to="{ path: `/users/${note.user_id}` }" class="ml-1 mr-1"> {{ note.ar_name }}</router-link>
                  <CBadge color="info">{{ $t(`Global.state_${note.level}`) }}</CBadge>
                  <div class="ml-1 mr-1" v-if="note.created_at">
                    <i class="el-icon-time small"></i>
                    <small style="color: #909399"> {{ DateFormat(note.created_at) }}</small>
                  </div>
                </div>
                <div class="reply_body justify-content-start">
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
import { toLocalDatetime } from '../../utils/helper';

export default {
  name: 'SubStateReply',
  data() {
    return {
      staticStatus: [1, 2, 3, 4, 5, 6],
    };
  },

  methods: {
    DateFormat(date) {
      return toLocalDatetime(date, `${this.$i18n.locale == 'ar' ? 'ar' : 'en'}`, true);
    },
    checkIfApprove(evaluator_type, approvals) {
      // approvals.forEach(element => {
      //    console.log("approvals",element);
      //    console.log("evaluator_type",evaluator_type);
      // });
      if (approvals.length) {
        return approvals.some(user => user.evaluator_type == evaluator_type);
      }
    },
    ReverseObject(array) {
      let newArr = [];
      array.forEach(element => {
        let reversedEl = element.reverse();
        newArr.push(reversedEl)
      });
      return newArr;
    },
  },
  computed: {
    customAlerts() {
      if (this.$store.getters['submission/alerts']) {
        let main = this.$store.getters['submission/alerts'];
        let reversed = Object.values(main);
        let final = this.ReverseObject(reversed)
        return final.reverse();
      } else {
        return false;
      }
    },
    customSteps() {
      if (this.$store.getters['submission/steps']) {
        return this.$store.getters['submission/steps'];
      } else {
        return false;
      }
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

// .adminReply {
//   border-radius: 30px;
//   border-right: 2px solid #ddd;
// }
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
