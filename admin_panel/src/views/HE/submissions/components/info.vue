<template>
  <div class="custom_info_alert">
    <div class="fab-wrapper">
      <input id="fabCheckbox" type="checkbox" class="fab-checkbox" />
      <label class="fab" for="fabCheckbox">
        <i class="el-icon-chat-dot-round fab-icon pointer"></i>
      </label>
      <div class="fab-wheel" v-if="$store.getters['submission/team'] || $store.getters['submission/representative']">
        <template v-if="$store.getters['submission/team'] && $store.getters['submission/team'].all_members">
          <router-link
            class="my-2 fab-action px-2 custom_link_white"
            v-for="(member, i) in $store.getters['submission/team'].all_members"
            :to="{ path: `/higher/messages/${$route.params.submission_id}/${member.id}` }"
            v-if="!isAuth(member) && member.team_job != 6 && !evaluatorCheck(['ORGANIZATION_TYPE']) && !isLeader"
          >
            <span> {{ member.ar_name }} ({{ member.job }}) </span></router-link
          >

          <router-link
            class="my-2 fab-action px-2 custom_link_white"
            v-for="(member, i) in $store.getters['submission/team'].all_members"
            :to="{ path: `/higher/messages/${$route.params.submission_id}/${member.id}` }"
            v-if="!isAuth(member) && member.team_job == 1 && evaluatorCheck(['ORGANIZATION_TYPE']) && !isLeader"
          >
            <span> {{ member.ar_name }} ({{ member.job }}) </span></router-link
          >

          <router-link
            class="my-2 fab-action px-2 custom_link_white"
            v-for="(member, i) in $store.getters['submission/team'].all_members"
            :to="{ path: `/higher/messages/${$route.params.submission_id}/${member.id}` }"
            v-if="!isAuth(member) && member.team_job !== 1 && member.team_job != 6 && isLeader"
          >
            <span> {{ member.ar_name }} ({{ member.job }}) </span></router-link
          >
        </template>
        <router-link v-if="$store.getters['submission/representative'] && !evaluatorCheck(['ORGANIZATION_TYPE'])" class="my-2 fab-action px-2 custom_link_white" :to="{ path: `/higher/messages/${$route.params.submission_id}/${$store.getters['submission/representative'].id}` }">
          <span>{{ $store.getters['submission/representative'].ar_name ? $store.getters['submission/representative'].ar_name + ' ( ' + $t('Global.role_2') + ' )' : '' }}</span>
        </router-link>
      </div>
      <div v-else>
        <router-link class="my-2 fab-action px-2 custom_link_white" to="">
          {{ $t('Global.noItem') }}
        </router-link>
      </div>
    </div>

  <el-dialog :title="$t('Global.moveBackForward')" :visible.sync="dialogMoveVisible">
    <el-select v-if="hasPermission('stage_update') && $store.getters['submission/lookups'].stages" clearable @change="handleAcceptMove"  v-model="newStage" ref="uni" :placeholder="$t('Global.moveBackForward')" style="width: 100%">
        <el-option  v-for="item in $store.getters['submission/lookups'].stages" :key="item.id" :label="item.title" :value="item">
          <span style="float: right; color: #8492a6; font-size: 13px">
            {{ item.title }}
          </span>
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialogMoveVisible = false">Cancel</el-button>
      </span>
  </el-dialog>
    <!-- <el-alert v-if="!$store.getters['submission/decision'] && $store.state.submission.orgActive && evaluatorCheck(['ACCREDITATION_TYPE'])" effect="dark" class="mb-2 animate" :title="$t('Global.SystemManagement')" type="warning" show-icon>
      <div class="d-flex">
        <span>{{ $t('Global.orgNotActive') }}</span>
        <div class="d-flex float-left">
          <el-tooltip content="تأكيد" placement="top-start">
            <el-button @click="handleAcceptOrg()" icon="el-icon-check" size="small" class="p-2 mx-1 float-left" type="success"> تأكيد </el-button>
          </el-tooltip>
          <el-tooltip content="رفض" placement="top-start">
            <el-button @click="dialogOpenRep(false)" icon="el-icon-close" size="small" class="p-2 mx-1 float-left" type="danger">رفض </el-button>
          </el-tooltip>
        </div>
      </div>
    </el-alert> -->
    <!-- <el-alert v-if="!$store.getters['submission/decision'] && $store.state.submission.orgInfoRequired && evaluatorCheck(['ORGANIZATION_TYPE'])" effect="dark" class="mb-2 animate" :title="$t('Global.SystemManagement')" type="error" show-icon>
      <div class="d-flex">
        <span>{{ $t('Global.orgInfoRequired') }}</span>
        <router-link class="text-white custom_link" :to="{ path: `/higher/organization/edit/${$store.state.submission.submission.organization_id}` }">
          <div style="margin: 0 5px">{{ $t('Global.pressNow') }}</div>
        </router-link>
      </div>
    </el-alert> -->
    <el-alert
      v-if="(!$store.state.submission.decision || ($store.state.submission.decision && $store.state.submission.decision.removed != 0)) && !$store.getters['submission/submissionLoad'] && lastAlert && !isLoad"
      effect="dark"
      class="mb-2 animate"
      :title="lastAlert && evaluatorCheck(['ORGANIZATION_TYPE', 'TEAM_TYPE', 'COMMITTEE_TYPE']) ? $t('Global.SystemManagement') : lastAlert.ar_name"
      :type="getAlert(lastAlert.status)"
      show-icon
    >
      <div>
        <span v-if="showAction">
          {{ lastAlert.task_message }}
        </span>
        <span v-else>
          {{ lastAlert && evaluatorCheck(['ORGANIZATION_TYPE']) ? lastAlert.contact_message : lastAlert.alert_message }}
        </span>
        <span v-if="lastAlert.message && (!evaluatorCheck(['TEAM_TYPE', 'ORGANIZATION_TYPE']) || showAction || isAuthUser(lastAlert.user_id))" v-html="'( ' + ntBr(lastAlert.message) + ' )'"></span>
        <router-link v-if="showAction && showType == showConstants('string', 'SUBMISSION_UPDATE')" class="text-white custom_link" :to="{ path: `/higher/submissions/edit/${$route.params.submission_id}/1` }">
          <div style="margin: 0 5px">{{ $t('Global.pressNow') }}</div>
        </router-link>
        <router-link v-if="showAction && showType == showConstants('string', 'FINANCE_UPDATE')" class="text-white custom_link" :to="{ path: `/higher/submissions/edit/${$route.params.submission_id}/2` }">
          <div style="margin: 0 5px">{{ $t('Global.pressNow') }}</div>
        </router-link>
        <router-link v-if="showAction && (showType == showConstants('string', 'TEAM_UPDATE') || showType == showConstants('string', 'VISIT_UPDATE'))" class="text-white custom_link" :to="{ path: `/higher/submissions/edit/${$route.params.submission_id}/3` }">
          <div style="margin: 0 5px">{{ $t('Global.pressNow') }}</div>
        </router-link>
      </div>
    </el-alert>
    <el-alert v-if="$store.getters['submission/decision'] && $store.state.submission.decision.removed == 0" effect="dark" class="mb-2 animate" :title="$t('Global.SystemManagement')" type="success" show-icon>
      <div class="d-flex">
        <span>{{ $t('Global.acceptSubDone', { message: $store.state.submission.decision.name }) }}</span>
      </div>
    </el-alert>
    <Show id="submission_id" submission :loading="$store.getters['submission/submissionLoad']" icon="el-icon-message" :items="$store.getters['submission/submission']" :name="$t('Global.order')" except="team" v-if="hasPermission('access_submissions')">
      <template #show_action>
        <router-link v-if="hasPermission('decision_approval')" class="mx-1" :to="`/higher/submissions/council/${$route.params.id}`">
          <el-button type="success" size="mini" class="mx-1 right_icon print_hide" round>{{ $t('Global.directors') }} </el-button>
        </router-link>
        <router-link :to="`/management/logs/${$route.params.submission_id}/2`" class="mx-2 print_hide" v-if="hasPermission('admin_submissions')">
          <fa-icon :icon="['fas', 'bug']" />
        </router-link>
        <el-button v-if="$store.state.submission.showFiles !== 4 && hasPermission('document_update')" @click="showUpload(true, $route.params.submission_id)" :class="isLoad ? 'disabledAll' : ''" round size="mini" class="mx-1 right_icon print_hide" type="success">
          {{ $t('Global.showUpload') }}
        </el-button>
        <el-button v-if="$store.state.submission.showFiles == 4 && hasPermission('document_update')" @click="showUpload(0, $route.params.submission_id)" round :class="isLoad ? 'disabledAll' : ''" size="mini" class="mx-1 right_icon print_hide" type="danger">
          {{ $t('Global.hideUpload') }}
        </el-button>
        <div class="d-flex print_hide" v-if="hasPermission('stage_update')">
          <el-tooltip :content="$t('Global.redo')" placement="top">
            <fa-icon :icon="['fas', 'redo']" class="mr-2" @click="undoRedo('redo')" />
          </el-tooltip>
          <el-tooltip :content="$t('Global.undo')" placement="top">
            <fa-icon :icon="['fas', 'undo']" class="ml-2 mr-2" @click="undoRedo('undo')" />
          </el-tooltip>
        </div>
        <CDropdown
          v-if="
            hasPermission('data_update') ||
            (showAction && showType == showConstants('string', 'SUBMISSION_UPDATE')) ||
            evaluatorCheck(['ORGANIZATION_TYPE']) ||
            hasPermission('data_update') ||
            hasPermission('finance_update') ||
            (showAction && showType == showConstants('string', 'FINANCE_UPDATE')) ||
            hasPermission('team_update') ||
            (showAction && (showType == showConstants('string', 'TEAM_UPDATE') || showType == showConstants('string', 'VISIT_UPDATE'))) ||
            hasPermission('deactive_submissions')
          "
          color="success"
          placement="bottom-end"
          size="sm"
          class="d-inline customDrop print_hide"
        >
          <template #toggler-content>
            <CIcon name="cil-settings" />
            <span style="font-weight: bold">{{ $t('Global.action') }}</span>
          </template>         
          <a v-if="(hasPermission('admin_system') || evaluatorCheck(['ORGANIZATION_TYPE'])) && ((lastAlert.level > 2 && lastAlert.type == 1 ) || (lastAlert.type == 2))" :href="`${baseUrl}submission/receipt/${$route.params.submission_id}`">
            <div class="item">
              <fa-icon :icon="['fas', 'file-pdf']" size="lg" />
              {{ $t('Global.print_receipt') }}
            </div>
          </a>
          <a v-if="hasPermission('stage_update')"  @click="() => { dialogMoveVisible = true }">
            <div class="item">
              <i class="el-icon-refresh"></i>
              {{ $t('Global.moveBackForward') }}
            </div>
          </a>
          <router-link v-if="hasPermission('data_update') || (showAction && showType == showConstants('string', 'SUBMISSION_UPDATE'))" class="iF_found item d-block" :to="{ path: `/higher/submissions/edit/${$route.params.submission_id}/1` }">
            <div style="text-align: initial"><i class="el-icon-edit"></i> {{ $t('Global.editSubmission') }}</div>
          </router-link>
          <router-link class="iF_found item d-block" v-if="evaluatorCheck(['ORGANIZATION_TYPE']) || hasPermission('data_update')" :to="{ path: `/higher/submissions/additional/edit/${$route.params.submission_id}` }">
            <div style="text-align: initial"><i class="el-icon-edit"></i> {{ $t('Global.editAdditionalData') }}</div>
          </router-link>
          <router-link v-if="hasPermission('finance_update') || (showAction && showType == showConstants('string', 'FINANCE_UPDATE'))" class="iF_found item d-block" :to="{ path: `/higher/submissions/edit/${$route.params.submission_id}/2` }">
            <div style="text-align: initial">
              <i class="el-icon-s-marketing"></i>
              {{ $t('Global.editFinance') }}
            </div>
          </router-link>

          <router-link v-if="hasPermission('team_update') || (showAction && (showType == showConstants('string', 'TEAM_UPDATE') || showType == showConstants('string', 'VISIT_UPDATE')))" class="iF_found item d-block" :to="{ path: `/higher/submissions/edit/${$route.params.submission_id}/3` }">
            <div style="text-align: initial">
              <i class="el-icon-data-analysis"></i>
              {{ $t('Global.editActiveVisitOrTeam') }}
            </div>
          </router-link>

          <router-link class="iF_found item d-block" v-if="hasPermission('deactive_submissions')" to="">
            <div style="text-align: initial" @click="diActive">
              <i :class="$store.getters['submission/status'] === 0 ? 'el-icon-delete' : 'el-icon-refresh'"></i>
              {{ $t(`Global.activate_${$store.getters['submission/status']}`) }}
            </div>
          </router-link>
          <!-- <router-link v-if="hasPermission('data_update')" class="iF_found item d-block" @click.native="followVisit($route.params.submission_id)" to="">
            <div style="text-align: initial"><i class="el-icon-plus"></i> {{ $t('Global.addFollowVisit') }}</div>
          </router-link> -->
        </CDropdown>
      </template>
      <template #show_status>
        <router-link v-if="$store.getters['submission/name']" :to="{ path: $store.getters['submission/name'].id ? `/higher/organization/${$store.getters['submission/name'].id}` : '' }">
          {{ $store.getters['submission/name'].name ? $store.getters['submission/name'].name : '' }}
        </router-link>
        <CBadge color="success" v-if="$store.getters['submission/status'] === 0" style="margin: 4px">
          {{ $t('Global.active') }}
        </CBadge>
        <CBadge color="danger" v-if="$store.getters['submission/status'] === 1" style="margin: 4px">
          {{ $t('Global.remove') }}
        </CBadge>
        <CBadge v-if="!evaluatorCheck(['ORGANIZATION_TYPE']) && $store.state.submission.last_alert && $store.state.submission.last_alert.title" :color="$store.state.submission.last_alert.status == 0 ? 'danger' : 'info'" style="margin: 4px">
          {{ hasDecision ? $store.state.submission.decision.name : $store.state.submission.last_alert.actual_level == 6 && $store.state.submission.last_alert.show_type == 7 && type == 'Group' ? $t('Global.inReportLevel') : $store.state.submission.last_alert.title }}
        </CBadge>
        <CBadge v-if="evaluatorCheck(['ORGANIZATION_TYPE']) && $store.state.submission.last_alert && $store.state.submission.last_alert.title" :color="$store.state.submission.last_alert.status == 0 ? 'danger' : 'info'" style="margin: 4px">
          <template v-if="hasDecision">
            {{ $store.state.submission.decision.name }}
          </template>
          <template v-else>
            <!-- {{ ($store.state.submission.last_alert.actual_level == $store.state.submission.last_alert.level) == 6 ? $t(`Global.approvals_status_1`) : $t(`Global.state_${$store.state.submission.last_alert.actual_level}`) }} -->  
            {{ hasDecision ? $store.state.submission.decision.name : $store.state.submission.last_alert.actual_level == 6 && $store.state.submission.last_alert.show_type == 7 && type == 'Group' ? $t('Global.inReportLevel') : ($store.state.submission.last_alert.actual_level == 6) && ($store.state.submission.last_alert.level == 6 ) && ($store.state.submission.last_alert.type == 1)?$t(`Global.init`): $t(`Global.Alert_${$store.state.submission.last_alert.type}_${$store.state.submission.last_alert.actual_level}`) }}

          </template>
        </CBadge>
      </template>
      <template #other_data>
        <tr v-if="$store.getters['submission/submission']" :class="isLoad ? 'disabledAll' : ''">
          <th scope="row" width="20%">{{ $t('Global.organization') }}</th>
          <td width="80%">
            <router-link v-if="$store.getters['submission/name']" :to="{ path: $store.getters['submission/name'].id ? `/higher/organization/${$store.getters['submission/name'].id}` : '' }">
              {{ $store.state.submission.submission.name ? $store.state.submission.submission.name : '' }}
            </router-link>
          </td>
        </tr>
        <tr v-if="$store.getters['submission/submission']" :class="isLoad ? 'disabledAll' : ''">
          <th scope="row" width="20%">{{ $t('Global.university') }}</th>
          <td width="80%">
            {{
              $store.state.submission.submission.university
                ? $store.state.submission.submission.university
                : $store.state.submission.submission.temp_university_name
                ? $store.state.submission.submission.temp_university_name + '( ' + $store.state.submission.submission.temp_organization_name + ' )'
                : ''
            }}
          </td>
        </tr>
      </template>
      <template #bottom_other_data>
        <tr v-if="$store.getters['submission/submission']" :class="isLoad ? 'disabledAll' : ''">
          <th scope="row" width="20%">{{ $t('Global.authorized_person') }}</th>
          <td width="80%">
            <span>{{ $store.getters['submission/authorized_person'] }}</span>
          </td>
        </tr>

        <tr v-if="$store.getters['submission/team']" :class="isLoad ? 'disabledAll' : ''">
          <th scope="row" width="20%">{{ $t('Global.team') }}</th>
          <td width="80%">
            <span>
              <div class="teams_state d-md-flex flex-wrap">
                <router-link v-if="lastAlert && !evaluatorCheck(['ORGANIZATION_TYPE', 'COMMITTEE_TYPE'])" class="custom-link" slot="reference" :to="{ path: `/higher/team/${$store.getters['submission/team'].id}` }">
                  <CBadge class="custom-link ml-2 mr-2 text-wrap" color="info">{{ $store.getters['submission/team'].name }}</CBadge>
                </router-link>
                <div class="mb-2">
                  <span>{{ $t('Global.visit_data') + ': ' }} </span>
                  <span style="font-weight: bolder" class="ml-3">
                    ( {{ $store.getters['submission/team'].starts_at ? toLocalDatetime($store.getters['submission/team'].starts_at, `${$i18n.locale == 'ar' ? 'ar' : 'en'}`) : '-' }} {{ $store.getters['submission/team'].starts_at ? $t('Global.to') : '' }}
                    {{ $store.getters['submission/team'].ends_at ? toLocalDatetime($store.getters['submission/team'].ends_at, `${$i18n.locale == 'ar' ? 'ar' : 'en'}`) : '' }} )</span
                  >
                </div>
                <div class="d-inline teams_state">
                  <div v-if="showAction && evaluatorCheck(['ORGANIZATION_TYPE']) && showType == showConstants('string', 'MEMBER_APPROVAL')">
                    <el-tooltip content="موافقة على الفريق او ميعاد الزيارة" style="padding: 5px 13px" placement="top-start">
                      <el-button icon="el-icon-check" @click="handleAccept" round size="mini" class="mx-1 right_icon" type="success"> {{ $t('Global.accept') }}</el-button>
                    </el-tooltip>
                    <el-tooltip content="رفض الفريق او ميعاد الزيارة" style="padding: 5px 13px" placement="top-start">
                      <el-button icon="el-icon-close" @click="dialogOpenRep(false)" size="mini" class="mx-1 right_icon" round type="danger"> {{ $t('Global.refuse') }}</el-button>
                    </el-tooltip>
                  </div>
                </div>
                <div class="mb-2 d-inline-flex flex-wrap" v-if="$store.getters['submission/visitTable']">
                  <span style="font-weight: bolder" class="ml-1">
                    <a class="custom-link" :href="$store.getters['submission/visitTable'].url" target="_blank"><i class="el-icon-download"></i> {{ $store.getters['submission/visitTable'].title }}, </a>
                  </span>
                  <span>{{ $t('Global.updated_at') + ': ' }} </span>
                  <span style="font-weight: bolder" class="ml-1"> ({{ toLocalDatetime($store.getters['submission/visitTable'].updated_at, `${$i18n.locale == 'ar' ? 'ar' : 'en'}`) }})</span>
                </div>
              </div>
              <span
                v-for="member in $store.getters['submission/team'].all_members"
                v-if="member.team_job != constants('COMMITTEE') && !evaluatorCheck(['COMMITTEE_TYPE']) && (((showAction || lastAlert.actual_level >= 5 || lastAlert.type == 2) && evaluatorCheck(['ORGANIZATION_TYPE'])) || !evaluatorCheck(['ORGANIZATION_TYPE']))"
              >
                <div class="teams_state">
                  <div class="d-inline">
                    <el-tooltip v-if="member.excused === 2 && isAuth(member)" content="رفض الانضمام للفريق" placement="top-start">
                      <el-button @click="dialogOpen(false, member.id, $store.getters['submission/team'].id)" icon="el-icon-close" circle size="mini" class="mx-1 right_icon" type="danger"></el-button>
                    </el-tooltip>
                    <el-tooltip v-if="member.excused === 2 && isAuth(member)" content="الموافقة على الانضمام للفريق" placement="top-start">
                      <el-button icon="el-icon-check" @click="handleMemberAccept(member.id, $store.getters['submission/team'].id)" circle size="mini" class="mx-1 right_icon" type="success"></el-button>
                    </el-tooltip>
                  </div>
                  <template
                    v-if="
                      (!isObserve && !evaluatorCheck(['ORGANIZATION_TYPE']) && (evaluatorCheck(['PRESIDENT_TYPE', 'ACCREDITATION_TYPE', 'VICE_TYPE', 'MANAGER_TYPE']) || hasPermission('admin_submissions'))) ||
                      ((member.team_job == 1 || (member.team_job != 1 && isLeader) || (member.team_job != 1 && evaluatorCheck(['ORGANIZATION_TYPE']))) && afterVisit)
                    "
                  >
                    <router-link
                      class="print_hide"
                      v-if="member.id != authUser().id && !evaluatorCheck(['ORGANIZATION_TYPE']) && (evaluatorCheck(['PRESIDENT_TYPE']) || evaluatorCheck(['PRESIDENT_TYPE', 'ACCREDITATION_TYPE', 'VICE_TYPE', 'MANAGER_TYPE']) || hasPermission('admin_submissions'))"
                      :to="{ path: `/users/user/evaluations/${member.id}${$store.getters['submission/team'] ? '/' + $store.getters['submission/team'].id : ''}`.toString() }"
                    >
                      <el-button icon="el-icon-star-off" round size="mini" class="mx-1 right_icon" type="success">{{ $t('Global.viewEvaluation') }}</el-button>
                    </router-link>
                    <template v-if="$store.state.user.allowHr || hasPermission('admin_system')">
                      <router-link
                        class="print_hide"
                        v-if="member.id != authUser().id && !isObserve && (evaluatorCheck(['TEAM_TYPE']) || (evaluatorCheck(['ORGANIZATION_TYPE']) && member.id != authUser().id && member.team_job != 5))"
                        :to="`/users/user/evaluation/add/${$route.params.submission_id}/${member.team_member_id}`"
                      >
                        <el-button icon="el-icon-star-off" round size="mini" class="mx-1 right_icon" type="success">{{ !member.my_evaluation ? $t('Global.evaluate') : $t('Global.viewEvaluation') }}</el-button>
                      </router-link>
                    </template>
                    <!-- <span
                      v-if="
                        !member.my_evaluation &&
                        !evaluatorCheck(['ORGANIZATION_TYPE']) &&
                        (evaluatorCheck(['PRESIDENT_TYPE']) ||
                          $store.getters['evaluation/evaluator'] == evConstants('ACCREDITATION_TYPE') ||
                          $store.getters['evaluation/evaluator'] == evConstants('VICE_TYPE') ||
                          $store.getters['evaluation/evaluator'] == evConstants('MANAGER_TYPE'))
                      "
                      class="text-danger font-weight-bolder mb-2"
                      >{{ $t('Global.notEvaluate') }}</span
                    > -->
                  </template>
                  <router-link v-if="member.id" class="d-block custom-link text_badge" :to="{ path: `/users/${member.id}` }">
                    <el-badge v-if="member.excused === constants('NOT_EXCUSED__STATUS')" type="success" :value="$t('Global.exist')"></el-badge>
                    <el-badge v-if="member.excused === constants('EXCUSED_STATUS')" type="danger" :value="$t('Global.excused')"></el-badge>
                    <el-badge v-if="member.excused === 2" type="warning" :value="$t('Global.sub_excused')"></el-badge>
                    {{ member.ar_name }} ({{ member.job }})
                  </router-link>
                </div>
              </span>
            </span>
          </td>
        </tr>
        <tr :class="isLoad ? 'disabledAll' : ''" v-if="$store.getters['submission/team'] && !evaluatorCheck(['ORGANIZATION_TYPE', 'TEAM_TYPE'])">
          <th scope="row" width="20%">{{ $t('Global.committeeMember') }}</th>
          <td width="80%">
            <span>
              <span v-for="member in $store.getters['submission/team'].all_members" v-if="member.team_job === constants('COMMITTEE')">
                <div class="teams_state">
                  <div class="d-inline" v-if="showAction && $store.state.submission.last_alert && $store.state.submission.last_alert.show_type == showConstants('string', 'MEMBER_APPROVAL') && ($store.state.user.allowPu || hasPermission('admin_system'))">
                    <el-tooltip v-if="member.excused === 2 && isAuth(member)" content="رفض الانضمام للفريق" placement="top-start">
                      <el-button @click="dialogOpen(false, member.id, $store.getters['submission/team'].id)" icon="el-icon-close" circle size="mini" class="mx-1 right_icon" type="danger"></el-button>
                    </el-tooltip>
                    <el-tooltip v-if="member.excused === 2 && isAuth(member)" content="الموافقة على الانضمام للفريق" placement="top-start">
                      <el-button icon="el-icon-check" @click="handleMemberAccept(member.id, $store.getters['submission/team'].id)" circle size="mini" class="mx-1 right_icon" type="success"></el-button>
                    </el-tooltip>
                  </div>
                  <router-link class="d-block custom-link text_badge" :to="{ path: `/users/${member.id}` }">
                    <el-badge v-if="member.excused === constants('NOT_EXCUSED__STATUS')" type="success" :value="$t('Global.exist')"></el-badge>
                    <el-badge v-if="member.excused === constants('EXCUSED_STATUS')" type="danger" :value="$t('Global.excused')"></el-badge>
                    <el-badge v-if="member.excused === 2" type="warning" :value="$t('Global.sub_excused')"></el-badge>
                    {{ member.ar_name }} ({{ member.job }})
                  </router-link>
                </div>
              </span>
            </span>
          </td>
        </tr>

        <tr :class="isLoad ? 'disabledAll' : ''" v-if="$store.getters['submission/team'] && !evaluatorCheck(['ORGANIZATION_TYPE', 'TEAM_TYPE'])">
          <th scope="row" width="20%">{{ $t('Global.visitorTeam') }}</th>
          <td width="80%">
            <span>
              <span v-for="member in $store.getters['submission/team'].all_members" v-if="member.team_job == constants('REVIEWERS')">
                <div class="teams_state">
                  <router-link class="d-block custom-link text_badge" :to="{ path: `/users/${member.id}` }">
                    <el-badge v-if="member.excused === constants('NOT_EXCUSED__STATUS')" type="success" :value="$t('Global.exist')"></el-badge>
                    <el-badge v-if="member.excused === constants('EXCUSED_STATUS')" type="danger" :value="$t('Global.excused')"></el-badge>
                    <el-badge v-if="member.excused === 2" type="warning" :value="$t('Global.sub_excused')"></el-badge>
                    {{ member.ar_name }} ({{ member.job }})
                  </router-link>
                </div>
              </span>
            </span>
          </td>
        </tr>
        <tr>
          <th scope="row" width="20%">{{ $t('Global.representative') }}</th>
          <td width="80%" v-if="$store.getters['submission/representative']">
            <router-link class="custom-link" :to="{ path: `/users/${$store.getters['submission/representative'].id}` }">
              {{ $store.getters['submission/representative'].ar_name }}
            </router-link>
          </td>
        </tr>
        <tr v-if="$store.state.submission.payment">
          <th scope="row" width="20%">{{ $t('Global.uploadLetterOrgFile') }}</th>
          <td width="80%">
            <div class="mb-2">
              <span>{{ $t('Global.pay_value') + ': ' }} </span>
              <span style="font-weight: bolder" class="ml-3"> ({{ $store.getters['submission/payment'].pay_value ? $store.getters['submission/payment'].pay_value : '' }}),</span>
              <span>{{ $t('Global.pay_number') + ': ' }} </span>
              <span style="font-weight: bolder" class="ml-3"> ({{ $store.getters['submission/payment'].pay_number ? $store.getters['submission/payment'].pay_number : '' }}),</span>
              <span>{{ $t('Global.payment_date') + ': ' }} </span>
              <span style="font-weight: bolder" class="ml-3"> ( {{ $store.getters['submission/payment'].payment_date ? toLocalDatetime($store.getters['submission/payment'].payment_date, `${$i18n.locale == 'ar' ? 'ar' : 'en'}`) : '-' }} )</span>
            </div>
          </td>
        </tr>
      </template>
    </Show>

    <CCard v-if="$store.state.submission.children && $store.state.submission.children.length">
      <CCardHeader>
        <div :class="$i18n.locale === 'ar' ? 'card-header-actions' : ''" style="display: inline-block; font-weight: bold"><i class="el-icon-data-board"></i> {{ $t('Global.followVisit') }}</div>
      </CCardHeader>
      <CCardBody>
        <el-table v-if="$store.state.submission.children && $store.state.submission.children.length" :data="$store.state.submission.children" style="width: 100%" :header-cell-class-name="$i18n.locale === 'ar' ? 'text-right' : ''" :cell-class-name="$i18n.locale === 'ar' ? 'text-right' : ''">
          <el-table-column prop="id" label="#" sortable width="70"></el-table-column>
          <el-table-column prop="name" width="400" :label="$t('submission.name')" sortable>
            <template slot-scope="scope">
              <el-tooltip effect="dark" placement="top-start">
                <div slot="content">
                  <span>
                    {{ scope.row.name }} <span class="small text-muted" v-if="scope.row.institute">({{ `${$t('Global.institute')} : ${scope.row.institute}` }})</span><br />
                    <span class="small text-muted">
                      {{ scope.row.old_id ? `( ${$t('Global.oldId')} :${scope.row.old_id}) |` : '' }}
                      {{ `${$t('Global.submitted_at')} :${scope.row.created_at ? toLocalDatetime(scope.row.created_at, 'ar', false) : '_'}` }}
                    </span>
                  </span>
                </div>

                <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 100%">
                  <span class="font-weight-bolder">
                    {{ scope.row.name }}
                    <span class="small text-muted" v-if="scope.row.institute">({{ `${$t('Global.institute')} : ${scope.row.institute}` }})</span>
                  </span>
                  <div class="small text-muted">
                    {{ scope.row.old_id ? `( ${$t('Global.oldId')} :${scope.row.old_id}) |` : '' }}
                    {{ `${$t('Global.submitted_at')} :${scope.row.created_at ? toLocalDatetime(scope.row.created_at, 'ar', false) : '_'}` }}
                  </div>
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="start" :label="$t('Global.start_at')">
            <template slot-scope="scope">
              {{ scope.row.start ? toLocalDatetime(scope.row.start, `${$i18n.locale == 'ar' ? 'ar' : 'en'}`) : 'لا يوجد' }}
            </template>
          </el-table-column>
          <el-table-column prop="expiration" :label="$t('Global.ends_at')">
            <template slot-scope="scope">
              {{ scope.row.expiration ? toLocalDatetime(scope.row.expiration, `${$i18n.locale == 'ar' ? 'ar' : 'en'}`) : 'لا يوجد' }}
            </template>
          </el-table-column>
          <el-table-column prop="updated_at" :label="$t('Global.updated')">
            <template slot-scope="scope">
              <div>
                <small class="d-block">{{ toLocalDatetime(scope.row.updated_at, 'ar', false) }}</small>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="decision" :label="$t('Global.decisionAndLevel')">
            <template slot-scope="scope">
              <el-tooltip v-if="!scope.row.decision" effect="dark" :content="scope.row.e_title ? scope.row.e_title : scope.row.s_title" placement="top-start">
                <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 100%">
                  <CBadge color="info">{{ scope.row.e_title ? scope.row.e_title : scope.row.s_title }} </CBadge>
                </div>
              </el-tooltip>
              <el-tooltip effect="dark" :content="`${scope.row.decision ? scope.row.decision : `${$t('Global.noAction')}`}${scope.row.number ? `(${scope.row.number})` : ''}`" placement="top-start">
                <div v-if="scope.row.decision" style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 100%">
                  <CBadge :color="scope.row.decision === null ? 'danger' : scope.row.decision === 'اعتماد' ? 'success' : 'warning'">
                    {{ scope.row.decision ? scope.row.decision : `${$t('Global.noAction')}` }}
                    {{ scope.row.number ? `(${scope.row.number})` : '' }}
                  </CBadge>
                </div>
              </el-tooltip>
              <CBadge class="m-1" color="info" v-if="scope.row.init_decision && !scope.row.decision"> {{ $t('Global.tempDecision') }} - {{ scope.row.init_decision }} </CBadge>
            </template>
          </el-table-column>
          <el-table-column prop="" label=" ">
            <template slot-scope="scope">
              <div :style="$i18n.locale === 'ar' ? 'text-align:left' : 'float: right;'">
                <router-link :to="`/higher/submissions/submission/${scope.row.id}/${scope.row.evaluation_id}`" class="table-action-item">
                  <el-button type="primary" size="mini" class="xs_mini" icon="el-icon-view" circle></el-button>
                </router-link>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div v-else class="d-lg-flex">{{ $t('Global.noProgram') }}</div>
      </CCardBody>
    </CCard>
    <el-dialog :title="$t('Global.writeNote')" :visible.sync="dialogVisible" width="80%">
      <div>
        <el-form label-position="top" :model="form" status-icon size="large" ref="form" label-width="120px" class="stateForm demo-ruleForm">
          <CRow>
            <el-form-item :rules="validation(false, 'textarea')" class="custom_area" style="width: 100%" prop="comment">
              <el-input id="comment" class="textarea" type="textarea" :placeholder="$t('Global.rejectReason')" v-model="form.comment"></el-input>
            </el-form-item>
          </CRow>
        </el-form>
        <span slot="footer" :class="isLoad ? 'disabledAll' : ''" class="dialog-footer" style="display: flex">
          <el-button icon="el-icon-close" @click="sendReject('form')" round size="mini" class="mx-1 right_icon" type="danger">{{ $t('Global.accept') }}</el-button>
          <el-button class="ml-1 mr-1" @click="dialogVisible = false" round size="small">{{ $t('Global.discard') }}</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Show from '../../../components/Show';

