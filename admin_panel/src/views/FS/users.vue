<template>
  <div>
    <CRow class="user_icons">
      <CCol v-if="$store.getters['finance/data']" :sm="12 / $store.getters['finance/data'].length" v-for="data in $store.getters['finance/data']">
        <router-link class="text-initial" to="">
          <CWidgetIcon class="pa-0 mr-0" :text="data.status ? (data.status == 2 ? $t('Global.finance_cancel') : $t('Global.finance_done')) : $t('Global.finance_pending')" :header="data.total" :color="data.status ? (data.status == 2 ? 'danger' : 'success') : 'warning'" :icon-padding="false">
            <i class="el-icon-money" style="font-size: 25px"></i>
          </CWidgetIcon>
        </router-link>
      </CCol>
    </CRow>
    <DataTable @reset="reset" :items="$store.getters['finance/bonuses']" :status_id="status" @Refresh="Refresh" :loading="$store.getters['finance/bonusesLoad']" :name="$t('Global.finance_users')" :total="$store.getters['finance/totalBonuses']" hidden_action icon="el-icon-money">
      <template #filter_table>
        <div class="ml-2 mr-2 mb-2 fullWidth">
          <el-select clearable :no-data-text="$t('Global.nodata')" v-model="status" ref="uni" filterable :placeholder="$t('Global.status')" style="width: 100%">
            <el-option :label="$t('Global.finance_done')" :value="1">
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{ $t('Global.finance_done') }}
                <i class="el-icon-office-building"></i>
              </span>
            </el-option>
            <el-option :label="$t('Global.finance_pending')" :value="0">
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{ $t('Global.finance_pending') }}
                <i class="el-icon-office-building"></i>
              </span>
            </el-option>
            <el-option :label="$t('Global.finance_cancel')" :value="2">
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{ $t('Global.finance_cancel') }}
                <i class="el-icon-office-building"></i>
              </span>
            </el-option>
            <template #prefix>
              <i class="el-icon-office-building" :dir="$i18n.locale === 'ar' ? 'rtl' : ''" style="font-size: 17px; line-height: 2.2; color: black; text-align: initial"></i>
            </template>
            <template #empty>
              <div class="text-center" style="padding: 10px; font-weight: bold">
                {{ $t('Global.nodata') }}
              </div>
            </template>
          </el-select>
        </div>
      </template>
      <template #cols>
        <el-table-column prop="name" width="300" :label="$t('Global.name')">
          <template slot-scope="scope">
            <router-link v-if="scope.row.user_id" class="d-block custom-link text_badge" :to="{ path: `/users/${scope.row.user_id}` }">
              {{ scope.row.ar_name ? scope.row.ar_name : '-' }}
            </router-link>
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
            {{scope.row.discount}}
            <CBadge color="info" class="p-1" v-if="scope.row.discount_note">
              {{scope.row.discount_note}}
            </CBadge>
          </template>
        </el-table-column>
        <el-table-column prop="total" :label="$t('Global.Total')"></el-table-column>
        <el-table-column prop="status" :label="$t('Global.status')">
          <template slot-scope="scope">
            <CBadge :color="scope.row.status ? (scope.row.status == 2 ? 'danger' : 'success') : 'warning'" class="p-1"> {{ scope.row.status ? (scope.row.status == 2 ? $t('Global.cancel') : $t('Global.Done')) : $t('Global.pending') }} </CBadge>
          </template>
        </el-table-column>
        <el-table-column prop="" label=" " v-if="hasPermission('admin_fs')">
          <template slot-scope="scope">
            <div :style="$i18n.locale === 'ar' ? 'text-align:left' : 'float: right;'">
              <i class="el-icon-edit table-action-item" @click="openFinanceDialog(scope.row)"></i>
              <i :class="scope.row.status == 2 ? 'el-icon-refresh table-action-item' : 'el-icon-delete table-action-item'" @click="cancelBonus(scope.row.id)"></i>
            </div>
          </template>
        </el-table-column>
      </template>
    </DataTable>
    <el-dialog :title="$t('Global.finance_users')" :visible.sync="finance_dialog" class="p-0" width="60%">
      <CCardBody dir="rtl" style="text-align: initial" class="p-0">
        <el-form label-position="top" :model="ruleForm" status-icon size="large" ref="ruleForm" label-width="120px" class="demo-ruleForm">
          <CRow>
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
              <el-form-item :rules="validation()" prop="discount" :label="$t('Global.discount')">
                <el-input :maxlength="10" :controls="false" clearable
                          :placeholder="$t('Global.discount')" v-model="ruleForm.discount" :min="0"
                          :step="Number(100)" style="width: 100%">
                  <i slot="suffix" class="el-icon-s-marketing"></i>
                </el-input>
              </el-form-item>
            </CCol>

            <CCol sm="6">
              <el-form-item :rules="validation()" prop="discount_note"
                            :label="$t('Global.discount_reason')">
                <el-input :placeholder="$t('Global.discount_reason')"
                          v-model="ruleForm.discount_note"></el-input>
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
import DataTable from '../components/DataTable';

export default {
  name: 'users',
  components: { DataTable },
  data() {
    return {
      finance_dialog: false,
      status: null,
      ruleForm: {
        total: null,
        tax: null,
        stamp: null,
        bonus: null,
        status: null,
        discount: null,
        discount_note: null,
      },
      finance_id: null,
    };
  },
  methods: {
    reset() {
      this.status = null;
    },
    Refresh(query) {
      this.$store.dispatch('finance/users', { query: { ...query, user_id: this.$route.params.user_id } });
    },
    openFinanceDialog(finance) {
      if (finance) {
        this.finance_id = finance.id;
        this.ruleForm.total = finance.total;
        this.ruleForm.tax = finance.tax;
        this.ruleForm.stamp = finance.stamp;
        this.ruleForm.bonus = finance.bonus;
        this.ruleForm.discount = finance.discount;
        this.ruleForm.discount_note = finance.discount_note;
        this.ruleForm.status = finance.status;
      }
      this.finance_dialog = true;
    },
    saveFinance(form) {
      this.$store
        .dispatch('finance/saveBonus', {
          id: this.finance_id ? `/${this.finance_id}` : '',
          query: this.ruleForm,
        })
        .then(_ => {
          this.finance_dialog = false;
          this.Refresh();
        });
    },
    cancelBonus(id) {
      this.$store.dispatch('finance/cancelBonus', id).then(_ => {
        this.Refresh();
      });
    },
  },
  watch: {
    status: function (val) {
      this.status = val;
    },
  },
};
</script>

<style scoped></style>
