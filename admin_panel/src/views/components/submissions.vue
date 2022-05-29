<template>
  <CRow class="no-gutters">
    <div :class="`${option ? 'switch_view ml-2' : 'active switch_view ml-2'}`" style="display: inline-flex" v-if="system === 'HE'">
      <i :class="`${option ? `${$i18n.locale === 'en' ? 'el-icon-menu h4 mr-2' : 'el-icon-menu h4 ml-2'}` : `${$i18n.locale === 'en' ? 'active el-icon-menu h4  mr-2' : 'active el-icon-menu h4  ml-2'}`}`" style="font-size: 22px; cursor: pointer; margin: 0 0" @click="option = false"></i>
      <i :class="`${option ? 'active el-icon-s-grid  h4' : ' el-icon-s-grid h4'}`" style="font-size: 22px; cursor: pointer; margin: 0 0" @click="option = true"></i>
    </div>
    <CCol col="12" lg="12">
      <DataTable
        :items="$store.getters['submission/submissions']"
        @Refresh="Refresh"
        :loading="$store.getters['submission/submissionsLoad']"
        :name="$t('submission.submissions')"
        :total="$store.getters['submission/totalSubmission']"
        icon="el-icon-message"
        @show="show"
        @reset="reset"
        :role="roles"
        :hidden_action="(hasPermission('admin_submissions') || hasPermission('edit_groups')) && getSystem(system) == 2 ? false : true"
        :university_id="university"
        :system="getSystem(system)"
        :report_level="selected_level"
        :new_request="new_request"
        :organization_id="localOrganization ? localOrganization : organization"
        :decision_id="decision"
        :type_id="type"
        :sc_level="sc_level"
        :report_id="selected_report"
        :option="option"
        :visit_type="visit_type"
        :user="user"
        :group_id="group_id"
        :educationType="educationType"
        :showSelected="showSelected"
        :user_id="user_id"
        :dayType="dayType"
        :SCgender="SCgender"
        :stage="stage"
        submissions
        :directorate="directorate"
        :administration="administration"
        :range="dateRange ? dateRange.toString() : ''"
        :visitRange="visitDateRange ? visitDateRange.toString() : ''"
        :archive_select_item="selectedSubmissions.length"
        permission="admin_submissions"
        :reports="hasPermission('admin_system') ? true : false"
        v-if="hasPermission('show_submissions')"
      >
        <template #reports>
          <el-tooltip v-if="hasPermission('admin_system')" class="mx-2" :content="$t('Global.downloadReports')" placement="top">
            <el-button type="primary" size="mini" @click="openReportsDialog()" icon="el-icon-document" circle></el-button>
          </el-tooltip>
        </template>
        <template #action_table>
          <!-- <div class="item" v-if="hasPermission('admin_submissions') && system === 'HE'" @click="$router.push(`/higher/submissions/add/${getSystem(system)}`)">
            <i class="el-icon-message"></i>
            {{ $t('submission.add_request') }}
          </div> -->
          <div :class="selectedSubmissions.length ? '' : 'disabledAll'" class="item" v-if="hasPermission('edit_groups') && system === 'SC' && !group && ($store.state.user.allowPu || hasPermission('admin_system'))" @click="openDialog">
            <i class="el-icon-plus"></i>
            {{ $t('Global.addSubToGroup') }}
          </div>
          <!-- <div class="item" v-if="hasPermission('admin_submissions') && system === 'SC'"
                                   @click="$router.push(`/school/submissions/add/${getSystem(system)}`)">
                                  <i class="el-icon-message"></i>
                                  {{ $t('submission.add_request') }}
                              </div> -->

          <!-- <div class="item"><i class="el-icon-folder-opened"></i> {{ $t('users.export_file') }}</div> -->
          <!-- <div class="item"><i class="el-icon-printer"></i> {{ $t('users.export_pdf') }}</div> -->
        </template>
        <template #filter_table>
          <div class="ml-2 mr-2 mb-2 fullWidth">
            <el-select clearable :no-data-text="$t('Global.nodata')" v-model="educationType" ref="uni" :placeholder="$t('Global.selectEducationType')" style="width: 100%">
              <el-option v-if="item.system == getSystem(system)" v-for="item in $store.getters['organization/educationTypes']" :key="item.id" :label="item.name" :value="item.id">
                <span style="float: right; color: #8492a6; font-size: 13px">
                  {{ item.name }}
                  <i class="el-icon-office-building"></i>
                </span>
              </el-option>
              <template #prefix>
                <i class="el-icon-office-building" :dir="$i18n.locale === 'ar' ? 'rtl' : ''" style="font-size: 17px; line-height: 2.2; color: black; text-align: initial"></i>
              </template>
              <template #empty>
                <div class="text-center" style="padding: 10px; font-weight: bold">
                  {{ $t('Global.nodata') }}
                </div>
              </template>
            </el-select>
          </div>
          <div class="ml-2 mr-2 mb-2 fullWidth" v-if="!localOrganization && system === 'HE'">
            <el-select clearable :disabled="disabledTypes" :no-data-text="$t('Global.nodata')" v-model="university" @change="resetUni" ref="uni" filterable :placeholder="$t('Global.selectUniversity')" style="width: 100%">
              <el-option v-for="item in $store.getters['university/universities']" :key="item.id" :label="item.name" :value="item.id">
                <span style="float: right; color: #8492a6; font-size: 13px">
                  {{ item.name }}
                  <i class="el-icon-office-building"></i>
                </span>
              </el-option>
              <el-option key="new" :label="$t('Global.other')" :value="0">
                <span style="float: right; color: #8492a6; font-size: 13px">
                  <span style="float: right; color: #8492a6; font-size: 13px">
                    {{ $t('Global.other') }}
                    <i class="el-icon-office-building"></i>
                  </span>
                </span>
              </el-option>
              <template #prefix>
                <i class="el-icon-office-building" :dir="$i18n.locale === 'ar' ? 'rtl' : ''" style="font-size: 17px; line-height: 2.2; color: black; text-align: initial"></i>
              </template>
              <template #empty>
                <div class="text-center" style="padding: 10px; font-weight: bold">
                  {{ $t('Global.nodata') }}
                </div>
              </template>
            </el-select>
          </div>
          <div class="ml-2 mr-2 mb-2 fullWidth" v-if="!localOrganization && system === 'HE'">
            <el-select clearable :no-data-text="$t('Global.nodata')" v-model="organization" filterable ref="org" :disabled="disabled" :placeholder="$t('Global.selectOrganization')" style="width: 100%">
              <el-option v-for="item in $store.getters['organization/organizations']" :key="item.id" :label="item.name" :value="item.id">
                <span style="float: right; color: #8492a6; font-size: 13px">
                  {{ item.name }}
                  <i class="el-icon-school"></i>
                </span>
              </el-option>
              <el-option key="new" :label="$t('Global.other')" :value="0">
                <span style="float: right; color: #8492a6; font-size: 13px">
                  <span style="float: right; color: #8492a6; font-size: 13px">
                    {{ $t('Global.other') }}
                    <i class="el-icon-school"></i>
                  </span>
                </span>
              </el-option>
              <template #prefix>
                <i class="el-icon-school" :dir="$i18n.locale === 'ar' ? 'rtl' : ''" style="font-size: 17px; line-height: 2.2; color: black; text-align: initial"></i>
              </template>
              <template #empty>
                <div class="text-center" style="padding: 10px; font-weight: bold">
                  {{ $t('Global.nodata') }}
                </div>
              </template>
            </el-select>
          </div>
          <div class="ml-2 mr-2 mb-2 fullWidth" v-if="!localOrganization && system === 'SC'">
            <el-select multiple clearable :no-data-text="$t('Global.nodata')" v-model="directorate" @change="resetUni" ref="directorate" filterable :placeholder="$t('Global.directorate')" style="width: 100%">
              <el-option v-for="item in $store.getters['directorate/directorates']" :key="item.id" :label="item.name" :value="item.id">
                <span style="float: right; color: #8492a6; font-size: 13px">
                  {{ item.name }}
                  <i class="el-icon-office-building"></i>
                </span>
              </el-option>
              <template #prefix>
                <i class="el-icon-office-building" :dir="$i18n.locale === 'ar' ? 'rtl' : ''" style="font-size: 17px; line-height: 2.2; color: black; text-align: initial"></i>
              </template>
              <template #empty>
                <div class="text-center" style="padding: 10px; font-weight: bold">
                  {{ $t('Global.nodata') }}
                </div>
              </template>
            </el-select>
          </div>
          <div class="ml-2 mr-2 mb-2 fullWidth" v-if="!localOrganization && system === 'SC'">
            <el-select clearable :no-data-text="$t('Global.nodata')" v-model="administration" filterable ref="administration" :disabled="disabled" :placeholder="educationType == 2 || educationType == 4 ? $t('Global.azhar_area') : $t('Global.administration')" style="width: 100%">
              <el-option v-for="item in $store.getters['directorate/institutes']" :key="item.id" :label="item.name" :value="item.id">
                <span style="float: right; color: #8492a6; font-size: 13px">
                  {{ item.name }}
                  <i class="el-icon-school"></i>
                </span>
              </el-option>
              <template #prefix>
                <i class="el-icon-school" :dir="$i18n.locale === 'ar' ? 'rtl' : ''" style="font-size: 17px; line-height: 2.2; color: black; text-align: initial"></i>
              </template>
              <template #empty>
                <div class="text-center" style="padding: 10px; font-weight: bold">
                  {{ $t('Global.nodata') }}
                </div>
              </template>
            </el-select>
          </div>
          <div class="ml-2 mr-2 mb-2 fullWidth" v-if="!localOrganization && system === 'SC'">
            <el-select clearable :no-data-text="$t('Global.nodata')" v-model="dayType" @change="resetUni" ref="dayType" filterable :placeholder="$t('Global.dayType')" style="width: 100%">
              <el-option v-for="item in $store.getters['submission/dayType']" :key="item.id" :label="item.name" :value="item.id">
                <span style="float: right; color: #8492a6; font-size: 13px">
                  {{ item.name }}
                  <i class="el-icon-office-building"></i>
                </span>
              </el-option>
              <template #prefix>
                <i class="el-icon-office-building" :dir="$i18n.locale === 'ar' ? 'rtl' : ''" style="font-size: 17px; line-height: 2.2; color: black; text-align: initial"></i>
              </template>
              <template #empty>
                <div class="text-center" style="padding: 10px; font-weight: bold">
                  {{ $t('Global.nodata') }}
                </div>
              </template>
            </el-select>
          </div>
          <div class="ml-2 mr-2 mb-2 fullWidth position-relative">
            <el-date-picker clearable popper-class="custom-date-picker switch_date_picker" class="fullWidth" v-model="dateRange" type="daterange" format="yy-MM-d" value-format="yyyy-MM-d" unlink-panels :start-placeholder="$t('Global.from')" :end-placeholder="$t('Global.to')"></el-date-picker>
            <CBadge class="topRight position-absolute" style="font-size: 9px !important" color="info badge-pill">{{ $t('Global.decision') }} </CBadge>
          </div>
          <!--                    <div class="ml-2 mr-2 mb-2 fullWidth position-relative">-->
          <!--                        <el-date-picker clearable popper-class="custom-date-picker switch_date_picker" class="fullWidth"-->
          <!--                                        v-model="visitDateRange" type="daterange" format="yy-MM-d" value-format="yyyy-MM-d"-->
          <!--                                        unlink-panels :start-placeholder="$t('Global.from')"-->
          <!--                                        :end-placeholder="$t('Global.to')">-->
          <!--                                        </el-date-picker>-->
          <!--                                        <CBadge class="topRight position-absolute" style="font-size: 9px !important;" color="info badge-pill">{{ $t('Global.visit') }}</CBadge>-->

          <!--                    </div>-->
          <div class="ml-2 mr-2 mb-2 fullWidth" v-if="!localOrganization && system === 'SC'">
            <el-select clearable :no-data-text="$t('Global.nodata')" v-model="SCgender" @change="resetUni" ref="SCgender" filterable :placeholder="$t('Global.SCgender')" style="width: 100%">
              <el-option v-for="item in $store.getters['submission/SCgender']" :key="item.id" :label="item.name" :value="item.id">
                <span style="float: right; color: #8492a6; font-size: 13px">
                  {{ item.name }}
                  <i class="el-icon-office-building"></i>
                </span>
              </el-option>
              <template #prefix>
                <i class="el-icon-office-building" :dir="$i18n.locale === 'ar' ? 'rtl' : ''" style="font-size: 17px; line-height: 2.2; color: black; text-align: initial"></i>
              </template>
              <template #empty>
                <div class="text-center" style="padding: 10px; font-weight: bold">
                  {{ $t('Global.nodata') }}
                </div>
              </template>
            </el-select>
          </div>
          <div class="ml-2 mr-2 mb-2 fullWidth" v-if="!localOrganization && system === 'SC'">
            <el-select clearable :no-data-text="$t('Global.nodata')" v-model="stage" @change="resetUni" ref="stage" filterable :placeholder="$t('Global.stage')" style="width: 100%">
              <el-option v-for="item in getStage" :key="item.id" :label="item.name" :value="item.id">
                <span style="float: right; color: #8492a6; font-size: 13px">
                  {{ item.name }}
                </span>
              </el-option>
              <template #prefix>
                <i class="el-icon-office-building" :dir="$i18n.locale === 'ar' ? 'rtl' : ''" style="font-size: 17px; line-height: 2.2; color: black; text-align: initial"></i>
              </template>
              <template #empty>
                <div class="text-center" style="padding: 10px; font-weight: bold">
                  {{ $t('Global.nodata') }}
                </div>
              </template>
            </el-select>
          </div>
          <div class="ml-2 mr-2 mb-2 fullWidth" >
            <el-select clearable filterable :no-data-text="$t('Global.nodata')" ref="level" :placeholder="$t('Global.submission_level')" style="width: 100%" v-model="sc_level">
              <el-option-group :label="$t('Global.selectLevelReport')" style="text-align: center">
                <el-option v-for="item in subLevels" :key="item.id" :label="item.name" :value="item.id">
                  <span style="float: right; font-size: 13px">
                    {{ item.name }}
                  </span>
                </el-option>
              </el-option-group>
              <el-option-group :label="$t('Global.selectSubDecisions')" style="text-align: center">
                <el-option v-for="item in subDecisions" :key="item.id" :label="item.name" :value="item.id">
                  <span style="float: right; font-size: 13px">
                    {{ item.name }}
                  </span>
                </el-option>
              </el-option-group>
              <template #empty>
                <div class="text-center" style="padding: 10px; font-weight: bold">
                  {{ $t('Global.nodata') }}
                </div>
              </template>
            </el-select>
          </div>
          <div class="ml-2 mr-2 mb-2 fullWidth" v-if="hasPermission('all_submissions')">
            <div v-if="system === 'HE'">
            <el-select clearable filterable :no-data-text="$t('Global.nodata')" ref="level" :placeholder="$t('Global.decisionAndLevel')" style="width: 100%" v-model="level">
              <el-option-group v-for="(group, key) in $store.getters['submission/allAlerts']" :label="$t(`Global.group_${key}`)" class="cuctom_select_group">
                <el-option-group v-for="(subgroup, subkey) in group" :data-name="key == 1 ? $t(`Global.state_${subkey}`) + '-' : $t(`Global.approvals_status_${subkey}`) + '-'" class="cuctom_select">
                  <el-option v-for="item in subgroup" :key="item.id" :label="item.title" :value="item.flag == 1 ? item.id : `r/${item.id}`" class="pr-2">
                    <span style="float: right; font-size: 13px">
                      {{ item.title }}
                    </span>
                  </el-option>
                </el-option-group>
              </el-option-group>
              <el-option-group class="cuctom_select_group" :label="$t('Global.decision')" style="text-align: center">
                <el-option v-for="item in $store.getters['submission/decisions']" :key="item.id" :label="item.name" :value="`d/${item.id}`">
                  <span style="float: right; font-size: 13px">
                    {{ item.name }}
                  </span>
                </el-option>
              </el-option-group>
              <template #empty>
                <div class="text-center" style="padding: 10px; font-weight: bold">
                  {{ $t('Global.nodata') }}
                </div>
              </template>
            </el-select>
            </div>
            <div v-if="system === 'SC'">
            <el-select clearable filterable :no-data-text="$t('Global.nodata')" ref="level" :placeholder="$t('Global.decisionAndLevel')" style="width: 100%" v-model="level">
              <el-option-group v-for="(group, key) in $store.getters['submission/allAlerts']" :label="$t(`Global.group_${key}`)" class="cuctom_select_group">
                <el-option-group v-for="(subgroup, subkey) in group" :data-name="key == 1 ? $t(`Global.state_${subkey}`) + '-' : $t(`Global.approvals_status_${subkey}`) + '-'" class="cuctom_select">
                  <el-option v-for="item in subgroup" :key="item.id" :label="item.title" :value="item.type == 1 ? item.id : `r/${item.id}`" class="pr-2">
                    <span style="float: right; font-size: 13px">
                      {{ item.title }}
                    </span>
                  </el-option>
                </el-option-group>
              </el-option-group>
              <el-option-group class="cuctom_select_group" :label="$t('Global.decision')" style="text-align: center">
                <el-option v-for="item in $store.getters['submission/decisions']" :key="item.id" :label="item.name" :value="`d/${item.id}`">
                  <span style="float: right; font-size: 13px">
                    {{ item.name }}
                  </span>
                </el-option>
              </el-option-group>
              <template #empty>
                <div class="text-center" style="padding: 10px; font-weight: bold">
                  {{ $t('Global.nodata') }}
                </div>
              </template>
            </el-select>
            </div>
            
          </div>
          <div class="ml-2 mr-2 mb-2 fullWidth" v-if="system === 'HE'">
            <el-select clearable :no-data-text="$t('Global.nodata')" v-model="type" filterable ref="type" :placeholder="$t('Global.selectType')" style="width: 100%">
              <el-option v-for="item in $store.getters['submission/types']" :key="item.id" :label="item.name" :value="item.id">
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
          </div>