export default {
  components: { Show },
  props: { type: String },
  name: 'info',
  data() {
    return {
      baseUrl: process.env.VUE_APP_BASE_URL,
      dialogMoveVisible : false,
      isLoad: false,
      dialogVisible: false,
      user_id: null,
      team_id: null,
      ifFound: true,
      newStage:null,
      form: {
        comment: null,
      },
    };
  },
  updated() {
    this.checkFound();
  },
  computed: {
    afterVisit() {
      if (this.lastAlert && this.lastAlert.actual_level == 6 && this.lastAlert.type == 1) {
        return true;
      } else if (this.lastAlert.type == 2) {
        return true;
      } else {
        return false;
      }
    },
    isObserve: function () {
      if (this.$store.getters['submission/team']) {
        let Observe = this.$store.getters['submission/team'].all_members.filter(member => member.team_job == 5);
        if (Observe.some(member => member.id == this.authUser().id)) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    currentUrl: function () {
      return window.location.pathname;
    },
    educationType: function () {
      if (this.$store.state.submission.submission && this.$store.state.submission.submission.education_type) {
        return this.$store.state.submission.submission.education_type;
      }
    },
    showAction: function () {
      if (this.$store.state.submission.last_alert && this.$store.state.evaluation.evaluator.includes(this.$store.state.submission.last_alert.evaluator_type)) {
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
    hasDecision: function () {
      if (this.$store.state.submission.decision && this.$store.state.submission.decision.removed == 0) {
        return true;
      }
      return false;
    },
  },
  methods: {
    handleAcceptMove() {
      this.$confirm( this.$t('Global.ensureBeforeRequest'), {
          confirmButtonText: `${this.$t('Global.accept')}`,
          cancelButtonText: `${this.$t('Global.cancel')}`,
          type: 'warning',
      }).then(_ => {
          this.move();
        
      });
    },
    move(){
      let Submission = this.$route.params.submission_id;
      let query = {
        stage : this.newStage.id,
        submission : Submission
      }
      this.isLoad = false;
     
      this.$store.dispatch('submission/move',query).then(() => {
      
      this.Refresh(); 
      });
      
      this.newStage = null;
      this.dialogMoveVisible = false
    },
    checkFound() {
      this.$nextTick(() => {
        let foundClass = document.querySelector(`#submission_id .customDrop .iF_found`);
        if (foundClass) {
          this.ifFound = true;
        } else {
          this.ifFound = false;
        }
      });
    },
    undoRedo(type) {
      this.$confirm(this.$t('Global.changeMessage'), `${this.$t('Global.warning')}`, {
        confirmButtonText: `${this.$t('Global.accept')}`,
        cancelButtonText: `${this.$t('Global.cancel')}`,
        type: 'warning',
      })
        .then(() => {
          this.$store
            .dispatch('submission/PreundoRedo', {
              type: type,
              submission: this.$route.params.submission_id,
            })
            .then(_ => {
              this.Refresh();
            });
        })
        .catch(() => {});
    },
    dialogOpen(state, user_id, team_id) {
      this.user_id = user_id;
      this.team_id = team_id;
      this.dialogVisible = true;
    },
    dialogOpenRep() {
      this.dialogVisible = true;
    },
    followVisit(id) {
      this.isLoad = true;
      this.$store.dispatch('submission/followVisit', id).then(_ => {
        this.Refresh();
        this.isLoad = false;
      });
    },
    changeDisabilityStatus(id) {
      this.isLoad = true;
      this.$store.dispatch('submission/changeDisabilityStatus', id).then(_ => {
        this.Refresh();
        this.$store.dispatch('evaluation/preStandards', {
          evaluation_id: this.$route.params.id,
          query: {},
        });
        this.isLoad = false;
      });
    },
    showUpload(status, id) {
      this.isLoad = true;
      this.$store.dispatch('submission/showUpload', { query: { status: status }, id: id }).then(_ => {
        this.Refresh();
        this.isLoad = false;
      });
    },
    sendReject(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.user_id) {
            this.dialogVisible = false;
            this.isLoad = true;
            this.$store
              .dispatch('submission/teamState', {
                id: this.$route.params.submission_id,
                query: {
                  note: String(this.form.comment),
                  status: this.constants('EXCUSED_STATUS'),
                  user_id: this.user_id,
                  team_id: this.team_id,
                },
              })
              .then(() => {
                this.$notify.error({
                  message: `${this.$t('Global.sendRejectMessage')}`,
                });
                this.Refresh();
                this.isLoad = false;
              });
          } else {
            this.isLoad = true;
            let query = {
              note: String(this.form.comment),
              status: this.constants('PRE_REFUSE_STATUS'),
            };
            this.$store
              .dispatch('notes/preChangeSubState', {
                id: this.$route.params.submission_id,
                system: 1,
                query: query,
              })
              .then(() => {
                this.dialogVisible = false;
                let id = this.$store.state.submission.submission.organization_id;

                if (this.$store.state.submission.orgActive && id) {
                  this.$store.dispatch('organization/delete', { id: id, query: { status: 1 } });
                }
                this.Refresh();
                this.isLoad = false;
                this.$notify.error({
                  message: `${this.$t('Global.sendRejectMessage')}`,
                });
              })
              .catch(() => {
                this.isLoad = false;
              });
          }
        }
      });
    },
    handleAccept() {
      this.$confirm(`${this.$t('Global.ensureBeforeRequest')}`, {
        confirmButtonText: `${this.$t('Global.accept')}`,
        cancelButtonText: `${this.$t('Global.cancel')}`,
        type: 'success',
      })
        .then(_ => {
          var status = 1;
          this.isLoad = true;
          this.$store
            .dispatch('submission/excusedRepresentative', {
              id: this.$route.params.submission_id,
              query: { note: null, status: status },
            })
            .then(() => {
              this.$notify.success({
                message: `${this.$t('Global.successMessage')}`,
              });
              this.Refresh();
              this.isLoad = false;
            })
            .catch(_ => {
              this.isLoad = false;
            });
        })
        .catch(_ => {
          this.isLoad = false;
        });
    },
    handleMemberAccept(user_id, team_id) {
      this.$confirm(`${this.$t('Global.ensureBeforeRequest')}`, {
        confirmButtonText: `${this.$t('Global.accept')}`,
        cancelButtonText: `${this.$t('Global.cancel')}`,
        type: 'success',
      }).then(_ => {
        this.isLoad = true;
        this.$store
          .dispatch('submission/teamState', {
            id: this.$route.params.submission_id,
            query: {
              note: null,
              status: this.constants('NOT_EXCUSED__STATUS'),
              user_id: user_id,
              team_id: team_id,
            },
          })
          .then(() => {
            this.$notify.success({
              message: `${this.$t('Global.successMessage')}`,
            });
            this.isLoad = false;
            this.Refresh();
          });
      });
    },
    handleAcceptOrg() {
      this.$confirm(this.$t('Global.ensureBeforeRequest'), `${this.$t('Global.warning')}`, {
        confirmButtonText: `${this.$t('Global.accept')}`,
        cancelButtonText: `${this.$t('Global.cancel')}`,
        type: 'warning',
      }).then(() => {
        let id = this.$store.state.submission.submission.organization_id;
        if (id) {
          this.$store.dispatch('organization/delete', { id: id, query: { status: 0 } }).then(() => {
            this.Refresh();
            this.$notify({
              type: 'success',
              message: `${this.$t('Global.successMessage')}`,
            });
          });
        }
      });
    },

    getAlert(status) {
      switch (status) {
        case 0:
          return 'error';
        case 1:
          return 'info';
        case 2:
          return 'success';
        default:
          return 'info';
      }
    },
    diActive() {
      this.$confirm(this.$t('Global.delete_submission_message'), `${this.$t('Global.warning')}`, {
        confirmButtonText: `${this.$t('Global.accept')}`,
        cancelButtonText: `${this.$t('Global.cancel')}`,
        type: 'warning',
      }).then(() => {
        this.$store.dispatch('submission/delete', this.$route.params.submission_id).then(() => {
          this.$message({ message: this.$t('Global.successMessage'), type: 'success' });
          this.Refresh();
        });
      });
    },
    refreshStatus() {
      if (this.type === 'Group') {
        this.$store.dispatch('submission/groupSubmission', this.$route.params.submission_id).then(() => {
          this.$store.commit('SET_PATH_TITLE', this.$store.getters['submission/name'].name ? this.$store.getters['submission/name'].name : null);
          this.isLoad = false;
          this.checkFound();
        });
      } else {
        this.$store.dispatch('submission/submission', this.$route.params.id).then(() => {
          this.$store.commit('SET_PATH_TITLE', this.$store.getters['submission/name'].name ? this.$store.getters['submission/name'].name : null);
          this.isLoad = false;
          this.checkFound();
        });
      }
      this.$store.dispatch('notes/subState', this.$route.params.submission_id);
    },
    Refresh() {
      this.refreshStatus();
    },
  },
  destroyed() {
    this.$store.commit('SET_PATH_TITLE', null);
  },
  mounted() {
    this.Refresh();
  },
};
</script>

