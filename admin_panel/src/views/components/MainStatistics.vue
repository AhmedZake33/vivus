<template>
  <div>
    <CRow class="user_icons" :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'" style="text-align: initial">
      <CCol sm="6" lg="3" class="statistcColor">
        <router-link class="text_right" to="/users">
          <CWidgetIcon class="pa-0" :header="$store.getters['statistics/totalUsers'].toString()" :text="$t('dashboard.totalUser')" color="info" :icon-padding="false">
            <i class="el-icon-user" style="font-size: 25px"></i>
          </CWidgetIcon>
        </router-link>
        <!-- <CWidgetDropdown color="primary" :header="$store.getters['statistics/totalUsers'].toString()" :text="$t('dashboard.totalUser')">
          <template #default>
            <CDropdown color="transparent p-0" placement="bottom-end">
              <template #toggler-content>
                <CIcon name="cil-settings" />
              </template>
              <CDropdownItem to="/users">{{ $t('dashboard.users') }}</CDropdownItem>
            </CDropdown>
          </template>
          <template #footer>
            <CChartLineSimple pointed class="mt-3 mx-3" style="height:70px" :data-points="[65, 59, 84, 84, 51, 55, 40]" point-hover-background-color="#154360" label="Members" labels="months" />
          </template>
        </CWidgetDropdown> -->
      </CCol>
      <CCol sm="6" lg="3" class="statistcColor">
        <router-link class="text_right" to="/higher/submissions">
          <CWidgetIcon class="pa-0" :header="$store.getters['statistics/totalSubmissions'].toString()" :text="$t('dashboard.totalSubmissions')" color="primary" :icon-padding="false">
            <i class="el-icon-s-promotion" style="font-size: 25px"></i>
          </CWidgetIcon>
        </router-link>
        <!-- <CWidgetDropdown color="info" :header="$store.getters['statistics/totalSubmissions'].toString()" :text="$t('dashboard.totalSubmissions')">
          <template #default>
            <CDropdown color="transparent p-0" placement="bottom-end">
              <template #toggler-content>
                <CIcon name="cil-settings" />
              </template>
              <CDropdownItem to="/higher/submissions">{{ $t('dashboard.totalSubmissions') }}</CDropdownItem>
            </CDropdown>
          </template>
          <template #footer>
            <CChartLineSimple pointed class="mt-3 mx-3" style="height:70px" :data-points="[1, 18, 9, 17, 34, 22, 11]" point-hover-background-color="#3498DB" :options="{ elements: { line: { tension: 0.00001 } } }" label="Members" labels="months" />
          </template>
        </CWidgetDropdown> -->
      </CCol>
      <CCol sm="6" lg="3" class="statistcColor">
        <router-link class="text_right" to="/higher/organizations">
          <CWidgetIcon class="pa-0" :header="$store.getters['statistics/totalOrganizations'].toString()" :text="$t('dashboard.totalOrganizations')" color="warning" :icon-padding="false">
            <i class="el-icon-office-building" style="font-size: 25px"></i>
          </CWidgetIcon>
        </router-link>
        <!-- <CWidgetDropdown color="warning" :header="$store.getters['statistics/totalOrganizations'].toString()" :text="$t('dashboard.totalOrganizations')">
          <template #default>
            <CDropdown color="transparent p-0" placement="bottom-end">
              <template #toggler-content>
                <CIcon name="cil-settings" />
              </template>
              <CDropdownItem to="/higher/organizations">{{ $t('dashboard.totalOrganizations') }}</CDropdownItem>
            </CDropdown>
          </template>
          <template #footer>
            <CChartLineSimple class="mt-3" style="height: 70px" background-color="rgba(255,255,255,.2)" :data-points="[78, 81, 80, 45, 34, 12, 40]" :options="{ elements: { line: { borderWidth: 2.5 } } }" point-hover-background-color="#27AE60" label="Members" labels="months" />
          </template>
        </CWidgetDropdown> -->
      </CCol>
      <CCol sm="6" lg="3">
        <router-link class="text_right" to="/higher/teams">
          <CWidgetIcon class="pa-0" :header="$store.getters['statistics/totalTeams'].toString()" :text="$t('dashboard.totalTeams')" color="danger" :icon-padding="false">
            <i class="el-icon-medal" style="font-size: 25px"></i>
          </CWidgetIcon>
        </router-link>
        <!-- <CWidgetDropdown color="danger" :header="$store.getters['statistics/totalTeams'].toString()" :text="$t('dashboard.totalTeams')">
          <template #default>
            <CDropdown color="transparent p-0" placement="bottom-end">
              <template #toggler-content>
                <CIcon name="cil-settings" />
              </template>
              <CDropdownItem to="/higher/teams">{{ $t('dashboard.totalTeams') }}</CDropdownItem>
            </CDropdown>
          </template>
          <template #footer>
            <CChartBarSimple class="mt-3 mx-3" style="height: 70px" background-color="rgb(250, 152, 152)" label="Members" labels="months" />
          </template>
        </CWidgetDropdown> -->
      </CCol>

      <div class="d-flex justify-content-center w-100 flex-wrap">
        <CCol sm="6" lg="3">
          <router-link class="text_right" to="/higher/submissions">
            <CWidgetIcon class="pa-0" :header="$store.state.statistics.accessUsers ? $store.state.statistics.accessUsers.toString():''" :text="$t('dashboard.accessUsers')" color="dark" :icon-padding="false">
              <i class="el-icon-data-analysis" style="font-size: 25px"></i>
            </CWidgetIcon>
          </router-link>
        </CCol>
        <CCol sm="6" lg="3">
          <router-link class="text_right" to="/higher/submissions">
            <CWidgetIcon class="pa-0" :header="$store.state.statistics.activeUsers ? $store.state.statistics.activeUsers.toString():''" :text="$t('dashboard.activeUsers')" color="warning" :icon-padding="false">
              <i class="el-icon-s-data" style="font-size: 25px"></i>
            </CWidgetIcon>
          </router-link>
        </CCol>
        <CCol sm="6" lg="3">
          <router-link class="text_right" to="/higher/submissions">
            <CWidgetIcon class="pa-0" :header="$store.state.statistics.taskUsers ? $store.state.statistics.taskUsers.toString() : ''" :text="$t('dashboard.taskUsers')" color="primary" :icon-padding="false">
              <i class="el-icon-data-line" style="font-size: 25px"></i>
            </CWidgetIcon>
          </router-link>
        </CCol>
      </div>
    </CRow>
  </div>
