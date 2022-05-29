<template>
  <div>
    <div class="d-flex justify-content-between mb-2" v-if="$store.state.evaluation.pages">
      <el-button style="height: max-content" icon="el-icon-arrow-right" round size="mini" class="custom_send_icon" type="primary" @click="next($store.state.evaluation.pages.next)" :disabled="!Number.isInteger($store.state.evaluation.pages.next)"> {{ $t('Global.next') }} </el-button>
      <div class="center"></div>
      <el-button style="height: max-content" icon="el-icon-arrow-left" round size="mini" class="right_icon custom_send_icon" type="primary" @click="next($store.state.evaluation.pages.prev)" :disabled="!Number.isInteger($store.state.evaluation.pages.prev)">
        {{ $t('Global.prev') }}
      </el-button>
    </div>
    <CCard class="w-100">
      <CRow v-if="!evaluatorCheck(['ORGANIZATION_TYPE'])" class="no-gutters pl-2 pr-2 report_progress" style="border: 1px solid #eee">
        <b-progress v-if="$store.state.evaluation.editStatistics && $store.state.evaluation.editStatistics.length" class="w-100 my-2" style="height: 2rem" show-value>
          <b-progress-bar v-for="state in status" :value="state.value ? ((state.value.count / $store.state.evaluation.standerdsCount) * 100).toFixed(2) : 0" :variant="getpreAnswer(state.label).type">
            <el-tooltip effect="dark" :content="state.value ? $t(`Global.${state.name}`) + ' %' + ((state.value.count / $store.state.evaluation.standerdsCount) * 100).toFixed(2) : `0`" placement="top">
              <span
                ><strong>%{{ state.value ? ((state.value.count / $store.state.evaluation.standerdsCount) * 100).toFixed(2) : 0 }}</strong></span
              >
            </el-tooltip>
          </b-progress-bar>
        </b-progress>
      </CRow>
      <CRow class="no-gutters" v-loading="loading">
        <CCol sm="12" md="12" lg="12">
          <el-tabs value="1" type="card" class="right" dir="rtl" tab-position="top" stretch>
            <el-tab-pane name="1">
              <span slot="label"><i class="el-icon-chat-round"></i> {{ $t('Global.practices') }}</span>
              <CCol sm="12" md="12" lg="12" v-if="$store.getters['evaluation/questions'] && type == ''" v-for="(groups, type) in $store.getters['evaluation/questions']">
                <div>
                  <div class="px-3 header_report d-flex justify-content-between align-items-center">
                    <span v-if="type" class="font_12 align-items-center">
                      {{ type }}
                    </span>
                    <div v-else></div>
                  </div>
                  <div v-if="groups" v-for="(data, group) in groups" class="w-100 mt-2">
                    <div v-if="group" class="d-block mx-2 mt-2 px-3 docs_header justify-content-between align-items-center">
                      <span class="font_12">
                        {{ group }}
                      </span>
                    </div>
                    <div v-else v-for="question in data" class="w-100 mx-2 mt-2">
                      <div v-if="data" class="d-block mx-2 mt-2 px-3 header_report justify-content-between">
                        <span class="font_12 align-items-center">
                          {{ question.code ? ' ( ' + question.code.split('-')[1] + ' ) ' : '' }}
                          {{ question.question }}
                          <div class="d-flex align-items-center">
                            <CBadge v-if="(!evaluatorCheck(['ORGANIZATION_TYPE']) || (evaluatorCheck(['ORGANIZATION_TYPE']) && level == 6)) && question.value" color="success badge-pill " class="d-flex">{{ $t(`Global.level_${question.value}`) }}</CBadge>
                            <div v-if="$store.state.user.allowPu || hasPermission('admin_system')">
                              <el-button
                                v-if="
                                  (!$store.state.evaluation.canEdit && evaluatorCheck(['TEAM_TYPE']) && showAction && question.report) ||
                                  (showAction && level >= 5 && question.report) ||
                                  (question.report && hasPermission('report_update')) ||
                                  (teamTask && !$store.state.evaluation.canEdit && question.report) ||
                                  (evaluatorCheck(['COMMITTEE_TYPE', 'VICE_TYPE']) && question.report && showAction)
                                "
                                @click="openDialog(question, 'parent', question.question_id)"
                                style="height: max-content"
                                class="m-2"
                                icon="el-icon-edit"
                                round
                                size="mini"
                                type="primary"
                              >
                                {{ $t('Global.edit') }}
                              </el-button>
                              <el-button
                                v-else-if="
                                  (!$store.state.evaluation.canEdit && evaluatorCheck(['TEAM_TYPE']) && showAction && !question.report) ||
                                  (!question.report && showAction && level >= 5) ||
                                  (hasPermission('report_update') && !question.report) ||
                                  (teamTask && !$store.state.evaluation.canEdit && !question.report) ||
                                  (evaluatorCheck(['COMMITTEE_TYPE', 'VICE_TYPE']) && !question.report && showAction)
                                "
                                @click="openDialog(question, 'parent', question.question_id)"
                                style="height: max-content"
                                class="m-2"
                                icon="el-icon-edit"
                                round
                                size="mini"
                                type="primary"
                              >
                                {{ $t('Global.addReport') }}
                              </el-button>
                              <!-- <i
                          v-else-if="(!$store.state.evaluation.canEdit && evaluatorCheck(['TEAM_TYPE']) && showAction && !question.report) || (!question.report && showAction && level >= 5) || (hasPermission('report_update') && !question.report)"
                          class="el-icon-circle-plus pt-1 mx-2"
                          style="font-size: 21px; cursor: pointer"
                          @click="openDialog(question, 'parent', question.question_id)"
                        ></i> -->
                              <el-button
                                v-if="((!question.Justifications && evaluatorCheck(['ORGANIZATION_TYPE'])) || (!question.feedback && evaluatorCheck(['COMMITTEE_TYPE']))) && showAction && allowUpdate == updateConstants('string', 'ADD_COMMENT')"
                                @click="openDialog(question, 'parentComment', question.question_id)"
                                style="height: max-content"
                                class="m-2"
                                icon="el-icon-edit"
                                round
                                size="mini"
                                type="primary"
                              >
                                {{ $t('Global.addComment') }}
                              </el-button>
                              <el-button v-if="!question.comment && hasPermission('decision_approval') && level == 6" @click="openCommentDialog(question, question.question_id)" style="height: max-content" class="m-2" icon="el-icon-edit" round size="mini" type="primary">
                                {{ $t('Global.addComment') }}
                              </el-button>
                              <el-button v-if="!question.committee_report && evaluatorCheck(['REVIEWER_TYPE']) && level == 6" @click="openReviewersDialog(question, question.question_id)" style="height: max-content" class="m-2" icon="el-icon-edit" round size="mini" type="primary">
                                {{ $t('Global.addComment') }}
                              </el-button>
                              <el-button v-if="!question.team_comment && evaluatorCheck(['TEAM_TYPE']) && level > 1 && level != 6 && showAction" @click="openTeamDialog(question, question.question_id)" style="height: max-content" class="m-2" icon="el-icon-edit" round size="mini" type="primary">
                                {{ $t('Global.addComment') }}
                              </el-button>
                            </div>
                          </div>
                        </span>
                        <div v-if="!evaluatorCheck(['ORGANIZATION_TYPE']) || (evaluatorCheck(['ORGANIZATION_TYPE']) && level == 6)" class="reviewHeard justify-content-between" style="text-align: initial">
                          <div class="rounded-30 p-2 success justify-content-start">
                            <p class="d-inline m-0 font-weight-bolder">مقياس التقدير :</p>
                            <p class="m-0 d-inline">{{ question.rubric ? question.rubric : $t('Global.nodata') }}</p>
                          </div>
                        </div>
                      </div>
                      <div v-if="question.report" class="reviewHeard justify-content-between pb-2" style="text-align: initial">
                        <div class="review_header justify-content-between mt-0 mb-0">
                          <div v-if="question.ar_name" class="review_header my-0" style="margin-left: 10px; margin-right: 10px">
                            <div v-if="question.photo" class="img_avatar" style="width: 20px; height: 20px">
                              <img v-if="!evaluatorCheck(['ORGANIZATION_TYPE', 'COMMITTEE_TYPE'])" :src="question.photo || '/img/avatars/avatardf.png'" class="c-avatar-img" />
                              <img v-else src="/img/avatars/avatardf.png" class="c-avatar-img" />
                            </div>

                            <div>
                              <router-link v-if="!evaluatorCheck(['ORGANIZATION_TYPE', 'COMMITTEE_TYPE'])" :to="{ path: `/users/${question.id}` }" style="margin: 7px">
                                <span
                                  >{{ question.ar_name }} <CBadge color="warning" class="badge-pill ml-2 mr-2" v-if="question.evaluator">{{ $t(`Global.role_${question.evaluator}`) }}</CBadge></span
                                >
                              </router-link>
                              <router-link v-else to="">
                                <span>{{ $t('Global.SystemManagement') }}</span>
                              </router-link>
                              <h6 class="custom_badge" v-if="question.posted_at">
                                <i class="el-icon-time"></i><span style="font-size: 11px" class="localTime mr-1 ml-1">{{ question.posted_at ? toLocalDatetime(question.posted_at, `${$i18n.locale == 'ar' ? 'ar' : 'en'}`) : '' }}</span>
                                <CBadge color="info badge-pill">{{ $t('Global.state_0') }}</CBadge>
                              </h6>
                            </div>
                          </div>
                        </div>
                        <div class="rounded-30 p-3 button_after bg-light position-relative" style="margin-left: 20px; margin-right: 20px">
                          <CBadge color="info badge-pill" class="topRight">{{ $t('Global.report') }}</CBadge>
                          <p class="mb-0" v-html="ntBr(question.report)"></p>
                        </div>
                      </div>

                      <div v-if="!evaluatorCheck(['ORGANIZATION_TYPE']) && question.feedback" class="reviewHeard justify-content-between pb-2" style="text-align: initial">
                        <div class="mx-3 my-1"></div>
                        <div class="position-relative rounded-30 p-2 mx-5 button_after" style="background-color: #d1d9dc">
                          <CBadge class="topRight" color="info badge-pill">{{ $t('Global.feedback') }}</CBadge>
                          <CBadge :color="`${getPreAnswer(question.technical_accept).type} badge-pill`" class="topRight2">{{ getPreAnswer(question.technical_accept).name }}</CBadge>
                          <p class="mb-0 pt-2" v-html="ntBr(question.feedback)"></p>
                          <div v-if="$store.state.user.allowPu || hasPermission('admin_system')">
                            <el-button
                              v-if="evaluatorCheck(['COMMITTEE_TYPE']) && question.feedback && question.value && showAction && allowUpdate == updateConstants('string', 'ADD_COMMENT')"
                              @click="openDialog(question, 'parentComment', question.question_id)"
                              style="height: max-content"
                              class="mb-1"
                              icon="el-icon-edit"
                              round
                              size="mini"
                              type="primary"
                            >
                              {{ $t('Global.edit') }}
                            </el-button>
                          </div>
                        </div>
                      </div>
                      <div v-if="question.team_comment" class="reviewHeard justify-content-between pb-2" style="text-align: initial">
                        <div class="mx-3 my-1"></div>
                        <div class="position-relative report_style p-2 mx-5 button_after d-flex justify-content-between" style="background-color: #91c3dc">
                          <CBadge color="info badge-pill" class="topRight">{{ $t('Global.feedbackTeam') }}</CBadge>
                          <p class="mb-0 pt-2" v-html="ntBr(question.team_comment)"></p>
                          <div v-if="$store.state.user.allowPu || hasPermission('admin_system')"></div>
                          <el-button v-if="evaluatorCheck(['TEAM_TYPE']) && question.team_comment && question.value && showAction && level > 1" @click="openTeamDialog(question, question.question_id)" style="height: max-content" class="mb-1" icon="el-icon-edit" round size="mini" type="primary">
                            {{ $t('Global.edit') }}
                          </el-button>
                        </div>
                      </div>
                      <div v-if="question.Justifications" class="reviewHeard justify-content-between pb-2" style="text-align: initial">
                        <div class="mx-3 my-1"></div>
                        <div class="position-relative report_style p-2 mx-5 button_after d-flex justify-content-between" style="background-color: #91c3dc">
                          <CBadge color="info badge-pill" class="topRight">{{ $t('Global.organization_level') }}</CBadge>
                          <CBadge :color="`${getPreAnswer(question.organization_accept).type} badge-pill`" class="topRight2">{{ getPreAnswer(question.organization_accept).name }}</CBadge>
                          <p class="mb-0 pt-2" v-html="ntBr(question.Justifications)"></p>
                          <div v-if="$store.state.user.allowPu || hasPermission('admin_system')">
                            <el-button
                              v-if="evaluatorCheck(['ORGANIZATION_TYPE']) && question.Justifications && question.value && showAction && allowUpdate == updateConstants('string', 'ADD_COMMENT')"
                              @click="openDialog(question, 'parentComment', question.question_id)"
                              style="height: max-content"
                              class="mb-1"
                              icon="el-icon-edit"
                              round
                              size="mini"
                              type="primary"
                            >
                              {{ $t('Global.edit') }}
                            </el-button>
                          </div>
                        </div>
                      </div>

                      <div v-if="question.comment" class="reviewHeard justify-content-between pb-2" style="text-align: initial">
                        <div class="mx-3 my-1"></div>
                        <div class="position-relative report_style p-2 mx-5 button_after d-flex justify-content-between" style="background-color: #91c3dc">
                          <CBadge color="info badge-pill" class="topRight">{{ $t('Global.Justifications') }}</CBadge>
                          <p class="mb-0 pt-2" v-html="ntBr(question.comment)"></p>
                          <div v-if="$store.state.user.allowPu || hasPermission('admin_system')">
                            <el-button v-if="hasPermission('decision_approval') && question.comment && question.value && level == 6" @click="openCommentDialog(question, question.question_id)" style="height: max-content" class="mb-1" icon="el-icon-edit" round size="mini" type="primary">
                              {{ $t('Global.edit') }}
                            </el-button>
                          </div>
                        </div>
                      </div>

                      <div v-if="question.committee_report" class="reviewHeard justify-content-between pb-2" style="text-align: initial">
                        <div class="mx-3 my-1"></div>
                        <div class="position-relative report_style p-2 mx-5 button_after d-flex justify-content-between" style="background-color: #91c3dc">
                          <CBadge color="info badge-pill" class="topRight">{{ $t('Global.teamFeedback') }}</CBadge>
                          <p class="mb-0 pt-2" v-html="ntBr(question.committee_report)"></p>
                          <div v-if="$store.state.user.allowPu || hasPermission('admin_system')">
                            <el-button v-if="evaluatorCheck(['REVIEWER_TYPE']) && question.committee_report && question.value && level == 6" @click="openReviewersDialog(question, question.question_id)" style="height: max-content" class="mb-1" icon="el-icon-edit" round size="mini" type="primary">
                              {{ $t('Global.edit') }}
                            </el-button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CCol>
            </el-tab-pane>
            <el-tab-pane name="2" v-if="!evaluatorCheck(['ORGANIZATION_TYPE'])">
              <span slot="label"><i class="el-icon-chat-round"></i> {{ $t('Global.revisionTool') }}</span>
              <CCol class="mt-2" sm="12" md="12" lg="12" v-if="$store.getters['evaluation/questions'] && type != ''" v-for="(groups, type) in $store.getters['evaluation/questions']">
                <div>
                  <div class="px-3 header_report d-flex justify-content-between align-items-center">
                    <span v-if="type" class="font_12 align-items-center">
                      {{ type }}
                    </span>
                    <div v-else></div>
                  </div>
                  <div v-if="groups" v-for="(data, group) in groups" class="w-100 mt-2">
                    <div v-if="group" class="d-block mx-2 mt-2 px-3 docs_header justify-content-between align-items-center">
                      <span class="font_12">
                        {{ group }}
                      </span>

                      <el-table v-if="data" :data="data" class="w-100" :header-cell-class-name="$i18n.locale === 'ar' ? 'text-right' : ''" :cell-class-name="$i18n.locale === 'ar' ? 'text-right' : ''">
                        <el-table-column prop="code" width="90" :label="$t('Global.code')">
                          <template slot-scope="scope">
                            <p class="m-0">{{ scope.row.code ? scope.row.code.split('-')[1] : '' }}</p>
                          </template>
                        </el-table-column>
                        <el-table-column prop="question" width="200" :label="$t('Global.readable')">
                          <template slot-scope="scope">
                            <p v-html="ntBr(scope.row.question)" class="font_12" style="font-weight: bold"></p>
                          </template>
                        </el-table-column>
                        <el-table-column prop="tool" :label="type == 'الوثائق' ? $t('Global.reportDoc') : $t('Global.question')">
                          <template slot-scope="scope">
                            <p v-html="ntBr(scope.row.tool)" class="font_12 m-0" style="font-weight: bold"></p>
                          </template>
                        </el-table-column>
                        <el-table-column v-if="!evaluatorCheck(['ORGANIZATION_TYPE']) || (evaluatorCheck(['ORGANIZATION_TYPE']) && level == 6)" prop="answer_id" width="70" :label="$t('Global.rateResults')">
                          <template slot-scope="scope">
                            <div class="d-flex">
                              {{ scope.row.answer_id ? $t(`Global.value_${scope.row.answer_id}`) : '_' }}
                            </div>
                          </template>
                        </el-table-column>
                        <el-table-column prop="report" :label="$t('Global.report')">
                          <template slot-scope="scope">
                            <p v-html="ntBr(scope.row.report)" class="font_12 m-0" style="font-weight: bold"></p>
                          </template>
                        </el-table-column>
                        <el-table-column prop="" label=" " width="50">
                          <template slot-scope="scope">
                            <div :style="$i18n.locale === 'ar' ? 'text-align:left' : 'float: right'" v-if="$store.state.user.allowPu || hasPermission('admin_system')">
                              <i
                                v-if="
                                  !scope.row.answer_id &&
                                  ((!$store.state.evaluation.canEdit && evaluatorCheck(['TEAM_TYPE']) && showAction) || (teamTask && !$store.state.evaluation.canEdit) || (showAction && level >= 5) || hasPermission('report_update') || (evaluatorCheck(['COMMITTEE_TYPE', 'VICE_TYPE']) && showAction))
                                "
                                class="el-icon-circle-plus pt-1"
                                style="font-size: 21px; cursor: pointer"
                                @click="openDialog(scope.row, 'child', scope.row.question_id, scope.row.question_tool_id)"
                              ></i>
                              <i
                                v-else-if="
                                  (scope.row.answer_id && ((!$store.state.evaluation.canEdit && evaluatorCheck(['TEAM_TYPE']) && showAction) || (teamTask && !$store.state.evaluation.canEdit) || (showAction && level >= 5) || hasPermission('report_update'))) ||
                                  (evaluatorCheck(['COMMITTEE_TYPE', 'VICE_TYPE']) && showAction)
                                "
                                @click="openDialog(scope.row, 'child', scope.row.question_id, scope.row.question_tool_id)"
                                class="el-icon-edit-outline table-action-item"
                                style="font-size: 17px"
                              ></i>
                            </div>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                    <div v-else v-for="question in data" class="w-100 mx-2 mt-2">
                      <div v-if="data" class="d-block mx-2 mt-2 px-3 header_report justify-content-between">
                        <span class="font_12 align-items-center">
                          {{ question.code ? ' ( ' + question.code.split('-')[1] + ' ) ' : '' }}{{ question.question }}
                          <div class="d-flex align-items-center">
                            <CBadge v-if="(!evaluatorCheck(['ORGANIZATION_TYPE']) || (evaluatorCheck(['ORGANIZATION_TYPE']) && level == 6)) && question.value" color="success badge-pill " class="d-flex">{{ $t(`Global.level_${question.value}`) }}</CBadge>
                            <div v-if="$store.state.user.allowPu || hasPermission('admin_system')">
                              <el-button
                                v-if="
                                  (!$store.state.evaluation.canEdit && evaluatorCheck(['TEAM_TYPE']) && showAction && question.report) ||
                                  (showAction && level >= 5 && question.report) ||
                                  (question.report && hasPermission('report_update')) ||
                                  (teamTask && !$store.state.evaluation.canEdit && question.report) ||
                                  (evaluatorCheck(['COMMITTEE_TYPE', 'VICE_TYPE']) && question.report && showAction)
                                "
                                @click="openDialog(question, 'parent', question.question_id)"
                                style="height: max-content"
                                class="m-2"
                                icon="el-icon-edit"
                                round
                                size="mini"
                                type="primary"
                              >
                                {{ $t('Global.edit') }}
                              </el-button>
                              <el-button
                                v-else-if="
                                  (!$store.state.evaluation.canEdit && evaluatorCheck(['TEAM_TYPE']) && showAction && !question.report) ||
                                  (!question.report && showAction && level >= 5) ||
                                  (hasPermission('report_update') && !question.report) ||
                                  (teamTask && !$store.state.evaluation.canEdit && question.report) ||
                                  (evaluatorCheck(['COMMITTEE_TYPE', 'VICE_TYPE']) && !question.report && showAction)
                                "
                                @click="openDialog(question, 'parent', question.question_id)"
                                style="height: max-content"
                                class="m-2"
                                icon="el-icon-edit"
                                round
                                size="mini"
                                type="primary"
                              >
                                {{ $t('Global.addReport') }}
                              </el-button>
                              <!-- <i
                          v-else-if="(!$store.state.evaluation.canEdit && evaluatorCheck(['TEAM_TYPE']) && showAction && !question.report) || (!question.report && showAction && level >= 5) || (hasPermission('report_update') && !question.report)"
                          class="el-icon-circle-plus pt-1 mx-2"
                          style="font-size: 21px; cursor: pointer"
                          @click="openDialog(question, 'parent', question.question_id)"
                        ></i> -->
                              <el-button
                                v-if="((!question.Justifications && evaluatorCheck(['ORGANIZATION_TYPE'])) || (!question.feedback && evaluatorCheck(['COMMITTEE_TYPE']))) && showAction && allowUpdate == updateConstants('string', 'ADD_COMMENT')"
                                @click="openDialog(question, 'parentComment', question.question_id)"
                                style="height: max-content"
                                class="m-2"
                                icon="el-icon-edit"
                                round
                                size="mini"
                                type="primary"
                              >
                                {{ $t('Global.addComment') }}
                              </el-button>
                              <el-button v-if="!question.comment && hasPermission('decision_approval') && level == 6" @click="openCommentDialog(question, question.question_id)" style="height: max-content" class="m-2" icon="el-icon-edit" round size="mini" type="primary">
                                {{ $t('Global.addComment') }}
                              </el-button>
                              <el-button v-if="!question.committee_report && evaluatorCheck(['REVIEWER_TYPE']) && level == 6" @click="openReviewersDialog(question, question.question_id)" style="height: max-content" class="m-2" icon="el-icon-edit" round size="mini" type="primary">
                                {{ $t('Global.addComment') }}
                              </el-button>
                              <el-button v-if="!question.team_comment && evaluatorCheck(['TEAM_TYPE']) && level > 1 && level != 6 && showAction" @click="openTeamDialog(question, question.question_id)" style="height: max-content" class="m-2" icon="el-icon-edit" round size="mini" type="primary">
                                {{ $t('Global.addComment') }}
                              </el-button>
                            </div>
                          </div>
                        </span>
                        <div v-if="!evaluatorCheck(['ORGANIZATION_TYPE']) || (evaluatorCheck(['ORGANIZATION_TYPE']) && level == 6)" class="reviewHeard justify-content-between" style="text-align: initial">
                          <div class="rounded-30 p-2 success justify-content-start">
                            <p class="d-inline m-0 font-weight-bolder">مقياس التقدير :</p>
                            <p class="m-0 d-inline">{{ question.rubric ? question.rubric : $t('Global.nodata') }}</p>
                          </div>
                        </div>
                      </div>
                      <div v-if="question.report" class="reviewHeard justify-content-between pb-2" style="text-align: initial">
                        <div class="review_header justify-content-between mt-0 mb-0">
                          <div v-if="question.ar_name" class="review_header my-0" style="margin-left: 10px; margin-right: 10px">
                            <div v-if="question.photo" class="img_avatar" style="width: 20px; height: 20px">
                              <img v-if="!evaluatorCheck(['ORGANIZATION_TYPE', 'COMMITTEE_TYPE'])" :src="question.photo || '/img/avatars/avatardf.png'" class="c-avatar-img" />
                              <img v-else src="/img/avatars/avatardf.png" class="c-avatar-img" />
                            </div>

                            <div>
                              <router-link v-if="!evaluatorCheck(['ORGANIZATION_TYPE', 'COMMITTEE_TYPE'])" :to="{ path: `/users/${question.id}` }" style="margin: 7px">
                                <span
                                  >{{ question.ar_name }} <CBadge color="warning" class="badge-pill ml-2 mr-2" v-if="question.evaluator">{{ $t(`Global.role_${question.evaluator}`) }}</CBadge></span
                                >
                              </router-link>
                              <router-link v-else to="">
                                <span>{{ $t('Global.SystemManagement') }}</span>
                              </router-link>
                              <h6 class="custom_badge" v-if="question.posted_at">
                                <i class="el-icon-time"></i><span style="font-size: 11px" class="localTime mr-1 ml-1">{{ question.posted_at ? toLocalDatetime(question.posted_at, `${$i18n.locale == 'ar' ? 'ar' : 'en'}`) : '' }}</span>
                                <CBadge color="info badge-pill">{{ $t('Global.state_0') }}</CBadge>
                              </h6>
                            </div>
                          </div>
                        </div>
                        <div class="rounded-30 p-3 button_after bg-light position-relative" style="margin-left: 20px; margin-right: 20px">
                          <CBadge color="info badge-pill" class="topRight">{{ $t('Global.report') }}</CBadge>
                          <p class="mb-0" v-html="ntBr(question.report)"></p>
                        </div>
                      </div>

                      <div v-if="!evaluatorCheck(['ORGANIZATION_TYPE']) && question.feedback" class="reviewHeard justify-content-between pb-2" style="text-align: initial">
                        <div class="mx-3 my-1"></div>
                        <div class="position-relative rounded-30 p-2 mx-5 button_after" style="background-color: #d1d9dc">
                          <CBadge class="topRight" color="info badge-pill">{{ $t('Global.feedback') }}</CBadge>
                          <CBadge :color="`${getPreAnswer(question.technical_accept).type} badge-pill`" class="topRight2">{{ getPreAnswer(question.technical_accept).name }}</CBadge>
                          <p class="mb-0 pt-2" v-html="ntBr(question.feedback)"></p>
                          <div v-if="$store.state.user.allowPu || hasPermission('admin_system')">
                            <el-button
                              v-if="evaluatorCheck(['COMMITTEE_TYPE']) && question.feedback && question.value && showAction && allowUpdate == updateConstants('string', 'ADD_COMMENT')"
                              @click="openDialog(question, 'parentComment', question.question_id)"
                              style="height: max-content"
                              class="mb-1"
                              icon="el-icon-edit"
                              round
                              size="mini"
                              type="primary"
                            >
                              {{ $t('Global.edit') }}
                            </el-button>
                          </div>
                        </div>
                      </div>
                      <div v-if="question.team_comment" class="reviewHeard justify-content-between pb-2" style="text-align: initial">
                        <div class="mx-3 my-1"></div>
                        <div class="position-relative report_style p-2 mx-5 button_after d-flex justify-content-between" style="background-color: #91c3dc">
                          <CBadge color="info badge-pill" class="topRight">{{ $t('Global.feedbackTeam') }}</CBadge>
                          <p class="mb-0 pt-2" v-html="ntBr(question.team_comment)"></p>
                          <div v-if="$store.state.user.allowPu || hasPermission('admin_system')"></div>
                          <el-button v-if="evaluatorCheck(['TEAM_TYPE']) && question.team_comment && question.value && showAction && level > 1" @click="openTeamDialog(question, question.question_id)" style="height: max-content" class="mb-1" icon="el-icon-edit" round size="mini" type="primary">
                            {{ $t('Global.edit') }}
                          </el-button>
                        </div>
                      </div>
                      <div v-if="question.Justifications" class="reviewHeard justify-content-between pb-2" style="text-align: initial">
                        <div class="mx-3 my-1"></div>
                        <div class="position-relative report_style p-2 mx-5 button_after d-flex justify-content-between" style="background-color: #91c3dc">
                          <CBadge color="info badge-pill" class="topRight">{{ $t('Global.organization_level') }}</CBadge>
                          <CBadge :color="`${getPreAnswer(question.organization_accept).type} badge-pill`" class="topRight2">{{ getPreAnswer(question.organization_accept).name }}</CBadge>
                          <p class="mb-0 pt-2" v-html="ntBr(question.Justifications)"></p>
                          <div v-if="$store.state.user.allowPu || hasPermission('admin_system')">
                            <el-button
                              v-if="evaluatorCheck(['ORGANIZATION_TYPE']) && question.Justifications && question.value && showAction && allowUpdate == updateConstants('string', 'ADD_COMMENT')"
                              @click="openDialog(question, 'parentComment', question.question_id)"
                              style="height: max-content"
                              class="mb-1"
                              icon="el-icon-edit"
                              round
                              size="mini"
                              type="primary"
                            >
                              {{ $t('Global.edit') }}
                            </el-button>
                          </div>
                        </div>
                      </div>

                      <div v-if="question.comment" class="reviewHeard justify-content-between pb-2" style="text-align: initial">
                        <div class="mx-3 my-1"></div>
                        <div class="position-relative report_style p-2 mx-5 button_after d-flex justify-content-between" style="background-color: #91c3dc">
                          <CBadge color="info badge-pill" class="topRight">{{ $t('Global.Justifications') }}</CBadge>
                          <p class="mb-0 pt-2" v-html="ntBr(question.comment)"></p>
                          <div v-if="$store.state.user.allowPu || hasPermission('admin_system')">
                            <el-button v-if="hasPermission('decision_approval') && question.comment && question.value && level == 6" @click="openCommentDialog(question, question.question_id)" style="height: max-content" class="mb-1" icon="el-icon-edit" round size="mini" type="primary">
                              {{ $t('Global.edit') }}
                            </el-button>
                          </div>
                        </div>
                      </div>

                      <div v-if="question.committee_report" class="reviewHeard justify-content-between pb-2" style="text-align: initial">
                        <div class="mx-3 my-1"></div>
                        <div class="position-relative report_style p-2 mx-5 button_after d-flex justify-content-between" style="background-color: #91c3dc">
                          <CBadge color="info badge-pill" class="topRight">{{ $t('Global.teamFeedback') }}</CBadge>
                          <p class="mb-0 pt-2" v-html="ntBr(question.committee_report)"></p>
                          <div v-if="$store.state.user.allowPu || hasPermission('admin_system')">
                            <el-button v-if="evaluatorCheck(['REVIEWER_TYPE']) && question.committee_report && question.value && level == 6" @click="openReviewersDialog(question, question.question_id)" style="height: max-content" class="mb-1" icon="el-icon-edit" round size="mini" type="primary">
                              {{ $t('Global.edit') }}
                            </el-button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CCol>
            </el-tab-pane>
          </el-tabs>
        </CCol>
      </CRow>
    </CCard>

    <el-dialog :title="title" :visible.sync="report_dialog" class="p-0" width="60%" v-if="$store.getters['submission/SClookups']">
      <CCardBody dir="rtl" style="text-align: initial" class="p-0">
        <el-form v-if="$store.getters['evaluation/questions']" label-position="top" :model="ruleForm" status-icon size="large" ref="ruleForm" label-width="120px" class="demo-ruleForm">
          <CRow>
            <CCol sm="12">
              <div class="datePicker el-form-item el-form-item--feedback el-form-item--small">
                <div :class="isLoad ? 'disabledAll' : ''" class="reviewHeard" style="text-align: initial">
                  <el-form-item v-if="type == 'parent'" class="mb-3" prop="value" :rules="validation(null, 1)" :label="$t('Global.value')">
                    <el-select :no-data-text="$t('Global.nodata')" v-model="ruleForm.value" v-if="levels"  @change="getRubrics" :placeholder="$t('Global.value')" class="w-100">
                      <el-option v-for="item in levels" :key="item.id" :label="item.name" :value="item.id">
                        <div style="float: right; color: #8492a6; font-size: 13px">
                          {{ item.name }}
                        </div>
                      </el-option>
                    </el-select>
                    <small>{{rubrics}}</small>
                  </el-form-item>
                  <el-form-item v-else class="mb-3 w-100" prop="answer_id" :rules="validation(null, 1)" :label="$t('Global.value')">
                    <el-select class="w-100" :no-data-text="$t('Global.nodata')" v-model="ruleForm.answer_id" v-if="values" :placeholder="$t('Global.value')">
                      <el-option v-for="item in values" :key="item.id" :label="item.name" :value="item.id">
                        <div style="float: right; color: #8492a6; font-size: 13px">
                          {{ item.name }}
                        </div>
                      </el-option>
                    </el-select>
                  </el-form-item>
                  
                  <el-form-item class="mb-3 w-100" :rules="validation(false, 'textarea')" prop="report" :label="$t('Global.report')">
                    <el-input autosize resize="none" class="" type="textarea" :placeholder="$t('Global.report')" v-model="ruleForm.report"></el-input>
                  </el-form-item>
                </div>
              </div>
            </CCol>
          </CRow>
        </el-form>
      </CCardBody>
      <CCardFooter>
        <div class="baseButton" :class="isLoad ? 'disabledAll' : ''">
          <button @click="save('ruleForm')" class="el-button el-button--default is-round sec_color" style="padding: 0.6rem 1rem">
            <i class="el-icon-check-circle"></i>
            {{ $t('Global.submit') }}
          </button>
        </div>
      </CCardFooter>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="commentsDialog" class="p-0" width="60%" v-if="$store.getters['submission/SClookups']">
      <CCardBody dir="rtl" style="text-align: initial" class="p-0">
        <el-form v-if="$store.getters['evaluation/questions']" label-position="top" :model="ruleForm" status-icon size="large" ref="ruleForm" label-width="120px" class="demo-ruleForm">
          <CRow>
            <CCol sm="12">
              <div class="mt-2 el-form-item__label">
                <el-radio-group v-if="evaluatorCheck(['ORGANIZATION_TYPE'])" size="mini" v-model="ruleForm.organization_accept" class="ml-2 mr-3">
                  <el-radio border :label="1">{{ $t('Global.ok') }}</el-radio>
                  <el-radio border :label="0" class="mx-1">{{ $t('Global.notOk') }} </el-radio>
                </el-radio-group>
                <el-radio-group v-if="evaluatorCheck(['COMMITTEE_TYPE'])" size="mini" v-model="ruleForm.technical_accept" class="ml-2 mr-3">
                  <el-radio border :label="1">{{ $t('Global.ok') }}</el-radio>
                  <el-radio border :label="0" class="mx-1">{{ $t('Global.notOk') }} </el-radio>
                </el-radio-group>
              </div>

              <div class="datePicker el-form-item el-form-item--feedback el-form-item--small">
                <div :class="isLoad ? 'disabledAll' : ''" class="reviewHeard" style="text-align: initial">
                  <el-form-item v-if="evaluatorCheck(['ORGANIZATION_TYPE'])" class="mb-3 w-100" :rules="validation(false, 'textarea')" prop="Justifications" :label="$t('Global.writeComment')">
                    <el-input autosize resize="none" class="" type="textarea" :placeholder="$t('Global.writeComment')" v-model="ruleForm.Justifications"></el-input>
                  </el-form-item>

                  <el-form-item v-if="evaluatorCheck(['COMMITTEE_TYPE'])" class="mb-3 w-100" :rules="validation(false, 'textarea')" prop="feedback" :label="$t('Global.writeComment')">
                    <el-input autosize resize="none" class="" type="textarea" :placeholder="$t('Global.writeComment')" v-model="ruleForm.feedback"></el-input>
                  </el-form-item>
                </div>
              </div>
            </CCol>
          </CRow>
        </el-form>
      </CCardBody>
      <CCardFooter>
        <div class="baseButton" :class="isLoad ? 'disabledAll' : ''">
          <button @click="save('ruleForm')" class="el-button el-button--default is-round sec_color" style="padding: 0.6rem 1rem">
            <i class="el-icon-check-circle"></i>
            {{ $t('Global.submit') }}
          </button>
        </div>
      </CCardFooter>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="councilDialog" class="p-0" width="60%" v-if="$store.getters['submission/SClookups']">
      <CCardBody dir="rtl" style="text-align: initial" class="p-0">
        <el-form v-if="$store.getters['evaluation/questions']" label-position="top" :model="ruleForm" status-icon size="large" ref="ruleForm" label-width="120px" class="demo-ruleForm">
          <CRow>
            <CCol sm="12">
              <div class="datePicker el-form-item el-form-item--feedback el-form-item--small">
                <div :class="isLoad ? 'disabledAll' : ''" class="reviewHeard" style="text-align: initial">
                  <el-form-item class="mb-3 w-100" :rules="validation(false, 'textarea')" prop="comment" :label="$t('Global.writeComment')">
                    <el-input autosize resize="none" class="" type="textarea" :placeholder="$t('Global.writeComment')" v-model="ruleForm.comment"></el-input>
                  </el-form-item>
                </div>
              </div>
            </CCol>
          </CRow>
        </el-form>
      </CCardBody>
      <CCardFooter>
        <div class="baseButton">
          <button @click="saveCouncil('ruleForm', 'council')" class="el-button el-button--default is-round sec_color" style="padding: 0.6rem 1rem">
            <i class="el-icon-check-circle"></i>
            {{ $t('Global.submit') }}
          </button>
        </div>
      </CCardFooter>
    </el-dialog>

    <!-- <el-dialog :title="title" :visible.sync="councilDialog" class="p-0" width="60%" v-if="$store.getters['submission/SClookups']">
      <CCardBody dir="rtl" style="text-align: initial" class="p-0">
        <el-form v-if="$store.getters['evaluation/questions']" label-position="top" :model="ruleForm" status-icon size="large" ref="ruleForm" label-width="120px" class="demo-ruleForm">
          <CRow>
            <CCol sm="12">
              <div class="datePicker el-form-item el-form-item--feedback el-form-item--small">
                <div :class="isLoad ? 'disabledAll' : ''" class="reviewHeard" style="text-align: initial">
                  <el-form-item class="mb-3 w-100" :rules="validation(false, 'textarea')" prop="comment" :label="$t('Global.writeComment')">
                    <el-input autosize resize="none" class="" type="textarea" :placeholder="$t('Global.writeComment')" v-model="ruleForm.comment"></el-input>
                  </el-form-item>
                </div>
              </div>
            </CCol>
          </CRow>
        </el-form>
      </CCardBody>
      <CCardFooter>
        <div class="baseButton">
          <button @click="saveCouncil('ruleForm', 'council')" class="el-button el-button--default is-round sec_color" style="padding: 0.6rem 1rem">
            <i class="el-icon-check-circle"></i>
            {{ $t('Global.submit') }}
          </button>
        </div>
      </CCardFooter>
    </el-dialog> -->

    <el-dialog :title="title" :visible.sync="teamDialog" class="p-0" width="60%" v-if="$store.getters['submission/SClookups']">
      <CCardBody dir="rtl" style="text-align: initial" class="p-0">
        <el-form v-if="$store.getters['evaluation/questions']" label-position="top" :model="ruleForm" status-icon size="large" ref="ruleForm" label-width="120px" class="demo-ruleForm">
          <CRow>
            <CCol sm="12">
              <div class="datePicker el-form-item el-form-item--feedback el-form-item--small">
                <div :class="isLoad ? 'disabledAll' : ''" class="reviewHeard" style="text-align: initial">
                  <el-form-item class="mb-3 w-100" :rules="validation(false, 'textarea')" prop="team_comment" :label="$t('Global.writeComment')">
                    <el-input autosize resize="none" class="" type="textarea" :placeholder="$t('Global.writeComment')" v-model="ruleForm.team_comment"></el-input>
                  </el-form-item>
                </div>
              </div>
            </CCol>
          </CRow>
        </el-form>
      </CCardBody>
      <CCardFooter>
        <div class="baseButton">
          <button @click="saveCouncil('ruleForm', 'team')" class="el-button el-button--default is-round sec_color" style="padding: 0.6rem 1rem">
            <i class="el-icon-check-circle"></i>
            {{ $t('Global.submit') }}
          </button>
        </div>
      </CCardFooter>
    </el-dialog>
  </div>
