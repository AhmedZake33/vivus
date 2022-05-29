<template>
  <div>
    <div class="custom_report p-3 m-3">
      <div class="review_header justify-content-between mb-0 mt-0">
        <div class="review_header my-0" style="margin-left: 10px; margin-right: 10px">
          <div class="img_avatar" style="width: 20px; height: 20px">
            <img v-if="!evaluatorCheck(['ORGANIZATION_TYPE']) && !evaluatorCheck(['COMMITTEE_TYPE'])" :src="report.photo || '/img/avatars/avatardf.png'" class="c-avatar-img" />
            <img v-else src="/img/avatars/avatardf.png" class="c-avatar-img" />
          </div>
          <div>
            <router-link v-if="!evaluatorCheck(['ORGANIZATION_TYPE']) && !evaluatorCheck(['COMMITTEE_TYPE'])" :to="{ path: `/users/${report.id}` }" style="margin: 7px">
              <span
                >{{ report.ar_name }} <CBadge color="warning" class="badge-pill ml-2 mr-2" v-if="report.evaluator">{{ $t(`Global.role_${report.evaluator}`) }}</CBadge>
              </span>
            </router-link>
            <router-link v-else to="">
              <span>{{ $t('Global.SystemManagement') }}</span>
            </router-link>
            <h6 class="custom_badge">
              <i class="el-icon-time"></i><span style="font-size: 11px" class="localTime mr-1 ml-1">{{ toLocalDatetime(report.posted_at, `${$i18n.locale == 'ar' ? 'ar' : 'en'}`) }}</span>
              <CBadge
                v-if="report && (!evaluatorCheck(['ORGANIZATION_TYPE']) || (evaluatorCheck(['ORGANIZATION_TYPE']) && levelType == 2 && currentLevel == 6))"
                :color="getAnswer(report.answer_id || report.accept).type"
                class="nr-1 ml-1 mr-1 badge-pill"
                >{{ getAnswer(report.answer_id || report.accept).name }}
              </CBadge>
              <CBadge color="info badge-pill">{{ level }}</CBadge>
            </h6>
          </div>
        </div>
      </div>
      <div class="replay_color gray">
        <span class="mb-4 font-weight-bold">{{ $t('Global.justifications') }}</span>
        <div class="reviewHeard report_style mt-2" style="text-align: initial">
          <div v-if="report">
            <p v-if="report.Justifications" v-html="ntBr(report.Justifications)" class="m-0"></p>
            <p v-else class="mb-2">
              <small>{{ $t('Global.noComment') }}</small>
            </p>
          </div>
        </div>
        <span class="mb-4 font-weight-bold">{{ $t('Global.comment') }}</span>
        <div class="reviewHeard report_style mt-2" style="text-align: initial">
          <div v-if="report" class="w-100 report_style button_after p-0">
            <p v-if="report.comment" v-html="ntBr(report.comment)" class="m-0"></p>
            <p v-else class="mb-2">
              <small>{{ $t('Global.noComment') }}</small>
            </p>
            <template v-if="$store.state.user.allowHr || hasPermission('admin_system')">
              <el-button
                v-if="
                  (levelType == 2 && currentLevel == 6 && hasPermission('decision_approval')) ||
                  (hasPermission('report_update') && currentAnswer && [1, 3, 5, 6].includes(currentLevel)) ||
                  (showAction && currentAnswer && evaluatorCheck(['TEAM_TYPE']) && !$store.state.evaluation.canEdit && currentLevel != 2 && currentAnswer && currentLevel != 4 && currentAnswer)
                "
                :icon="`${$store.getters['evaluation/parent'].answer ? 'el-icon-edit' : 'el-icon-plus'}`"
                round
                size="mini"
                @click="$emit('mainDialogVisibleOpen', $store.getters['evaluation/parent'])"
                class="right_icon custom_send_icon"
                type="primary"
                >{{ $store.getters['evaluation/parent'].answer ? $t('Global.edit') : $t('Global.add') }}
              </el-button>
            </template>
          </div>
        </div>
      </div>

      <div v-if="currentAnswer && committee && currentLevel == 2" class="custom_report pt-0 custom_committee px-3 m-3">
        <div class="review_header justify-content-between m-0">
          <div class="review_header my-0" style="margin-left: 10px; margin-right: 10px">
            <div class="img_avatar" style="width: 20px; height: 20px">
              <img
                v-if="!evaluatorCheck(['ORGANIZATION_TYPE']) && !evaluatorCheck(['TEAM_TYPE']) && !evaluatorCheck(['COMMITTEE_TYPE'])"
                :src="committee.photo || '/img/avatars/avatardf.png'"
                class="c-avatar-img"
              />
              <img v-else src="/img/avatars/avatardf.png" class="c-avatar-img" />
            </div>
            <div>
              <router-link
                v-if="!evaluatorCheck(['ORGANIZATION_TYPE']) && !evaluatorCheck(['TEAM_TYPE']) && !evaluatorCheck(['COMMITTEE_TYPE'])"
                :to="{ path: `/users/${committee.id}` }"
                style="margin: 7px"
              >
                <span
                  >{{ committee.ar_name }} <CBadge color="warning" class="badge-pill ml-2 mr-2" v-if="report.evaluator">{{ $t(`Global.role_${committee.evaluator}`) }}</CBadge></span
                >
              </router-link>
              <router-link v-else to="">
                <span>{{ $t('Global.SystemManagement') }}</span>
              </router-link>
              <h6 class="custom_badge">
                <i class="el-icon-time"></i><span style="font-size: 11px" class="localTime mr-1 ml-1">{{ toLocalDatetime(committee.posted_at, `${$i18n.locale == 'ar' ? 'ar' : 'en'}`) }}</span>
                <CBadge v-if="committee" :color="getAnswer(committee.accept).type" class="nr-1 ml-1 mr-1 badge-pill">{{ getAnswer(committee.accept).name }} </CBadge>
                <CBadge color="info badge-pill">{{ commentFrom }}</CBadge>
              </h6>
            </div>
          </div>
        </div>
        <div class="replay_color p-1">
          <div class="reviewHeard report_style" style="text-align: initial">
            <div v-if="committee" class="w-100 report_style button_after" style="margin-left: 20px; margin-right: 20px">
              <p v-if="committee.comment" v-html="ntBr(committee.comment)" style="word-break: break-word" class="m-0">
                {{ committee.comment }}
              </p>
              <p v-else>
                <small>{{ $t('Global.noComment') }}</small>
              </p>
              <template v-if="$store.state.user.allowHr || hasPermission('admin_system')">
                <el-button
                  v-if="(currentLevel != 6 && evaluatorCheck(['COMMITTEE_TYPE']) && currentLevel == 2) || ($store.getters['evaluation/evaluator'] === evConstants('ORGANIZATION_TYPE') && currentLevel == 4)"
                  :icon="`${$store.getters['evaluation/parent'].answer ? 'el-icon-edit' : 'el-icon-plus'}`"
                  round
                  size="mini"
                  @click="$emit('mainDialogVisibleOpen', $store.getters['evaluation/parent'], 'comment')"
                  class="right_icon custom_send_icon"
                  type="primary"
                  >{{ $t('Global.edit') }}
                </el-button>
              </template>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="committee" class="custom_report pt-0 custom_committee px-3 m-3">
        <div class="review_header justify-content-between m-0">
          <div class="review_header my-0" style="margin-left: 10px; margin-right: 10px">
            <div class="img_avatar" style="width: 20px; height: 20px">
              <img
                v-if="!evaluatorCheck(['ORGANIZATION_TYPE']) && !evaluatorCheck(['TEAM_TYPE']) && !evaluatorCheck(['COMMITTEE_TYPE'])"
                :src="committee.photo || '/img/avatars/avatardf.png'"
                class="c-avatar-img"
              />
              <img v-else src="/img/avatars/avatardf.png" class="c-avatar-img" />
            </div>
            <div>
              <router-link
                v-if="!evaluatorCheck(['ORGANIZATION_TYPE']) && !evaluatorCheck(['TEAM_TYPE']) && !evaluatorCheck(['COMMITTEE_TYPE'])"
                :to="{ path: `/users/${committee.id}` }"
                style="margin: 7px"
              >
                <span
                  >{{ committee.ar_name }} <CBadge color="warning" class="badge-pill ml-2 mr-2" v-if="committee.evaluator">{{ $t(`Global.role_${committee.evaluator}`) }}</CBadge></span
                >
              </router-link>
              <router-link v-else to="">
                <span>{{ $t('Global.SystemManagement') }}</span>
              </router-link>
              <h6 class="custom_badge">
                <i class="el-icon-time"></i><span style="font-size: 11px" class="localTime mr-1 ml-1">{{ toLocalDatetime(committee.posted_at, `${$i18n.locale == 'ar' ? 'ar' : 'en'}`) }}</span>
                <CBadge v-if="committee" :color="getAnswer(committee.accept).type" class="nr-1 ml-1 mr-1 badge-pill">{{ getAnswer(committee.accept).name }} </CBadge>
                <CBadge color="info badge-pill">{{ commentFrom }}</CBadge>
              </h6>
            </div>
          </div>
        </div>
        <div class="replay_color p-1">
          <div class="reviewHeard report_style" style="text-align: initial">
            <div v-if="committee">
              <p v-if="committee.comment" v-html="ntBr(committee.comment)" style="word-break: break-word" class="m-0">
                {{ committee.comment }}
              </p>
              <div v-else>
                <small>{{ $t('Global.noComment') }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="currentAnswer && organization && currentLevel == 4" class="custom_report pt-0 custom_committee px-3 m-3">
        <div v-if="currentLevel != 4 || (currentLevel == 4 && !evaluatorCheck(['TEAM_TYPE']))" class="review_header justify-content-between mb-0 mt-0">
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
        <div v-if="currentLevel != 4 || (currentLevel == 4 && !evaluatorCheck(['TEAM_TYPE']))" class="replay_color p-1">
          <div class="reviewHeard report_style" style="text-align: initial">
            <div v-if="organization" class="w-100 report_style button_after" style="margin-left: 20px; margin-right: 20px">
              <p v-if="organization.comment" v-html="ntBr(organization.comment)" style="word-break: break-word" class="m-0">
                {{ organization.comment }}
              </p>
              <p v-else>
                <small>{{ $t('Global.noComment') }}</small>
              </p>
              <template v-if="$store.state.user.allowHr || hasPermission('admin_system')">
                <el-button
                  v-if="(currentLevel != 6 && evaluatorCheck(['COMMITTEE_TYPE']) && currentLevel == 2) || ($store.getters['evaluation/evaluator'] === evConstants('ORGANIZATION_TYPE') && currentLevel == 4)"
                  :icon="`${$store.getters['evaluation/parent'].answer ? 'el-icon-edit' : 'el-icon-plus'}`"
                  round
                  size="mini"
                  @click="$emit('mainDialogVisibleOpen', $store.getters['evaluation/parent'], 'comment')"
                  class="right_icon custom_send_icon"
                  type="primary"
                  >{{ $t('Global.edit') }}
                </el-button>
              </template>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="!currentAnswer && organization" class="custom_report pt-0 custom_committee px-3 m-3">
        <div v-if="currentLevel != 4 || (currentLevel == 4 && !evaluatorCheck(['TEAM_TYPE']))" class="review_header justify-content-between mb-0 mt-0">
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
        <div v-if="currentLevel != 4 || (currentLevel == 4 && !evaluatorCheck(['TEAM_TYPE']))" class="replay_color p-1">
          <div class="reviewHeard report_style" style="text-align: initial">
            <div v-if="organization">
              <p v-if="organization.comment" v-html="ntBr(organization.comment)" style="word-break: break-word" class="m-0">
                {{ organization.comment }}
              </p>
              <div v-else>
                <small>{{ $t('Global.noComment') }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: { report: Object, currentAnswer: Boolean, level: String, currentLevel: Number, commentFrom: String, organizationFrom: String, organization: Object, committee: Object },
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
.c-avatar-img {
  height: 100%;
}
.replay_color {
  &.gray {
    background-color: #ddd;
  }
  background-color: #c0c4cc;
  border-radius: 30px;
  padding: 1rem;
}
.custom_committee {
  margin: 0 !important;
  .report_style {
    background-color: #c0c4cc;
  }
}
</style>
