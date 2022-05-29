<template>
  <CRow v-if="hasPermission('edit_hotels')">
    <CCol sm="12">
      <CCard :class="isLoad ? 'disabledAll' : ''">
        <CCardHeader>
          <div :class="$i18n.locale === 'ar' ? 'card-header-actions' : ''" style="display: inline-block">
            <CIcon name="cil-people" color="bg-primary"></CIcon>
            {{ !$route.params.type ? $t('Global.addHotel') : $t('Global.add_reservation') }}
          </div>
        </CCardHeader>
        <CCardBody dir="rtl" style="text-align: initial">
          <el-form label-position="top" :model="ruleForm" status-icon size="large" ref="ruleForm" label-width="120px" class="demo-ruleForm">
            <CRow>
              <CCol sm="6" v-if="!$route.params.type">
                <el-form-item :rules="validation(null, 0)" prop="name" :label="$t('Global.name')">
                  <el-input :placeholder="$t('Global.name')" v-model="ruleForm.name"></el-input>
                </el-form-item>
              </CCol>
              <CCol sm="6" v-if="!$route.params.type">
                <el-form-item class="leftToRight left_right" prop="email" :label="$t('user.email')">
                  <el-input name="email" id="email" clearable suffix-icon="el-icon-message" v-model="ruleForm.email" :placeholder="$t('user.email')"></el-input>
                </el-form-item>
              </CCol>
              <CCol sm="6" v-if="!$route.params.type">
                <el-form-item :rules="validation(null, 0)" prop="address" :label="$t('Global.address')">
                  <el-input :placeholder="$t('Global.address')" suffix-icon="el-icon-address" v-model="ruleForm.address"></el-input>
                </el-form-item>
              </CCol>
              <CCol sm="6" v-if="!$route.params.type">
                <el-form-item :rules="validation(null, 0)" prop="contact" :label="$t('Global.Administrator')">
                  <el-input :placeholder="$t('Global.Administrator')" suffix-icon="el-icon-contact" v-model="ruleForm.contact"></el-input>
                </el-form-item>
              </CCol>

              <CCol sm="4" v-if="!$route.params.type">
                <el-form-item prop="phone" :label="$t('Global.phone')">
                  <el-input :placeholder="$t('Global.phone')" suffix-icon="el-icon-phone" v-model="ruleForm.phone"></el-input>
                </el-form-item>
              </CCol>
              <CCol sm="4" v-if="!$route.params.type">
                <el-form-item prop="fax" :label="$t('Global.fax')">
                  <el-input :placeholder="$t('Global.fax')" suffix-icon="el-icon-fax" v-model="ruleForm.fax"></el-input>
                </el-form-item>
              </CCol>
              <CCol sm="4" v-if="!$route.params.type">
                <el-form-item :rules="validation(null, 1)" :label="$t('Global.city')" prop="city_id">
                  <el-select filterable :no-data-text="$t('Global.nodata')" style="width: 100%" v-model="ruleForm.city_id" :placeholder="$t('Global.city')">
                    <el-option v-for="item in $store.getters['organization/cities']" :key="item.id" :label="item.name" :value="item.id">
                      <span style="float: right; color: #8492a6; font-size: 13px">
                        {{ item.name }}
                        <i class="el-icon-office-building"></i>
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
              <CCol sm="4" v-if="!$route.params.type">
                <el-form-item :rules="validation(null, 0)" prop="mobile" :label="$t('user.mobile')">
                  <el-input :placeholder="$t('user.mobile')" suffix-icon="el-icon-mobile" v-model="ruleForm.mobile"></el-input>
                </el-form-item>
              </CCol>
              <CCol sm="4" v-if="!$route.params.type">
                <el-form-item :rules="validation(null, 0)" prop="level" :label="$t('Global.hotelLevel')">
                  <el-select :no-data-text="$t('Global.nodata')" style="width: 100%" v-model="ruleForm.level" :placeholder="$t('Global.hotelLevel')">
                    <el-option v-for="item in $store.state.hotel.levels" :key="item.id" :label="item.name" :value="item.id">
                      <span style="float: right; color: #8492a6; font-size: 13px">
                        {{ item.name }}
                        <i class="el-icon-office-building"></i>
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
              <CCol sm="4" v-if="!$route.params.type">
                <el-form-item :rules="validation(null, 1)" :label="$t('Global.government')" prop="government_id">
                  <el-select filterable :no-data-text="$t('Global.nodata')" style="width: 100%" v-model="ruleForm.government_id" :placeholder="$t('Global.government')">
                    <el-option v-for="item in $store.getters['organization/governments']" :key="item.id" :label="item.name" :value="item.id">
                      <span style="float: right; color: #8492a6; font-size: 13px">
                        {{ item.name }}
                        <i class="el-icon-office-building"></i>
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
              <!-- <CCol sm="6" v-if="!$route.params.type">
                <el-form-item :label="$t('Global.subject')" :rules="validation(false, 'textarea')" prop="subject" class="min_height_40 animate hide_border m-0">
                  <el-input clearable autosize resize="none" type="textarea" :placeholder="$t('Global.subject')" v-model="ruleForm.subject">
                    <i slot="suffix" class="el-input__icon el-icon-office-building"></i>
                  </el-input>
                </el-form-item>
              </CCol> -->
              <div v-if="$route.params.type" class="w-100">
                <CCol sm="12">
                  <el-form-item :label="$t('Global.reservations')" prop="reservations">
                    <el-select clearable :no-data-text="$t('Global.nodata')" style="width: 100%" v-model="ruleForm.reservations" filterable :placeholder="$t('Global.reservations')">
                      <el-option v-for="item in $store.state.team.teams" :key="item.id" :label="item.name" :value="item.id">
                        <span style="float: right; color: #8492a6; font-size: 13px">
                          {{ item.name }}
                        </span>
                      </el-option>
                    </el-select>
                  </el-form-item>
                </CCol>
              </div>
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
  name: 'organizationEdit',
  data() {
    return {
      ruleForm: {
        name: null,
        city_id: null,
        mobile: null,
        contact: null,
        government_id:null,
        address: null,
        phone: null,
        email: null,
        level: null,
        subject: null,
        fax: null,
        reservations: [],
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
      this.$store.dispatch('hotel/edit', this.$route.params.id ? `/${this.$route.params.id}` : '').then(() => {
        if (this.$store.state.hotel.selected && this.$route.params.id && !this.$route.params.type) {
          this.ruleForm = this.$store.state.hotel.selected;
        }
      });
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
              government_id:this.ruleForm.government_id
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
  watch: {
    'ruleForm.phone'(value) {
      if (!value) return;
      this.ruleForm.phone = value.toString().replace(/[^0-9]/g, '');
    },
    'ruleForm.alt_phone'(value) {
      if (!value) return;
      this.ruleForm.mobile = value.toString().replace(/[^0-9]/g, '');
    },
    'ruleForm.fax'(value) {
      if (!value) return;
      this.ruleForm.fax = value.toString().replace(/[^0-9]/g, '');
    },
  },
};
</script>

<style lang="scss">
.min_height_40 {
  .el-form-item__content {
    line-height: 1;
  }
  textarea {
    min-height: 40px !important;
  }
}
</style>
