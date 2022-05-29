<template>
  <div class="custom_report mb-3 pb-2">
    <div v-if="!currentAnswer && question.final && question.final.comment && final" class="reviewHeard" style="text-align: initial">
      <div class="review_header justify-content-between mb-0">
        <div class="review_header my-0" style="margin-left: 10px; margin-right: 10px">
          <div class="img_avatar" style="width: 20px; height: 20px">
            <img v-if="!evaluatorCheck(['ORGANIZATION_TYPE']) && !evaluatorCheck(['COMMITTEE_TYPE'])" :src="report.photo || '/img/avatars/avatardf.png'" class="c-avatar-img" />
            <img v-else src="/img/avatars/avatardf.png" class="c-avatar-img" />
          </div>
          <div>
            <router-link v-if="!evaluatorCheck(['ORGANIZATION_TYPE']) && !evaluatorCheck(['COMMITTEE_TYPE'])" :to="{ path: `/users/${report.id}` }" style="margin: 7px">
              <span
                >{{ report.ar_name }} <CBadge color="warning" class="badge-pill ml-2 mr-2" v-if="report.evaluator">{{ $t(`Global.role_${report.evaluator}`) }}</CBadge></span
              >
            </router-link>
            <router-link v-else to="">
              <span>{{ $t('Global.SystemManagement') }}</span>
            </router-link>
            <h6 class="custom_badge">
              <i class="el-icon-time"></i><span style="font-size: 11px" class="localTime mr-1 ml-1">{{ toLocalDatetime(report.posted_at, `${$i18n.locale == 'ar' ? 'ar' : 'en'}`) }}</span>
              <CBadge color="info badge-pill">{{ $t('Global.state_0') }}</CBadge>
            </h6>
          </div>
        </div>
      </div>
      <div class="mb-2 report_style button_after" style="background-color: #91c3dc; margin-left: 20px; margin-right: 20px">
        <p class="mb-0" v-if="question.final && question.final.comment" v-html="ntBr(question.final.comment)" style="word-break: break-word"></p>
        <p v-else class="mb-0">
          <small>{{ $t('Global.noComment') }}</small>
        </p>
        <!-- <el-button
          v-if="!$store.state.evaluation.canEdit && question.final && question.final.comment && (currentLevel == 5 || currentLevel == 3) && evaluatorCheck(['TEAM_TYPE'])"
          :icon="`${'el-icon-edit'}`"
          round
          size="mini"
          @click="$emit('openDialog', question, 'comment')"
          class="right_icon custom_send_icon"
          type="primary"
          >{{ $t('Global.edit') }}
        </el-button> -->
      </div>
    </div>

    <div v-if="!currentAnswer && question.team && question.team.comment && team" class="reviewHeard" style="text-align: initial">
      <div class="review_header justify-content-between mb-0">
        <div class="review_header my-0" style="margin-left: 10px; margin-right: 10px">
          <div class="img_avatar" style="width: 20px; height: 20px">
            <img v-if="!evaluatorCheck(['ORGANIZATION_TYPE']) && !evaluatorCheck(['COMMITTEE_TYPE'])" :src="report.photo || '/img/avatars/avatardf.png'" class="c-avatar-img" />
            <img v-else src="/img/avatars/avatardf.png" class="c-avatar-img" />
          </div>
          <div>
            <router-link v-if="!evaluatorCheck(['ORGANIZATION_TYPE']) && !evaluatorCheck(['COMMITTEE_TYPE'])" :to="{ path: `/users/${report.id}` }" style="margin: 7px">
              <span
                >{{ report.ar_name }} <CBadge color="warning" class="badge-pill ml-2 mr-2" v-if="report.evaluator">{{ $t(`Global.role_${report.evaluator}`) }}</CBadge></span
              >
            </router-link>
            <router-link v-else to="">
              <span>{{ $t('Global.SystemManagement') }}</span>
            </router-link>
            <h6 class="custom_badge">
              <i class="el-icon-time"></i><span style="font-size: 11px" class="localTime mr-1 ml-1">{{ toLocalDatetime(report.posted_at, `${$i18n.locale == 'ar' ? 'ar' : 'en'}`) }}</span>
              <CBadge color="info badge-pill">{{ $t('Global.state_0') }}</CBadge>
            </h6>
          </div>
        </div>
      </div>
      <div class="mb-2 report_style button_after" style="background-color: #91c3dc; margin-left: 20px; margin-right: 20px">
        <p class="mb-0" v-if="question.team && question.team.comment" v-html="ntBr(question.team.comment)" style="word-break: break-word"></p>
        <p v-else class="mb-0">
          <small>{{ $t('Global.noComment') }}</small>
        </p>
        <template v-if="$store.state.user.allowHr || hasPermission('admin_system')">
          <el-button
            :icon="`${'el-icon-edit'}`"
            round
            size="mini"
            @click="$emit('openDialog', question, 'comment')"
            class="right_icon custom_send_icon"
            type="primary"
            >{{ $t('Global.edit') }}
          </el-button>
        </template>
      </div>
    </div>

    <div :id="question ? question.id : ''" class="reviewHeard" style="text-align: initial">
      <div class="review_header justify-content-between mb-0">
        <div class="review_header my-0" style="margin-left: 10px; margin-right: 10px">
          <div class="img_avatar" style="width: 20px; height: 20px">
            <img v-if="!evaluatorCheck(['ORGANIZATION_TYPE']) && !evaluatorCheck(['COMMITTEE_TYPE'])" :src="report.photo || '/img/avatars/avatardf.png'" class="c-avatar-img" />
            <img v-else src="/img/avatars/avatardf.png" class="c-avatar-img" />
          </div>
          <div>
            <router-link v-if="!evaluatorCheck(['ORGANIZATION_TYPE']) && !evaluatorCheck(['COMMITTEE_TYPE'])" :to="{ path: `/users/${report.id}` }" style="margin: 7px">
              <span
                >{{ report.ar_name }} <CBadge color="warning" class="badge-pill ml-2 mr-2" v-if="report.evaluator">{{ $t(`Global.role_${report.evaluator}`) }}</CBadge></span
              >
            </router-link>
            <router-link v-else to="">
              <span>{{ $t('Global.SystemManagement') }}</span>
            </router-link>
            <h6 class="custom_badge">
              <i class="el-icon-time"></i><span style="font-size: 11px" class="localTime mr-1 ml-1">{{ toLocalDatetime(report.posted_at, `${$i18n.locale == 'ar' ? 'ar' : 'en'}`) }}</span>
              <CBadge v-if="report && !evaluatorCheck(['ORGANIZATION_TYPE'])" :color="getAnswer(report.answer_id).type" class="nr-1 ml-1 mr-1 badge-pill">{{ getAnswer(report.answer_id).name }} </CBadge>
              <CBadge color="info badge-pill">{{ level }}</CBadge>
            </h6>
          </div>
        </div>
      </div>

      <div :id="question.id" class="report_style button_after" style="margin-left: 20px; margin-right: 20px">
        <p class="mb-0" v-if="compare_report && option" v-html="ntBr(compare(compare_report.report, report.report))" style="word-break: break-word"></p>
        <p class="mb-0" v-else v-html="ntBr(report.report)" style="word-break: break-word"></p>
        <p v-if="compare_report && !compare_report.report && report.report" class="mb-2">
          <small>{{ $t('Global.noComment') }}</small>
        </p>
        <template v-if="$store.state.user.allowHr || hasPermission('admin_system')">
          <!-- test{{$store.state.submission}} -->
          <el-button
            v-if="
              (levelType == 2 && currentLevel == 6 && hasPermission('decision_approval')) ||
              (currentLevel != 2 && currentLevel != 4 && hasPermission('report_update') && currentAnswer) ||
              (showAction && currentAnswer && evaluatorCheck(['TEAM_TYPE']) && currentLevel != 2 && currentLevel != 4 && !$store.state.evaluation.canEdit && question.answer)
            "
            :icon="`${question.answer ? 'el-icon-edit' : 'el-icon-plus'}`"
            round
            size="mini"
            @click="$emit('getQuestionData', question)"
            class="right_icon custom_send_icon"
            type="primary"
            >{{ $t('Global.edit') }}
          </el-button>
          <el-button
            v-if="currentAnswer && !$store.state.evaluation.canEdit && question.answer && !question.answer.comment && (currentLevel == 5 || currentLevel == 3) && evaluatorCheck(['TEAM_TYPE'])"
            icon="el-icon-plus"
            round
            size="mini"
            @click="$emit('openDialog', question, 'comment')"
            class="ml-6 right_icon custom_send_icon"
            type="primary"
            >{{ $t('Global.addComment') }}
          </el-button>

          <el-button
            v-if="!$store.state.evaluation.canEdit && question.answer && !question.answer.Justifications && levelType == 2 && currentLevel == 6 && hasPermission('decision_approval')"
            icon="el-icon-plus"
            round
            size="mini"
            @click="$emit('openDialog', question, 'Justifications')"
            class="ml-6 right_icon custom_send_icon"
            type="primary"
            >{{ $t('Global.addComment') }}
          </el-button>

          <el-button
            v-if="!$store.state.evaluation.canEdit && question.answer && !question.answer.feedback && levelType == 2 && currentLevel == 6 && $store.getters['evaluation/evaluator'] === evConstants('REVIEWER_TYPE')"
            :icon="`${'el-icon-edit'}`"
            round
            size="mini"
            @click="$emit('openDialog', question, 'feedback')"
            class="right_icon custom_send_icon"
            type="primary"
            >{{ $t('Global.addComment') }}
          </el-button>

          <el-button
            v-if="
              showAction && currentAnswer && ((showAction && evaluatorCheck(['COMMITTEE_TYPE']) && !comment) || (showAction && evaluatorCheck(['ORGANIZATION_TYPE']) && !organization))
            "
            icon="el-icon-plus"
            round
            size="mini"
            @click="$emit('openDialog', question)"
            class="mx-1 right_icon custom_send_icon"
            type="primary"
            >{{ $t('Global.addTo') }}
          </el-button>
        </template>
      </div>
    </div>

    <div v-if="currentAnswer && question.director && question.director.Justifications && levelType == 2 && currentLevel == 6" class="reviewHeard" style="text-align: initial">
      <div class="review_header justify-content-between mb-0">
        <div class="review_header my-0" style="margin-left: 10px; margin-right: 10px">
          <div class="img_avatar" style="width: 20px; height: 20px">
            <!-- <img v-if="!evaluatorCheck(['ORGANIZATION_TYPE']) && !evaluatorCheck(['COMMITTEE_TYPE'])" :src="report.photo || '/img/avatars/avatardf.png'" class="c-avatar-img" /> -->
            <img src="/img/avatars/avatardf.png" class="c-avatar-img" />
          </div>
          <div>
            <router-link v-if="!evaluatorCheck(['ORGANIZATION_TYPE']) && !evaluatorCheck(['COMMITTEE_TYPE'])" :to="{ path: `/users/${report.id}` }" style="margin: 7px">
              <span
                ><CBadge color="warning" class="badge-pill ml-2 mr-2" v-if="report.evaluator">{{ $t('Global.MANAGEMENT_TYPE') }}</CBadge></span
              >
            </router-link>
            <router-link v-else to="">
              <span>{{ $t('Global.SystemManagement') }}</span>
            </router-link>
            <h6 class="custom_badge">
              <i class="el-icon-time"></i><span style="font-size: 11px" class="localTime mr-1 ml-1">{{ toLocalDatetime(report.posted_at, `${$i18n.locale == 'ar' ? 'ar' : 'en'}`) }}</span>
              <CBadge color="info badge-pill">{{ $t('Global.state_0') }}</CBadge>
            </h6>
          </div>
        </div>
      </div>
      <div class="mb-2 report_style button_after" style="background-color: #91c3dc; margin-left: 20px; margin-right: 20px">
        <p class="mb-0" v-if="question.answer && question.answer.Justifications" v-html="ntBr(question.answer.Justifications)" style="word-break: break-word"></p>
        <p v-else class="mb-0">
          <small>{{ $t('Global.noComment') }}</small>
        </p>
        <template v-if="$store.state.user.allowHr || hasPermission('admin_system')">
          <el-button
            v-if="!$store.state.evaluation.canEdit && question.answer && question.answer.Justifications && levelType == 2 && currentLevel == 6 && hasPermission('decision_approval')"
            :icon="`${'el-icon-edit'}`"
            round
            size="mini"
            @click="$emit('openDialog', question, 'Justifications')"
            class="right_icon custom_send_icon"
            type="primary"
            >{{ $t('Global.edit') }}
          </el-button>
        </template>
      </div>
    </div>

    <div v-if="currentAnswer && question.director && question.director.feedback && levelType == 2 && currentLevel == 6" class="reviewHeard" style="text-align: initial">
      <div class="review_header justify-content-between mb-0">
        <div class="review_header my-0" style="margin-left: 10px; margin-right: 10px">
          <div class="img_avatar" style="width: 20px; height: 20px">
            <!-- <img v-if="!evaluatorCheck(['ORGANIZATION_TYPE']) && !evaluatorCheck(['COMMITTEE_TYPE'])" :src="report.photo || '/img/avatars/avatardf.png'" class="c-avatar-img" /> -->
            <img src="/img/avatars/avatardf.png" class="c-avatar-img" />
          </div>
          <div>
            <router-link v-if="!evaluatorCheck(['ORGANIZATION_TYPE']) && !evaluatorCheck(['COMMITTEE_TYPE'])" :to="{ path: `/users/${report.id}` }" style="margin: 7px">
              <span
                ><CBadge color="warning" class="badge-pill ml-2 mr-2" v-if="report.evaluator">{{ $t('Global.visitorTeam') }}</CBadge></span
              >
            </router-link>
            <router-link v-else to="">
              <span>{{ $t('Global.SystemManagement') }}</span>
            </router-link>
            <h6 class="custom_badge">
              <i class="el-icon-time"></i><span style="font-size: 11px" class="localTime mr-1 ml-1">{{ toLocalDatetime(report.posted_at, `${$i18n.locale == 'ar' ? 'ar' : 'en'}`) }}</span>
              <CBadge color="info badge-pill">{{ $t('Global.state_0') }}</CBadge>
            </h6>
          </div>
        </div>
      </div>
      <div class="mb-2 report_style button_after" style="background-color: #91c3dc; margin-left: 20px; margin-right: 20px">
        <p class="mb-0" v-if="question.answer && question.answer.feedback" v-html="ntBr(question.answer.feedback)" style="word-break: break-word"></p>
        <p v-else class="mb-0">
          <small>{{ $t('Global.noComment') }}</small>
        </p>
        <template v-if="$store.state.user.allowHr || hasPermission('admin_system')">
          <el-button
            v-if="!$store.state.evaluation.canEdit && question.answer && question.answer.feedback && levelType == 2 && currentLevel == 6 && $store.getters['evaluation/evaluator'] === evConstants('REVIEWER_TYPE')"
            :icon="`${'el-icon-edit'}`"
            round
            size="mini"
            @click="$emit('openDialog', question, 'feedback')"
            class="right_icon custom_send_icon"
            type="primary"
            >{{ $t('Global.edit') }}
          </el-button>
        </template>
      </div>
    </div>

    <div :id="question ? question.id : ''" v-if="currentAnswer && comment && (currentLevel == 2 || currentLevel == 3)" class="custom_committee custom_report reviewHeard" style="text-align: initial">
      <div class="review_header justify-content-between mb-0 mt-0 mx-3">
        <div class="review_header my-0" style="margin-left: 10px; margin-right: 10px">
          <div class="img_avatar" style="width: 20px; height: 20px">
            <img
              v-if="!evaluatorCheck(['ORGANIZATION_TYPE']) && !evaluatorCheck(['TEAM_TYPE']) && !evaluatorCheck(['COMMITTEE_TYPE'])"
              :src="comment.photo || '/img/avatars/avatardf.png'"
              class="c-avatar-img"
            />
            <img v-else src="/img/avatars/avatardf.png" class="c-avatar-img" />
          </div>
          <div>
            <router-link
              v-if="!evaluatorCheck(['ORGANIZATION_TYPE']) && !evaluatorCheck(['TEAM_TYPE']) && !evaluatorCheck(['COMMITTEE_TYPE'])"
              :to="{ path: `/users/${comment.id}` }"
              style="margin: 7px"
            >
              <span
                >{{ comment.ar_name }} <CBadge color="warning" class="badge-pill ml-2 mr-2" v-if="comment.evaluator">{{ $t(`Global.role_${comment.evaluator}`) }}</CBadge></span
              >
            </router-link>
            <router-link v-else to="">
              <span>{{ $t('Global.SystemManagement') }}</span>
            </router-link>
            <h6 class="custom_badge">
              <i class="el-icon-time"></i><span style="font-size: 11px" class="localTime mr-1 ml-1">{{ toLocalDatetime(comment.posted_at, `${$i18n.locale == 'ar' ? 'ar' : 'en'}`) }}</span>
              <CBadge v-if="comment" :color="getAnswer(comment.accept).type" class="nr-1 ml-1 mr-1 badge-pill">{{ getAnswer(comment.accept).name }} </CBadge>
              <CBadge color="info badge-pill">{{ commentFrom }}</CBadge>
            </h6>
          </div>
        </div>
      </div>
      <div class="report_style button_after" style="margin-left: 30px; margin-right: 30px">
        <p class="mb-0" v-if="comment.report" v-html="ntBr(comment.report)" style="word-break: break-word"></p>
        <p v-else class="mb-0">
          <small>{{ $t('Global.noComment') }}</small>
        </p>
        <template v-if="$store.state.user.allowHr || hasPermission('admin_system')">
          <el-button
            v-if="levelType == 2 && currentLevel != 6 && currentAnswer && ((currentLevel == 2 && evaluatorCheck(['COMMITTEE_TYPE'])) || (currentLevel == 4 && evaluatorCheck(['ORGANIZATION_TYPE'])))"
            icon="el-icon-plus"
            round
            size="mini"
            @click="$emit('openDialog', question)"
            class="mx-1 right_icon custom_send_icon"
            type="primary"
            >{{ $t('Global.edit') }}
          </el-button>
        </template>
      </div>
    </div>
    <div v-if="currentAnswer && question.team && question.team.comment && currentLevel == 3" class="reviewHeard" style="text-align: initial">
      <div class="review_header justify-content-between mb-0">
        <div class="review_header my-0" style="margin-left: 10px; margin-right: 10px">
          <div class="img_avatar" style="width: 20px; height: 20px">
            <img v-if="!evaluatorCheck(['ORGANIZATION_TYPE']) && !evaluatorCheck(['COMMITTEE_TYPE'])" :src="report.photo || '/img/avatars/avatardf.png'" class="c-avatar-img" />
            <img v-else src="/img/avatars/avatardf.png" class="c-avatar-img" />
          </div>
          <div>
            <router-link v-if="!evaluatorCheck(['ORGANIZATION_TYPE']) && !evaluatorCheck(['COMMITTEE_TYPE'])" :to="{ path: `/users/${report.id}` }" style="margin: 7px">
              <span
                >{{ report.ar_name }} <CBadge color="warning" class="badge-pill ml-2 mr-2" v-if="report.evaluator">{{ $t(`Global.role_${report.evaluator}`) }}</CBadge></span
              >
            </router-link>
            <router-link v-else to="">
              <span>{{ $t('Global.SystemManagement') }}</span>
            </router-link>
            <h6 class="custom_badge">
              <i class="el-icon-time"></i><span style="font-size: 11px" class="localTime mr-1 ml-1">{{ toLocalDatetime(report.posted_at, `${$i18n.locale == 'ar' ? 'ar' : 'en'}`) }}</span>
              <CBadge color="info badge-pill">{{ $t('Global.state_0') }}</CBadge>
            </h6>
          </div>
        </div>
      </div>
      <div class="mb-2 report_style button_after" style="background-color: #91c3dc; margin-left: 20px; margin-right: 20px">
        <p class="mb-0" v-if="question.answer && question.answer.comment" v-html="ntBr(question.answer.comment)" style="word-break: break-word"></p>
        <p v-else class="mb-0">
          <small>{{ $t('Global.noComment') }}</small>
        </p>
        <template v-if="$store.state.user.allowHr || hasPermission('admin_system')">
          <el-button
            v-if="!$store.state.evaluation.canEdit && question.answer && question.answer.comment && (currentLevel == 5 || currentLevel == 3) && evaluatorCheck(['TEAM_TYPE'])"
            :icon="`${'el-icon-edit'}`"
            round
            size="mini"
            @click="$emit('openDialog', question, 'comment')"
            class="right_icon custom_send_icon"
            type="primary"
            >{{ $t('Global.edit') }}
          </el-button>
        </template>
      </div>
    </div>
    <div v-else-if="!currentAnswer && comment" class="custom_committee custom_report reviewHeard" style="text-align: initial">
      <div class="review_header justify-content-between mb-0 mt-0 mx-4">
        <div class="review_header my-0" style="margin-left: 10px; margin-right: 10px">
          <div class="img_avatar" style="width: 20px; height: 20px">
            <img
              v-if="!evaluatorCheck(['ORGANIZATION_TYPE']) && !evaluatorCheck(['TEAM_TYPE']) && !evaluatorCheck(['COMMITTEE_TYPE'])"
              :src="comment.photo || '/img/avatars/avatardf.png'"
              class="c-avatar-img"
            />
            <img v-else src="/img/avatars/avatardf.png" class="c-avatar-img" />
          </div>
          <div>
            <router-link
              v-if="!evaluatorCheck(['ORGANIZATION_TYPE']) && !evaluatorCheck(['TEAM_TYPE']) && !evaluatorCheck(['COMMITTEE_TYPE'])"
              :to="{ path: `/users/${comment.id}` }"
              style="margin: 7px"
            >
              <span
                >{{ comment.ar_name }} <CBadge color="warning" class="badge-pill ml-2 mr-2" v-if="comment.evaluator">{{ $t(`Global.role_${comment.evaluator}`) }}</CBadge></span
              >
            </router-link>
            <router-link v-else to="">
              <span>{{ $t('Global.SystemManagement') }}</span>
            </router-link>
            <h6 class="custom_badge">
              <i class="el-icon-time"></i><span style="font-size: 11px" class="localTime mr-1 ml-1">{{ toLocalDatetime(comment.posted_at, `${$i18n.locale == 'ar' ? 'ar' : 'en'}`) }}</span>
              <CBadge v-if="comment" :color="getAnswer(comment.accept).type" class="nr-1 ml-1 mr-1 badge-pill">{{ getAnswer(comment.accept).name }} </CBadge>
              <CBadge color="info badge-pill">{{ commentFrom }}</CBadge>
            </h6>
          </div>
        </div>
      </div>
      <div class="report_style button_after" style="margin-left: 30px; margin-right: 30px">
        <p class="mb-0" v-if="comment.report" v-html="ntBr(comment.report)" style="word-break: break-word"></p>
        <p v-else class="mb-0">
          <small>{{ $t('Global.noComment') }}</small>
        </p>
        <template v-if="$store.state.user.allowHr || hasPermission('admin_system')">
          <el-button
            v-if="levelType == 2 && currentLevel != 6 && currentAnswer && ((currentLevel == 2 && evaluatorCheck(['COMMITTEE_TYPE'])) || (currentLevel == 4 && evaluatorCheck(['ORGANIZATION_TYPE'])))"
            icon="el-icon-plus"
            round
            size="mini"
            @click="$emit('openDialog', question)"
            class="mx-1 right_icon custom_send_icon"
            type="primary"
            >{{ $t('Global.edit') }}
          </el-button>
        </template>
      </div>
    </div>

    <div :id="question ? question.id : ''" v-else-if="currentAnswer && organization && (currentLevel == 4 || currentLevel == 5)" class="custom_committee custom_report reviewHeard" style="text-align: initial">
      <div v-if="currentLevel != 4 || currentLevel != 4 || (currentLevel == 4 && !evaluatorCheck(['TEAM_TYPE']))" class="review_header justify-content-between mb-0 mt-0 mx-3">
        <div class="review_header my-0" style="margin-left: 10px; margin-right: 10px">
          <div class="img_avatar" style="width: 20px; height: 20px">
            <img :src="organization.photo || '/img/avatars/avatardf.png'" class="c-avatar-img" />
          </div>
          <div>
            <router-link :to="{ path: `/users/${organization.id}` }" style="margin: 7px">
              <span
                >{{ organization.ar_name }} <CBadge color="warning" class="badge-pill ml-2 mr-2" v-if="organization.evaluator">{{ $t(`Global.role_${organization.evaluator}`) }}</CBadge></span
              >
            </router-link>
            <h6 class="custom_badge">
              <i class="el-icon-time"></i><span style="font-size: 11px" class="localTime mr-1 ml-1">{{ toLocalDatetime(organization.posted_at, `${$i18n.locale == 'ar' ? 'ar' : 'en'}`) }}</span>
              <CBadge v-if="organization" :color="getAnswer(organization.accept).type" class="nr-1 ml-1 mr-1 badge-pill">{{ getAnswer(organization.accept).name }} </CBadge>
              <CBadge color="info badge-pill">{{ organizationFrom }}</CBadge>
            </h6>
          </div>
        </div>
      </div>
      <div v-if="currentLevel != 4 || (currentLevel == 4 && !evaluatorCheck(['TEAM_TYPE']))" class="report_style button_after" style="margin-left: 30px; margin-right: 30px">
        <p class="mb-0" v-if="organization.report" v-html="ntBr(organization.report)" style="word-break: break-word"></p>
        <p v-else class="mb-0">
          <small>{{ $t('Global.noComment') }}</small>
        </p>
        <template v-if="$store.state.user.allowHr || hasPermission('admin_system')">
          <el-button
            v-if="levelType == 2 && currentLevel != 6 && currentAnswer && ((currentLevel == 2 && evaluatorCheck(['COMMITTEE_TYPE'])) || (currentLevel == 4 && evaluatorCheck(['ORGANIZATION_TYPE'])))"
            icon="el-icon-plus"
            round
            size="mini"
            @click="$emit('openDialog', question)"
            class="mx-1 right_icon custom_send_icon"
            type="primary"
            >{{ $t('Global.edit') }}
          </el-button>
        </template>
      </div>
    </div>
    <div v-if="currentAnswer && question.final && question.final.comment && currentLevel == 5" class="reviewHeard" style="text-align: initial">
      <div class="review_header justify-content-between mb-0">
        <div class="review_header my-0" style="margin-left: 10px; margin-right: 10px">
          <div class="img_avatar" style="width: 20px; height: 20px">
            <img v-if="!evaluatorCheck(['ORGANIZATION_TYPE']) && !evaluatorCheck(['COMMITTEE_TYPE'])" :src="report.photo || '/img/avatars/avatardf.png'" class="c-avatar-img" />
            <img v-else src="/img/avatars/avatardf.png" class="c-avatar-img" />
          </div>
          <div>
            <router-link v-if="!evaluatorCheck(['ORGANIZATION_TYPE']) && !evaluatorCheck(['COMMITTEE_TYPE'])" :to="{ path: `/users/${report.id}` }" style="margin: 7px">
              <span
                >{{ report.ar_name }} <CBadge color="warning" class="badge-pill ml-2 mr-2" v-if="report.evaluator">{{ $t(`Global.role_${report.evaluator}`) }}</CBadge></span
              >
            </router-link>
            <router-link v-else to="">
              <span>{{ $t('Global.SystemManagement') }}</span>
            </router-link>
            <h6 class="custom_badge">
              <i class="el-icon-time"></i><span style="font-size: 11px" class="localTime mr-1 ml-1">{{ toLocalDatetime(report.posted_at, `${$i18n.locale == 'ar' ? 'ar' : 'en'}`) }}</span>
              <CBadge color="info badge-pill">{{ $t('Global.state_0') }}</CBadge>
            </h6>
          </div>
        </div>
      </div>
      <div class="mb-2 report_style button_after" style="background-color: #91c3dc; margin-left: 20px; margin-right: 20px">
        <p class="mb-0" v-if="question.answer && question.answer.comment" v-html="ntBr(question.answer.comment)" style="word-break: break-word"></p>
        <p v-else class="mb-0">
          <small>{{ $t('Global.noComment') }}</small>
        </p>
        <template v-if="$store.state.user.allowHr || hasPermission('admin_system')">
          <el-button
            v-if="!$store.state.evaluation.canEdit && question.answer && question.answer.comment && (currentLevel == 5 || currentLevel == 3) && evaluatorCheck(['TEAM_TYPE'])"
            :icon="`${'el-icon-edit'}`"
            round
            size="mini"
            @click="$emit('openDialog', question, 'comment')"
            class="right_icon custom_send_icon"
            type="primary"
            >{{ $t('Global.edit') }}
          </el-button>
        </template>
      </div>
    </div>
    <div v-else-if="organization && !currentAnswer" class="custom_committee custom_report reviewHeard" style="text-align: initial">
      <div v-if="currentLevel != 4 || (currentLevel == 4 && !evaluatorCheck(['TEAM_TYPE']))" class="review_header justify-content-between mb-0 mt-0 mx-3">
        <div class="review_header my-0" style="margin-left: 10px; margin-right: 10px">
          <div class="img_avatar" style="width: 20px; height: 20px">
            <img :src="organization.photo || '/img/avatars/avatardf.png'" class="c-avatar-img" />
          </div>
          <div>
            <router-link :to="{ path: `/users/${organization.id}` }" style="margin: 7px">
              <span
                >{{ organization.ar_name }} <CBadge color="warning" class="badge-pill ml-2 mr-2" v-if="organization.evaluator">{{ $t(`Global.role_${organization.evaluator}`) }}</CBadge></span
              >
            </router-link>
            <h6 class="custom_badge">
              <i class="el-icon-time"></i><span style="font-size: 11px" class="localTime mr-1 ml-1">{{ toLocalDatetime(organization.posted_at, `${$i18n.locale == 'ar' ? 'ar' : 'en'}`) }}</span>
              <CBadge v-if="organization" :color="getAnswer(organization.accept).type" class="nr-1 ml-1 mr-1 badge-pill">{{ getAnswer(organization.accept).name }} </CBadge>
              <CBadge color="info badge-pill">{{ organizationFrom }}</CBadge>
            </h6>
          </div>
        </div>
      </div>
      <div v-if="currentLevel != 4 || (currentLevel == 4 && !evaluatorCheck(['TEAM_TYPE']))" class="report_style button_after" style="margin-left: 30px; margin-right: 30px">
        <p class="mb-0" v-if="organization.report" v-html="ntBr(organization.report)" style="word-break: break-word"></p>
        <p v-else class="mb-0">
          <small>{{ $t('Global.noComment') }}</small>
        </p>
        <template v-if="$store.state.user.allowHr || hasPermission('admin_system')">
          <el-button
            v-if="levelType == 2 && currentLevel != 6 && currentAnswer && (currentLevel == 2 || currentLevel == 4) && (evaluatorCheck(['COMMITTEE_TYPE']) || evaluatorCheck(['ORGANIZATION_TYPE']))"
            icon="el-icon-plus"
            round
            size="mini"
            @click="$emit('openDialog', question)"
            class="mx-1 right_icon custom_send_icon"
            type="primary"
            >{{ $t('Global.edit') }}
          </el-button>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'report',
  props: {
    team: Boolean,
    director: Boolean,
    final: Boolean,
    option: Boolean,
    currentAnswer: Boolean,
    currentLevel: Number,
    question: Object,
    report: Object,
    comment: Object,
    Justifications: Object,
    organization: Object,
    level: String,
    commentFrom: String,
    organizationFrom: String,
    compare_report: Object,
  },
  data() {
    return {};
  },
  computed: {
    levelType() {
      return this.$store.state.submission.last_alert ? this.$store.state.submission.last_alert.type : 1;
    },
    showAction: function () {
      if (this.$store.state.submission.last_alert && this.$store.state.evaluation.evaluator.includes(this.$store.state.submission.last_alert.evaluator_type)) {
        return true;
      }
      return false;
    },
  },
};
</script>

