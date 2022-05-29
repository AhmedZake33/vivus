<template>
  <CRow>
    <CCol col="12" md="6" sm="12">
      <CCard>
        <CCardHeader class="card_header" :dir="$i18n.locale === 'ar' ? 'rtl' : ''">
          <div :class="$i18n.locale === 'ar' ? 'card-header-actions' : ''"><i class="el-icon-office-building"></i>{{ $t('Global.organizations') }}</div>
          <i class="el-icon-refresh" style="cursor: pointer" @click="refreshOrg"></i>
        </CCardHeader>
        <CCardBody>
          <div id="org"></div>
        </CCardBody>
      </CCard>
    </CCol>
    <CCol col="12" md="6" sm="12">
      <CCard>
        <CCardHeader class="card_header" :dir="$i18n.locale === 'ar' ? 'rtl' : ''">
          <div :class="$i18n.locale === 'ar' ? 'card-header-actions' : ''"><i class="el-icon-data-analysis"></i>{{ $t('Global.Decision') }}</div>

          <i class="el-icon-refresh" style="cursor: pointer" @click="refreshOrg"></i>
        </CCardHeader>
        <CCardBody>
          <CChartBar v-loading="$store.getters['statistics/nonAccreditationLoad']" :datasets="$store.getters['statistics/decisionsDataSet']" :labels="$store.getters['statistics/decisionsLabel']" :options="chartOptions" style="cursor: pointer" />
        </CCardBody>
      </CCard>
    </CCol>

    <CCol col="12" sm="12">
      <CCard>
        <CCardHeader class="card_header" :dir="$i18n.locale === 'ar' ? 'rtl' : ''">
          <div :class="$i18n.locale === 'ar' ? 'card-header-actions' : ''"><i class="el-icon-circle-check"></i>{{ $t('Global.Decision') }}</div>
          <i class="el-icon-refresh" style="cursor: pointer" @click="refreshDecisionsActivities"></i>
        </CCardHeader>
        <CCardBody>
          <CChartLine
            v-loading="$store.getters['statistics/nonDeAccreditationLoad']"
            style="width: 80%; margin: auto auto"
            class="decision-activities"
            :options="lineChartOptions"
            :datasets="$store.getters['statistics/nonAccreditationAccreditationDataSet']"
            :labels="$store.getters['statistics/nonAccreditationAccreditationLabel']"
          />
        </CCardBody>
      </CCard>
    </CCol>

    <CCol col="12" sm="12">
      <CCard>
        <CCardHeader class="card_header" :dir="$i18n.locale === 'ar' ? 'rtl' : ''">
          <div :class="$i18n.locale === 'ar' ? 'card-header-actions' : ''"><i class="el-icon-circle-check"></i>{{ $t('Global.userActivities') }}</div>
          <i class="el-icon-refresh" style="cursor: pointer" @click="refresh"></i>
          <a class="mx-1" :href="`${baseUrl}report/reportLastMonth`" target="_blank">
            <fa-icon :icon="['fas', 'file-pdf']" size="md"/>
            {{$t('Global.last_month_activities')}}
          </a>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol sm="6">
              <el-select class="mb-2" :no-data-text="$t('Global.nodata')" v-model="user" filterable :placeholder="$t('Global.selectUser')" style="width: 100%" ref="user">
                <el-option v-for="item in $store.getters['statistics/users']" :key="item.id" :label="item.ar_name" :value="item.id">
                  <CBadge style="float: left" color="info"> ({{ $t('Global.activate') }}) {{ item.count }} </CBadge>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ar_name }}</span>
                </el-option>
                <template #prefix>
                  <i class="el-icon-user-solid" :dir="$i18n.locale === 'ar' ? 'rtl' : ''" style="font-size: 17px; line-height: 2.2; color: black; text-align: initial"></i>
                </template>
                <template #empty>
                  <div class="text-center" style="padding: 10px; font-weight: bold">
                    {{ $t('Global.nodata') }}
                  </div>
                </template>
              </el-select>
            </CCol>
            <CCol sm="6">
              <el-select :no-data-text="$t('Global.nodata')" v-model="year" filterable :placeholder="$t('Global.selectYear')" style="width: 100%" ref="year">
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
            </CCol>
          </CRow>
          <CChartLine style="width: 80%; margin: auto auto" class="decision-activities" v-loading="$store.getters['statistics/usersActivitiesLoad']" :datasets="$store.getters['statistics/userActivitiesDataSet']" :labels="customLabel" />
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import { CChartBar, CChartLine, CChartPie } from '@coreui/vue-chartjs';

