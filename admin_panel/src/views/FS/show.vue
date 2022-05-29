<template>
  <div id="print">
    <Show :loading="$store.getters['finance/load']" icon="el-icon-message" :items="$store.getters['finance/submission']" @init="init" :name="system != 3 ? $t('Global.order') : ''">
      <template #show_status>
        <span v-if="$store.state.finance.submission" :to="{ path: $store.state.finance.submission.organization_id ? `/higher/organization/${$store.state.finance.submission.organization_id}` : '' }">
          <span v-if="system != 3"> {{ $store.state.finance.submission.name }} - {{ $store.state.finance.submission.university }} </span>
          <span v-else>
            {{ $store.state.finance.submission.ar_name }}
          </span>
        </span>
      </template>
      <template #other_data v-if="system != 3">
        <tr v-if="$store.getters['finance/submission']">
          <th scope="row" width="20%">{{ $t('Global.organization') }}</th>
          <td width="80%">
            <span v-if="$store.state.finance.submission" :to="hasPermission('access_organizations') ? { path: $store.state.finance.submission.organization_id ? `/higher/organization/${$store.state.finance.submission.organization_id}` : '' } : ''">
              {{ $store.state.finance.submission.name ? $store.state.finance.submission.name : $store.state.finance.submission.temp_organization_name ? $store.state.finance.submission.temp_organization_name : '' }}
            </span>
          </td>
        </tr>
      </template>
      <template #bottom_other_data>
        <tr>
          <th scope="row" width="20%">{{ system != 3 ? $t('Global.representative') : $t('Global.trainee') }}</th>
          <td width="80%" v-if="$store.getters['finance/representative']">
            <router-link class="custom-link" :to="{ path: `/users/${$store.getters['finance/representative'].id}` }">
              {{ $store.getters['finance/representative'].ar_name }}
            </router-link>
          </td>
        </tr>
        <tr v-if="$store.state.finance.payment">
          <th scope="row" width="20%">{{ $t('Global.uploadLetterOrgFile') }}</th>
          <td width="80%">
            <div class="mb-2">
              <span>{{ $t('Global.pay_value') + ': ' }} </span>
              <span style="font-weight: bolder" class="ml-3"> ({{ $store.getters['finance/payment'].pay_value ? $store.getters['finance/payment'].pay_value : '-' }}),</span>
              <span>{{ $t('Global.pay_number') + ': ' }} </span>
              <span style="font-weight: bolder" class="ml-3"> ({{ $store.getters['finance/payment'].pay_number ? $store.getters['finance/payment'].pay_number : '-' }}),</span>
              <span>{{ $t('Global.payment_date') + ': ' }} </span>
              <span style="font-weight: bolder" class="ml-3"> ({{ $store.getters['finance/payment'].payment_date ? toLocalDatetime($store.getters['finance/payment'].payment_date, `${$i18n.locale == 'ar' ? 'ar' : 'en'}`) : '-' }})</span>
              <br />
              <span>{{ $t('Global.paymentDocs') + ': ' }} </span>
              <span style="font-weight: bolder" class="ml-3"
                >(<a download :href="$store.getters['finance/payment'].file" target="_blank">{{ $store.getters['finance/payment'].file_name }}</a
                >)</span
              >
            </div>
          </td>
        </tr>
        <tr v-if="$store.state.finance.team">
          <th scope="row" width="20%">{{ $t('Global.team') }}</th>
          <td width="80%">
            <span>
              <div class="teams_state d-md-flex flex-wrap">
                <router-link :class="hasPermission('access_teams') ? 'custom-link' : ''" slot="reference" :to="hasPermission('access_teams') ? { path: `/higher/team/${$store.state.finance.team.id}` } : ''">
                  <CBadge :class="hasPermission('access_teams') ? 'custom-link' : ''" class="ml-2 mr-2 text-wrap" color="info">{{ $store.state.finance.team.name }}</CBadge>
                </router-link>
              </div>
              <span v-for="member in $store.state.finance.team.all_members_with_bonus">
                <div class="teams_state">
                  <router-link v-if="member.user_id" class="d-block custom-link text_badge" :to="{ path: `/users/${member.user_id}` }">
                    <el-badge v-if="member.excused === constants('NOT_EXCUSED__STATUS')" type="success" :value="$t('Global.exist')" class="print_hide"></el-badge>
                    <el-badge v-if="member.excused === constants('EXCUSED_STATUS')" type="danger" :value="$t('Global.excused')" class="print_hide"></el-badge>
                    <el-badge v-if="member.excused === 2" type="warning" :value="$t('Global.sub_excused')"></el-badge>
                    {{ member.ar_name }} ({{ member.job }})
                  </router-link>
                </div>
              </span>
            </span>
          </td>
        </tr>
      </template>
      <template #show_action v-if="(system == 2 && ($store.state.user.allowPu || hasPermission('admin_system'))) || (system == 1 && ($store.state.user.allowHr || hasPermission('admin_system'))) || system == 3">
        <i class="el-icon-printer mr-2 pointer print_hide" style="font-size: 17px" @click="print('print', `${$store.state.finance.submission.name} - ${$store.state.finance.submission.university}`)"></i>
        <div :class="isLoad ? 'disabledAll' : ''" v-if="$store.state.finance.status && hasPermission('finance_approval')">
          <el-button icon="el-icon-check" @click="system == 1 ? handleAccept() : pre_handleAccept()" round size="mini" class="mx-1 right_icon" type="success"> {{ $t('Global.accept_finance') }} </el-button>
          <el-button icon="el-icon-close" @click="dialogOpen($route.params.id)" round size="mini" class="mx-1 right_icon" type="danger"> {{ $t('Global.refuse_finance') }} </el-button>
        </div>
      </template>
    </Show>
    <CCard v-loading="$store.getters['finance/load']" v-if="$store.state.finance.team">
      <CCardHeader>
        <div :class="$i18n.locale === 'ar' ? 'card-header-actions' : ''" style="display: inline-block; font-weight: bold">
          <i class="el-icon-money"></i>
          {{ $t('Global.bonus') }}
        </div>
        <div v-if="$store.state.user.allowHr || hasPermission('admin_system')" :class="$i18n.locale === 'en' ? 'card-header-actions' : ''" style="display: flex; justify-content: flex-end; align-items: center">
          <el-button v-if="hasPermission('finance_approval') || hasPermission('admin_fs')" @click="openFinanceDialog(null)" round size="mini" class="mx-1 p-2 right_icon print_hide" style="font-size: 13px" type="primary">
            <i class="el-icon-circle-plus"></i>
            {{ $t('Global.add_exchange') }}
          </el-button>
        </div>
      </CCardHeader>
      <CCardBody>
        <el-table
          v-if="$store.state.finance.team && $store.state.finance.team.all_members_with_bonus"
          :data="
            $store.state.finance.team.all_members_with_bonus.filter(function (member) {
              if (member.id) {
                return member;
              }
            })
          "
          style="width: 100%"
          :header-cell-class-name="$i18n.locale === 'ar' ? 'text-right' : ''"
          :cell-class-name="$i18n.locale === 'ar' ? 'text-right' : ''"
        >
          <el-table-column prop="name" width="300" :label="$t('Global.name')">
            <template slot-scope="scope">
              <router-link v-if="scope.row.user_id" class="d-block custom-link text_badge" :to="{ path: `/users/${scope.row.user_id}` }"> {{ scope.row.ar_name }} ({{ scope.row.job }}) </router-link>
            </template>
          </el-table-column>
          <el-table-column prop="created_at" :label="$t('Global.date')">
            <template slot-scope="scope">
              {{ scope.row.created_at ? toLocalDatetime(scope.row.created_at) : '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="bonus" :label="$t('Global.value')"></el-table-column>
          <el-table-column prop="tax" :label="$t('Global.tax')"></el-table-column>
          <el-table-column prop="stamp" :label="$t('Global.stamp')"></el-table-column>
          <el-table-column prop="discount" :label="$t('Global.discount')">
            <template slot-scope="scope">
              {{ scope.row.discount }}
              <CBadge color="info" class="p-1" v-if="scope.row.discount_note">
                {{ scope.row.discount_note }}
              </CBadge>
            </template>
          </el-table-column>
          <el-table-column prop="total" :label="$t('Global.Total')"></el-table-column>
          <el-table-column prop="status" :label="$t('Global.status')">
            <template slot-scope="scope">
              <CBadge :color="scope.row.status ? (scope.row.status == 2 ? 'danger' : 'success') : 'warning'" class="p-1"> {{ scope.row.status ? (scope.row.status == 2 ? $t('Global.cancel') : $t('Global.Done')) : $t('Global.pending') }} </CBadge>
            </template>
          </el-table-column>
          <el-table-column prop="" label=" ">
            <template slot-scope="scope">
              <div :style="$i18n.locale === 'ar' ? 'text-align:left' : 'float: right;'" v-if="hasPermission('finance_approval') || hasPermission('admin_fs')">
                <i class="el-icon-edit table-action-item" @click="openFinanceDialog(scope.row)"></i>
                <i :class="scope.row.status == 2 ? 'el-icon-refresh table-action-item' : 'el-icon-delete table-action-item'" @click="cancelBonus(scope.row.id)"></i>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div v-else class="d-lg-flex">{{ $t('Global.nodata') }}</div>
      </CCardBody>
    </CCard>
    <el-dialog :title="$t('Global.writeNote')" :visible.sync="dialogVisible" width="80%">
      <el-form label-position="top" :model="form" :rules="rules" status-icon size="large" ref="form" label-width="120px" class="stateForm demo-ruleForm">
        <CRow>
          <el-form-item :rules="validation(false, 'textarea')" class="custom_area" style="width: 100%" prop="rejectReason">
            <el-input id="rejectReason" class="textarea" type="textarea" :placeholder="$t('Global.rejectReason')" v-model="form.rejectReason"></el-input>
          </el-form-item>
        </CRow>
      </el-form>
      <span slot="footer" :class="isLoad ? 'disabledAll' : ''" class="dialog-footer" style="display: flex">
        <el-button icon="el-icon-close" @click="system == 1 ? sendReject('form') : pre_sendReject('form')" round size="mini" class="mx-1 right_icon" type="danger">{{ $t('Global.accept') }}</el-button>
        <el-button
          class="ml-1 mr-1"
          @click="
            dialogVisible = false;
            ifComment = false;
            rejected = false;
          "
          round
          size="small"
        >
          {{ $t('Global.discard') }}
        </el-button>
      </span>
    </el-dialog>
    <el-dialog @close="type = null" :title="$t('Global.finance_users')" :visible.sync="finance_dialog" class="p-0" width="60%">
      <CCardBody dir="rtl" style="text-align: initial" class="p-0">
        <el-form label-position="top" :model="ruleForm" status-icon size="large" ref="ruleForm" label-width="120px" class="demo-ruleForm">
          <CRow>
            <CCol sm="12" v-if="type">
              <el-form-item :rules="validation(null, 1)" :label="$t('Global.user')" prop="member">
                <el-select v-if="$store.state.finance.team" filterable style="width: 100%" v-model="ruleForm.member" :placeholder="$t('Global.user')">
                  <el-option v-if="$store.state.finance.team.all_members_with_bonus" v-for="user in $store.state.finance.team.all_members_with_bonus" :key="user.member_id" :label="user.ar_name" :value="user.member_id">
                    <span style="float: right; color: #8492a6; font-size: 13px">
                      {{ user.ar_name }}
                    </span>
                  </el-option>
                </el-select>
              </el-form-item>
            </CCol>
            <CCol sm="4">
              <el-form-item :rules="validation()" prop="bonus" :label="$t('Global.value')">
                <el-input :maxlength="10" :controls="false" clearable :placeholder="$t('Global.value')" v-model="ruleForm.bonus" :min="0" :step="Number(100)" style="width: 100%">
                  <i slot="suffix" class="el-icon-s-marketing"></i>
                </el-input>
              </el-form-item>
            </CCol>
            <CCol sm="4">
              <el-form-item :rules="validation()" prop="tax" :label="$t('Global.tax')">
                <el-input :maxlength="10" :controls="false" clearable :placeholder="$t('Global.tax')" v-model="ruleForm.tax" :min="0" :step="Number(100)" style="width: 100%">
                  <i slot="suffix" class="el-icon-s-marketing"></i>
                </el-input>
              </el-form-item>
            </CCol>
            <CCol sm="4">
              <el-form-item :rules="validation()" prop="stamp" :label="$t('Global.stamp')">
                <el-input :maxlength="10" :controls="false" clearable :placeholder="$t('Global.stamp')" v-model="ruleForm.stamp" :min="0" :step="Number(100)" style="width: 100%">
                  <i slot="suffix" class="el-icon-s-marketing"></i>
                </el-input>
              </el-form-item>
            </CCol>

            <CCol sm="6">
              <el-form-item prop="discount" :label="$t('Global.discount')">
                <el-input :maxlength="10" :controls="false" clearable :placeholder="$t('Global.discount')" v-model="ruleForm.discount" :min="0" :step="Number(100)" style="width: 100%">
                  <i slot="suffix" class="el-icon-s-marketing"></i>
                </el-input>
              </el-form-item>
            </CCol>

            <CCol sm="6">
              <el-form-item prop="discount_note" :label="$t('Global.discount_reason')">
                <el-input :placeholder="$t('Global.discount_reason')" v-model="ruleForm.discount_note"></el-input>
              </el-form-item>
            </CCol>

            <CCol sm="6">
              <el-form-item :rules="validation()" prop="total" :label="$t('Global.Total')">
                <el-input :maxlength="10" :controls="false" clearable :placeholder="$t('Global.Total')" v-model="ruleForm.total" :min="0" :step="Number(100)" style="width: 100%">
                  <i slot="suffix" class="el-icon-s-marketing"></i>
                </el-input>
              </el-form-item>
            </CCol>
            <CCol sm="6">
              <el-form-item :rules="validation(null, 1)" :label="$t('Global.status')" prop="status">
                <el-select filterable style="width: 100%" v-model="ruleForm.status" :placeholder="$t('Global.status')">
                  <el-option :label="$t('Global.Done')" :value="1">
                    <span style="float: right; color: #8492a6; font-size: 13px">
                      {{ $t('Global.Done') }}
                    </span>
                  </el-option>
                  <el-option :label="$t('Global.pending')" :value="0">
                    <span style="float: right; color: #8492a6; font-size: 13px">
                      {{ $t('Global.pending') }}
                    </span>
                  </el-option>
                  <el-option :label="$t('Global.cancel')" :value="2">
                    <span style="float: right; color: #8492a6; font-size: 13px">
                      {{ $t('Global.cancel') }}
                    </span>
                  </el-option>
                </el-select>
              </el-form-item>
            </CCol>
          </CRow>
        </el-form>
      </CCardBody>
      <span slot="footer" class="dialog-footer">
        <el-button @click="saveFinance('ruleForm')" @keyup.enter="saveFinance('ruleForm')" type="primary">{{ $t('Global.save') }}</el-button>
        <el-button @click="finance_dialog = false" style="margin: 10px">{{ $t('Global.cancel') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Show from '../components/Show';

export default {
  name: 'show',
  components: { Show },
  data() {
    return {
      isLoad: false,
      disabled: true,
      rejected: true,
      dialogVisible: false,
      ifComment: false,
      ifRejected: false,
      isPresident: false,
      form: {
        rejectReason: null,
        comment: null,
      },
      rules: {
        rejectReason: [
          {
            required: true,
            pattern: /^[^-\s][a-zA-Zا-ي0-9_\s-]+$/,
            message: 'من فضلك يجب كتابة الرساله',
            trigger: 'blur',
          },
        ],
        comment: [
          {
            required: true,
            pattern: /^[^-\s][a-zA-Zا-ي0-9_\s-]+$/,
            message: 'من فضلك يجب كتابة الرساله',
            trigger: 'blur',
          },
        ],
      },
      finance_dialog: false,
      ruleForm: {
        total: null,
        member: null,
        tax: null,
        stamp: null,
        bonus: null,
        status: null,
        discount: null,
        discount_note: null,
      },
      finance_id: null,
      type: null,
    };
  },
  computed: {
    system: function () {
      if (this.$store.state.user) {
        if (this.$store.state.user.system) {
          return this.$store.state.user.system;
        } else {
          false;
        }
      } else {
        false;
      }
    },
  },
  watch: {
    'ruleForm.discount': function (value) {
      if (this.ruleForm.discount) {
        this.ruleForm.discount = value.toString().replace(/[^0-9]/g, '');
      }
    },
    'ruleForm.bonus': function (value) {
      if (this.ruleForm.bonus) {
        this.ruleForm.bonus = value.toString().replace(/[^0-9]/g, '');
      }
    },
    'ruleForm.tax': function (value) {
      if (this.ruleForm.tax) {
        this.ruleForm.tax = value.toString().replace(/[^0-9]/g, '');
      }
    },
    'ruleForm.member': function (value) {
      if (this.ruleForm.member) {
        this.ruleForm.member = value.toString().replace(/[^0-9]/g, '');
      }
    },
    'ruleForm.total': function (value) {
      if (this.ruleForm.total) {
        this.ruleForm.total = value.toString().replace(/[^0-9]/g, '');
      }
    },
    'ruleForm.stamp': function (value) {
      if (this.ruleForm.stamp) {
        this.ruleForm.stamp = value.toString().replace(/[^0-9]/g, '');
      }
    },
  },
  methods: {
    init() {
      this.$store.dispatch('finance/submission', this.$route.params.id);
    },
    dialogOpen(id) {
      this.dialogVisible = true;
      this.id = id;
      this.$nextTick(_ => {
        document.getElementById('rejectReason').focus();
      });
    },
    sendReject(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let query = {
            note: String(this.form.rejectReason),
            status: 0,
          };
          this.isLoad = true;
          this.$store
            .dispatch('notes/changeSubState', {
              id: this.id,
              query: query,
            })
            .then(() => {
              this.dialogVisible = false;
              this.isLoad = false;
              if (this.ifRejected) {
                this.$notify.error({ message: `${this.$t('Global.sendRejectMessage')}` });
              } else {
                this.$notify.success({ message: `${this.$t('Global.sendRejectMessage')}` });
              }
              this.rejectReason = null;
              this.init();
            })
            .catch(_ => {
              this.isLoad = false;
            });
        }
      });
    },
    handleAccept() {
      this.$confirm(`${this.$t('Global.ensureBeforeRequest')}`, {
        confirmButtonText: `${this.$t('Global.accept')}`,
        cancelButtonText: `${this.$t('Global.cancel')}`,
        type: 'success',
      })
        .then(_ => {
          let query = { note: null, status: 1 };
          this.isLoad = true;
          this.$store
            .dispatch('notes/changeSubState', {
              id: this.$route.params.id,
              query: query,
            })
            .then(() => {
              this.$notify({
                type: 'success',
                message: `${this.$t('Global.successMessage')}`,
              });
              this.isLoad = false;
              this.init();
            });
        })
        .catch(_ => {
          this.isLoad = false;
        });
    },

    pre_sendReject(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let query = {
            note: String(this.form.rejectReason),
            status: 0,
          };
          this.isLoad = true;
          this.$store
            .dispatch('notes/preChangeSubState', {
              id: this.id,
              system: 1,
              query: query,
            })
            .then(() => {
              this.dialogVisible = false;
              this.$notify.success({ message: `${this.$t('Global.sendRejectMessage')}` });
              this.init();
            })
            .catch(_ => {
              this.isLoad = false;
            });
        }
      });
    },
    pre_handleAccept() {
      this.$confirm(`${this.$t('Global.ensureBeforeRequest')}`, {
        confirmButtonText: `${this.$t('Global.accept')}`,
        cancelButtonText: `${this.$t('Global.cancel')}`,
        type: 'success',
      })
        .then(_ => {
          let query = { status: 1 };
          this.isLoad = true;
          this.$store
            .dispatch('notes/preChangeSubState', {
              id: this.$route.params.id,
              system: 1,
              query: query,
            })
            .then(() => {
              this.$notify({
                type: 'success',
                message: `${this.$t('Global.successMessage')}`,
              });
              this.init();
            });
        })
        .catch(_ => {
          this.isLoad = false;
        });
    },

    openFinanceDialog(finance) {
      if (finance) {
        this.finance_id = finance.id;
        this.ruleForm.total = finance.total;
        this.ruleForm.tax = finance.tax;
        this.ruleForm.member = finance.member_id;
        this.ruleForm.stamp = finance.stamp;
        this.ruleForm.bonus = finance.bonus;
        this.ruleForm.discount = finance.discount;
        this.ruleForm.discount_note = finance.discount_note;
        this.ruleForm.status = finance.status;
      } else {
        (this.type = 'add'), (this.finance_id = null);
        this.ruleForm.total = null;
        this.ruleForm.tax = null;
        this.ruleForm.stamp = null;
        this.ruleForm.discount = null;
        this.ruleForm.discount_note = null;
        this.ruleForm.bonus = null;
        this.ruleForm.status = null;
      }
      this.finance_dialog = true;
    },
    saveFinance(form) {
      this.$store
        .dispatch('finance/saveBonus', {
          id: this.finance_id && !this.type ? `/${this.finance_id}` : '',
          query: this.ruleForm,
        })
        .then(_ => {
          this.finance_dialog = false;
          this.init();
        });
    },
    cancelBonus(id) {
      this.$store.dispatch('finance/cancelBonus', id).then(_ => {
        this.init();
      });
    },
  },
};
</script>

<style scoped></style>
