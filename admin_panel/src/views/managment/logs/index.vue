<template>
  <DataTable
    hidden_action
    :items="$store.getters['logs/logs']"
    @Refresh="Refresh"
    :loading="$store.getters['logs/logsLoad']"
    :name="$t('manage.logs')"
    :total="$store.getters['logs/totalLogs']"
    @reset="reset"
    :type_id="type"
    :user="user_id"
    :range="date ? date.toString() : ''"
    fontIcon="cil-speedometer"
    v-if="hasPermission('access_logs')"
  >
    <template #filter_table>
      <div class="ml-2 mr-2 mb-2 fullWidth">
        <el-date-picker clearable v-model="date" type="daterange" format="yyyy-MM-d" value-format="yyyy-MM-d" unlink-panels :start-placeholder="$t('Global.from')" :end-placeholder="$t('Global.to')"></el-date-picker>
      </div>
      <div class="ml-2 mr-2 mb-2 fullWidth" style="min-width: 300px">
        <el-select clearable :placeholder="$t('Global.user')" style="width: 100%" v-model="user_id" filterable remote reserve-keyword :remote-method="search" :loading="$store.getters['archive/usersLoad']">
          <el-option v-for="user in $store.getters['archive/users']" :key="user.id" :label="user.ar_name" :value="user.id">
            <span style="float: right; color: #8492a6; font-size: 13px">
              {{ user.ar_name }}
              <i class="el-icon-user-solid"></i>
            </span>
          </el-option>
          <template #empty>
            <div class="text-center" style="padding: 10px; font-weight: bold">{{ $t('Global.nodata') }}</div>
          </template>
        </el-select>
      </div>
      <div class="ml-2 mr-2 mb-2 fullWidth">
        <el-select clearable filterable :no-data-text="$t('Global.nodata')" v-model="type" :placeholder="$t('Global.gender_type')" style="width: 100%">
          <el-option v-for="(item, i) in $store.state.logs.actions" :key="i" :label="item" :value="item">
            <span style="float: right; color: #8492a6; font-size: 13px">
              {{ item }}
            </span>
          </el-option>
          <template #empty>
            <div class="text-center" style="padding: 10px; font-weight: bold">
              {{ $t('Global.nodata') }}
            </div>
          </template>
        </el-select>
      </div>
    </template>
    <template #cols>
      <el-table-column prop="id" width="100" label="#" sortable></el-table-column>
      <el-table-column prop="" :label="$t('Global.By')">
        <template slot-scope="scope">
          <router-link :to="{ path: `/users/${scope.row.user_id}`.toString() }">
            <i class="el-icon-user"></i>
            {{ scope.row.ar_name }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="action" width="280" :label="$t('Global.logtype')">
        <template slot-scope="scope">
          {{ capital(scope.row.action) }}
        </template>
      </el-table-column>
      <el-table-column prop="created_at" :label="$t('Global.Date')" sortable>
        <template slot-scope="scope">
          <span style="font-size: 12px">{{ toLocalDatetime(scope.row.created_at, `${$i18n.locale == 'ar' ? 'ar' : 'en'}`, true) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="url" :label="$t(`Global.showCurrentLog`)">
        <template slot-scope="scope">
          <router-link v-if="scope.row.url" :to="scope.row.url"> {{ $t('Global.goToPage') }}</router-link>
        </template>
      </el-table-column>
      <el-table-column prop="" label=" ">
        <template slot-scope="scope">
          <div :style="$i18n.locale === 'ar' ? 'text-align:left' : 'float: right;'">
            <router-link :to="{ path: `/management/log/${scope.row.id}`.toString() }">
              <el-button type="primary" size="mini" class="xs_mini" icon="el-icon-view" circle></el-button>
            </router-link>
          </div>
        </template>
      </el-table-column>
    </template>
  </DataTable>
</template>

<script>
import DataTable from '../../components/DataTable';
import { camelCase } from '../../../utils/helper';
export default {
  name: 'Services',
  components: { DataTable },
  data() {
    return { user_id: null, date: null, type: null };
  },
  mounted() {
    this.users();
  },
  methods: {
    reset() {
      this.user_id = null;
      this.date = null;
      this.type = null;
    },
    users(search = '', limit = 10) {
      this.$store.dispatch('archive/usersRoles', { query: { search_text: search, limit: limit } });
    },
    Refresh(query) {
      let newQuery = query;
      if (this.$route.params.type == 1) {
        query.user_id = this.$route.params.id;
        newQuery = { ...query };
      } else if (this.$route.params.type == 2) {
        newQuery = { submission: this.$route.params.id, ...query };
      }
      this.$store.dispatch('logs/getLogs', { query: newQuery });
    },
    search(query) {
      this.users(query);
    },
    capital(str) {
      return camelCase(str.replace('\\', ' '));
    },
  },
};
</script>

<style scoped></style>
