<template>
  <CRow class="mb-3">
    <CCol col="12" sm="12">
      <el-collapse v-model="activeName" accordion class="custom_collapse custom_collapse_docs">
        <el-collapse-item :title="$t(`Global.Interact`)">
          <template slot="title">
            <CCardHeader>
              <div :class="$i18n.locale === 'ar' ? 'card-header-actions' : 'ml-2 mr-2'" style="display: inline-block"><i class="el-icon-data-analysis ml-2"></i>{{ $t(`Global.Interact`) }}</div>
            </CCardHeader>
          </template>
            <div class="mainStatistics">
              <el-select class="w-50" :no-data-text="$t('Global.nodata')" v-model="year" filterable :placeholder="$t('Global.selectYear')" style="width: 100%" ref="year">
                <el-option :label="$t('Global.year')" value="3">
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ $t('Global.year') }}</span>
                </el-option>
                <el-option :label="$t('Global.month')" value="2">
                  <CBadge style="float: left; margin-top: 5px" color="info"> ({{ $t('Global.lastMonth') }}) 24 </CBadge>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ $t('Global.month') }}</span>
                </el-option>
                <el-option :label="$t('Global.day')" value="1">
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ $t('Global.day') }}</span>
                </el-option>
                <template #prefix>
                  <i class="el-icon-time" :dir="$i18n.locale === 'ar' ? 'rtl' : ''" style="font-size: 17px; line-height: 2.2; color: black; text-align: initial"></i>
                </template>
                <template #empty>
                  <div class="text-center" style="padding: 10px; font-weight: bold">
                    {{ $t('Global.nodata') }}
                  </div>
                </template>
              </el-select>

              <!-- <div :class="`${option === 2 ? 'switch_view ml-2' : 'active switch_view ml-3'}`" style="display: inline-flex">
                <span :class="`${option === 3 ? `${$i18n.locale === 'en' ? 'h6 mr-3' : 'h6 ml-3'}` : `${$i18n.locale === 'en' ? 'active h6  mr-2' : 'active h6  ml-2'}`}`" style="cursor: pointer; margin: 0 0" @click="option = 3">{{ $t('Global.year') }}</span>
                <span :class="`${option === 2 ? 'active h6' : 'h6'}`" style="cursor: pointer; margin: 0 0" @click="option = 2">
                  <CBadge style="float: left; margin-top: 5px" color="info"> ({{ $t('Global.lastMonth') }}) 24 </CBadge>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ $t('Global.month') }}</span>
                </span>
                <span :class="`${option === 1 ? 'active h6' : 'h6'}`" style="cursor: pointer; margin: 0 0" @click="option = 1">{{ $t('Global.day') }}</span>
              </div> -->
            </div>
            <CChartLine style="width: 80%; margin: auto auto" class="decision-activities" v-loading="$store.getters['statistics/usersActivitiesLoad']" :datasets="$store.getters['statistics/userActivitiesDataSet']" :labels="customLabel" />
        </el-collapse-item>
      </el-collapse>
    </CCol>
  </CRow>
</template>

<script>
import { CChartLine } from '@coreui/vue-chartjs';

export default {
  name: 'activity',
  components: { CChartLine },
  data() {
    return {
      option: 1,
      activeName: '1',
      year: '1',
    };
  },
  props: {
    user_id: Number,
  },
  watch: {
    year: function () {
      this.$store.dispatch('statistics/setUsersActivities', { query: { user_id: this.user_id, year: this.year } });
    },
  },
  computed: {
    customLabel: function () {
      if (this.$store.getters['statistics/userActivitiesLabel']) {
        return this.$store.getters['statistics/userActivitiesLabel'];
      }
    },
  },
  mounted() {
    this.$store.dispatch('statistics/setUsersActivities', { query: { user_id: this.user_id } });
  },
};
</script>

<style lang="scss" scoped>
.hide_border {
  border: 0;
}

.el-collapse-item__header {
  .card-header {
    order: 4;
  }

  .el-collapse-item__arrow {
    order: 1;
  }
}
@-moz-document url-prefix() {
  .font_12 {
    font-size: 12px !important;
  }
}
</style>