</template>
<script>
import Prereport from '../components/Prereport.vue';

export default {
  name: 'submissionEdit',
  components: { Prereport },
  data() {
    return {
      active: false,
      title: '',
      commentsDialog: false,
      councilDialog: false,
      reviewersDialog: false,
      teamDialog: false,
      isLoad: false,
      loading: false,
      report_dialog: false,
      type: null,
      question_id: null,
      rubrics:null,
      values: [
        { id: 1, name: this.$t('Global.value_1') },
        { id: 2, name: this.$t('Global.value_2') },
      ],
      levels: [
        { id: 1, name: this.$t('Global.level_1') },
        { id: 2, name: this.$t('Global.level_2') },
        { id: 3, name: this.$t('Global.level_3') },
        { id: 4, name: this.$t('Global.level_4') },
      ],
      ruleForm: {
        comment: null,
        Justifications: null,
        team_comment: null,
        feedback: null,
        report: null,
        tool: null,
        committee_report: null,
        subject_id: null,
        success_count: null,
        attend_count: null,
        qualification_id: null,
        statistic_activity_id: null,
        organization_accept: 0,
        technical_accept: 0,
        value: null,
        answer_id: null,
      },
    };
  },
  computed: {
    teamTask() {
      if (this.$store.state.submission.last_alert) {
        if (this.$store.state.submission.last_alert.task_id == 1 && this.$store.state.submission.last_alert.evaluator_type == 8) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    status() {
      return this.$store.getters['evaluation/editPreStatistics'];
    },
    showAction: function () {
      if (this.$store.state.submission.last_alert &&  this.$store.state.evaluation.evaluator.includes(this.$store.state.submission.last_alert.evaluator_type)) {
        return true;
      }
      return false;
    },
    lastAlert: function () {
      if (this.$store.state.submission.last_alert) {
        return this.$store.state.submission.last_alert;
      }
      return false;
    },
    showType: function () {
      if (this.$store.state.submission.last_alert) {
        return this.$store.state.submission.last_alert.show_type;
      }
      return false;
    },
    level() {
      if (this.$store.state.submission.last_alert) {
        return this.$store.state.submission.last_alert.actual_level;
      }
      return false;
    },
    allowUpdate: function () {
      if (this.$store.state.submission.last_alert) {
        return this.$store.state.submission.last_alert.allow_update;
      }
      return false;
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    getRubrics() {
      let query = { question_id: this.$route.params.id, answer_option_id: this.ruleForm.value };
      this.$store.dispatch('submission/rubrics', query).then(() => {
        this.rubrics = this.$store.state.submission.rubrics;
        console.log(this.$store.state.submission.rubrics);
      });
    },
    openCommentDialog(data, question_id) {
      this.councilDialog = true;
      this.title = ' ( ' + data.code.split('-')[1] + ' ) ' + data.question;
      this.question_id = question_id || null;
      if (data) {
        this.id = data.id;
        this.ruleForm.comment = data.comment;
      } else {
        this.ruleForm.comment = null;
      }
    },
    openTeamDialog(data, question_id) {
      this.teamDialog = true;
      this.title = ' ( ' + data.code.split('-')[1] + ' ) ' + data.question;
      this.question_id = question_id || null;
      if (data) {
        this.id = data.id;
        this.ruleForm.team_comment = data.team_comment;
      } else {
        this.ruleForm.team_comment = null;
      }
    },
    openReviewersDialog(data, question_id) {
      this.reviewersDialog = true;
      this.title = ' ( ' + data.code.split('-')[1] + ' ) ' + data.question;
      this.question_id = question_id || null;
      if (data) {
        this.id = data.id;
        this.ruleForm.committee_report = data.committee_report;
      } else {
        this.ruleForm.committee_report = null;
      }
    },
    openDialog(data, type, question_id, question_tool_id) {
      this.type = type;
      this.title = ' ( ' + data.code.split('-')[1] + ' ) ' + data.question;
      this.question_id = question_id || null;
      this.question_tool_id = question_tool_id || 0;
      if (data) {
        this.id = data.id;
        if (type == 'child') {
          this.ruleForm.report = data.report;
          this.ruleForm.answer_id = data.answer_id;
        } else {
          this.ruleForm.report = data.report;
          this.ruleForm.value = data.value;
          if (type == 'parentComment') {
            this.ruleForm.Justifications = data.Justifications;
            this.ruleForm.feedback = data.feedback;
            this.commentsDialog = true;
            if (this.evaluatorCheck(['COMMITTEE_TYPE'])) {
              this.ruleForm.technical_accept = data.technical_accept || data.technical_accept == 0 ? data.technical_accept : 1;
            } else {
              this.ruleForm.technical_accept = null;
            }
            if (this.evaluatorCheck(['ORGANIZATION_TYPE'])) {
              this.ruleForm.organization_accept = data.organization_accept || data.organization_accept == 0 ? data.organization_accept : 1;
            } else {
              this.ruleForm.organization_accept = null;
            }
          } else {
            this.ruleForm.Justifications = null;
            this.ruleForm.feedback = null;
            this.ruleForm.technical_accept = null;
            this.ruleForm.organization_accept = null;
          }
        }
      } else {
        this.id = null;
        this.ruleForm.report = null;
        this.ruleForm.technical_accept = 0;
        this.ruleForm.organization_accept = 0;
        this.ruleForm.value = null;
        this.ruleForm.answer_id = null;
        this.ruleForm.Justifications = null;
        this.ruleForm.feedback = null;
      }
      if (type != 'parentComment') {
        this.report_dialog = true;
      }
    },
    next(num) {
      this.$router.push(`/school/submissions/submission/reports/edit/${this.$route.params.evaluation_id}/${num}`.toString());
    },

    init() {
      this.loading = true;
      if (this.$route.params.evaluation_id && this.$route.params.id) {
        this.$store
          .dispatch('evaluation/getPreReportsEvaluation', {
            evaluation_id: this.$route.params.evaluation_id,
            question_id: this.$route.params.id,
          })
          .then(() => {
            this.loading = false;
          });
      }
    },
    saveCouncil(formName, type) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.isLoad = true;
          let query;
          if (type == 'reviewers') {
            query = {
              committee_report: this.ruleForm.committee_report,
              question_id: this.question_id,
            };
          } else if (type == 'team') {
            query = {
              team_comment: this.ruleForm.team_comment,
              question_id: this.question_id,
            };
          } else {
            query = {
              comment: this.ruleForm.comment,
              question_id: this.question_id,
            };
          }
          this.$store.dispatch('submission/savePreRport', { evaluation_id: this.$route.params.evaluation_id, id: this.id ? this.id : null, query: query }).then(() => {
            this.isLoad = false;
            this.councilDialog = false;
            this.teamDialog = false;
            this.init();
          });
        }
      });
    },
    save(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.isLoad = true;
          let query;
          let formData = new FormData();
          if (this.type == 'parent' || this.type == 'parentComment') {
            query = {
              report: this.ruleForm.report,
              value: this.ruleForm.value,
              question_id: this.question_id,
              Justifications: this.ruleForm.Justifications,
              organization_accept: this.ruleForm.organization_accept,
              technical_accept: this.ruleForm.technical_accept,
              feedback: this.ruleForm.feedback,
            };
            for (const [key, value] of Object.entries(query)) {
              if (value || value == 0) {
                formData.append(key, value);
              }
            }
          } else {
            query = {
              report: this.ruleForm.report,
              answer_id: this.ruleForm.answer_id,
              question_id: this.question_id,
              question_tool_id: this.question_tool_id || 0,
            };
            for (const [key, value] of Object.entries(query)) {
              if (value || value == 0) {
                formData.append(key, value);
              }
            }
          }
          this.$store.dispatch('submission/savePreRport', { evaluation_id: this.$route.params.evaluation_id, id: this.id ? this.id : null, query: formData }).then(() => {
            this.isLoad = false;
            this.report_dialog = false;
            this.commentsDialog = false;
            this.init();
          });
        }
      });
    },
  },
};
</script>
<style lang="scss">
.topRight {
  position: absolute;
  top: -6px;
  right: 10px;
  font-size: 14px !important;
}

.topRight2 {
  position: absolute;
  top: -6px;
  right: 140px;
  font-size: 14px !important;
}
</style>
<style lang="scss" scoped>
.rounded-30 {
  border-radius: 30px;
}
.el-select-dropdown {
  width: 60% !important;
}

.header_report {
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
