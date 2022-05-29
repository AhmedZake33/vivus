<template>
  <div id="print">
    <CRow class="user_icons">
      <CCol v-if="$store.state.finance.extraction" :md="12 / $store.getters['finance/extraction'].length" v-for="data in $store.getters['finance/extraction']">
        <router-link class="text-initial" to="">
          <CWidgetIcon v-if="data.key == 'hanging'" class="pa-0 mr-0" :text="data.value ? $t(`Global.yes`) : $t(`Global.no`)" :header="$t(`Global.${data.key}`)" :color="data.value == 0 ? 'success' : 'danger'" :icon-padding="false">
            <i class="el-icon-money" style="font-size: 25px"></i>
          </CWidgetIcon>
          <CWidgetIcon v-else class="pa-0 mr-0" :text="data.value || '-'" :header="$t(`Global.F${data.key}`)" :color="data.value ? (data.value == 2 ? 'danger' : 'success') : 'warning'" :icon-padding="false">
            <i class="el-icon-money" style="font-size: 25px"></i>
          </CWidgetIcon>
        </router-link>
      </CCol>
    </CRow>
    <Show v-if="$store.state.finance.wallet" :loading="$store.getters['finance/load']" icon="el-icon-message" :items="$store.getters['finance/wallet']" @init="init" :name="$t('Global.wallet')">
      <!-- <template #show_action v-if="(system == 2 && ($store.state.user.allowPu || hasPermission('admin_system'))) || (system == 1 && ($store.state.user.allowHr || hasPermission('admin_system'))) || system == 3">
        <i class="el-icon-printer mr-2 pointer print_hide" style="font-size: 17px" @click="print('print', `${$store.state.finance.submission.name} - ${$store.state.finance.submission.university}`)"></i>
        <div :class="isLoad ? 'disabledAll' : ''" v-if="$store.state.finance.status && hasPermission('finance_approval')">
          <el-button icon="el-icon-check" @click="system == 1 ? handleAccept() : pre_handleAccept()" round size="mini" class="mx-1 right_icon" type="success"> {{ $t('Global.accept_finance') }} </el-button>
          <el-button icon="el-icon-close" @click="dialogOpen($route.params.id)" round size="mini" class="mx-1 right_icon" type="danger"> {{ $t('Global.refuse_finance') }} </el-button>
        </div>
      </template> -->
      <template #show_action>
        <a class="mx-1" :href="`${baseUrl}credit/document/${$route.params.id}`" target="_blank">
          <fa-icon :icon="['fas', 'file-pdf']" size="md"/>
        </a>
      </template>
      <template #show_status>
        <span v-if="$store.state.finance.wallet">
          <CBadge color="success" v-if="$store.state.finance.wallet.system">{{ $store.state.finance.wallet.system == 1 ? $t('Global.HEstatistc') : $t('Global.SCstatistc') }}</CBadge>
        </span>
      </template>
      <template #other_data>
        <tr v-if="$store.state.finance.wallet">
          <th scope="row" width="20%">{{ $t('Global.organization') }}</th>
          <td width="80%">
            <router-link v-if="$store.state.finance.wallet" :to="hasPermission('access_organizations') ? { path: $store.state.finance.wallet.organization_id ? `/higher/organization/${$store.state.finance.wallet.organization_id}` : '' } : ''">
              {{ $store.state.finance.wallet.name ? $store.state.finance.wallet.name : $store.state.finance.wallet.temp_organization_name ? $store.state.finance.wallet.temp_organization_name : '' }}
            </router-link>
          </td>
        </tr>
      </template>
    </Show>
