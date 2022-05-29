<template>
  <div v-if="hasPermission('access_organizations')">
    <Show id="organization_id" :loading="$store.getters['organization/organizationLoad']" icon="el-icon-office-building" :items="$store.getters['organization/organization']" :name="$store.getters['organization/name']" except="departments">
      <template #show_status>
        <CBadge color="success" v-show="$store.getters['organization/governmental'] === 1" style="margin: 4px">
          {{ $t('Global.governmental') }}
        </CBadge>
        <CBadge color="success" v-show="$store.getters['organization/governmental'] === 2" style="margin: 4px">
          {{ $t('Global.especially') }}
        </CBadge>
        <CBadge color="success" v-show="$store.getters['organization/governmental'] === 3" style="margin: 4px">
          {{ $t('Global.local') }}
        </CBadge>
        <CBadge color="warning" v-show="$store.getters['organization/university'] === 1" style="margin: 4px">
          {{ $t('Global.university') }}
        </CBadge>
        <CBadge color="info" v-show="$store.getters['organization/high'] === 1" style="margin: 4px">
          {{ $t('Global.high') }}
        </CBadge>
        <CBadge :color="$store.getters['organization/status'] == 0 ? 'success' : 'danger'" v-show="$store.getters['organization/status'] == 1" style="margin: 4px">{{ $t('Global.remove') }} </CBadge>
      </template>
      <template #show_action>
        <template v-if="$store.state.user.allowHr || hasPermission('admin_system')">
          <i class="el-icon-printer pointer print_hide" style="font-size: 17px" @click="print('organization_id', $store.getters['organization/name'])"></i>
          <router-link class="mx-3 print_hide" :to="{ path: `/higher/organization/edit/${$route.params.id}`.toString() }" v-if="hasPermission('edit_organizations') || isAuth($store.getters['organization/representative'])">
            <CIcon name="cil-pencil" color="bg-primary"></CIcon>
          </router-link>
          <CDropdown color="success" v-if="hasPermission('admin_organizations')" placement="bottom-end" size="sm" class="print_hide d-inline customDrop">
            <template #toggler-content>
              <CIcon name="cil-settings" />
              <span style="font-weight: bold">{{ $t('Global.action') }}</span>
            </template>
            <router-link class="item d-block" to="">
              <div style="text-align: initial" @click="diActive">
                <i :class="$store.getters['organization/status'] == 0 ? 'el-icon-delete' : 'el-icon-refresh'"></i>
                {{ $t(`Global.activate_org_${$store.getters['organization/status']}`) }}
              </div>
            </router-link>
          </CDropdown>
        </template>
      </template>
      <template #other_data>
        <tr>
          <th scope="row" width="20%">{{ $t('Global.decision') }}</th>
          <td width="80%">
            <router-link v-for="evaluation in $store.getters['organization/evaluations']" :to="{ path: `/higher/submissions/submission/${evaluation.submission_id}/${evaluation.evaluation_id}` }">
              <CBadge :color="evaluation.decision === null ? 'danger' : evaluation.decision === 'اعتماد' ? 'success' : 'warning'" class="custom-link" style="margin: 2px">{{ evaluation.decision ? evaluation.decision : 'لا يوجد' }} </CBadge>
              <CBadge v-if="evaluation.program" color="warning" class="custom-link" style="margin: 2px">{{ evaluation.program }} </CBadge>
              <CBadge class="custom-link" v-if="evaluation.start" color="info" style="margin: 2px"
                >{{ $t('Global.from') }} :
                {{ DateFormat(evaluation.start) }}
              </CBadge>
              <CBadge class="custom-link" v-if="evaluation.expiration" color="info"
                >{{ $t('Global.to') }} :
                {{ DateFormat(evaluation.expiration) }}
              </CBadge>

              <br />
            </router-link>
          </td>
        </tr>
      </template>
      <template #bottom_other_data>
        <tr>
          <th scope="row" width="20%">{{ $t('Global.representative') }}</th>
          <td width="80%" v-if="$store.getters['organization/representative']">
            <router-link class="custom-link" :to="{ path: `/users/${$store.getters['organization/representative'].id}` }">
              {{ $store.getters['organization/representative'].ar_name }}
            </router-link>
          </td>
        </tr>
      </template>
    </Show>
    <CCard v-loading="$store.getters['organization/organizationLoad']" v-if="$store.getters['organization/organization'] && hasPermission('access_departments')">
      <CCardHeader>
        <div :class="$i18n.locale === 'ar' ? 'card-header-actions' : ''" style="display: inline-block; font-weight: bold"><i class="el-icon-data-board"></i> {{ $t('Global.departments') }}</div>
        <div :class="$i18n.locale === 'en' ? 'card-header-actions' : ''" style="display: flex; justify-content: flex-end; align-items: center">
          <template v-if="$store.state.user.allowHr || hasPermission('admin_system')">
            <CDropdown color="success" placement="bottom-end" size="sm" class="customDrop">
              <template #toggler-content>
                <CIcon name="cil-settings" />
                <span style="font-weight: bold">{{ $t('Global.action') }}</span>
              </template>
              <div class="item" v-if="hasPermission('add_departments') || isAuth($store.getters['organization/representative'])" @click="openDepartmentDialog(null)">
                <i class="el-icon-message"></i>
                {{ $t('Global.add_department') }}
              </div>
            </CDropdown>
          </template>
        </div>
      </CCardHeader>
      <CCardBody>
        <CRow v-if="$store.state.organization.organization && $store.state.organization.organization.departments">
          <div class="d-flex flex-wrap m-1" v-for="department in $store.state.organization.organization.departments">
            <div class="px-1 docs_header d-flex justify-content-center align-items-center">
              <span>
                {{ department.name }}
                <div>
                  <i v-if="hasPermission('delete_departments') && !department.status" class="el-icon-delete table-action-item" @click="deleteDepartment(department.id)"></i>
                  <i v-if="(hasPermission('edit_departments') && !department.status) || hasPermission('admin_departments')" class="el-icon-edit table-action-item" @click="openDepartmentDialog(department)"></i>
                </div>
              </span>
            </div>
          </div>
        </CRow>
        <div v-else class="d-lg-flex justify-content-center">{{ $t('Global.nodata') }}</div>
      </CCardBody>
    </CCard>
    <CCard v-loading="$store.getters['organization/organizationLoad']" v-if="$store.getters['organization/programs'] && hasPermission('access_programs')">
      <CCardHeader>
        <div :class="$i18n.locale === 'ar' ? 'card-header-actions' : ''" style="display: inline-block; font-weight: bold"><i class="el-icon-data-board"></i> {{ $t('Global.Programs') }}</div>
        <div :class="$i18n.locale === 'en' ? 'card-header-actions' : ''" style="display: flex; justify-content: flex-end; align-items: center">
          <template v-if="$store.state.user.allowHr || hasPermission('admin_system')">
            <CDropdown color="success" placement="bottom-end" size="sm" class="customDrop">
              <template #toggler-content>
                <CIcon name="cil-settings" />
                <span style="font-weight: bold">{{ $t('Global.action') }}</span>
              </template>
              <div class="item" v-if="hasPermission('add_programs') || isAuth($store.getters['organization/representative'])" @click="openProgramDialog(null)">
                <i class="el-icon-message"></i>
                {{ $t('Global.add_program') }}
              </div>
            </CDropdown>
          </template>
        </div>
      </CCardHeader>
      <CCardBody>
        <CRow v-if="$store.state.organization.programs && $store.state.organization.programs.length">
          <div class="d-flex flex-wrap m-1" v-for="program in $store.state.organization.programs">
            <div class="px-1 custom_docs_header d-flex justify-content-center align-items-center">
              <span>
                <div>
                  {{ program.name }}
                  <CBadge class="mr-1" color="success">{{ program.education_pattern }}</CBadge>
                  <CBadge class="mr-1" color="warning">{{ program.language }}</CBadge>
                  <CBadge class="mr-1" color="primary">{{ program.cycle_time }}</CBadge>
                  <CBadge class="mr-1" color="success">{{ program.program_nature }}</CBadge>
                  <CBadge class="mr-1" color="warning">{{ program.qualification }}</CBadge>
                </div>
                <div>
                  <i v-if="hasPermission('delete_programs') && !program.status" class="el-icon-delete table-action-item" @click="deleteProgram(program.id)"></i>
                  <i class="el-icon-edit table-action-item" @click="openProgramDialog(program)" v-if="(hasPermission('edit_programs') && !program.status) || hasPermission('admin_programs')"></i>
                </div>
              </span>
            </div>
          </div>
        </CRow>
        <div v-else class="d-lg-flex justify-content-center">{{ $t('Global.nodata') }}</div>
      </CCardBody>
    </CCard>
    <el-dialog :title="$t('Global.add_department')" :visible.sync="department_dialog" class="p-0" width="40%">
      <CCardBody dir="rtl" style="text-align: initial" class="p-0">
        <el-form label-position="top" :model="ruleForm" status-icon size="large" ref="ruleForm" label-width="120px" class="demo-ruleForm">
          <CRow>
            <CCol sm="12">
              <div class="datePicker el-form-item el-form-item--feedback el-form-item--small">
                <div class="reviewHeard" style="text-align: initial">
                  <el-form-item :rules="validation(null, 0)" prop="name" :label="$t('Global.department')">
                    <el-input clearable v-model="ruleForm.name" :placeholder="$t('Global.department')"></el-input>
                  </el-form-item>
                </div>
              </div>
            </CCol>
          </CRow>
        </el-form>
      </CCardBody>
      <CCardFooter>
        <div class="baseButton">
          <button @click="saveDepartment('ruleForm')" class="el-button el-button--default is-round sec_color" type="reset" style="padding: 0.6rem 1rem">
            <i class="el-icon-check-circle"></i>
            {{ $t('Global.submit') }}
          </button>
        </div>
      </CCardFooter>
    </el-dialog>
    <el-dialog :title="$t('Global.addInfo')" :visible.sync="program_dialog" width="50%">
      <el-form @submit.native.prevent label-position="top" ref="programForm" :model="programForm" status-icon size="large" v-if="$store.getters['submission/lookups']" label-width="120px" class="demo-ruleForm">
        <CRow>
          <CCol lg="6" md="12" sm="12">
            <el-form-item class="custom_required custom_top" prop="name" :label="$t('Global.program_name')">
              <el-input clearable :placeholder="$t('Global.program_name')" v-model="programForm.name">
                <i slot="suffix" class="el-input__icon el-icon-school"></i>
              </el-input>
            </el-form-item>
          </CCol>
          <CCol lg="6" md="12" sm="12">
            <el-form-item prop="qualification_degree_id" :rules="[{ required: true, message: `${$t('Validation.selectFiled')}`, trigger: 'change' }]" :label="$t('Global.programDegree')">
              <el-select :no-data-text="$t('Global.nodata')" v-model="programForm.qualification_degree_id" ref="decision" :placeholder="$t('Global.programDegree')" style="width: 100%">
                <el-option v-for="item in $store.getters['submission/lookups'].qualification" :key="item.id" :label="item.name" :value="item.id">
                  <span style="float: right; color: #8492a6; font-size: 13px">
                    {{ item.name }}
                  </span>
                </el-option>
              </el-select>
            </el-form-item>
          </CCol>
          <CCol lg="6" md="12" sm="12">
            <el-form-item prop="nature_id" :rules="[{ required: true, message: `${$t('Validation.selectFiled')}`, trigger: 'change' }]" :label="$t('Global.program_type')">
              <el-select :no-data-text="$t('Global.nodata')" v-model="programForm.nature_id" :placeholder="$t('Global.program_type')" style="width: 100%">
                <el-option v-for="item in $store.getters['submission/lookups'].natures" :key="item.id" :label="item.name" :value="item.id">
                  <span style="float: right; color: #8492a6; font-size: 13px">
                    {{ item.name }}
                  </span>
                </el-option>
              </el-select>
            </el-form-item>
          </CCol>
          <CCol lg="6" md="12" sm="12">
            <el-form-item prop="language_id" :rules="[{ required: true, message: `${$t('Validation.selectFiled')}`, trigger: 'change' }]" :label="$t('Global.language')">
              <el-select :no-data-text="$t('Global.nodata')" v-model="programForm.language_id" :placeholder="$t('Global.language')" style="width: 100%">
                <el-option v-for="item in $store.getters['submission/lookups'].languages" :key="item.id" :label="item.name" :value="item.id">
                  <span style="float: right; color: #8492a6; font-size: 13px">
                    {{ item.name }}
                  </span>
                </el-option>
              </el-select>
            </el-form-item>
          </CCol>
          <CCol lg="6" md="12" sm="12">
            <el-form-item prop="education_pattern_id" :rules="[{ required: true, message: `${$t('Validation.selectFiled')}`, trigger: 'change' }]" :label="$t('Global.program_system')">
              <el-select :no-data-text="$t('Global.nodata')" v-model="programForm.education_pattern_id" :placeholder="$t('Global.program_system')" style="width: 100%">
                <el-option v-for="item in $store.getters['submission/lookups'].patterns" :key="item.id" :label="item.name" :value="item.id">
                  <span style="float: right; color: #8492a6; font-size: 13px">
                    {{ item.name }}
                  </span>
                </el-option>
              </el-select>
            </el-form-item>
          </CCol>
          <CCol lg="6" md="12" sm="12">
            <el-form-item prop="cycle_time_id" :rules="[{ required: true, message: `${$t('Validation.selectFiled')}`, trigger: 'change' }]" :label="$t('Global.cycle_time')">
              <el-select :no-data-text="$t('Global.nodata')" v-model="programForm.cycle_time_id" :placeholder="$t('Global.cycle_time')" style="width: 100%">
                <el-option v-for="item in $store.getters['submission/lookups'].cycleTimes" :key="item.id" :label="item.name" :value="item.id">
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
        </CRow>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="saveProgram('programForm')" @keyup.enter="saveProgram('programForm')" type="primary">{{ $t('Global.save') }}</el-button>
        <el-button @click="program_dialog = false" style="margin: 10px">{{ $t('Global.cancel') }}</el-button>
      </span>
    </el-dialog>
    <Submissions system="HE" :localOrganization="Number($route.params.id)" @init="Refresh"></Submissions>
    <Map v-if="$store.getters['organization/organizationLocation'] || center" :locations="$store.getters['organization/organizationLocation'] || center" :center="center" :zoom="parseInt('12')"></Map>
  </div>
