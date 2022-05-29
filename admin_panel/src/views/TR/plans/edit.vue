<template>
  <CRow class="edit_submission" v-loading="$store.state.course.plansLoad">
    <CCol sm="12">
      <CCard>
        <CCardHeader>
          <div :class="$i18n.locale === 'ar' ? 'card-header-actions' : ''" style="display: inline-block">
            <CIcon name="cil-people" color="bg-primary"></CIcon>
            {{ $route.params.id ? $t('Global.editPlan') : $t('Global.add_plan') }}
          </div>
        </CCardHeader>
        <CCardBody :class="isLoad ? 'disabledAll' : ''" dir="rtl" style="text-align: initial">
          <el-form @submit.native.prevent label-position="top" :model="ruleForm" status-icon size="large" ref="ruleForm" label-width="120px" class="demo-ruleForm">
            <CRow>
              <CCol sm="4">
                <!-- <el-form-item  :rules="validation(null, 0)" prop="name" :label="$t('Global.name')">
                  <el-input clearable :placeholder="$t('Global.name')" v-model="ruleForm.name" style="width: 100%"></el-input>
                </el-form-item> -->
                <el-form-item :rules="validation(null, 1)" prop="course_id" :label="$t('Global.course')">
                  <el-select clearable :no-data-text="$t('Global.nodata')" style="width: 100%" v-model="ruleForm.course_id" :placeholder="$t('Global.course')">
                    <el-option v-for="item in lookups.courses" :key="item.id" :label="item.name" :value="item.id">
                      <span style="float: right; color: #8492a6; font-size: 13px">
                        {{ item.name }}
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
                <el-form-item :rules="validation(null, 1)" prop="code" :label="$t('Global.code_plan')">
                  <el-select clearable :no-data-text="$t('Global.nodata')" style="width: 100%" v-model="ruleForm.code" :placeholder="$t('Global.code_plan')">
                    <el-option v-for="item in lookups.code_plan" :key="item.id" :label="item.name" :value="item.id">
                      <span style="float: right; color: #8492a6; font-size: 13px">
                        {{ item.name }}
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
              <!--              <CCol sm="12" lg="4">-->
              <!--                <el-form-item :label="$t('Global.days_count')" prop="days">-->
              <!--                  <el-input clearable :placeholder="$t('Global.days_count')" v-model="ruleForm.days"></el-input>-->
              <!--                </el-form-item>-->
              <!--              </CCol>-->
              <!--              <CCol sm="12" lg="4">-->
              <!--                <el-form-item :label="$t('Global.weeks_count')" prop="days">-->
              <!--                  <el-input clearable :placeholder="$t('Global.weeks_count')" v-model="ruleForm.weeks"></el-input>-->
              <!--                </el-form-item>-->
              <!--              </CCol>-->
              <CCol sm="4">
                <el-form-item :rules="validation(null, 0)" prop="price" :label="$t('Global.coursePrice')">
                  <el-input clearable :placeholder="$t('Global.coursePrice')" v-model="ruleForm.price" style="width: 100%"></el-input>
                </el-form-item>
              </CCol>
              <CCol sm="4">
                <el-form-item :rules="validation(null, 0)" prop="total_degree" :label="$t('Global.total_degree')">
                  <el-input clearable :placeholder="$t('Global.total_degree')" v-model="ruleForm.total_degree" style="width: 100%"></el-input>
                </el-form-item>
              </CCol>
              <CCol sm="4">
                <el-form-item :rules="validation(null, 0)" prop="total_exam" :label="$t('Global.total_exam')">
                  <el-input clearable :placeholder="$t('Global.total_exam')" v-model="ruleForm.total_exam" style="width: 100%"></el-input>
                </el-form-item>
              </CCol>
              <CCol sm="4">
                <el-form-item :rules="validation(null, 0)" prop="max_trainer" :label="$t('Global.max_trainer')">
                  <el-input clearable :placeholder="$t('Global.max_trainer')" v-model="ruleForm.max_trainer" style="width: 100%"></el-input>
                </el-form-item>
              </CCol>
              <CCol sm="4">
                <el-form-item prop="place_id" :label="$t('Global.area')">
                  <el-select :disabled="disabled" clearable filterable :no-data-text="$t('Global.nodata')" style="width: 100%" v-model="ruleForm.area_id" :placeholder="$t('Global.area')">
                    <el-option v-for="item in lookups.area_types" :key="item.id" :label="item.name" :value="item.id">
                      <span style="float: right; color: #8492a6; font-size: 13px">
                        {{ item.name }}
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
                <el-form-item :rules="validation(null, 1)" prop="place_id" :label="$t('Global.coursePlace')">
                  <el-select :disabled="disabled" clearable filterable :no-data-text="$t('Global.nodata')" style="width: 100%" v-model="ruleForm.place_id" :placeholder="$t('Global.coursePlace')">
                    <el-option v-for="item in lookups.places" :key="item.id" :label="item.name" :value="item.id">
                      <span style="float: right; color: #8492a6; font-size: 13px">
                        {{ item.name }}
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
                <el-form-item prop="place_item" :label="$t('Global.hall')">
                  <el-select class="mb-3" v-model="ruleForm.place_item" filterable :placeholder="$t('Global.hall')" style="width: 100%">
                    <el-option v-for="(item, id) in items" :value="item" :key="id" :label="item">
                      <span style="float: right; color: #8492a6; font-size: 13px">
                        {{ item }}
                        <i class="el-icon-user-solid"></i>
                      </span>
                    </el-option>
                  </el-select>
                </el-form-item>
              </CCol>
              <CCol sm="4">
                <el-form-item :rules="validation(null, 0)" :label="$t('Global.courseStart')" prop="start">
                  <el-date-picker @change="onFromPickValidation" clearable style="width: 100%" :picker-options="pickerOptions" value-format="yyyy-MM-d" v-model="ruleForm.start" type="date" :placeholder="$t('Global.courseStart')"></el-date-picker>
                </el-form-item>
              </CCol>
              <CCol sm="4">
                <el-form-item :rules="validation(null, 0)" :label="$t('Global.attend_time')" prop="start_time">
                  <el-time-picker :placeholder="$t('Global.attend_time')" clearable style="width: 100%" format="hh:mm" value-format="hh:mm" arrow-control v-model="ruleForm.start_time"> </el-time-picker>
                </el-form-item>
              </CCol>
              <CCol sm="4">
                <el-form-item :rules="validation(null, 0)" :label="$t('Global.leave_time')" prop="end_time">
                  <el-time-picker :placeholder="$t('Global.leave_time')" clearable arrow-control format="HH:mm" value-format="HH:mm" style="width: 100%" v-model="ruleForm.end_time"> </el-time-picker>
                </el-form-item>
              </CCol>
              <!-- <CCol sm="4">
                <el-form-item prop="name" :rules="validation(null, 0)" :label="$t('Global.name')">
                  <el-input clearable v-model="ruleForm.name"></el-input>
                </el-form-item>
              </CCol>
              <CCol sm="4">
                <el-form-item :rules="validation(null, 1)" prop="type_id" :label="$t('Global.SCgender')">
                  <el-select clearable :no-data-text="$t('Global.nodata')" style="width: 100%" v-model="ruleForm.type_id" :placeholder="$t('Global.SCgender')">
                    <el-option v-for="item in lookups.types" :key="item.id" :label="item.name" :value="item.id">
                      <span style="float: right; color: #8492a6; font-size: 13px">
                        {{ item.name }}
                      </span>
                    </el-option>
                    <template #empty>
                      <div class="text-center" style="padding: 10px; font-weight: bold">
                        {{ $t('Global.nodata') }}
                      </div>
                    </template>
                  </el-select>
                </el-form-item>
              </CCol> -->
              <CCol sm="4">
                <el-form-item :rules="validation(null, 1)" prop="period_id" :label="$t('Global.coursePeriod')">
                  <el-select :disabled="disabled" clearable filterable :no-data-text="$t('Global.nodata')" style="width: 100%" v-model="ruleForm.period_id" :placeholder="$t('Global.coursePeriod')">
                    <el-option v-for="item in lookups.periods" :key="item.id" :label="item.name" :value="item.id">
                      <span style="float: right; color: #8492a6; font-size: 13px">
                        {{ item.name }}
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
                <el-form-item :rules="validation(null, 0)" prop="wishing_organization" :label="$t('Global.wishing_organization')">
                  <el-input clearable :placeholder="$t('Global.wishing_organization')" v-model="ruleForm.wishing_organization" style="width: 100%"></el-input>
                </el-form-item>
              </CCol>
              <!-- <CCol sm="12" lg="4">
                <div class="members_hide_close no_arrow" style="position: relative">
                  <el-form-item :rules="validation()" :label="$t('Global.coachs')" prop="members">
                    <el-select popper-class="hide_chooses" @remove-tag="changeType" :multiple-limit="3" :no-data-text="$t('Global.nodata')" style="width: 100%" v-model="ruleForm.members" filterable multiple :placeholder="$t('Global.coachs')">
                      <div v-if="$store.getters['submission/selectedTeam']">
                        <el-option v-for="user in $store.getters['submission/selectedTeam'].all_members" :key="user.id" :label="user.ar_name" :value="user.id">
                          <span style="float: right; color: #8492a6; font-size: 13px">
                            {{ user.ar_name }}
                            <i class="el-icon-user-solid"></i>
                          </span>
                        </el-option>
                      </div>
                      <div v-if="selectedMembers.length">
                        <el-option v-for="user in selectedMembers" :key="user.id" :label="user.ar_name" :value="user.id">
                          <span style="float: right; color: #8492a6; font-size: 13px">
                            {{ user.ar_name }}
                            <i class="el-icon-user-solid"></i>
                          </span>
                        </el-option>
                      </div>
                      <template #empty>
                        <div class="text-center" style="padding: 10px; font-weight: bold">
                          {{ $t('Global.nodata') }}
                        </div>
                      </template>
                    </el-select>
                  </el-form-item>
                  <div class="custom_left" @click="openDialog(2)"><i class="el-icon-circle-plus" style="font-size: 22px"></i></div>
                </div>
              </CCol> -->
              <CCol sm="12" lg="4">
                <el-form-item :label="$t('Global.note')" prop="note">
                  <el-input autosize resize="none" type="textarea" v-model="ruleForm.note"></el-input>
                </el-form-item>
              </CCol>
            </CRow>
          </el-form>
        </CCardBody>
        <CCardFooter>
          <div class="baseButton resetButton" style="justify-content: flex-start">
            <button id="khaled" class="el-button el-button--default is-round sec_color mx-1" @click="save('ruleForm')" style="padding: 0.6rem 1rem">
              <i class="el-icon-check-circle"></i>
              <CSpinner v-if="isLoad" color="default" size="sm" />
              {{ $route.params.id ? $t('Global.submit') : $t('Global.add') }}
            </button>
            <button v-if="!isLoad" class="el-button--small el-button el-button--default is-round base_color" @click="resetForm('ruleForm')" type="reset" style="padding: 0.6rem 1rem">
              <i class="el-icon-refresh"></i>
              {{ $t('archive.reset') }}
            </button>
          </div>
        </CCardFooter>
      </CCard>
    </CCol>
    <el-dialog :close-on-click-modal="false" class="userDialog" :title="$t('Global.addInfo')" :visible.sync="approveDialog" width="80%">
      <Browser hidden_action :removed="removed" :system="'SC'" :selectedMembers="selectedMembers" @saveTeam="saveTeam" @closeDialog="closeDialog" :type="type" :members="ruleForm.members"></Browser>
    </el-dialog>
  </CRow>
