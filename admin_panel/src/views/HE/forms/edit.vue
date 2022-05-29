<template>
  <CRow v-if="hasPermission('edit_forms')">
    <CCol sm="12">
      <CCard>
        <CCardHeader>
          <div :class="$i18n.locale === 'ar' ? 'card-header-actions' : ''" style="display: inline-block">
            <CIcon name="cil-people" color="bg-primary"></CIcon>
            {{ $t('Global.forms') }}
          </div>
        </CCardHeader>
        <CCardBody dir="rtl" style="text-align: initial">
          <!-- {{ $store.getters['form/form'].questions }} -->
          <el-form label-position="top" :model="ruleForm" status-icon size="large" ref="ruleForm" label-width="120px" class="demo-ruleForm">
            <CRow>
              <CCol sm="6" v-for="(question, i) in $store.getters['form/form'].questions" :key="i">
                <el-form-item :label="$t('Global.question')">
                  <el-input :value="question.title"></el-input>
                </el-form-item>
              </CCol>
            </CRow>
          </el-form>
        </CCardBody>
        <template v-if="$store.state.user.allowHr || hasPermission('admin_system')">
          <CCardFooter>
            <div class="baseButton">
              <button class="el-button el-button--default is-round sec_color" @click="updateUser" type="reset" style="padding: 0.6rem 1rem">
                <i class="el-icon-check-circle"></i>
                {{ $t('Global.submit') }}
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
        id: 0,
        website: '',
        ar_name: '',
        temp_national_id: '',
        name: '',
        org_type: '',
        edu_type: '',
        governmental: '',
        education_type: '',
        address: '',
        phone: '',
        email: '',
        users: [],
        alt_email: '',
        fax: '',
        alt_fax: '',
        gender: '',
        alt_phone: null,
        social_name: null,
        birthdate: '',
        password: '',
        confirm_password: '',
      },
    };
  },

  mounted() {
    this.init();
  },
  // created() {
  //     if (this.$route.params.id) {
  //         this.show = false;
  //         this.getUserById((val) => {
  //             this.user = val.user;
  //         })
  //     }
  // },
  methods: {
    init() {
      this.$store.dispatch('form/form', this.$route.params.id).then(() => {
        this.ruleForm = this.$store.state.forms;
      });
    },
    updateUser() {
      if (this.$route.params.id) {
        user.update(this.user.id, this.user).then(response => {
          this.$toast.open('data updated');
        });
      } else {
        user
          .store(this.user)
          .then(response => {
            this.$toast.open('New User Added Success');
          })
          .catch(err => {
            this.$toast.error('The New User is Not Add');
          });
      }

      this.$router.push({ path: '/users' });
    },
  },
};
</script>