</template>

<script>
import Show from '../../components/Show';
import Map from '../../components/Map';
import { toLocalDatetime } from '../../../utils/helper';
import Submissions from '../../components/submissions';

export default {
  name: 'organization',
  components: { Submissions, Map, Show },
  data() {
    return {
      center: { lat: 30.033333, lng: 31.233334 },
      department_dialog: false,
      program_dialog: false,
      department_id: null,
      program_id: null,
      ruleForm: { name: null },
      programForm: {
        name: null,
        qualification_degree_id: null,
        nature_id: null,
        education_pattern_id: null,
        cycle_time_id: null,
        language_id: null,
      },
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    diActive() {
      this.$confirm(this.$t('Global.ensureBeforeRequest'), `${this.$t('Global.warning')}`, {
        confirmButtonText: `${this.$t('Global.accept')}`,
        cancelButtonText: `${this.$t('Global.cancel')}`,
        type: 'warning',
      }).then(() => {
        this.$store.dispatch('organization/delete', { id: this.$route.params.id, query: null }).then(() => {
          this.init();
          this.$notify({
            type: 'success',
            message: `${this.$t('Global.successMessage')}`,
          });
        });
      });
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
          let location = this.$store.getters['organization/organizationLocation'][0];
          if (location) {
            this.center = {
              lat: location.latitude,
              lng: location.longitude,
            };
          }
          this.$store.commit('SET_PATH_TITLE', this.$store.getters['organization/name']);
        });
    },
    Refresh(query) {
      this.query = query;
      this.$store.dispatch('submission/submissions', { query: query });
    },
    DateFormat(date) {
      return toLocalDatetime(date, `${this.$i18n.locale == 'ar' ? 'ar' : 'en'}`);
    },
    show(id) {
      this.$router.push(`/higher/submissions/submission/${id}`);
    },
    openDepartmentDialog(department) {
      this.department_dialog = true;
      if (department) {
        this.department_id = department.id;
        this.ruleForm.name = department.name;
      } else {
        this.department_id = null;
        this.ruleForm.name = null;
      }
    },
    openProgramDialog(program) {
      this.program_dialog = true;
      if (program) {
        this.program_id = program.id;
        this.programForm.name = program.name;
        this.programForm.cycle_time_id = program.cycle_time_id;
        this.programForm.education_pattern_id = program.education_pattern_id;
        this.programForm.language_id = program.language_id;
        this.programForm.qualification_degree_id = program.qualification_degree_id;
        this.programForm.nature_id = program.nature_id;
      } else {
        this.program_id = null;
        this.programForm.name = null;
        this.programForm.cycle_time_id = null;
        this.programForm.education_pattern_id = null;
        this.programForm.language_id = null;
        this.programForm.qualification_degree_id = null;
        this.programForm.nature_id = null;
      }
    },
    saveDepartment(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$store
            .dispatch('organization/saveDepartment', {
              id: this.department_id ? `/${this.department_id}` : '',
              query: { name: this.ruleForm.name, organization_id: this.$route.params.id },
            })
            .then(() => {
              this.department_dialog = false;
              this.init();
            });
        }
      });
    },
    deleteDepartment(id) {
      this.$confirm(this.$t('Global.ensureBeforeRequest'), `${this.$t('Global.warning')}`, {
        confirmButtonText: `${this.$t('Global.accept')}`,
        cancelButtonText: `${this.$t('Global.cancel')}`,
        type: 'warning',
      }).then(() => {
        this.$store.dispatch('organization/deleteDepartment', id).then(() => {
          this.init();
          this.$notify({
            type: 'success',
            message: `${this.$t('Global.successMessage')}`,
          });
        });
      });
    },
    saveProgram(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$store
            .dispatch('organization/saveProgram', {
              id: this.program_id ? `/${this.program_id}` : '',
              query: { ...this.programForm, organization_id: this.$route.params.id },
            })
            .then(() => {
              this.program_dialog = false;
              this.init();
            });
        }
      });
    },
    deleteProgram(id) {
      this.$confirm(this.$t('Global.ensureBeforeRequest'), `${this.$t('Global.warning')}`, {
        confirmButtonText: `${this.$t('Global.accept')}`,
        cancelButtonText: `${this.$t('Global.cancel')}`,
        type: 'warning',
      }).then(() => {
        this.$store.dispatch('organization/deleteProgram', id).then(() => {
          this.init();
          this.$notify({
            type: 'success',
            message: `${this.$t('Global.successMessage')}`,
          });
        });
      });
    },
  },
  destroyed() {
    this.$store.commit('SET_PATH_TITLE', null);
  },
};
</script>

<style lang="scss" scoped>
.custom_top {
  &::after {
    top: 6px;
  }
}

@media screen and (max-width: 600px) {
  .custom_docs_header {
    margin-right: -0.5rem;

    > span {
      justify-content: center !important;
    }
  }
}

.custom_docs_header {
  margin-right: -0.5rem;

  > span {
    &.small {
      font-size: 12px;
    }

    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 5px 15px;
    font-size: 16px;
    width: 100%;
    text-align: initial;
    margin-bottom: 0.5rem;
    font-weight: bolder;
    background-color: #eee;
    border-radius: 30px;
  }
}
</style>
