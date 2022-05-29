<template>
  <CRow v-if="hasPermission('edit_forms')">
    <CCol sm="12">
      <CCard>
        <CCardHeader>
          <div :class="$i18n.locale === 'ar' ? 'card-header-actions' : ''" style="display: inline-block">
            <CIcon name="cil-people" color="bg-primary"></CIcon>
            {{ $t('Global.Rubrics') }}
          </div>
        </CCardHeader>
        <CCardBody dir="rtl" style="text-align: initial">
          <el-form :model="dynamicValidateForm" label-position="top" label-width="120px" ref="dynamicValidateForm" class="demo-ruleForm">
            <CRow>
              <CCol sm="6">
                <el-form-item
                  v-for="(rubric, index) in dynamicValidateForm.rubrics"
                  :key="rubric.key"
                  :label="`level-${index + 1}`"
                  :prop="'level.' + index + '.value'"
                  :rules="{
                    required: true,
                    message: 'rubric can not be null',
                    trigger: 'blur',
                  }"
                >
                  <el-input :placeholder="`level-${index + 1}`" v-model="rubric.value"></el-input>
                  <div v-if="index != 0" class="left_input ml-4 mr-4 remove_input" @click.prevent="removeDomain(rubric)"><i class="el-icon-remove" style="font-size: 22px"></i></div>
                  <div class="left_input remove_input" @click="addDomain"><i class="el-icon-circle-plus" style="font-size: 22px"></i></div>
                </el-form-item>
              </CCol>
            </CRow>
          </el-form>
        </CCardBody>
        <CCardFooter>
          <div class="baseButton">
            <button class="el-button el-button--default is-round sec_color" @click="updateUser" type="reset" style="padding: 0.6rem 1rem">
              <i class="el-icon-check-circle"></i>
              {{ $t('Global.submit') }}
            </button>
          </div>
        </CCardFooter>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
export default {
  name: 'organizationEdit',
  data() {
    return {
      dynamicValidateForm: {
        rubrics: [
          {
            key: 1,
            value: '',
          },
        ],
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
    // this.init();
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
    removeDomain(item) {
      var index = this.dynamicValidateForm.rubrics.indexOf(item);
      if (index !== -1) {
        this.dynamicValidateForm.rubrics.splice(index, 1);
      }
    },
    addDomain() {
      this.dynamicValidateForm.rubrics.push({
        key: Date.now(),
        value: '',
      });
    },
    init() {
      this.$store.dispatch('form/form', this.$route.params.id).then(() => {
        console.log('object', this.$store.getters['form/form']);
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

<style lang="scss">
.remove_input {
  top: 5px;
  left: 7px;
}
</style>
