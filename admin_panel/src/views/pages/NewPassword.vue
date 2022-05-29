<template>
  <div class="c-app flex-row align-items-center">
    <div class="container-fluid p-5 rounded ">
      <CRow class="justify-content-center">
        <CCol md="12">
          <CCardGroup>
            <CCard class="border-0">
              <div class="mainBox shadow-lg">
                <div class="imgBox rounded-left">
                  <img :src="url" class="rounded-left bgImg" alt="" />
                  <div class="centerDiv">
                    <img class="logo shadow-sm  d-block" :src="logo" alt="" />
                  </div>
                </div>
                <div class="contBox">
                  <!--                                    <div style="width: 100%" v-if="status">-->
                  <CForm class="formBox  p-3 pt-0 mt-n5">
                    <el-form :rules="rules" :model="loginForm" label-position="top" status-icon size="large" ref="loginForm" label-width="120px" class="demo-ruleForm">
                      <h4 class="underline d-inline pb-1">نسيت كلمة المرور</h4>
                      <p class="text-muted mt-3">
                        من فضلك قم بادخال كلمة المرور الجديده
                      </p>
                      <el-form-item prop="password" class="password left_right">
                        <input class="hideInput" type="password" name="fakepasswordremembered" />
                        <el-input prefix-icon="el-icon-lock" type="password" :placeholder="$t('user.password')" v-model.trim="loginForm.password" autocomplete="off"></el-input>
                      </el-form-item>
                      <el-form-item prop="confirm_password" class="left_right mt-5">
                        <el-input prefix-icon="el-icon-lock" type="password" :placeholder="$t('user.confirm_password')" v-model.trim="loginForm.confirm_password" autocomplete="off"></el-input>
                      </el-form-item>
                      <el-form-item class="mb-0 my-1">
                        <el-button type="primary" style=" background-color: #3c4b64; border:0; font-size: 12px;" class="small custom_hover" @click="ChangePass('loginForm')">
                          تغير كلمة المرور
                          <i class="el-icon-arrow-right el-icon-right"></i>
                        </el-button>
                      </el-form-item>
                      <el-button icon="el-icon-back" @click="BackToLogin" type="text">العوده الي تسجيل الدخول </el-button>
                    </el-form>
                  </CForm>
                  <CElementCover v-if="isLoad" :opacity="0.8">
                    <CSpinner size="5xl" color="info" />
                  </CElementCover>
                  <!--                                    </div>-->
                </div>
              </div>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    var validatePass = (rule, value, callback) => {
      if (value) {
        if (value.search(/[A-Z]/) == -1) {
          callback(new Error('يجب ان تحتوي كلمة المرور علي 8 حروف وارقام (حرف كبير ورمز واحد علي الأقل)'));
        } else if (value.search(/[@\#\!\_\$\%\^\&\*\(\)\~\*\-\?\>\<\}\{\}]/) == -1) {
          callback(new Error('يجب ان تحتوي كلمة المرور علي 8 حروف وارقام (حرف كبير ورمز واحد علي الأقل)'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    var validateConfirmPass = (rule, value, callback) => {
      var regularExpression = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
      if (value === '') {
        callback(new Error('يجب ان تكون كلمة المرور متشابهة'));
      } else if (value !== this.loginForm.password) {
        callback(new Error('يجب ان تكون كلمة المرور متشابهة'));
      } else {
        callback();
      }
      //   else if(!regularExpression.text(value)){
      //      callback(new Error('يجب ان تحتوي كلمة المرور علي رموز'));
      //   }
    };
    return {
      loginForm: {
        password: '',
        confirm_password: '',
      },
      rules: {
        password: [{ validator: validatePass, trigger: 'blur' }, { required: true, message: 'من فضلك يجب إدخال  كلمة المرور', trigger: 'blur' }, { trigger: 'blur' }, { min: 8, message: 'يجب ان تحتوي كلمة المرور علي 8 حروف وارقام (حرف كبير ورمز واحد علي الأقل)' }],
        confirm_password: [{ validator: validateConfirmPass, trigger: 'blur' }],
      },
      isLoad: false,
      url: '/bg.jpg',
      logo: '/naqaaelogo.png',
    };
  },
  methods: {
    ChangePass: function(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.isLoad = true;
          this.$store
            .dispatch('user/resetPassword', {
              query: {
                password: this.loginForm.password,
                confirm_password: this.loginForm.confirm_password,
                token: this.$route.params.token,
              },
            })
            .then(() => {
              this.isLoad = false;
              this.$router.push('/resetmessage');
            })
            .catch(err => {
              this.isLoad = false;
            });
        }
      });
    },
    BackToLogin: function() {
      this.$router.push('/login');
    },
  },
};
</script>

<style lang="scss">
.custom_hover {
  opacity: 0.9;
  &:hover {
    opacity: 1;
  }
}
</style>
