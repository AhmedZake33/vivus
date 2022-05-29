<template>
  <CRow v-if="hasPermission('edit_organizations')" class="edit_organization">
    <CCol sm="12" v-if="lookups">
      <CCard>
        <CCardHeader>
          <div :class="$i18n.locale === 'ar' ? 'card-header-actions' : ''" style="display: inline-block">
            <CIcon name="cil-people" color="bg-primary"></CIcon>
            {{ $t('Global.organization') }}
          </div>
        </CCardHeader>
        <CCardBody v-loading="$store.getters['organization/organizationLoad']" dir="rtl" style="text-align: initial">
          <el-form label-position="top" :rules="rules" :model="ruleForm" status-icon size="large" ref="ruleForm" label-width="120px" class="demo-ruleForm">
            <CRow>
              <CCol sm="4">
                <el-form-item :rules="validation(null, 1)" :label="$t('Global.edu_type')" prop="education_type">
                  <el-select clearable :no-data-text="$t('Global.nodata')" style="width: 100%" v-model="ruleForm.education_type" :placeholder="$t('Global.edu_type')">
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
                <el-form-item :rules="validation(null, 1)" prop="directorate_id" :label="$t('Global.directorate')">
                  <el-select clearable filterable :no-data-text="$t('Global.nodata')" style="width: 100%" v-model="ruleForm.directorate_id" :placeholder="$t('Global.directorate')">
                    <el-option v-for="item in $store.getters['directorate/directorates']" :key="item.id" :label="item.name" :value="item.id">
                      <span style="float: right; color: #8492a6; font-size: 13px">
                        {{ item.name }}
                      </span>
                    </el-option>
                    <!-- <el-option v-if="$store.getters['submission/selectedOrganization']" :key="$store.getters['submission/selectedOrganization'].id" :label="$store.getters['submission/selectedOrganization'].name" :value="$store.getters['submission/selectedOrganization'].id">
                      <span style="float: right; color: #8492a6; font-size: 13px">
                        {{ $store.getters['submission/selectedOrganization'].name }}
                      </span>
                    </el-option> -->
                    <template #empty>
                      <div class="text-center" style="padding: 10px; font-weight: bold">
                        {{ $t('Global.nodata') }}
                      </div>
                    </template>
                  </el-select>
                </el-form-item>
                <div class="left_input" v-if="hasPermission('admin_submissions')" @click="openDialog('directorate')"><i class="el-icon-circle-plus" style="font-size: 22px; left: 38px"></i></div>
                <!-- <div class="left_input custom_edit_icon" v-if="canEdit" @click="openDialog('edit')"><i class="el-icon-edit text-white" style="font-size: 22px"></i></div> -->
              </CCol>
              <CCol sm="4">
                <el-form-item :rules="validation(null, 1)" prop="education_institute_id" :label="$t('Global.administration')">
                  <el-select :disabled="disabled" clearable filterable :no-data-text="$t('Global.nodata')" style="width: 100%" v-model="ruleForm.education_institute_id" :placeholder="$t('Global.administration')">
                    <el-option v-for="item in $store.getters['directorate/institutes']" :key="item.id" :label="item.name" :value="item.id">
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
                <div class="left_input" v-if="!disabled && hasPermission('admin_submissions')" @click="openDialog('administration')"><i class="el-icon-circle-plus" style="font-size: 22px"></i></div>
              </CCol>
              <CCol sm="4">
                <el-form-item prop="name" :rules="validation(null, 0)" :label="$t('Global.name')">
                  <el-input clearable v-model="ruleForm.name"></el-input>
                </el-form-item>
              </CCol>
              <CCol sm="4">
                <el-form-item :rules="validation(null, 1)" prop="type_id" :label="$t('Global.SCgender')">
                  <el-select clearable :no-data-text="$t('Global.nodata')" style="width: 100%" v-model="ruleForm.type_id" :placeholder="$t('Global.SCgender')">
                    <el-option v-for="item in lookups.types" :key="item.id" :label="item.name" :value="item.id">
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
              </CCol>
              <!-- <CCol sm="4">
                <el-form-item :label="$t('Global.government')" prop="type_id">
                  <el-select :no-data-text="$t('Global.nodata')" style="width: 100%" v-model="ruleForm.government_id" :placeholder="$t('Global.government')">
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
              </CCol> -->
              <CCol sm="4">
                <el-form-item :label="$t('Global.city')" prop="city_id">
                  <el-select filterable :no-data-text="$t('Global.nodata')" style="width: 100%" v-model="ruleForm.city_id" :placeholder="$t('Global.city')">
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
                <el-form-item :rules="validation(null, 1)" prop="stage_type_id" :label="$t('Global.stage')">
                  <el-select clearable :no-data-text="$t('Global.nodata')" style="width: 100%" v-model="ruleForm.stage_type_id" :placeholder="$t('Global.stage')">
                    <el-option v-for="item in lookups.stages" :key="item.id" :label="item.name" :value="item.id">
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
              </CCol>
              <CCol sm="4">
                <el-form-item :rules="validation(null, 1)" prop="school_gender_id" :label="$t('Global.school_gender_id')">
                  <el-select clearable :no-data-text="$t('Global.nodata')" style="width: 100%" v-model="ruleForm.school_gender_id" :placeholder="$t('Global.school_gender_id')">
                    <el-option v-for="item in lookups.school_genders" :key="item.id" :label="item.name" :value="item.id">
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
              </CCol>
              <CCol sm="4">
                <el-form-item :rules="validation(null, 1)" :label="$t('Global.school_day_type')" prop="school_day_type">
                  <el-select clearable :no-data-text="$t('Global.nodata')" style="width: 100%" v-model="ruleForm.school_day_type" :placeholder="$t('Global.school_day_type')">
                    <el-option v-for="item in lookups.day_types" :key="item.id" :label="item.name" :value="item.id">
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
                <el-form-item :rules="!isAuth($store.getters['organization/representative']) ? null : validation(null, 0)" prop="school_code" :label="$t('Global.school_code')">
                  <el-input clearable suffix-icon="el-icon-code" v-model="ruleForm.school_code"></el-input>
                </el-form-item>
              </CCol>
              <CCol sm="4">
                <el-form-item :rules="!isAuth($store.getters['organization/representative']) ? null : validation(null, 0)" prop="school_building_number" :label="$t('Global.school_building_number')">
                  <el-input clearable suffix-icon="el-icon-code" v-model="ruleForm.school_building_number"></el-input>
                </el-form-item>
              </CCol>
              <CCol sm="4">
                <el-form-item :rules="!isAuth($store.getters['organization/representative']) ? null : validation(null, 0)" prop="address" :label="$t('Global.address')">
                  <el-input clearable suffix-icon="el-icon-address" v-model="ruleForm.address"></el-input>
                </el-form-item>
              </CCol>

              <CCol sm="4">
                <el-form-item class="leftToRight left_right" :rules="!isAuth($store.getters['organization/representative']) ? null : validation(null, 0)" prop="website" :label="$t('Global.website')">
                  <el-input :placeholder="$t('Global.website')" clearable suffix-icon="el-icon-website" v-model="ruleForm.website"></el-input>
                </el-form-item>
              </CCol>
              <CCol sm="4">
                <el-form-item class="leftToRight left_right" :rules="!isAuth($store.getters['organization/representative']) ? null : validation($t('Validation.email'), 'email')" prop="email" :label="$t('user.email')">
                  <el-input name="email" id="email" clearable suffix-icon="el-icon-message" v-model="ruleForm.email" :placeholder="$t('user.email')"></el-input>
                </el-form-item>
              </CCol>
              <CCol sm="4">
                <el-form-item :rules="!isAuth($store.getters['organization/representative']) ? null : validation(null, 0)" :label="$t('Global.start_date')" prop="start_date">
                  <el-date-picker clearable style="width: 100%" value-format="yyyy-MM-d" v-model="ruleForm.start_date" type="date" :placeholder="$t('Global.start_date')"></el-date-picker>
                </el-form-item>
              </CCol>
              <CCol sm="4">
                <el-form-item :rules="!isAuth($store.getters['organization/representative']) ? null : validation(null, 0)" :label="$t('Global.license_date')" prop="established_date">
                  <el-date-picker :picker-options="pickerOptions" clearable style="width: 100%" value-format="yyyy-MM-d" v-model="ruleForm.established_date" type="date" :placeholder="$t('Global.license_date')"></el-date-picker>
                </el-form-item>
              </CCol>
              <CCol sm="4">
                <el-form-item :rules="!isAuth($store.getters['organization/representative']) ? null : validation(null, 0)" :label="$t('Global.date_in')" prop="date_in">
                  <el-date-picker clearable style="width: 100%" value-format="yyyy-MM-d" v-model="ruleForm.date_in" type="date" :placeholder="$t('Global.date_in')"></el-date-picker>
                </el-form-item>
              </CCol>

              <CCol sm="4">
                <el-form-item :rules="!isAuth($store.getters['organization/representative']) ? null : validation(null, 0)" prop="phone" :label="$t('user.mobile')">
                  <el-input clearable suffix-icon="el-icon-phone" v-model="ruleForm.phone"></el-input>
                </el-form-item>
              </CCol>
              <CCol sm="4">
                <el-form-item :rules="!isAuth($store.getters['organization/representative']) ? null : validation(null, 0)" prop="fax" :label="$t('Global.fax')">
                  <el-input clearable suffix-icon="el-icon-fax" v-model="ruleForm.fax"></el-input>
                </el-form-item>
              </CCol>
              <CCol sm="4">
                <el-form-item prop="alt_phone" :label="$t('user.alt_mobile')">
                  <el-input clearable suffix-icon="el-icon-phone" v-model="ruleForm.alt_phone"></el-input>
                </el-form-item>
              </CCol>
              <template v-if="!$route.params.removed">
                <CCol sm="4" v-if="!isAuth($store.getters['organization/representative'])">
                  <el-form-item :rules="!isAuth($store.getters['organization/representative']) ? null : validation(null, 1)" :label="$t('Global.representative')" prop="representative_id">
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
              </template>
            </CRow>
          </el-form>
        </CCardBody>
        <CCardFooter :class="isLoad ? 'disabledAll' : ''">
          <div class="baseButton resetButton" style="justify-content: flex-start">
            <button class="mx-1 el-button el-button--default is-round sec_color" @click="save('ruleForm')" type="reset" style="padding: 0.6rem 1rem">
              <i class="el-icon-check-circle"></i>
              <CSpinner v-if="isLoad" color="default" size="sm" />
              {{ isLoad ? '' : $t('Global.submit') }}
            </button>
            <button @click="resetForm('ruleForm')" class="el-button--small el-button el-button--default is-round base_color" type="reset" style="padding: 0.6rem 1rem">
              <i class="el-icon-refresh"></i>
              {{ $t('archive.reset') }}
            </button>
          </div>
        </CCardFooter>
      </CCard>
    </CCol>

    <el-dialog :title="$t('Global.addInfo')" :visible.sync="organizationDialog" width="50%">
      <el-form :model="editForm" label-position="top" status-icon size="large" ref="editForm" :rules="editRules" label-width="120px" class="demo-ruleForm">
        <el-form-item v-if="type == 'administration'" class="m-0" :rules="validation(null, 1)" prop="administration" :label="$t('Global.administration')">
          <el-input clearable :placeholder="$t('Global.administration')" v-model="editForm.administration">
            <i slot="suffix" class="el-input__icon el-icon-office-building"></i>
          </el-input>
        </el-form-item>
        <el-form-item v-else class="m-0" :rules="validation(null, 1)" prop="administration" :label="$t('Global.directorate')">
          <el-input clearable :placeholder="$t('Global.directorate')" v-model="editForm.administration">
            <i slot="suffix" class="el-input__icon el-icon-office-building"></i>
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
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
      disabled: true,
      inchangeLang: true,
      type: '',
      organizationDialog: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e7;
        },
      },
      editForm: {
        administration: null,
      },
      ruleForm: {
        website: null,
        name: null,
        type_id: null,
        established_date: null,
        date_in: null,
        school_gender_id: null,
        organization_type_id: null,
        education_type: null,
        stage_type_id: null,
        address: null,
        school_building_number: null,
        school_code: null,
        education_institute_id: null,
        email: null,
        city_id: null,
        government_id: null,
        school_day_type: null,
        directorate_id: null,
        representative_id: null,
        fax: null,
        alt_phone: null,
      },
      editRules: {
        university: [{ required: true, message: 'من فضلك يجب كتابة اسم الجامعه', trigger: 'blur' }],
      },
      rules: {
        directorate: [{ required: true, message: `${this.$t('Global.selectFiled')}`, trigger: 'blur' }],
      },
    };
  },

  computed: {
    lookups: function () {
      return this.$store.getters['organization/lookup'];
    },
  },
  mounted() {
    this.init();
    this.usersRoles();
  },
  watch: {
    '$i18n.locale'(val) {
      this.inchangeLang = false;
      setTimeout(() => {
        this.inchangeLang = true;
      }, 3000);
    },
    'ruleForm.directorate_id': function (val, newVal) {
      if (newVal) {
        this.ruleForm.education_institute_id = null;
      }
      if (val) {
        this.$store
          .dispatch('directorate/institutes', {
            parent_id: this.ruleForm.directorate_id,
          })
          .then(_ => {
            this.disabled = false;
          });
      } else {
        this.disabled = true;
      }
    },
    'ruleForm.email'(value) {
      this.ruleForm.email = value.replace(/ +/g, '');
    },
    'ruleForm.phone'(value) {
      this.ruleForm.phone = value.replace(/[^0-9]/g, '');
    },
    'ruleForm.fax'(value) {
      this.ruleForm.fax = value.replace(/[^0-9]/g, '');
    },
  },
  methods: {
    usersRoles(search = '', limit = 10) {
      this.$store.dispatch('archive/usersRoles', { query: { search_text: search, limit: limit } });
    },
    reset() {
      this.$refs.all.blur();
    },

    openDialog(type) {
      this.type = type;
      this.organizationDialog = true;
    },
    search(query) {
      this.usersRoles(query);
    },
    init() {
      let query = {
        system: 2,
      };
      this.$store.dispatch('organization/organization', { id: this.$route.params.id ? this.$route.params.id : null, query }).then(() => {
        this.$store.dispatch('directorate/directorates');
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
            type_id: this.ruleForm.type_id,
            start_date: this.ruleForm.start_date,
            license_date: this.ruleForm.license_date,
            school_gender_id: this.ruleForm.school_gender_id,
            school_day_type: this.ruleForm.school_day_type,
            education_type: this.ruleForm.education_type,
            license_number: this.ruleForm.license_number,
            school_building_number: this.ruleForm.school_building_number,
            school_code: this.ruleForm.school_code,
            address: this.ruleForm.address,
            stage_type_id: this.ruleForm.stage_type_id,
            city_id: this.ruleForm.city_id,
            government_id: this.ruleForm.government_id,
            phone: this.ruleForm.phone,
            email: this.ruleForm.email,
            education_institute_id: this.ruleForm.education_institute_id,
            representative_id: this.ruleForm.representative_id,
            fax: this.ruleForm.fax,
            alt_phone: this.ruleForm.alt_phone,
            established_date: this.ruleForm.established_date,
            date_in: this.ruleForm.date_in,
            system: 2,
          };
          if (this.$route.params.removed) {
            let obj = { removed: 2 };
            query = { ...query, ...obj };
          }
          this.$store
            .dispatch('organization/save', {
              query: query,
              id: this.$route.params.id ? this.$route.params.id : null,
            })
            .then(() => {
              this.isLoad = false;
              this.$router.go(-1);
            });
        }
      });
    },
    saveUniversity(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let query = {};
          if (this.type == 'administration') {
            query = { name: this.editForm.administration, parent_id: this.ruleForm.directorate_id };
          } else {
            query = { name: this.editForm.administration };
          }
          this.$store.dispatch('submission/saveAdministration', { query: query, id: null }).then(() => {
            // this.ruleForm.directorate_id = this.$store.getters['submission/selectedOrganization'] ? this.$store.getters['submission/selectedOrganization'].id : null;
            this.init();
            if (this.ruleForm.directorate_id) {
              this.$store
                .dispatch('directorate/institutes', {
                  parent_id: this.ruleForm.directorate_id,
                })
                .then(_ => {
                  this.disabled = false;
                });
            }
            this.organizationDialog = false;
            this.editForm.administration = null;
            this.$notify({ type: 'success', message: this.$t('Global.successMessage') });
          });
        }
      });
    },
  },
};
</script>

<style lang="scss">
.ar .edit_organization .el-select .el-input .el-input__suffix {
  right: unset;
  left: 30px;
}

.edit_organization .el-select .el-input .el-input__suffix {
  left: unset;
  right: 30px;
}

.ar .edit_organization .el-date-editor.el-input .el-input__suffix {
  right: unset;
  left: 25px;
}

.edit_organization .el-date-editor.el-input .el-input__suffix {
  left: unset;
  right: 25px;
}

.ar .edit_organization .el-input .el-input__suffix {
  right: unset;
  left: 15px;
}

.edit_organization .el-input .el-input__suffix {
  left: unset;
  right: 15px;
}
</style>
