<template>
  <div class="d-flex align-items-center min-vh-100">
    <div class="container-fluid p-4 pt-0 rounded">
      <CRow class="justify-content-center">
        <CCol md="12">
          <CCard class="mx-4 mb-0">
            <div class="mainBox signup shadow-lg">
              <div class="imgBox rounded-left">
                <img :src="url" class="rounded-left bgImg" alt="" />
                <div class="centerDiv">
                  <img class="logo shadow-sm d-block" :src="logo" alt="" />
                </div>
              </div>
              <div class="contBox">
                <CForm autocomplete="chrome-off" style="width: 100%" :class="isLoad ? 'disabledAll' : ''" class="formBox px-4 mt-n4" dir="rtl">
                  <el-form autocomplete="chrome-off" label-position="top"  :rules="rules" :model="user" status-icon size="large" ref="user" label-width="120px" class="demo-user">
                    <!-- <h2>المستخدم غير مفعل</h2> -->
                    <!-- <p class="text-muted">المستخدم غير مفعل لعدم اكتمال البيانات, للتفعيل برجاء ملئ البيانات التالية</p> -->
                    <el-alert v-if="!$route.params.type" effect="dark" class="mb-2" title="تفعيل المستخدم" type="warning">
                      <div class="d-flex">
                        <span>المستخدم غير مفعل لعدم اكتمال البيانات, للتفعيل برجاء ملئ البيانات التالية</span>
                      </div>
                    </el-alert>
                    <el-alert v-else effect="dark" class="mb-2" title="تفعيل المستخدم" type="warning">
                      <div class="d-flex">
                        <span>للتفعيل برجاء ملئ البيانات التالية</span>
                      </div>
                    </el-alert>
                    <CRow>
                      <CCol lg="6" sm="12">
                        <el-form-item :rules="[{ required: true, message: 'من فضلك يجب إدخال الاسم باللغة العربية', trigger: 'blur' }]" prop="ar_name">
                          <el-input id="ar_name" name="ar_name" prefix-icon="el-icon-message" :placeholder="$t('Global.ar_name')" v-model="user.ar_name"></el-input>
                        </el-form-item>
                      </CCol>
                      <CCol lg="6" sm="12">
                        <el-form-item :rules="[{ required: true, pattern: /^[^-\s][a-zA-Z_\s-]+$/, message: 'من فضلك يجب إدخال الاسم باللغة الإنجليزية', trigger: 'blur' }]" class="left_right" prop="en_name">
                          <el-input name="en_name" id="en_name" prefix-icon="el-icon-message" :placeholder="$t('Global.en_name')" v-model="user.en_name"></el-input>
                        </el-form-item>
                      </CCol>
                      <CCol lg="6" sm="12" v-if="!$route.params.type">
                        <el-form-item class="left_right" prop="email">
                          <el-input disabled id="email" name="email" prefix-icon="el-icon-message" :placeholder="$t('user.email')" v-model.trim="user.old_email"></el-input>
                        </el-form-item>
                      </CCol>
                      <CCol lg="6" sm="12">
                        <el-form-item :rules="validation($t('Validation.email'), 'email')" class="left_right" prop="email">
                          <el-input id="email" name="email" prefix-icon="el-icon-message" :placeholder="$t('user.email')" v-model.trim="user.email"></el-input>
                        </el-form-item>
                      </CCol>
                      <CCol lg="6" sm="12">
                        <el-form-item class="left_right" prop="mobile">
                          <el-input :maxlength="12" prefix-icon="el-icon-mobile" :placeholder="$t('user.mobile')" v-model.trim="user.mobile"></el-input>
                        </el-form-item>
                      </CCol>
                      <CCol :lg="!$route.params.type ? '6' : '12'" sm="12">
                        <el-form-item class="left_right" prop="national_id">
                          <el-input :maxlength="14" prefix-icon="el-icon-bank-card" :placeholder="$t('Global.national_id')" v-model.trim="user.national_id"></el-input>
                        </el-form-item>
                      </CCol>

                      <el-divider class="mb-4 mt-3" content-position="center"><i class="el-icon-data-analysis"></i> {{ $t('Global.specificationsDetails') }}</el-divider>

                      <CCol class="univer" lg="6" sm="12">
                        <div class="plus_icon_label flex-grow-1 position-relative mt-lg-0">
                          <el-form-item v-if="!temp_university_degree_name" :rules="validation(null, 1)" prop="university_degree_id">
                            <el-select ref="university_degree_id" :no-data-text="$t('Global.nodata')" clearable :placeholder="$t('Global.selectUniversity')" style="width: 100%" v-model="user.university_degree_id" filterable>
                              <el-option v-for="university in $store.getters['university/universities']" :key="university.id" :label="university.name" :value="university.id">
                                <span style="float: right; color: #8492a6; font-size: 13px">
                                  {{ university.name }}
                                  <i class="el-icon-user-solid"></i>
                                </span>
                              </el-option>
                              <el-option key="new" :label="$t('Global.other')" :value="0">
                                <span style="float: right; color: #8492a6; font-size: 13px">
                                  <span style="float: right; color: #8492a6; font-size: 13px">
                                    {{ $t('Global.other') }}
                                    <i class="el-icon-user-solid"></i>
                                  </span>
                                </span>
                              </el-option>
                              <template #empty>
                                <div class="text-center" style="padding: 10px; font-weight: bold">
                                  {{ $t('Global.nodata') }}
                                </div>
                              </template>
                            </el-select>
                          </el-form-item>

                          <el-form-item v-else :rules="validation(false, 'textarea')" prop="temp_university_degree_name" class="animate hide_border m-0">
                            <el-input clearable :placeholder="$t('Global.selectUniversityName')" v-model="user.temp_university_degree_name">
                              <i slot="suffix" class="el-input__icon el-icon-office-building"></i>
                            </el-input>
                          </el-form-item>

                          <div v-if="temp_university_degree_name" class="animate left_input_register" @click="resetUni('temp_university_degree_name')"><i class="el-icon-circle-close" style="font-size: 22px"></i></div>
                        </div>
                      </CCol>
                      <CCol class="organi" lg="6" sm="12">
                        <div class="plus_icon_label flex-grow-1 position-relative mt-lg-0">
                          <el-form-item v-if="!temp_organization_degree_name" :rules="validation(null, 1)" prop="organization_degree_id">
                            <div>
                              <el-select :disabled="dis_org_degree" ref="collage" :no-data-text="$t('Global.nodata')" :placeholder="$t('Global.selectCollage')" clearable style="width: 100%" v-model="user.organization_degree_id" filterable>
                                <el-option v-for="collage in $store.state.organization.organizationNamesDegree" :key="collage.id" :label="collage.name" :value="collage.id">
                                  <span style="float: right; color: #8492a6; font-size: 13px">
                                    {{ collage.name }}
                                    <i class="el-icon-user-solid"></i>
                                  </span>
                                </el-option>
                                <el-option key="new" :label="$t('Global.other')" :value="0">
                                  <span style="float: right; color: #8492a6; font-size: 13px">
                                    <span style="float: right; color: #8492a6; font-size: 13px">
                                      {{ $t('Global.other') }}
                                      <i class="el-icon-user-solid"></i>
                                    </span>
                                  </span>
                                </el-option>
                                <template #empty>
                                  <div class="text-center" style="padding: 10px; font-weight: bold">
                                    {{ $t('Global.nodata') }}
                                  </div>
                                </template>
                              </el-select>
                            </div>
                          </el-form-item>

                          <el-form-item v-else :rules="validation(false, 'textarea')" prop="temp_organization_degree_name" class="animate hide_border m-0">
                            <el-input clearable :placeholder="$t('Global.organization_name')" v-model="user.temp_organization_degree_name">
                              <i slot="suffix" class="el-input__icon el-icon-office-building"></i>
                            </el-input>
                          </el-form-item>

                          <div v-if="temp_organization_degree_name" class="animate left_input_register" @click="resetUni('temp_organization_degree_name')"><i class="el-icon-circle-close" style="font-size: 22px"></i></div>
                        </div>
                      </CCol>
                      <CCol lg="6" sm="12" :style="temp_organization_degree_name && temp_university_degree_name ? 'margin-top: 22px;' : ''">
                        <el-form-item prop="degree_education_level_id">
                          <div>
                            <el-select ref="level" :no-data-text="$t('Global.nodata')" :placeholder="$t('Global.selectLevel')" style="width: 100%" v-model="user.degree_education_level_id" filterable clearable>
                              <el-option v-for="level in $store.getters['user/levels']" :key="level.id" :label="level.name" :value="level.id">
                                <span style="float: right; color: #8492a6; font-size: 13px">
                                  {{ level.name }}
                                  <i class="el-icon-user-solid"></i>
                                </span>
                              </el-option>
                              <template #empty>
                                <div class="text-center" style="padding: 10px; font-weight: bold">
                                  {{ $t('Global.nodata') }}
                                </div>
                              </template>
                            </el-select>
                          </div>
                        </el-form-item>
                      </CCol>
                      <CCol lg="6" sm="12" :style="temp_organization_degree_name && temp_university_degree_name ? 'margin-top: 22px;' : ''">
                        <el-form-item prop="degree_qualification_id">
                          <div>
                            <el-select ref="qualification" :no-data-text="$t('Global.nodata')" :placeholder="$t('Global.selectQualifications')" style="width: 100%" v-model="user.degree_qualification_id" :disabled="qualification_status" filterable clearable>
                              <el-option v-for="qualification in $store.state.user.edu_qualifications" :key="qualification.id" :label="qualification.name" :value="qualification.id">
                                <span style="float: right; color: #8492a6; font-size: 13px">
                                  {{ qualification.name }}
                                  <i class="el-icon-user-solid"></i>
                                </span>
                              </el-option>
                              <template #empty>
                                <div class="text-center" style="padding: 10px; font-weight: bold">
                                  {{ $t('Global.nodata') }}
                                </div>
                              </template>
                            </el-select>
                          </div>
                        </el-form-item>
                      </CCol>
                      <CCol lg="12" sm="12">
                        <el-form-item :rules="$store.state.user.edu_specifications.length ? [{ required: true, message: 'من فضلك يجب إدخال التخصص الدقيق', trigger: 'change' }] : [{ required: false, trigger: 'change' }]" prop="degree_specification_id">
                          <div>
                            <el-select ref="specification" :no-data-text="$t('Global.nodata')" :placeholder="$t('Global.selectSpecification')" style="width: 100%" v-model="user.degree_specification_id" :disabled="specification_status" filterable clearable>
                              <el-option v-for="specification in $store.state.user.edu_specifications" :key="specification.id" :label="specification.name" :value="specification.id">
                                <span style="float: right; color: #8492a6; font-size: 13px">
                                  {{ specification.name }}
                                  <i class="el-icon-user-solid"></i>
                                </span>
                              </el-option>
                              <template #empty>
                                <div class="text-center" style="padding: 10px; font-weight: bold">
                                  {{ $t('Global.nodata') }}
                                </div>
                              </template>
                            </el-select>
                          </div>
                        </el-form-item>
                      </CCol>

                      <el-divider class="mb-4 mt-0" content-position="center"><i class="el-icon-map-location"></i> {{ $t('Global.Job_place') }}</el-divider>

                      <CCol sm="12" lg="12">
                        <el-form-item :rules="validation(false, 'textarea')" prop="experience" class="custom_area">
                          <el-input :autosize="{ minRows: 2, maxRows: 6}" resize="none" rows="2" :placeholder="$t('Global.workHistory')" type="textarea" v-model="user.experience"></el-input>
                        </el-form-item>
                      </CCol>

                      <CCol lg="6" sm="12">
                        <el-button :loading="isLoad" type="primary" style="width: 100%; background-color: #3c4b64; border: 0; font-size: 12px" class="small pill" @click="recovery('user')"> تفعيل </el-button>
                      </CCol>
                      <CCol sm="12" class="mt-2"> <span class="font-weight-lighter"> لديك حساب ؟</span><router-link to="/login" color="el-button el-button--text custom_hover" class="px-0"> تسجيل الدخول</router-link> </CCol>
                    </CRow>
                  </el-form>
                </CForm>
              </div>
            </div>
          </CCard>
        </CCol>
      </CRow>
    </div>
  </div>
