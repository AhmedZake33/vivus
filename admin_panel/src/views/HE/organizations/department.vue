<template>
  <CRow v-if="hasPermission('edit_hotels')">
    <CCol sm="12">
      <CCard :class="isLoad ? 'disabledAll' : ''">
        <CCardHeader>
          <div :class="$i18n.locale === 'ar' ? 'card-header-actions' : ''" style="display: inline-block">
            <CIcon name="cil-people" color="bg-primary"></CIcon>
            {{ $t('Global.add_department') }}
          </div>
        </CCardHeader>
        <CCardBody dir="rtl" style="text-align: initial">
          <el-form label-position="top" :model="ruleForm" status-icon size="large" ref="ruleForm" label-width="120px" class="demo-ruleForm">
            <CRow>
              <div class="w-100">
                <CCol sm="12">
                  <el-form-item :label="$t('Global.departments')" prop="departments">
                    <el-select v-if="$store.state.hotel.selected" clearable :no-data-text="$t('Global.nodata')" style="width: 100%" v-model="ruleForm.team_id" filterable :placeholder="$t('Global.reservations')">
                      <el-option v-for="item in $store.state.team.teams" :key="item.id" :label="item.name" :value="item.id">
                        <span style="float: right; color: #8492a6; font-size: 13px">
                          {{ item.name }}
                        </span>
                      </el-option>
                      <el-option v-if="$store.state.hotel.selected_reservation && $store.state.hotel.selected_reservation.team" :key="$store.state.hotel.selected_reservation.team.id" :label="$store.state.hotel.selected_reservation.team.name" :value="$store.state.hotel.selected_reservation.team.id">
                        <span style="float: right; color: #8492a6; font-size: 13px">
                          {{ $store.state.hotel.selected_reservation.team.name }}
                        </span>
                      </el-option>
                    </el-select>
                  </el-form-item>
                </CCol>
              </div>
            </CRow>
          </el-form>
        </CCardBody>
        <CCardFooter>
          <div class="baseButton resetButton" style="justify-content: flex-start">
            <button class="mx-1 el-button el-button--default is-round sec_color" @click="add('ruleForm')" type="reset" style="padding: 0.6rem 1rem">
              <i class="el-icon-check-circle"></i>
              <CSpinner v-if="isLoad" color="default" size="sm" />
              {{ $t('Global.submit') }}
            </button>
            <button v-if="!isLoad" @click="resetForm('ruleForm')" class="el-button--small el-button el-button--default is-round base_color" type="reset" style="padding: 0.6rem 1rem">
              <i class="el-icon-refresh"></i>
              {{ $t('archive.reset') }}
            </button>
          </div>
        </CCardFooter>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
export default {
  name: 'reservation',
  data() {
    return {
      ruleForm: {
        team_id: null,
      },
      isLoad: false,
    };
  },

  mounted() {
    this.init();
  },
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    init() {
    //   let payload = this.$route.params.reservation_id ? `/${this.$route.params.id}/${this.$route.params.reservation_id}` : `/${this.$route.params.id}`;
    //   this.$store.dispatch('hotel/edit', payload).then(() => {
    //     if (this.$store.state.hotel.selected_reservation && this.$store.state.hotel.selected_reservation.team) {
    //       this.ruleForm.team_id = this.$store.state.hotel.selected_reservation.team.id;
    //     }
    //   });
    },
    add(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.isLoad = true;
          let query = { team_id: this.ruleForm.team_id, hotel_id: this.$route.params.id };
          this.$store
            .dispatch('organization/addDepartment', {
              query: query,
              id: this.$route.params.id ? this.$route.params.id : null,
            })
            .then(() => {
              this.$router.go(-1);
              this.isLoad = false;
            })
            .catch(_ => {
              this.isLoad = false;
            });
        }
      });
    },
  },
};
</script>