export default {
  name: 'DashboardCharts',
  components: {
    CChartPie,
    CChartBar,
    CChartLine,
  },
  props: {
    system: Number,
  },
  data() {
    return {
      saveId: null,
      baseUrl: process.env.VUE_APP_BASE_URL,
      selectedOrganization: null,
      selectedSubmission: null,
      selectedDecision: null,
      user: null,
      year: '1',
      cont: null,
    };
  },
  watch: {
    user: function (val) {
      this.$store.dispatch('statistics/setUsersActivities', {
        query: { user_id: val, year: this.year },
      });
      this.$refs.user.blur();
    },
    year: function (val) {
      this.$store.dispatch('statistics/setUsersActivities', {
        query: { user_id: this.user, year: val },
      });
      this.$refs.year.blur();
    },
    system: function (val) {
      this.$store.dispatch('statistics/setOrganization', { query: { system: val } }).then(() => {
        this.createPie(this.$store.getters['statistics/organizationsDataSet'][0].data);
      });
      this.$store.dispatch('statistics/setDecisions', { query: { system: val } });
      this.$store.dispatch('statistics/setDecisionsActivities', { query: { system: val } });
    },
  },
  mounted() {
    this.$store.dispatch('statistics/setOrganization', { query: { system: this.system } }).then(() => {
      this.createPie(this.$store.getters['statistics/organizationsDataSet'][0].data);
    });

    this.$store.dispatch('statistics/setDecisions', { query: { system: this.system } });
    this.$store.dispatch('statistics/setUsersActivities', { query: {} });
    this.$store.dispatch('statistics/setDecisionsActivities', { query: { system: this.system } });
  },
  methods: {
    getDate(label) {
      this.toLocalDatetime(label);
    },
    createPie(data) {
      let { am4core, am4charts, am4themes_animated, am4themes_dark } = this.$am4core();
      let container = am4core.create('org', am4core.Container);
      container.width = am4core.percent(100);
      container.height = am4core.percent(100);
      let chart = container.createChild(am4charts.PieChart);
      chart.data = data;
      var pieSeries = chart.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = 'count';
      pieSeries.dataFields.category = 'name';
      pieSeries.dataFields.id = 'id';
      container.logo.disabled = true;
      pieSeries.tooltip.label.textAlign = 'middle';
      pieSeries.slices.template.tooltipText = '{category}: {value}';
      pieSeries.slices.template.paddingLeft = -4;
      pieSeries.slices.template.adapter.add('fill', function (fill, target) {
        if (target.dataItem.properties.category === 'اخري') {
          return am4core.color('#ddd');
        } else {
          return fill;
        }
      });
      pieSeries.slices.template.events.on(
        'hit',
        function (ev) {
          if (this.saveId && this.saveId == ev.target.dataItem.id) {
            this.refreshOrg();
          } else {
            this.getStatisticsUpdateByOrganization(ev.target);
          }
          var series = ev.target.dataItem.component;
          series.slices.each(function (item) {
            if (item.dataItem.properties.category != 'اخري') {
              if (ev.target.dataItem.properties.category == 'اخري') {
                return;
              } else {
                if (item.isActive && item != ev.target) {
                  item.isActive = false;
                }
              }
            } else {
              if (ev.target.dataItem.properties.category == 'اخري') {
                item.isActive = false;
              }
            }
          });
        },
        this
      );

      pieSeries.labels.template.text = '[bold]{category}[/]: {value}';
      chart.rtl = true;
      pieSeries.alignLabels = false;
      pieSeries.slices.template.stroke = am4core.color('#fff');
      pieSeries.slices.template.strokeOpacity = 1;
      pieSeries.hiddenState.properties.opacity = 1;
      pieSeries.labels.template.paddingRight = -200;
      pieSeries.labels.template.radius = am4core.percent(20);
      pieSeries.labels.template.fontSize = 9;
      chart.radius = am4core.percent(70);
    },
    getStatisticsUpdateByOrganization(item) {
      if (item) {
        if (item.dataItem.properties.category != 'اخري') {
          let id = item.dataItem.id;
          this.$store.dispatch('statistics/setDecisions', { query: { system: this.system, parent_id: id }, backgroundColor: item.fill.hex }).then(() => {
            this.saveId = item.dataItem.id;
          });
        }
      }
    },
    refreshOrg() {
      this.$store.dispatch('statistics/setOrganization', { query: { system: this.system } }).then(() => {
        this.createPie(this.$store.getters['statistics/organizationsDataSet'][0].data);
      });
      this.$store.dispatch('statistics/setDecisions', { organization_id: '', backgroundColor: 'rgba(6,198,246,0.9)' });
    },
    refreshDecisionsActivities() {
      this.$store.dispatch('statistics/setDecisionsActivities', {
        organization_id: '',
      });
    },
    refresh() {
      this.$store.dispatch('statistics/setUsersActivities', { query: {} });
      this.user = null;
      this.year = null;
    },
  },
  computed: {
    customLabel: function () {
        if(this.$store.getters['statistics/userActivitiesLabel']){
            return this.$store.getters['statistics/userActivitiesLabel']
        }
    },
    lineChartOptions() {
      return {
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              let myLabels = [];
              for (let index = 0; index <= 3; index++) {
                var label = '';
                label += data['datasets'][index].label + ': ';
                if (data['datasets'][index]['data'][tooltipItem.index] || data['datasets'][index]['data'][tooltipItem.index] == 0) {
                  label += data['datasets'][index]['data'][tooltipItem.index];
                }
                myLabels[index] = label;
              }
              return myLabels;
            },

            // labelColor: function (tooltipItem, data) {
            //   console.log('tooltipItem', tooltipItem, 'data', data);

            //   if (data.data['datasets'][1].label == 'اخرى') {
            //     return { backgroundColor: '#543453' };
            //   } else {
            //     return { backgroundColor: '#fff' };
            //   }
            //   //   let myLabels = [];
            //   //   for (let index = 0; index <= 3; index++) {
            //   //     var label = '';
            //   //     label = 'rgb(255, 0, 56)';
            //   //     myLabels[index] = label;
            //   //   }
            // },
          },
        },
      };
    },
    chartOptions() {
      return {
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              var label = data['datasets'][0].label;
              if (label) {
                label += ': ';
              }
              if (data['datasets'][0]['data'][tooltipItem.index]) {
                label += data['datasets'][0]['data'][tooltipItem.index];
              }
              return label;
            },
          },
        },
      };
    },
  },
};
</script>

<style>
.rtl {
  /*float: right;*/
  direction: rtl;
}
#org {
  height: 300px;
}
.card_header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
