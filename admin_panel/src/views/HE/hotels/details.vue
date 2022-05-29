<template>
  <div v-has-permissions="'access_hotels'">
    <Show :loading="$store.getters['hotel/reservationLoad']" icon="el-icon-office-building" :items="$store.getters['hotel/reservation_info']" @init="init" :name="$t('Global.general_info')">
      <template #show_status>
        <el-button v-if="getAllRate($store.getters['hotel/questions'])" class="no_pointer" type="success" size="mini" round
          ><span style="margin-right: 5px; margin-left: 5px">{{ $t('Global.allrate') }}</span
          >{{ +getAllRate($store.getters['hotel/questions']) + '%' }}</el-button
        >
      </template>
      <template #bottom_other_data>
        <tr v-if="$store.getters['hotel/reservation']">
          <th scope="row" width="20%">{{ $t('Global.city') }}</th>
          <td width="80%">
            <span>
              {{ $store.state.hotel.reservation_info.city ? $store.state.hotel.reservation_info.city.name : '' }}
            </span>
          </td>
        </tr>
        <tr v-if="$store.getters['hotel/reservation']">
          <th scope="row" width="20%">{{ $t('Global.government') }}</th>
          <td width="80%">
            <span>
              {{ $store.state.hotel.reservation_info.government ? $store.state.hotel.reservation_info.government.name : '' }}
            </span>
          </td>
        </tr>
        <tr v-if="$store.getters['hotel/reservation'] && $store.getters['hotel/reservation'].team">
          <th scope="row" width="20%">{{ $t('Global.team') }}</th>
          <td width="80%">
            <div class="teams_state d-md-flex flex-wrap">
              <router-link class="custom-link" slot="reference" :to="{ path: `/higher/team/${$store.getters['hotel/reservation'].team.id}` }">
                {{ $store.getters['hotel/reservation'].team.name }}
              </router-link>
            </div>
          </td>
        </tr>
        <tr v-if="$store.getters['hotel/reservation'] && $store.getters['hotel/reservation'].hotel">
          <th scope="row" width="20%">{{ $t('Global.hotel') }}</th>
          <td width="80%">
            <div class="teams_state d-md-flex flex-wrap">
              <router-link class="custom-link" slot="reference" :to="{ path: `/higher/hotel/${$store.getters['hotel/reservation'].hotel.id}` }">
                {{ $store.getters['hotel/reservation'].hotel.name }}
              </router-link>
            </div>
          </td>
        </tr>
        <tr v-if="$store.getters['hotel/reservation'] && $store.getters['hotel/reservation'].topic">
          <th scope="row" width="20%">{{ $t('Global.topic') }}</th>
          <td width="80%">
            <div class="teams_state d-md-flex flex-wrap" v-html="ntBr($store.getters['hotel/reservation'].topic)"></div>
          </td>
        </tr>
      </template>
    </Show>
    <CCard v-loading="$store.getters['hotel/reservationLoad']" v-if="$store.getters['hotel/reservation']">
      <CCardHeader>
        <div :class="$i18n.locale === 'ar' ? 'card-header-actions' : ''" style="display: inline-block; font-weight: bold">
          {{ $t('Global.reservation_members') }}
        </div>
        <div :class="$i18n.locale === 'en' ? 'card-header-actions' : ''" style="display: flex; justify-content: flex-end; align-items: center">
          <CDropdown color="success" placement="bottom-end" size="sm" class="customDrop">
            <template #toggler-content>
              <CIcon name="cil-settings" />
              <span style="font-weight: bold">{{ $t('Global.action') }}</span>
            </template>
            <div class="item" v-if="hasPermission('edit_hotels')" @click="openServiceDialog">
              {{ $t('Global.addService') }}
            </div>
          </CDropdown>
        </div>
      </CCardHeader>
      <CCardBody>
        <el-table
          v-if="$store.getters['hotel/reservation'] && $store.getters['hotel/reservation'].services && $store.getters['hotel/reservation'].services[0]"
          :data="$store.getters['hotel/reservation'].services"
          style="width: 100%"
          :header-cell-class-name="$i18n.locale === 'ar' ? 'text-right' : ''"
          :cell-class-name="$i18n.locale === 'ar' ? 'text-right' : ''"
        >
          <el-table-column prop="user_name" :label="$t('Global.name')">
            <template slot-scope="scope">
              <el-tooltip effect="dark" :content="scope.row.user_name" placement="top-start">
                <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 100%">
                  <router-link :to="{ path: `/users/${scope.row.user_id}` }">{{ scope.row.user_name }}</router-link>
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="room_count" :label="$t('Global.roomCount')"></el-table-column>
          <el-table-column prop="service" :label="$t('Global.roomType')"></el-table-column>
          <el-table-column prop="starts" :label="$t('Global.arrivalDate')">
            <template slot-scope="scope">
              <span>{{ toLocalDatetime(scope.row.starts, `${$i18n.locale == 'ar' ? 'ar' : 'en'}`) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="ends" :label="$t('Global.departureDate')">
            <template slot-scope="scope">
              <span>{{ toLocalDatetime(scope.row.ends, `${$i18n.locale == 'ar' ? 'ar' : 'en'}`) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="stay_type" :label="$t('Global.stayType')">
            <template slot-scope="scope">
              {{ scope.row.stay_type ? $t(`Global.stayType${scope.row.stay_type}`) : '_' }}
            </template>
          </el-table-column>
          <el-table-column prop="national_id" :label="$t('Global.n_id')"></el-table-column>
          <el-table-column prop="" label=" ">
            <template slot-scope="scope">
              <template v-if="$store.state.user.allowHr || hasPermission('admin_system')">
                <div :style="$i18n.locale === 'ar' ? 'text-align:left' : 'float: right;'">
                  <i class="el-icon-delete table-action-item" @click="deleteService(scope.row.id)"></i>
                  <i class="el-icon-edit table-action-item" @click="openServiceDialog(scope.row)"></i>
                </div>
              </template>
            </template>
          </el-table-column>
        </el-table>
        <div v-else class="d-flex justify-content-center">{{ $t('Global.nodata') }}</div>
      </CCardBody>
    </CCard>
    <DataTable :items="$store.getters['hotel/questions']" @Refresh="Refresh" :loading="$store.getters['hotel/questionsLoad']" :name="$t('evaluation.evaluations_hotel_items')" :total="$store.getters['hotel/totalQuestions']" icon="el-icon-question" hidden_action>
      <template #cols>
        <el-table-column prop="id" label="#" width="65" sortable></el-table-column>
        <el-table-column prop="title" :label="$t('Global.name')"> </el-table-column>
        <el-table-column prop="value" :label="$t('Global.rate')" sortable>
          <template slot-scope="scope">
            <el-rate :max="3" :value="4 - scope.row.value" disabled show-score text-color="#ff9900" :score-template="scope.row.answer"> </el-rate>
          </template>
        </el-table-column>
        <el-table-column width="120" prop="value" :label="$t('Global.score')" sortable>
          <template slot-scope="scope">
            <span>{{ scope.row.answer ? Math.ceil(((4 - scope.row.value) / 3) * 100) + '%' : '-' }}</span>
          </template>
        </el-table-column>
      </template>
    </DataTable>
    <el-dialog :title="$t('route.services')" :visible.sync="service_dialog" class="p-0" width="60%" v-if="$store.getters['hotel/reservation'] && $store.getters['hotel/reservation'].team">
      <CCardBody dir="rtl" style="text-align: initial" class="p-0">
        <el-form label-position="top" :model="ruleForm" status-icon size="large" ref="ruleForm" label-width="120px" class="demo-ruleForm">
          <CRow>
            <CCol sm="12">
              <el-form-item :rules="validation(null, 1)" prop="employee" :label="$t('Global.member')">
                <el-select filterable style="width: 100%" v-model="ruleForm.employee" :placeholder="$t('Global.member')">
                  <el-option v-if="$store.getters['hotel/reservation'].team" v-for="member in $store.getters['hotel/reservation'].team.members" :key="member.id" :label="member.ar_name" :value="member.id">
                    <span style="float: right; color: #8492a6; font-size: 13px">
                      {{ member.ar_name }}
                    </span>
                  </el-option>
                </el-select>
              </el-form-item>
            </CCol>
            <CCol sm="4">
              <el-form-item :rules="validation(null, 1)" :label="$t('Global.roomCount')" prop="room_count">
                <el-select filterable style="width: 100%" v-model="ruleForm.room_count" :placeholder="$t('Global.roomCount')">
                  <el-option v-for="item in 10" :key="item" :label="item" :value="item">
                    <span style="float: right; color: #8492a6; font-size: 13px">
                      {{ item }}
                    </span>
                  </el-option>
                </el-select>
              </el-form-item>
            </CCol>
            <CCol sm="4">
              <el-form-item :rules="validation(null, 1)" :label="$t('Global.roomType')" prop="service_type">
                <el-select filterable :no-data-text="$t('Global.nodata')" style="width: 100%" v-model="ruleForm.service_type" :placeholder="$t('Global.roomType')">
                  <el-option v-for="item in $store.getters['hotel/services']" :key="item.id" :label="item.name" :value="item.id">
                    <span style="float: right; color: #8492a6; font-size: 13px">
                      {{ item.name }}
                    </span>
                  </el-option>
                </el-select>
              </el-form-item>
            </CCol>
            <CCol sm="4">
              <el-form-item :rules="validation(null, 1)" :label="$t('Global.stayType')" prop="stay_type">
                <el-select filterable :no-data-text="$t('Global.nodata')" style="width: 100%" v-model="ruleForm.stay_type" :placeholder="$t('Global.stayType')">
                  <el-option v-for="item in 4" :key="item" :label="$t(`Global.stayType${item}`)" :value="item">
                    <span style="float: right; color: #8492a6; font-size: 13px">
                      {{ $t(`Global.stayType${item}`) }}
                    </span>
                  </el-option>
                  <template #empty>
                    <div class="text-center" style="padding: 10px; font-weight: bold">
                      {{ $t('Global.nodata') }}
                    </div>
                  </template>
                </el-select>
              </el-form-item>
            </CCol>
            <CCol sm="6">
              <el-form-item :rules="validation(null, 0)" :label="$t('Global.arrivalDate')" prop="starts">
                <el-date-picker clearable style="width: 100%" value-format="yyyy-MM-d" v-model="ruleForm.starts" type="date" :placeholder="$t('Global.arrivalDate')"> </el-date-picker>
              </el-form-item>
            </CCol>
            <CCol sm="6">
              <el-form-item :rules="validation(null, 0)" :label="$t('Global.departureDate')" prop="ends">
                <el-date-picker clearable style="width: 100%" value-format="yyyy-MM-d" v-model="ruleForm.ends" type="date" :placeholder="$t('Global.departureDate')"> </el-date-picker>
              </el-form-item>
            </CCol>
          </CRow>
        </el-form>
      </CCardBody>
      <span slot="footer" class="dialog-footer">
        <el-button @click="saveService('ruleForm')" @keyup.enter="saveService('ruleForm')" type="primary">{{ $t('Global.add') }}</el-button>
        <el-button @click="service_dialog = false" style="margin: 10px">{{ $t('Global.cancel') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Show from '../../components/Show';
import DataTable from '../../components/DataTable';

export default {
  name: 'reservation',
  components: { DataTable, Show },
  data() {
    return {
      service_dialog: false,
      service_id: null,
      ruleForm: {
        employee: null,
        room_count: null,
        service_type: null,
        stay_type: null,
        starts: null,
        ends: null,
      },
    };
  },
  methods: {
    openDialog() {
      this.dialog = true;
    },
    init() {
      this.$store.dispatch('hotel/reservation', this.$route.params.id);
    },
    Refresh(query) {
      this.$store.dispatch('hotel/questions', {
        id: this.$route.params.id,
        query: query,
      });
    },
    save() {},
    getAllRate(value) {
      let values = [];
      this.$store.getters['hotel/questions'].forEach(element => {
        values.push(element.value);
      });
      var sum = values
        ? values.reduce(function (a, b) {
            return a + b;
          }, 0)
        : 0;
      return Math.ceil((sum / (this.$store.getters['hotel/questions'].length * 3)) * 100);
    },
    openServiceDialog(service) {
      if (service) {
        this.service_id = service.id;
        this.ruleForm.employee = service.user_id;
        this.ruleForm.room_count = service.room_count;
        this.ruleForm.stay_type = service.stay_type;
        this.ruleForm.service_type = service.service_type;
        this.ruleForm.starts = service.starts;
        this.ruleForm.ends = service.ends;
      }
      this.service_dialog = true;
    },
    saveService(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$store.dispatch('hotel/saveService', { id: this.service_id ? `/${this.service_id}` : '', query: { ...this.ruleForm, hotel_reservation_id: this.$route.params.id } }).then(_ => {
            this.service_dialog = false;
            this.init();
          });
        }
      });
    },
    deleteService(id) {
      this.$confirm(`${this.$t('Global.ensureBeforeRequest')}`, {
        confirmButtonText: `${this.$t('Global.accept')}`,
        cancelButtonText: `${this.$t('Global.cancel')}`,
        type: 'success',
      }).then(_ => {
        this.$store
          .dispatch('hotel/deleteService', id)
          .then(_ => {
            this.$notify.success({
              message: `${this.$t('Global.successMessage')}`,
            });
            this.init();
          })
          .catch(_ => {});
      });

      //   this.dangerModal = false;
    },
  },
};
</script>

<style lang="scss">
.no_pointer {
  cursor: context-menu !important;
  opacity: 1;
  &:hover,
  &:focus {
    background: #67c23a !important;
    border-color: #67c23a !important;
    color: #fff !important;
    opacity: 1;
  }
}
</style>
