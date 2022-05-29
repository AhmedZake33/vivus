<template>
  <CRow class="edit_organization">
    <CCol sm="12">
      <CCard :class="isLoad ? 'disabledAll' : ''">
        <CCardHeader>
          <div :class="$i18n.locale === 'ar' ? 'card-header-actions' : ''" style="display: inline-block">
            <CIcon name="cil-people" color="bg-primary"></CIcon>
            {{ $t('Global.rate') }} ({{ this.$store.state.evaluation.user ? this.$store.state.evaluation.user.ar_name : '' }})
          </div>
        </CCardHeader>
        <CCardBody v-loading="$store.state.submission.detailsLoad" dir="rtl" style="text-align: initial">
          <el-form label-position="top" label-width="55%" :model="ruleForm" ref="ruleForm" class="demo-ruleForm">
            <CRow>
              <el-table v-if="$store.state.evaluation.teamEvaluations" :data="$store.state.evaluation.teamEvaluations" style="width: 100%" :header-cell-class-name="$i18n.locale === 'ar' ? 'text-right' : ''" :cell-class-name="$i18n.locale === 'ar' ? 'text-right' : ''">
                <el-table-column prop="title" :label="$t('Global.question')"></el-table-column>
                <el-table-column prop="" :label="$t('Global.evaluations')">
                  <template slot-scope="scope">
                    <el-form-item :class="scope.row.question_type == 4 ? 'w-75' : ''" class="d-inline-block leftToRight left_right m-0" v-if="evalValue.id == scope.row.id" :key="evalValue.id" v-for="evalValue in ruleForm.evaluationValues">
                      <el-rate
                        v-if="scope.row.question_type != 4"
                        :max="getValue(scope.row.question_type)"
                        show-text
                        :value="evalValue.id"
                        v-model="evalValue.value"
                        :texts="getTexts(scope.row.question_type)"
                        @change="changeValue($event, scope.row.id, scope.row.question_type)"
                        text-color="#ff9900"
                        style="display: contents"
                      ></el-rate>
                      <el-form-item v-if="editField == evalValue.id && scope.row.question_type == 4" :rules="null" prop="message" class="custom_area custom_text_area_eval w-100">
                        <el-input id="comment"  contenteditable autosize resize="none" type="textarea" :placeholder="scope.row.title" v-model="evalValue.value"></el-input>
                        <i @click="changeValue('comment', scope.row.id, scope.row.question_type)" class="pointer custom_send el-icon-s-promotion pt-1"></i>
                      </el-form-item>
                      <div v-if="editField != evalValue.id && scope.row.question_type == 4">
                        <i @click="showField(evalValue.id)" class="el-icon-edit pointer"></i>
                        <span class="mx-2">{{ evalValue.value }}</span>
                      </div>
                    </el-form-item>
                    <svg v-if="done.status && scope.row.id == done.id" class="d-inline-block checkmark mx-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                      <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
                      <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                    </svg>
                  </template>
                </el-table-column>
              </el-table>
            </CRow>
          </el-form>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
export default {
  name: 'organizationEdit',
  data() {
    return {
      editField: true,
      isLoad: false,
      organizationDialog: false,
      canEdit: true,
      editMode: false,
      done: { status: false, id: null },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e7;
        },
      },
      editForm: {
        university: null,
      },
      ruleForm: {
        evaluationValues: [],
        id: 0,
        message: null,
        note: null,
      },
      editRules: {
        university: [{ required: true, message: 'من فضلك يجب كتابة اسم الجامعه', trigger: 'blur' }],
      },
    };
  },
  computed: {
    rates: function () {
      if (this.$store.state.evaluation.answers) {
        return this.$store.state.evaluation.answers;
      }
    },
  },
  mounted() {
    this.init();
  },
  watch: {
    done: function () {
      if (this.done.status) {
        setTimeout(() => {
          this.done = { status: false, id: null };
        }, 1500);
      }
    },
  },
  methods: {
    showField(name) {
      this.editField = name;
      this.$nextTick(function () {
        var editable = document.getElementById('comment');
        editable.focus();
      });
    },
    getTexts(question_type) {
      let rateFilter = this.rates.filter(rate => rate.question_type_id == question_type);
      let sorted = rateFilter.sort(function (a, b) {
        return a.answer_value - b.answer_value;
      });
      let texts = sorted.map(rate => rate.name);
      return texts;
    },

    getValue(question_type) {
      let rateFilter = this.rates.filter(rate => rate.question_type_id == question_type);
      if (rateFilter) {
        return rateFilter.length;
      }
    },
    changeValue(answer_id, question_id, question_type) {
      this.editField = false;
      let rateFilter = this.rates.filter(rate => rate.question_type_id == question_type);
      let rateId = rateFilter.find(rate => rate.answer_value == answer_id);
      if (this.done.status) {
        setTimeout(() => {
          this.done = { status: true, id: question_id };
        }, 1000);
      } else {
        this.done = { status: true, id: question_id };
      }
      let data;
      if (answer_id != 'comment') {
        data = { answer_id: rateId.id, question_id: question_id };
      } else {
        let commentValue = this.ruleForm.evaluationValues.find(el => el.id == question_id);
        data = { comment: commentValue.value, question_id: question_id };
      }
      this.$store.dispatch('evaluation/saveMemberEvaluation', { member: this.$route.params.id, id: this.$route.params.submission_id, data }).then(_ => {});
    },
    init() {
      this.$store.dispatch('evaluation/getTeamEvaluations', { submission: this.$route.params.submission_id, member: this.$route.params.id }).then(() => {
        if (this.$route.params.id) {
          let arry = [];
          this.$store.state.evaluation.teamEvaluations.forEach((element, index) => {
            let obj = {};
            obj['key'] = Number(index);
            obj['id'] = Number(element.id);
            obj['value'] = element.answer && element.answer.comment ? element.answer.comment : element.answer && element.answer.value ? Number(element.answer.value) : '';
            arry.push(obj);
          });
          this.ruleForm.evaluationValues = arry;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style lang="scss">
// @-moz-document url-prefix() {
//   .custom_text_area_eval {
//     .el-textarea textarea {
//       min-height: 40px !important;
//       height: 40px !important;
//     }
//   }
// }
.checkmark__circle {
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  stroke-width: 2;
  stroke-miterlimit: 10;
  stroke: #7ac142;
  fill: none;
  animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}
.custom_send {
  position: absolute;
  left: 8px;
  bottom: 3px;
  font-size: 27px;
  color: #fff;
  background: #409eff;
  border-radius: 50%;
  padding: 0.2rem;
}
.checkmark {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: inline-block;
  stroke-width: 2;
  stroke: #fff;
  stroke-miterlimit: 10;
  //   margin: 10% auto;
  box-shadow: inset 0px 0px 0px #7ac142;
  animation: fill 0.3s ease-in-out 0.3s forwards, scale 0.2s ease-in-out 0.5s both;
}
.custom_text_area_eval {
  display: inline-block;
  .el-textarea textarea {
    min-height: 40px !important;
    padding: 0.5rem 1rem 0.5rem 2rem !important;
  }
}
.checkmark__check {
  transform-origin: 50% 50%;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  animation: stroke 0.2s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
}

@keyframes stroke {
  100% {
    stroke-dashoffset: 0;
  }
}
@keyframes scale {
  0%,
  100% {
    transform: none;
  }
  50% {
    transform: scale3d(1.1, 1.1, 1);
  }
}
@keyframes fill {
  100% {
    box-shadow: inset 0px 0px 0px 30px #7ac142;
  }
}
</style>
