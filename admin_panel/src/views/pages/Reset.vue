<template>
  <div class="c-app flex-row align-items-center">
    <div class="container-fluid p-5 rounded">
      <CRow class="justify-content-center">
        <CCol md="12">
          <CCardGroup>
            <CCard class="border-0">
              <div class="mainBox shadow-lg">
                <div class="imgBox rounded-left">
                  <img :src="url" class="rounded-left bgImg" alt="" />
                  <div class="centerDiv">
                    <img class="logo shadow-sm d-block" :src="logo" alt="" />
                  </div>
                </div>
                <div class="contBox">
                  <!--                                    <div style="width: 100%" v-if="status">-->
                  <CForm class="formBox p-3 pt-0 mt-n5" v-if="status">
                    <el-form label-position="top" status-icon size="large" ref="loginForm" label-width="120px" :model="loginForm" class="demo-ruleForm">
                      <h4 class="underline d-inline pb-1">نسيت كلمة المرور</h4>
                      <p class="text-muted mt-3">من فضلك قم بإدخال البريد الإلكتروني</p>
                      <el-form-item class="left_right" :rules="validation($t('Validation.email'), 'email')" prop="email">
                        <el-input prefix-icon="el-icon-message" :placeholder="$t('user.email')" v-model.trim="loginForm.email"></el-input>
                      </el-form-item>
                      <el-form-item class="mb-0 my-1">
                        <el-button type="primary" @click="reset('loginForm')" style="width: 100%; background-color: #3c4b64; border: 0; font-size: 12px" class="small pill">
                          <i class="el-icon-arrow-right el-icon-right"></i>
                          إرسال رابط التفعيل الي البريد الإلكتروني
                        </el-button>
                      </el-form-item>
                      <router-link to="/login" color="el-button el-button--text custom_hover" class="d-block px-0"><i class="el-icon-back"></i> العوده الي تسجيل الدخول </router-link>
                    </el-form>
                  </CForm>
                  <div style="width: 100%" v-else>
                    <div dir="rtl" class="d-flex justify-content-between align-items-center" style="padding: 55px">
                      <div class="activation text-center">
                        <h4>برجاء فحص البريد الالكترونى لتغير كلمة المرور</h4>
                        <p class="text-muted">برجاء فتح البريد الالكترونى الذى سجلت به لتغير كلمة المرور</p>
                      </div>
                    </div>
                  </div>
                  <CElementCover v-if="isLoad" :opacity="0.8">
                    <CSpinner size="5xl" color="info" />
                  </CElementCover>
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
    return {
      loginForm: {
        email: null,
      },
      isLoad: false,
      status: true,
      url: '/bg.jpg',
      logo: '/naqaaelogo.png',
    };
  },
  watch: {
    'loginForm.email'(value) {
      this.loginForm.email = value.replace(/ +/g, '');
    },
  },
  methods: {
    reset: function (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.isLoad = true;
          this.$store
            .dispatch('user/reset', { query: this.loginForm })
            .then(() => {
              this.$notify.success({
                message: `${this.$t('Global.successMessage')}`,
              });
              this.isLoad = false;
              this.status = false;
              if (this.$store.state.user.recoveryMode) {
                this.$router.push('/recovery');
              }
              // this.$router.push("/login");
            })
            .catch(err => {
              this.isLoad = false;
            });
        }
      });
    },
    BackToLogin: function () {
      this.$router.push('/login');
    },
  },
};
</script>

<style lang="scss">
.pill {
  border-radius: 30px;
  opacity: 0.9;

  &:hover {
    opacity: 1;
  }
}

.mainBox .contBox .formBox input {
  direction: rtl;
}

.el-form-item__error {
  right: 0 !important;
}

.underline {
  border-bottom: 2px solid #eee;
}

.ar .el-input .el-input__suffix {
  left: 20px;
}

.centerDiv {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.mainBox {
  position: relative;
  top: 0;
  height: 80vh;
  width: 100%;
  display: flex;

  .imgBox {
    position: relative;
    width: 50%;
    height: 100%;

    .logo {
      width: 70%;
      height: auto;
      object-fit: contain;
      background-color: #fff;
      border-radius: 62px;
      padding: 10px;
      //   margin-left: -20rem;
    }

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: transparent;
      z-index: 999;
      mix-blend-mode: screen;
    }

    .bgImg {
      position: absolute;
      opacity: 0.2;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .contBox {
    position: relative;
    width: 50%;
    height: 80vh;
    display: flex;
    justify-content: center;
    align-items: center;

    .formBox {
      text-align: right;
      width: 60%;

      input {
        padding-right: 1.8rem;
      }

      input:-webkit-autofill,
      input:-webkit-autofill:hover,
      input:-webkit-autofill:focus,
      textarea:-webkit-autofill,
      textarea:-webkit-autofill:hover,
      textarea:-webkit-autofill:focus,
      select:-webkit-autofill,
      select:-webkit-autofill:hover,
      select:-webkit-autofill:focus {
        border: 1px solid #777;
        -webkit-text-fill-color: #777;
        -webkit-box-shadow: 0 0 0px 1000px #fff inset;
        transition: background-color 5000s ease-in-out 0s;
      }
    }
  }
}

@media only screen and (max-width: 820px) {
  .underline {
    border-bottom: 2px solid #555;
  }
  .centerDiv {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    margin-top: 1rem;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .mainBox {
    .imgBox {
      position: absolute !important;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;

      .logo {
        width: 60%;
        margin-top: -2.8rem;
      }

      .bgImg {
        opacity: 0;
      }
    }

    .contBox {
      position: absolute;
      width: 100%;
      height: 80vh;
      top: 1.5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 999;

      .formBox {
        text-align: right;
        width: 80%;

        input {
          opacity: 0.8;
        }
      }
    }
  }
}
</style>
