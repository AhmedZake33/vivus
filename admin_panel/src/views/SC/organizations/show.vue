<template>
  <div v-if="hasPermission('access_organizations')">
    <Show :exceptKey="['email']" :loading="$store.getters['organization/organizationLoad']" icon="el-icon-office-building" :items="$store.getters['organization/organization']" :name="$store.getters['organization/name']" except="departments">
      <template #show_status>
        <CBadge color="success" v-if="$store.state.organization.organization && $store.state.organization.organization.org_type" style="margin: 4px">
          {{ $store.state.organization.organization.org_type }}
        </CBadge>
        <CBadge color="info" v-if="$store.state.organization.organization && $store.state.organization.organization.edu_type" style="margin: 4px">
          {{ $store.state.organization.organization.edu_type }}
        </CBadge>
        <CBadge :color="$store.getters['organization/status'] == 0 ? 'success' : 'danger'" v-show="$store.getters['organization/status'] == 1" style="margin: 4px">{{ $t('Global.remove') }} </CBadge>
      </template>
      <template #show_action v-if="$store.state.user.allowPu || hasPermission('admin_system')">
        <i class="el-icon-printer pointer print_hide" style="font-size: 17px" @click="print('organization_id', $store.getters['organization/name'])"></i>
        <router-link  class="mx-3 print_hide" :to="{ path: `/school/organization/edit/${$route.params.id}`.toString() }" v-if="hasPermission('edit_organizations') && (!isAuth($store.getters['submission/representative']))">
          <CIcon name="cil-pencil" color="bg-primary"></CIcon>
        </router-link>
        <CDropdown color="success" v-if="hasPermission('admin_organizations')" placement="bottom-end" size="sm" class="print_hide d-inline customDrop">
          <template #toggler-content>
            <CIcon name="cil-settings" />
            <span style="font-weight: bold">{{ $t('Global.action') }}</span>
          </template>
          <router-link class="item d-block" to="">
            <div style="text-align: initial" @click="diActive">
              <i :class="$store.getters['organization/status'] == 0 ? 'el-icon-delete' : 'el-icon-refresh'"></i>
              {{ $t(`Global.activate_org_${$store.getters['organization/status']}`) }}
            </div>
          </router-link>
        </CDropdown>
      </template>
      <template #other_data>
        <tr>
          <th scope="row" width="20%">{{ $t('Global.decision') }}</th>
          <td width="80%">
            <router-link v-for="evaluation in $store.getters['organization/evaluations']" :to="{ path: `/school/submissions/submission/${evaluation.submission_id}/${evaluation.evaluation_id}` }">
              <CBadge :color="evaluation.decision === null ? 'danger' : evaluation.decision === 'اعتماد' ? 'success' : 'warning'" class="custom-link" style="margin: 2px">{{ evaluation.decision ? evaluation.decision : 'لا يوجد' }}</CBadge>
              <CBadge v-if="evaluation.program" color="warning" class="custom-link" style="margin: 2px">{{ evaluation.program }} </CBadge>
              <CBadge class="custom-link" v-if="evaluation.start" color="info" style="margin: 2px"
                >{{ $t('Global.from') }} :
                {{ DateFormat(evaluation.start) }}
              </CBadge>
              <CBadge class="custom-link" v-if="evaluation.expiration" color="info"
                >{{ $t('Global.to') }} :
                {{ DateFormat(evaluation.expiration) }}
              </CBadge>

              <br />
            </router-link>
          </td>
        </tr>
        <tr v-if="$store.getters['organization/organization']" :class="isLoad ? 'disabledAll' : ''">
          <th scope="row" width="20%">{{ $t('Global.name') }}</th>
          <td width="80%">
            <span>{{ $store.state.organization.organization ? $store.state.organization.organization.name : '' }}</span>
          </td>
        </tr>
        <tr v-if="$store.getters['organization/organization']" :class="isLoad ? 'disabledAll' : ''">
          <th scope="row" width="20%">{{ educationType == 4 ? $t('Global.azhar_area') : $t('Global.institute') }}</th>
          <td width="80%">
            <span>{{ $store.state.organization.organization ? $store.state.organization.organization.institute : '' }}</span>
          </td>
        </tr>
      </template>
      <template #custom_th> 
        <span v-for="organization in $store.getters['organization/organization']">
          <span v-show="organization.key === 'email'"> {{$t('Global.azhar_email')}} </span>
        </span>
      </template>
        <!-- <template #custom_th> 
        <span v-for="organization in $store.getters['organization/organization']">
          <span v-show="organization.key === 'gender_type'"> {{$t('Global.org_type')}} </span>
        </span>
        </template> -->
      <template #custom_show>
        <span v-for="organization in $store.getters['organization/organization']">
          <span v-show="organization.key === 'departments'">
            <span v-for="department in organization.value" style="margin: 5px">
              <CBadge color="info">{{ department.name }}</CBadge> ,
            </span>
          </span>
        </span>
      </template>
      <template #bottom_other_data>
        <tr v-if="$store.getters['organization/organization'] && $store.state.organization.organization.school_code">
          <th scope="row" width="20%">{{ $store.state.organization.organization.education_type == 4 ? $t('Global.azhar_school_code') : $t('Global.school_code') }}</th>
          <td width="80%">
            {{ $store.state.organization.organization.school_code }}
          </td>
        </tr>
        <tr v-if="$store.getters['organization/organization'] && $store.state.organization.organization.school_building_number">
          <th scope="row" width="20%">{{ $store.state.organization.organization.education_type == 4 ? $t('Global.azhar_building_number') : $t('Global.school_building_number') }}</th>
          <td width="80%">
            {{ $store.state.organization.organization.school_building_number }}
          </td>
        </tr>
        <tr v-if="$store.getters['organization/organization'] && $store.state.organization.organization.org_type">
          <th scope="row" width="20%">{{ $store.state.organization.organization.education_type == 4 ? $t('Global.orgFollow') : $t('Global.SCgender') }}</th>
          <td width="80%">
            {{ $store.state.organization.organization.org_type }}
          </td>
        </tr>
        <tr>
          <th scope="row" width="20%">{{ $t('Global.representative') }}</th>
          <td width="80%" v-if="$store.getters['organization/representative']">
            <router-link class="custom-link" :to="{ path: `/users/${$store.getters['organization/representative'].id}` }">
              {{ $store.getters['organization/representative'].ar_name }}
            </router-link>
          </td>
        </tr>
      </template>
    </Show>
    <!--    <Show-->
    <!--      :loading="$store.getters['organization/organizationLoad']"-->
    <!--      icon="el-icon-user"-->
    <!--      :items="$store.getters['organization/representative']"-->
    <!--      @init="init"-->
    <!--      :name="$t('Global.evaluatorInfo')"-->
    <!--    >-->
    <!--    </Show>-->
    <Submissions system="SC" :localOrganization="Number($route.params.id)" @init="Refresh"></Submissions>
    <Map v-if="$store.getters['organization/organizationLocation']" :locations="$store.getters['organization/organizationLocation']" :center="center" :zoom="parseInt('12')"> </Map>
  </div>