</template>

<script>
import WidgetsDropdown from '../widgets/WidgetsDropdown';
import { CChartLineSimple, CChartBarSimple } from '../charts/index.js';

export default {
  name: 'MainStatistics',
  props: {
    system: Number,
  },
  components: {
    WidgetsDropdown,
    CChartLineSimple,
    CChartBarSimple,
  },
  watch: {
    system: function (val) {
      let query = { system: val };
      this.$store.dispatch('statistics/setStatistics', { query: query });
    },
  },
  mounted() {
    let query = { system: this.system };
    this.$store.dispatch('statistics/setStatistics', { query: query });
  },
};
</script>

<style lang="scss">
.mainStatistics {
  display: flex;
  flex-direction: column;
  align-items: center;
  .switch_view {
    margin-bottom: 1rem;
    margin-top: -1rem;
    background-color: #fff;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
    .active {
      background-color: #eee;
      box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
    }
    span {
      transition: all 0.2s ease-in-out;
      border-radius: 30px !important;
      padding: 5px 10px !important;
    }
  }
}
.statistcColor .bg-primary {
  background-color: #154360 !important;
}
.statistcColor .bg-info {
  background-color: #3498db !important;
}
.statistcColor .bg-warning {
  background-color: #27ae60 !important;
}
</style>
