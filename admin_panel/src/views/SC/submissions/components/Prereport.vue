<template>
  <CCard v-if="question">
    <CCardBody>
      <el-table v-if="question" :data="question" style="width: 100%" :header-cell-class-name="$i18n.locale === 'ar' ? 'text-right' : ''" :cell-class-name="$i18n.locale === 'ar' ? 'text-right' : ''">
        <el-table-column prop="question" :label="$t('Global.practices')"></el-table-column>
        <el-table-column width="500" prop="report" :label="$t('Global.ratePractices')">
          <template slot-scope="scope">
            {{ scope.row.report ? scope.row.report : '_' }}
          </template>
        </el-table-column>
        <el-table-column prop="tool" :label="$t('Global.Standard')">
          <template slot-scope="scope">
            {{ scope.row.tool ? scope.row.tool : '_' }}
          </template>
        </el-table-column>
      </el-table>
      <div v-else class="d-flex justify-content-center">{{ $t('Global.nodata') }}</div>
    </CCardBody>
  </CCard>
</template>

<script>
export default {
  name: 'report',
  props: {
    question: Object,
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss">
.badge {
  font-size: 72% !important;
}
.radius_0 {
  border-top-left-radius: 0 !important;
  border-top-right-radius: 0 !important;
}
.ml-6 {
  margin-left: 6rem !important;
}
.button_after {
  flex-direction: column;
  button {
    align-self: baseline;
    margin-top: 0.5rem;
  }
}
.reviewHeard {
  padding-bottom: 0.5rem;
}
.review_header {
  align-items: baseline !important;
  margin-top: 0.5rem !important;
}
.custom_badge {
  display: block;
  margin: 0.4rem -1.1rem 0.5rem 0;
  color: #b0b3b8;
  span {
    font-size: 9px;
  }
}
.custom_report {
  background-color: #eee;
  border-radius: 30px;
  padding-top: 0.2rem !important;
}
.report_style {
  position: relative;
  .el-button {
    align-self: flex-end;
    margin: 0rem 0.4rem;
    position: absolute;
    bottom: 4px;
    left: 10px;
    padding: 6px 15px;
  }
  p {
    //   text-align: justify;
    text-align-last: right;
  }

  p::after {
    content: '–––––––––––--';
    visibility: hidden;
    white-space: nowrap;
  }
  background-color: #ddd;
  border-radius: 30px;
  padding: 5px 20px 5px 5px;
  display: flex;
  justify-content: space-between;
}

.compare {
  margin: 0 0.5rem;
}

.compare .switch_option {
  background-color: #fff;
  -webkit-box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
}

.switch_option {
  display: -ms-inline-flexbox;
  display: inline-flex;
  border: 1px solid #fff;
  border-radius: 30px;
  position: relative;
  font-size: 22px;
  cursor: pointer;
}

.compare .switch_option .active {
  background-color: #eee;
  -webkit-box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
}

.compare .switch_option span {
  -webkit-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
  border-radius: 30px !important;
  padding: 5px 10px !important;
}
</style>
