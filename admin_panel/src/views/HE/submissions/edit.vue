<template>
  <CRow class="edit_submission">
    <CToaster :autohide="false" :show="showUpload">
      <template>
        <CToast v-if="showUpload" :show="true" :header="$t('archive.uploadFiles')">
          <ul v-if="uploadPercentage" class="el-upload-list el-upload-list--text">
            <li class="el-upload-list__item is-success">
              <el-progress :text-inside="true" :stroke-width="2" :percentage="uploadPercentage"></el-progress>
              <label class="el-upload-list__item-status-label">
                <i v-show="uploadPercentage == 100" class="el-icon-upload-success el-icon-circle-check"></i>
                <span>
                  {{ uploadPercentage != 100 ? '%' + uploadPercentage : '' }}
                </span>
              </label>
            </li>
          </ul>
        </CToast>
      </template>
    </CToaster>
    <template v-if="$store.state.user.allowHr || hasPermission('admin_system')">
      <CCol sm="12" v-if="$route.params.type == 1 || !$route.params.id">
        <CCard v-loading="$store.getters['submission/submissionsLoad']">
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
                  <div class="mb-3 mb-lg-0 w-sm-100 d-flex flex-lg-grow-1 flex-wrap align-items-center">
                    <strong class="ml-2 mr-2 custom_required">{{ $t('Global.subUniversity') }}</strong>
                    <div class="plus_icon flex-grow-1 position-relative mt-lg-0">
                      <el-form-item v-if="!temp_uni" class="animate hide_border m-0" :rules="validation(null, 1)" prop="university">
                        <el-select clearable :no-data-text="$t('Global.nodata')" style="width: 100%" v-model="ruleForm.university" filterable @change="reset" ref="all" :placeholder="$t('Global.selectUniversity')">
                          <el-option v-for="item in $store.getters['university/universities']" :key="item.id" :label="item.name" :value="item.id">
                            <span style="float: right; color: #8492a6; font-size: 13px">
                              {{ item.name }}
                            </span>
                          </el-option>
                          <el-option v-if="$store.getters['submission/selectedUniversity'] && !$route.params.id" :key="$store.getters['submission/selectedUniversity'].id" :label="$store.getters['submission/selectedUniversity'].name" :value="$store.getters['submission/selectedUniversity'].id">
                            <span style="float: right; color: #8492a6; font-size: 13px">
                              {{ $store.getters['submission/selectedUniversity'].name }}
                            </span>
                          </el-option>
                          <el-option key="new" :label="$t('Global.other')" :value="0">
                            <span style="float: right; color: #8492a6; font-size: 13px">
                              {{ $t('Global.other') }}
                            </span>
                          </el-option>
                          <template #empty>
                            <div class="text-center" style="padding: 10px; font-weight: bold">
                              {{ $t('Global.nodata') }}
                            </div>
                          </template>
                        </el-select>
                      </el-form-item>

                      <el-form-item v-else :rules="validation(false, 'textarea')" prop="temp_university_name" class="animate hide_border m-0">
                        <el-input clearable :placeholder="$t('Global.selectUniversityName')" v-model="ruleForm.temp_university_name">
                          <i slot="suffix" class="el-input__icon el-icon-office-building"></i>
                        </el-input>
                      </el-form-item>
                      <!-- <div v-if="!$route.params.id" class="left_input" @click="openDialog(1)"><i class="el-icon-circle-plus" style="font-size: 22px"></i></div> -->
                      <div v-if="temp_uni" class="left_input" @click="resetUni()"><i class="el-icon-circle-close" style="font-size: 22px"></i></div>
                    </div>
                  </div>
                  <strong class="ml-3 mr-3 custom_required">{{ $t('Global.SubOrganization') }}</strong>
                  <div class="plus_icon position-relative flex-grow-1 mb-md-4 mt-md-4 mt-lg-0 mb-lg-0">
                    <el-form-item v-if="!temp_org" :rules="validation(null, 1)" prop="organization_id" class="m-0 hide_border">
                      <el-select class="long_place_holder" clearable :disabled="disabled_org" :no-data-text="$t('Global.nodata')" style="width: 100%" v-model="ruleForm.organization_id" filterable @change="reset" ref="all" :placeholder="$t('Global.selectOrganization')">
                        <el-option v-for="item in $store.getters['organization/organizationNames']" :key="item.id" :label="item.name" :value="item.id">
                          <span style="float: right; color: #8492a6; font-size: 13px">
                            {{ item.name }}
                          </span>
                        </el-option>
                        <el-option v-if="$store.getters['submission/selectedOrganization'] && !$route.params.id" :key="$store.getters['submission/selectedOrganization'].id" :label="$store.getters['submission/selectedOrganization'].name" :value="$store.getters['submission/selectedOrganization'].id">
                          <span style="float: right; color: #8492a6; font-size: 13px">
                            {{ $store.getters['submission/selectedOrganization'].name }}
                          </span>
                        </el-option>
                        <el-option key="new" :label="$t('Global.other')" :value="0">
                          <span style="float: right; color: #8492a6; font-size: 13px">
                            {{ $t('Global.other') }}
                          </span>
                        </el-option>
                        <template #empty>
                          <div class="text-center" style="padding: 10px; font-weight: bold">
                            {{ $t('Global.nodata') }}
                          </div>
                        </template>
                      </el-select>
                    </el-form-item>

                    <el-form-item v-else :rules="validation(false, 'textarea')" prop="temp_organization_name" class="animate hide_border m-0">
                      <el-input clearable :placeholder="$t('Global.organization_name')" v-model="ruleForm.temp_organization_name">
                        <i slot="suffix" class="el-input__icon el-icon-office-building"></i>
                      </el-input>
                    </el-form-item>

                    <div v-if="temp_org" class="left_input" @click="resetOrg()"><i class="el-icon-circle-close" style="font-size: 22px"></i></div>
                  </div>
                </CCol>
                <CCol sm="12" class="direction d-flex flex-wrap flex-column mt-4">
                  <div class="d-flex flex-wrap">
                    <div class="w-sm-100 d-flex w-20 flex-lg-grow-1 flex-wrap">
                      <strong class="ml-1 mr-1 mt-2 custom_required">{{ $t('Global.subApplyUniversity') }}</strong>
                      <strong class="ml-1 mr-1 mt-2">{{ $t('Global.subType') }}</strong>
                      <el-form-item style="flex-basis: 92px" class="flex-grow-1 hide_border" :rules="validation(null, 1)" prop="evaluation_type">
                        <el-select
                          id="evaluation_type_name"
                          name="evaluation_type_name"
                          :disabled="disabled_type || ($route.params.id && isGthCurrentStatus($store.state.submission.current_status, constants('FILL_INFO_STATUS')) && hasPermission('employee_approval'))"
                          clearable
                          :no-data-text="$t('Global.nodata')"
                          style="width: 100%"
                          v-model="ruleForm.evaluation_type"
                          filterable
                          :placeholder="$t('Global.type')"
                        >
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
                    </div>
                    <strong class="ml-3 mr-3 mt-2" :class="disabled || hasPermission('data_update') ? '' : 'custom_required'">{{ $t('programs.programs') }}</strong>
                    <div class="plus_icon position-relative flex-grow-1">
                      <el-form-item class="hide_border" :rules="disabled || hasPermission('data_update') ? null : validation(null, 1)" prop="programs">
                        <el-select clearable :no-data-text="$t('Global.nodata')" style="width: 100%" :multiple-limit="4" :disabled="disabled" v-model="ruleForm.programs" filterable multiple :placeholder="$t('Global.selectPrograms')">
                          <el-option v-for="item in $store.getters['submission/programs']" :key="item.id" :label="item.name" :value="item.id">
                            <span style="float: right; color: #8492a6; font-size: 13px">
                              {{ item.name }}
                            </span>
                          </el-option>
                          <el-option v-if="$store.getters['submission/selectedPrograms'] && $store.getters['submission/selectedPrograms'][0].name" v-for="item in $store.getters['submission/selectedPrograms']" :key="item.id" :label="item.name" :value="item.id">
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
                      <div v-if="!disabled && (ruleForm.organization_id || ruleForm.organization_id == 0) && ruleForm.evaluation_type == 3" class="left_input" @click="openDialog(3)" style="z-index: 999"><i class="el-icon-circle-plus" style="font-size: 22px"></i></div>
                    </div>
                  </div>
                </CCol>
                <!-- <el-divider class="mt-n3"></el-divider> -->
                <el-divider class="mb-5 mt-0" content-position="center"><i class="el-icon-map-location"></i> {{ $t('Global.generalInfo') }}</el-divider>

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

                <CCol sm="12" class="d-flex flex-wrap mt-n4">
                  <CCol sm="6" class="p-0 mt-4">
                    <strong class="custom_required">{{ $t('Global.attachment') }}</strong>
                    <el-form-item v-if="$store.state.submission.inDocuments" :show-message="filesError ? true : false" :error="filesError ? filesError : ''" prop="file" class="p-0 left_right">
                      <div v-for="(document, index) in getUploadsFiles($store.state.submission.uploadedDocs, $store.state.submission.inDocuments)" v-if="document.form == 1" class="mb-2 box-card docs_body edit_upload border rounded text docs d-flex justify-content-between align-items-center">
                        <div v-if="document.document" class="w-100" style="line-height: 20px">
                          <a class="custom_link" download target="_blank" :href="document.document.url">
                            <span style="line-height: 10px" class="px-1">{{ document.document.title }} ( {{ document.document.size }} )</span>
                          </a>
                        </div>
                        <div class="d-flex w-100 justify-content-end">
                          <FormUpload v-if="document.document" @deleteFile="deleteFile" type="editSubFile" :title="document.title" :label="document.label" :index="document.id" @getFile="upload"></FormUpload>
                          <FormUpload v-else type="subFile" :label="document.label" :title="document.title" :index="document.id" @getFile="upload"></FormUpload>
                        </div>
                      </div>
                    </el-form-item>
                  </CCol>
                  <CCol sm="6" v-if="$route.params.id">
                    <div class="animate check_block align-self-start" v-if="hideType && ruleForm.evaluation_type">
                      <el-form-item :show-message="termsError" :error="$t('Validation.checkbox_valid')">
                        <el-checkbox class="check_all" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">{{ $t('Global.selectAll') }} </el-checkbox>
                        <div style="margin: 15px 0" class="font-weight-bolder custom_required">{{ $t('Global.selectAll') }}</div>
                        <el-checkbox-group v-model="checkedTerms" @change="handleCheckedCitiesChange">
                          <el-checkbox class="d-flex align-items-baseline" v-for="i in ruleForm.evaluation_type == 3 ? 4 : 5" :label="i" :key="i">{{ $t(`Global.select_${ruleForm.evaluation_type || 1}_term_${i}`) }} </el-checkbox>
                        </el-checkbox-group>
                      </el-form-item>
                    </div>
                  </CCol>
                  <CCol sm="6" v-else>
                    <div class="animate check_block align-self-start" v-if="ruleForm.evaluation_type">
                      <el-form-item :show-message="termsError" :error="$t('Validation.checkbox_valid')">
                        <el-checkbox class="check_all" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">{{ $t('Global.selectAll') }} </el-checkbox>
                        <div style="margin: 15px 0" class="font-weight-bolder custom_required">{{ $t('Global.selectAll') }}</div>
                        <el-checkbox-group v-model="checkedTerms" @change="handleCheckedCitiesChange">
                          <el-checkbox class="d-flex align-items-baseline" v-for="i in ruleForm.evaluation_type == 3 ? 4 : 5" :label="i" :key="i">{{ $t(`Global.select_${ruleForm.evaluation_type || 1}_term_${i}`) }} </el-checkbox>
                        </el-checkbox-group>
                      </el-form-item>
                    </div>
                  </CCol>
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

      <CCol sm="12" v-if="$route.params.id && $route.params.type == 2">
        <Finance></Finance>
        <!--      //  v-if="$store.getters['notes/currentStatus'].status < constants('FINANCE_STATUS') && isEqualStatus($store.getters['notes/lastNote'], constants('PRESIDENT_APPROVE_STATUS')) || (isEqualStatus($store.getters['notes/lastNote'], constants('FINANCE_REFUSE_STATUS')))-->
      </CCol>

      <CCol sm="12" v-if="$route.params.id && (hasPermission('team_update') || hasPermission('admin_submissions')) && $route.params.type == 3">
        <approve></approve>
      </CCol>
    </template>
    <el-dialog :title="$t('Global.addInfo')" :visible.sync="organizationDialog" width="50%">
      <el-form @submit.native.prevent :model="editForm" label-position="top" status-icon size="large" ref="editForm" :rules="editRules" label-width="120px" class="demo-ruleForm">
        <el-form-item :rules="validation(false, 'textarea')" v-if="editForm.type === 1" prop="university" :label="$t('Global.theUniversity')">
          <el-input clearable :placeholder="$t('Global.selectUniversity')" v-model="editForm.university">
            <i slot="suffix" class="el-input__icon el-icon-office-building"></i>
          </el-input>
        </el-form-item>

        <el-form-item :rules="validation(false, 'textarea')" prop="organization" :label="$t('Global.selectOrganization')" v-if="editForm.type === 2">
          <el-input clearable :placeholder="$t('Global.selectOrganization')" v-model="editForm.organization">
            <i slot="suffix" class="el-input__icon el-icon-school"></i>
          </el-input>
        </el-form-item>
      </el-form>
      <el-form @submit.native.prevent label-position="top" ref="programForm" :model="programForm" status-icon size="large" :rules="programRules" label-width="120px" class="demo-ruleForm" v-if="editForm.type === 3">
        <el-form-item
          class="custom_required"
          style="
            .custom_reqired::after {
              top: 6px;
            }
          "
          prop="name"
          :label="$t('Global.program_name')"
          v-if="editForm.type === 3"
        >
          <el-input clearable :placeholder="$t('Global.program_name')" v-model="programForm.name">
            <i slot="suffix" class="el-input__icon el-icon-school"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="qualification_degree_id" v-if="editForm.type === 3" :rules="[{ required: true, message: `${$t('Validation.selectFiled')}`, trigger: 'change' }]" :label="$t('Global.programDegree')">
          <el-select :no-data-text="$t('Global.nodata')" v-model="programForm.qualification_degree_id" ref="decision" :placeholder="$t('Global.programDegree')" style="width: 100%">
            <el-option v-for="item in $store.getters['submission/lookups'].qualification" :key="item.id" :label="item.name" :value="item.id">
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
        <el-form-item prop="nature_id" v-if="editForm.type === 3" :rules="[{ required: true, message: `${$t('Validation.selectFiled')}`, trigger: 'change' }]" :label="$t('Global.program_type')">
          <el-select :no-data-text="$t('Global.nodata')" v-model="programForm.nature_id" :placeholder="$t('Global.program_type')" style="width: 100%">
            <el-option v-for="item in $store.getters['submission/lookups'].natures" :key="item.id" :label="item.name" :value="item.id">
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
        <el-form-item prop="language_id" v-if="editForm.type === 3" :rules="[{ required: true, message: `${$t('Validation.selectFiled')}`, trigger: 'change' }]" :label="$t('Global.language')">
          <el-select :no-data-text="$t('Global.nodata')" v-model="programForm.language_id" :placeholder="$t('Global.language')" style="width: 100%">
            <el-option v-for="item in $store.getters['submission/lookups'].languages" :key="item.id" :label="item.name" :value="item.id">
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
        <el-form-item prop="education_pattern_id" v-if="editForm.type === 3" :rules="[{ required: true, message: `${$t('Validation.selectFiled')}`, trigger: 'change' }]" :label="$t('Global.program_system')">
          <el-select :no-data-text="$t('Global.nodata')" v-model="programForm.education_pattern_id" :placeholder="$t('Global.program_system')" style="width: 100%">
            <el-option v-for="item in $store.getters['submission/lookups'].patterns" :key="item.id" :label="item.name" :value="item.id">
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

        <el-form-item prop="cycle_time_id" v-if="editForm.type === 3" :rules="[{ required: true, message: `${$t('Validation.selectFiled')}`, trigger: 'change' }]" :label="$t('Global.cycle_time')">
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
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @keyup.enter="saveOrganization(editForm.type == 3 ? 'programForm' : 'editForm')" @click="saveOrganization(editForm.type == 3 ? 'programForm' : 'editForm')">{{ $t('Global.save') }}</el-button>
        <el-button
          @click="
            organizationDialog = false;
            resetForm('programForm');
          "
          style="margin: 10px"
          >{{ $t('Global.cancel') }}</el-button
        >
      </span>
    </el-dialog>
  </CRow>
