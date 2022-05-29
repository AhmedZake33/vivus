<template>
  <div class="w-100 mt-2">
    <div class="d-flex justify-content-center my-2">
      <CSpinner v-if="isLoad" size="sm" color="info" />
    </div>
    <el-collapse accordion class="custom_collapse custom_collapse_docs">
      <el-collapse-item :title="$t('Global.indicator')">
        <template slot="title">
          <CCardHeader>
            <div :class="$i18n.locale === 'ar' ? 'card-header-actions' : 'ml-2 mr-2'" style="display: inline-block"><i class="el-icon-data-analysis"></i>{{ $t('Global.indicator') }}</div>
          </CCardHeader>
        </template>
        <el-form class="px-2" v-if="validation(null, 0)" label-position="top" :model="form" status-icon size="large" ref="form" label-width="120px">
          <CRow>
            <CCol lg="6" sm="12">
              <el-form-item :rules="validation(null, 1)" prop="mainIndicator" :label="$t('Global.mainIndicator')">
                <div>
                  <el-select ref="mainIndicator" :no-data-text="$t('Global.nodata')" :placeholder="$t('Global.mainIndicator')" style="width: 100%" v-model="form.mainIndicator" filterable clearable>
                    <el-option v-if="$store.getters['submission/SClookups'] && $store.getters['submission/SClookups'].standards" v-for="standard in $store.getters['submission/SClookups'].standards" :key="standard.id" :label="standard.name" :value="standard.id">
                      <span style="float: right; color: #8492a6; font-size: 13px">
                        {{ standard.name }}
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
            <CCol lg="6" sm="12">
              <el-form-item :rules="validation(null, 1)" prop="subIndicator" :label="$t('Global.subIndicator')">
                <div>
                  <el-select style="width: 100%" :disabled="mainDisable" ref="subIndicator" :no-data-text="$t('Global.nodata')" :placeholder="$t('Global.subIndicator')" v-model="form.subIndicator" filterable clearable>
                    <el-option v-for="standard in $store.getters['submission/standards']" :key="standard.id" :label="standard.name" :value="standard.id">
                      <span style="float: right; color: #8492a6; font-size: 13px">
                        {{ standard.name }}
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

            <div class="w-100 justify-content-between align-items-center px-2 my-2">
              <el-table :data="$store.getters['submission/result']" :header-cell-class-name="$i18n.locale === 'ar' ? 'text-right' : ''" :cell-class-name="$i18n.locale === 'ar' ? 'text-right' : ''">
                <el-table-column prop="name" width="200" :label="$t('Global.indicator')"></el-table-column>
                <el-table-column prop="status" width="100" :label="$t('Global.indicatorDegree')">
                  <template slot-scope="scope" width="250">
                    <p v-if="scope.row.status == 0">{{ $t('Global.disagree') }}</p>
                    <p v-if="scope.row.status == 1">{{ $t('Global.agree') }}</p>
                  </template>
                </el-table-column>
                <el-table-column prop="notes" width="800" :label="$t('Global.checkResult')">
                  <template slot-scope="scope">
                    <p v-if="scope.row.note" v-html="ntBr(scope.row.note)"></p>
                  </template>
                </el-table-column>
                <el-table-column prop="" label=" ">
                  <template slot-scope="scope">
                    <template
                      v-if="
                        !$store.getters['submission/decision'] &&
                        ((evaluatorCheck(['ORGANIZATION_TYPE']) && updateConstants('string', 'DOCUMENTS_UPDATE') == $store.state.submission.last_alert.allow_update) ||
                          ($store.state.submission.last_alert.actual_level &&
                            ($store.state.submission.last_alert.actual_level <= 4 ||
                              ([showConstants('string', 'REPORT_APPROVAL_TEAM_COMMITTEE'), showConstants('string', 'NO_CHANGE'), showConstants('string', 'REPORT_APPROVAL')].includes($store.state.submission.last_alert.show_type) && $store.state.submission.last_alert.actual_level == 6)) &&
                            isApproved &&
                            isLeader) ||
                          hasPermission('admin_submissions') ||
                          evaluatorCheck(['VICE_TYPE']) ||
                          evaluatorCheck(['COMMITTEE_TYPE']) ||
                          hasPermission('report_update') ||
                          (evaluatorCheck(['COMMITTEE_TYPE']) && showAction))
                      "
                    >
                      <div :style="$i18n.locale === 'ar' ? 'text-align:left' : 'float: right'" v-if="$store.state.user.allowPu || hasPermission('admin_system')">
                        <i :class="`${scope.row.id ? 'el-icon-edit-outline table-action-item' : 'el-icon-plus table-action-item'}`" style="font-size: 17px" @click="openIndicatorDialog(scope.row.id ? scope.row : null, scope.row.standard_id ? scope.row.standard_id : null)"></i>
                      </div>
                    </template>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </CRow>
        </el-form>
      </el-collapse-item>
    </el-collapse>

    <el-collapse v-model="activeName" accordion v-for="data in $store.getters['submission/statisticsData']" class="custom_collapse custom_collapse_docs">
      <el-collapse-item :title="data.title" v-if="data.title == 'details'">
        <template slot="title">
          <CCardHeader>
            <div :class="$i18n.locale === 'ar' ? 'card-header-actions' : 'ml-2 mr-2'" style="display: inline-block"><i class="el-icon-data-analysis"></i>{{ $t(`Global.SC${data.title}`) }}</div>
          </CCardHeader>
        </template>

        <div class="d-flex flex-column text-initial">
          <CRow>
            <CCol sm="12">
              <div class="w-100 mx-2 mt-2">
                <div class="px-3 docs_header d-flex justify-content-between align-items-center">
                  <span class="font_12">
                    {{ $t(`Global.SC${data.title}1`) }}
                    <template
                      v-if="
                        (!$store.getters['submission/decision'] && evaluatorCheck(['ORGANIZATION_TYPE']) && updateConstants('string', 'DOCUMENTS_UPDATE') == $store.state.submission.last_alert.allow_update) ||
                        ($store.state.submission.last_alert &&
                          ($store.state.submission.last_alert.actual_level <= 4 ||
                            ([showConstants('string', 'REPORT_APPROVAL_TEAM_COMMITTEE'), showConstants('string', 'NO_CHANGE'), showConstants('string', 'REPORT_APPROVAL')].includes($store.state.submission.last_alert.show_type) && $store.state.submission.last_alert.actual_level == 6)) &&
                          isApproved &&
                          isLeader) ||
                        hasPermission('admin_submissions') ||
                        evaluatorCheck(['VICE_TYPE']) ||
                        evaluatorCheck(['COMMITTEE_TYPE']) ||
                        hasPermission('report_update')
                      "
                    >
                      <div v-if="$store.state.user.allowPu || hasPermission('admin_system')">
                        <i v-if="data.details && data.details.vision"></i>
                        <i v-else class="el-icon-circle-plus pt-1" style="font-size: 21px; cursor: pointer" @click="openDetialsDialog('details', data.title, data, 'detailsV')"></i>
                      </div>
                    </template>
                  </span>
                </div>
              </div>
              <CCardBody>
                <div class="button_after report_style custom_report mb-3 pb-2" style="background-color: #c3c3c3" v-if="data.details">
                  <div style="margin-left: 20px; margin-right: 20px; width: 80%" class="d-flex">
                    <p v-if="data.details.vision" class="mb-0 text-initial p-1" style="word-break: break-word" v-html="ntBr(data.details.vision)"></p>
                    <p v-else class="mb-2">
                      <small>{{ $t('Global.nodata') }}</small>
                    </p>
                    <template
                      v-if="
                        !$store.getters['submission/decision'] &&
                        ((evaluatorCheck(['ORGANIZATION_TYPE']) && updateConstants('string', 'DOCUMENTS_UPDATE') == $store.state.submission.last_alert.allow_update) ||
                          ($store.state.submission.last_alert.actual_level &&
                            ($store.state.submission.last_alert.actual_level <= 4 ||
                              ([showConstants('string', 'REPORT_APPROVAL_TEAM_COMMITTEE'), showConstants('string', 'NO_CHANGE'), showConstants('string', 'REPORT_APPROVAL')].includes($store.state.submission.last_alert.show_type) && $store.state.submission.last_alert.actual_level == 6)) &&
                            isApproved &&
                            isLeader) ||
                          hasPermission('admin_submissions') ||
                          evaluatorCheck(['VICE_TYPE']) ||
                          evaluatorCheck(['COMMITTEE_TYPE']) ||
                          hasPermission('report_update') ||
                          (evaluatorCheck(['COMMITTEE_TYPE']) && showAction))
                      "
                    >
                      <div v-if="$store.state.user.allowPu || hasPermission('admin_system')">
                        <el-button
                          v-if="data.details && data.details.vision"
                          :icon="`${$store.getters['evaluation/parent'].answer ? 'el-icon-edit' : 'el-icon-plus'}`"
                          round
                          size="mini"
                          @click="openDetialsDialog('details', data.title, data, 'detailsV')"
                          class="right_icon custom_send_icon mb-1"
                          type="primary"
                          >{{ $t('Global.edit') }}
                        </el-button>
                      </div>
                    </template>
                  </div>
                </div>
              </CCardBody>
            </CCol>
            <CCol sm="12">
              <div class="w-100 mx-2 mt-2">
                <div class="px-3 docs_header d-flex justify-content-between align-items-center">
                  <span class="font_12">
                    {{ $t(`Global.SC${data.title}2`) }}
                    <template
                      v-if="
                        !$store.getters['submission/decision'] &&
                        ((evaluatorCheck(['ORGANIZATION_TYPE']) && updateConstants('string', 'DOCUMENTS_UPDATE') == $store.state.submission.last_alert.allow_update) ||
                          ($store.state.submission.last_alert.actual_level &&
                            ($store.state.submission.last_alert.actual_level <= 4 ||
                              ([showConstants('string', 'REPORT_APPROVAL_TEAM_COMMITTEE'), showConstants('string', 'NO_CHANGE'), showConstants('string', 'REPORT_APPROVAL')].includes($store.state.submission.last_alert.show_type) && $store.state.submission.last_alert.actual_level == 6)) &&
                            isApproved &&
                            isLeader) ||
                          hasPermission('admin_submissions') ||
                          evaluatorCheck(['VICE_TYPE']) ||
                          evaluatorCheck(['COMMITTEE_TYPE']) ||
                          hasPermission('report_update') ||
                          (evaluatorCheck(['COMMITTEE_TYPE']) && showAction))
                      "
                    >
                      <div v-if="$store.state.user.allowPu || hasPermission('admin_system')">
                        <i v-if="data.details && data.details.message"></i>
                        <i v-else class="el-icon-circle-plus pt-1" style="font-size: 21px; cursor: pointer" @click="openDetialsDialog('details', data.title, null, 'detailsM')"></i>
                      </div>
                    </template>
                  </span>
                </div>
              </div>
              <CCardBody>
                <div class="button_after report_style custom_report mb-3 pb-2" style="background-color: #c3c3c3" v-if="data.details">
                  <div style="margin-left: 20px; margin-right: 20px; width: 80%" class="d-flex">
                    <p v-if="data.details.message" class="mb-0 text-initial p-1" style="word-break: break-word" v-html="ntBr(data.details.message)"></p>
                    <p v-else class="mb-2">
                      <small>{{ $t('Global.nodata') }}</small>
                    </p>
                    <template
                      v-if="
                        !$store.getters['submission/decision'] &&
                        ((evaluatorCheck(['ORGANIZATION_TYPE']) && updateConstants('string', 'DOCUMENTS_UPDATE') == $store.state.submission.last_alert.allow_update) ||
                          ($store.state.submission.last_alert.actual_level &&
                            ($store.state.submission.last_alert.actual_level <= 4 ||
                              ([showConstants('string', 'REPORT_APPROVAL_TEAM_COMMITTEE'), showConstants('string', 'NO_CHANGE'), showConstants('string', 'REPORT_APPROVAL')].includes($store.state.submission.last_alert.show_type) && $store.state.submission.last_alert.actual_level == 6)) &&
                            isApproved &&
                            isLeader) ||
                          hasPermission('admin_submissions') ||
                          evaluatorCheck(['VICE_TYPE']) ||
                          evaluatorCheck(['COMMITTEE_TYPE']) ||
                          hasPermission('report_update') ||
                          (evaluatorCheck(['COMMITTEE_TYPE']) && showAction))
                      "
                    >
                      <div v-if="$store.state.user.allowPu || hasPermission('admin_system')">
                        <el-button
                          v-if="data.details && data.details.message"
                          :icon="`${$store.getters['evaluation/parent'].answer ? 'el-icon-edit' : 'el-icon-plus'}`"
                          round
                          size="mini"
                          @click="openDetialsDialog('details', data.title, data, 'detailsM')"
                          class="right_icon custom_send_icon mb-1"
                          type="primary"
                          >{{ $t('Global.edit') }}
                        </el-button>
                      </div>
                    </template>
                  </div>
                </div>
              </CCardBody>
            </CCol>
          </CRow>
        </div>
      </el-collapse-item>
      <el-collapse-item :title="data.title" v-if="data.title == 'statistics'">
        <template slot="title">
          <CCardHeader>
            <div :class="$i18n.locale === 'ar' ? 'card-header-actions' : 'ml-2 mr-2'" style="display: inline-block"><i class="el-icon-data-analysis"></i>{{ $t(`Global.SC${data.title}`) }}</div>
          </CCardHeader>
        </template>
        <div class="d-flex flex-column text-initial">
          <CRow>
            <CCol sm="12" md="6" lg="6" v-if="data.statistics" v-for="statistic in $store.getters['submission/SCSomestatisticsData']">
              <div class="w-100 mx-2 mt-2">
                <div class="px-3 docs_header d-flex justify-content-between align-items-center">
                  <span v-if="statistic.title == 'student_statistics'" class="font_12">
                    {{ $t(`Global.${statistic.title}`) }}
                    <template
                      v-if="
                        !$store.getters['submission/decision'] &&
                        ((evaluatorCheck(['ORGANIZATION_TYPE']) && updateConstants('string', 'DOCUMENTS_UPDATE') == $store.state.submission.last_alert.allow_update) ||
                          ($store.state.submission.last_alert.actual_level &&
                            ($store.state.submission.last_alert.actual_level <= 4 ||
                              ([showConstants('string', 'REPORT_APPROVAL_TEAM_COMMITTEE'), showConstants('string', 'NO_CHANGE'), showConstants('string', 'REPORT_APPROVAL')].includes($store.state.submission.last_alert.show_type) && $store.state.submission.last_alert.actual_level == 6)) &&
                            isApproved &&
                            isLeader) ||
                          hasPermission('admin_submissions') ||
                          evaluatorCheck(['VICE_TYPE']) ||
                          evaluatorCheck(['COMMITTEE_TYPE']) ||
                          hasPermission('report_update') ||
                          (evaluatorCheck(['COMMITTEE_TYPE']) && showAction))
                      "
                    >
                      <i v-if="$store.state.user.allowPu || hasPermission('admin_system')" class="el-icon-circle-plus pt-1" style="font-size: 21px; cursor: pointer" @click="openStudentStatisticDialog('student', statistic.title, null)"></i>
                    </template>
                  </span>
                  <span v-if="statistic.title == 'disabilityStatistics'" class="font_12"
                    >{{ $t(`Global.${statistic.title}`) }}
                    <template
                      v-if="
                        !$store.getters['submission/decision'] &&
                        ((evaluatorCheck(['ORGANIZATION_TYPE']) && updateConstants('string', 'DOCUMENTS_UPDATE') == $store.state.submission.last_alert.allow_update) ||
                          ($store.state.submission.last_alert.actual_level &&
                            ($store.state.submission.last_alert.actual_level <= 4 ||
                              ([showConstants('string', 'REPORT_APPROVAL_TEAM_COMMITTEE'), showConstants('string', 'NO_CHANGE'), showConstants('string', 'REPORT_APPROVAL')].includes($store.state.submission.last_alert.show_type) && $store.state.submission.last_alert.actual_level == 6)) &&
                            isApproved &&
                            isLeader) ||
                          hasPermission('admin_submissions') ||
                          evaluatorCheck(['VICE_TYPE']) ||
                          evaluatorCheck(['COMMITTEE_TYPE']) ||
                          hasPermission('report_update') ||
                          (evaluatorCheck(['COMMITTEE_TYPE']) && showAction))
                      "
                    >
                      <i v-if="$store.state.user.allowPu || hasPermission('admin_system')" class="el-icon-circle-plus pt-1" style="font-size: 21px; cursor: pointer" @click="opendisabilityStatisticsDialog('disability', statistic.title, null)"></i>
                    </template>
                  </span>
                </div>
                <span class="d-block mx-2 mt-2 px-3 docs_header justify-content-between align-items-center">
                  <el-table v-if="statistic.disabilityStatistics" :data="statistic.disabilityStatistics" style="width: 100%" :header-cell-class-name="$i18n.locale === 'ar' ? 'text-right' : ''" :cell-class-name="$i18n.locale === 'ar' ? 'text-right' : ''">
                    <el-table-column prop="class" width="130" :label="$t('Global.class')"></el-table-column>
                    <el-table-column prop="type" width="130" :label="$t('Global.category')"></el-table-column>
                    <el-table-column prop="male" width="80" :label="$t('Global.male_count')">
                      <template slot-scope="scope">
                        {{ scope.row.male ? scope.row.male : '-' }}
                      </template>
                    </el-table-column>
                    <el-table-column prop="female" width="80" :label="$t('Global.female_count')">
                      <template slot-scope="scope">
                        {{ scope.row.female ? scope.row.female : '-' }}
                      </template>
                    </el-table-column>
                    <el-table-column prop="" label=" ">
                      <template slot-scope="scope">
                        <template
                          v-if="
                            !$store.getters['submission/decision'] &&
                            ((evaluatorCheck(['ORGANIZATION_TYPE']) && updateConstants('string', 'DOCUMENTS_UPDATE') == $store.state.submission.last_alert.allow_update) ||
                              ($store.state.submission.last_alert.actual_level &&
                                ($store.state.submission.last_alert.actual_level <= 4 ||
                                  ([showConstants('string', 'REPORT_APPROVAL_TEAM_COMMITTEE'), showConstants('string', 'NO_CHANGE'), showConstants('string', 'REPORT_APPROVAL')].includes($store.state.submission.last_alert.show_type) && $store.state.submission.last_alert.actual_level == 6)) &&
                                isApproved &&
                                isLeader) ||
                              hasPermission('admin_submissions') ||
                              evaluatorCheck(['VICE_TYPE']) ||
                              evaluatorCheck(['COMMITTEE_TYPE']) ||
                              hasPermission('report_update') ||
                              (evaluatorCheck(['COMMITTEE_TYPE']) && showAction))
                          "
                        >
                          <div :style="$i18n.locale === 'ar' ? 'text-align:left' : 'float: right'">
                            <i v-if="$store.state.user.allowPu || hasPermission('admin_system')" class="el-icon-edit-outline table-action-item" style="font-size: 17px" @click="opendisabilityStatisticsDialog('disability', statistic.title, scope.row)"></i>
                          </div>
                        </template>
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-table v-if="statistic.student_statistics" :data="statistic.student_statistics" style="width: 100%" :header-cell-class-name="$i18n.locale === 'ar' ? 'text-right' : ''" :cell-class-name="$i18n.locale === 'ar' ? 'text-right' : ''">
                    <el-table-column prop="class" width="150" :label="$t('Global.class')"></el-table-column>
                    <el-table-column prop="male" :label="$t('Global.male_count')">
                      <template slot-scope="scope">
                        {{ scope.row.male ? scope.row.male : '-' }}
                      </template>
                    </el-table-column>
                    <el-table-column prop="female" :label="$t('Global.female_count')">
                      <template slot-scope="scope">
                        {{ scope.row.female ? scope.row.female : '-' }}
                      </template>
                    </el-table-column>
                    <el-table-column prop="class_count" :label="$t('Global.class_count')">
                      <template slot-scope="scope">
                        {{ scope.row.class_count ? scope.row.class_count : '-' }}
                      </template>
                    </el-table-column>
                    <el-table-column prop="" label=" ">
                      <template slot-scope="scope">
                        <template
                          v-if="
                            !$store.getters['submission/decision'] &&
                            ((evaluatorCheck(['ORGANIZATION_TYPE']) && updateConstants('string', 'DOCUMENTS_UPDATE') == $store.state.submission.last_alert.allow_update) ||
                              ($store.state.submission.last_alert.actual_level &&
                                ($store.state.submission.last_alert.actual_level <= 4 ||
                                  ([showConstants('string', 'REPORT_APPROVAL_TEAM_COMMITTEE'), showConstants('string', 'NO_CHANGE'), showConstants('string', 'REPORT_APPROVAL')].includes($store.state.submission.last_alert.show_type) && $store.state.submission.last_alert.actual_level == 6)) &&
                                isApproved &&
                                isLeader) ||
                              hasPermission('admin_submissions') ||
                              evaluatorCheck(['VICE_TYPE']) ||
                              evaluatorCheck(['COMMITTEE_TYPE']) ||
                              hasPermission('report_update') ||
                              (evaluatorCheck(['COMMITTEE_TYPE']) && showAction))
                          "
                        >
                          <div :style="$i18n.locale === 'ar' ? 'text-align:left' : 'float: right'" v-if="$store.state.user.allowPu || hasPermission('admin_system')">
                            <i class="el-icon-edit-outline table-action-item" style="font-size: 17px" @click="openStudentStatisticDialog('student', statistic.title, scope.row)"></i>
                          </div>
                        </template>
                      </template>
                    </el-table-column>
                  </el-table>
                </span>
              </div>
            </CCol>
          </CRow>
        </div>
      </el-collapse-item>
      <el-collapse-item :title="data.title" v-if="data.title == 'organizationStatistics'">
        <template slot="title">
          <CCardHeader>
            <div :class="$i18n.locale === 'ar' ? 'card-header-actions' : 'ml-2 mr-2'" style="display: inline-block"><i class="el-icon-data-analysis"></i>{{ $t(`Global.${data.title}`) }}</div>
          </CCardHeader>
        </template>
        <div class="d-flex flex-column text-initial">
          <CRow>
            <CCol sm="12" md="12" lg="12" v-if="data.organizationStatistics">
              <div class="w-100 mx-2 mt-2">
                <span class="d-block mx-2 mt-2 px-3 docs_header justify-content-between align-items-center" v-if="data.organizationStatistics">
                  <span class="font_12">
                    {{ $t(`Global.${data.title}`) }}
                    <template
                      v-if="
                        !$store.getters['submission/decision'] &&
                        ((evaluatorCheck(['ORGANIZATION_TYPE']) && updateConstants('string', 'DOCUMENTS_UPDATE') == $store.state.submission.last_alert.allow_update) ||
                          ($store.state.submission.last_alert.actual_level &&
                            ($store.state.submission.last_alert.actual_level <= 4 ||
                              ([showConstants('string', 'REPORT_APPROVAL_TEAM_COMMITTEE'), showConstants('string', 'NO_CHANGE'), showConstants('string', 'REPORT_APPROVAL')].includes($store.state.submission.last_alert.show_type) && $store.state.submission.last_alert.actual_level == 6)) &&
                            isApproved &&
                            isLeader) ||
                          hasPermission('admin_submissions') ||
                          evaluatorCheck(['VICE_TYPE']) ||
                          evaluatorCheck(['COMMITTEE_TYPE']) ||
                          hasPermission('report_update') ||
                          (evaluatorCheck(['COMMITTEE_TYPE']) && showAction))
                      "
                    >
                      <i v-if="$store.state.user.allowPu || hasPermission('admin_system')" class="el-icon-circle-plus pt-1" style="font-size: 21px; cursor: pointer" @click="openorganizationStatisticsDialog('stats', data.title, null)"></i>
                    </template>
                  </span>
                  <el-table v-if="data.organizationStatistics" :data="data.organizationStatistics" style="width: 100%" :header-cell-class-name="$i18n.locale === 'ar' ? 'text-right' : ''" :cell-class-name="$i18n.locale === 'ar' ? 'text-right' : ''">
                    <el-table-column prop="stats" width="400" :label="$t('Global.category')"></el-table-column>
                    <el-table-column prop="male" :label="$t('Global.male_count')">
                      <template slot-scope="scope">
                        {{ scope.row.male ? scope.row.male : '-' }}
                      </template>
                    </el-table-column>
                    <el-table-column prop="female" :label="$t('Global.female_count')">
                      <template slot-scope="scope">
                        {{ scope.row.female ? scope.row.female : '-' }}
                      </template>
                    </el-table-column>
                    <el-table-column prop="" label=" ">
                      <template slot-scope="scope">
                        <template
                          v-if="
                            !$store.getters['submission/decision'] &&
                            ((evaluatorCheck(['ORGANIZATION_TYPE']) && updateConstants('string', 'DOCUMENTS_UPDATE') == $store.state.submission.last_alert.allow_update) ||
                              ($store.state.submission.last_alert.actual_level &&
                                ($store.state.submission.last_alert.actual_level <= 4 ||
                                  ([showConstants('string', 'REPORT_APPROVAL_TEAM_COMMITTEE'), showConstants('string', 'NO_CHANGE'), showConstants('string', 'REPORT_APPROVAL')].includes($store.state.submission.last_alert.show_type) && $store.state.submission.last_alert.actual_level == 6)) &&
                                isApproved &&
                                isLeader) ||
                              hasPermission('admin_submissions') ||
                              evaluatorCheck(['VICE_TYPE']) ||
                              evaluatorCheck(['COMMITTEE_TYPE']) ||
                              hasPermission('report_update') ||
                              (evaluatorCheck(['COMMITTEE_TYPE']) && showAction))
                          "
                        >
                          <div :style="$i18n.locale === 'ar' ? 'text-align:left' : 'float: right'" v-if="$store.state.user.allowPu || hasPermission('admin_system')">
                            <i class="el-icon-edit-outline table-action-item" style="font-size: 17px" @click="openorganizationStatisticsDialog('stats', data.title, scope.row)"></i>
                          </div>
                        </template>
                      </template>
                    </el-table-column>
                  </el-table>
                </span>
              </div>
            </CCol>
          </CRow>
        </div>
      </el-collapse-item>
      <el-collapse-item :title="data.title" v-if="data.title == 'examResult'">
        <template slot="title">
          <CCardHeader>
            <div :class="$i18n.locale === 'ar' ? 'card-header-actions' : 'ml-2 mr-2'" style="display: inline-block"><i class="el-icon-data-analysis"></i>{{ $t(`Global.${data.title}`) }}</div>
          </CCardHeader>
        </template>

        <div class="d-flex flex-column text-initial">
          <CRow>
            <CCol sm="12" md="12" lg="12" v-if="data" v-for="(exam, key) in data.examResult">
              <div class="w-100 mt-2">
                <div class="px-3 docs_header d-flex justify-content-between align-items-center">
                  <span class="font_12">
                    {{ key }}
                    <!-- <i class="el-icon-circle-plus pt-1" style="font-size: 21px; cursor: pointer" @click="openexamResultDialog('exam', data.title, null)"></i> -->
                  </span>
                </div>
                <div class="px-2">
                  <vue-excel-editor :value="getExam(exam)" no-footer filter-row>
                    <vue-excel-column readonly text-align="right" field="ClassName" :label="$t(`Global.class`)" />
                    <vue-excel-column readonly text-align="right" field="SubjectName" :label="$t(`Global.subject`)" />
                    <vue-excel-column readonly text-align="right" field="term" :label="$t(`Global.term`)" />
                    <vue-excel-column
                      :readonly="
                        !$store.getters['submission/decision'] &&
                        ((evaluatorCheck(['ORGANIZATION_TYPE']) && updateConstants('string', 'DOCUMENTS_UPDATE') == $store.state.submission.last_alert.allow_update) ||
                          ($store.state.submission.last_alert.actual_level &&
                            ($store.state.submission.last_alert.actual_level <= 4 ||
                              ([showConstants('string', 'REPORT_APPROVAL_TEAM_COMMITTEE'), showConstants('string', 'NO_CHANGE'), showConstants('string', 'REPORT_APPROVAL')].includes($store.state.submission.last_alert.show_type) && $store.state.submission.last_alert.actual_level == 6)) &&
                            isApproved &&
                            isLeader) ||
                          hasPermission('admin_submissions') ||
                          evaluatorCheck(['VICE_TYPE']) ||
                          evaluatorCheck(['COMMITTEE_TYPE']) ||
                          hasPermission('report_update') ||
                          (evaluatorCheck(['COMMITTEE_TYPE']) && showAction))
                          ? false
                          : true
                      "
                      text-align="right"
                      sticky
                      :length-limit="4"
                      :validate="validNumber"
                      field="success_count"
                      :label="$t(`Global.success65_count`)"
                    />
                    <vue-excel-column
                      :readonly="
                        !$store.getters['submission/decision'] &&
                        ((evaluatorCheck(['ORGANIZATION_TYPE']) && updateConstants('string', 'DOCUMENTS_UPDATE') == $store.state.submission.last_alert.allow_update) ||
                          ($store.state.submission.last_alert.actual_level &&
                            ($store.state.submission.last_alert.actual_level <= 4 ||
                              ([showConstants('string', 'REPORT_APPROVAL_TEAM_COMMITTEE'), showConstants('string', 'NO_CHANGE'), showConstants('string', 'REPORT_APPROVAL')].includes($store.state.submission.last_alert.show_type) && $store.state.submission.last_alert.actual_level == 6)) &&
                            isApproved &&
                            isLeader) ||
                          hasPermission('admin_submissions') ||
                          evaluatorCheck(['VICE_TYPE']) ||
                          evaluatorCheck(['COMMITTEE_TYPE']) ||
                          hasPermission('report_update') ||
                          (evaluatorCheck(['COMMITTEE_TYPE']) && showAction))
                          ? false
                          : true
                      "
                      text-align="right"
                      sticky
                      :length-limit="4"
                      :change="onBeforeNameChange"
                      field="attend_count"
                      :label="$t(`Global.attend_count`)"
                    />
                    <vue-excel-column readonly text-align="right" sticky field="total" :label="$t(`Global.rate_success65_count`)" />
                  </vue-excel-editor>
                </div>
              </div>
            </CCol>
          </CRow>
        </div>
      </el-collapse-item>
      <el-collapse-item :title="data.title" v-if="data.title == 'build_statistics'">
        <template slot="title">
          <CCardHeader>
            <div :class="$i18n.locale === 'ar' ? 'card-header-actions' : 'ml-2 mr-2'" style="display: inline-block"><i class="el-icon-data-analysis"></i>{{ $t(`Global.MAINschoolBuild`) }}</div>
          </CCardHeader>
        </template>
        <div class="d-flex flex-column text-initial">
          <CRow>
            <CCol sm="12" md="12" lg="12" v-if="data.build_statistics">
              <div class="w-100 mx-2 mt-2">
                <span class="d-block mx-2 mt-2 px-3 docs_header justify-content-between align-items-center" v-if="data.build_statistics">
                  <span class="font_12">
                    {{ $t(`Global.SC${data.title}`) }}
                    <template
                      v-if="
                        !$store.getters['submission/decision'] &&
                        ((evaluatorCheck(['ORGANIZATION_TYPE']) && updateConstants('string', 'DOCUMENTS_UPDATE') == $store.state.submission.last_alert.allow_update) ||
                          ($store.state.submission.last_alert.actual_level &&
                            ($store.state.submission.last_alert.actual_level <= 4 ||
                              ([showConstants('string', 'REPORT_APPROVAL_TEAM_COMMITTEE'), showConstants('string', 'NO_CHANGE'), showConstants('string', 'REPORT_APPROVAL')].includes($store.state.submission.last_alert.show_type) && $store.state.submission.last_alert.actual_level == 6)) &&
                            isApproved &&
                            isLeader) ||
                          hasPermission('admin_submissions') ||
                          evaluatorCheck(['VICE_TYPE']) ||
                          evaluatorCheck(['COMMITTEE_TYPE']) ||
                          hasPermission('report_update') ||
                          (evaluatorCheck(['COMMITTEE_TYPE']) && showAction))
                      "
                    >
                      <div v-if="$store.state.user.allowPu || hasPermission('admin_system')">
                        <i v-if="!data.build_statistics.schoolBuild" class="el-icon-circle-plus pt-1" style="font-size: 21px; cursor: pointer" @click="openschoolBuildDialog('schoolBuild', data.title, null)"></i>
                        <i v-else class="el-icon-edit-outline table-action-item" style="font-size: 17px" @click="openschoolBuildDialog('schoolBuild', data.title, data.build_statistics.schoolBuild)"></i>
                      </div>
                    </template>
                  </span>
                  <div class="w-100 d-flex justify-content-between">
                    <span class="font_12 justify-content-between d-flex w-25 mb-0" v-if="data.build_statistics.schoolBuild">
                      <span class="font_12 w-auto mb-0">{{ $t(`Global.age`) }}</span>
                      <span class="font_12 w-auto mb-0 font-weight-light">{{ data.build_statistics.schoolBuild.age }}</span>
                    </span>
                    <span class="font_12 justify-content-between d-flex w-25 mb-0" v-if="data.build_statistics.schoolBuild">
                      <span class="font_12 w-auto mb-0">{{ $t(`Global.safe`) }}</span>
                      <span class="font_12 w-auto mb-0 font-weight-light">{{ data.build_statistics.schoolBuild.safe }}</span>
                    </span>
                    <span class="font_12 justify-content-between d-flex w-25 mb-0" v-if="data.build_statistics.schoolBuild">
                      <span class="font_12 w-auto mb-0">{{ $t(`Global.statusBulding`) }}</span>
                      <span class="font_12 w-auto mb-0 font-weight-light">{{ data.build_statistics.schoolBuild.state }}</span>
                    </span>
                  </div>
                </span>
              </div>
            </CCol>
            <CCol sm="12" md="12" lg="12" v-else>
              <div class="w-100 mx-2 mt-2">
                <span class="d-block mx-2 mt-2 px-3 docs_header justify-content-between align-items-center">
                  <span class="font_12">
                    {{ $t(`Global.SC${data.title}`) }}
                    <template
                      v-if="
                        !$store.getters['submission/decision'] &&
                        ((evaluatorCheck(['ORGANIZATION_TYPE']) && updateConstants('string', 'DOCUMENTS_UPDATE') == $store.state.submission.last_alert.allow_update) ||
                          ($store.state.submission.last_alert.actual_level &&
                            ($store.state.submission.last_alert.actual_level <= 4 ||
                              ([showConstants('string', 'REPORT_APPROVAL_TEAM_COMMITTEE'), showConstants('string', 'NO_CHANGE'), showConstants('string', 'REPORT_APPROVAL')].includes($store.state.submission.last_alert.show_type) && $store.state.submission.last_alert.actual_level == 6)) &&
                            isApproved &&
                            isLeader) ||
                          hasPermission('admin_submissions') ||
                          evaluatorCheck(['VICE_TYPE']) ||
                          evaluatorCheck(['COMMITTEE_TYPE']) ||
                          hasPermission('report_update') ||
                          (evaluatorCheck(['COMMITTEE_TYPE']) && showAction))
                      "
                    >
                      <i v-if="!data.build_statistics.schoolBuild && ($store.state.user.allowPu || hasPermission('admin_system'))" class="el-icon-circle-plus pt-1" style="font-size: 21px; cursor: pointer" @click="openschoolBuildDialog('schoolBuild', data.title, null)"></i>
                    </template>
                  </span>
                  <div class="w-100 d-flex justify-content-between">
                    <span class="font_12 justify-content-center d-flex w-100 mb-0" v-if="!data.build_statistics.schoolBuild">
                      <span class="w-auto mb-0 text-muted">{{ $t(`Global.nodata`) }}</span>
                    </span>
                  </div>
                </span>
              </div>
            </CCol>
          </CRow>
        </div>
        <div class="d-flex flex-column text-initial">
          <CRow>
            <CCol sm="12" md="12" lg="12" v-if="data.build_statistics.components">
              <div class="w-100 mx-2 mt-2">
                <span class="d-block mx-2 mt-2 px-3 docs_header justify-content-between align-items-center" v-if="data.build_statistics.components">
                  <span class="font_12">
                    {{ $t(`Global.SCcomponents`) }}
                    <template
                      v-if="
                        !$store.getters['submission/decision'] &&
                        ((evaluatorCheck(['ORGANIZATION_TYPE']) && updateConstants('string', 'DOCUMENTS_UPDATE') == $store.state.submission.last_alert.allow_update) ||
                          ($store.state.submission.last_alert.actual_level &&
                            ($store.state.submission.last_alert.actual_level <= 4 ||
                              ([showConstants('string', 'REPORT_APPROVAL_TEAM_COMMITTEE'), showConstants('string', 'NO_CHANGE'), showConstants('string', 'REPORT_APPROVAL')].includes($store.state.submission.last_alert.show_type) && $store.state.submission.last_alert.actual_level == 6)) &&
                            isApproved &&
                            isLeader) ||
                          hasPermission('admin_submissions') ||
                          evaluatorCheck(['VICE_TYPE']) ||
                          evaluatorCheck(['COMMITTEE_TYPE']) ||
                          hasPermission('report_update') ||
                          (evaluatorCheck(['COMMITTEE_TYPE']) && showAction))
                      "
                    >
                      <i v-if="$store.state.user.allowPu || hasPermission('admin_system')" class="el-icon-circle-plus pt-1" style="font-size: 21px; cursor: pointer" @click="opencomponentsDialog('component', data.title, null)"></i>
                    </template>
                  </span>
                  <el-table v-if="data.build_statistics.components" :data="data.build_statistics.components" style="width: 100%" :header-cell-class-name="$i18n.locale === 'ar' ? 'text-right' : ''" :cell-class-name="$i18n.locale === 'ar' ? 'text-right' : ''">
                    <el-table-column prop="component" width="300" :label="$t('Global.component')"></el-table-column>
                    <el-table-column prop="count" :label="$t('Global.actual_count')">
                      <template slot-scope="scope">
                        {{ scope.row.count ? scope.row.count : '-' }}
                      </template>
                    </el-table-column>
                    <el-table-column prop="state" :label="$t('Global.status')"></el-table-column>
                    <el-table-column prop="" label=" ">
                      <template slot-scope="scope">
                        <template
                          v-if="
                            !$store.getters['submission/decision'] &&
                            ((evaluatorCheck(['ORGANIZATION_TYPE']) && updateConstants('string', 'DOCUMENTS_UPDATE') == $store.state.submission.last_alert.allow_update) ||
                              ($store.state.submission.last_alert.actual_level &&
                                ($store.state.submission.last_alert.actual_level <= 4 ||
                                  ([showConstants('string', 'REPORT_APPROVAL_TEAM_COMMITTEE'), showConstants('string', 'NO_CHANGE'), showConstants('string', 'REPORT_APPROVAL')].includes($store.state.submission.last_alert.show_type) && $store.state.submission.last_alert.actual_level == 6)) &&
                                isApproved &&
                                isLeader) ||
                              hasPermission('admin_submissions') ||
                              evaluatorCheck(['VICE_TYPE']) ||
                              evaluatorCheck(['COMMITTEE_TYPE']) ||
                              hasPermission('report_update') ||
                              (evaluatorCheck(['COMMITTEE_TYPE']) && showAction))
                          "
                        >
                          <div :style="$i18n.locale === 'ar' ? 'text-align:left' : 'float: right'" v-if="$store.state.user.allowPu || hasPermission('admin_system')">
                            <i class="el-icon-edit-outline table-action-item" style="font-size: 17px" @click="opencomponentsDialog('component', data.title, scope.row)"></i>
                          </div>
                        </template>
                      </template>
                    </el-table-column>
                  </el-table>
                </span>
              </div>
            </CCol>
          </CRow>
        </div>
      </el-collapse-item>
      <el-collapse-item :title="data.title" v-if="data.title == 'rates'">
        <template slot="title">
          <CCardHeader>
            <div :class="$i18n.locale === 'ar' ? 'card-header-actions' : 'ml-2 mr-2'" style="display: inline-block"><i class="el-icon-data-analysis"></i>{{ $t(`Global.SC${data.title}`) }}</div>
          </CCardHeader>
        </template>
        <div class="d-flex flex-column text-initial">
          <CRow>
            <CCol sm="12">
              <div class="w-100 mx-2 mt-2">
                <div class="px-3 docs_header d-flex justify-content-between align-items-center">
                  <span class="font_12">
                    {{ $t(`Global.SC${data.title}`) }}
                    <template
                      v-if="
                        !$store.getters['submission/decision'] &&
                        ((evaluatorCheck(['ORGANIZATION_TYPE']) && updateConstants('string', 'DOCUMENTS_UPDATE') == $store.state.submission.last_alert.allow_update) ||
                          ($store.state.submission.last_alert.actual_level &&
                            ($store.state.submission.last_alert.actual_level <= 4 ||
                              ([showConstants('string', 'REPORT_APPROVAL_TEAM_COMMITTEE'), showConstants('string', 'NO_CHANGE'), showConstants('string', 'REPORT_APPROVAL')].includes($store.state.submission.last_alert.show_type) && $store.state.submission.last_alert.actual_level == 6)) &&
                            isApproved &&
                            isLeader) ||
                          hasPermission('admin_submissions') ||
                          evaluatorCheck(['VICE_TYPE']) ||
                          evaluatorCheck(['COMMITTEE_TYPE']) ||
                          hasPermission('report_update') ||
                          (evaluatorCheck(['COMMITTEE_TYPE']) && showAction))
                      "
                    >
                      <i v-if="$store.state.user.allowPu || hasPermission('admin_system')" class="el-icon-circle-plus pt-1" style="font-size: 21px; cursor: pointer" @click="openratesDialog('rates', data.title, null)"></i>
                    </template>
                  </span>
                </div>
              </div>
            </CCol>
            <CCol sm="12" md="6" lg="4" v-if="data" v-for="(rates, key) in data.rates">
              <div class="w-100 mx-2 mt-2">
                <div class="px-3 docs_header d-flex justify-content-between align-items-center">
                  <span class="font_12">
                    {{ key }}
                    <!-- <i class="el-icon-circle-plus pt-1" style="font-size: 21px; cursor: pointer" @click="openratesDialog('rates',data.title, null)"></i> -->
                  </span>
                </div>
                <div v-if="rates" v-for="(data, stats) in rates" class="w-100 mt-2">
                  <div class="d-block mx-2 mt-2 px-3 docs_header justify-content-between align-items-center">
                    <span class="font_12">
                      {{ stats }}
                    </span>
                    <el-table v-if="data" :data="data" style="width: 100%" :header-cell-class-name="$i18n.locale === 'ar' ? 'text-right' : ''" :cell-class-name="$i18n.locale === 'ar' ? 'text-right' : ''"
                      >&ndash;&gt;-->
                      <el-table-column prop="class" width="150" :label="$t('Global.class')"></el-table-column>
                      <el-table-column prop="rate" :label="$t('Global.score')">
                        <template slot-scope="scope">
                          {{ scope.row.rate ? scope.row.rate + '%' : '-' }}
                        </template>
                      </el-table-column>
                      <el-table-column prop="" label=" ">
                        <template slot-scope="scope">
                          <template
                            v-if="
                              !$store.getters['submission/decision'] &&
                              ((evaluatorCheck(['ORGANIZATION_TYPE']) && updateConstants('string', 'DOCUMENTS_UPDATE') == $store.state.submission.last_alert.allow_update) ||
                                ($store.state.submission.last_alert.actual_level &&
                                  ($store.state.submission.last_alert.actual_level <= 4 ||
                                    ([showConstants('string', 'REPORT_APPROVAL_TEAM_COMMITTEE'), showConstants('string', 'NO_CHANGE'), showConstants('string', 'REPORT_APPROVAL')].includes($store.state.submission.last_alert.show_type) && $store.state.submission.last_alert.actual_level == 6)) &&
                                  isApproved &&
                                  isLeader) ||
                                hasPermission('admin_submissions') ||
                                evaluatorCheck(['VICE_TYPE']) ||
                                evaluatorCheck(['COMMITTEE_TYPE']) ||
                                hasPermission('report_update') ||
                                (evaluatorCheck(['COMMITTEE_TYPE']) && showAction))
                            "
                          >
                            <div :style="$i18n.locale === 'ar' ? 'text-align:left' : 'float: right'" v-if="$store.state.user.allowPu || hasPermission('admin_system')">
                              <i class="el-icon-edit-outline table-action-item" style="font-size: 17px" @click="openratesDialog('rates', scope.row, scope.row)"></i>
                            </div>
                          </template>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
              </div>
            </CCol>
          </CRow>
        </div>
      </el-collapse-item>
      <el-collapse-item :title="data.title" v-if="data.title == 'teacherStatistics'">
        <template slot="title">
          <CCardHeader>
            <div :class="$i18n.locale === 'ar' ? 'card-header-actions' : 'ml-2 mr-2'" style="display: inline-block"><i class="el-icon-data-analysis"></i>{{ $t(`Global.SC${data.title}`) }}</div>
          </CCardHeader>
        </template>
        <div class="d-flex flex-column text-initial">
          <CRow>
            <CCol sm="12">
              <div class="w-100 mx-2 mt-2">
                <div class="px-3 docs_header d-flex justify-content-between align-items-center">
                  <span class="font_12">
                    {{ $t(`Global.SC${data.title}`) }}
                    <template
                      v-if="
                        !$store.getters['submission/decision'] &&
                        ((evaluatorCheck(['ORGANIZATION_TYPE']) && updateConstants('string', 'DOCUMENTS_UPDATE') == $store.state.submission.last_alert.allow_update) ||
                          ($store.state.submission.last_alert.actual_level &&
                            ($store.state.submission.last_alert.actual_level <= 4 ||
                              ([showConstants('string', 'REPORT_APPROVAL_TEAM_COMMITTEE'), showConstants('string', 'NO_CHANGE'), showConstants('string', 'REPORT_APPROVAL')].includes($store.state.submission.last_alert.show_type) && $store.state.submission.last_alert.actual_level == 6)) &&
                            isApproved &&
                            isLeader) ||
                          hasPermission('admin_submissions') ||
                          evaluatorCheck(['VICE_TYPE']) ||
                          evaluatorCheck(['COMMITTEE_TYPE']) ||
                          hasPermission('report_update') ||
                          (evaluatorCheck(['COMMITTEE_TYPE']) && showAction))
                      "
                    >
                      <i v-if="$store.state.user.allowPu || hasPermission('admin_system')" class="el-icon-circle-plus pt-1" style="font-size: 21px; cursor: pointer" @click="openteacherDialog('teacher', data.title, null)"></i>
                    </template>
                  </span>
                </div>
              </div>
            </CCol>
            <CCol sm="12" md="6" lg="12" v-if="data" v-for="(teacher, key) in data.teacherStatistics">
              <div class="w-100 mx-2 mt-2">
                <div class="px-3 docs_header d-flex justify-content-between align-items-center">
                  <span class="font_12">
                    {{ key }}
                    <!-- <i class="el-icon-circle-plus pt-1" style="font-size: 21px; cursor: pointer" @click="openteacherDialog('teacher', data.title, null)"></i> -->
                  </span>
                </div>
                <CRow>
                  <CCol sm="12" md="6" lg="6" v-if="teacher" v-for="(data, stats) in teacher">
                    <div class="w-100 mt-2">
                      <div class="d-block mt-2 px-3 docs_header justify-content-between align-items-center">
                        <span class="font_12">
                          {{ stats }}
                        </span>
                        <el-table v-if="data" :data="data" style="width: 100%" :header-cell-class-name="$i18n.locale === 'ar' ? 'text-right' : ''" :cell-class-name="$i18n.locale === 'ar' ? 'text-right' : ''">
                          <el-table-column prop="specialization" width="300" :label="$t('Global.specialization')"></el-table-column>
                          <el-table-column prop="value" :label="$t('Global.actual_count')">
                            <template slot-scope="scope">
                              {{ scope.row.value ? scope.row.value : '-' }}
                            </template>
                          </el-table-column>
                          <el-table-column prop="" label=" ">
                            <template slot-scope="scope">
                              <template
                                v-if="
                                  !$store.getters['submission/decision'] &&
                                  ((evaluatorCheck(['ORGANIZATION_TYPE']) && updateConstants('string', 'DOCUMENTS_UPDATE') == $store.state.submission.last_alert.allow_update) ||
                                    ($store.state.submission.last_alert.actual_level &&
                                      ($store.state.submission.last_alert.actual_level <= 4 ||
                                        ([showConstants('string', 'REPORT_APPROVAL_TEAM_COMMITTEE'), showConstants('string', 'NO_CHANGE'), showConstants('string', 'REPORT_APPROVAL')].includes($store.state.submission.last_alert.show_type) && $store.state.submission.last_alert.actual_level == 6)) &&
                                      isApproved &&
                                      isLeader) ||
                                    hasPermission('admin_submissions') ||
                                    evaluatorCheck(['VICE_TYPE']) ||
                                    evaluatorCheck(['COMMITTEE_TYPE']) ||
                                    hasPermission('report_update') ||
                                    (evaluatorCheck(['COMMITTEE_TYPE']) && showAction))
                                "
                              >
                                <div :style="$i18n.locale === 'ar' ? 'text-align:left' : 'float: right'" v-if="$store.state.user.allowPu || hasPermission('admin_system')">
                                  <i class="el-icon-edit-outline table-action-item" style="font-size: 17px" @click="openteacherDialog('teacher', scope.row, scope.row)"></i>
                                </div>
                              </template>
                            </template>
                          </el-table-column>
                        </el-table>
                      </div>
                    </div>
                  </CCol>
                </CRow>
              </div>
            </CCol>
          </CRow>
        </div>
      </el-collapse-item>
    </el-collapse>
    <el-dialog @close="resetForm('ruleForm')" destroy-on-close :title="title" :visible.sync="details_dialog" class="p-0" width="80%">
      <CCardBody dir="rtl" style="text-align: initial" class="p-0">
        <el-form label-position="top" :model="ruleForm" status-icon size="large" ref="ruleForm" label-width="120px" class="demo-ruleForm">
          <CRow>
            <CCol sm="12">
              <div class="datePicker el-form-item el-form-item--feedback el-form-item--small">
                <div v-if="details_name == 'detailsM'" class="reviewHeard" style="text-align: initial">
                  <el-form-item :rules="validation(false, 'textarea')" prop="message" :label="$t(`Global.message`)" class="custom_area">
                    <el-input autosize resize="none" type="textarea" v-model="ruleForm.message"></el-input>
                  </el-form-item>
                </div>
                <div v-if="details_name == 'detailsV'" class="reviewHeard" style="text-align: initial">
                  <el-form-item :rules="validation(false, 'textarea')" prop="vision" :label="$t(`Global.vision`)" class="custom_area">
                    <el-input autosize resize="none" type="textarea" v-model="ruleForm.vision"></el-input>
                  </el-form-item>
                </div>
              </div>
            </CCol>
          </CRow>
        </el-form>
      </CCardBody>
      <CCardFooter :class="isLoad ? 'disabledAll' : ''">
        <div class="baseButton">
          <button @click="saveDetials('ruleForm')" class="el-button el-button--default is-round sec_color" type="reset" style="padding: 0.6rem 1rem">
            <i class="el-icon-check-circle"></i>
            {{ $t('Global.submit') }}
          </button>
        </div>
      </CCardFooter>
    </el-dialog>
    <el-dialog @close="resetForm('ruleForm')" destroy-on-close :title="$t(`Global.${title}`)" :visible.sync="disabilityStatisticsDialog" class="p-0" width="50%">
      <CCardBody dir="rtl" style="text-align: initial" class="p-0">
        <el-form label-position="top" :model="ruleForm" status-icon size="large" ref="ruleForm" label-width="120px" class="demo-ruleForm">
          <CRow>
            <CCol sm="12">
              <el-form-item class="mb-3" prop="class_id" :rules="validation(null, 1)" :label="$t('Global.class')">
                <el-select :no-data-text="$t('Global.nodata')" v-model="ruleForm.class_id" v-if="$store.getters['submission/SClookups']" :placeholder="$t('Global.class')" style="width: 100%">
                  <el-option v-if="selected" :key="selected.id + selected.name" :label="selected.name" :value="selected.id">
                    <div style="float: right; color: #8492a6; font-size: 13px">
                      {{ selected.name }}
                    </div>
                  </el-option>
                  <el-option v-for="item in filteredClass('classes', 'class_id', 'disabilityStatistics')" :key="item.id" :label="item.name" :value="item.id">
                    <div style="float: right; color: #8492a6; font-size: 13px">
                      {{ item.name }}
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="mb-3" prop="type_id" :rules="validation(null, 1)" :label="$t('Global.category')">
                <el-select :no-data-text="$t('Global.nodata')" v-model="ruleForm.type_id" v-if="$store.getters['submission/SClookups']" :placeholder="$t('Global.category')" style="width: 100%">
                  <el-option v-for="item in $store.getters['submission/SClookups'].disabilities" :key="item.id" :label="item.name" :value="item.id">
                    <div style="float: right; color: #8492a6; font-size: 13px">
                      {{ item.name }}
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="my-3" :rules="validation(null, 0)" prop="male" :label="$t('Global.male_count')">
                <el-input :maxlength="4" clearable :placeholder="$t('Global.male_count')" v-model="ruleForm.male" style="width: 100%"></el-input>
              </el-form-item>
              <el-form-item :rules="validation(null, 0)" prop="female" :label="$t('Global.female_count')">
                <el-input :maxlength="4" clearable :placeholder="$t('Global.female_count')" v-model="ruleForm.female" style="width: 100%"></el-input>
              </el-form-item>
            </CCol>
          </CRow>
        </el-form>
      </CCardBody>
      <CCardFooter :class="isLoad ? 'disabledAll' : ''">
        <div class="baseButton">
          <button @click="save('ruleForm')" class="el-button el-button--default is-round sec_color" type="reset" style="padding: 0.6rem 1rem">
            <i class="el-icon-check-circle"></i>
            {{ $t('Global.submit') }}
          </button>
        </div>
      </CCardFooter>
    </el-dialog>
    <el-dialog @close="resetForm('ruleForm')" destroy-on-close :title="$t(`Global.${title}`)" :visible.sync="students_statistic_dialog" class="p-0" width="45%">
      <CCardBody dir="rtl" style="text-align: initial" class="p-0">
        <el-form label-position="top" :model="ruleForm" status-icon size="large" ref="ruleForm" label-width="120px" class="demo-ruleForm">
          <CRow>
            <CCol sm="12">
              <div class="datePicker el-form-item el-form-item--feedback el-form-item--small">
                <div class="reviewHeard" style="text-align: initial">
                  <el-form-item class="mb-3" prop="class_id" :rules="validation(null, 1)" :label="$t('Global.class')">
                    <el-select :no-data-text="$t('Global.nodata')" v-model="ruleForm.class_id" v-if="$store.getters['submission/SClookups']" :placeholder="$t('Global.class')" style="width: 100%">
                      <el-option v-if="selected" :key="selected.id + selected.name" :label="selected.name" :value="selected.id">
                        <div style="float: right; color: #8492a6; font-size: 13px">
                          {{ selected.name }}
                        </div>
                      </el-option>
                      <el-option v-for="item in filteredClass('classes', 'class_id', 'student_statistics')" :key="item.id" :label="item.name" :value="item.id">
                        <div style="float: right; color: #8492a6; font-size: 13px">
                          {{ item.name }}
                        </div>
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item class="my-3" :rules="validation(null, 0)" prop="male" :label="$t('Global.male_count')">
                    <el-input :maxlength="4" clearable :placeholder="$t('Global.male_count')" v-model="ruleForm.male" style="width: 100%"></el-input>
                  </el-form-item>
                  <el-form-item :rules="validation(null, 0)" prop="female" :label="$t('Global.female_count')">
                    <el-input :maxlength="4" clearable :placeholder="$t('Global.female_count')" v-model="ruleForm.female" style="width: 100%"></el-input>
                  </el-form-item>
                  <el-form-item :rules="validation(null, 0)" prop="class_count" :label="$t('Global.class_count')">
                    <el-input :maxlength="4" clearable :placeholder="$t('Global.class_count')" v-model="ruleForm.class_count" style="width: 100%"></el-input>
                  </el-form-item>
                </div>
              </div>
            </CCol>
          </CRow>
        </el-form>
      </CCardBody>
      <CCardFooter :class="isLoad ? 'disabledAll' : ''">
        <div class="baseButton">
          <button @click="save('ruleForm')" class="el-button el-button--default is-round sec_color" type="reset" style="padding: 0.6rem 1rem">
            <i class="el-icon-check-circle"></i>
            {{ $t('Global.submit') }}
          </button>
        </div>
      </CCardFooter>
    </el-dialog>
    <el-dialog @close="resetForm('ruleForm')" destroy-on-close :title="title" :visible.sync="exam_dialog" class="p-0" width="45%">
      <CCardBody dir="rtl" style="text-align: initial" class="p-0">
        <el-form label-position="top" :model="ruleForm" status-icon size="large" ref="ruleForm" label-width="120px" class="demo-ruleForm">
          <CRow>
            <CCol sm="12">
              <div class="datePicker el-form-item el-form-item--feedback el-form-item--small">
                <div class="reviewHeard" style="text-align: initial">
                  <el-form-item class="mb-3" prop="year_id" :rules="validation(null, 1)" :label="$t('Global.Year')">
                    <el-select :no-data-text="$t('Global.nodata')" v-model="ruleForm.year_id" v-if="$store.getters['submission/SClookups']" :placeholder="$t('Global.Year')" style="width: 100%">
                      <el-option v-for="item in $store.getters['submission/SClookups'].years" :key="item.id" :label="item.name" :value="item.id">
                        <div style="float: right; color: #8492a6; font-size: 13px">
                          {{ item.name }}
                        </div>
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item class="mb-3" prop="is_second_term" :rules="validation(null, 1)" :label="$t('Global.class_cat')">
                    <el-select :no-data-text="$t('Global.nodata')" v-model="ruleForm.is_second_term" :placeholder="$t('Global.class_cat')" style="width: 100%">
                      <el-option v-for="item in termsOfYear" :key="item.id" :label="item.name" :value="item.id">
                        <div style="float: right; color: #8492a6; font-size: 13px">
                          {{ item.name }}
                        </div>
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item class="mb-3" prop="class_id" :rules="validation(null, 1)" :label="$t('Global.class')">
                    <el-select :no-data-text="$t('Global.nodata')" v-model="ruleForm.class_id" v-if="$store.getters['submission/SClookups']" :placeholder="$t('Global.class')" style="width: 100%">
                      <el-option v-for="item in $store.getters['submission/SClookups'].classes" :key="item.id" :label="item.name" :value="item.id">
                        <div style="float: right; color: #8492a6; font-size: 13px">
                          {{ item.name }}
                        </div>
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item prop="subject_id" :rules="validation(null, 1)" :label="$t('Global.SCsubject')">
                    <el-select :no-data-text="$t('Global.nodata')" v-model="ruleForm.subject_id" v-if="$store.getters['submission/SClookups']" :placeholder="$t('Global.SCsubject')" style="width: 100%">
                      <el-option v-for="item in $store.getters['submission/SClookups'].subjects" :key="item.id" :label="item.name" :value="item.id">
                        <div style="float: right; color: #8492a6; font-size: 13px">
                          {{ item.name }}
                        </div>
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item class="my-3" :rules="validation(null, 0)" prop="attend_count" :label="$t('Global.attend_count')">
                    <el-input :maxlength="4" clearable :placeholder="$t('Global.attend_count')" v-model="ruleForm.attend_count" style="width: 100%"></el-input>
                  </el-form-item>
                  <el-form-item class="my-3" :rules="validation(null, 0)" prop="success_count" :label="$t('Global.success65_count')">
                    <el-input :maxlength="4" clearable :placeholder="$t('Global.success65_count')" v-model="ruleForm.success_count" style="width: 100%"></el-input>
                  </el-form-item>
                  <!-- <el-form-item :rules="validation(null, 0)" prop="value" :label="$t('Global.actual_count')">
                                                        <el-input :maxlength="4" clearable :placeholder="$t('Global.value')" v-model="ruleForm.value" style="width: 100%"></el-input>
                                                      </el-form-item> -->
                </div>
              </div>
            </CCol>
          </CRow>
        </el-form>
      </CCardBody>
      <CCardFooter :class="isLoad ? 'disabledAll' : ''">
        <div class="baseButton">
          <button @click="save('ruleForm')" class="el-button el-button--default is-round sec_color" type="reset" style="padding: 0.6rem 1rem">
            <i class="el-icon-check-circle"></i>
            {{ $t('Global.submit') }}
          </button>
        </div>
      </CCardFooter>
    </el-dialog>
    <el-dialog @close="resetForm('ruleForm')" destroy-on-close :title="$t(`Global.${title}`)" :visible.sync="openorganizationDialog" class="p-0" width="45%">
      <CCardBody dir="rtl" style="text-align: initial" class="p-0">
        <el-form label-position="top" :model="ruleForm" status-icon size="large" ref="ruleForm" label-width="120px" class="demo-ruleForm">
          <CRow>
            <CCol sm="12">
              <div class="datePicker el-form-item el-form-item--feedback el-form-item--small">
                <div class="reviewHeard" style="text-align: initial">
                  <el-form-item class="mb-3" prop="stats_id" :rules="validation(null, 1)" :label="$t('Global.category')">
                    <el-select :no-data-text="$t('Global.nodata')" v-model="ruleForm.stats_id" v-if="$store.getters['submission/SClookups']" :placeholder="$t('Global.category')" style="width: 100%">
                      <el-option v-if="selected" :key="selected.id + selected.name" :label="selected.name" :value="selected.id">
                        <div style="float: right; color: #8492a6; font-size: 13px">
                          {{ selected.name }}
                        </div>
                      </el-option>
                      <el-option v-if="item.state_type_id == 1" v-for="item in filteredStatsClass('stats', 'stats_id', 'organizationStatistics')" :key="item.id" :label="item.name" :value="item.id">
                        <div style="float: right; color: #8492a6; font-size: 13px">
                          {{ item.name }}
                        </div>
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item class="my-3" :rules="validation(null, 0)" prop="male" :label="$t('Global.male_count')">
                    <el-input :maxlength="4" clearable :placeholder="$t('Global.male_count')" v-model="ruleForm.male" style="width: 100%"></el-input>
                  </el-form-item>
                  <el-form-item :rules="validation(null, 0)" prop="female" :label="$t('Global.female_count')">
                    <el-input :maxlength="4" clearable :placeholder="$t('Global.female_count')" v-model="ruleForm.female" style="width: 100%"></el-input>
                  </el-form-item>
                </div>
              </div>
            </CCol>
          </CRow>
        </el-form>
      </CCardBody>
      <CCardFooter :class="isLoad ? 'disabledAll' : ''">
        <div class="baseButton">
          <button @click="save('ruleForm')" class="el-button el-button--default is-round sec_color" type="reset" style="padding: 0.6rem 1rem">
            <i class="el-icon-check-circle"></i>
            {{ $t('Global.submit') }}
          </button>
        </div>
      </CCardFooter>
    </el-dialog>
    <el-dialog @close="resetForm('ruleForm')" destroy-on-close :title="title" :visible.sync="schoolBuildDialog" class="p-0" width="45%">
      <CCardBody dir="rtl" style="text-align: initial" class="p-0">
        <el-form label-position="top" :model="ruleForm" status-icon size="large" ref="ruleForm" label-width="120px" class="demo-ruleForm">
          <CRow>
            <CCol sm="12">
              <div class="datePicker el-form-item el-form-item--feedback el-form-item--small">
                <div class="reviewHeard" style="text-align: initial">
                  <el-form-item class="mb-3" prop="age_id" :rules="validation(null, 1)" :label="$t('Global.age')">
                    <el-select :no-data-text="$t('Global.nodata')" v-model="ruleForm.age_id" v-if="$store.getters['submission/SClookups']" :placeholder="$t('Global.age')" style="width: 100%">
                      <el-option v-for="item in $store.getters['submission/SClookups'].build_age" :key="item.id" :label="item.name" :value="item.id">
                        <div style="float: right; color: #8492a6; font-size: 13px">
                          {{ item.name }}
                        </div>
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item class="mb-3" prop="safe_id" :rules="validation(null, 1)" :label="$t('Global.safe')">
                    <el-select :no-data-text="$t('Global.nodata')" v-model="ruleForm.safe_id" v-if="$store.getters['submission/SClookups']" :placeholder="$t('Global.safe')" style="width: 100%">
                      <el-option v-for="item in $store.getters['submission/SClookups'].build_safe" :key="item.id" :label="item.name" :value="item.id">
                        <div style="float: right; color: #8492a6; font-size: 13px">
                          {{ item.name }}
                        </div>
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item class="mb-3" prop="state_id" :rules="validation(null, 1)" :label="$t('Global.statusBulding')">
                    <el-select :no-data-text="$t('Global.nodata')" v-model="ruleForm.state_id" v-if="$store.getters['submission/SClookups']" :placeholder="$t('Global.statusBulding')" style="width: 100%">
                      <el-option v-for="item in $store.getters['submission/SClookups'].build_state" :key="item.id" :label="item.name" :value="item.id">
                        <div style="float: right; color: #8492a6; font-size: 13px">
                          {{ item.name }}
                        </div>
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </div>
            </CCol>
          </CRow>
        </el-form>
      </CCardBody>
      <CCardFooter :class="isLoad ? 'disabledAll' : ''">
        <div class="baseButton">
          <button @click="saveBulding('ruleForm')" class="el-button el-button--default is-round sec_color" type="reset" style="padding: 0.6rem 1rem">
            <i class="el-icon-check-circle"></i>
            {{ $t('Global.submit') }}
          </button>
        </div>
      </CCardFooter>
    </el-dialog>
    <el-dialog @close="resetForm('ruleForm')" destroy-on-close :title="$t(`Global.SC${title}`)" :visible.sync="componentsDialog" class="p-0" width="45%">
      <CCardBody dir="rtl" style="text-align: initial" class="p-0">
        <el-form label-position="top" :model="ruleForm" status-icon size="large" ref="ruleForm" label-width="120px" class="demo-ruleForm">
          <CRow>
            <CCol sm="12">
              <div class="datePicker el-form-item el-form-item--feedback el-form-item--small">
                <div class="reviewHeard" style="text-align: initial">
                  <el-form-item :rules="validation(null, 1)" class="my-3" prop="component_id" :label="$t('Global.component')">
                    <el-select :no-data-text="$t('Global.nodata')" v-model="ruleForm.component_id" v-if="$store.getters['submission/SClookups']" :placeholder="$t('Global.component')" style="width: 100%">
                      <el-option v-if="selected" :key="selected.id + selected.name" :label="selected.name" :value="selected.id">
                        <div style="float: right; color: #8492a6; font-size: 13px">
                          {{ selected.name }}
                        </div>
                      </el-option>

                      <el-option v-for="item in filteredComponentClass('components', 'component_id', 'components')" :key="item.id" :label="item.name" :value="item.id">
                        <div style="float: right; color: #8492a6; font-size: 13px">
                          {{ item.name }}
                        </div>
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item :rules="validation(null, 0)" prop="count" :label="$t('Global.actual_count')">
                    <el-input :maxlength="4" clearable :placeholder="$t('Global.actual_count')" v-model="ruleForm.count" style="width: 100%"></el-input>
                  </el-form-item>
                  <el-form-item :rules="validation(null, 1)" class="my-3" prop="component_state_id" :label="$t('Global.status')">
                    <el-select :no-data-text="$t('Global.nodata')" v-model="ruleForm.component_state_id" v-if="$store.getters['submission/SClookups']" :placeholder="$t('Global.status')" style="width: 100%">
                      <el-option v-for="item in $store.getters['submission/SClookups'].component_states" :key="item.id" :label="item.name" :value="item.id">
                        <div style="float: right; color: #8492a6; font-size: 13px">
                          {{ item.name }}
                        </div>
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </div>
            </CCol>
          </CRow>
        </el-form>
      </CCardBody>
      <CCardFooter :class="isLoad ? 'disabledAll' : ''">
        <div class="baseButton">
          <button @click="save('ruleForm')" class="el-button el-button--default is-round sec_color" type="reset" style="padding: 0.6rem 1rem">
            <i class="el-icon-check-circle"></i>
            {{ $t('Global.submit') }}
          </button>
        </div>
      </CCardFooter>
    </el-dialog>
    <el-dialog @close="resetForm('ruleForm')" destroy-on-close :title="title" :visible.sync="ratesDialog" class="p-0" width="45%">
      <CCardBody dir="rtl" style="text-align: initial" class="p-0">
        <el-form label-position="top" :model="ruleForm" status-icon size="large" ref="ruleForm" label-width="120px" class="demo-ruleForm">
          <CRow>
            <CCol sm="12">
              <div class="datePicker el-form-item el-form-item--feedback el-form-item--small">
                <div class="reviewHeard" style="text-align: initial">
                  <el-form-item class="mb-3" prop="year_id" :rules="validation(null, 1)" :label="$t('Global.Year')">
                    <el-select :no-data-text="$t('Global.nodata')" v-model="ruleForm.year_id" v-if="$store.getters['submission/SClookups']" :placeholder="$t('Global.Year')" style="width: 100%">
                      <el-option v-for="item in $store.getters['submission/SClookups'].years" :key="item.id" :label="item.name" :value="item.id">
                        <div style="float: right; color: #8492a6; font-size: 13px">
                          {{ item.name }}
                        </div>
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item class="mb-3" prop="stats_id" :rules="validation(null, 1)" :label="$t('Global.category')">
                    <el-select :no-data-text="$t('Global.nodata')" v-model="ruleForm.stats_id" v-if="$store.getters['submission/SClookups']" :placeholder="$t('Global.category')" style="width: 100%">
                      <el-option v-if="item.state_type_id == 2" v-for="item in $store.getters['submission/SClookups'].stats" :key="item.id" :label="item.name" :value="item.id">
                        <div style="float: right; color: #8492a6; font-size: 13px">
                          {{ item.name }}
                        </div>
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item class="mb-3" prop="class_id" :rules="validation(null, 1)" :label="$t('Global.class')">
                    <el-select :no-data-text="$t('Global.nodata')" v-model="ruleForm.class_id" v-if="$store.getters['submission/SClookups']" :placeholder="$t('Global.class')" style="width: 100%">
                      <el-option v-for="item in $store.getters['submission/SClookups'].classes" :key="item.id" :label="item.name" :value="item.id">
                        <div style="float: right; color: #8492a6; font-size: 13px">
                          {{ item.name }}
                        </div>
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item class="my-3" :rules="validation(null, 0)" prop="rate" :label="$t('Global.score')">
                    <el-input :maxlength="5" clearable :placeholder="$t('Global.score')" v-model="ruleForm.rate" style="width: 100%"></el-input>
                  </el-form-item>
                </div>
              </div>
            </CCol>
          </CRow>
        </el-form>
      </CCardBody>
      <CCardFooter :class="isLoad ? 'disabledAll' : ''">
        <div class="baseButton">
          <button @click="save('ruleForm')" class="el-button el-button--default is-round sec_color" type="reset" style="padding: 0.6rem 1rem">
            <i class="el-icon-check-circle"></i>
            {{ $t('Global.submit') }}
          </button>
        </div>
      </CCardFooter>
    </el-dialog>
    <el-dialog @close="resetForm('ruleForm')" destroy-on-close :title="title" :visible.sync="teacherDialog" class="p-0" width="45%">
      <CCardBody dir="rtl" style="text-align: initial" class="p-0">
        <el-form label-position="top" :model="ruleForm" status-icon size="large" ref="ruleForm" label-width="120px" class="demo-ruleForm">
          <CRow>
            <CCol sm="12">
              <div class="datePicker el-form-item el-form-item--feedback el-form-item--small">
                <div class="reviewHeard" style="text-align: initial">
                  <el-form-item class="mb-3" prop="group_id" :rules="validation(null, 1)" :label="$t('Global.group')">
                    <el-select :no-data-text="$t('Global.nodata')" v-model="ruleForm.group_id" v-if="$store.getters['submission/SClookups']" :placeholder="$t('Global.group')" style="width: 100%">
                      <el-option v-for="item in $store.getters['submission/SClookups'].staff_groups" :key="item.id" :label="item.name" :value="item.id">
                        <div style="float: right; color: #8492a6; font-size: 13px">
                          {{ item.name }}
                        </div>
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item class="mb-3" prop="specialization_id" :rules="validation(null, 1)" :label="$t('Global.specialization')">
                    <el-select :no-data-text="$t('Global.nodata')" v-model="ruleForm.specialization_id" v-if="$store.getters['submission/SClookups']" :placeholder="$t('Global.specialization')" style="width: 100%">
                      <el-option v-for="item in $store.getters['submission/SClookups'].specialties" :key="item.id" :label="item.name" :value="item.id">
                        <div style="float: right; color: #8492a6; font-size: 13px">
                          {{ item.name }}
                        </div>
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item class="mb-3" prop="category_id" :rules="validation(null, 1)" :label="$t('Global.category')">
                    <el-select :no-data-text="$t('Global.nodata')" v-model="ruleForm.category_id" v-if="$store.getters['submission/SClookups']" :placeholder="$t('Global.category')" style="width: 100%">
                      <el-option v-for="item in filteredCategories" :key="item.id" :label="item.name" :value="item.id">
                        <div style="float: right; color: #8492a6; font-size: 13px">
                          {{ item.name }}
                        </div>
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item class="my-3" :rules="validation(null, 0)" prop="value" :label="$t('Global.actual_count')">
                    <el-input :maxlength="4" clearable :placeholder="$t('Global.actual_count')" v-model="ruleForm.value" style="width: 100%"></el-input>
                  </el-form-item>
                  <!-- <el-form-item class="my-3" :rules="validation(null, 0)" prop="rate" :label="$t('Global.score')">
                                                        <el-input :maxlength="4" clearable :placeholder="$t('Global.score')" v-model="ruleForm.rate" style="width: 100%"></el-input>
                                                      </el-form-item> -->
                </div>
              </div>
            </CCol>
          </CRow>
        </el-form>
      </CCardBody>
      <CCardFooter :class="isLoad ? 'disabledAll' : ''">
        <div class="baseButton">
          <button @click="save('ruleForm')" class="el-button el-button--default is-round sec_color" type="reset" style="padding: 0.6rem 1rem">
            <i class="el-icon-check-circle"></i>
            {{ $t('Global.submit') }}
          </button>
        </div>
      </CCardFooter>
    </el-dialog>
    <el-dialog @close="resetForm('form')" destroy-on-close :title="ruleForm.title ? ruleForm.title : $t('Global.indicator')" :visible.sync="indicatorDialog" class="p-0" width="45%">
      <CCardBody dir="rtl" style="text-align: initial" class="p-0">
        <el-form label-position="top" :model="ruleForm" status-icon size="large" ref="ruleForm" label-width="120px" class="demo-ruleForm">
          <CRow>
            <CCol sm="12">
              <div class="datePicker el-form-item el-form-item--feedback el-form-item--small">
                <div class="reviewHeard" style="text-align: initial">
                  <div class="mb-3 el-form-item__label">
                    <el-radio-group size="mini" v-model="ruleForm.status">
                      <el-radio border :label="1">{{ $t('Global.agree') }}</el-radio>
                      <el-radio border :label="0" class="mx-1">{{ $t('Global.disagree') }} </el-radio>
                    </el-radio-group>
                  </div>
                  <!-- <el-form-item class="mt-2 mb-4" :rules="validation(null, 0)" prop="title">
                                      <el-input :maxlength="100" clearable :placeholder="$t('Global.indicator')" v-model="ruleForm.title" style="width: 100%"></el-input>
                                    </el-form-item> -->
                  <el-form-item :label="$t('Global.checkResult')" :rules="validation(false, 'textarea')" style="width: 100%" prop="notes">
                    <el-input id="checkResult" class="textarea p-0" type="textarea" :placeholder="$t('Global.checkResult')" v-model="ruleForm.notes"></el-input>
                  </el-form-item>
                </div>
              </div>
            </CCol>
          </CRow>
        </el-form>
      </CCardBody>
      <CCardFooter :class="isLoad ? 'disabledAll' : ''">
        <div class="baseButton">
          <button @click="saveStandards('ruleForm')" class="el-button el-button--default is-round sec_color" type="reset" style="padding: 0.6rem 1rem">
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
      details_dialog: false,
      activeName: 0,
      standard_id: null,
      disabilityStatisticsDialog: false,
      class_statistic_dialog: false,
      exam_dialog: false,
      openorganizationDialog: false,
      students_statistic_dialog: false,
      componentsDialog: false,
      schoolBuildDialog: false,
      ratesDialog: false,
      teacherDialog: false,
      form: {
        mainIndicator: null,
        subIndicator: null,
      },
      ruleForm: {
        note: null,
        statistic_staff_id: null,
        is_second_term: null,
        subject_id: null,
        success_count: null,
        attend_count: null,
        class_count: null,
        qualification_id: null,
        statistic_activity_id: null,
        value: null,
        female: null,
        male: null,
        component_id: null,
        component_state_id: null,
        rate: null,
        year_id: null,
        class: null,
        class_id: null,
        group_id: null,
        type_id: null,
        stats_id: null,
        name: null,
        count: null,
        department_id: null,
        program_id: null,
        category_id: null,
        specialization_id: null,
        message: null,
        vision: null,
        age_id: null,
        safe_id: null,
        state_id: null,
        status: 1,
        notes: null,
        title: null,
      },
      title: '',
      disabledVal: true,
      mainDisable: true,
      note_id: null,
      id: null,
      disabled_prog: true,
      department_id: null,
      staff_id: null,
      program_id: null,
      type_name: null,
      data: [],
      programs: null,
      details_name: null,
      selected: null,
      indicatorDialog: false,
      examData: {},
    };
  },
  mounted() {
    this.init();
  },
  computed: {
    filteredCategories() {
      if (this.$store.getters['submission/SClookups']) {
        let filtered;
        if (this.ruleForm.specialization_id) {
          filtered = this.$store.getters['submission/SClookups'].specialties.find(el => el.id == this.ruleForm.specialization_id);
          return this.$store.getters['submission/SClookups'].specialties.filter(el => {
            return el.type != filtered.type;
          });
        }
      }
    },
    showAction: function () {
      if (this.$store.state.submission.last_alert && this.$store.state.evaluation.evaluator.includes(this.$store.state.submission.last_alert.evaluator_type)) {
        return true;
      }
      return false;
    },
    termsOfYear: function () {
      return [
        { id: 0, name: 'فصل دراسي اول' },
        { id: 1, name: 'فصل دراسي ثاني' },
      ];
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
  },
  methods: {
    getExam(data) {
      data.map(function (el) {
        let fixedNumber = {};
        if (el.success_count && el.attend_count) {
          let total = { total: (el.success_count * 100) / el.attend_count };
          fixedNumber = { total: total.total.toFixed(2) + '%' };
        } else {
          fixedNumber = { total: '-' };
        }

        let term = {};

        if (el.is_second_term == 1) {
          term = { term: 'الترم التانى' };
        } else {
          term = { term: 'الترم الاول' };
        }

        Object.assign(el, term);
        return Object.assign(el, fixedNumber);
      });
      return data;
    },
    onBeforeNameChange(content, oldContent, record, field) {
      this.examData['evaluation_id'] = Number(this.$route.params.id);
      this.examData['class_id'] = Number(record.Class_id);
      this.examData['attend_count'] = Number(field.name == 'attend_count' ? content : record.attend_count);
      this.examData['is_second_term'] = Number(record.is_second_term);
      this.examData['subject_id'] = Number(record.subject_id);
      this.examData['success_count'] = Number(field.name == 'success_count' ? content : record.success_count);
      this.examData['year_id'] = Number(record.year_id);
      this.$store
        .dispatch('submission/saveSCstatistic', {
          id: this.examData.ev_exam_result_id ? `/${this.examData.ev_exam_result_id}` : '',
          type: 'exam',
          query: this.examData,
        })
        .then(_ => {
          this.students_statistic_dialog = false;
          this.openorganizationDialog = false;
          this.exam_dialog = false;
          this.schoolBuildDialog = false;
          this.disabilityStatisticsDialog = false;
          this.componentsDialog = false;
          this.ratesDialog = false;
          this.teacherDialog = false;
          this.isLoad = false;
          this.$refs[formName].resetFields();
          this.init();
        })
        .catch(_ => {
          this.isLoad = false;
        });
    },
    validNumber(content, oldContent, record, field) {
      if (content > record.attend_count) {
        record.success_count = oldContent;
        return 'عدد الناجحيين يجب ان يكون اصغر او يساوي عدد الطلاب';
      } else {
        this.examData['evaluation_id'] = Number(this.$route.params.id);
        this.examData['class_id'] = Number(record.Class_id);
        this.examData['attend_count'] = Number(field.name == 'attend_count' ? content : record.attend_count);
        this.examData['is_second_term'] = Number(record.is_second_term);
        this.examData['subject_id'] = Number(record.subject_id);
        this.examData['success_count'] = Number(field.name == 'success_count' ? content : record.success_count);
        this.examData['year_id'] = Number(record.year_id);
        this.$store
          .dispatch('submission/saveSCstatistic', {
            id: this.examData.ev_exam_result_id ? `/${this.examData.ev_exam_result_id}` : '',
            type: 'exam',
            query: this.examData,
          })
          .then(_ => {
            this.students_statistic_dialog = false;
            this.openorganizationDialog = false;
            this.exam_dialog = false;
            this.schoolBuildDialog = false;
            this.disabilityStatisticsDialog = false;
            this.componentsDialog = false;
            this.ratesDialog = false;
            this.teacherDialog = false;
            this.isLoad = false;
            this.$refs[formName].resetFields();
            this.init();
          })
          .catch(_ => {
            this.isLoad = false;
          });
      }
    },
    getRate(count, success) {
      if (count && success) {
        let rate = (success * 100) / count;
        return rate.toFixed(2);
      }
      return false;
    },
    openIndicatorDialog(data, standard_id) {
      console.log('standard_id', standard_id);
      this.indicatorDialog = true;
      if (data) {
        this.ruleForm.status = data.status;
        this.ruleForm.notes = data.note;
        this.ruleForm.title = data.name;
        this.id = data.id || null;
      } else {
        this.ruleForm.status = 1;
        this.ruleForm.notes = null;
        this.ruleForm.title = data ? data.name : null;
        this.id = null;
      }
      this.standard_id = standard_id ? standard_id : null;
    },
    openschoolBuildDialog(type_name, title, data) {
      this.title = this.$t(`Global.SC${title}`);
      this.type_name = type_name;
      if (data) {
        this.ruleForm.age_id = data.age_id;
        this.ruleForm.safe_id = data.safe_id;
        this.ruleForm.state_id = data.state_id;
        this.id = data.id || null;
      } else {
        this.ruleForm.age_id = null;
        this.ruleForm.safe_id = null;
        this.ruleForm.state_id = null;
        this.id = null;
      }
      this.schoolBuildDialog = true;
    },
    resetForm(formName) {
      this.ruleForm.note = null;
      this.ruleForm.statistic_staff_id = null;
      this.ruleForm.is_second_term = null;
      this.ruleForm.subject_id = null;
      this.ruleForm.success_count = null;
      this.ruleForm.attend_count = null;
      this.ruleForm.class_count = null;
      this.ruleForm.qualification_id = null;
      this.ruleForm.statistic_activity_id = null;
      this.ruleForm.value = null;
      this.ruleForm.female = null;
      this.ruleForm.male = null;
      this.ruleForm.component_id = null;
      this.ruleForm.component_state_id = null;
      this.ruleForm.rate = null;
      this.ruleForm.year_id = null;
      this.ruleForm.class = null;
      this.ruleForm.class_id = null;
      this.ruleForm.group_id = null;
      this.ruleForm.type_id = null;
      this.ruleForm.stats_id = null;
      this.ruleForm.name = null;
      this.ruleForm.count = null;
      this.ruleForm.department_id = null;
      this.ruleForm.program_id = null;
      this.ruleForm.category_id = null;
      this.ruleForm.specialization_id = null;
      this.ruleForm.message = null;
      this.ruleForm.vision = null;
      this.ruleForm.age_id = null;
      this.ruleForm.safe_id = null;
      this.ruleForm.state_id = null;
      this.ruleForm.notes = null;
      this.ruleForm.title = null;
    },
    filteredStatsClass(type, cat, statistics) {
      if (this.$store.getters['submission/SClookups']) {
        let filtered;
        this.$store.getters['submission/statisticsData'].forEach((element, key) => {
          if (element.title == 'organizationStatistics') {
            if (element[statistics]) {
              filtered = this.$store.getters['submission/SClookups'][type].filter(el => {
                return element[statistics].every(f => {
                  return f[cat] != el.id;
                });
              });
            }
          }
        });
        return filtered;
      }
    },
    filteredClass(type, cat, statistics) {
      if (this.$store.getters['submission/SClookups']) {
        let filtered;
        this.$store.getters['submission/statisticsData'].forEach((element, key) => {
          if (element.title == 'statistics') {
            if (element.statistics[statistics]) {
              filtered = this.$store.getters['submission/SClookups'][type].filter(el => {
                return element.statistics[statistics].every(f => {
                  return f[cat] != el.id;
                });
              });
            }
          }
        });
        return filtered;
      }
    },
    filteredComponentClass(type, cat, statistics) {
      if (this.$store.getters['submission/SClookups']) {
        let filtered;
        this.$store.getters['submission/statisticsData'].forEach((element, key) => {
          if (element.title == 'build_statistics') {
            if (element['build_statistics'] && this.$store.getters['submission/SClookups']) {
              filtered = this.$store.getters['submission/SClookups'].components.filter(el => {
                return element['build_statistics'].components.every(f => {
                  return f[cat] != el.id;
                });
              });
            }
          }
        });
        return filtered;
      }
    },
    init() {
      this.isLoad = true;
      this.$store.dispatch('submission/getSCStatisticsData', this.$route.params.id).then(_ => {
        this.isLoad = false;
      });
    },
    openDetialsDialog(type_name, title, data, name) {
      this.title = title.group ? title.group : this.$t(`Global.SC${title}`);
      this.type_name = type_name;
      this.details_name = name;
      if (data) {
        this.ruleForm.message = data.details.message;
        this.ruleForm.vision = data.details.vision;
        this.id = data.id || null;
      } else {
        this.ruleForm.message = null;
        this.ruleForm.vision = null;
        this.id = null;
      }
      this.details_dialog = true;
    },
    openteacherDialog(type_name, title, data) {
      this.title = title.group ? title.group : this.$t(`Global.SC${title}`);
      this.type_name = type_name;
      if (data) {
        this.ruleForm.category_id = data.category_id;
        this.ruleForm.group_id = data.group_id;
        this.ruleForm.specialization_id = data.specialization_id;
        this.ruleForm.value = data.value;
        this.id = data.id || null;
      } else {
        this.ruleForm.category_id = null;
        this.ruleForm.group_id = null;
        this.ruleForm.specialization_id = null;
        this.ruleForm.value = null;
        this.id = null;
      }
      this.teacherDialog = true;
    },
    openratesDialog(type_name, title, data) {
      this.title = title.year ? title.year : this.$t(`Global.${title}`);
      this.type_name = type_name;
      if (data) {
        this.ruleForm.stats_id = data.stats_id;
        this.ruleForm.class_id = data.class_id;
        this.ruleForm.year_id = data.year_id;
        this.ruleForm.rate = data.rate;
        this.id = data.id || null;
      } else {
        this.ruleForm.stats_id = null;
        this.ruleForm.class_id = null;
        this.ruleForm.year_id = null;
        this.ruleForm.rate = null;
        this.id = null;
      }
      this.ratesDialog = true;
    },
    opencomponentsDialog(type_name, title, data) {
      this.title = title;
      this.type_name = type_name;
      if (data) {
        this.selected = this.$store.getters['submission/SClookups'] ? this.$store.getters['submission/SClookups'].components.find(el => el.id == data.component_id) : null;
        this.ruleForm.component_id = data.component_id;
        this.ruleForm.count = data.count;
        this.ruleForm.component_state_id = data.state_id;
        this.id = data.id || null;
      } else {
        (this.selected = null), (this.ruleForm.component_id = null);
        this.ruleForm.count = null;
        this.ruleForm.component_state_id = null;
        this.id = null;
      }
      this.componentsDialog = true;
    },
    opendisabilityStatisticsDialog(type_name, title, data) {
      this.title = title;
      this.type_name = type_name;
      if (data) {
        this.selected = this.$store.getters['submission/SClookups'] ? this.$store.getters['submission/SClookups'].classes.find(el => el.id == data.class_id) : null;
        this.ruleForm.class_id = data.class_id;
        this.ruleForm.type_id = data.type_id;
        this.ruleForm.female = data.female;
        this.ruleForm.male = data.male;
        this.id = data.id || null;
      } else {
        this.selected = null;
        this.ruleForm.class_id = null;
        this.ruleForm.type_id = null;
        this.ruleForm.female = null;
        this.ruleForm.male = null;
        this.id = null;
      }
      this.disabilityStatisticsDialog = true;
    },
    openexamResultDialog(type_name, title, data) {
      this.title = title.year ? title.year : this.$t(`Global.${title}`);
      this.type_name = type_name;
      if (data) {
        this.ruleForm.attend_count = data.attend_count;
        this.ruleForm.year_id = data.year_id;
        this.ruleForm.subject_id = data.subject_id;
        this.ruleForm.success_count = data.success_count;
        this.ruleForm.class_id = data.class_id;
        this.ruleForm.is_second_term = data.is_second_term;
        this.id = data.id || null;
      } else {
        this.ruleForm.attend_count = null;
        this.ruleForm.is_second_term = null;
        this.ruleForm.year_id = null;
        this.ruleForm.subject_id = null;
        this.ruleForm.success_count = null;
        this.ruleForm.class_id = null;
        this.id = null;
      }
      this.exam_dialog = true;
    },
    openorganizationStatisticsDialog(type_name, title, data) {
      console.log('object', type_name, title, data);
      this.title = title;
      this.type_name = type_name;
      if (data) {
        this.selected = this.$store.getters['submission/SClookups'] ? this.$store.getters['submission/SClookups'].stats.find(el => el.id == data.stats_id) : null;
        this.ruleForm.stats_id = data.stats_id;
        this.ruleForm.female = data.female;
        this.ruleForm.male = data.male;
        this.id = data.id || null;
      } else {
        this.selected = null;
        this.ruleForm.name = null;
        this.ruleForm.stats_id = null;
        this.ruleForm.female = null;
        this.ruleForm.male = null;
        this.id = null;
      }
      this.openorganizationDialog = true;
    },
    openStudentStatisticDialog(type_name, statistic, data) {
      this.title = statistic;
      this.type_name = type_name;
      if (data) {
        this.selected = this.$store.getters['submission/SClookups'] ? this.$store.getters['submission/SClookups'].classes.find(el => el.id == data.class_id) : null;
        this.ruleForm.class_id = data.class_id;
        this.ruleForm.female = data.female;
        this.ruleForm.male = data.male;
        this.ruleForm.class_count = data.class_count;
        this.id = data.id || null;
      } else {
        this.selected = null;
        this.ruleForm.class_id = null;
        this.ruleForm.female = null;
        this.ruleForm.male = null;
        this.ruleForm.class_count = null;
        this.id = null;
      }
      this.students_statistic_dialog = true;
    },
    saveStandards(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.isLoad = true;
          let obj = {
            standard_id: this.standard_id,
            evaluation_id: this.$route.params.id,
            status: this.ruleForm.status,
            note: this.ruleForm.notes,
          };
          this.$store
            .dispatch('submission/saveStandards', {
              id: this.id ? `/${this.id}` : '',
              query: obj,
            })
            .then(_ => {
              this.students_statistic_dialog = false;
              this.openorganizationDialog = false;
              this.exam_dialog = false;
              this.schoolBuildDialog = false;
              this.disabilityStatisticsDialog = false;
              this.componentsDialog = false;
              this.ratesDialog = false;
              this.teacherDialog = false;
              this.indicatorDialog = false;
              this.isLoad = false;
              this.$refs[formName].resetFields();
              this.getStandards({ parent_id: this.form.subIndicator, show: true });
            })
            .catch(_ => {
              this.isLoad = false;
            });
        }
      });
    },
    save(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.isLoad = true;
          let obj = {};
          for (const [key, value] of Object.entries(this.ruleForm)) {
            if ((value || value == 0) && key != 'status') {
              obj[key] = value;
              obj['evaluation_id'] = Number(this.$route.params.id);
            }
          }
          this.$store
            .dispatch('submission/saveSCstatistic', {
              id: this.id ? `/${this.id}` : '',
              type: this.type_name,
              query: obj,
            })
            .then(_ => {
              this.students_statistic_dialog = false;
              this.openorganizationDialog = false;
              this.exam_dialog = false;
              this.schoolBuildDialog = false;
              this.disabilityStatisticsDialog = false;
              this.componentsDialog = false;
              this.ratesDialog = false;
              this.teacherDialog = false;
              this.isLoad = false;
              this.$refs[formName].resetFields();
              this.init();
            })
            .catch(_ => {
              this.isLoad = false;
            });
        }
      });
    },
    saveBulding(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.isLoad = true;
          let query;
          query = {
            age_id: this.ruleForm.age_id,
            safe_id: this.ruleForm.safe_id,
            state_id: this.ruleForm.state_id,
            evaluation_id: Number(this.$route.params.id),
          };
          this.$store
            .dispatch('submission/saveBulding', {
              id: Number(this.id) ? `/${Number(this.id)}` : '',
              query: query,
            })
            .then(_ => {
              this.schoolBuildDialog = false;
              this.isLoad = false;
              this.init();
            });
        }
      });
    },
    saveDetials(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.isLoad = true;
          let query;
          if (this.details_name == 'detailsV') {
            query = {
              vision: this.ruleForm.vision,
            };
          } else {
            query = {
              message: this.ruleForm.message,
            };
          }
          this.$store
            .dispatch('submission/saveDetials', {
              id: Number(this.$route.params.id) ? `/${Number(this.$route.params.id)}` : '',
              query: query,
            })
            .then(_ => {
              this.details_dialog = false;
              this.isLoad = false;
              this.init();
            });
        }
      });
    },
    getStandards(query) {
      this.$store.dispatch('submission/getStandards', { evaluation_id: this.$route.params.id, query: query });
    },
    getBadge(status) {
      switch (status) {
        case 1:
          return 'success';
        case 0:
          return 'danger';
        default:
          'primary';
      }
    },
  },
  watch: {
    'form.mainIndicator'(val, newVal) {
      if (newVal) {
        this.form.subIndicator = null;
      }
      if (val) {
        this.mainDisable = false;
      } else {
        this.mainDisable = true;
      }
      this.getStandards({ parent_id: val, show: false });
    },
    'form.subIndicator'(val) {
      this.getStandards({ parent_id: val, show: true });
    },
    'ruleForm.value'(value) {
      if (this.ruleForm.value) {
        this.ruleForm.value = value.toString().replace(/[^0-9]/g, '');
      }
    },
    'ruleForm.rate'(value) {
      if (this.ruleForm.rate) {
        this.ruleForm.rate = value.toString().replace(/[^0-9](\.)/g, '');
      }
    },
    'ruleForm.success_count'(value) {
      if (this.ruleForm.success_count) {
        if (Number(this.ruleForm.success_count) > Number(this.ruleForm.attend_count)) {
          this.ruleForm.success_count = this.ruleForm.attend_count;
        } else {
          this.ruleForm.success_count = value.toString().replace(/[^0-9]/g, '');
        }
      }
    },
    'ruleForm.attend_count'(value) {
      if (this.ruleForm.attend_count) {
        this.ruleForm.attend_count = value.toString().replace(/[^0-9]/g, '');
      }
    },
    'ruleForm.female'(value) {
      if (this.ruleForm.female) {
        this.ruleForm.female = value.toString().replace(/[^0-9]/g, '');
      }
    },
    'ruleForm.male'(value) {
      if (this.ruleForm.male) {
        this.ruleForm.male = value.toString().replace(/[^0-9]/g, '');
      }
    },
    'ruleForm.count'(value) {
      if (this.ruleForm.count) {
        this.ruleForm.count = value.toString().replace(/[^0-9]/g, '');
      }
    },
    'ruleForm.class_count'(value) {
      if (this.ruleForm.class_count) {
        this.ruleForm.class_count = value.toString().replace(/[^0-9]/g, '');
      }
    },
  },
};
</script>
<style lang="scss">
.el-table__empty-block .el-table__empty-text {
  justify-content: center !important;
  padding: 0 !important;
  margin-top: 0.5rem !important;
}

// .table-content table {
//   width: 100% !important;
// }
// .vue-excel-editor {
//   width: 100% !important;
// }
.vue-excel-editor {
  width: 100% !important;

  .component-content {
    width: 100% !important;
    max-width: unset !important;

    .table-content.no-footer {
      width: 100% !important;

      table {
        table-layout: auto !important;
        width: 100% !important;
      }
    }
  }
}
</style>
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
