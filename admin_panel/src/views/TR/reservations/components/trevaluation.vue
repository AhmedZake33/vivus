<template>
  <CCard>
    <CCardHeader>
      <div class="d-flex justify-content-between align-items-baseline w-100" :class="$i18n.locale === 'ar' ? 'card-header-actions' : ''" style="display: inline-block; font-weight: bold">
        <div><i class="el-icon-user-solid"></i> {{ $t('Global.TRevaluation') }}</div>
        <div>
          <el-select :no-data-text="$t('Global.nodata')" v-model="trainer" ref="trainer" filterable :placeholder="$t('Global.selectCoach')" style="width: 100%">
            <el-option v-for="item in $store.state.course.trainers" :key="item.pivot.member_id" :label="item.trainer" :value="item.pivot.member_id">
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{ item.trainer }}
                <i class="el-icon-user-solid"></i>
              </span>
            </el-option>
            <template #prefix>
              <i class="el-icon-user-solid" :dir="$i18n.locale === 'ar' ? 'rtl' : ''" style="font-size: 17px; line-height: 2.2; color: black; text-align: initial"></i>
            </template>
            <template #empty>
              <div class="text-center" style="padding: 10px; font-weight: bold">
                {{ $t('Global.nodata') }}
              </div>
            </template>
          </el-select>
        </div>
      </div>
    </CCardHeader>
    <CCardBody v-loading="$store.state.course.coursesLoad" dir="rtl" style="text-align: initial">
      <el-form label-position="top" label-width="55%" :model="ruleForm" ref="ruleForm" class="demo-ruleForm">
        <CRow>
          <div>
            <div v-if="$store.state.course.member_evaluation" v-for="question in $store.state.course.member_evaluation">
              <h3 class="mr-2 mb-2" v-if="question.question_type == 1">{{ question.title }}</h3>
              <h4 class="mr-3 mb-2" v-else-if="question.question_type == 2">{{ question.title }}</h4>
              <div class="mr-4 justify-content-between d-flex flex-wrap" v-else style="line-height: 3">
                <div style="width: 50%">
                  <i class="el-icon-question"></i>
                  <span> {{ question.title }}</span>
                </div>
                <el-radio-group v-if="evaluatorCheck(['TRAINEE_TYPE'], 3)" size="mini" class="float-left" v-model="question.answer">
                  <el-radio @change="changeValue(question)" v-for="answer in $store.state.course.answer" border :label="answer.id">{{ answer.name }} </el-radio>
                </el-radio-group>
                <el-radio-group v-else size="mini" class="float-left disabled_1" v-model="question.answer">
                  <el-radio v-for="answer in $store.state.course.answer" border :label="answer.id">{{ answer.name }} </el-radio>
                </el-radio-group>
              </div>
            </div>
          </div>
        </CRow>
      </el-form>
    </CCardBody>
  </CCard>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        evaluationValues: null,
      },
      trainer: null,
    };
  },
  watch: {
    trainer(val) {
      this.getEvaluation(val);
    },
  },
  computed: {
    firstCoach: function () {
      if (this.$store.state.course.trainers) {
        return this.$store.state.course.trainers[0].pivot.member_id;
      } else {
        null;
      }
    },
  },
  methods: {
    changeValue(question) {
      if (this.trainer) {
        this.editField = false;
        // let data = { question_id: question_id };
        this.$store
          .dispatch('course/saveEvaluation', {
            answer: question.id,
            submission: this.$route.params.id,

            data: { value: question.answer, question_id: question.question_id, created_by: this.trainer },
          })
          .then(_ => {
            // this.$notify({
            //   type: 'success',
            //   message: `${this.$t('Global.successMessage')}`,
            // });
          });
      } else {
        this.$notify({
          type: 'error',
          message: `${this.$t('Global.shouldSelectCouch')}`,
        });
      }
    },
    getEvaluation(user_id) {
      let query = {
        user_id: user_id,
      };
      this.$store.dispatch('course/getEvaluation', { id: this.$route.params.id, query: query });
    },
    Refresh(init) {
      if (this.firstCoach) {
        if (this.$store.state.course.member_evaluation) {
          let arry = [];
          this.$store.state.course.member_evaluation.forEach((element, index) => {
            let obj = {};
            obj['key'] = Number(index);
            obj['id'] = Number(element.question_id);
            obj['value'] = element.answer && element.answer.comment ? element.answer.comment : element.answer && element.answer.value ? Number(element.answer.value) : '';
            arry.push(obj);
          });
          this.ruleForm.evaluationValues = arry;
        } else {
          let query = { user_id: this.firstCoach };
          this.$store
            .dispatch('course/getEvaluation', {
              id: this.$route.params.id,
              query: query,
            })
            .then(() => {
              let arry = [];
              this.$store.state.course.member_evaluation.forEach((element, index) => {
                let obj = {};
                obj['key'] = Number(index);
                obj['id'] = Number(element.question_id);
                obj['value'] = element.answer && element.answer.comment ? element.answer.comment : element.answer && element.answer.value ? Number(element.answer.value) : '';
                arry.push(obj);
              });
              this.ruleForm.evaluationValues = arry;
              if (init) {
                this.trainer = this.firstCoach;
              }
            });
        }
      }
    },
  },
  mounted() {
    this.Refresh(true);
  },
};
</script>

<style lang="scss">
  .disabled_1{
    pointer-events: none;
    opacity: 0.9;
  }
</style>