<template>
  <CCard :class="evaluatorCheck(['TRAINEE_TYPE'], 3) ? '' : 'disabled_1'">
    <CCardHeader>
      <div class="d-flex justify-content-between align-items-baseline w-100" :class="$i18n.locale === 'ar' ? 'card-header-actions' : ''" style="display: inline-block; font-weight: bold">
        <div><i class="el-icon-data-board"></i> {{ $t('Global.other_notes') }}</div>
        <div></div>
      </div>
    </CCardHeader>
    <CCardBody v-loading="$store.state.course.coursesLoad" dir="rtl" style="text-align: initial">
      <el-form label-position="top" label-width="55%" :model="ruleForm" ref="ruleForm" class="demo-ruleForm">
        <CRow>
          <div class="flex w-100 justify-content-center">
            <el-form-item class="flex w-100 justify-content-center flex-column text-center" :label="$t('Global.satisfaction_level')" prop="satisfaction">
              <el-radio-group class="flex w-100 justify-content-center" size="mini" v-model="ruleForm.level">
                <el-radio border :label="$t('Global.ev_week')">{{ $t('Global.ev_week') }} </el-radio>
                <el-radio border :label="$t('Global.ev_good')">{{ $t('Global.ev_good') }} </el-radio>
                <el-radio border :label="$t('Global.ev_very_good')">{{ $t('Global.ev_very_good') }} </el-radio>
                <el-radio border :label="$t('Global.ev_excellent')">{{ $t('Global.ev_excellent') }} </el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <CCol sm="12" lg="6">
            <el-form-item :label="$t('Global.notes')" prop="remark">
              <el-input autosize resize="none" type="textarea" v-model="ruleForm.remark"></el-input>
            </el-form-item>
          </CCol>
          <CCol sm="12" lg="6">
            <el-form-item :label="$t('Global.like')" prop="like">
              <el-input autosize resize="none" type="textarea" v-model="ruleForm.satisfied"></el-input>
            </el-form-item>
          </CCol>
          <CCol sm="12" lg="6">
            <el-form-item :label="$t('Global.positives')" prop="positives">
              <el-input autosize resize="none" type="textarea" v-model="ruleForm.positive"></el-input>
            </el-form-item>
          </CCol>
          <CCol sm="12" lg="6">
            <el-form-item :label="$t('Global.negatives')" prop="negatives">
              <el-input autosize resize="none" type="textarea" v-model="ruleForm.negative"></el-input>
            </el-form-item>
          </CCol>
          <CCol sm="12" lg="6">
            <el-form-item :label="$t('Global.learned')" prop="learned">
              <el-input autosize resize="none" type="textarea" v-model="ruleForm.learned"></el-input>
            </el-form-item>
          </CCol>
        </CRow>
      </el-form>
    </CCardBody>
    <CCardFooter>
      <div class="baseButton resetButton" style="justify-content: flex-start">
        <button class="el-button el-button--default is-round sec_color mx-1" @click="saveNotes('ruleForm')" style="padding: 0.6rem 1rem">
          <i class="el-icon-check-circle"></i>
          <CSpinner v-if="isLoad" color="default" size="sm" />
          {{ $route.params.id ? $t('Global.submit') : $t('Global.add') }}
        </button>
        <button v-if="!isLoad" class="el-button--small el-button el-button--default is-round base_color" @click="resetForm('ruleForm')" type="reset" style="padding: 0.6rem 1rem">
          <i class="el-icon-refresh"></i>
          {{ $t('archive.reset') }}
        </button>
      </div>
    </CCardFooter>
  </CCard>
</template>

<script>
export default {
  data() {
    return {
      isLoad: false,
      ruleForm: {
        evaluationValues: null,
        remark: null,
        satisfied: null,
        positive: null,
        negative: null,
        learned: null,
        satisfaction: null,
        level: null,
      },
    };
  },
  computed: {
    notes: function () {
      if (this.$store.state.course.course && this.$store.state.course.course.notes) {
        return this.$store.state.course.course.notes;
      }
    },
  },
  methods: {
    save(formName) {},
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    saveNotes() {
      this.isLoad = true;
      let query = {
        learned: this.ruleForm.learned,
        positive: this.ruleForm.positive,
        negative: this.ruleForm.negative,
        satisfied: this.ruleForm.satisfied,
        remark: this.ruleForm.remark,
        level: this.ruleForm.level,
      };
      this.$store
        .dispatch('course/saveNotes', {
          id: this.$route.params.id,
          query: query,
        })
        .then(_ => {
          this.isLoad = false;
          this.$notify({
            type: 'success',
            message: `${this.$t('Global.successMessage')}`,
          });
        });
    },

    Refresh() {
      if (this.notes) {
        this.ruleForm = this.notes;
      }
    },
  },
  mounted() {
    this.Refresh();
  },
};
</script>

<style lang="scss">
.text-center .el-form-item__label {
  text-align: center !important;
}
</style>
