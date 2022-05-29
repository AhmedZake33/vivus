<template>
  <div v-if="hasPermission('access_hotels')">
    <Show :loading="$store.getters['hotel/hotelLoad']" icon="el-icon-office-building" :items="$store.getters['hotel/hotel']" @init="init" :name="$store.getters['hotel/name']" :status="$store.getters['hotel/status']" except="reservations" v-has-permissions="'show_hotels'">
      <template #show_action>
        <a class="mx-1" :href="`${baseUrl}hotel/document/${$route.params.id}`" target="_blank">
          <fa-icon :icon="['fas', 'file-pdf']" size="md"/>
        </a>
        <template v-if="$store.state.user.allowHr || hasPermission('admin_system')">
        <router-link :to="{ path: `/higher/hotel/edit/${$route.params.id}`.toString() }" v-if="hasPermission('edit_hotels')">
          <CIcon name="cil-pencil" color="bg-primary"></CIcon>
        </router-link>
        </template>
      </template>
      <template #bottom_other_data>
        <tr v-if="$store.getters['hotel/hotel']">
          <th scope="row" width="20%">{{ $t('Global.city') }}</th>
          <td width="80%">
            <span>
              {{ $store.state.hotel.hotel.city ? $store.state.hotel.hotel.city.name : '' }}
            </span>
          </td>
        </tr>
        <tr v-if="$store.getters['hotel/hotel']">
          <th scope="row" width="20%">{{ $t('Global.government') }}</th>
          <td width="80%">
            <span>
              {{ $store.state.hotel.hotel.government ? $store.state.hotel.hotel.government.name : '' }}
            </span>
          </td>
        </tr>
        <tr v-if="$store.getters['hotel/hotel']">
          <th scope="row" width="20%">{{ $t('Global.Administrator') }}</th>
          <td width="80%">
            <span>
              {{ $store.state.hotel.hotel.contact }}
            </span>
          </td>
        </tr>
        <tr v-if="$store.getters['hotel/hotel']">
          <th scope="row" width="20%">{{ $t('Global.hotelLevel') }}</th>
          <td width="80%">
            <span>
              <el-rate :max="$store.state.hotel.hotel.level" :value="$store.state.hotel.hotel.level" disabled></el-rate>
            </span>
          </td>
        </tr>
        <!--        <tr v-if="$store.getters['hotel/hotel']">-->
        <!--          <th scope="row" width="20%">{{ $t('Global.reservations') }}</th>-->
        <!--          <td width="80%">-->
        <!--            <span v-for="(reservation, i) in $store.state.hotel.hotel.reservations" style="margin: 5px" :key="i">-->
        <!--              <router-link :to="{ path: `/higher/hotel/reservation/${reservation.id}` }">-->
        <!--                {{ reservation.name + ',' }}-->
        <!--              </router-link>-->
        <!--            </span>-->
        <!--          </td>-->
        <!--        </tr>-->
      </template>
    </Show>

    <!-- <Show :loading="$store.getters['hotel/hotelLoad']" v-if="$store.getters['hotel/hotel']" icon="el-icon-data-analysis" :items="$store.getters['hotel/reservations']" :name="$t('Global.reservations')"></Show> -->
    <CCard v-loading="$store.getters['hotel/hotelLoad']" v-if="$store.getters['hotel/hotel']">
      <CCardHeader>
        <div :class="$i18n.locale === 'ar' ? 'card-header-actions' : ''" style="display: inline-block; font-weight: bold">
          {{ $t('Global.reservations') }}
        </div>
        <div :class="$i18n.locale === 'en' ? 'card-header-actions' : ''" style="display: flex; justify-content: flex-end; align-items: center">
          <!-- <CDropdown color="success" placement="bottom-end" size="sm" class="customDrop">
            <template #toggler-content>
              <CIcon name="cil-settings" />
              <span style="font-weight: bold">{{ $t('Global.action') }}</span>
            </template>
            <div class="item" v-if="hasPermission('edit_hotels')" @click="$router.push(`/higher/reservation/edit/${$route.params.id}`)">
              <i class="el-icon-message"></i>
              {{ $t('Global.add_reservation') }}
            </div>
          </CDropdown> -->
        </div>
      </CCardHeader>
      <CCardBody>
        <CRow v-if="$store.getters['hotel/hotel'] && $store.getters['hotel/reservations'][0]">
          <div class="d-flex flex-wrap m-1" v-for="reservation in $store.getters['hotel/reservations']">
            <div class="px-1 docs_header d-flex justify-content-center align-items-center">
              <span>
                <div>
                  <router-link :to="{ path: `/higher/hotel/reservation/${reservation.id}` }">
                    {{ reservation.name }}
                  </router-link>
                  <i class="el-icon-delete table-action-item" @click="deleteReservation(reservation.id)"></i>
                </div>
              </span>
            </div>
          </div>
        </CRow>
        <!-- <el-table v-if="$store.getters['hotel/hotel'] && $store.getters['hotel/reservations'][0]" :data="$store.getters['hotel/reservations']" style="width: 100%" :header-cell-class-name="$i18n.locale === 'ar' ? 'text-right' : ''" :cell-class-name="$i18n.locale === 'ar' ? 'text-right' : ''">
          <el-table-column prop="id" label="#" width="65" sortable></el-table-column>
          <el-table-column prop="name" :label="$t('Global.name')"></el-table-column>
          <el-table-column prop="" label=" ">
            <template slot-scope="scope">
              <div :style="$i18n.locale === 'ar' ? 'text-align:left' : 'float: right;'">
                <router-link :to="{ path: `/higher/hotel/reservation/${scope.row.id}` }">
                  <i class="el-icon-view table-action-item"></i>
                </router-link>
                <i  class="el-icon-delete table-action-item" @click="deleteReservation(scope.row.id)" ></i>
                
              </div>
            </template>
          </el-table-column>
        </el-table> -->
        <div v-else class="d-lg-flex">{{ $t('Global.nodata') }}</div>
      </CCardBody>
    </CCard>
    <Map :locations="$store.getters['hotel/hotelLocation']" :center="center" :zoom="parseInt('12')"></Map>
  </div>
</template>

<script>
import Show from '../../components/Show';
import Map from '../../components/Map';
export default {
  name: 'hotel',
  components: { Map, Show },
  data() {
    return {
      center: { lat: 30.033333, lng: 31.233334 },
      baseUrl: process.env.VUE_APP_BASE_URL,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.$store.dispatch('hotel/hotel', this.$route.params.id).then(() => {
        let location = this.$store.getters['hotel/hotelLocation'] ? this.$store.getters['hotel/hotelLocation'][0] : null;
        if (location) {
          this.center = {
            lat: location.latitude,
            lng: location.longitude,
          };
        }
      });
    },
    deleteReservation(id) {
      this.$confirm(`${this.$t('Global.ensureBeforeRequest')}`, {
        confirmButtonText: `${this.$t('Global.accept')}`,
        cancelButtonText: `${this.$t('Global.cancel')}`,
        type: 'success',
      }).then(_ => {
        this.$store
          .dispatch('hotel/deleteReservation', id)
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

<style></style>
