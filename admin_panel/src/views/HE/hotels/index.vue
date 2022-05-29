<template>
  <DataTable :items="$store.getters['hotel/hotels']" @Refresh="Refresh" :loading="$store.getters['hotel/hotelsLoad']" :name="$t('hotels.hotels')" :total="$store.getters['hotel/totalHotels']" icon="el-icon-s-shop" @show="show" v-if="hasPermission('show_hotels')" permission="'admin_hotels'">
    <template #action_table>
      <template v-if="$store.state.user.allowHr || hasPermission('admin_system')">
        <div class="item" v-if="hasPermission('edit_hotels')" @click="$router.push(`/higher/hotel/new/add`)">
          <i class="el-icon-message"></i>
          {{ $t('Global.addHotel') }}
        </div>
      </template>
    </template>
    <template #cols>
      <el-table-column prop="id" sortable width="65" label="#"></el-table-column>
      <el-table-column prop="name" :label="$t('Global.name')" sortable>
        <template slot-scope="scope">
          <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 100%">
            {{ scope.row.name }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="email" :label="$t('Global.email')" sortable></el-table-column>
      <el-table-column prop="mobile" :label="$t('Global.phone')"></el-table-column>
      <el-table-column prop="level" :label="$t('Global.hotel_level')">
        <template slot-scope="scope">
          <el-rate :max="scope.row.level" :value="scope.row.level" disabled></el-rate>
        </template>
      </el-table-column>
      <el-table-column prop="removed" width="60" :label="$t('users.status')" v-if="hasPermission('admin_hotels')">
        <template slot-scope="scope">
          <CBadge :color="getBadge(scope.row.removed)">
            <span v-if="scope.row.removed == 0">{{ $t('Global.active') }}</span>
            <span v-if="scope.row.removed == 1">{{ $t('Global.remove') }}</span>
          </CBadge>
        </template>
      </el-table-column>
      <el-table-column prop="" label=" ">
        <template slot-scope="scope">
          <div :style="$i18n.locale === 'ar' ? 'text-align:left' : 'float: right;'">
            <router-link :to="show(scope.row.id)">
              <i class="el-icon-view table-action-item"></i>
            </router-link>
          </div>
        </template>
      </el-table-column>
    </template>
  </DataTable>
</template>

<script>
import DataTable from '../../components/DataTable';
import * as helper from '../../../utils/helper';
import Cookies from 'js-cookie';

export default {
  name: 'hotels',
  components: { DataTable },
  methods: {
    Refresh(query) {
      this.$store.dispatch('hotel/hotels', { query: query });
    },
    getBadge(status) {
      switch (status) {
        case 0:
          return 'success';
        case 1:
          return 'danger';
        default:
          'primary';
      }
    },
    DateFormat(date) {
      return helper.toLocalDatetime(date, `${this.$i18n.locale == 'ar' ? 'ar' : 'en'}`);
    },
    show(id) {
      return `/higher/hotel/${id}`;
    },
  },
};
</script>

<style scoped></style>
