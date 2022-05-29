<template>
  <CRow v-if="hasPermission('access_he')">
    <CCol md="4" v-if="hasPermission('show_submissions')">
      <router-link to="/higher/submissions">
        <CWidgetProgressIcon :header="$t('HEmanage.submissions')" :text="$t('HEmanage.submissionInfo')" color="info" :value="100" style="text-align: initial">
          <i class="el-icon-message"></i>
        </CWidgetProgressIcon>
      </router-link>
    </CCol>

    <CCol md="4" v-if="hasPermission('show_organizations')">
      <router-link to="/higher/organizations">
        <CWidgetProgressIcon :header="$t('HEmanage.organizations')" :text="$t('HEmanage.organizationsManagement')" color="info" :value="100" style="text-align: initial">
          <i class="el-icon-office-building" style="height: 36px"></i>
        </CWidgetProgressIcon>
      </router-link>
    </CCol>

    <CCol md="4" v-if="hasPermission('show_teams')">
      <router-link to="/higher/teams">
        <CWidgetProgressIcon :header="$t('HEmanage.teams')" :text="$t('HEmanage.teamsInfo')" color="info" :value="100" style="text-align: initial">
          <i class="el-icon-data-line"></i>
        </CWidgetProgressIcon>
      </router-link>
    </CCol>

    <CCol md="4" v-if="hasPermission('admin_users')">
      <router-link to="/higher/forms">
        <CWidgetProgressIcon :header="$t('manage.forms')" :text="$t('manage.formsManagement')" color="info" :value="100" style="text-align: initial">
          <i class="el-icon-collection" style="height: 36px"></i>
        </CWidgetProgressIcon>
      </router-link>
    </CCol>

    <CCol sm="4" v-if="hasPermission('show_hotels')">
      <router-link to="/higher/hotels">
        <CWidgetProgressIcon :header="$t('HEmanage.hotels')" :text="$t('HEmanage.hotelsInfo')" color="info" :value="100" style="text-align: initial">
          <i class="el-icon-s-shop" style="height: 36px"></i>
        </CWidgetProgressIcon>
      </router-link>
    </CCol>

    <CCol sm="4" v-if="hasPermission('admin_submissions')">
      <router-link to="/higher/subsetting">
        <CWidgetProgressIcon :header="$t('manage.subSC')" :text="$t('manage.subSC')" color="info" :value="100" style="text-align: initial">
          <i class="el-icon-setting" style="height: 36px"></i>
        </CWidgetProgressIcon>
      </router-link>
    </CCol>

    <!--        <CCol sm="3">-->
    <!--            <router-link to="/management/universities">-->
    <!--                <CWidgetProgressIcon-->
    <!--                        :header="$t('HEmanage.reports')"-->
    <!--                        :text="$t('HEmanage.reportsManagement')"-->
    <!--                        color="info"-->
    <!--                        :value="100"-->
    <!--                        style="text-align: initial"-->

    <!--                >-->
    <!--                    <i class="el-icon-document" style="height: 36px;"></i>-->
    <!--                </CWidgetProgressIcon>-->
    <!--            </router-link>-->
    <!--        </CCol>-->
  </CRow>
</template>

<script>
export default {
  name: 'HEManagement',
};
</script>

<style scoped></style>
