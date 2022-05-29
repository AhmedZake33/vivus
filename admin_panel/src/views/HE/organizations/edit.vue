<template>
  <CRow v-if="hasPermission('edit_organizations')" class="edit_organization">
    <CCol sm="12" v-if="lookups">
      <CCard :class="isLoad ? 'disabledAll' : ''">
        <CCardHeader>
          <div :class="$i18n.locale === 'ar' ? 'card-header-actions' : ''" style="display: inline-block">
            <CIcon name="cil-people" color="bg-primary"></CIcon>
            {{ $t('Global.organization') }}
          </div>
        </CCardHeader>
        <CCardBody v-loading="$store.getters['organization/organizationLoad']" dir="rtl" style="text-align: initial">
          <el-form label-position="top" :model="ruleForm" status-icon size="large" ref="ruleForm" label-width="120px" class="demo-ruleForm">
            <CRow>
              <CCol sm="6">
                <el-form-item class="little_right" :rules="validation(null, 1)" prop="parent_id" :label="$t('Global.selectUniversity')">
                  <el-select filterable clearable :no-data-text="$t('Global.nodata')" style="width: 100%" v-model="ruleForm.parent_id" :placeholder="$t('Global.selectUniversity')">
                    <el-option v-for="item in $store.getters['university/universities']" :label="item.name" :value="item.id">
                      <span style="float: right; color: #8492a6; font-size: 13px">
                        {{ item.name }}
                      </span>
                    </el-option>
                    <!-- <el-option v-if="$store.getters['submission/selectedUniversity']" :key="$store.getters['submission/selectedUniversity'].id" :label="$store.getters['submission/selectedUniversity'].name" :value="$store.getters['submission/selectedUniversity'].id">
                                          <span style="float: right; color: #8492a6; font-size: 13px">
                                            {{ $store.getters['submission/selectedUniversity'].name }}
                                          </span>
                                        </el-option> -->
                    <template #empty>
                      <div class="text-center" style="padding: 10px; font-weight: bold">
                        {{ $t('Global.nodata') }}
                      </div>
                    </template>
                  </el-select>
                </el-form-item>
                <div class="left_input" style="left: 38px" @click="openDialog()"><i class="el-icon-circle-plus" style="font-size: 17px"></i></div>
                <div class="left_input custom_edit_icon" v-if="canEdit" @click="openDialog(1)"><i class="el-icon-edit text-white" style="margin-right: 2px; font-size: 11px; vertical-align: text-top"></i></div>
              </CCol>
              <CCol sm="6">
                <el-form-item :rules="validation(null, 0)" prop="name" :label="$t('Global.organization_name')">
                  <el-input clearable v-model="ruleForm.name" :placeholder="$t('Global.organization_name')"></el-input>
                </el-form-item>
              </CCol>
              <el-divider class="mb-4 mt-2 custom_font_size" content-position="center"><i class="el-icon-data-analysis"></i> {{ $t('Global.organization_contact_data') }} </el-divider>
              <CCol sm="4">
                <el-form-item :rules="!isAuth($store.getters['submission/representative']) ? null : validation(null, 1)" :label="$t('Global.edu_type')" prop="education_type">
                  <el-select :no-data-text="$t('Global.nodata')" style="width: 100%" v-model="ruleForm.education_type" :placeholder="$t('Global.edu_type')">
                    <el-option v-for="item in lookups.educationTypes" :key="item.id" :label="item.name" :value="item.id">
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
              </CCol>
              <CCol sm="4">
                <el-form-item :rules="!isAuth($store.getters['submission/representative']) ? null : validation(null, 1)" :label="$t('Global.university_type')" prop="governmental">
                  <el-select clearable ref="governmental" :no-data-text="$t('Global.nodata')" :placeholder="$t('Global.governmental')" style="width: 100%" v-model="ruleForm.governmental">
                    <el-option :label="$t('Global.governmental')" :value="1">
                      <span style="float: right; color: #8492a6; font-size: 13px">
                        {{ $t('Global.governmental') }}
                        <i class="el-icon-office-building"></i>
                      </span>
                    </el-option>
                    <el-option :label="$t('Global.especially')" :value="2">
                      <span style="float: right; color: #8492a6; font-size: 13px">
                        {{ $t('Global.especially') }}
                        <i class="el-icon-office-building"></i>
                      </span>
                    </el-option>
                    <el-option :label="$t('Global.local')" :value="3">
                      <span style="float: right; color: #8492a6; font-size: 13px">
                        {{ $t('Global.local') }}
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
              </CCol>
              <CCol sm="4">
                <el-form-item class="leftToRight left_right" :rules="!isAuth($store.getters['submission/representative']) ? null : validation(null, 0)" prop="email" :label="$t('user.email')">
                  <el-input name="email" id="email" clearable suffix-icon="el-icon-message" v-model="ruleForm.email" :placeholder="$t('user.email')"></el-input>
                </el-form-item>
              </CCol>
              <CCol sm="4">
                <el-form-item prop="address" :label="$t('Global.address')">
                  <el-input clearable suffix-icon="el-icon-address" :placeholder="$t('Global.address')" v-model="ruleForm.address"></el-input>
                </el-form-item>
              </CCol>
              <CCol sm="4">
                <el-form-item :label="ruleForm.education_type == 2 ? $t('Global.azhar_area') : $t('Global.government')" prop="type_id">
                  <el-select :no-data-text="$t('Global.nodata')" style="width: 100%" v-model="ruleForm.government_id" :placeholder="ruleForm.education_type == 2 ? $t('Global.azhar_area') : $t('Global.government')">
                    <el-option v-for="item in lookups.governments" :key="item.id" :label="item.name" :value="item.id">
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
              </CCol>
              <CCol sm="4">
                <el-form-item :label="$t('Global.city')" prop="city_id">
                  <el-select :no-data-text="$t('Global.nodata')" style="width: 100%" v-model="ruleForm.city_id" :placeholder="$t('Global.city')">
                    <el-option v-for="item in lookups.cities" :key="item.id" :label="item.name" :value="item.id">
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
              </CCol>
              <CCol sm="4">
                <el-form-item class="leftToRight left_right" prop="website" :label="$t('Global.website')">
                  <el-input clearable suffix-icon="el-icon-website" :placeholder="$t('Global.website')" v-model="ruleForm.website"></el-input>
                </el-form-item>
              </CCol>
              <CCol sm="4">
                <el-form-item :rules="!isAuth($store.getters['submission/representative']) ? null : validation(null, 1)" :label="$t('Global.org_type')" prop="type_id">
                  <el-select :no-data-text="$t('Global.nodata')" style="width: 100%" v-model="ruleForm.type_id" :placeholder="$t('Global.org_type')">
                    <el-option v-for="item in getType" :key="item.id" :label="item.name" :value="item.id">
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
              </CCol>

              <CCol sm="4">
                <el-form-item :rules="!isAuth($store.getters['submission/representative']) ? null : validation(null, 0)" :label="$t('Global.license_date')" prop="license_date">
                  <el-date-picker :picker-options="pickerOptions" clearable style="width: 100%" value-format="yyyy-MM-d" v-model="ruleForm.license_date" type="date" :placeholder="$t('Global.license_date')"></el-date-picker>
                </el-form-item>
              </CCol>
              <CCol sm="4">
                <el-form-item :rules="!isAuth($store.getters['submission/representative']) ? null : validation(null, 0)" :label="$t('Global.start_date')" prop="start_date">
                  <el-date-picker clearable style="width: 100%" value-format="yyyy-MM-d" v-model="ruleForm.start_date" type="date" :placeholder="$t('Global.start_date')"></el-date-picker>
                </el-form-item>
              </CCol>
              <CCol sm="4">
                <el-form-item class="leftToRight left_right" :rules="!isAuth($store.getters['submission/representative']) ? null : validation(null, 0)" prop="license_number" :label="$t('Global.license_number')">
                  <el-input clearable suffix-icon="el-icon-license_number" :placeholder="$t('Global.license_number')" v-model="ruleForm.license_number"></el-input>
                </el-form-item>
              </CCol>

              <!-- <CCol sm="4">
                              <el-form-item class="leftToRight left_right" :rules="validation(null, 0)" prop="student_count" :label="$t('Global.students_count')">
                                <el-input clearable suffix-icon="el-icon-license_number" :placeholder="$t('Global.students_count')" v-model="ruleForm.student_count"></el-input>
                              </el-form-item>
                            </CCol> -->
              <CCol sm="4">
                <el-form-item class="leftToRight left_right" prop="program_count" :label="$t('Global.program_count')">
                  <el-input clearable suffix-icon="el-icon-license_number" :placeholder="$t('Global.program_count')" v-model="ruleForm.program_count"></el-input>
                </el-form-item>
              </CCol>
              <CCol sm="4">
                <el-form-item class="leftToRight left_right" prop="graduation_count" :label="$t('Global.graduation_count')">
                  <el-input clearable suffix-icon="el-icon-license_number" :placeholder="$t('Global.graduation_count')" v-model="ruleForm.graduation_count"></el-input>
                </el-form-item>
              </CCol>

              <CCol sm="4">
                <el-form-item class="leftToRight left_right" :rules="!isAuth($store.getters['submission/representative']) ? null : validation(null, 0)" prop="phone" :label="$t('user.mobile')">
                  <el-input clearable suffix-icon="el-icon-mobile" :placeholder="$t('user.mobile')" v-model="ruleForm.phone"></el-input>
                </el-form-item>
              </CCol>
              <CCol sm="4">
                <el-form-item class="leftToRight left_right" :rules="!isAuth($store.getters['submission/representative']) ? null : validation(null, 0)" prop="fax" :label="$t('Global.fax')">
                  <el-input clearable suffix-icon="el-icon-fax" :placeholder="$t('Global.fax')" v-model="ruleForm.fax"></el-input>
                </el-form-item>
              </CCol>
              <CCol sm="4">
                <el-form-item class="leftToRight left_right" prop="alt_phone" :label="$t('user.alt_mobile')">
                  <el-input clearable suffix-icon="el-icon-mobile" :placeholder="$t('user.alt_mobile')" v-model="ruleForm.alt_phone"></el-input>
                </el-form-item>
              </CCol>
              <CCol sm="4">
                <el-form-item :rules="!isAuth($store.getters['submission/representative']) ? null : validation(null, 1)" :label="$t('Global.sector')" prop="sector">
                  <el-select clearable ref="sector" :no-data-text="$t('Global.nodata')" :placeholder="$t('Global.sector')" style="width: 100%" v-model="ruleForm.sector">
                    <el-option v-for="item in lookups.sectors" :key="item.id" :label="item.name" :value="item.id">
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
              </CCol>
              <CCol sm="4" v-if="hasPermission('admin_organizations')">
                <el-form-item :rules="!isAuth($store.getters['submission/representative']) ? null : validation(null, 1)" :label="$t('Global.representative')" prop="representative_id">
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
                    <el-option :key="$store.getters['organization/representative'].id" :label="$store.getters['organization/representative'].ar_name" :value="$store.getters['organization/representative'].id">
                      <span style="float: right; color: #8492a6; font-size: 13px">
                        {{ $store.getters['organization/representative'].ar_name }}
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
            </CRow>
          </el-form>
        </CCardBody>
        <template v-if="$store.state.user.allowHr || hasPermission('admin_system')">
          <CCardFooter>
            <div class="baseButton resetButton" style="justify-content: flex-start">
              <button class="mx-1 el-button el-button--default is-round sec_color" @click="save('ruleForm')" type="reset" style="padding: 0.6rem 1rem">
                <i class="el-icon-check-circle"></i>
                <CSpinner v-if="isLoad" color="default" size="sm" />
                {{ $t('Global.submit') }}
              </button>
              <button v-if="!isLoad" @click="resetForm('ruleForm')" class="el-button--small el-button el-button--default is-round base_color" type="reset" style="padding: 0.6rem 1rem">
                <i class="el-icon-refresh"></i>
                {{ $t('archive.reset') }}
              </button>
            </div>
          </CCardFooter>
        </template>
      </CCard>
    </CCol>

    <el-dialog :title="$t('Global.addInfo')" :visible.sync="organizationDialog" width="50%">
      <el-form :model="editForm" label-position="top" status-icon size="large" ref="editForm" :rules="editRules" label-width="120px" class="demo-ruleForm">
        <el-form-item prop="university" :label="$t('Global.selectUniversity')">
          <el-input clearable :placeholder="$t('Global.selectUniversity')" v-model="editForm.university">
            <i slot="suffix" class="el-input__icon el-icon-office-building"></i>
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" :class="isLoad ? 'disabledAll' : ''">
        <el-button type="primary" @click="saveUniversity('editForm')">{{ $t('Global.save') }}</el-button>
        <el-button @click="organizationDialog = false" style="margin: 10px">{{ $t('Global.cancel') }}</el-button>
      </span>
    </el-dialog>
  </CRow>
