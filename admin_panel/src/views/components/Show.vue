<template>
  <CRow>
    <CCol col="12" lg="12" sm="12">
      <CCard>
        <CCardHeader class="flex-wrap text-initial" style="display: flex; justify-content: space-between; align-items: center">
          <div :class="$i18n.locale === 'ar' ? 'card-header-actions center' : 'center'" style="display: inline-block; font-weight: bold">
            <slot name="custom_avatar"></slot>
            <div>
              <i :class="icon" v-if="!profile"></i>
              <CIcon :name="fontIcon" color="bg-primary"></CIcon>
              <slot name="link"></slot>
              {{ name || '' }}
              <CBadge color="success" v-if="status === 0">{{ $t('Global.active') }}</CBadge>
              <CBadge color="danger" v-if="status === 1">{{ $t('Global.remove') }}</CBadge>
              <CBadge color="warning" v-if="status === 2">{{ $t('Global.inProgress') }}</CBadge>
              <slot name="show_status"></slot>
            </div>
          </div>
          <div class="d-flex align-items-center" :class="$i18n.locale === 'en' ? 'card-header-actions' : ''">
            <slot name="show_action"></slot>
          </div>
        </CCardHeader>
        <CCardBody v-loading="loading">
          <table class="table table-striped text_nobreak">
            <tbody style="text-align: initial">
              <slot name="other_data"></slot>
              <tr v-for="(item, key) in items" :key="key">
                <th v-if="course" scope="row" :width="big_th ? '26%' : '20%'">{{ item.key == 'start' ? $t(`Global.courseStart`) : $t(`Global.${item.key}`) }}</th>
                <th v-if="!profile && !course" scope="row" :width="big_th ? '26%' : '20%'">
                  <span v-if="item.key && exceptKey.length && exceptKey.includes(item.key)">
                    <slot name="custom_th"></slot>
                  </span>
                  <span v-else>
                    {{ submission && item.key == 'created_at' ? $t('Global.subCreatedAt') : currentUrl.includes('school') && item.key == 'authorized_person' ? $t(`Global.school_manager`) : $t(`Global.${item.key}`) }}
                  </span>
                </th>
                <th v-else-if="profile && !course" scope="row" :width="big_th ? '26%' : '20%'">
                  {{ $t(`Global.${item.key}`) }}
                  <span v-if="item.key == 'teams'" class="small text-muted">{{ $t('Global.teamsDate') }}</span>
                </th>
                <td :width="big_th ? '74%' : '80%'">
                  <span v-if="item.key && item.key.includes(except)">
                    <slot name="custom_show"></slot>
                  </span>
                  <span v-else-if="typeof item.value === 'string' && item.value.search(/\n/g) > 0" v-html="ntBr(item.value)"></span>
                  <span
                    v-else-if="
                      item.key &&
                      (item.key.includes('date') ||
                        item.key.includes('close_at') ||
                        item.key.includes('ends_at') ||
                        item.key.includes('starts') ||
                        item.key.includes('expiration') ||
                        item.key.includes('start') ||
                        item.key.includes('end') ||
                        item.key.includes('created_at') ||
                        item.key.includes('updated_at') ||
                        item.key === 'from' ||
                        item.key === 'to')
                    "
                  >
                    <span v-if="item.key != 'gender_type' && item.key != 'gender'"> <i class="el-icon-time"></i> {{ DateFormat(item.value) }} </span>
                    <span v-else>{{ isNaN(item.value) ? item.value : item.value == 1 ? $t('Global.man') : $t('Global.women') }}</span>
                  </span>
                  <span v-else-if="profile">
                    {{ item.value == 1 ? $t('Global.man') : item.value == 2 ? $t('Global.women') : item.value }}
                  </span>
                  <span v-else>
                    {{ item.value }}
                  </span>
                </td>
              </tr>
              <slot name="bottom_other_data"></slot>
            </tbody>
          </table>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import * as helper from '../../utils/helper';

export default {
  name: 'Show',
  props: {
    profile: { default: false, type: Boolean },
    items: {},
    submission: Boolean,
    big_th: Boolean,
    noProgram: Boolean,
    icon: String,
    fontIcon: String,
    course: Boolean,
    except: '',
    exceptKey: {
      type: Array,
      default() {
        return [];
      },
    },
    excepts: '',
    loading: { default: false },
    name: { default: '' },
    status: { default: null },
  },
  mounted() {
    this.$emit('init');
  },
  computed: {
    currentUrl: function () {
      return window.location.pathname;
    },
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    DateFormat(date) {
      return helper.toLocalDatetime(date, `${this.$i18n.locale == 'ar' ? 'ar' : 'en'}`);
    },
  },
};
</script>

<style scoped>
.custom-button {
  border-radius: 50px !important;
  background-color: #173f5f !important;
  border-color: #173f5f !important;
  padding: 5px 22px;
  font-weight: bold;
  padding-bottom: 9px;
}

.center {
  display: flex !important;
  align-items: center !important;
}
</style>
