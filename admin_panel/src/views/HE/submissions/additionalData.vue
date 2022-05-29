<template>
  <CRow class="edit_submission">
    <template v-if="$store.state.user.allowHr || hasPermission('admin_system')">
      <CCol sm="12">
        <CCard v-loading="$store.getters['submission/submissionsLoad']">
          <CCardHeader>
            <div :class="$i18n.locale === 'ar' ? 'card-header-actions' : ''" style="display: inline-block">
              <CIcon name="cil-people" color="bg-primary"></CIcon>
              {{ $t('Global.editAdditionalData') }}
            </div>
          </CCardHeader>
          <CCardBody :class="isLoad ? 'disabledAll' : ''" dir="rtl" style="text-align: initial">
            <el-form @submit.native.prevent label-position="top" :model="ruleForm" :rules="rules" status-icon size="large" ref="ruleForm" label-width="120px" class="demo-ruleForm">
              <CRow>
                <!-- <el-divider class="mt-n3"></el-divider> -->
                <CCol sm="4" v-if="hasPermission('all_submissions')">
                  <el-form-item :rules="validation(null, 1)" :label="$t('Global.representative')" prop="representative_id">
                    <el-select
                      clearable
                      ref="representative_id"
                      :placeholder="$t('Global.representative')"
                      :no-data-text="$t('Global.nodata')"
                      style="width: 100%"
                      v-model="ruleForm.representative_id"
                      filterable
                      remote
                      reserve-keyword
                      :remote-method="search"
                      :loading="$store.getters['archive/usersLoad']"
                    >
                      <el-option v-if="$store.state.submission.representative_id" :key="$store.state.submission.representative_id.id" :label="$store.state.submission.representative_id.ar_name" :value="$store.state.submission.representative_id.id">
                        <span style="float: right; color: #8492a6; font-size: 13px">
                          {{ $store.state.submission.representative_id.ar_name }}
                          <i class="el-icon-user-solid"></i>
                        </span>
                      </el-option>
                      <el-option v-for="user in $store.getters['archive/users']" :key="user.id" :label="user.ar_name" :value="user.id">
                        <span style="float: right; color: #8492a6; font-size: 13px">
                          {{ user.ar_name }}
                          <i class="el-icon-user-solid"></i>
                        </span>
                      </el-option>
                      <template #empty>
                        <div class="text-center" style="padding: 10px; font-weight: bold">
                          {{ $t('Global.nodata') }}
                        </div>
                      </template>
                    </el-select>
                  </el-form-item>
                </CCol>
                <CCol :sm="hasPermission('admin_organizations') ? '4' : '6'">
                  <el-form-item :label="$t('Global.students_count')" prop="student_count">
                    <el-input suffix-icon="el-icon-license_number" :placeholder="$t('Global.students_count')" v-model="ruleForm.student_count"></el-input>
                  </el-form-item>
                </CCol>
                <CCol :sm="hasPermission('admin_organizations') ? '4' : '6'">
                  <el-form-item :label="$t('Global.organizationSpace')" prop="organization_area">
                    <el-input suffix-icon="el-icon-license_number" :placeholder="$t('Global.organizationSpace')" v-model="ruleForm.organization_area"></el-input>
                  </el-form-item>
                </CCol>
                <el-divider class="mb-3 mt-3" content-position="center"><i class="el-icon-map-location"></i> {{ $t('Global.deanInfo') }}</el-divider>
                <CCol sm="6">
                  <el-form-item :rules="validation(null, 0)" :label="$t('Global.name')" prop="authorized_person">
                    <el-input :placeholder="$t('Global.name')" v-model="ruleForm.authorized_person"></el-input>
                  </el-form-item>
                </CCol>
                <CCol sm="6">
                  <el-form-item :rules="validation(null, 0)" :label="$t('Global.mobile')" prop="authorized_mobile">
                    <el-input suffix-icon="el-icon-mobile" :placeholder="$t('Global.mobile')" v-model="ruleForm.authorized_mobile"></el-input>
                  </el-form-item>
                </CCol>
                <CCol sm="6">
                  <el-form-item :label="$t('Global.alt_phone')" prop="authorized_phone">
                    <el-input suffix-icon="el-icon-mobile" :placeholder="$t('Global.alt_phone')" v-model="ruleForm.authorized_phone"></el-input>
                  </el-form-item>
                </CCol>
                <CCol sm="6">
                  <el-form-item :rules="validation($t('Validation.email'), 'email')" :label="$t('Global.email')" prop="authorized_email">
                    <el-input type="email" suffix-icon="el-icon-email" :placeholder="$t('Global.email')" v-model="ruleForm.authorized_email"></el-input>
                  </el-form-item>
                </CCol>
              </CRow>
            </el-form>
          </CCardBody>
          <CCardFooter>
            <div class="baseButton resetButton" style="justify-content: flex-start">
              <button class="el-button el-button--default is-round sec_color mx-1" @click="save('ruleForm')" style="padding: 0.6rem 1rem">
                <i class="el-icon-check-circle"></i>
                <CSpinner v-if="isLoad" color="default" size="sm" />
                <span class="ml-1 mr-1" v-if="$store.state.uploadProgress && $store.state.uploadProgress != 100">{{ $store.state.uploadProgress }}%</span>
                {{ $route.params.id ? $t('Global.submit') : $t('Global.send') }}
              </button>
              <button v-if="!isLoad" class="el-button--small el-button el-button--default is-round base_color" @click="resetForm('ruleForm')" type="reset" style="padding: 0.6rem 1rem">
                <i class="el-icon-refresh"></i>
                {{ $t('archive.reset') }}
              </button>
            </div>
          </CCardFooter>
        </CCard>
      </CCol>
    </template>
  </CRow>