<!--          <div class="ml-2 mr-2 mb-2 fullWidth" v-if="system === 'HE'">-->
<!--            <el-select clearable filterable :no-data-text="$t('Global.nodata')" ref="level" :placeholder="$t('Global.decisionAndLevel')" style="width: 100%" v-model="level">-->
<!--              <el-option-group :label="$t('Global.selectLevelReport')" style="text-align: center">-->
<!--                <el-option v-for="item in subLevels" :key="item.id" :label="item.name" :value="item.id">-->
<!--                  <span style="float: right; font-size: 13px">-->
<!--                    {{ item.name }}-->
<!--                  </span>-->
<!--                </el-option>-->
<!--              </el-option-group>-->
<!--              <el-option-group :label="$t('Global.selectSubDecisions')" style="text-align: center">-->
<!--                <el-option v-for="item in subDecisions" :key="item.id" :label="item.name" :value="item.id">-->
<!--                  <span style="float: right; font-size: 13px">-->
<!--                    {{ item.name }}-->
<!--                  </span>-->
<!--                </el-option>-->
<!--              </el-option-group>-->
<!--              <el-option-group :label="$t('Global.decision')" style="text-align: center">-->
<!--                <el-option v-for="item in $store.getters['submission/decisions']" :key="item.id" :label="item.name" :value="`d/${item.id}`">-->
<!--                  <span style="float: right; font-size: 13px">-->
<!--                    {{ item.name }}-->
<!--                  </span>-->
<!--                </el-option>-->
<!--              </el-option-group>-->
<!--              <template #empty>-->
<!--                <div class="text-center" style="padding: 10px; font-weight: bold">-->
<!--                  {{ $t('Global.nodata') }}-->
<!--                </div>-->
<!--              </template>-->
<!--            </el-select>-->
<!--          </div>-->
          <div class="ml-2 mr-2 mb-2 fullWidth">
            <el-select multiple clearable :no-data-text="$t('Global.nodata')" v-model="visit_type" filterable ref="visit_type" :placeholder="$t('Global.visit_type')" style="width: 100%">
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
          </div>
          <div class="ml-2 mr-2 mb-2 fullWidth position-relative">
            <el-date-picker clearable popper-class="custom-date-picker switch_date_picker" class="fullWidth" v-model="visitDateRange" type="daterange" format="yy-MM-d" value-format="yyyy-MM-d" unlink-panels :start-placeholder="$t('Global.from')" :end-placeholder="$t('Global.to')"></el-date-picker>
            <CBadge class="topRight position-absolute" style="font-size: 9px !important" color="info badge-pill">{{ $t('Global.visit') }} </CBadge>
          </div>
          <div class="ml-2 mr-2 mb-2 fullWidth" v-if="hasPermission('all_submissions')">
            <el-select clearable ref="new_request" :no-data-text="$t('Global.nodata')" v-model="new_request" style="width: 100%">
              <el-option class="el-input" :value="3" :label="$t('Global.new_request')">
                <span style="float: right; color: #8492a6; font-size: 13px">
                  {{ $t('Global.new_request') }}
                </span>
              </el-option>
              <el-option class="el-input" :value="1" :label="$t('Global.old_request')">
                <span style="float: right; color: #8492a6; font-size: 13px">
                  {{ $t('Global.old_request') }}
                </span>
              </el-option>
              <el-option class="el-input" :value="2" :label="$t('Global.all_request')">
                <span style="float: right; color: #8492a6; font-size: 13px">
                  {{ $t('Global.all_request') }}
                </span>
              </el-option>
              <template #empty>
                <div class="text-center" style="padding: 10px; font-weight: bold">
                  {{ $t('Global.nodata') }}
                </div>
              </template>
            </el-select>
          </div>
          <div class="ml-2 mr-2 mb-2 fullWidth" v-if="system === 'HE'">
            <el-select clearable ref="representative_id" :placeholder="$t('Global.user')" :no-data-text="$t('Global.nodata')" style="width: 100%" v-model="user_id" filterable remote reserve-keyword :remote-method="search" :loading="$store.getters['archive/usersLoad']">
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
          </div>
          <div class="ml-2 mr-2 mb-2 fullWidth" v-if="system === 'HE'">
            <el-select ref="role" clearable :no-data-text="$t('Global.nodata')" :placeholder="$t('roles.selectRole')" style="width: 100%" v-model="roles" filterable>
              <el-option v-for="role in spacificRoles" :key="role.id" :label="role.name" :value="role.id">
                <span style="float: right; color: #8492a6; font-size: 13px">
                  {{ role.name }}
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
          <div v-if="!group && system != 'HE' && hasPermission('show_groups')" class="ml-2 mr-2 mb-2 fullWidth">
            <el-select clearable :no-data-text="$t('Global.nodata')" v-model="group_id" ref="uni" :placeholder="$t('Global.groups')" style="width: 100%">
              <el-option v-for="item in $store.getters['group/groups']" :key="item.id" :label="item.name" :value="item.id">
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
          </div>
        </template>
        <template #cols>
          <el-table-column v-if="system === 'SC' && hasPermission('edit_groups') && !group" prop="id" width="50" class-name="custom_check_user">
            <template slot-scope="scope">
              <el-checkbox v-if="scope.row.s_level == 4" v-model="select[scope.row.submission_id]" @change="selected(scope.row)"></el-checkbox>
              <el-checkbox v-else disabled></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column prop="submission_id" width="65" sortable label="#"></el-table-column>
          <el-table-column prop="name" width="220" :label="$t('submission.name')" sortable>
            <template slot-scope="scope">
              <el-tooltip effect="dark" placement="top-start">
                <div slot="content">
                  <span>
                    {{ scope.row.name }} <span class="small text-muted" v-if="system === 'SC' && scope.row.institute">({{ ` ${scope.row.education_type == 2 || scope.row.education_type == 4 ? $t('Global.azhar_area') : $t('Global.institute')} : ${scope.row.institute}` }})</span><br />
                    <div class="small text-muted" v-if="(!scope.row.program || !option) && system === 'HE'">
                      {{ `${scope.row.university}` }} | {{ scope.row.old_id ? `( ${$t('Global.oldId')} : ${scope.row.old_id})` : '' }} | {{ `${$t('Global.submitted_at')} :  ${toLocalDatetime(scope.row.created_at, 'ar', false)}` }}
                    </div>

                    <div class="small text-muted" v-if="scope.row.program && option && system === 'HE'">
                      <br />
                      {{ `${scope.row.program}` }} | {{ `${$t('Global.submitted_at')} :  ${toLocalDatetime(scope.row.created_at, 'ar', false)}` }}
                    </div>
                    <span class="small text-muted" v-if="system === 'SC'">
                      {{ scope.row.old_id ? `( ${$t('Global.oldId')} :${scope.row.old_id}) |` : '' }}
                      {{ `${$t('Global.submitted_at')} :${scope.row.created_at ? toLocalDatetime(scope.row.created_at, 'ar', false) : '_'}` }}
                    </span>
                  </span>
                </div>

                <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 100%">
                  <span class="font-weight-bolder">
                    {{ scope.row.name }}
                    <span class="small text-muted" v-if="scope.row.program && option && system === 'HE'">({{ `${scope.row.university}` }})</span>
                    <span class="small text-muted" v-if="system === 'SC' && scope.row.institute">({{ `${scope.row.education_type == 2 || scope.row.education_type == 4 ? $t('Global.azhar_area') : $t('Global.institute')} : ${scope.row.institute}` }})</span>
                  </span>
                  <div class="small text-muted" v-if="scope.row.program && option && system === 'HE'">
                    {{ `${scope.row.program}`
                    }}{{
                      scope.row.old_id
                        ? `( ${$t('Global.oldId')}
                                        :${scope.row.old_id})`
                        : ''
                    }}
                    |
                    {{ `${$t('Global.submitted_at')} :${toLocalDatetime(scope.row.created_at, 'ar', false)}` }}
                  </div>
                  <div class="small text-muted" v-if="(!scope.row.program || !option) && system === 'HE'">
                    {{ `${scope.row.university}`
                    }}{{
                      scope.row.old_id
                        ? `( ${$t('Global.oldId')}
                                        :${scope.row.old_id})`
                        : ''
                    }}
                    |
                    {{ `${$t('Global.submitted_at')} :${toLocalDatetime(scope.row.created_at, 'ar', false)}` }}
                  </div>
                  <div class="small text-muted" v-if="system === 'SC'">
                    {{ scope.row.old_id ? `( ${$t('Global.oldId')} :${scope.row.old_id}) |` : '' }}
                    {{ `${$t('Global.submitted_at')} :${scope.row.created_at ? toLocalDatetime(scope.row.created_at, 'ar', false) : '_'}` }}
                  </div>
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="gender_type" sortable :label="$t('Global.gender_type')" v-if="system === 'SC'"></el-table-column>
          <!--          <el-table-column prop="institute" sortable :label="$t('Global.institute')" v-if="system === 'SC'"></el-table-column>-->
          <!--          <el-table-column prop="school_code" sortable :label="$t('Global.school_code')" v-if="system === 'SC'"></el-table-column>-->
          <el-table-column prop="stage" sortable :label="$t('Global.stage')" v-if="system === 'SC'"></el-table-column>
          <el-table-column prop="type" sortable :label="$t('Global.type')" v-if="system === 'HE'">
            <template slot-scope="scope">
              <el-tooltip effect="dark" :content="scope.row.type" placement="top-start">
                <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 100%">
                  {{ scope.row.type }}
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="visit_type" sortable :label="$t('Global.visit_type')">
            <template slot-scope="scope">
              <el-tooltip effect="dark" :content="scope.row.visit_type" placement="top-start">
                <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 100%">
                  {{ scope.row.visit_type }}
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="start" sortable :label="$t('Global.start_at')" v-if="system === 'SC'">
            <template slot-scope="scope">
              <div>{{ scope.row.start ? DateFormat(scope.row.start) : `${$t('Global.noAction')}` }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="expiration" sortable :label="$t('Global.ends_at')" v-if="system === 'SC'">
            <template slot-scope="scope">
              <div>{{ scope.row.expiration ? DateFormat(scope.row.expiration) : `${$t('Global.noAction')}` }}</div>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="decision" sortable :label="$t('Global.Decision')" v-if="system === 'SC'">
                                <template slot-scope="scope">
                                  <el-tooltip effect="dark" :content="`${scope.row.decision ? scope.row.decision : `${$t('Global.noAction')}`}${scope.row.number ? `(${scope.row.number})` : ''}`" placement="top-start">
                                    <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 100%">
                                      <CBadge :color="scope.row.decision === null ? 'danger' : scope.row.decision === 'إعتماد' ? 'success' : 'warning'">
                                        {{ scope.row.decision ? scope.row.decision : `${$t('Global.noAction')}` }}
                                        {{ scope.row.number ? `(${scope.row.number})` : '' }}
                                      </CBadge>
                                    </div>
                                  </el-tooltip>
                                </template>
                              </el-table-column> -->
          <el-table-column prop="start" sortable :label="$t('Global.start_at')" v-if="system === 'HE'">
            <template slot-scope="scope">
              <div v-if="!option">{{ scope.row.evaluations[0] && scope.row.evaluations[0].start ? DateFormat(scope.row.evaluations[0].start) : `${$t('Global.noAction')}` }}</div>
              <div v-else>{{ scope.row.start ? DateFormat(scope.row.start) : `${$t('Global.noAction')}` }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="expiration" sortable :label="$t('Global.ends_at')" v-if="system === 'HE'">
            <template slot-scope="scope">
              <div v-if="!option">{{ scope.row.evaluations[0] && scope.row.evaluations[0].expiration ? DateFormat(scope.row.evaluations[0].expiration) : `${$t('Global.noAction')}` }}</div>
              <div v-else>{{ scope.row.expiration ? DateFormat(scope.row.expiration) : `${$t('Global.noAction')}` }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="updated_at" width="100" sortable :label="$t('Global.updated')">
            <template slot-scope="scope">
              <div v-if="!option">
                <div v-if="scope.row.updated_at">
                  <small class="d-block">{{ DateFormat(scope.row.updated_at) }}</small>
                  <CBadge color="info" dir="ltr" class="text-center" style="font-size: 10px"><i class="el-icon-time"></i> {{ scope.row.diffDate }} </CBadge>
                </div>
                <div v-else class="text-center">_</div>
              </div>
              <div v-else>
                <small class="d-block">{{ DateFormat(scope.row.eupdate_at) }}</small>
                <CBadge color="info" dir="ltr" class="text-center" style="font-size: 10px"><i class="el-icon-time"></i> {{ scope.row.ediffDate }} </CBadge>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="decision" width="150" :label="$t('Global.decisionAndLevel')">
            <template slot-scope="scope">
<!--              <el-tooltip-->
<!--                v-if="(system == 'HE' && scope.row.evaluations[0] && !scope.row.evaluations[0].decision) || (system == 'HE' && !scope.row.decision)"-->
<!--                effect="dark"-->
<!--                :content="scope.row.report_level ? $t(`Global.approvals_status_${scope.row.report_level}`) : $t(`Global.state_${scope.row.status}`)"-->
<!--                placement="top-start"-->
<!--              >-->
<!--                <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 100%">-->
<!--                  <CBadge color="info" class="ml-1" v-if="scope.row.report_level">{{ scope.row.report_level ? $t(`Global.approvals_status_${scope.row.report_level}`) : '' }} </CBadge>-->
<!--                  <CBadge color="info" class="ml-1" v-if="!scope.row.report_level">{{ scope.row.status ? $t(`Global.state_${scope.row.status}`) : '' }} </CBadge>-->
<!--                  &lt;!&ndash; <CBadge color="success" v-if="scope.row.report_level < 6 && scope.row.decision">{{ $t('Global.old_system') }}</CBadge> &ndash;&gt;-->
<!--                </div>-->
<!--              </el-tooltip>-->
              <el-tooltip v-if="hasPermission('all_submissions') && !scope.row.decision" effect="dark" :content="scope.row.alert ? scope.row.alert : null" placement="top-start">
                <div  style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 100%">
                  <CBadge color="info" class="ml-1" v-if="!scope.row.decision">{{ scope.row.alert ? scope.row.alert : null }} </CBadge>
                </div>
              </el-tooltip>
              <el-tooltip v-else-if="!scope.row.decision" effect="dark" :content="scope.row.e_level ? $t(`Global.approvals_status_${scope.row.e_level}`) : $t(`Global.state_${scope.row.s_level}`)" placement="top-start">
                <div  style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 100%">
                  <CBadge color="info" class="ml-1" v-if="!scope.row.decision"> {{ scope.row.e_level ? $t(`Global.approvals_status_${scope.row.e_level}`) : $t(`Global.state_${scope.row.s_level}`) }} </CBadge>
                </div>
              </el-tooltip>
              <el-tooltip v-if="!option && scope.row.evaluations[0]" effect="dark" :content="`${scope.row.evaluations[0].decision ? scope.row.evaluations[0].decision : `${$t('Global.noAction')}`}${scope.row.number ? `(${scope.row.number})` : ''}`" placement="top-start">
                <div v-if="scope.row.evaluations[0].decision" style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 100%">
                  <CBadge :color="scope.row.evaluations[0] && scope.row.evaluations[0].decision === null ? 'danger' : scope.row.evaluations[0].decision === 'اعتماد' || scope.row.decision == 'إعتماد' ? 'success' : scope.row.decision == 'انتهاء صلاحية قرار الاعتماد'  || scope.row.decision == 'إنتهاء صلاحية الاعتماد' ? 'dark' : 'warning'">
                    {{ scope.row.evaluations[0] && scope.row.evaluations[0].decision ? scope.row.evaluations[0].decision : `${$t('Global.noAction')}` }}
                    {{ scope.row.number ? `(${scope.row.number})` : '' }}
                  </CBadge>
                  <CBadge class="m-1" color="info" v-if="scope.row.init_decision && hasPermission('all_submissions')"> {{ $t('Global.tempDecision') }} - {{ scope.row.init_decision }} </CBadge>
                </div>
              </el-tooltip>
              <el-tooltip v-else effect="dark" :content="`${scope.row.decision ? scope.row.decision : `${$t('Global.noAction')}`}${scope.row.number ? `(${scope.row.number})` : ''}`" placement="top-start">
                <div v-if="scope.row.decision" style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 100%">
                  <CBadge :color="scope.row.decision === null ? 'danger' : scope.row.decision === 'اعتماد' || scope.row.decision == 'إعتماد' ? 'success' : scope.row.decision == 'انتهاء صلاحية قرار الاعتماد' || scope.row.decision == 'إنتهاء صلاحية الاعتماد' ? 'dark' : 'warning'">
                    {{ scope.row.decision ? scope.row.decision : `${$t('Global.noAction')}` }}
                    {{ scope.row.number ? `(${scope.row.number})` : '' }}
                  </CBadge>
                </div>
              </el-tooltip>
              <CBadge class="m-1" color="info" v-if="scope.row.init_decision && !scope.row.decision && hasPermission('all_submissions')"> {{ $t('Global.tempDecision') }} - {{ scope.row.init_decision }} </CBadge>
            </template>
          </el-table-column>
          <el-table-column width="70" prop="" label=" ">
            <template slot-scope="scope">
              <div :style="$i18n.locale === 'ar' ? 'text-align:left' : 'float: right;'">
                <router-link v-if="system === 'HE' && hasPermission('decision_approval') && scope.row.evaluation_type != 3 && scope.row.report_level && scope.row.report_level == 6" class="mx-1" :to="show(scope.row, 'toLevel')">
                  <el-button type="success" size="mini" class="xs_mini" icon="el-icon-school" circle></el-button>
                </router-link>
                <router-link v-if="system === 'SC' && scope.row.e_level == 6 && hasPermission('decision_approval')" class="mx-1" :to="`/school/submissions/council/${scope.row.evaluation_id}`">
                  <el-button type="success" size="mini" class="xs_mini" icon="el-icon-school" circle></el-button>
                </router-link>
                <router-link :to="show(scope.row)">
                  <el-button type="primary" size="mini" class="xs_mini" icon="el-icon-view" circle></el-button>
                </router-link>
                <el-tooltip effect="dark" :content="$t('Global.delay')" placement="top">
                  <el-button type="danger" v-if="group" @click="removeFGroup(scope.row.submission_id)" size="mini" class="xs_mini mr-2" icon="el-icon-delete" circle></el-button>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column v-if="!option && system === 'HE'" type="expand">
            <template slot-scope="props">
              <el-table :data="props.row.evaluations" class="hidden" style="width: 100%" v-if="props.row.program" :header-cell-class-name="$i18n.locale === 'ar' ? 'text-right' : ''" :cell-class-name="$i18n.locale === 'ar' ? 'text-right' : ''">
                <el-table-column prop="program" :label="$t('Global.program_name')" width="400"></el-table-column>
                <el-table-column prop="start" :label="$t('Global.start_at')">
                  <template slot-scope="scope">
                    {{ scope.row.start ? DateFormat(scope.row.start) : `${$t('Global.noAction')}` }}
                  </template>
                </el-table-column>
                <el-table-column prop="expiration" :label="$t('Global.ends_at')">
                  <template slot-scope="scope">
                    {{ scope.row.expiration ? DateFormat(scope.row.expiration) : `${$t('Global.noAction')}` }}
                  </template>
                </el-table-column>
                <el-table-column prop="expiration" :label="$t('Global.updated')">
                  <template slot-scope="scope">
                    <small class="d-block">{{ toLocalDatetime(scope.row.updated_at, 'ar', false) }}</small>
                  </template>
                </el-table-column>
                <el-table-column prop="level" :label="$t('Global.selectLevelReport')">
                  <template slot-scope="scope">
                    <el-tooltip effect="dark" :content=" scope.row.stage ? scope.row.stage : $t('Global.notInitReportFinish')" placement="top-start">
                      <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 100%">
                        <CBadge color="info">{{ scope.row.stage ? scope.row.stage : $t('Global.notInitReportFinish') }} </CBadge>
                      </div>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column width="160" prop="decision" :label="$t('Global.Decision')">
                  <template slot-scope="scope">
                    <el-tooltip effect="dark" :content="scope.row.decision ? scope.row.decision : `${$t('Global.noAction')}`" placement="top-start">
                      <CBadge :color="scope.row.decision === null ? 'danger' : scope.row.decision === 'اعتماد' ? 'success' : scope.row.decision == 'انتهاء صلاحية قرار الاعتماد' ? 'dark' : 'warning'">
                        {{ scope.row.decision ? scope.row.decision : `${$t('Global.noAction')}` }}
                      </CBadge>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column prop="" label=" ">
                  <template slot-scope="scope">
                    <div :style="$i18n.locale === 'ar' ? 'text-align:left' : 'float: right;'">
                      <router-link v-if="system === 'HE' && hasPermission('decision_approval') && scope.row.report_level && scope.row.report_level == 6" class="mx-1" :to="show(props.row, 'toLevel')">
                        <el-button type="success" size="mini" class="xs_mini" icon="el-icon-view" circle></el-button>
                      </router-link>
                      <router-link :to="`/higher/submissions/submission/${props.row.submission_id}/${scope.row.evaluation_id}`">
                        <!-- <i class="el-icon-view table-action-item"></i> -->
                        <el-button type="primary" size="mini" class="xs_mini" icon="el-icon-view" circle></el-button>
                      </router-link>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
        </template>
      </DataTable>
    </CCol>
    <el-dialog :title="$t('Global.groupsDetials')" :visible.sync="dialogVisible" width="300">
      <el-form label-position="top" :model="ruleForm" status-icon size="large" ref="ruleForm" label-width="120px" class="stateForm demo-ruleForm">
        <el-form-item class="mb-0" :rules="validation(null, 1)" :label="$t('Global.groups')" style="width: 100%" prop="group">
          <el-select class="mb-3" v-model="ruleForm.group" filterable :placeholder="$t('Global.groups')" style="width: 100%">
            <el-option v-for="item in $store.getters['group/groups']" :key="item.id" :label="item.name" :value="item.id">
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{ item.name }}
              </span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <span slot="footer"  class="dialog-footer" style="display: flex">
        <el-button @click="addSubToGroup('ruleForm')" round size="mini" class="mx-1 right_icon" type="primary">{{ $t('Global.accept') }}</el-button>
        <el-button class="ml-1 mr-1" @click="dialogVisible = false" round size="small">{{ $t('Global.discard') }}</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="$t('Global.downloadReports')" :visible.sync="reportsDialog" width="300">
      <el-tabs v-loading="isLoad" :class="isLoad ? 'disabledAll' : ''" v-model="activeNameSelected" type="card" class="right" dir="rtl" tab-position="top" stretch>
        <el-tab-pane name="1">
          <span slot="label"> <fa-icon :icon="['fas', 'file-pdf']" size="lg" /> {{ 'PDF' }}</span>
          <div v-if="getSystem(system) == 2">
            <div class="item mt-2" @click="exportPdf(1, $t('Global.decisionsPdf'))" v-if="hasPermission('admin_system')">
              <fa-icon :icon="['fas', 'file-pdf']" size="lg" />
              {{ $t('Global.decisionsPdf') }}
            </div>
            <div class="item" @click="exportPdf(2, $t('Global.groupsPdf'))" v-if="hasPermission('admin_system')">
              <fa-icon :icon="['fas', 'file-pdf']" size="lg" />
              {{ $t('Global.groupsPdf') }}
            </div>
            <div class="item" @click="exportPdf(3, $t('Global.schoolsPdf'))" v-if="hasPermission('admin_system')">
              <fa-icon :icon="['fas', 'file-pdf']" size="lg" />
              {{ $t('Global.schoolsPdf') }}
            </div>
            <div class="item" @click="exportHEPdf('institutes', $t('Global.azharinstitutes'))" v-if="hasPermission('admin_system')">
              <fa-icon :icon="['fas', 'file-pdf']" size="lg" />
              {{ $t('Global.azharinstitutes') }}
            </div>
          </div>

          <div v-if="getSystem(system) == 1">
            <div class="item mt-2" @click="exportHEPdf('trackStatusOrder', $t('Global.trackStatusOrder'))" v-if="hasPermission('admin_system')">
              <fa-icon :icon="['fas', 'file-pdf']" size="lg" />
              {{ $t('Global.trackStatusOrder') }}
            </div>
            <div class="item" @click="exportHEPdf('collageCalssification', $t('Global.collageCalssification'))" v-if="hasPermission('admin_system')">
              <fa-icon :icon="['fas', 'file-pdf']" size="lg" />
              {{ $t('Global.collageCalssification') }}
            </div> 
            <div class="item" @click="exportHEPdf('AccreditedAzharColleges', $t('Global.AccreditedAzharColleges'))" v-if="hasPermission('admin_system')">
              <fa-icon :icon="['fas', 'file-pdf']" size="lg" />
              {{ $t('Global.AccreditedAzharColleges') }}
            </div>
            <div class="item" @click="exportHEPdf('dayReport', $t('Global.dayReport'))" v-if="hasPermission('admin_system')">
              <fa-icon :icon="['fas', 'file-pdf']" size="lg" />
              {{ $t('Global.dayReport') }}
            </div>
             <div class="item" @click="exportHEPdf('EvaluationOrderValuationTrackingReport', $t('Global.EvaluationOrderValuationTrackingReport'))" v-if="hasPermission('admin_system')">
              <fa-icon :icon="['fas', 'file-pdf']" size="lg" />
              {{ $t('Global.EvaluationOrderValuationTrackingReport') }}
            </div>
             <div class="item" @click="exportHEPdf('collageReport', $t('Global.collageReport'))" v-if="hasPermission('admin_system')">
              <fa-icon :icon="['fas', 'file-pdf']" size="lg" />
              {{ $t('Global.collageReport') }}
            </div>  
          </div>
        </el-tab-pane>
        <el-tab-pane name="2" v-if="getSystem(system) == 2">
          <span slot="label"> <fa-icon :icon="['fas', 'file-word']" size="lg" /> {{ 'WORD' }}</span>
          <div class="item mt-2" @click="exportWord(1, $t('Global.decisionsPdf'))" v-if="hasPermission('admin_system')">
            <fa-icon :icon="['fas', 'file-word']" size="lg" />
            {{ $t('Global.decisionsPdf') }}
          </div>
          <div class="item" @click="exportWord(2, $t('Global.groupsPdf'))" v-if="hasPermission('admin_system')">
            <fa-icon :icon="['fas', 'file-word']" size="lg" />
            {{ $t('Global.groupsPdf') }}
          </div>
          <div class="item" @click="exportWord(3, $t('Global.schoolsPdf'))" v-if="hasPermission('admin_system')">
            <fa-icon :icon="['fas', 'file-word']" size="lg" />
            {{ $t('Global.schoolsPdf') }}
          </div>
        </el-tab-pane>
        <el-tab-pane name="3" v-if="getSystem(system) == 2">
          <span slot="label"> <fa-icon :icon="['fas', 'file-excel']" size="lg" /> {{ 'EXCEL' }}</span>
          <div class="item mt-2" @click="exportData($t('Global.excelSubmissionFileExport'))" v-if="hasPermission('admin_submissions')">
            <fa-icon :icon="['fas', 'file-excel']" size="lg" />
            {{ $t('Global.excelSubmissionFileExport') }}
          </div>
        </el-tab-pane>
      </el-tabs>

      <span :class="isLoad ? 'disabledAll' : ''" slot="footer" class="dialog-footer" style="display: flex">
        <el-button class="ml-1 mr-1" @click="reportsDialog = false" round size="small">{{ $t('Global.discard') }}</el-button>
      </span>
    </el-dialog>
  </CRow>
</template>

<script>
import DataTable from './DataTable';
import { toLocalDatetime } from '../../utils/helper';
import { EventBus } from '../../main';

export default {
  name: 'submissions',
  props: {
    user: Number,
    localOrganization: Number,
    system: String,
    group: Boolean,
    showSelected: Boolean,
  },
  data() {
    return {
      group_id: this.$store.state.group_id_sub ? this.$store.state.group_id_sub : null,
      select: [],
      selectedSubmissions: [],
      // Auth: JSON.parse(Cookies.get('user')),
      disabledTypes: this.$store.state.educationType_sub ? false : true,
      user_id: this.$store.state.user_id_sub ? this.$store.state.user_id_sub : null,
      users: [],
      visit_type: this.$store.state.visit_type ? this.$store.state.visit_type : null,
      roles: this.$store.state.roles_sub ? this.$store.state.roles_sub : null,
      picker: new Date().toISOString().substr(0, 10),
      university: this.$store.state.university_sub ? this.$store.state.university_sub : null,
      organization: this.$store.state.organization_sub ? this.$store.state.organization_sub : null,
      level: this.$store.state.decision_id ? 'd/' + this.$store.state.decision_id : this.$store.state.level_sub,
      new_request: this.$store.state.new_request ? this.$store.state.new_request : 3,
      type: this.$store.state.type_sub ? this.$store.state.type_sub : null,
      disabled: this.$store.state.university_sub || this.$store.state.directorate_id ? false : true,
      dateRange: this.$store.state.range ? this.$store.state.range : '',
      visitDateRange: this.$store.state.visitRange ? this.$store.state.visitRange : '',
      decision: this.$store.state.decision_id ? this.$store.state.decision_id : null,
      directorate: this.$store.state.directorate_id ? this.$store.state.directorate_id : null,
      administration: this.$store.state.administration ? this.$store.state.administration : null,
      dayType: this.$store.state.dayType ? this.$store.state.dayType : null,
      stage: this.$store.state.stage ? this.$store.state.stage : null,
      SCgender: this.$store.state.SCgender ? this.$store.state.SCgender : null,
      option: false,
      educationType: this.$store.state.educationType_sub ? this.$store.state.educationType_sub : null,
      selected_level: this.$store.state.level_sub ? this.$store.state.level_sub : null,
      selected_report: this.$store.state.selected_report ? this.$store.state.selected_report : null,
      search_text: '',
      sc_level: this.$store.state.sc_level_sub ? this.$store.state.sc_level_sub : null,
      removed: null,
      dialogVisible: false,
      isLoad: false,
      dateNow: Date.now(),
      activeNameSelected: '1',
      reportsDialog: false,
      ruleForm: {
        group: null,
      },
    };
  },
  watch: {
    selectedSubmissions: function (val) {
      EventBus.$emit('getSelected', val);
    },
    roles: function (val) {
      this.$store.commit('set', ['roles_sub', val]);
    },
    group_id: function (val) {
      this.group_id = val;
      this.$store.commit('set', ['group_id_sub', val]);
    },
    sc_level: function (val) {
      this.sc_level = val;
      this.$store.commit('set', ['sc_level_sub', val]);
    },
    educationType: function (val) {
      this.$store.commit('set', ['educationType_sub', val]);
      if (val || val === 0) {
        this.disabledTypes = false;
        this.university = null;
      } else {
        this.disabledTypes = true;
      }
      this.$store.dispatch('university/universities', { educationType: this.educationType });
    },
    university: function (val) {
      this.university = val;
      this.$store.commit('set', ['university_sub', val]);
      if (val || val === 0 || this.educationType) {
        this.disabled = false;
        this.$refs.uni.blur();
      } else {
        this.disabled = true;
      }
      this.$store.dispatch('organization/names', {
        query: {
          parent_id: this.university,
        },
      });
    },

    organization: function (val) {
      this.organization = val;
      this.$store.commit('set', ['organization_sub', val]);
      if (val) {
        this.$refs.org.blur();
      }
    },
    visit_type: function (val) {
      // this.visit_type = val;
      this.$store.commit('set', ['visit_type', val]);
      if (val) {
        this.$refs.visit_type.blur();
      }
    },
    type: function (val) {
      this.type = val;
      this.$store.commit('set', ['type_sub', val]);
      if (val) {
        this.$refs.type.blur();
      }
    },
    user_id: function (val) {
      this.user_id = val;
      this.$store.commit('set', ['user_id_sub', val]);
    },
    // decision: function (val) {
    //   this.decision = val;
    //   if (val) {
    //     this.$refs.decision.blur();
    //   }
    // },
    directorate: function (val) {
      this.directorate = val;
      this.$store.commit('set', ['directorate_id', val]);
      if (val || val === 0) {
        this.disabled = false;
        this.administration = null;
        this.$refs.directorate.blur();
      } else {
        this.disabled = true;
      }
      this.$store.dispatch('directorate/institutes', {
        parent_id: val,
      });
    },
    administration: function (val) {
      this.administration = val;
      this.$store.commit('set', ['administration', val]);
      if (val) {
        this.$refs.administration.blur();
      }
    },
    dayType: function (val) {
      this.dayType = val;
      this.$store.commit('set', ['dayType', val]);
      if (val) {
        this.$refs.dayType.blur();
      }
    },
    SCgender: function (val) {
      this.SCgender = val;
      this.$store.commit('set', ['SCgender', val]);
      if (val) {
        this.$refs.SCgender.blur();
      }
    },
    stage: function (val) {
      this.stage = val;
      this.$store.commit('set', ['stage', val]);
      if (val) {
        this.$refs.stage.blur();
      }
    },
    level: function (val) {
      let string;
      if (val) {
        string = val.toString();
      }
      // if (this.system == 'HE') {
      //   if (string && string.includes('d/')) {
      //     this.decision = parseInt(string.substr(2));
      //     this.$store.commit('set', ['decision_id', parseInt(string.substr(2))]);
      //     this.selected_level = null;
      //   } else {
      //     this.selected_level = val;
      //     this.decision = null;
      //     this.$store.commit('set', ['level_sub', val]);
      //     if (val) {
      //       this.$refs.level.blur();
      //     }
      //   }
      // } else {
        if (string && string.includes('r/')) {
          this.report_level = parseInt(string.substr(2));
          this.selected_level = null;
          this.decision = null;
          this.selected_report = parseInt(string.substr(2));
          this.$store.commit('set', ['selected_report', parseInt(string.substr(2))]);
          this.$store.commit('set', ['level_sub', null]);
          this.$store.commit('set', ['decision_id', null]);
        } else if (string && string.includes('d/')) {
          this.decision = parseInt(string.substr(2));
          this.$store.commit('set', ['decision_id', parseInt(string.substr(2))]);
          this.selected_level = null;
          this.selected_report = null;
          this.$store.commit('set', ['selected_report', null]);
          this.$store.commit('set', ['level_sub', null]);
        } else {
          this.selected_report = null;
          this.selected_level = val;
          this.$store.commit('set', ['decision_id', null]);
          this.$store.commit('set', ['selected_report', null]);
          this.$store.commit('set', ['level_sub', val]);
          this.report_level = null;
          this.decision = null;
        }
      // }
    },
    new_request: function (val) {
      this.new_request = val;
      this.$store.commit('set', ['new_request', val]);
      if (val) {
        this.$refs.new_request.blur();
      }
    },
  },
  computed: {
    spacificRoles: function () {
      let myRolesId = [67, 65, 81, 69];
      return this.$store.getters['archive/roles'].filter(role => myRolesId.includes(role.id));
    },
    subLevels: function () {
      return this.$store.getters['submission/levels'].slice(0, 6);
    },
    subDecisions: function () {
      return this.$store.getters['submission/levels'].slice(6, 20);
    },
    getStage: function () {
      if (!this.$store.getters['submission/stage']) return;
      if (this.$store.getters['submission/stage'][0].education_type_id) {
        if (this.educationType == 4) {
          return this.$store.getters['submission/stage'].filter(t => t.education_type_id == 2);
        } else {
          return this.$store.getters['submission/stage'].filter(t => t.education_type_id == 1);
        }
      } else {
        return this.$store.getters['submission/stage'];
      }
    },
  },
  components: { DataTable },
  mounted() {
    if (this.system == 'HE') {
      this.$store.dispatch('university/universities');
      this.usersRoles();
    } else {
      this.$store.dispatch('directorate/directorates');
    }
    if (this.$store.state.directorate_id) {
      this.$store
        .dispatch('directorate/institutes', {
          parent_id: this.$store.state.directorate_id,
        })
        .then(() => {
          this.administration = this.$store.state.administration;
          this.directorate = this.$store.state.directorate_id;
        });
    }
    if (this.$store.state.university_sub) {
      this.$store
        .dispatch('organization/names', {
          query: {
            parent_id: this.$store.state.university_sub,
          },
        })
        .then(() => {
          this.organization = this.$store.state.organization_sub;
          this.university = this.$store.state.university_sub;
        });
    }
  },
  created() {
    EventBus.$on('getSearch', data => {
      this.search_text = data;
    });

    EventBus.$on('getStatus', data => {
      this.removed = data;
    });
  },
  // destroyed() {
  //   this.$store.commit('set', ['new_request', null]);
  //   this.$store.commit('set', ['level_sub', null]);
  //   this.$store.commit('set', ['stage', null]);
  //   this.$store.commit('set', ['SCgender', null]);
  //   this.$store.commit('set', ['administration', null]);
  //   this.$store.commit('set', ['directorate_id', null]);
  //   this.$store.commit('set', ['organization_sub', null]);
  //   this.$store.commit('set', ['university_sub', null]);
  // },
  methods: {
    openReportsDialog() {
      this.reportsDialog = true;
    },
    exportHEPdf(type,text){
      let query = {
        user_id: this.user_id,
        university_id: this.university,
        organization_id: this.organization,
        decision_id: this.decision,
        role: this.roles,
        search_text: this.search_text,
        removed: this.removed,
        option: this.option,
        type: this.type,
        system: this.getSystem(this.system),
        level: this.level,
        user: this.user,
        new_request: this.new_request,
        from: this.dateRange ? this.dateRange.toString().split(',')[0] : null,
        to: this.dateRange ? this.dateRange.toString().split(',')[1] : null,
        visit_from: this.visitDateRange ? this.visitDateRange.toString().split(',')[0] : null,
        visit_to: this.visitDateRange ? this.visitDateRange.toString().split(',')[1] : null,
        // report_level: this.report_level,
        report_level: this.selected_level,
        type_id: this.type,
        sc_level: this.sc_level,
        report_id: this.selected_report,
        visit_type: this.visit_type,
        educationType: this.educationType,
        dayType: this.dayType,
        SCgender: this.SCgender,
        stage: this.stage,
        directorate: this.directorate,
        administration: this.administration,
      };
      this.isLoad = true;
      this.$store.dispatch('submission/exportHEPdf', {type:type, name: text, date: this.getDateNow(), query: query }).then(_ => {
        this.isLoad = false;
        this.reportsDialog = false;
      });
    },
    exportPdf(type, text = 'submissions.pdf') {
      let query = {
        user_id: this.user_id,
        university_id: this.university,
        organization_id: this.organization,
        decision_id: this.decision,
        role: this.roles,
        search_text: this.search_text,
        removed: this.removed,
        option: this.option,
        type: this.type,
        system: this.getSystem(this.system),
        level: this.level,
        user: this.user,
        new_request: this.new_request,
        from: this.dateRange ? this.dateRange.toString().split(',')[0] : null,
        to: this.dateRange ? this.dateRange.toString().split(',')[1] : null,
        visit_from: this.visitDateRange ? this.visitDateRange.toString().split(',')[0] : null,
        visit_to: this.visitDateRange ? this.visitDateRange.toString().split(',')[1] : null,
        // report_level: this.report_level,
        report_level: this.selected_level,
        type_id: this.type,
        sc_level: this.sc_level,
        report_id: this.selected_report,
        visit_type: this.visit_type,
        educationType: this.educationType,
        dayType: this.dayType,
        SCgender: this.SCgender,
        stage: this.stage,
        typee: type,
        directorate: this.directorate,
        administration: this.administration,
      };
      this.isLoad = true;
      this.$store.dispatch('submission/exportSubPdf', { name: text, date: this.getDateNow(), query: query }).then(_ => {
        this.isLoad = false;
        this.reportsDialog = false;
      });
    },
    exportWord(type, text = 'submissions') {
      let query = {
        user_id: this.user_id,
        university_id: this.university,
        organization_id: this.organization,
        decision_id: this.decision,
        role: this.roles,
        search_text: this.search_text,
        removed: this.removed,
        option: this.option,
        type: this.type,
        system: this.getSystem(this.system),
        level: this.level,
        user: this.user,
        new_request: this.new_request,
        from: this.dateRange ? this.dateRange.toString().split(',')[0] : null,
        to: this.dateRange ? this.dateRange.toString().split(',')[1] : null,
        visit_from: this.visitDateRange ? this.visitDateRange.toString().split(',')[0] : null,
        visit_to: this.visitDateRange ? this.visitDateRange.toString().split(',')[1] : null,
        // report_level: this.report_level,
        report_level: this.selected_level,
        type_id: this.type,
        sc_level: this.sc_level,
        report_id: this.selected_report,
        visit_type: this.visit_type,
        educationType: this.educationType,
        dayType: this.dayType,
        SCgender: this.SCgender,
        stage: this.stage,
        typee: type,
        directorate: this.directorate,
        administration: this.administration,
      };
      this.isLoad = true;
      this.$store.dispatch('submission/exportSubWord', { name: text, date: this.getDateNow(), query: query }).then(_ => {
        this.isLoad = false;
        this.reportsDialog = false;
      });
    },
    openDialog() {
      this.dialogVisible = true;
      this.isLoad = true;
      // this.$store.dispatch('group/groups', { query: { order_direction: 'DESC' } }).then(_ => {
      //   this.isLoad = false;
      // });
    },
    addSubToGroup(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.isLoad = true;
          this.$store
            .dispatch('group/addSubToGroup', {
              query: {
                group_id: this.ruleForm.group,
                submission_ids: this.selectedSubmissions,
              },
            })
            .then(_ => {
              this.isLoad = false;
              this.dialogVisible = false;
              this.$notify.success({
                message: `${this.$t('Global.successMessage')}`,
              });
            });
        }
      });
    },
    selected(item) {
      if (item) {
        if (this.select[item.submission_id]) {
          this.select[item.submission_id] = true;
          this.selectedSubmissions.push(item.submission_id);
        } else {
          var filtered = this.selectedSubmissions.filter(i => i != item.submission_id);
          this.selectedSubmissions = filtered;
        }
      }
    },
    search(query) {
      this.usersRoles(query);
    },
    usersRoles(search = '', limit = 10) {
      this.$store.dispatch('archive/usersRoles', { query: { search_text: search, limit: limit } });
    },
    Refresh(query) {
      this.$emit('init', query);
    },
    removeFGroup(id) {
      this.$store.dispatch('group/removeSubmission', id).then(_ => {
        this.Refresh();
      });
    },
    getSystem(system) {
      switch (system) {
        case 'HE':
          return 1;
        case 'SC':
          return 2;
        default:
          return 1;
      }
    },
    getBadge(status) {
      switch (status) {
        case 0:
          return 'success';
        case 1:
          return 'danger';
        default:
          'primary';
      }
    },
    DateFormat(date) {
      return toLocalDatetime(date, `${this.$i18n.locale == 'ar' ? 'ar' : 'en'}`);
    },
    resetUni() {
      this.organization = null;
    },
    reset() {
      this.university = null;
      this.organization = null;
      this.type = null;
      this.decision = null;
      this.visit_type = null;
      this.level = null;
      this.sc_level = null;
      this.dayType = null;
      this.administration = null;
      this.SCgender = null;
      this.stage = null;
      this.roles = null;
      this.user_id = null;
      this.educationType = null;
      this.directorate = null;
      this.group_id = null;
      this.dateRange = '';
      (this.visitDateRange = ''), (this.new_request = 3);
      this.report_level = null;
    },
    show(item, type) {
      if (this.system == 'HE') {
        if (type == 'toLevel') {
          return `/higher/submissions/council/${item.evaluation_id}`;
        }
        if (this.option || (!this.option && item.evaluation_type != 3)) {
          return `/higher/submissions/submission/${item.submission_id}/${item.evaluation_id}`;
        }
        return `/higher/submissions/group/${item.submission_id}`;
      } else {
        if (item.program) {
          return `/school/submissions/group/${item.submission_id}`;
        }
        return `/school/submissions/submission/${item.submission_id}/${item.evaluation_id}`;
      }
    },
    exportData(text) {
      let query = {
        user_id: this.user_id,
        university_id: this.university,
        organization_id: this.organization,
        decision_id: this.decision,
        role: this.roles,
        search_text: this.search_text,
        removed: this.removed,
        option: this.option,
        type: this.type,
        system: this.getSystem(this.system),
        level: this.level,
        user: this.user,
        new_request: this.new_request,
        from: this.dateRange ? this.dateRange.toString().split(',')[0] : null,
        to: this.dateRange ? this.dateRange.toString().split(',')[1] : null,
        visit_from: this.visitDateRange ? this.visitDateRange.toString().split(',')[0] : null,
        visit_to: this.visitDateRange ? this.visitDateRange.toString().split(',')[1] : null,
        // report_level: this.report_level,
        report_level: this.selected_level,
        type_id: this.type,
        sc_level: this.sc_level,
        report_id: this.selected_report,
        visit_type: this.visit_type,
        educationType: this.educationType,
        dayType: this.dayType,
        SCgender: this.SCgender,
        stage: this.stage,
        directorate: this.directorate,
        administration: this.administration,
      };
      this.isLoad = true;
      this.$store.dispatch('submission/export', { name: text, date: this.getDateNow(), query: query }).then(_ => {
        this.isLoad = false;
        this.reportsDialog = false;
      });
    },
  },
};
</script>