<!--    <Wallet transaction :parent_id="Number($route.params.id)">-->
<!--      <template #add>-->
<!--        <div @click="dialogOpen(null)" class="item">-->
<!--          {{ $t('Global.addTransaction') }}-->
<!--        </div>-->
<!--      </template>-->
<!--    </Wallet>-->
    <Submissions :system="$store.state.finance.wallet && $store.state.finance.wallet.system ? this.$store.state.finance.wallet.system : 2" :credit_id="$route.params.id"></Submissions>

    <el-dialog @close="ruleForm.gp_id = null" :title="$t('Global.transactionGp')" :visible.sync="gp_dialog" class="p-0" width="60%">
      <CCardBody dir="rtl" style="text-align: initial" class="p-0">
        <el-form label-position="top" :model="ruleForm" status-icon size="large" ref="ruleForm" label-width="120px" class="demo-ruleForm">
          <CRow>
            <CCol sm="12">
              <el-form-item :label="$t('Global.gp_code')">
                <el-select clearable :no-data-text="$t('Global.nodata')" v-model="ruleForm.gp_id" ref="gp_code" filterable :placeholder="$t('Global.gp_code')" style="width: 100%">
                  <el-option v-for="item in $store.getters['finance/gps']" :key="item.id" :label="item.name" :value="item.id">
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
          </CRow>
        </el-form>
      </CCardBody>
      <span :class="isLoad ? 'disabledAll' : ''" slot="footer" class="dialog-footer">
        <el-button @click="saveGp('ruleForm')" @keyup.enter="saveGp('ruleForm')" type="primary">{{ $t('Global.save') }}</el-button>
        <el-button @click="gp_dialog = false" style="margin: 10px">{{ $t('Global.cancel') }}</el-button>
      </span>
    </el-dialog>

    <el-dialog @close="type = null" :title="$t('Global.transaction')" :visible.sync="finance_dialog" class="p-0" width="60%">
      <CCardBody dir="rtl" style="text-align: initial" class="p-0">
        <el-form label-position="top" :model="ruleForm" status-icon size="large" ref="ruleForm" label-width="120px" class="demo-ruleForm">
          <CRow>
            <CCol sm="6">
              <el-form-item prop="pay_number" :label="$t('Global.pay_number')">
                <el-input :placeholder="$t('Global.pay_number')" v-model="ruleForm.pay_number"></el-input>
              </el-form-item>
            </CCol>

            <CCol sm="6">
              <el-form-item :rules="validation(false, 1)" :label="$t('Global.payment_date')" prop="payment_date">
                <el-date-picker @focus="changePicker" format="yyyy-MM-d" value-format="yyyy-MM-d" clearable style="width: 100%" v-model="ruleForm.payment_date" type="date" :placeholder="$t('Global.payment_date')"></el-date-picker>
              </el-form-item>
            </CCol>

            <CCol sm="6">
              <el-form-item :rules="validation()" prop="amount" :label="$t('Global.balance')">
                <el-input :maxlength="10" :controls="false" clearable :placeholder="$t('Global.balance')" v-model="ruleForm.amount" :min="0" :step="Number(100)" style="width: 100%">
                  <i slot="suffix" class="el-icon-s-marketing"></i>
                </el-input>
              </el-form-item>
            </CCol>
            <CCol sm="6" class="el-form-item el-form-item--feedback is-required el-form-item--large">
              <strong class="el-form-item__label">{{ $t('Global.attachment') }}</strong>
              <el-form-item :show-message="filesError ? true : false" :error="filesError ? filesError : ''" prop="file" class="p-0 left_right">
                <div class="mb-2 box-card docs_body edit_upload border rounded text docs d-flex justify-content-between align-items-center">
                  <div>
                    <a class="custom_link" v-if="doc" download target="_blank" :href="doc">
                      <span style="line-height: 18px; text-align: initial" class="el-form-item__label mx-1">{{ $t('Global.download') }}</span>
                    </a>
                  </div>
                  <FormUpload v-if="doc" @deleteFile="deleteFile" :title="$t('Global.download')" type="editSubFile" :label="finance_id" :index="finance_id" @getFile="upload"></FormUpload>
                  <FormUpload v-else type="subFile" title="الدفع المجمع" :label="55" :index="55" @getFile="upload"></FormUpload>
                </div>
              </el-form-item>
            </CCol>
          </CRow>
        </el-form>
      </CCardBody>
      <span :class="isLoad ? 'disabledAll' : ''" slot="footer" class="dialog-footer">
        <el-button @click="saveFinance('ruleForm')" @keyup.enter="saveFinance('ruleForm')" type="primary">{{ $t('Global.save') }}</el-button>
        <el-button @click="finance_dialog = false" style="margin: 10px">{{ $t('Global.cancel') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Show from '../../components/Show';
import Wallet from './wallets.vue';
import Submissions from './submissions.vue';
import { EventBus } from '../../../main';
import FormUpload from '@/views/components/FormUpload';

export default {
  name: 'show',
  components: { Show, FormUpload, Wallet, Submissions },
  data() {
    return {
      isLoad: false,
      baseUrl: process.env.VUE_APP_BASE_URL,
      disabled: true,
      rejected: true,
      dialogVisible: false,
      ifComment: false,
      ifRejected: false,
      isPresident: false,
      doc: null,
      file: [],
      file_list: [],
      filesError: false,
      errorFile: false,
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
        amount: null,
        pay_number: null,
        gp_id: null,
        payment_date: null,
      },
      gp_dialog: false,
      finance_id: null,
      type: null,
      data: [{ name: 'test', total_balance: '200', pull_balance: '2035', rest: '200000' }],
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
    exchanges() {
      if (this.$store.state.finance.exchanges) {
        return this.$store.state.finance.exchanges;
      } else {
        return null;
      }
    },
  },
  watch: {
    'ruleForm.amount': function (value) {
      if (this.ruleForm.amount) {
        this.ruleForm.amount = value.toString().replace(/[^0-9]/g, '');
      }
    },
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

    changePicker() {
      this.$nextTick(() => {
        let picker = document.querySelectorAll('.el-picker-panel .el-date-picker__header .el-date-picker__header-label');
        picker.forEach((element, i) => {
          if (i == 1) {
            element.style.position = 'absolute';
            element.style.top = '15px';
          }
        });
      });
    },
    init() {
      this.$store.dispatch('finance/wallet', this.$route.params.id);
    },
    openGpDialog(item) {
      if (item) {
        this.ruleForm.gp_id = item.gp_id;
        this.finance_id = item.id;
      } else {
        this.ruleForm.gp_id = null;
        this.finance_id = null;
      }
      this.gp_dialog = true;
    },
    dialogOpen(item) {
      if (item) {
        this.finance_id = item.id;
        this.doc = item.url;
        this.ruleForm.amount = item.amount;
        this.ruleForm.payment_date = item.payment_date;
        this.ruleForm.pay_number = item.pay_number;
        this.ruleForm.system = item.system;
        this.ruleForm.name = item.name;
      } else {
        this.finance_id = null;
        this.doc = null;
        this.ruleForm.amount = null;
        this.ruleForm.payment_date = null;
        this.ruleForm.pay_number = null;
        this.ruleForm.system = null;
        this.ruleForm.name = null;
      }
      this.finance_dialog = true;
    },
    saveGp(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let query = {
            gp_id: this.ruleForm.gp_id,
          };
          this.isLoad = true;
          this.$store
            .dispatch('finance/saveGpTransfer', {
              id: this.finance_id ? this.finance_id : '',
              query: query,
            })
            .then(_ => {
              this.gp_dialog = false;
              this.isLoad = false;
              this.init();
              let query = {};
              let obj;
              let allQuery;
              obj = { parent_id: this.$route.params.id };
              allQuery = { ...query, ...obj };
              this.$store.dispatch('finance/wallets', { query: allQuery });
            });
        }
      });
    },
    saveFinance(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let formData = new FormData();
          for (const [key, value] of Object.entries(this.ruleForm)) {
            if (value || value == 0) {
              formData.append(key, value);
            }
          }
          this.file.forEach((element, i) => {
            formData.append('file', element.file);
          });
          if (this.$route.params.id) {
            formData.append('parent_id', this.$route.params.id);
          }
          if (formData.has('file') || this.doc) {
            this.isLoad = true;
            this.$store
              .dispatch('finance/saveTransaction', {
                id: this.finance_id ? this.finance_id : '',
                query: formData,
              })
              .then(_ => {
                this.finance_dialog = false;
                this.isLoad = false;
                this.init();
                let query = {};
                let obj;
                let allQuery;
                obj = { parent_id: this.$route.params.id };
                allQuery = { ...query, ...obj };
                this.$store.dispatch('finance/wallets', { query: allQuery });
              });
          }
        }
      });
    },
    upload(file, num) {
      if (file) {
        this.file[num - 2] = file;
      }
    },
    deleteFile(file) {
      this.file = this.file.filter(myfile => file.name != myfile.file.name);
    },
    cancelBonus(id) {
      this.$store.dispatch('finance/cancelBonus', id).then(_ => {
        this.init();
      });
    },
  },
  mounted() {
    this.init();
  },
  created() {
    EventBus.$on('openTransactionDialog', this.dialogOpen);
    EventBus.$on('openTransactionGpDialog', this.openGpDialog);
  },
};
</script>

<style scoped></style>
