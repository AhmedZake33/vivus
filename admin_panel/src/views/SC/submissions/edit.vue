<template>
  <CRow class="edit_submission">
    <CCol sm="12" v-if="$route.params.type == 1">
      <CCard v-loading="$store.getters['submission/submissionsLoad'] && !isLoad">
        <CCardHeader>
          <div :class="$i18n.locale === 'ar' ? 'card-header-actions' : ''" style="display: inline-block">
            <CIcon name="cil-people" color="bg-primary"></CIcon>
            {{ $t('Global.submission') }}
          </div>
        </CCardHeader>
        <CCardBody :class="isLoad ? 'disabledAll' : ''" dir="rtl" style="text-align: initial">
          <el-form @submit.native.prevent label-position="top" :model="ruleForm" :rules="rules" status-icon size="large" ref="ruleForm" label-width="120px" class="demo-ruleForm">
            <CRow>
              <CCol sm="12" class="direction d-flex flex-wrap align-items-center">
                <strong class="ml-2 mr-2 custom_required">{{ $t('Global.edu_type') }}</strong>
                <el-form-item prop="education_type" class="mb-0">
                  <el-select clearable :no-data-text="$t('Global.nodata')" style="width: 100%" v-model="education_type" :placeholder="$t('Global.edu_type')">
                    <el-option v-for="item in eduction_types" :key="item.id" :label="item.name" :value="item.id">
                      <span style="float: right; color: #8492a6; font-size: 13px">
                        {{ item.name }}
                        <i class="el-icon-office-building"></i>
                      </span>
                    </el-option>
                    <template #empty>
                      <div class="text-center" style="padding: 10px; font-weight: bold">
                        {{ $t('Global.nodata') }}
                      </div>
                    </template>
                  </el-select>
                </el-form-item>
                <div class="mb-3 mb-lg-0 w-sm-100 d-flex flex-lg-grow-1 flex-wrap align-items-center">
                  <strong class="ml-2 mr-2 custom_required">{{ $t('Global.subDirectorate') }}</strong>
                  <div class="plus_icon flex-grow-1 position-relative mt-lg-0">
                    <el-form-item class="animate hide_border m-0" :rules="validation(null, 1)" prop="government_id">
                      <el-select :disabled="!education_type" clearable :no-data-text="$t('Global.nodata')" style="width: 100%" v-model="ruleForm.government_id" filterable ref="all" :placeholder="$t('Global.directorate')">
                        <el-option v-for="item in $store.getters['directorate/directorates']" :key="item.id" :label="item.name" :value="item.id">
                          <span style="float: right; color: #8492a6; font-size: 13px">
                            {{ item.name }}
                          </span>
                        </el-option>
                        <!-- <el-option key="new" :label="$t('Global.other')" :value="0">
                          <span style="float: right; color: #8492a6; font-size: 13px">
                            {{ $t('Global.other') }}
                          </span>
                        </el-option> -->
                        <template #empty>
                          <div class="text-center" style="padding: 10px; font-weight: bold">
                            {{ $t('Global.nodata') }}
                          </div>
                        </template>
                      </el-select>
                    </el-form-item>
                  </div>
                </div>
                <strong class="ml-3 mr-3 custom_required">{{ education_type == 4 ? $t('Global.azhar_area') : $t('Global.Subadministration') }}</strong>
                <div class="plus_icon position-relative flex-grow-1 mb-md-4 mt-md-4 mt-lg-0 mb-lg-0">
                  <el-form-item :rules="validation(null, 1)" prop="institute_id" class="m-0 hide_border">
                    <el-select class="long_place_holder" clearable :disabled="disabled_admin" :no-data-text="$t('Global.nodata')" style="width: 100%" v-model="ruleForm.institute_id" filterable ref="all" :placeholder="$t('Global.administration')">
                      <el-option v-if="checkifAzhar(item)" v-for="item in $store.getters['directorate/institutes']" :key="item.id" :label="item.name" :value="item.id">
                        <span style="float: right; color: #8492a6; font-size: 13px">
                          {{ item.name }}
                        </span>
                      </el-option>
                      <el-option
                        v-if="$store.getters['submission/selectedadministration'] && !$route.params.id"
                        :key="$store.getters['submission/selectedadministration'].id"
                        :label="$store.getters['submission/selectedadministration'].name"
                        :value="$store.getters['submission/selectedadministration'].id"
                      >
                        <span style="float: right; color: #8492a6; font-size: 13px">
                          {{ $store.getters['submission/selectedadministration'].name }}
                        </span>
                      </el-option>
                      <template #empty>
                        <div class="text-center" style="padding: 10px; font-weight: bold">
                          {{ $t('Global.nodata') }}
                        </div>
                      </template>
                    </el-select>
                  </el-form-item>
                </div>
              </CCol>
              <CCol sm="12" lg="4" class="direction d-flex flex-wrap align-items-center mt-4">
                <strong class="ml-1 mr-3 custom_required">{{ $t('Global.school') }}</strong>
                <div class="plus_icon position-relative flex-grow-1 mb-md-4 mt-md-4 mt-lg-0 mb-lg-0">
                  <el-form-item :rules="validation(null, 1)" prop="organization_id" class="m-0 hide_border">
                    <el-select class="long_place_holder" clearable :disabled="disabledOrg" :no-data-text="$t('Global.nodata')" style="width: 100%" v-model="ruleForm.organization_id" filterable ref="all" :placeholder="$t('Global.school')">
                      <el-option :class="item.disable_status ? 'disabledAll' : ''" v-for="item in $store.getters['directorate/schools']" :key="item.id" :label="item.name" :value="item.id">
                        <span style="float: right; color: #8492a6; font-size: 13px">
                          {{ item.name }}
                        </span>
                      </el-option>
                      <template #empty>
                        <div class="text-center" style="padding: 10px; font-weight: bold">
                          {{ $t('Global.nodata') }}
                        </div>
                      </template>
                    </el-select>
                  </el-form-item>
                  <div class="left_input">
                    <router-link to="/school/organization/new/add/1">
                      <i class="el-icon-circle-plus" style="font-size: 22px"> </i>
                    </router-link>
                  </div>
                </div>
              </CCol>
              <CCol sm="12" class="direction d-flex flex-wrap flex-column mt-4">
                <div class="d-flex flex-wrap">
                  <!-- <div class="w-sm-100 d-flex w-20 flex-lg-grow-1 flex-wrap">
                    <strong class="ml-1 mr-1 mt-2 custom_required">{{ $t('Global.school') }}</strong>
                    <el-form-item style="flex-basis: 92px" class="flex-grow-1 hide_border" :rules="validation(null, 1)" prop="evaluation_type">
                      <el-input clearable :placeholder="$t('Global.school')" v-model="ruleForm.school">
                        <i slot="suffix" class="el-input__icon el-icon-office-building"></i>
                      </el-input>
                    </el-form-item>
                  </div> -->
                  <!-- <div class="w-sm-100 d-flex w-20 flex-lg-grow-1 flex-wrap">
                    <strong class="mx-3 mt-2 custom_required">{{ $t('Global.subType') }}</strong>
                    <el-form-item style="flex-basis: 92px" class="flex-grow-1 hide_border" :rules="validation(null, 1)" prop="evaluation_type">
                      <el-select id="evaluation_type_name" name="evaluation_type_name" clearable :no-data-text="$t('Global.nodata')" style="width: 100%" v-model="ruleForm.evaluation_type" filterable :placeholder="$t('Global.type')">
                        <el-option v-for="item in $store.getters['submission/evaluationTypes']" :key="item.id" :label="item.name" :value="item.id">
                          <span style="float: right; color: #8492a6; font-size: 13px">
                            {{ item.name }}
                          </span>
                        </el-option>
                        <template #empty>
                          <div class="text-center" style="padding: 10px; font-weight: bold">
                            {{ $t('Global.nodata') }}
                          </div>
                        </template>
                      </el-select>
                    </el-form-item>
                  </div> -->
                </div>
              </CCol>
              <el-divider class="mb-5 mt-2" content-position="center"><i class="el-icon-map-location"></i> {{ $t('Global.generalInfo') }}</el-divider>
              <CCol sm="12" class="direction d-flex flex-wrap flex-column">
                <div class="d-flex flex-wrap">
                  <div class="mb-3 w-sm-100 d-flex flex-lg-grow-1 flex-wrap">
                    <strong class="ml-2 mr-1 mt-2 custom_required">{{ $t('Global.visitTypes') }}</strong>
                    <el-form-item style="flex-basis: 92px" class="flex-grow-1 hide_border" :rules="validation(null, 1)" prop="visit_type_id">
                      <el-select id="visitTypes" name="visitTypes" clearable :no-data-text="$t('Global.nodata')" style="width: 100%" v-model="ruleForm.visit_type_id" filterable :placeholder="$t('Global.visitTypes')">
                        <el-option v-for="item in $store.getters['submission/visitTypes']" :key="item.id" :label="item.name" :value="item.id">
                          <span style="float: right; color: #8492a6; font-size: 13px">
                            {{ item.name }}
                          </span>
                        </el-option>
                        <template #empty>
                          <div class="text-center" style="padding: 10px; font-weight: bold">
                            {{ $t('Global.nodata') }}
                          </div>
                        </template>
                      </el-select>
                    </el-form-item>
                  </div>
                </div>
              </CCol>
            </CRow>
          </el-form>
        </CCardBody>
        <CCardFooter>
          <div class="baseButton resetButton" style="justify-content: flex-start">
            <button class="el-button el-button--default is-round sec_color mx-1" @click="save('ruleForm')" style="padding: 0.6rem 1rem">
              <i class="el-icon-check-circle"></i>
              <CSpinner v-if="isLoad" color="default" size="sm" />
              {{ $route.params.id ? $t('Global.next') : $t('Global.next') }}
            </button>
            <button v-if="!isLoad" class="el-button--small el-button el-button--default is-round base_color" @click="resetForm('ruleForm')" type="reset" style="padding: 0.6rem 1rem">
              <i class="el-icon-refresh"></i>
              {{ $t('archive.reset') }}
            </button>
          </div>
        </CCardFooter>
      </CCard>
    </CCol>

    <CCol sm="12" v-if="$route.params.type == 3 && $route.params.ev_id">
      <Finance></Finance>
    </CCol>

    <CCol sm="12" v-if="$route.params.type == 2">
      <FileList v-if="$store.state.submission.initDocuments" :documents="$store.state.submission.initDocuments"></FileList>
    </CCol>

    <CCol sm="12" v-if="$route.params.id && $route.params.type == 3 && !$route.params.ev_id">
      <approve></approve>
    </CCol>
  </CRow>
