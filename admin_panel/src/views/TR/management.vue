<template>
  <CRow>
    <CCol sm="4" v-if="hasPermission('show_courses')">
      <router-link to="/course/courses">
        <CWidgetProgressIcon :header="$t('TRmanage.Settingecourses')" :text="$t('TRmanage.SettingecoursesInfo')" color="info" :value="100" style="text-align: initial">
          <i class="el-icon-setting"></i>
        </CWidgetProgressIcon>
      </router-link>
    </CCol>

    <CCol sm="4" v-if="hasPermission('show_plans')">
      <router-link to="/course/plans">
        <CWidgetProgressIcon :header="$t('TRmanage.plans')" :text="$t('TRmanage.plans')" color="info" :value="100" style="text-align: initial">
          <i class="el-icon-s-order"></i>
        </CWidgetProgressIcon>
      </router-link>
    </CCol>

    <CCol sm="4" v-if="hasPermission('show_submissions')">
      <router-link to="/course/reservations">
        <CWidgetProgressIcon :header="$t('Global.subscriptionsTR')" :text="$t('Global.subscriptionsTR')" color="info" :value="100" style="text-align: initial">
          <i class="el-icon-check"></i>
        </CWidgetProgressIcon>
      </router-link>
    </CCol>

    <CCol sm="4" v-if="hasPermission('admin_tr') || hasPermission('edit_plans')">
      <router-link to="/course/places">
        <CWidgetProgressIcon :header="$t('Global.places')" :text="$t('Global.places')" color="info" :value="100" style="text-align: initial">
          <i class="el-icon-office-building"></i>
        </CWidgetProgressIcon>
      </router-link>
    </CCol>

    <CCol sm="4" v-if="hasPermission('admin_system')">
      <router-link to="/course/tr/forms">
        <CWidgetProgressIcon :header="$t('manage.forms')" :text="$t('manage.formsManagement')" color="info" :value="100" style="text-align: initial">
          <i class="el-icon-collection" style="height: 36px"></i>
        </CWidgetProgressIcon>
      </router-link>
    </CCol>

    <CCol sm="4" v-if="hasPermission('admin_system')">
      <router-link to="/course/reservations/stage">
        <CWidgetProgressIcon :header="$t('manage.subSC')" :text="$t('manage.subSC')" color="info" :value="100" style="text-align: initial">
          <i class="el-icon-setting" style="height: 36px"></i>
        </CWidgetProgressIcon>
      </router-link>
    </CCol>

    <!-- <CCol sm="4" >
          <router-link to="/school/messages">
            <CWidgetProgressIcon :header="$t('manage.messages')" :text="$t('manage.messages')" color="info" :value="100" style="text-align: initial">
              <i class="el-icon-message" style="height: 36px;"></i>
            </CWidgetProgressIcon>
          </router-link>
        </CCol> -->

    <!--        <CCol sm="3">-->
    <!-- <router-link to="/management/universities">-->
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
    <!--        </CCol> -->
  </CRow>
</template>

<script>
export default {
  name: 'HEManagement',
};
</script>

<style scoped></style>
