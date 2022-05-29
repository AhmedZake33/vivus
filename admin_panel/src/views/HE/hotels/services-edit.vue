<template>
  <CRow v-if="hasPermission('edit_hotels')">
    <CCol sm="12">
      <CCard :class="isLoad ? 'disabledAll' : ''">
        <CCardHeader>
          <div :class="$i18n.locale === 'ar' ? 'card-header-actions' : ''" style="display: inline-block">
            <CIcon name="cil-people" color="bg-primary"></CIcon>
            {{ $t('route.services') }}
          </div>
        </CCardHeader>
        <CCardBody dir="rtl" style="text-align: initial">
          <el-form label-position="top" :model="ruleForm" status-icon size="large" ref="ruleForm" label-width="120px" class="demo-ruleForm">
            <CRow>
              <CCol sm="4">
                <el-form-item :rules="validation(null, 0)" prop="name" :label="$t('Global.name')">
                  <el-input :placeholder="$t('Global.name')" v-model="ruleForm.name"></el-input>
                </el-form-item>
              </CCol>
              <CCol sm="4">
                <el-form-item :rules="validation(null, 1)" :label="$t('Global.roomCount')" prop="roomCount">
                  <el-select filterable style="width: 100%" v-model="ruleForm.roomCount" :placeholder="$t('Global.roomCount')">
                    <el-option v-for="item in 10" :key="item" :label="$t(`Global.roomCount${item}`)" :value="item">
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
                </el-form-item>
              </CCol>
              <CCol sm="4">
                <el-form-item :rules="validation(null, 1)" :label="$t('Global.roomType')" prop="roomType">
                  <el-select filterable :no-data-text="$t('Global.nodata')" style="width: 100%" v-model="ruleForm.roomType" :placeholder="$t('Global.roomType')">
                    <el-option v-for="item in 3" :key="item" :label="$t(`Global.roomType${item}`)" :value="item">
                      <span style="float: right; color: #8492a6; font-size: 13px">
                        {{ $t(`Global.roomType${item}`) }}
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
              <CCol sm="4">
                <el-form-item :rules="validation(null, 0)" :label="$t('Global.arrivalDate')" prop="arrivalDate">
                  <el-date-picker clearable style="width: 100%" value-format="yyyy-MM-d" v-model="ruleForm.arrivalDate" type="date" :placeholder="$t('Global.arrivalDate')"> </el-date-picker>
                </el-form-item>
              </CCol>
              <CCol sm="4">
                <el-form-item :rules="validation(null, 0)" :label="$t('Global.departureDate')" prop="departureDate">
                  <el-date-picker clearable style="width: 100%" value-format="yyyy-MM-d" v-model="ruleForm.departureDate" type="date" :placeholder="$t('Global.departureDate')"> </el-date-picker>
                </el-form-item>
              </CCol>
              <CCol sm="4">
                <el-form-item :rules="validation(null, 1)" :label="$t('Global.stayType')" prop="stayType">
                  <el-select filterable :no-data-text="$t('Global.nodata')" style="width: 100%" v-model="ruleForm.stayType" :placeholder="$t('Global.stayType')">
                    <el-option v-for="item in 3" :key="item" :label="$t(`Global.stayType${item}`)" :value="item">
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
            </CRow>
          </el-form>
        </CCardBody>
        <template v-if="$store.state.user.allowHr || hasPermission('admin_system')">
        <CCardFooter>
          <div class="baseButton resetButton" style="justify-content: flex-start">
            <button class="mx-1 el-button el-button--default is-round sec_color" @click="add('ruleForm')" type="reset" style="padding: 0.6rem 1rem">
              <i class="el-icon-check-circle"></i>
              <CSpinner v-if="isLoad" color="default" size="sm" />
              {{ $route.params.type ? $t('Global.add') : $t('Global.submit') }}
            </button>
            <button v-if="!isLoad" @click="resetForm('ruleForm')" class="el-button--small el-button el-button--default is-round base_color" type="reset" style="padding: 0.6rem 1rem">
              <i class="el-icon-refresh"></i>
              {{ $t('archive.reset') }}
            </button>
          </div>
        </CCardFooter>
        </template>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        name: null,
        roomCount: null,
        roomType: null,
        stayType: null,
        arrivalDate: null,
        departureDate: null,
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
      //   this.$store.dispatch('hotel/edit', this.$route.params.id ? `/${this.$route.params.id}` : '').then(() => {
      //     if (this.$store.state.hotel.selected && this.$route.params.id && !this.$route.params.type) {
      //       this.ruleForm = this.$store.state.hotel.selected;
      //     }
      //   });
    },
    add(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.isLoad = true;
          let query;
          if (this.$route.params.type) {
            query = { reservations: this.ruleForm.reservations };
          } else {
            query = {
              name: this.ruleForm.name,
              city_id: this.ruleForm.city_id,
              mobile: this.ruleForm.mobile,
              contact: this.ruleForm.contact,
              address: this.ruleForm.address,
              phone: this.ruleForm.phone,
              email: this.ruleForm.email,
              level: this.ruleForm.level,
              fax: this.ruleForm.fax,
            };
          }
          this.$store
            .dispatch('hotel/add', {
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