<style lang="scss">
.badge {
  font-size: 72% !important;
}
.radius_0 {
  border-top-left-radius: 0 !important;
  border-top-right-radius: 0 !important;
}
.ml-6 {
  margin-left: 6rem !important;
}
.button_after {
  flex-direction: column;
  button {
    align-self: baseline;
    margin-top: 0.5rem;
  }
}
.reviewHeard {
  padding-bottom: 0.5rem;
}
.review_header {
  align-items: baseline !important;
  margin-top: 0.5rem !important;
}
.custom_badge {
  display: block;
  margin: 0.4rem -1.1rem 0.5rem 0;
  color: #b0b3b8;
  span {
    font-size: 9px;
  }
}
.custom_report {
  background-color: #eee;
  border-radius: 30px;
  padding-top: 0.2rem !important;
}
.report_style {
  position: relative;
  .el-button {
    align-self: flex-end;
    margin: 0rem 0.4rem;
    position: absolute;
    bottom: 4px;
    left: 10px;
    padding: 6px 15px;
  }
  p {
    //   text-align: justify;
    text-align-last: right;
  }

  p::after {
    content: '–––––––––––--';
    visibility: hidden;
    white-space: nowrap;
  }
  background-color: #ddd;
  border-radius: 30px;
  padding: 5px 20px 5px 5px;
  display: flex;
  justify-content: space-between;
}

.compare {
  margin: 0 0.5rem;
}

.compare .switch_option {
  background-color: #fff;
  -webkit-box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
}

.switch_option {
  display: -ms-inline-flexbox;
  display: inline-flex;
  border: 1px solid #fff;
  border-radius: 30px;
  position: relative;
  font-size: 22px;
  cursor: pointer;
}

.compare .switch_option .active {
  background-color: #eee;
  -webkit-box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
}

.compare .switch_option span {
  -webkit-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
  border-radius: 30px !important;
  padding: 5px 10px !important;
}
</style>
