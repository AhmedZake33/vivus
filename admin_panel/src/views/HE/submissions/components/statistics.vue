<template>
  <div class="w-100 mt-2">
    <CRow class="user_icons animate mt-2">
      <el-alert
        v-if="
          !$store.getters['submission/decision'] &&
          ((evaluatorCheck(['ORGANIZATION_TYPE']) && updateConstants('string', 'DOCUMENTS_UPDATE') == lastAlert.allow_update) ||
            (((lastAlert.actual_level > 5 && lastAlert.type == 1) ||
              (lastAlert.actual_level && lastAlert.actual_level <= 5 && lastAlert.actual_level != 4 && lastAlert.actual_level != 2 && isApproved)) &&
              isLeader) ||
            hasPermission('admin_submissions') ||
            hasPermission('report_update') || (updateConstants('string', 'REPORT_UPDATE') == lastAlert.allow_update && evaluatorCheck(['TEAM_TYPE'])))
        "
        effect="dark"
        class="mb-2 mx-3"
        :title="$t('Global.attention')"
        type="warning"
        show-icon
      >
        <div class="d-flex flex-column">
          <span>
            {{ $t('Global.addStatisticAttention') }}
          </span>
          <router-link class="text-white custom_link" v-if="$store.getters['submission/name']" :to="{ path: $store.getters['submission/name'].id ? `/higher/organization/${$store.getters['submission/name'].id}` : '' }">
            {{ $t('Global.pressNow') }}
          </router-link>
        </div>
      </el-alert>
    </CRow>
    <el-collapse v-model="activeName" accordion v-for="data in $store.getters['submission/statisticsData']" class="custom_collapse custom_collapse_docs">
      <el-collapse-item :title="data.title" v-if="data.title == 'staff_info'">
        <template slot="title">
          <CCardHeader>
            <div :class="$i18n.locale === 'ar' ? 'card-header-actions' : 'ml-2 mr-2'" style="display: inline-block"><i class="el-icon-data-analysis"></i>{{ $t(`Global.${data.title}`) }}</div>
          </CCardHeader>
        </template>
        <div class="d-flex flex-column text-initial">
          <CRow>
            <CCol sm="12" md="6" lg="4" v-if="data.staff_info" v-for="type in data.staff_info">
              <strong class="w-100 mx-2 mt-2">
                <div class="px-3 docs_header d-flex justify-content-between align-items-center">
                  <span class="font_12"
                    >{{ type.type_name }}
                    <template v-if="$store.state.user.allowHr || hasPermission('admin_system')">
                      <i
                        v-if="
                          !$store.getters['submission/decision'] &&
                          ((evaluatorCheck(['ORGANIZATION_TYPE']) && updateConstants('string', 'DOCUMENTS_UPDATE') == lastAlert.allow_update) ||
                            (((lastAlert.actual_level > 5 && lastAlert.type == 1) ||
                              (lastAlert.actual_level && lastAlert.actual_level <= 5 && lastAlert.actual_level != 4 && lastAlert.actual_level != 2 && isApproved)) &&
                              isLeader) ||
                            hasPermission('admin_submissions') ||
                            hasPermission('report_update') || (updateConstants('string', 'REPORT_UPDATE') == lastAlert.allow_update && evaluatorCheck(['TEAM_TYPE'])))
                        "
                        class="el-icon-circle-plus pt-1"
                        style="font-size: 21px; cursor: pointer"
                        @click="openStatisticDialog(type, null)"
                      ></i>
                    </template>
                  </span>
                </div>
                <span class="d-block mx-2 mt-2 px-3 docs_header justify-content-between align-items-center" v-if="type.groups" v-for="typeGroup in type.groups">
                  <span>{{ typeGroup.group_name }}</span>
                  <el-table v-if="typeGroup.members" :data="typeGroup.members" style="width: 100%" :header-cell-class-name="$i18n.locale === 'ar' ? 'text-right' : ''" :cell-class-name="$i18n.locale === 'ar' ? 'text-right' : ''">
                    <el-table-column prop="ar_name" width="150" :label="$t('Global.type_name')"></el-table-column>
                    <el-table-column prop="value" :label="$t('Global.value')">
                      <template slot-scope="scope">
                        {{ scope.row.value ? scope.row.value : '-' }}
                      </template>
                    </el-table-column>
                    <el-table-column prop="" label=" ">
                      <template slot-scope="scope">
                        <div :style="$i18n.locale === 'ar' ? 'text-align:left' : 'float: right'">
                          <template v-if="$store.state.user.allowHr || hasPermission('admin_system')">
                            <i
                              v-if="
                                !$store.getters['submission/decision'] &&
                                ((evaluatorCheck(['ORGANIZATION_TYPE']) && updateConstants('string', 'DOCUMENTS_UPDATE') == lastAlert.allow_update) ||
                                  (((lastAlert.actual_level > 5 && lastAlert.type == 1) ||
                                    (lastAlert.actual_level && lastAlert.actual_level <= 5 && lastAlert.actual_level != 4 && lastAlert.actual_level != 2 && isApproved)) &&
                                    isLeader) ||
                                  hasPermission('admin_submissions') ||
                                  hasPermission('report_update') || (updateConstants('string', 'REPORT_UPDATE') == lastAlert.allow_update && evaluatorCheck(['TEAM_TYPE'])))
                              "
                              class="el-icon-edit-outline table-action-item"
                              style="font-size: 17px"
                              @click="openStatisticDialog(type, scope.row)"
                            ></i>
                          </template>
                        </div>
                      </template>
                    </el-table-column>
                  </el-table>
                </span>
              </strong>
            </CCol>
          </CRow>
        </div>
      </el-collapse-item>
      <el-collapse-item :title="data.title" v-if="data.title == 'departments_info'">
        <template slot="title">
          <CCardHeader>
            <div :class="$i18n.locale === 'ar' ? 'card-header-actions' : 'ml-2 mr-2'" style="display: inline-block"><i class="el-icon-data-board"></i> {{ $t(`Global.${data.title}`) }}</div>
          </CCardHeader>
        </template>
        <div class="d-flex flex-column text-initial">
          <CRow>
            <CCol sm="12" md="6" lg="4" v-if="data.departments_info" v-for="type in data.departments_info">
              <strong class="w-100 mx-2 mt-2">
                <div class="px-3 docs_header d-flex justify-content-between align-items-center">
                  <span class="font_12"
                    >{{ type.type_name }}
                    <template v-if="$store.state.user.allowHr || hasPermission('admin_system')">
                      {{$store.getters['submission/team'].length}}
                      
                      <i
                        v-if="
                          !$store.getters['submission/decision'] &&
                          ((evaluatorCheck(['ORGANIZATION_TYPE']) && updateConstants('string', 'DOCUMENTS_UPDATE') == lastAlert.allow_update) ||
                            (((lastAlert.actual_level > 5 && lastAlert.type == 1) ||
                              (lastAlert.actual_level && lastAlert.actual_level <= 5 && lastAlert.actual_level != 4 && lastAlert.actual_level != 2 && isApproved)) &&
                              isLeader) ||
                            hasPermission('admin_submissions') ||
                            hasPermission('report_update') || (updateConstants('string', 'REPORT_UPDATE') == lastAlert.allow_update && evaluatorCheck(['TEAM_TYPE'])))
                        "
                        class="el-icon-circle-plus pt-1"
                        style="font-size: 21px; cursor: pointer"
                        @click="openDepartmentDialog(type, null)"
                      ></i>
                    </template>
                  </span>
                </div>
                <span class="d-block mx-2 mt-2">
                  <el-table v-if="type.departments" :data="type.departments" style="width: 100%" :header-cell-class-name="$i18n.locale === 'ar' ? 'text-right' : ''" :cell-class-name="$i18n.locale === 'ar' ? 'text-right' : ''">
                    <el-table-column prop="name" width="120" :label="$t('Global.name')">
                      <template slot-scope="scope">
                        {{ scope.row.name }}
                      </template>
                    </el-table-column>
                    <el-table-column prop="actual_count" :label="$t('Global.actual_count')">
                      <template slot-scope="scope">
                        {{ scope.row.actual_count ? scope.row.actual_count : '-' }}
                      </template>
                    </el-table-column>
                    <el-table-column prop="staff_count" :label="$t('Global.staff_count')">
                      <template slot-scope="scope">
                        {{ scope.row.staff_count ? scope.row.staff_count : '-' }}
                      </template>
                    </el-table-column>
                    <el-table-column prop="" label=" ">
                      <template slot-scope="scope">
                        <div :style="$i18n.locale === 'ar' ? 'text-align:left' : 'float: right'">
                          <template v-if="$store.state.user.allowHr || hasPermission('admin_system')">
                            <i
                              v-if="
                                !$store.getters['submission/decision'] &&
                                ((evaluatorCheck(['ORGANIZATION_TYPE']) && updateConstants('string', 'DOCUMENTS_UPDATE') == lastAlert.allow_update) ||
                                  (((lastAlert.actual_level > 5 && lastAlert.type == 1) ||
                                    (lastAlert.actual_level && lastAlert.actual_level <= 5 && lastAlert.actual_level != 4 && lastAlert.actual_level != 2 && isApproved)) &&
                                    isLeader) ||
                                  hasPermission('admin_submissions') ||
                                  hasPermission('report_update') || (updateConstants('string', 'REPORT_UPDATE') == lastAlert.allow_update && evaluatorCheck(['TEAM_TYPE'])))
                              "
                              class="el-icon-edit-outline table-action-item"
                              @click="openDepartmentDialog(type, scope.row)"
                              style="font-size: 17px"
                            ></i>
                          </template>
                        </div>
                      </template>
                    </el-table-column>
                  </el-table>
                </span>
              </strong>
            </CCol>
          </CRow>
        </div>
      </el-collapse-item>
      <el-collapse-item :title="data.title" v-if="data.title == 'program_info'">
        <template slot="title">
          <CCardHeader>
            <div :class="$i18n.locale === 'ar' ? 'card-header-actions' : 'ml-2 mr-2'" style="display: inline-block"><i class="el-icon-data-board"></i> {{ $t(`Global.${data.title}`) }}</div>
          </CCardHeader>
        </template>
        <div class="d-flex flex-column text-initial">
          <div class="px-3 docs_header d-flex justify-content-between align-items-center">
            <span class="font_12"
              >{{ $t(`Global.${data.title}`) }}
              <template v-if="$store.state.user.allowHr || hasPermission('admin_system')">
                <i
                  v-if="
                    !$store.getters['submission/decision'] &&
                    ((evaluatorCheck(['ORGANIZATION_TYPE']) && updateConstants('string', 'DOCUMENTS_UPDATE') == lastAlert.allow_update) ||
                      (((lastAlert.actual_level > 5 && lastAlert.type == 1) ||
                        (lastAlert.actual_level && lastAlert.actual_level <= 5 && lastAlert.actual_level != 4 && lastAlert.actual_level != 2 && isApproved)) &&
                        isLeader) ||
                      hasPermission('admin_submissions') ||
                      hasPermission('report_update') || (updateConstants('string', 'REPORT_UPDATE') == lastAlert.allow_update && evaluatorCheck(['TEAM_TYPE'])))
                  "
                  class="el-icon-circle-plus pt-1"
                  style="font-size: 21px; cursor: pointer"
                  @click="openProgramDialog(null)"
                ></i>
              </template>
            </span>
          </div>
          <CRow>
            <CCol sm="12" md="6" lg="4" v-if="data.program_info" v-for="qualification in data.program_info">
              <strong class="w-100 mx-2 mt-2">
                <div class="px-3 docs_header d-flex justify-content-between align-items-center">
                  <span>{{ qualification.name }}</span>
                </div>
                <span class="d-block mx-2 mt-2">
                  <el-table v-if="qualification.programs" :data="qualification.programs" style="width: 100%" :header-cell-class-name="$i18n.locale === 'ar' ? 'text-right' : ''" :cell-class-name="$i18n.locale === 'ar' ? 'text-right' : ''">
                    <el-table-column prop="name" width="200" :label="$t('Global.name')">
                      <template slot-scope="scope">
                        {{ scope.row.name ? scope.row.name : '-' }}
                      </template>
                    </el-table-column>

                    <el-table-column prop="actual_count" :label="$t('Global.actual_count')">
                      <template slot-scope="scope">
                        {{ scope.row.student_count ? scope.row.student_count : '-' }}
                      </template>
                    </el-table-column>
                    <el-table-column prop="" label=" ">
                      <template slot-scope="scope">
                        <div :style="$i18n.locale === 'ar' ? 'text-align:left' : 'float: right'">
                          <template v-if="$store.state.user.allowHr || hasPermission('admin_system')">
                            <i
                              v-if="
                                !$store.getters['submission/decision'] &&
                                ((evaluatorCheck(['ORGANIZATION_TYPE']) && updateConstants('string', 'DOCUMENTS_UPDATE') == lastAlert.allow_update) ||
                                  (((lastAlert.actual_level > 5 && lastAlert.type == 1) ||
                                    (lastAlert.actual_level && lastAlert.actual_level <= 5 && lastAlert.actual_level != 4 && lastAlert.actual_level != 2 && isApproved)) &&
                                    isLeader) ||
                                  hasPermission('admin_submissions') ||
                                  hasPermission('report_update') || (updateConstants('string', 'REPORT_UPDATE') == lastAlert.allow_update && evaluatorCheck(['TEAM_TYPE'])))
                              "
                              class="el-icon-edit-outline table-action-item"
                              @click="openProgramDialog(scope.row)"
                              style="font-size: 17px"
                            ></i>
                          </template>
                        </div>
                      </template>
                    </el-table-column>
                  </el-table>
                </span>
              </strong>
            </CCol>
          </CRow>
        </div>
      </el-collapse-item>
      <el-collapse-item :title="data.title" v-if="data.title == 'activities' && !evaluatorCheck(['ORGANIZATION_TYPE'])">
        <template slot="title">
          <CCardHeader>
            <div :class="$i18n.locale === 'ar' ? 'card-header-actions' : 'ml-2 mr-2'" style="display: inline-block"><i class="el-icon-data-line"></i> {{ $t(`Global.${data.title}`) }}</div>
          </CCardHeader>
        </template>
        <div class="d-flex flex-column text-initial">
          <div v-if="data.activities" v-for="activity in data.activities">
            <div class="px-3 docs_header d-flex justify-content-between align-items-center">
              <span class="font_12">
                {{ activity.name }}
                <template v-if="$store.state.user.allowHr || hasPermission('admin_system')">
                  <i
                    v-if="
                      !$store.getters['submission/decision'] &&
                      ((evaluatorCheck(['ORGANIZATION_TYPE']) && updateConstants('string', 'DOCUMENTS_UPDATE') == lastAlert.allow_update) ||
                        (((lastAlert.actual_level > 5 && lastAlert.type == 1) ||
                          (lastAlert.actual_level && lastAlert.actual_level <= 5 && lastAlert.actual_level != 4 && lastAlert.actual_level != 2 && isApproved)) &&
                          isLeader) ||
                        hasPermission('admin_submissions') ||
                        hasPermission('report_update') || (updateConstants('string', 'REPORT_UPDATE') == lastAlert.allow_update && evaluatorCheck(['TEAM_TYPE'])))
                    "
                    class="el-icon-circle-plus pt-1"
                    style="font-size: 21px; cursor: pointer"
                    @click="openActivityDialog(activity, null)"
                  ></i>
                </template>
              </span>
            </div>
            <CCard style="width: 100%" v-if="activity.notes">
              <CCardBody>
                <div class="button_after report_style custom_report mb-3 pb-2" style="background-color: #c3c3c3" v-for="note in activity.notes">
                  <div style="margin-left: 20px; margin-right: 20px; width: 80%" class="d-flex">
                    <p class="mb-0 text-initial p-1" style="word-break: break-word" v-html="ntBr(note.note)"></p>
                    <template v-if="$store.state.user.allowHr || hasPermission('admin_system')">
                      <el-button
                        icon="el-icon-edit"
                        @click="openActivityDialog(activity, note)"
                        round
                        size="mini"
                        v-if="
                          !$store.getters['submission/decision'] &&
                          ((note.note && evaluatorCheck(['ORGANIZATION_TYPE']) && updateConstants('string', 'DOCUMENTS_UPDATE') == lastAlert.allow_update) ||
                            (((lastAlert.actual_level > 5 && lastAlert.type == 1) ||
                              (lastAlert.actual_level && lastAlert.actual_level <= 5 && lastAlert.actual_level != 4 && lastAlert.actual_level != 2 && isApproved)) &&
                              isLeader) ||
                            hasPermission('admin_submissions') ||
                            hasPermission('report_update') || (updateConstants('string', 'REPORT_UPDATE') == lastAlert.allow_update && evaluatorCheck(['TEAM_TYPE'])))
                        "
                        style="height: 30px; bottom: 7px"
                        class="mx-1 right_icon custom_send_icon"
                        type="primary"
                        >{{ $t('Global.edit') }}
                      </el-button>
                    </template>
                  </div>
                </div>
              </CCardBody>
            </CCard>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item :title="data.title" v-if="data.title == 'results'">
        <template slot="title">
          <CCardHeader>
            <div :class="$i18n.locale === 'ar' ? 'card-header-actions' : 'ml-2 mr-2'" style="display: inline-block"><i class="el-icon-document"></i> {{ $t(`Global.${data.title}`) }}</div>
          </CCardHeader>
        </template>
        <div class="d-flex flex-column text-initial">
          <div class="d-flex flex-column text-initial">
            <div v-if="data.results" v-for="activity in data.results">
              <div class="px-3 docs_header d-flex justify-content-between align-items-center">
                <span class="font_12">
                  {{ activity.name }}
                  <template v-if="$store.state.user.allowHr || hasPermission('admin_system')">
                    <i
                      v-if="
                        !$store.getters['submission/decision'] &&
                        ((evaluatorCheck(['ORGANIZATION_TYPE']) && updateConstants('string', 'DOCUMENTS_UPDATE') == lastAlert.allow_update) ||
                          (((lastAlert.actual_level > 5 && lastAlert.type == 1) ||
                            (lastAlert.actual_level && lastAlert.actual_level <= 5 && lastAlert.actual_level != 4 && lastAlert.actual_level != 2 && isApproved)) &&
                            isLeader) ||
                          hasPermission('admin_submissions') ||
                          hasPermission('report_update') || (updateConstants('string', 'REPORT_UPDATE') == lastAlert.allow_update && evaluatorCheck(['TEAM_TYPE'])))
                      "
                      class="el-icon-circle-plus pt-1"
                      style="font-size: 21px; cursor: pointer"
                      @click="openActivityDialog(activity, null)"
                    ></i>
                  </template>
                </span>
              </div>
              <CCard style="width: 100%" v-if="activity.notes">
                <CCardBody>
                  <div class="button_after report_style custom_report mb-3 pb-2" style="background-color: #c3c3c3" v-for="note in activity.notes">
                    <div style="margin-left: 20px; margin-right: 20px; width: 80%" class="d-flex">
                      <p class="mb-0 text-initial p-1" style="word-break: break-word" v-html="ntBr(note.note)"></p>
                      <template v-if="$store.state.user.allowHr || hasPermission('admin_system')">
                        <el-button
                          icon="el-icon-edit"
                          round
                          size="mini"
                          @click="openActivityDialog(activity, note)"
                          v-if="
                            !$store.getters['submission/decision'] &&
                            ((note.note && evaluatorCheck(['ORGANIZATION_TYPE']) && updateConstants('string', 'DOCUMENTS_UPDATE') == lastAlert.allow_update) ||
                              (((lastAlert.actual_level > 5 && lastAlert.type == 1) ||
                                (lastAlert.actual_level && lastAlert.actual_level <= 5 && lastAlert.actual_level != 4 && lastAlert.actual_level != 2 && isApproved)) &&
                                isLeader) ||
                              hasPermission('admin_submissions') ||
                              hasPermission('report_update') || (updateConstants('string', 'REPORT_UPDATE') == lastAlert.allow_update && evaluatorCheck(['TEAM_TYPE'])))
                          "
                          style="height: 30px; bottom: 7px"
                          class="mx-1 right_icon custom_send_icon"
                          type="primary"
                          >{{ $t('Global.edit') }}
                        </el-button>
                      </template>
                    </div>
                  </div>
                </CCardBody>
              </CCard>
            </div>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item :title="data.title" v-if="data.title == 'staff_activities'">
        <template slot="title">
          <CCardHeader>
            <div :class="$i18n.locale === 'ar' ? 'card-header-actions' : 'ml-2 mr-2'" style="display: inline-block"><i class="el-icon-document"></i> {{ $t(`Global.${data.title}`) }}</div>
          </CCardHeader>
        </template>
        <div class="d-flex flex-column text-initial">
          <div class="d-flex flex-column text-initial">
            <CRow>
              <CCol md="6" lg="6" sm="12" v-if="data.staff_activities" v-for="activity in data.staff_activities">
                <strong>
                  <div class="px-3 mt-2 docs_header d-flex justify-content-between align-items-center">
                    <span class="font_12">
                      {{ `${activity.cat} (${activity.item})  ${activity.is_postgraduate ? `(${$t('Global.postgraduate')})` : ''}` }}
                      <template v-if="$store.state.user.allowHr || hasPermission('admin_system')">
                        <i
                          v-if="
                            !$store.getters['submission/decision'] &&
                            ((evaluatorCheck(['ORGANIZATION_TYPE']) && updateConstants('string', 'DOCUMENTS_UPDATE') == lastAlert.allow_update) ||
                              (((lastAlert.actual_level > 5 && lastAlert.type == 1) ||
                                (lastAlert.actual_level && lastAlert.actual_level <= 5 && lastAlert.actual_level != 4 && lastAlert.actual_level != 2 && isApproved)) &&
                                isLeader) ||
                              hasPermission('admin_submissions') ||
                              hasPermission('report_update') || (updateConstants('string', 'REPORT_UPDATE') == lastAlert.allow_update && evaluatorCheck(['TEAM_TYPE'])))
                          "
                          class="el-icon-circle-plus pt-1"
                          style="font-size: 21px; cursor: pointer"
                          @click="openStaffDialog(activity, null)"
                        ></i>
                      </template>
                    </span>
                  </div>
                  <span class="d-block mx-2 mt-2">
                    <el-table v-if="activity.data" :data="activity.data" style="width: 100%" :header-cell-class-name="$i18n.locale === 'ar' ? 'text-right' : ''" :cell-class-name="$i18n.locale === 'ar' ? 'text-right' : ''">
                      <el-table-column prop="name" width="120" :label="$t('Global.name')">
                        <template slot-scope="scope">
                          {{ scope.row.name }}
                        </template>
                      </el-table-column>
                      <el-table-column prop="program" :label="$t('Global.program')">
                        <template slot-scope="scope">
                          {{ scope.row.program ? scope.row.program : '-' }}
                        </template>
                      </el-table-column>
                      <el-table-column prop="actual_count" :label="$t('Global.actual_count')">
                        <template slot-scope="scope">
                          {{ scope.row.activity_value ? scope.row.activity_value : '-' }}
                        </template>
                      </el-table-column>
                      <el-table-column prop="qualification" :label="$t('Global.qualification')">
                        <template slot-scope="scope">
                          {{ scope.row.qualification ? scope.row.qualification : '-' }}
                        </template>
                      </el-table-column>
                      <el-table-column prop="" label=" ">
                        <template slot-scope="scope">
                          <div :style="$i18n.locale === 'ar' ? 'text-align:left' : 'float: right'">
                            <template v-if="$store.state.user.allowHr || hasPermission('admin_system')">
                              <i
                                v-if="
                                  !$store.getters['submission/decision'] &&
                                  ((evaluatorCheck(['ORGANIZATION_TYPE']) && updateConstants('string', 'DOCUMENTS_UPDATE') == lastAlert.allow_update) ||
                                    (((lastAlert.actual_level > 5 && lastAlert.type == 1) ||
                                      (lastAlert.actual_level && lastAlert.actual_level <= 5 && lastAlert.actual_level != 4 && lastAlert.actual_level != 2 && isApproved)) &&
                                      isLeader) ||
                                    hasPermission('admin_submissions') ||
                                    hasPermission('report_update') || (updateConstants('string', 'REPORT_UPDATE') == lastAlert.allow_update && evaluatorCheck(['TEAM_TYPE'])))
                                "
                                class="el-icon-edit-outline table-action-item"
                                @click="openStaffDialog(activity, scope.row)"
                                style="font-size: 17px"
                              ></i>
                            </template>
                          </div>
                        </template>
                      </el-table-column>
                    </el-table>
                  </span>
                </strong>
              </CCol>
            </CRow>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
    <el-dialog :title="title" :visible.sync="activity_dialog" class="p-0" width="80%">
      <CCardBody dir="rtl" style="text-align: initial" class="p-0">
        <el-form label-position="top" :model="ruleForm" status-icon size="large" ref="ruleForm" label-width="120px" class="demo-ruleForm">
          <CRow>
            <CCol sm="12">
              <div class="datePicker el-form-item el-form-item--feedback el-form-item--small">
                <div class="reviewHeard" style="text-align: initial">
                  <el-form-item :rules="validation(false, 'textarea')" prop="note" :label="$t('Global.note')" class="custom_area">
                    <el-input autosize resize="none" type="textarea" v-model="ruleForm.note"></el-input>
                  </el-form-item>
                </div>
              </div>
            </CCol>
          </CRow>
        </el-form>
      </CCardBody>
      <CCardFooter :class="isLoad ? 'disabledAll' : ''">
        <div class="baseButton">
          <button @click="saveNote('ruleForm')" class="el-button el-button--default is-round sec_color" type="reset" style="padding: 0.6rem 1rem">
            <i class="el-icon-check-circle"></i>
            {{ $t('Global.submit') }}
          </button>
        </div>
      </CCardFooter>
    </el-dialog>
    <el-dialog :title="title" :visible.sync="statistic_dialog" class="p-0" width="40%">
      <CCardBody dir="rtl" style="text-align: initial" class="p-0">
        <el-form label-position="top" :model="ruleForm" status-icon size="large" ref="ruleForm" label-width="120px" class="demo-ruleForm">
          <CRow>
            <CCol sm="12">
              <div class="datePicker el-form-item el-form-item--feedback el-form-item--small">
                <div class="reviewHeard" style="text-align: initial">
                  <el-form-item prop="category_id" :rules="validation(null, 1)" :label="$t('Global.category')">
                    <el-select :no-data-text="$t('Global.nodata')" v-model="ruleForm.category_id" :placeholder="$t('Global.category')" style="width: 100%">
                      <el-option v-for="item in $store.getters['submission/categories']" :key="item.id" :label="item.ar_name" :value="item.id">
                        <div style="float: right; color: #8492a6; font-size: 13px">
                          {{ item.ar_name }}
                        </div>
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item class="my-3" prop="statistic_staff_id" :rules="validation(null, 1)" :label="$t('Global.status')">
                    <el-select :disabled="disabledVal" :no-data-text="$t('Global.nodata')" v-model="ruleForm.statistic_staff_id" :placeholder="$t('Global.status')" style="width: 100%">
                      <el-option v-for="item in $store.getters['submission/items']" :key="item.id" :label="item.ar_name" :value="item.id" v-if="item.type_id == type_id && item.category_id == ruleForm.category_id">
                        <div style="float: right; color: #8492a6; font-size: 13px">
                          {{ item.ar_name }}
                        </div>
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item :rules="validation(null, 0)" prop="value" :label="$t('Global.value')">
                    <el-input clearable :placeholder="$t('Global.value')" v-model="ruleForm.value" style="width: 100%"></el-input>
                  </el-form-item>
                </div>
              </div>
            </CCol>
          </CRow>
        </el-form>
      </CCardBody>
      <CCardFooter :class="isLoad ? 'disabledAll' : ''">
        <div class="baseButton">
          <button @click="saveStatisticStaff('ruleForm')" class="el-button el-button--default is-round sec_color" type="reset" style="padding: 0.6rem 1rem">
            <i class="el-icon-check-circle"></i>
            {{ $t('Global.submit') }}
          </button>
        </div>
      </CCardFooter>
    </el-dialog>
    <el-dialog :title="title" :visible.sync="departments_dialog" class="p-0" width="45%">
      <CCardBody dir="rtl" style="text-align: initial" class="p-0">
        <el-form label-position="top" :model="ruleForm" status-icon size="large" ref="ruleForm" label-width="120px" class="demo-ruleForm">
          <CRow>
            <CCol sm="12">
              <div class="datePicker el-form-item el-form-item--feedback el-form-item--small">
                <div class="reviewHeard" style="text-align: initial">
                  <el-form-item prop="department_id" :rules="validation(null, 1)" :label="$t('Global.department')">
                    <el-select :no-data-text="$t('Global.nodata')" v-model="ruleForm.department_id" :placeholder="$t('Global.department')" style="width: 100%">
                      <el-option v-for="item in $store.getters['submission/departments']" :key="item.id" :label="item.name" :value="item.id">
                        <div style="float: right; color: #8492a6; font-size: 13px">
                          {{ item.name }}
                        </div>
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item class="my-3" :rules="validation(null, 0)" prop="value" :label="$t('Global.actual_count')">
                    <el-input :maxlength="8" clearable :placeholder="$t('Global.value')" v-model="ruleForm.value" style="width: 100%"></el-input>
                  </el-form-item>
                  <el-form-item :rules="validation(null, 0)" prop="count" :label="$t('Global.staff_count')">
                    <el-input :maxlength="8" clearable :placeholder="$t('Global.value')" v-model="ruleForm.count" style="width: 100%"></el-input>
                  </el-form-item>
                </div>
              </div>
            </CCol>
          </CRow>
        </el-form>
      </CCardBody>
      <CCardFooter :class="isLoad ? 'disabledAll' : ''">
        <div class="baseButton">
          <button @click="saveDepartment('ruleForm')" class="el-button el-button--default is-round sec_color" type="reset" style="padding: 0.6rem 1rem">
            <i class="el-icon-check-circle"></i>
            {{ $t('Global.submit') }}
          </button>
        </div>
      </CCardFooter>
    </el-dialog>
    <el-dialog :title="$t(`Global.program_info`)" :visible.sync="program_dialog" class="p-0" width="45%">
      <CCardBody dir="rtl" style="text-align: initial" class="p-0">
        <el-form label-position="top" :model="ruleForm" status-icon size="large" ref="ruleForm" label-width="120px" class="demo-ruleForm">
          <CRow>
            <CCol sm="12">
              <div class="datePicker el-form-item el-form-item--feedback el-form-item--small">
                <div class="reviewHeard" style="text-align: initial">
                  <el-form-item class="my-3" prop="program_id" :rules="validation(null, 1)" :label="$t('Global.program')">
                    <el-select :no-data-text="$t('Global.nodata')" v-model="ruleForm.program_id" :placeholder="$t('Global.program')" style="width: 100%">
                      <el-option v-for="item in $store.getters['submission/organization_programs']" :key="item.id" :label="item.name" :value="item.id">
                        <div style="float: right; color: #8492a6; font-size: 13px">
                          {{ item.name }}
                        </div>
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item :rules="validation()" prop="value" :label="$t('Global.actual_count')">
                    <el-input :maxlength="8" clearable :placeholder="$t('Global.value')" v-model="ruleForm.value" style="width: 100%"></el-input>
                  </el-form-item>
                </div>
              </div>
            </CCol>
          </CRow>
        </el-form>
      </CCardBody>
      <CCardFooter :class="isLoad ? 'disabledAll' : ''">
        <div class="baseButton">
          <button @click="saveProgram('ruleForm')" class="el-button el-button--default is-round sec_color" type="reset" style="padding: 0.6rem 1rem">
            <i class="el-icon-check-circle"></i>
            {{ $t('Global.submit') }}
          </button>
        </div>
      </CCardFooter>
    </el-dialog>
    <el-dialog :title="title" :visible.sync="staff_dialog" class="p-0" width="45%">
      <CCardBody dir="rtl" style="text-align: initial" class="p-0">
        <el-form label-position="top" :model="ruleForm" status-icon size="large" ref="ruleForm" label-width="120px" class="demo-ruleForm">
          <CRow>
            <CCol sm="12">
              <div class="datePicker el-form-item el-form-item--feedback el-form-item--small">
                <div class="reviewHeard" style="text-align: initial">
                  <el-form-item prop="qualification_id" :rules="validation(null, 1)" :label="$t('Global.qualification')">
                    <el-select :no-data-text="$t('Global.nodata')" v-model="ruleForm.qualification_id" :placeholder="$t('Global.qualification')" style="width: 100%">
                      <el-option v-for="item in $store.getters['submission/qualifications']" :key="item.id" :label="item.name" :value="item.id">
                        <div style="float: right; color: #8492a6; font-size: 13px">
                          {{ item.name }}
                        </div>
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item class="my-3" prop="program_id" :label="$t('Global.program')">
                    <el-select :no-data-text="$t('Global.nodata')" v-model="ruleForm.program_id" :placeholder="$t('Global.program')" style="width: 100%">
                      <el-option v-for="item in $store.getters['submission/organization_programs']" :key="item.id" :label="item.name" :value="item.id">
                        <div style="float: right; color: #8492a6; font-size: 13px">
                          {{ item.name }}
                        </div>
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item prop="working_year_id" class="my-3" :rules="validation(null, 1)" :label="$t('Global.Year')">
                    <el-select :no-data-text="$t('Global.nodata')" v-model="ruleForm.working_year_id" :placeholder="$t('Global.Year')" style="width: 100%">
                      <el-option v-for="item in $store.getters['submission/years']" :key="item.id" :label="item.name" :value="item.id">
                        <div style="float: right; color: #8492a6; font-size: 13px">
                          {{ item.name }}
                        </div>
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item :rules="validation(null, 0)" prop="value" :label="$t('Global.actual_count')">
                    <el-input :maxlength="8" clearable :placeholder="$t('Global.value')" v-model="ruleForm.value" style="width: 100%"></el-input>
                  </el-form-item>
                </div>
              </div>
            </CCol>
          </CRow>
        </el-form>
      </CCardBody>
      <CCardFooter :class="isLoad ? 'disabledAll' : ''">
        <div class="baseButton">
          <button @click="saveActivity('ruleForm')" class="el-button el-button--default is-round sec_color" type="reset" style="padding: 0.6rem 1rem">
            <i class="el-icon-check-circle"></i>
            {{ $t('Global.submit') }}
          </button>
        </div>
      </CCardFooter>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Statistics',
  data() {
    return {
      props: { evaluation: Number },
      isLoad: false,
      activeName: 0,
      activity_dialog: false,
      statistic_dialog: false,
      program_dialog: false,
      staff_dialog: false,
      departments_dialog: false,
      ruleForm: {
        note: null,
        category_id: null,
        statistic_staff_id: null,
        qualification_id: null,
        statistic_activity_id: null,
        working_year_id: null,
        value: null,
        count: null,
        department_id: null,
        program_id: null,
      },
      title: '',
      disabledVal: true,
      note_id: null,
      disabled_prog: true,
      department_id: null,
      staff_id: null,
      program_id: null,
      type_id: null,
      data: [],
      programs: null,
    };
  },
  mounted() {
    this.init();
  },
  computed: {
    currentStatus: function () {
      if (this.$store.getters['notes/lastAlert.actual_level']) return this.$store.getters['notes/lastAlert.actual_level'].current_status;
    },
    lastAlert: function () {
      if (this.$store.state.submission.last_alert) {
        return this.$store.state.submission.last_alert;
      }
      return false;
    },
    isApproved: function () {
      if (this.$store.getters['evaluation/team'] && this.$store.getters['evaluation/team'].length) {
        return this.$store.getters['evaluation/team'][0].leader_approved ? false : true;
      }
    },
    isLeader: function () {
      if (this.$store.getters['submission/team']) {
        let leader = this.$store.getters['submission/team'].all_members.find(member => member.team_job == 1);
        if (leader.id == this.authUser().id) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    // programs: function () {
    //   if (this.ruleForm.qualification_id && this.$store.getters['submission/statisticsData'] && this.$store.getters['submission/statisticsData'].program_info) {
    //     let program = this.$store.getters['submission/statisticsData'].program_info.find(prog => prog.id == this.ruleForm.qualification_id);
    //     return program;
    //   }
    // },
  },
  methods: {
    init() {
      this.$store.dispatch('submission/getStatisticsData', this.$route.params.id).then(_ => {});
    },
    saveNote(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.isLoad = true;
          this.$store
            .dispatch('submission/saveNote', {
              id: this.note_id ? `/${this.note_id}` : '',
              query: { type: this.type_id, evaluation_id: this.$route.params.id, note: this.ruleForm.note },
            })
            .then(_ => {
              this.init();
              this.isLoad = false;
              this.activity_dialog = false;
            });
        }
      });
    },
    openActivityDialog(activity, note) {
      this.type_id = activity.type_id;
      this.title = activity.name;
      if (note) {
        this.note_id = note.id;
        this.ruleForm.note = note.note;
      } else {
        this.ruleForm.note = null;
        this.note_id = null;
      }
      this.activity_dialog = true;
    },
    openProgramDialog(program) {
      if (program) {
        this.program_id = program.id;
        this.ruleForm.program_id = program.program_id;
        this.ruleForm.value = program.student_count;
      } else {
        this.program_id = null;
        this.ruleForm.program_id = null;
        this.ruleForm.value = null;
      }
      this.program_dialog = true;
    },

    openStaffDialog(activity, staff) {
      this.title = `${activity.cat} (${activity.item})  ${activity.is_postgraduate ? `(${this.$t('Global.postgraduate')})` : ''}`;
      this.ruleForm.statistic_activity_id = activity.id;
      if (staff) {
        this.staff_id = staff.id;
        this.ruleForm.qualification_id = staff.qualification_id;
        this.ruleForm.working_year_id = staff.year_id;
        this.ruleForm.program_id = staff.program_id;
        this.ruleForm.value = staff.activity_value;
      } else {
        this.staff_id = null;
        this.ruleForm.qualification_id = null;
        this.ruleForm.working_year_id = null;
        this.ruleForm.value = null;
      }
      this.staff_dialog = true;
    },
    openDepartmentDialog(activity, department) {
      this.type_id = activity.type_id;
      this.title = activity.type_name;
      if (department) {
        this.department_id = department.id;
        this.ruleForm.value = department.actual_count;
        this.ruleForm.count = department.staff_count;
        this.ruleForm.department_id = department.department_id;
      } else {
        this.department_id = null;
        this.ruleForm.value = null;
        this.ruleForm.count = null;
        this.ruleForm.department_id = null;
      }
      this.departments_dialog = true;
    },
    openStatisticDialog(statistic, staff) {
      this.type_id = statistic.type_id;
      this.title = statistic.type_name;
      if (staff) {
        this.ruleForm.statistic_staff_id = staff.statistic_staff_id;
        this.ruleForm.category_id = staff.category_id;
        this.ruleForm.value = staff.value;
      } else {
        this.ruleForm.statistic_staff_id = null;
        this.ruleForm.category_id = null;
        this.ruleForm.value = null;
      }
      this.statistic_dialog = true;
    },
    saveStatisticStaff(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.isLoad = true;
          this.$store
            .dispatch('submission/saveStatisticStaff', {
              query: {
                statistic_staff_id: this.ruleForm.statistic_staff_id,
                evaluation_id: this.$route.params.id,
                value: this.ruleForm.value,
              },
            })
            .then(_ => {
              this.statistic_dialog = false;
              this.isLoad = false;
              this.init();
            });
        }
      });
    },
    saveDepartment(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.isLoad = true;
          this.$store
            .dispatch('submission/saveDepartment', {
              id: this.department_id ? `/${this.department_id}` : '',
              query: {
                department_id: this.ruleForm.department_id,
                staff: this.type_id,
                evaluation_id: this.$route.params.id,
                real_count: this.ruleForm.value,
                staff_count: this.ruleForm.count,
              },
            })
            .then(_ => {
              this.departments_dialog = false;
              this.isLoad = false;
              this.init();
            });
        }
      });
    },
    saveProgram(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.isLoad = true;
          this.$store
            .dispatch('submission/saveProgram', {
              id: this.program_id ? `/${this.program_id}` : '',
              query: {
                program_id: this.ruleForm.program_id,
                evaluation_id: this.$route.params.id,
                students_count: this.ruleForm.value,
              },
            })
            .then(_ => {
              this.program_dialog = false;
              this.isLoad = false;
              this.init();
            });
        }
      });
    },
    saveActivity(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.isLoad = true;
          this.$store
            .dispatch('submission/saveActivity', {
              id: this.staff_id ? `/${this.staff_id}` : '',
              query: {
                statistic_activity_id: this.ruleForm.statistic_activity_id,
                evaluation_id: this.$route.params.id,
                activity_value: this.ruleForm.value,
                program_id: this.ruleForm.program_id,
                qualification_id: this.ruleForm.qualification_id,
                working_year_id: this.ruleForm.working_year_id,
              },
            })
            .then(_ => {
              this.staff_dialog = false;
              this.isLoad = false;
              this.init();
            });
        }
      });
    },
  },
  watch: {
    'ruleForm.qualification_id'(value, newVal) {
      if (newVal) {
        this.ruleForm.program_id = null;
      }
      if (value && this.$store.getters['submission/programsData']) {
        let program = this.$store.getters['submission/programsData'].find(prog => prog.id == value);
        this.programs = program.programs;
      }
      if (value) {
        this.disabled_prog = false;
      } else {
        this.disabled_prog = true;
      }
    },
    'ruleForm.category_id'(value, newVal) {
      if (newVal) {
        this.ruleForm.statistic_staff_id = null;
      }
      if (value) {
        this.disabledVal = false;
      } else {
        this.disabledVal = true;
      }
    },
    'ruleForm.value'(value) {
      if (this.ruleForm.value) {
        this.ruleForm.value = value.toString().replace(/[^0-9]/g, '');
      }
    },
    'ruleForm.count'(value) {
      if (this.ruleForm.count) {
        this.ruleForm.count = value.toString().replace(/[^0-9]/g, '');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.hide_border {
  border: 0;
}

.el-collapse-item__header {
  .card-header {
    order: 4;
  }

  .el-collapse-item__arrow {
    order: 1;
  }
}
@-moz-document url-prefix() {
  .font_12 {
    font-size: 12px !important;
  }
}
</style>