<style lang="scss">
.custom_link_white {
  a,
  span {
    &:hover {
      color: #fff;
    }
  }
}

.text_nobreak {
  word-break: normal !important;
}

.fab-wrapper {
  position: fixed;
  bottom: 3rem;
  left: 3rem;
  width: 100%;
  z-index: 99999;
}

.fab-checkbox {
  display: none;
}

.fab {
  position: absolute;
  bottom: -1rem;
  left: -1rem;
  width: 3.4rem;
  height: 3.4rem;
  border-radius: 50%;
  background: #3c4b64;
  box-shadow: 0px 5px 20px #3f5271;
  transition: all 0.3s ease;
  z-index: 99999;
  border: 1px solid #3c4d6a;
}

.fab-icon {
  font-size: 32px;
  position: absolute;
  bottom: 0.7rem;
  left: 0.7rem;
  color: white;
}

@keyframes blink {
  50% {
    opacity: 0.25;
  }
}

.fab-wheel {
  position: absolute;
  bottom: 4rem;
  left: 0;
  transition: all 0.3s ease;
  transform-origin: bottom right;
  transform: scale(0);
}

.fab-checkbox:checked ~ .fab-wheel {
  transform: scale(1);
}

.fab-action {
  background: #3c4b64;
  border-radius: 25px;
  display: flex;
  align-items: center;
  color: White;
  box-shadow: 0 0.1rem 1rem rgba(24, 66, 154, 0.82);
  transition: all 1s ease;
  opacity: 0;
}

.fab-checkbox:checked ~ .fab-wheel .fab-action {
  opacity: 1;
  padding: 7px;
}

.fab-action:hover {
  text-decoration: underline;
}

.float_action {
  position: absolute;
  bottom: 10px;
  left: 10px;
  z-index: 9999;

  .el-dropdown-menu {
    background: #000;
  }
}

.kc_fab_main_btn {
  background-color: #39f;
  width: 60px;
  height: 60px;
  border-radius: 100%;
  background: #39f;
  position: absolute;
  bottom: 10px;
  left: 10px;
  z-index: 9999;
  border: none;
  outline: none;
  color: #fff;
  font-size: 36px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  transition: 0.3s;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

.kc_fab_main_btn:hover {
  transform: scale(1.1);
  transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
}
</style>
