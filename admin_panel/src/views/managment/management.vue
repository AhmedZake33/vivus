<template>
  <CRow>
    <CCol sm="4" v-if="hasPermission('admin_roles')">
      <router-link to="/management/roles">
        <CWidgetProgressIcon :header="$t('manage.roles')" :text="$t('manage.rolesInfo')" color="info" :value="100" style="text-align: initial">
          <CIcon name="cil-lock-locked" height="36" />
        </CWidgetProgressIcon>
      </router-link>
    </CCol>
    <CCol sm="4" v-if="hasPermission('admin_logs')">
      <router-link to="/management/logs">
        <CWidgetProgressIcon :header="$t('manage.logs')" :text="$t('manage.logsInfo')" color="info" :value="100" style="text-align: initial">
          <CIcon name="cil-speedometer" height="36" />
        </CWidgetProgressIcon>
      </router-link>
    </CCol>
    <CCol sm="4" v-if="hasPermission('admin_archive')">
      <router-link to="/management/archive">
        <CWidgetProgressIcon :header="$t('manage.archive')" :text="$t('manage.archiveInfo')" color="info" :value="100" style="text-align: initial">
          <i class="el-icon-files" style="height: 36px"></i>
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
    <CCol md="4" v-if="hasPermission('show_forms')">
      <router-link to="/management/docs">
        <CWidgetProgressIcon :header="$t('Global.FilesNeeded')" :text="$t('Global.FilesNeeded')" color="info" :value="100" style="text-align: initial">
          <i class="el-icon-document" style="height: 36px"></i>
        </CWidgetProgressIcon>
      </router-link>
    </CCol>
    <CCol md="4" v-if="hasPermission('admin_users')">
      <router-link to="/management/recoveries">
        <CWidgetProgressIcon :header="$t('Global.recoveries')" :text="$t('Global.recoveries')" color="info" :value="100" style="text-align: initial">
          <i class="el-icon-refresh" style="height: 36px"></i>
        </CWidgetProgressIcon>
      </router-link>
    </CCol>
    <CCol md="4" v-if="hasPermission('admin_users')">
      <router-link to="/management/tickets">
        <CWidgetProgressIcon :header="$t('Global.ticket')" :text="$t('Global.ticket')" color="info" :value="100" style="text-align: initial">
          <fa-icon :icon="['fas', 'question-circle']" style="height: 36px"/>
        </CWidgetProgressIcon>
      </router-link>
    </CCol>
    <CCol md="4" v-if="hasPermission('admin_users')">
      <router-link to="/management/settings">
        <CWidgetProgressIcon :header="$t('Global.settings')" :text="$t('Global.settings')" color="info" :value="100" style="text-align: initial">
          <i class="el-icon-setting" style="height: 36px"></i>
        </CWidgetProgressIcon>
      </router-link>
    </CCol>
    <!-- <CCol sm="3">
            <router-link to="/contacts">
                <CWidgetProgressIcon
                        :header="$t('manage.sector')"
                        :text="$t('manage.sectorManagement')"
                        color="info"
                        :value="100"
                        style="text-align: initial"
                >
                    <i class="el-icon-pie-chart" style="height: 36px;"></i>
                </CWidgetProgressIcon>
            </router-link>
        </CCol> -->
    <!-- 
        <CCol sm="3">
            <router-link to="/management/archive">
                <CWidgetProgressIcon
                        :header="$t('manage.archive')"
                        :text="$t('manage.archiveInfo')"
                        color="info"
                        :value="100"
                        style="text-align: initial"

                >
                    <i class="el-icon-files" style="height: 36px;"></i>
                </CWidgetProgressIcon>
            </router-link>
        </CCol>

        <CCol sm="3">
            <router-link to="/management/archive">
                <CWidgetProgressIcon
                        :header="$t('manage.archive')"
                        :text="$t('manage.archiveInfo')"
                        color="info"
                        :value="100"
                        style="text-align: initial"

                >
                    <i class="el-icon-files" style="height: 36px;"></i>
                </CWidgetProgressIcon>
            </router-link>
        </CCol>

        <CCol sm="3">
            <router-link to="/management/archive">
                <CWidgetProgressIcon
                        :header="$t('manage.archive')"
                        :text="$t('manage.archiveInfo')"
                        color="info"
                        :value="100"
                        style="text-align: initial"

                >
                    <i class="el-icon-files" style="height: 36px;"></i>
                </CWidgetProgressIcon>
            </router-link>
        </CCol>

        <CCol sm="3">
            <router-link to="/management/archive">
                <CWidgetProgressIcon
                        :header="$t('manage.archive')"
                        :text="$t('manage.archiveInfo')"
                        color="info"
                        :value="100"
                        style="text-align: initial"

                >
                    <i class="el-icon-files" style="height: 36px;"></i>
                </CWidgetProgressIcon>
            </router-link>
        </CCol>

        <CCol sm="3">
            <router-link to="/management/archive">
                <CWidgetProgressIcon
                        :header="$t('manage.archive')"
                        :text="$t('manage.archiveInfo')"
                        color="info"
                        :value="100"
                        style="text-align: initial"

                >
                    <i class="el-icon-files" style="height: 36px;"></i>
                </CWidgetProgressIcon>
            </router-link>
        </CCol>

        <CCol sm="3">
            <router-link to="/management/archive">
                <CWidgetProgressIcon
                        :header="$t('manage.archive')"
                        :text="$t('manage.archiveInfo')"
                        color="info"
                        :value="100"
                        style="text-align: initial"

                >
                    <i class="el-icon-files" style="height: 36px;"></i>
                </CWidgetProgressIcon>
            </router-link>
        </CCol>

        <CCol sm="3">
            <router-link to="/management/archive">
                <CWidgetProgressIcon
                        :header="$t('manage.archive')"
                        :text="$t('manage.archiveInfo')"
                        color="info"
                        :value="100"
                        style="text-align: initial"

                >
                    <i class="el-icon-files" style="height: 36px;"></i>
                </CWidgetProgressIcon>
            </router-link>
        </CCol> -->
    <!-- <CCol sm="3">
            <router-link to="/management/archive">
                <CWidgetProgressIcon
                        :header="$t('manage.archive')"
                        :text="$t('manage.archiveInfo')"
                        color="info"
                        :value="100"
                        style="text-align: initial"

                >
                    <i class="el-icon-files" style="height: 36px;"></i>
                </CWidgetProgressIcon>
            </router-link>
        </CCol> -->
  </CRow>
</template>

<script>
export default {
  name: 'management',
};
</script>

<style scoped></style>