</template>

<script>
import upload from '../../components/upload';
import FormUpload from '../../components/FormUpload';
import Approve from './components/approve';
import Finance from './components/Finance';
import FileList from './components/FileList';

const axios = require('axios');
const termsOptions = [1, 2, 3, 4, 5];
export default {
  components: { Approve, upload, FormUpload, Finance, FileList },
  name: 'submissionEdit',
  data() {
    return {
      editable: [],
      temp_uni: false,
      temp_org: false,
      hideType: false,
      disabled_type: true,
      checkAll: false,
      isIndeterminate: true,
      terms: termsOptions,
      showUpload: false,
      filesError: null,
      disabledOrg: true,
      file_list: [],
      supportFiles: null,
      uploadPercentage: 0,
      disabled: true,
      disabled_self_report: true,
      disabled_admin: true,
      administrationDialog: false,
      selectedPrograms: [],
      baseUrl: process.env.VUE_APP_BASE_URL,
      file: [],
      isLoad: false,
      error: null,
      clicked: false,
      checkedTerms: [],
      termsError: false,
      education_type: null,
      ruleForm: {
        authorized_person: null,
        authorized_phone: null,
        authorized_mobile: null,
        authorized_email: null,
        organization_id: null,
        visit_type_id: null,
        administration_area: null,
        student_count: null,
        team: null,
        institute_id: null,
        government_id: null,
        temp_government_id_name: null,
        temp_administration_name: null,
        evaluation_type: null,
        programs: null,
      },
      editForm: {
        type: null,
        administration: null,
        government_id: null,
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
        government_id: [{ required: true, message: this.$t('Global.selectFiled'), trigger: 'change' }],
        institute_id: [{ required: true, message: 'من فضلك يجب اختيار المؤسسة  ', trigger: 'change' }],
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
        plan: [{ required: true, message: 'من فضلك يجب اختيار خطة ', trigger: 'change' }],
      },
      editRules: {
        government_id: [{ required: true, message: 'من فضلك يجب اختيار الجامعة  ', trigger: 'blur' }],
        administration: [{ required: true, message: 'من فضلك يجب اختيار المؤسسة  ', trigger: 'blur' }],
        // programs: [{ validator: checkAddPrograms, trigger: 'blur' }],
      },
    };
  },
  mounted() {
    this.init();
  },
  computed: {
    eduction_types: function () {
      return this.$store.getters['organization/lookup'];
    },
  },
  watch: {
    education_type: function (val, newVal) {
      if (newVal) {
        this.ruleForm.institute_id = null;
        this.ruleForm.government_id = null;
      }
    },
    'ruleForm.authorized_phone'(value) {
      if (!value);
      this.ruleForm.authorized_phone = value.toString().replace(/[^0-9]/g, '');
    },
    'ruleForm.authorized_mobile'(value) {
      if (!value);
      this.ruleForm.authorized_mobile = value.toString().replace(/[^0-9]/g, '');
    },
    'ruleForm.administration_area'(value) {
      if (!value);
      this.ruleForm.administration_area = value.toString().replace(/[^0-9]/g, '');
    },
    'ruleForm.student_count'(value) {
      if (!value);
      this.ruleForm.student_count = value.toString().replace(/[^0-9]/g, '');
    },
    'ruleForm.government_id': function (val, newVal) {
      if (newVal) {
        this.ruleForm.institute_id = null;
        this.ruleForm.organization_id = null;
        this.temp_org = null;
      }
      if ((this.ruleForm.evaluation_type == 3 && (this.temp_uni || this.temp_org)) || this.ruleForm.evaluation_type !== 3) {
        this.disabled = true;
      } else {
        if (!this.$route.params.id) {
          this.disabled = false;
        } else {
          if (this.isGthCurrentStatus(this.$store.state.submission.current_status, this.constants('FILL_INFO_STATUS'))) {
            this.disabled = true;
          } else {
            this.disabled = false;
          }
        }
      }
      if (val) {
        if (val === 0) {
          this.editForm.programs = null;
          this.editForm.type = 1;
        } else {
          this.$store.dispatch('directorate/institutes', {
            parent_id: this.ruleForm.government_id,
          });
          if (this.temp_org) {
            let selectedgovernment_idName = this.$store.getters['directorate/universities'] ? this.$store.getters['directorate/universities'].find(government_id => government_id.id == val) : null;
            this.ruleForm.temp_government_id_name = selectedgovernment_idName ? selectedgovernment_idName.name : null;
          } else if (val != 0 && this.ruleForm.institute_id != 0) {
            this.ruleForm.temp_government_id_name = null;
            this.ruleForm.temp_administration_name = null;
          }
        }
        this.disabled_admin = false;
      } else {
        this.disabledOrg = true;
        this.disabled_admin = true;
      }
    },
    'ruleForm.evaluation_type': function (val, newVal) {
      if (newVal) {
        this.ruleForm.programs = [];
      }
      if (val === 3 && (this.ruleForm.institute_id || this.ruleForm.institute_id == 0)) {
        if (this.temp_uni || this.temp_org) {
          this.disabled = true;
        } else {
          if (!this.$route.params.id) {
            this.disabled = false;
          } else {
            if (this.isGthCurrentStatus(this.$store.state.submission.current_status, this.constants('FILL_INFO_STATUS'))) {
              this.disabled = true;
            } else {
              this.disabled = false;
            }
          }
        }
      } else {
        this.disabled = true;
      }
    },
    'ruleForm.organization_id': function (val, newVal) {
      if (newVal) {
        // this.ruleForm.institute_id = null;
      }
      if (val) {
        // this.disabledOrg = false;
      } else {
        // this.disabledOrg = true;
      }
    },
    'ruleForm.institute_id': function (val, newVal) {
      if (!this.$route.params.type || (this.$route.params.type && this.$route.params.type != 3)) {
        if (newVal) {
          this.ruleForm.evaluation_type = null;
          this.ruleForm.organization_id = null;
        }
        if (val) {
          this.disabledOrg = false;
          this.isLoad = true;
          this.$store
            .dispatch('directorate/schools', {
              parent_id: this.ruleForm.institute_id,
            })
            .then(_ => {
              this.isLoad = false;
            });
        } else {
          this.disabledOrg = true;
          if (!this.ruleForm.evaluation_type) {
            this.disabled_type = true;
          }
          this.disabled_self_report = true;
        }
      }
    },
  },
  methods: {
    checkifAzhar(item) {
      if (this.education_type == 4 && item.is_general == 0) {
        return true;
      } else if (this.education_type == 4 && item.is_general == 1) {
        return false;
      } else if (this.education_type != 4 && item.is_general == 1) {
        return true;
      } else if (this.education_type != 4 && item.is_general == 0) {
        return false;
      } else {
        false;
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    init() {
      if (!this.$route.params.type || (this.$route.params.type && this.$route.params.type != 3)) {
        this.isLoad = true;
        this.$store.dispatch('directorate/directorates');
        this.$store
          .dispatch('submission/SCedit', {
            id: this.$route.params.id ? this.$route.params.id : null,
            query: {},
          })
          .then(() => {
            this.ruleForm.organization_id = this.$store.state.submission.selectedOrganization || this.$store.state.submission.selectedOrganization == 0 ? this.$store.state.submission.selectedOrganization : null;
            this.ruleForm.institute_id = this.$store.state.submission.institute_id || this.$store.state.submission.institute_id == 0 ? this.$store.state.submission.institute_id : null;
            this.ruleForm.government_id = this.$store.state.submission.government_id || this.$store.state.submission.government_id == 0 ? this.$store.state.submission.government_id : null;
            this.ruleForm.visit_type_id = this.$store.state.submission.visit_type_id ? this.$store.state.submission.visit_type_id : null;
            this.education_type = this.$store.state.submission.education_type ? this.$store.state.submission.education_type : null;
            this.isLoad = false;
          });
      }
    },

    save(formName) {
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
            var query = { query: formData };
            this.isLoad = true;
            if (this.clicked) return;
            this.clicked = true;
            this.$store
              .dispatch('submission/SCsave', [query, true])
              .then(() => {
                // this.$message({
                //   message: this.$t('Global.successMessage'),
                //   type: 'success',
                // });
                this.isLoad = false;
                this.clicked = false;
              })
              .catch(() => {
                this.error = true;
                this.clicked = false;
                this.isLoad = false;
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
            let type = true;
            if (this.$store.getters['submission/payment']) {
              type = false;
            }
            if (this.clicked) return;
            this.clicked = true;
            this.$store
              .dispatch('submission/SCsave', [query, type])
              .then(() => {
                // this.$message({
                //   message: this.$t('Global.successMessage'),
                //   type: 'success',
                // });
                this.isLoad = false;
                this.clicked = false;
                // this.$router.go(-1);
                // this.$router.go(`/school/submissions/submission/${this.$route.params.id}/${this.$route.params.ev_id}`);
              })
              .catch(() => {
                this.error = true;
                this.clicked = false;
                this.isLoad = false;
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