</template>

<script>
import Browser from '../../components/userBrowser.vue';
export default {
  components: { Browser },
  data() {
    return {
      items: [],
      ruleForm: {
        place_item: null,
        name: null,
        members: [],
        note: null,
        days: null,
        weeks: null,
        period_id: null,
        end: null,
        start: null,
        start_time: '',
        wishing_organization: '',
        end_time: '',
        price: null,
        place_id: null,
        course_id: null,
        total_degree: null,
        total_exam: null,
        max_trainer: null,
        area_id: null,
        code: null,
        has_exam: null,
      },
      type: null,
      removed: null,
      approveDialog: false,
      selectedMembers: [],
      disabled: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
      pickerOptionsTo: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
      isLoad: false,
    };
  },
  computed: {
    lookups: function () {
      if (this.$store.state.course.lookups) {
        return this.$store.state.course.lookups;
      }
    },
  },
  mounted() {
    this.init();
  },
  watch: {
    'ruleForm.max_trainer'(value) {
      if (!value);
      this.ruleForm.max_trainer = value.toString().replace(/[^0-9]/g, '');
    },
    'ruleForm.total_degree'(value) {
      if (!value);
      this.ruleForm.total_degree = value.toString().replace(/[^0-9]/g, '');
    },
    'ruleForm.price'(value) {
      if (!value);
      this.ruleForm.price = value.toString().replace(/[^0-9]/g, '');
    },
    'ruleForm.weeks'(value) {
      if (!value);
      this.ruleForm.weeks = value.toString().replace(/[^0-9]/g, '');
    },
    'ruleForm.evaluation_trainer'(value) {
      if (!value);
      this.ruleForm.evaluation_trainer = value.toString().replace(/[^0-9]/g, '');
    },
    'ruleForm.days'(value) {
      if (!value);
      this.ruleForm.days = value.toString().replace(/[^0-9]/g, '');
    },
    'ruleForm.total_exam'(value) {
      if (!value);
      this.ruleForm.total_exam = value.toString().replace(/[^0-9]/g, '');
    },
    'ruleForm.place_id'(value,newValue) {
      if (!value);
      let filtered;
      filtered = this.lookups ? this.lookups.places.find(item => item.id == value) : [];
      this.items = filtered.items || [];
      if (newValue) {
        this.ruleForm.place_item = null;
      }
    },
  },
  methods: {
    onFromPickValidation(pick) {
      if (this.ruleForm.end) {
        var pickedDate = new Date(Date.parse(pick.replace(/-/g, ' ')));
        var toDate = new Date(Date.parse(this.ruleForm.end.replace(/-/g, ' ')));
        if (pickedDate > toDate) {
          this.$notify.error({ message: `${this.$t('Validation.pickerTo')}` });
          this.ruleForm.start = null;
        }
      }
    },
    onPickValidation(pick) {
      var pickedDate = new Date(Date.parse(pick.replace(/-/g, ' ')));
      var todaysDate = new Date(Date.parse(this.ruleForm.start.replace(/-/g, ' ')));
      if (pickedDate < todaysDate) {
        this.$notify.error({ message: `${this.$t('Validation.pickerTo')}` });
        this.ruleForm.end = null;
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    closeDialog(data) {
      this.approveDialog = false;
      this.type = 8;
    },
    saveTeam(data) {
      if (data.type == 2) {
        this.selectedMembers = data.users;
        this.ruleForm.members = Array.from(data.users, member => member.id);
      }
      this.approveDialog = false;
    },
    openDialog(type) {
      this.approveDialog = true;
      this.type = type;
    },
    changeType(val) {
      this.type = 6;
      this.removed = val;
      this.selectedMembers = this.selectedMembers.filter(user => user.id != val);
    },
    init() {
      // if (this.$route.params.id) {
      this.$store.dispatch('course/getPlan', this.$route.params.id ? this.$route.params.id : null).then(_ => {
        if (this.$store.state.course.plan) {
          this.ruleForm = this.$store.state.course.plan;
        }
      });
      // }
    },
    save(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.isLoad = true;
          let query = {
            course_id: this.ruleForm.course_id,
            place_id: this.ruleForm.place_id,
            wishing_organization: this.ruleForm.wishing_organization,
            price: this.ruleForm.price,
            start: this.ruleForm.start,
            end: this.ruleForm.end,
            start_time: this.ruleForm.start_time,
            end_time: this.ruleForm.end_time,
            days: this.ruleForm.days,
            weeks: this.ruleForm.weeks,
            period_id: this.ruleForm.period_id,
            total_degree: this.ruleForm.total_degree,
            total_exam: this.ruleForm.total_exam,
            max_trainer: this.ruleForm.max_trainer,
            area_id: this.ruleForm.area_id,
            code: this.ruleForm.code,
            note: this.ruleForm.note,
            place_item: this.ruleForm.place_item,
          };
          let trainers = {
            trainers: this.ruleForm.members,
          };
          //   this.$store
          //     .dispatch('course/addTrainers', {
          //       query: trainers,
          //       id: this.$route.params.id ? this.$route.params.id : null,
          //     })
          //     .then(() => {
          //       //   this.isLoad = false;
          //       //   this.$router.go(-1);
          //     });
          this.$store
            .dispatch('course/savePlan', {
              query: query,
              id: this.$route.params.id ? this.$route.params.id : null,
            })
            .then(() => {
              this.isLoad = false;
              this.$router.go(-1);
            });
        }
      });
    },
  },
};
</script>