</template>

<script>
export default {
  name: 'organizationEdit',
  data() {
    return {
      isLoad: false,
      organizationDialog: false,
      canEdit: true,
      editMode: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e7;
        },
      },
      editForm: {
        university: null,
      },
      ruleForm: {
        website: '',
        name: null,
        parent_id: null,
        type_id: null,
        start_date: '',
        license_date: '',
        student_count: 0,
        program_count: 0,
        graduation_count: 0,
        governmental: null,
        sector: null,
        city_id: null,
        government_id: null,
        education_type: null,
        license_number: '',
        address: '',
        phone: '',
        email: '',
        representative_id: null,
        fax: '',
        alt_phone: null,
      },
      editRules: {
        university: [{ required: true, message: 'من فضلك يجب كتابة اسم الجامعه', trigger: 'blur' }],
      },
      // rules: {
      //   parent_id: [{ required: true, message: 'من فضلك يجب اختيار جامعة', trigger: 'blur' }],
      //   name: [{ required: true, message: 'من فضلك يجب كتابة اسم الكلية', trigger: 'blur' }],
      //   email: [{ required: true, message: 'من فضلك يجب كتابة البريد الالكتروني', trigger: 'blur' }],
      //   address: [{ required: true, message: 'من فضلك يجب كتابة  العنوان', trigger: 'blur' }],
      //   type_id: [{ required: true, message: 'من فضلك يجب اختيار نوع المؤسسه', trigger: 'change' }],
      //   education_type: [{ required: true, message: 'من فضلك يجب اختيار نوع التعليم', trigger: 'change' }],
      //   license_date: [{ required: true, message: 'من فضلك يجب اختيار تاريخ الترخيص', trigger: 'change' }],
      //   start_date: [{ required: true, message: 'من فضلك يجب اختيار تاريخ البداية', trigger: 'change' }],
      //   representative_id: [{ required: true, message: 'من فضلك يجب اختيار المنسق', trigger: 'change' }],
      //   governmental: [{ required: true, message: 'من فضلك يجب اختيار نوع المؤسسة', trigger: 'change' }],
      //   sector: [{ required: true, message: 'من فضلك يجب اختيار القطاع', trigger: 'change' }],
      // },
    };
  },

  mounted() {
    this.init();
    this.$store.dispatch('university/universities');
    this.usersRoles();
  },
  watch: {
    'ruleForm.email'(value) {
      this.ruleForm.email = value.replace(/ +/g, '');
    },
    'ruleForm.parent_id'(value) {
      if (value) {
        this.canEdit = true;
      } else {
        this.canEdit = false;
      }
    },
    'ruleForm.phone'(value) {
      this.ruleForm.phone = value.replace(/[^0-9]/g, '');
    },
    'ruleForm.alt_phone'(value) {
      this.ruleForm.alt_phone = value.replace(/[^0-9]/g, '');
    },
    'ruleForm.graduation_count'(value) {
      if (!value) return;
      this.ruleForm.graduation_count = value.toString().replace(/[^0-9]/g, '');
    },
    'ruleForm.program_count'(value) {
      if (!value) return;
      this.ruleForm.program_count = value.toString().replace(/[^0-9]/g, '');
    },
    'ruleForm.student_count'(value) {
      if (!value) return;
      this.ruleForm.student_count = value.toString().replace(/[^0-9]/g, '');
    },
    'ruleForm.fax'(value) {
      this.ruleForm.fax = value.replace(/[^0-9]/g, '');
    },
  },
  computed: {
    lookups: function () {
      return this.$store.getters['organization/lookup'];
    },
    getType: function () {
      if (this.ruleForm.education_type == 2) {
        return this.lookups.types;
      } else {
        return this.lookups.types;
      }
    },
  },
  methods: {
    usersRoles(search = '', limit = 70) {
      this.$store.dispatch('archive/usersRoles', { query: { search_text: search, limit: limit } });
    },
    reset() {
      this.$refs.all.blur();
    },

    openDialog(type = 2) {
      if (type == 1) {
        this.editMode = true;
        let universityName = this.$store.getters['university/universities'] ? this.$store.getters['university/universities'].find(uni => uni.id == this.ruleForm.parent_id) : null;
        this.editForm.university = universityName?.name;
      } else {
        this.editMode = false;
        this.editForm.university = null;
      }
      this.organizationDialog = true;
    },
    search(query) {
      this.usersRoles(query);
    },
    init() {
      this.$store
        .dispatch('organization/organization', {
          id: this.$route.params.id ? this.$route.params.id : null,
          query: {
            system: 1,
          },
        })
        .then(() => {
          if (this.$route.params.id) {
            this.ruleForm = this.$store.state.organization.organization;
          }
        });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    save(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.isLoad = true;
          let query = {
            website: this.ruleForm.website,
            name: this.ruleForm.name,
            parent_id: this.ruleForm.parent_id,
            type_id: this.ruleForm.type_id,
            student_count: this.ruleForm.student_count,
            program_count: this.ruleForm.program_count,
            graduation_count: this.ruleForm.graduation_count,
            start_date: this.ruleForm.start_date,
            license_date: this.ruleForm.license_date,
            governmental: this.ruleForm.governmental,
            sector: this.ruleForm.sector,
            education_type: this.ruleForm.education_type,
            city_id: this.ruleForm.city_id,
            government_id: this.ruleForm.government_id,
            license_number: this.ruleForm.license_number,
            address: this.ruleForm.address,
            phone: this.ruleForm.phone,
            email: this.ruleForm.email,
            representative_id: this.ruleForm.representative_id,
            fax: this.ruleForm.fax,
            alt_phone: this.ruleForm.alt_phone,
          };
          this.$store
            .dispatch('organization/save', {
              query: query,
              id: this.$route.params.id ? this.$route.params.id : null,
            })
            .then(() => {
              this.isLoad = false;
            })
            .catch(_ => {
              this.isLoad = false;
            });
        } else {
          this.$notify.error({
            message: `${this.$t('Global.completeFields')}`,
          });
        }
      });
    },
    saveUniversity(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let query = { name: this.editForm.university };
          this.isLoad = true;
          this.$store
            .dispatch('submission/saveOrganization', {
              query: query,
              id: this.editMode ? this.ruleForm.parent_id : null,
            })
            .then(() => {
              this.ruleForm.parent_id = this.$store.getters['submission/selectedUniversity'] ? this.$store.getters['submission/selectedUniversity'].id : null;
              this.$store.dispatch('university/universities').then(_ => {
                this.isLoad = false;
                this.organizationDialog = false;
                this.$notify({ type: 'success', message: this.$t('Global.successMessage') });
              });
            });
        }
      });
    },
  },
};
</script>

<style lang="scss">
.custom_edit_icon {
  left: 20px !important;
  top: 52px !important;
  background: #3c4b64;
  border-radius: 50%;
  width: 15px;
  height: 15px;
}

.little_right .el-select .el-input .el-input__suffix {
  left: 40px !important;
}

.edit_organization .el-select .el-input .el-input__suffix {
  right: unset;
  left: 30px;
}

.edit_organization .el-date-editor.el-input .el-input__suffix {
  right: unset;
  left: 25px;
}

.edit_organization .el-input .el-input__suffix {
  right: unset;
  left: 15px;
}
</style>