<style lang="scss">
.cuctom_select_group {
  .el-select-group__title {
    font-weight: bolder;
    text-align: center;
  }
}

[data-name]::before {
  content: attr(data-name);
  margin-right: 0.5rem;
  display: flex;
  flex-direction: row-reverse;
  font-weight: bold;
  color: #909399;
}

.cuctom_select {
  .el-select-group__title {
    text-align: right;
    margin-right: 1rem;
    position: relative;
  }
}

.xs_mini {
  padding: 2px 3px !important;
}

@media screen and (max-width: 600px) {
  .el-date-range-picker {
    .el-picker-panel__body {
      .el-date-range-picker__content {
        width: 100%;
      }

      flex-direction: column-reverse;
      align-items: center;
      width: 100%;
      min-width: 400px;
    }

    top: 493px !important;
    left: 40px !important;
    width: 400px;
  }
}

.switch_date_picker {
  .el-picker-panel__body {
    display: flex;

    .is-left {
      order: 5;
      border-left: 1px solid #e4e4e4;
    }
  }
}

.switch_view {
  display: inline-flex;
  border: 1px solid #fff;
  padding: 0.2rem;
  margin-bottom: 0.2rem;
  border-radius: 30px;
  position: relative;
  font-size: 22px;
  cursor: pointer;
}

.switch_view.active {
  position: relative;
}

.switch_view .active {
  opacity: 1 !important;
  margin: 0px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border-radius: 50%;
  background-color: #fff;
}

.switch_view i {
  opacity: 0.4;
  padding: 0rem 0.2rem;
}

.hidden .el-table__expand-icon {
  display: none !important;
}

.custom_expand {
  cursor: pointer;
}

.hidden .el-table__expand-column {
  &::after {
    content: '';
    top: 34px;
    right: 16px;
    position: absolute;
    width: 4px;
    height: 1px;
    bottom: -2px;
    background-color: #000;
  }
}

.el-date-editor .el-range-separator {
  width: 10% !important;
}

.flexGrow_3 {
  //   display: flex;
  //   flex-wrap: wrap;
  //   width: 100%;
  //   flex-direction: row-reverse;

  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}

@media only screen and (max-width: 740px) {
  .fullWidth {
    width: 100%;

    .el-date-editor {
      width: 100%;
    }
  }
  //   .flex_small_screen {
  //     display: flex;
  //     flex-direction: column-reverse;
  //     // flex-direction: row;
  //     .ml-2 {
  //       margin: 0.2rem 0 !important;
  //     }
  //   }
}
</style>