</template>

<script>
import { EventBus } from '../../main';
export default {
  name: 'Register',
  data() {
    var validatePass = (rule, value, callback) => {
      if (value) {
        if (value.search(/[A-Z]/) == -1) {
          callback(new Error('يجب ان تحتوي كلمة المرور علي 8 حروف وارقام (حرف كبير ورمز واحد علي الأقل)'));
        } else if (value.search(/[@\#\!\$\%\^\&\*\(\)\~\*\-\?\>\<\}\{\}]/) == -1) {
          callback(new Error('يجب ان تحتوي كلمة المرور علي 8 حروف وارقام (حرف كبير ورمز واحد علي الأقل)'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    var validateConfirmPass = (rule, value, callback) => {
      var regularExpression = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
      if (value === '') {
        callback(new Error('يجب ان تكون كلمة المرور متشابهة'));
      } else if (value !== this.user.password) {
        callback(new Error('يجب ان تكون كلمة المرور متشابهة'));
      } else {
        callback();
      }
      //   else if(!regularExpression.text(value)){
      //      callback(new Error('يجب ان تحتوي كلمة المرور علي رموز'));
      //   }
    };
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e7;
        },
      },
      errorFile: false,
      file: null,
      national_image_url: null,
      next: false,
      url: '/bg.jpg',
      logo: '/naqaaelogo.png',
      qualification_status: true,
      specification_status: true,
      photoError: false,
      temp_university_degree_name: false,
      temp_organization_degree_name: false,
      dis_org_degree: true,
      rules: {
        email: [{ required: true, message: 'من فضلك يجب إدخال البريد الإلكتروني', trigger: 'blur' }, { trigger: 'blur' }],
        ar_name: [{ required: true, message: 'من فضلك يجب إدخال الاسم باللغة العربية', trigger: 'blur' }, { trigger: 'blur' }],
        en_name: [{ required: true, message: 'من فضلك يجب إدخال الاسم باللغة الانجليزية ', trigger: 'blur' }, { trigger: 'blur' }],
        mobile: [{ required: true, message: 'من فضلك يجب إدخال رقم الموبايل   ', trigger: 'blur' }, { trigger: 'blur' }],
        apply_to: [{ required: true, message: 'من فضلك يجب إدخال  نوع التسجيل ', trigger: 'change' }],
        // collage_id: [{ required: true, message: 'من فضلك يجب إدخال  الكلية  ', trigger: 'change' }],
        // university_id: [{ required: true, message: 'من فضلك يجب إدخال الجامعه ', trigger: 'change' }],
        education_degree_id: [{ required: true, message: 'من فضلك يجب إدخال الدرجة الوظيفية ', trigger: 'change' }],
        degree_education_level_id: [{ required: true, message: 'من فضلك يجب إدخال الدرجة العلمية ', trigger: 'change' }],
        birthdate: [{ required: true, message: 'من فضلك يجب إدخال  تاريخ الميلاد ', trigger: 'blur' }, { trigger: 'blur' }],
        national_id: [{ required: true, message: 'من فضلك يجب إدخال الرقم القومى', trigger: 'blur' }, { trigger: 'blur' }, { min: 14, max: 14, message: 'يجب ان يتكون الرقم القومي من 14 رقم' }],
        gender: [{ required: true, message: 'من فضلك يجب إدخال النوع', trigger: 'blur' }, { trigger: 'blur' }],
        degree_qualification_id: [{ required: true, message: 'من فضلك يجب إدخال التخصص ', trigger: 'change' }],
        password: [{ validator: validatePass, trigger: 'blur' }, { required: true, message: 'من فضلك يجب إدخال  كلمة المرور', trigger: 'blur' }, { trigger: 'blur' }, { min: 8, message: 'يجب ان تحتوي كلمة المرور علي 8 حروف وارقام (حرف كبير ورمز واحد علي الأقل)' }],
        confirm_password: [{ validator: validateConfirmPass, trigger: 'blur' }],
        experience: [{ required: true, message: ' من فضلك يجب إدخال موجز عن تاريخ عملك', trigger: 'blur' }, { trigger: 'blur' }],
      },
      user: {
        ar_name: null,
        en_name: null,
        mobile: null,
        experience: null,
        national_id: null,
        birthdate: null,
        email: null,
        apply_to: null,
        password: null,
        confirm_password: null,
        degree_specification_id: null,
        education_degree_id: null,
        collage_id: null,
        university_id: null,
        temp_organization_degree_name: null,
        temp_university_degree_name: null,
        university_degree_id: null,
        organization_degree_id: null,
        degree_education_level_id: null,
        degree_qualification_id: null,
        old_email: this.$store.state.user.oldEmail ? this.$store.state.user.oldEmail : null,
      },
      isLoad: false,
      error: false,
    };
  },
  watch: {
    'user.organization_degree_id': function (val) {
      if (val) {
        this.temp_organization_degree_name = false;
        this.user.temp_organization_degree_name = null;
        this.user.temp_university_degree_name = null;
      } else {
        if (!val && !this.temp_university_degree_name) {
          if (!this.user.temp_university_degree_name) {
            let selectedUniversityName = this.$store.getters['university/universities'] ? this.$store.getters['university/universities'].find(university => university.id == this.user.university_degree_id) : null;
            this.user.temp_university_degree_name = selectedUniversityName ? selectedUniversityName.name : null;
          }
        } else if (this.user.university_degree_id != 0 && this.user.organization_degree_id != 0) {
          this.user.temp_university_degree_name = null;
          this.user.temp_organization_degree_name = null;
        }
        if (val === 0) {
          this.temp_organization_degree_name = true;
        }
      }
      val ? this.$refs.collage.blur() : '';
    },
    'user.university_degree_id': function (val, newVal) {
      if (newVal) {
        this.user.organization_degree_id = null;
        this.temp_organization_degree_name = false;
      }
      if (val || val === 0) {
        if (val === 0) {
          this.temp_university_degree_name = true;
          this.$store.commit('organization/SET_ORGANIZATIONS_NAMES_DEGREE', []);
        } else {
          this.$store.dispatch('organization/names', {
            query: {
              parent_id: this.user.university_degree_id,
            },
            degree: true,
          });
          if (this.temp_organization_degree_name) {
            let selectedUniversityName;
            if (this.show_select == 2) {
              selectedUniversityName = this.$store.getters['directorate/directorates'] ? this.$store.getters['directorate/directorates'].find(university => university.id == this.user.university) : null;
            } else {
              selectedUniversityName = this.$store.getters['university/universities'] ? this.$store.getters['university/universities'].find(university => university.id == val) : null;
            }
            this.user.temp_university_degree_name = selectedUniversityName ? selectedUniversityName.name : null;
          } else if (this.user.university_degree_id != 0 && this.user.organization_degree_id != 0) {
            this.user.temp_university_degree_name = null;
            this.user.temp_organization_degree_name = null;
          }
          this.temp_university_degree_name = false;
        }
        this.dis_org_degree = false;
      } else {
        this.dis_org_degree = true;
      }

      val ? this.$refs.university_degree_id.blur() : '';
    },
    'user.password'(value) {
      this.user.password = value.replace(/ +/g, '');
    },
    'user.confirm_password'(value) {
      this.user.confirm_password = value.replace(/ +/g, '');
    },
    'user.mobile'(value) {
      this.user.mobile = value.replace(/[^0-9]/g, '');
      //   this.user.mobile = value.replace(/[^\d]/g, '');
    },
    'user.email'(value) {
      this.user.email = value.replace(/ +/g, '');
    },
    'user.national_id'(value) {
      this.user.national_id = value.replace(/[^0-9]/g, '');
      //   this.user.national_id = value.replace(/[^\d]/g, '');
    },
    // 'user.degree_specification_id': function (val) {
    //   val ? this.$refs.specification.blur() : '';
    // },
    'user.education_degree_id': function (val) {
      val ? this.$refs.degree.blur() : '';
    },
    'user.collage_id': function (val) {
      val ? this.$refs.collage.blur() : '';
    },
    'user.university_id': function (val) {
      val ? this.$refs.university.blur() : '';
    },
    'user.degree_education_level_id': function (val, newVal) {
      if (newVal) {
        this.user.specification_id = null;
        this.user.qualification_id = null;
      }
      if (val) {
        this.qualification_status = false;
        this.$store.dispatch('user/lookup', { level: val });
        this.$refs.level.blur();
      } else {
        this.qualification_status = true;
      }
    },
    'user.degree_qualification_id': function (val) {
      if (val) {
        this.$store.dispatch('user/lookup', { qualification: val, level: this.user.degree_education_level_id });
        this.specification_status = false;
        this.$refs.qualification.blur();
      } else {
        this.specification_status = true;
      }
    },
  },
  mounted() {
    if (!this.$store.state.user.oldEmail && !this.$route.params.type) {
      this.$router.push('/login');
    }
    this.$store.dispatch('user/lookup');
    this.$store.dispatch('university/universities');
  },
  methods: {
    resetUni(type) {
      if (type == 'temp_university_degree_name') {
        this.temp_university_degree_name = false;
        this.user.university_degree_id = null;
      } else if (type == 'temp_organization_degree_name') {
        this.temp_organization_degree_name = false;
        this.user.organization_degree_id = null;
      } else if (type == 'temp_organization_name') {
        this.temp_organization_name = false;
        this.user.organization_id = null;
      } else if (type == 'temp_university_name') {
        this.temp_university_name = false;
        this.user.university = null;
      }
    },
    upload() {
      this.file = this.$refs.file.files[0];
      this.national_image_url = URL.createObjectURL(this.file);
    },
    recovery: function (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.isLoad = true;
          let formData = new FormData();
          for (const [key, value] of Object.entries(this.user)) {
            if ((value || value == 0) && key != 'university_degree_id') {
              formData.append(key, value);
            }
          }
          this.$store
            .dispatch('user/Recovery', { user: formData })
            .then(() => {
              this.$router.push('/recovarymessage');
              this.isLoad = false;
              this.$store.commit('user/SET_OLD_EMAIL', null);
            })
            .catch(() => {
              this.error = true;
              this.isLoad = false;
            });
        } else {
          this.$notify.error({
            message: 'برجاء ادخال البيانات بشكل صحيح',
          });
          return false;
        }
      });
    },
    changePicker() {
      this.$nextTick(() => {
        let picker = document.querySelectorAll('.el-picker-panel .el-date-picker__header .el-date-picker__header-label');
        picker.forEach((element, i) => {
          if (i == 1) {
            element.style.position = 'absolute';
            element.style.top = '15px';
          }
        });
      });
    },
  },
};
</script>

<style lang="scss">
// .left_right input:focus{
//     direction: ltr !important;
//     padding-right: rem !important;
// }
// .custom_toster{
//     top: 70px !important;
// }
.left_input_register {
  top: 10px;
  left: 2px;
  position: absolute;
}
.password {
  .el-form-item__error {
    line-height: 1.2;
  }
}
.left_right {
  .el-form-item__content {
    .el-input {
      input {
        direction: ltr !important;
        padding-left: 2.5rem !important;
      }
      //   .el-input__prefix{
      //       left: unset;
      //       right: 5px;
      //   }
      //   .el-input__suffix{
      //       left: unset;
      //       right: 20px;
      //   }
    }
  }
}
.el-picker-panel .el-picker-panel__content {
  table {
    tbody {
      tr {
        th {
          font-size: 9px;
        }
      }
    }
  }
}
.el-form-item {
  //   margin-bottom: 10px;
}
form .el-alert .el-alert__content .el-alert__closebtn {
  right: unset;
  left: 15px;
}
.signup .el-select .el-input__suffix {
  right: unset;
  left: 15px;
}
.signup .el-radio-button {
  margin-bottom: 0 !important;
}
.signup.mainBox {
  .el-input--prefix .el-input__inner {
    padding-left: 40px;
  }
  height: 130vh !important;
}
.signup .contBox {
  height: 100% !important;
}
.hideInput {
  width: 0 !important;
  padding: 0 !important;
  border: 0 !important;
}
.contBox {
  position: relative;
  width: 50%;
  height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
  .formBox {
    text-align: right;
    width: 50%;
    input {
      padding-right: 1.8rem;
    }
    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus,
    textarea:-webkit-autofill,
    textarea:-webkit-autofill:hover,
    textarea:-webkit-autofill:focus,
    select:-webkit-autofill,
    select:-webkit-autofill:hover,
    select:-webkit-autofill:focus {
      border: 1px solid #777;
      -webkit-text-fill-color: #777;
      -webkit-box-shadow: 0 0 0px 1000px #fff inset;
      transition: background-color 5000s ease-in-out 0s;
    }
  }
}
@media only screen and (max-width: 991px) {
  .signup .contBox {
    height: 150vh !important;
  }
  .signup.mainBox {
    height: 200vh !important;
  }
}
@media only screen and (max-width: 820px) {
  .signup .contBox {
    width: 100% !important;
  }
  .signup .contBox {
    top: 10.5rem !important;
  }
}
@media only screen and (max-width: 720px) {
  .contBox {
    position: absolute;
    width: 100%;
    height: 150vh;
    top: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
    .formBox {
      text-align: right;
      width: 80%;
      .upload-btn-wrapper input {
        opacity: 0 !important;
      }
      input {
        opacity: 0.8;
      }
    }
  }
}
</style>
