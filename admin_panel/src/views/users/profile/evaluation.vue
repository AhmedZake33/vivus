<template>
  <CRow>
    <CCol id="print" col="12" lg="12" sm="12" v-if="hasPermission('show_users') || Auth.id == $route.params.id">
      <DataTable
        :items="$store.getters['user/questions']"
        @Refresh="Refresh"
        hidden_reset
        :loading="$store.getters['user/questionsLoad']"
        :name="`${$t('evaluation.evaluations_member_items') + selectedUser}`"
        hidden_pagination
        icon="el-icon-question"
        :team_id="team"
        :user_id="user_id"
        @reset="reset"
        hidden_action
      >
        <template #print-option>
          <i :class="$store.getters['user/questionsLoad'] ? 'disabledAll' : ''" class="el-icon-printer mr-2 pointer print_hide float-left" style="font-size: 17px" @click="print('print', title)"></i>
          <CBadge color="success" style="padding: 5px;" v-if="$store.getters['user/statistic']">{{`${$t('Global.evaluation')} ${$store.getters['user/statistic'].ratio}% `}}</CBadge>
        </template>
        <template #filter_table>
          <CCol col="12" sm="4" class="print_hide">
            <el-select :no-data-text="$t('Global.nodata')" v-model="team" ref="team" filterable :placeholder="$t('Global.selectTeam')" style="width: 100%">
              <el-option v-for="item in $store.getters['user/teams']" :key="item.id" :label="item.name" :value="item.id">
                <span style="float: right; color: #8492a6; font-size: 13px">
                  {{ item.name }}
                  <i class="el-icon-user-solid"></i>
                </span>
              </el-option>
              <template #prefix>
                <i class="el-icon-data-board" :dir="$i18n.locale === 'ar' ? 'rtl' : ''" style="font-size: 17px; line-height: 2.2; color: black; text-align: initial"></i>
              </template>
              <template #empty>
                <div class="text-center" style="padding: 10px; font-weight: bold">
                  {{ $t('Global.nodata') }}
                </div>
              </template>
            </el-select>
          </CCol>
          <CCol col="12" sm="4" class="print_hide">
            <el-select :disabled="memDisabled" ref="member_id" :placeholder="$t('Global.user')" :no-data-text="$t('Global.nodata')" style="width: 100%" v-model="user_id" filterable>
              <el-option v-for="user in $store.getters['user/members']" :key="user.id" :label="user.ar_name" :value="user.id">
                <span style="float: right; color: #8492a6; font-size: 13px">
                  {{ user.ar_name }}
                  <i class="el-icon-user-solid"></i>
                </span>
              </el-option>
              <template #empty>
                <div class="text-center" style="padding: 10px; font-weight: bold">
                  {{ $t('Global.nodata') }}
                </div>
              </template>
            </el-select>
          </CCol>
        </template>
        <template #cols>
          <!--          <el-table-column prop="id" label="#" width="65" sortable></el-table-column>-->
          <el-table-column prop="title" :label="$t('Global.name')">
            <template slot-scope="scope">
              {{ scope.row.title }}
              <!-- <CBadge color="warning">{{ scope.row.answer }}</CBadge> -->
            </template>
          </el-table-column>
          <el-table-column prop="answer" :label="$t('Global.answer')">
            <template slot-scope="scope">
              <div class="in_same_line">
                <el-rate
                  v-if="scope.row.answer && scope.row.group != 4"
                  :max="scope.row.group === 1 ? 4 : 3"
                  :value="scope.row.value ? ([1, 9, 10, 8, 6].includes(scope.row.group) ? scope.row.value : 4 - scope.row.value) : '-'"
                  disabled
                  show-score
                  text-color="#ff9900"
                  :score-template="scope.row.answer ? scope.row.answer : '-'"
                >
                </el-rate>
                <span v-if="scope.row.group == 4">
                  {{ scope.row.comment ? scope.row.comment : '' }}
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column width="120" prop="answer" :label="$t('Global.score')">
            <template slot-scope="scope">
              <span v-if="scope.row.group === 1">{{ scope.row.answer ? Math.ceil((scope.row.value / 4) * 100) + '%' : '-' }}</span>
              <span v-if="[9, 10, 8].includes(scope.row.group)">{{ scope.row.answer ? Math.ceil((scope.row.value / 3) * 100) + '%' : '-' }}</span>
              <span v-if="scope.row.group === 6">{{ scope.row.answer ? Math.ceil(((4 - scope.row.value) / 3) * 100) + '%' : '-' }}</span>
            </template>
          </el-table-column>
        </template>
      </DataTable>
    </CCol>
  </CRow>
</template>

<script>
import DataTable from '../../components/DataTable';
import { toLocalDatetime } from '../../../utils/helper';
import Cookies from 'js-cookie';
export default {
  name: 'evaluation',
  components: { DataTable },
  data() {
    return {
      team: null,
      memDisabled: true,
      user_id: null,
      Auth: JSON.parse(Cookies.get('user')),
    };
  },
  watch: {
    team: function (val, newVal) {
      if (newVal) {
        this.user_id = null;
      }
      this.team = val;
      if (val) {
        this.$refs.team.blur();
        this.memDisabled = false;
      } else {
        this.memDisabled = true;
      }
    },
    user_id: function (val) {
      this.user_id = val;
      if (val) {
        this.memDisabled = false;
        this.$refs.team.blur();
      } else {
        this.memDisabled = true;
      }
    },
  },
  methods: {
    reset() {
      this.team = null;
    },
    DateFormat(date) {
      return toLocalDatetime(date, `${this.$i18n.locale == 'ar' ? 'ar' : 'en'}`);
    },
    Refresh(query, id = this.$route.params.id) {
      this.$store.dispatch('user/questions', {
          id: id,
          query: query,
        })
        .then(() => {
          if (this.$route.params.team_id) {
            this.team = this.team ? this.team : Number(this.$route.params.team_id);
          } else {
            this.team = this.team ? this.team : this.$store.getters['user/teams'] ? this.$store.getters['user/teams'][0].id : null;
          }
          if (this.$store.getters['user/members']) {
            this.user_id = this.user_id ? this.user_id : this.$store.getters['user/members'][0] ? this.$store.getters['user/members'][0].id : null;
          }
        });
    },
  },
  computed: {
    title: function () {
      return `${this.$t('Global.evaluation_visit') + '(' + this.visit.name + ')'}<br>${this.$t('Global.memberName') + ' ' + this.selectedUser} ${this.$t('Global.evaluateFrom') + ' (' + this.evaluateFrom.ar_name + ')'}`;
    },
    visit: function () {
      if (this.team && this.$store.getters['user/teams']) {
        return this.$store.getters['user/teams'].find(visit => visit.id == this.team);
      }
    },
    evaluateFrom: function () {
      if (this.user_id && this.$store.getters['user/members']) {
        return this.$store.getters['user/members'].find(member => member.id == this.user_id);
      }
    },
    selectedUser: function () {
      if (this.$store.state.user.selectedUser) {
        return this.$store.state.user.selectedUser.ar_name ? '( ' + this.$store.state.user.selectedUser.ar_name + ' )' : '';
      } else {
        return '';
      }
    },
  },
};
</script>

<style lang="scss">
.custom_float {
  float: right !important;
}
</style>