</template>

<script>
export default {
  name: 'editAdditionalData',
  data() {
    return {
      editable: [],
      temp_uni: false,
      temp_org: false,
      hideType: false,
      disabled_type: true,
      checkAll: false,
      isIndeterminate: true,
      showUpload: false,
      filesError: null,
      file_list: [],
      supportFiles: null,
      uploadPercentage: 0,
      disabled: true,
      disabled_self_report: true,
      disabled_org: true,
      organizationDialog: false,
      selectedPrograms: [],
      baseUrl: process.env.VUE_APP_BASE_URL,
      file: [],
      isLoad: false,
      error: null,
      clicked: false,
      checkedTerms: [],
      termsError: false,
      ruleForm: {
        representative_id: null,
        authorized_person: null,
        authorized_phone: null,
        authorized_mobile: null,
        authorized_email: null,
        visit_type_id: null,
        organization_area: null,
        student_count: null,
        plan: null,
        team: null,
        officail_council: null,
        self_report_type: null,
        organization_id: null,
        university: null,
        temp_university_name: null,
        temp_organization_name: null,
        evaluation_type: null,
        programs: null,
      },
      editForm: {
        type: null,
        organization: null,
        university: null,
        programs: null,
      },
      programForm: {
        name: null,
        qualification_degree_id: null,
        nature_id: null,
        education_pattern_id: null,
        cycle_time_id: null,
        language_id: null,
      },
      rules: {
        university: [{ required: true, message: this.$t('Global.selectFiled'), trigger: 'change' }],
        organization_id: [{ required: true, message: 'من فضلك يجب اختيار المؤسسة  ', trigger: 'change' }],
        evaluation_type: [
          {
            required: true,
            message: 'من فضلك يجب اختيار نوع الاعتماد',
            trigger: 'change',
          },
        ],
        self_report_type: [
          {
            required: true,
            message: 'من فضلك يجب اختيار التقرير الزاتي',
            trigger: 'change',
          },
        ],
        officail_council: [
          {
            required: true,
            message: 'من فضلك يجب اختيار مجلس رسمي حاكم معتمد',
            trigger: 'change',
          },
        ],
      },
      editRules: {
        university: [{ required: true, message: 'من فضلك يجب اختيار الجامعة  ', trigger: 'blur' }],
        organization: [{ required: true, message: 'من فضلك يجب اختيار المؤسسة  ', trigger: 'blur' }],
      },
    };
  },
  mounted() {
    this.init();
    this.usersRoles();
  },
  watch: {
    'ruleForm.authorized_phone'(value) {
      if (value) {
        this.ruleForm.authorized_phone = value.toString().replace(/[^0-9]/g, '');
      }
    },
    'ruleForm.authorized_mobile'(value) {
      if (value) {
        this.ruleForm.authorized_mobile = value.toString().replace(/[^0-9]/g, '');
      }
    },
    'ruleForm.organization_area'(value) {
      if (value) {
        this.ruleForm.organization_area = value.toString().replace(/[^0-9]/g, '');
      }
    },
    'ruleForm.student_count'(value) {
      if (value) {
        this.ruleForm.student_count = value.toString().replace(/[^0-9]/g, '');
      }
    },
  },
  methods: {
    usersRoles(search = '', limit = 70) {
      this.$store.dispatch('archive/usersRoles', { query: { search_text: search, limit: limit } });
    },
    search(query) {
      this.usersRoles(query);
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    init() {
      this.$store
        .dispatch('submission/edit', {
          id: this.$route.params.id ? this.$route.params.id : null,
          query: {},
        })
        .then(() => {
          this.ruleForm.authorized_person = this.$store.state.submission.authorized_person ? this.$store.state.submission.authorized_person : null;
          this.ruleForm.authorized_phone = this.$store.state.submission.authorized_phone ? this.$store.state.submission.authorized_phone : null;
          this.ruleForm.authorized_mobile = this.$store.state.submission.authorized_mobile ? this.$store.state.submission.authorized_mobile : null;
          this.ruleForm.authorized_email = this.$store.state.submission.authorized_email ? this.$store.state.submission.authorized_email : null;
          this.ruleForm.visit_type_id = this.$store.state.submission.visit_type_id ? this.$store.state.submission.visit_type_id : null;
          this.ruleForm.organization_area = this.$store.state.submission.organization_area ? this.$store.state.submission.organization_area : null;
          this.ruleForm.student_count = this.$store.state.submission.student_count ? this.$store.state.submission.student_count : null;
          this.ruleForm.representative_id = this.getRepresentative(this.$store.state.submission.representative_id);
        });
    },

    openDialog(type) {
      this.editForm.programs = null;
      if (this.disabled_org && type != 1) return true;
      this.editForm.type = type;
      this.organizationDialog = true;
    },
    save(formName) {
      var allowedExtensions = /(\.pdf|\.txt|\.doc|\.docx)$/i;
      this.$refs[formName].validate(valid => {
        if (!this.$route.params.id) {
          if (valid) {
            let formData = new FormData();
            for (const [key, value] of Object.entries(this.ruleForm)) {
              if (value || value == 0) {
                formData.append(key, value);
              }
            }
            if (this.$route.params.system) {
              formData.append('system', this.$route.params.system);
            }
            this.isLoad = true;
            var query = { query: formData };
            if (this.$route.params.id) {
              query = { query: formData, id: this.$route.params.id };
            }
            if (this.clicked) return;
            this.clicked = true;
            this.filesError = false;
            this.$store
              .dispatch('submission/saveAdditionalData', query)
              .then(() => {
                this.$notify.success({
                  message: `${this.$t('Global.successMessage')}`,
                });
                this.isLoad = false;
              })
              .catch(() => {
                this.error = true;
                this.clicked = false;
                this.isLoad = false;
                this.$store.commit('SET_UPLOAD_PROGRESS', 100);
              });
          }
        } else {
          if (valid) {
            let formData = new FormData();
            for (const [key, value] of Object.entries(this.ruleForm)) {
              if (value || value == 0) {
                formData.append(key, value);
              }
            }
            if (this.$route.params.system) {
              formData.append('system', this.$route.params.system);
            }

            var query = { query: formData };
            if (this.$route.params.id) {
              query = { query: formData, id: this.$route.params.id };
            }
            this.isLoad = true;
            if (this.clicked) return;
            this.clicked = true;
            this.$store
              .dispatch('submission/saveAdditionalData', query)
              .then(() => {
                this.$notify.success({
                  message: `${this.$t('Global.successMessage')}`,
                });
                this.isLoad = false;
              })
              .catch(() => {
                this.error = true;
                this.clicked = false;
                this.isLoad = false;
                this.$store.commit('SET_UPLOAD_PROGRESS', 100);
              });
          }
        }
      });
    },
  },
};
</script>

<style lang="scss">
.ml-4-5 {
  margin-left: 2.3rem !important;
}
.w-20 {
  width: 19.5%;
}
.ar .direction {
  direction: rtl;
}
.en .direction {
  direction: ltr;
}
.el-notification.right {
  .el-notification__content {
    margin: 0;
    text-align: initial;
  }
}
.hover_icon {
  padding: 0.2rem;
  &:hover {
    background-color: #ddd;
    border-radius: 50%;
    padding: 0.2rem;
  }
}
.disabledAll {
  pointer-events: none;
  opacity: 0.4;
}
.check_block {
  .check_all {
    display: none;
  }

  .el-checkbox,
  .el-checkbox__input {
    white-space: pre-wrap;
  }
}

.el-checkbox:last-of-type {
  margin-right: 30px;
}

.check_all {
  margin-right: 0px !important;
}
.custom_link {
  span,
  div {
    &:hover {
      text-decoration: underline;
    }
  }
}
// .hide_border {
//   .el-input--suffix .el-input__inner {
//     border: 0;
//     border-bottom: 1px solid #ddd;
//   }
// }
.ar .long_place_holder {
  .el-input--suffix .el-input__inner {
    padding-left: 77px !important;
  }
}

.plus_icon {
  .left_input {
    top: 9px;
    left: 5px;
  }
}

.edit_upload {
  &.el-card.is-always-shadow {
    box-shadow: none;
    border: none;
  }

  background: transparent;

  .el-card__body {
    .docs {
      align-items: unset;

      .upload-btn-wrapper {
        span .fileName {
          max-width: 174px !important;
        }
      }
    }
    display: flex;
    flex-direction: column;
    // grid-template-columns: 1fr 1fr !important;
  }
}

.shake {
  animation: shake 150ms 2 linear;
  -moz-animation: shake 150ms 2 linear;
  -webkit-animation: shake 150ms 2 linear;
  -o-animation: shake 150ms 2 linear;
}

@keyframes shake {
  0% {
    transform: translate(3px, 0);
  }
  50% {
    transform: translate(-3px, 0);
  }
  100% {
    transform: translate(0, 0);
  }
}

@-moz-keyframes shake {
  0% {
    -moz-transform: translate(3px, 0);
  }
  50% {
    -moz-transform: translate(-3px, 0);
  }
  100% {
    -moz-transform: translate(0, 0);
  }
}

@-webkit-keyframes shake {
  0% {
    -webkit-transform: translate(3px, 0);
  }
  50% {
    -webkit-transform: translate(-3px, 0);
  }
  100% {
    -webkit-transform: translate(0, 0);
  }
}

@-ms-keyframes shake {
  0% {
    -ms-transform: translate(3px, 0);
  }
  50% {
    -ms-transform: translate(-3px, 0);
  }
  100% {
    -ms-transform: translate(0, 0);
  }
}

@-o-keyframes shake {
  0% {
    -o-transform: translate(3px, 0);
  }
  50% {
    -o-transform: translate(-3px, 0);
  }
  100% {
    -o-transform: translate(0, 0);
  }
}

.el-dialog__footer {
  text-align: left;
}

.ar .el-dialog__footer {
  text-align: right;
}

.ar .el-form-item {
  direction: rtl;
  text-align: right;
}

.el-form-item {
  direction: ltr;
  text-align: left;
}

.ar .right_icon span {
  float: right;
}

.left_input {
  position: absolute;
  top: 50px;
  left: 23px;
  cursor: pointer;
}

.el-input--suffix .el-input__inner {
  padding-left: 34px;
}

.ar .el-input--suffix .el-input__inner {
  padding-left: 0px;
}

.ar .edit_submission .el-select .el-input .el-input__suffix {
  right: unset;
  left: 30px;
}

.ar .edit_submission .el-input .el-input__suffix {
  right: unset;
  left: 22px;
}

.ar .el-notification__group {
  text-align: right;
}

.upload-btn-wrapper input[type='file'] {
  font-size: 11px !important;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
}

.visit_popup {
  top: unset;
  bottom: 15.8rem;
}

.el-select__tags {
  margin: 0 0.5rem !important;
}
</style>
