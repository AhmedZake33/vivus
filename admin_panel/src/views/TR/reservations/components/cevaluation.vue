<template>
  <CCard>
    <CCardHeader>
      <div class="d-flex justify-content-between align-items-baseline w-100" :class="$i18n.locale === 'ar' ? 'card-header-actions' : ''" style="display: inline-block; font-weight: bold">
        <div><i class="el-icon-user-solid"></i> {{ $t('Global.TRevaluationCourse') }}</div>
      </div>
    </CCardHeader>
    <CCardBody v-loading="$store.state.course.coursesLoad" dir="rtl" style="text-align: initial">
      <el-form label-position="top" label-width="55%" :model="ruleForm" ref="ruleForm" class="demo-ruleForm">
        <CRow>
          <div class="w-100">
            <div v-if="$store.state.course.evaluation" v-for="question in $store.state.course.evaluation">
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
  methods: {
    changeValue(question) {
      this.editField = false;
      this.$store.dispatch('course/saveEvaluation', {
        answer: question.id,
        submission: this.$route.params.id,
        data: { value: question.answer, question_id: question.question_id },
      });
    },
    Refresh(init) {
      if (this.$store.state.course.evaluation) {
        let arry = [];
        this.$store.state.course.evaluation.forEach((element, index) => {
          let obj = {};
          obj['key'] = Number(index);
          obj['id'] = Number(element.question_id);
          obj['value'] = element.answer && element.answer.comment ? element.answer.comment : element.answer && element.answer.value ? Number(element.answer.value) : '';
          arry.push(obj);
        });
        this.ruleForm.evaluationValues = arry;
      } else {
        this.$store.dispatch('course/submission', this.$route.params.id).then(() => {
          let arry = [];
          this.$store.state.course.evaluation.forEach((element, index) => {
            let obj = {};
            obj['key'] = Number(index);
            obj['id'] = Number(element.question_id);
            obj['value'] = element.answer && element.answer.value ? Number(element.answer.value) : '';
            arry.push(obj);
          });
          this.ruleForm.evaluationValues = arry;
        });
      }
    },
  },
  mounted() {
    this.Refresh(true);
  },
};
</script>
