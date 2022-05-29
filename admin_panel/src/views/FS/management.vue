<template>
  <CRow>
    <CCol md="4">
      <router-link to="/finance/index/1">
        <CWidgetProgressIcon :header="$t('Global.finance_submissions')" :text="$t('HEmanage.submissionInfo')" color="info" :value="100" style="text-align: initial">
          <i class="el-icon-money"></i>
        </CWidgetProgressIcon>
      </router-link>
    </CCol>
    <CCol md="4">
      <router-link to="/finance/index/2">
        <CWidgetProgressIcon :header="$t('Global.pre_finance_submissions')" :text="$t('HEmanage.submissionInfo')" color="info" :value="100" style="text-align: initial">
          <i class="el-icon-money"></i>
        </CWidgetProgressIcon>
      </router-link>
    </CCol>
    <CCol md="4">
      <router-link to="/finance/index/3">
        <CWidgetProgressIcon :header="$t('Global.TR_finance_submissions')" :text="$t('Global.TRAINING_MANAGER_TASK')" color="info" :value="100" style="text-align: initial">
          <i class="el-icon-money"></i>
        </CWidgetProgressIcon>
      </router-link>
    </CCol>
    <CCol md="4">
      <router-link to="/finance/users">
        <CWidgetProgressIcon :header="$t('Global.finance_users')" :text="$t('Global.finance_users')" color="info" :value="100" style="text-align: initial">
          <i class="el-icon-user"></i>
        </CWidgetProgressIcon>
      </router-link>
    </CCol>

    <CCol md="4">
      <router-link to="/finance/wallet">
        <CWidgetProgressIcon :header="$t('Global.wallet')" :text="$t('Global.wallet')" color="info" :value="100" style="text-align: initial">
          <i class="el-icon-money"></i>
        </CWidgetProgressIcon>
      </router-link>
    </CCol>
  </CRow>
</template>

<script>
export default {
  name: 'management',
};
</script>

<style lang="scss"></style>