</template>

<script>
import upload from '../../components/upload';
import FormUpload from '../../components/FormUpload';
import Approve from './components/approve';
import Finance from './components/Finance';

const axios = require('axios');
const termsOptions = [1, 2, 3, 4, 5];
export default {
  components: { Approve, upload, FormUpload, Finance },
  name: 'submissionEdit',
  data() {
    var checkPrograms = (rule, value, callback) => {
      if (this.temp_uni || (!this.temp_uni && this.temp_org) || this.disabled || this.hasPermission('data_update')) {
        callback();
      }
      if ((value?.length == 0 && this.ruleForm.evaluation_type === 3) || !this.disabled || !this.hasPermission('data_update')) {
        return callback(new Error('من فضلك يجب اختيار البرامج'));
      } else {
        callback();
      }
      setTimeout(() => {
        if (value.length > 4) {
          callback(new Error('يجب اختيار اربع برامج فقط'));
        }
      }, 1000);
    };
    var checkAddPrograms = (rule, value, callback) => {
      if (value?.length == 0 && this.ruleForm.evaluation_type === 3) {
        return callback(new Error(`${this.$t('Validation.selectFiled')}`));
      }

      setTimeout(() => {
        if (!value?.replace(/\s/g, '').length) {
          return callback(new Error(`${this.$t(`Validation.selectFiled`)}`));
        }
      }, 500);

      setTimeout(() => {
        if (this.$store.getters['submission/programs']) {
          const found = this.$store.getters['submission/programs'].some(el => el.name === value);
          if (found) {
            callback(new Error(`${this.$t('Validation.selectFiledExist')}`));
          } else {
            if (this.$store.getters['submission/selectedPrograms']) {
              const found2 = this.$store.getters['submission/selectedPrograms'].some(el => el.name === value);
              if (found2) {
                callback(new Error(`${this.$t('Validation.selectFiledExist')}`));
              } else {
                callback();
              }
            } else {
              callback();
            }
          }
        }
      }, 1000);
    };
    var checkEditPrograms = (rule, value, callback) => {
      if (value && value.length == 0 && this.editForm.type === 3) {
        return callback(new Error('من فضلك يجب اختيار البرامج'));
      } else {
        callback();
      }
      setTimeout(() => {
        if (value.length > 4) {
          callback(new Error('يجب اختيار اربع برامج فقط'));
        }
      }, 1000);
    };
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
        authorized_person: null,
        authorized_phone: null,
        authorized_mobile: null,
        authorized_email: null,
        visit_type_id: null,
        organization_area: null,
        student_count: null,
        team: null,
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
      programRules: { name: [{ validator: checkAddPrograms, trigger: 'blur' }] },
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
        plan: [{ required: true, message: 'من فضلك يجب اختيار خطة ', trigger: 'change' }],
        programs: [{ validator: checkPrograms, trigger: 'change' }],
      },
      editRules: {
        university: [{ required: true, message: 'من فضلك يجب اختيار الجامعة  ', trigger: 'blur' }],
        organization: [{ required: true, message: 'من فضلك يجب اختيار المؤسسة  ', trigger: 'blur' }],
        // programs: [{ validator: checkAddPrograms, trigger: 'blur' }],
      },
    };
  },
  mounted() {
    this.init();
  },
  watch: {
    'ruleForm.authorized_phone'(value) {
      if (!value);
      this.ruleForm.authorized_phone = value.toString().replace(/[^0-9]/g, '');
    },
    'ruleForm.authorized_mobile'(value) {
      if (!value);
      this.ruleForm.authorized_mobile = value.toString().replace(/[^0-9]/g, '');
    },
    'ruleForm.organization_area'(value) {
      if (!value);
      this.ruleForm.organization_area = value.toString().replace(/[^0-9]/g, '');
    },
    'ruleForm.student_count'(value) {
      if (!value);
      this.ruleForm.student_count = value.toString().replace(/[^0-9]/g, '');
    },
    'ruleForm.university': function (val, newVal) {
      if (newVal) {
        this.ruleForm.organization_id = null;
        this.temp_org = null;
        // this.ruleForm.evaluation_type = null;
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
      if (val || val === 0) {
        if (!this.$route.params.id && val === 0) {
          this.disabled = true;
        }
        if (val === 0) {
          this.editForm.programs = null;
          this.editForm.type = 1;
          this.temp_uni = true;
          this.$store.commit('organization/SET_ORGANIZATIONS_NAMES', []);
        } else {
          this.$store.dispatch('organization/names', {
            query: {
              parent_id: this.ruleForm.university,
            },
          });
          if (this.temp_org) {
            let selectedUniversityName = this.$store.getters['university/universities'] ? this.$store.getters['university/universities'].find(university => university.id == val) : null;
            this.ruleForm.temp_university_name = selectedUniversityName ? selectedUniversityName.name : null;
          } else if (val != 0 && this.ruleForm.organization_id != 0) {
            this.ruleForm.temp_university_name = null;
            this.ruleForm.temp_organization_name = null;
          }
        }
        this.disabled_org = false;
      } else {
        this.disabled_org = true;
      }
    },
    'ruleForm.evaluation_type': function (val, newVal) {
      if (newVal) {
        this.ruleForm.programs = [];
      }
      if (val === 3 && (this.ruleForm.organization_id || this.ruleForm.organization_id == 0)) {
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
      if (!this.$route.params.id) {
        this.checkedTerms = [];
      } else {
        if (val != this.$store.getters['submission/selectedEvatype']) {
          this.hideType = true;
        } else {
          this.hideType = false;
        }
      }
    },
    'ruleForm.organization_id': function (val, newVal) {
      if (!this.$route.params.type || (this.$route.params.type && this.$route.params.type != 3)) {
        this.$store
          .dispatch('submission/edit', {
            id: this.$route.params.id ? this.$route.params.id : null,
            query: { organization_id: val },
          })
          .then(() => {
            if (this.$store.getters['submission/programs']) {
              this.ruleForm.programs = this.$store.getters['submission/selectedPrograms'] ? this.$store.getters['submission/selectedPrograms'] : [];
            }
            if (newVal) {
              this.ruleForm.evaluation_type = null;
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
            if (val || val === 0) {
              if (val === 0) {
                this.editForm.programs = null;
                //   if (this.disabled_org && type != 1) return true;
                this.editForm.type = 2;
                if (val === 0) {
                  this.temp_org = true;
                }
                if (!this.temp_uni) {
                  let selectedUniversityName = this.$store.getters['university/universities'] ? this.$store.getters['university/universities'].find(university => university.id == this.ruleForm.university) : null;
                  this.ruleForm.temp_university_name = selectedUniversityName ? selectedUniversityName.name : null;
                }
              } else if (this.ruleForm.university != 0 && val != 0) {
                this.ruleForm.temp_university_name = null;
                this.ruleForm.temp_organization_name = null;
              }
              if (!this.$route.params.id) {
                this.disabled_type = false;
              } else {
                if (this.isGthCurrentStatus(this.$store.state.submission.current_status, this.constants('FILL_INFO_STATUS'))) {
                  this.disabled_type = true;
                } else {
                  this.disabled_type = false;
                }
              }
              this.disabled_self_report = false;
            } else {
              if (!this.ruleForm.evaluation_type) {
                this.disabled_type = true;
              }
              this.disabled_self_report = true;
            }
          });
      }
    },
  },
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    resetUni() {
      this.temp_uni = !this.temp_uni;
      this.ruleForm.university = null;
    },
    resetOrg() {
      this.temp_org = !this.temp_org;
      this.ruleForm.organization_id = null;
    },
    handleCheckAllChange(val) {
      this.checkedTerms = val ? termsOptions : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.terms.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.terms.length;
    },
    init() {
      if (!this.$route.params.type || (this.$route.params.type && this.$route.params.type != 3)) {
        this.$store.dispatch('university/universities');
        this.$store
          .dispatch('submission/edit', {
            id: this.$route.params.id ? this.$route.params.id : null,
            query: {},
          })
          .then(() => {
            this.ruleForm.plan = this.$store.getters['submission/selectedPlan'] ? this.$store.getters['submission/selectedPlan'] : 0;
            this.ruleForm.officail_council = this.$store.getters['submission/selectedOfficail_council'] ? this.$store.getters['submission/selectedOfficail_council'] : 0;
            this.ruleForm.self_report_type = this.$store.getters['submission/selectedSelf_report_type'] ? this.$store.getters['submission/selectedSelf_report_type'] : null;
            this.ruleForm.organization_id = this.$store.getters['submission/selectedOrganization'] || this.$store.getters['submission/selectedOrganization'] == 0 ? this.$store.getters['submission/selectedOrganization'] : null;
            this.ruleForm.university = this.$store.getters['submission/selectedUniversity'] || this.$store.getters['submission/selectedUniversity'] == 0 ? this.$store.getters['submission/selectedUniversity'] : null;
            this.ruleForm.evaluation_type = this.$store.getters['submission/selectedEvatype'] ? this.$store.getters['submission/selectedEvatype'] : null;
            this.ruleForm.temp_organization_name = this.$store.getters['submission/tempOrganizationName'] ? this.$store.getters['submission/tempOrganizationName'] : null;
            this.ruleForm.temp_university_name = this.$store.getters['submission/tempUniversityName'] ? this.$store.getters['submission/tempUniversityName'] : null;
            this.ruleForm.authorized_person = this.$store.state.submission.authorized_person ? this.$store.state.submission.authorized_person : null;
            this.ruleForm.authorized_phone = this.$store.state.submission.authorized_phone ? this.$store.state.submission.authorized_phone : null;
            this.ruleForm.authorized_mobile = this.$store.state.submission.authorized_mobile ? this.$store.state.submission.authorized_mobile : null;
            this.ruleForm.authorized_email = this.$store.state.submission.authorized_email ? this.$store.state.submission.authorized_email : null;
            this.ruleForm.visit_type_id = this.$store.state.submission.visit_type_id ? this.$store.state.submission.visit_type_id : null;
            this.ruleForm.organization_area = this.$store.state.submission.organization_area ? this.$store.state.submission.organization_area : null;
            this.ruleForm.student_count = this.$store.state.submission.student_count ? this.$store.state.submission.student_count : null;
          });
        if (this.$route.params.id) {
          this.$store.dispatch('notes/subState', this.$route.params.id);
        }
      }
    },
    uploadDone() {
      this.$store
        .dispatch('submission/edit', {
          id: this.$route.params.id ? this.$route.params.id : null,
          query: {},
        })
        .then(() => {
          this.ruleForm.plan = this.$store.getters['submission/selectedPlan'] ? this.$store.getters['submission/selectedPlan'] : 0;
          this.ruleForm.officail_council = this.$store.getters['submission/selectedOfficail_council'] ? this.$store.getters['submission/selectedOfficail_council'] : 0;
          this.ruleForm.self_report_type = this.$store.getters['submission/selectedSelf_report_type'] ? this.$store.getters['submission/selectedSelf_report_type'] : null;
          this.ruleForm.organization_id = this.$store.getters['submission/selectedOrganization'] ? this.$store.getters['submission/selectedOrganization'] : null;
          this.ruleForm.university = this.$store.getters['submission/selectedUniversity'] ? this.$store.getters['submission/selectedUniversity'] : null;
          this.ruleForm.evaluation_type = this.$store.getters['submission/selectedEvatype'] ? this.$store.getters['submission/selectedEvatype'] : null;
          this.$notify({
            type: 'success',
            message: 'تمت العملية بنجاح',
          });
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
            if ((this.ruleForm.evaluation_type == 3 && (this.checkedTerms.length == 4 || this.checkedTerms.length == 5)) || (this.ruleForm.evaluation_type != 3 && this.checkedTerms.length == 5)) {
              this.termsError = false;
              if (this.file.length == this.$store.state.submission.inDocuments.length) {
                let formData = new FormData();
                for (const [key, value] of Object.entries(this.ruleForm)) {
                  if (value || value == 0) {
                    formData.append(key, value);
                  }
                }
                this.file.forEach((element, i) => {
                  formData.append('docs[' + element.num + ']', element.file);
                });
                if (this.$route.params.system) {
                  formData.append('system', this.$route.params.system);
                }
                if (formData.has('docs[3]') && formData.has('docs[4]')) {
                  this.isLoad = true;
                  var query = { query: formData };
                  if (this.$route.params.id) {
                    query = { query: formData, id: this.$route.params.id };
                  }
                  if (this.clicked) return;
                  this.clicked = true;
                  this.filesError = false;
                  this.$store
                    .dispatch('submission/save', query)
                    .then(() => {
                      this.$message({
                        message: this.$t('Global.createSubmissionMessage'),
                        type: 'success',
                      });
                      this.isLoad = false;
                    })
                    .catch(() => {
                      this.error = true;
                      this.clicked = false;
                      this.isLoad = false;
                      this.$store.commit('SET_UPLOAD_PROGRESS', 100);
                    });
                } else {
                  this.filesError = `${this.$t('Global.pleaseUploadAllFiles')}`;
                }
              } else {
                this.filesError = `${this.$t('Global.pleaseUploadAllFiles')}`;
              }
            } else {
              this.termsError = true;
            }
          }
        } else {
          if (valid) {
            if (this.hideType) {
              if ((this.ruleForm.evaluation_type == 3 && (this.checkedTerms.length == 4 || this.checkedTerms.length == 5)) || (this.ruleForm.evaluation_type != 3 && this.checkedTerms.length == 5)) {
                this.termsError = false;
                let formData = new FormData();
                for (const [key, value] of Object.entries(this.ruleForm)) {
                  if (value || value == 0) {
                    formData.append(key, value);
                  }
                }
                if (this.file.length) {
                  this.file.forEach((element, i) => {
                    formData.append('docs[' + element.num + ']', element.file);
                  });
                }
                if (this.$route.params.system) {
                  formData.append('system', this.$route.params.system);
                }

                var query = { query: formData };
                if (this.$route.params.id) {
                  query = { query: formData, id: this.$route.params.id };
                }
                if (
                  ((!formData.has('docs[3]') || !formData.has('docs[4]')) && this.getCountOfUploadsFiles(this.$store.state.submission.uploadedDocs, this.$store.state.submission.inDocuments, 1) == 2) ||
                  (formData.has('docs[3]') && formData.has('docs[4]')) ||
                  (this.getCountOfUploadsFiles(this.$store.state.submission.uploadedDocs, this.$store.state.submission.inDocuments, 1) == 1 && (formData.has('docs[3]') || formData.has('docs[4]')))
                ) {
                  this.isLoad = true;
                  if (this.clicked) return;
                  this.clicked = true;
                  this.$store
                    .dispatch('submission/save', query)
                    .then(() => {
                      this.$message({
                        message: this.$t('Global.createSubmissionMessage'),
                        type: 'success',
                      });
                      this.isLoad = false;
                    })
                    .catch(() => {
                      this.error = true;
                      this.clicked = false;
                      this.isLoad = false;
                      this.$store.commit('SET_UPLOAD_PROGRESS', 100);
                    });
                } else {
                  this.filesError = `${this.$t('Global.pleaseUploadAllFiles')}`;
                }
              } else {
                this.termsError = true;
              }
            } else {
              let formData = new FormData();
              for (const [key, value] of Object.entries(this.ruleForm)) {
                if (value || value == 0) {
                  formData.append(key, value);
                }
              }
              if (this.file.length) {
                this.file.forEach((element, i) => {
                  formData.append('docs[' + element.num + ']', element.file);
                });
              }
              if (this.$route.params.system) {
                formData.append('system', this.$route.params.system);
              }

              var query = { query: formData };
              if (this.$route.params.id) {
                query = { query: formData, id: this.$route.params.id };
              }
              if (
                ((!formData.has('docs[3]') || !formData.has('docs[4]')) && this.getCountOfUploadsFiles(this.$store.state.submission.uploadedDocs, this.$store.state.submission.inDocuments, 1) == 2) ||
                (formData.has('docs[3]') && formData.has('docs[4]')) ||
                (this.getCountOfUploadsFiles(this.$store.state.submission.uploadedDocs, this.$store.state.submission.inDocuments, 1) == 1 && (formData.has('docs[3]') || formData.has('docs[4]')))
              ) {
                this.isLoad = true;
                if (this.clicked) return;
                this.clicked = true;
                this.$store
                  .dispatch('submission/save', query)
                  .then(() => {
                    this.$message({
                      message: this.$t('Global.createSubmissionMessage'),
                      type: 'success',
                    });
                    this.isLoad = false;
                  })
                  .catch(() => {
                    this.error = true;
                    this.clicked = false;
                    this.isLoad = false;
                    this.$store.commit('SET_UPLOAD_PROGRESS', 100);
                  });
              } else {
                this.filesError = `${this.$t('Global.pleaseUploadAllFiles')}`;
              }
            }
          }
        }
      });
    },
    saveOrganization(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let query = null;
          let programs = [];
          let error = true;
          if (this.editForm.type === 1) {
            query = { name: this.editForm.university, system: this.$route.params.system };
          } else if (this.editForm.type === 2 && this.ruleForm.university) {
            query = {
              name: this.editForm.organization,
              parent_id: this.ruleForm.university,
              system: this.$route.params.system,
            };
          } else {
            if (this.ruleForm.programs && this.ruleForm.programs.length <= 3) {
              programs.push(this.programForm.name);
            } else {
              error = false;
            }
            query = { organization_id: this.ruleForm.organization_id, ...this.programForm };
          }
          if (error) {
            this.organizationDialog = false;
            this.$store.dispatch('submission/saveOrganization', { query: query }).then(() => {
              if (this.editForm.type === 1) {
                this.ruleForm.university = this.$store.getters['submission/selectedUniversity'] ? this.$store.getters['submission/selectedUniversity'].id : null;
              } else if (this.editForm.type === 2 && this.ruleForm.university) {
                this.ruleForm.organization_id = this.$store.getters['submission/selectedOrganization'] ? this.$store.getters['submission/selectedOrganization'].id : null;
              } else {
                if (programs.length) {
                  this.selectedPrograms = this.$store.getters['submission/selectedPrograms'] ? Array.from(this.$store.getters['submission/selectedPrograms'], program => program.id) : [];
                  this.ruleForm.programs.push(this.selectedPrograms[0]);
                } else {
                  this.ruleForm.programs.push(Array.from(this.$store.getters['submission/selectedPrograms'], program => program.id));
                }
                this.programForm.name = null;
                this.programForm.qualification_degree_id = null;
                this.programForm.nature_id = null;
                this.programForm.education_pattern_id = null;
                this.programForm.cycle_time_id = null;
                this.programForm.language_id = null;
              }
              this.$notify({ type: 'success', message: this.$t('Global.successMessage') });
              this.resetForm('programForm');
            });
          } else {
            this.$notify.error({
              title: 'خطأ',
              message: `${this.$t('Global.moreThan4')}`,
            });
          }
        }
      });
    },
    upload(file, num) {
      if (file) {
        this.file[num - 1] = file;
      }
    },
    deleteFile(file) {
      this.file = this.file.filter(myfile => file.name != myfile.file.name);
    },
    uploadDocs(file, index) {
      if (index == 11) {
        this.supportFiles = file;
      } else {
        this.file_list[index - 1] = file;
      }
    },
    reset() {
      //   this.$refs.all.blur();
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