</template>

<script>
import Show from '../../components/Show';
// import DataTable from '../../components/DataTable';
import Map from '../../components/Map';
import { toLocalDatetime } from '../../../utils/helper';
import Submissions from '../../components/submissions';
import Wallet from '@/views/FS/components/wallets.vue';

export default {
  name: 'organization',
  components: { Submissions, Map, Show,Wallet },
  data() {
    return {
      center: { lat: 30.033333, lng: 31.233334 },
    };
  },
  mounted() {
    this.init();
  },
  computed: {
    educationType: function () {
      if (this.$store.state.organization.organization && this.$store.state.organization.organization.education_type) {
        return this.$store.state.organization.organization.education_type;
      }
    },
  },
  methods: {
    diActive() {
      this.$confirm(this.$t('Global.ensureBeforeRequest'), `${this.$t('Global.warning')}`, {
        confirmButtonText: `${this.$t('Global.accept')}`,
        cancelButtonText: `${this.$t('Global.cancel')}`,
        type: 'warning',
      }).then(() => {
        this.$store.dispatch('organization/delete', { id: this.$route.params.id, query: null }).then(() => {
          this.init();
          this.$notify({
            type: 'success',
            message: `${this.$t('Global.successMessage')}`,
          });
        });
      });
    },
    init() {
      this.$store
        .dispatch('organization/organization', {
          id: this.$route.params.id ? this.$route.params.id : null,
          query: {
            system: 2,
          },
        })
        .then(() => {
          let location = this.$store.getters['organization/organizationLocation'][0];
          if (location) {
            this.center = {
              lat: location.latitude,
              lng: location.longitude,
            };
          }
          this.$store.commit('SET_PATH_TITLE', this.$store.getters['organization/name']);
        });
    },
    Refresh(query) {
      this.query = query;
      this.$store.dispatch('submission/submissions', { query: query });
    },
    DateFormat(date) {
      return toLocalDatetime(date, `${this.$i18n.locale == 'ar' ? 'ar' : 'en'}`);
    },
    show(id) {
      this.$router.push(`/school/submissions/submission/${id}`);
    },
  },
  destroyed() {
    this.$store.commit('SET_PATH_TITLE', null);
  },
};
</script>

<style scoped></style>
