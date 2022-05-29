<template>
  <div class="c-app flex-row align-items-center">
    <div class="container-fluid p-5 rounded">
      <CRow class="justify-content-center">
        <CCol md="12">
          <CCardGroup>
            
            <CCard class="border-0" >
              <div class="mainBox shadow-lg">
                <div class="imgBox rounded-left">
                  <img :src="url" class="rounded-left bgImg" alt="" />
                  <div class="centerDiv">
                    <img class="logo shadow-sm d-block" :src="logo" alt="" />
                  </div>
                </div>
                <div class="contBox">
                  <CForm class="formBox p-3 pt-0 mt-n5">
                    <el-form label-position="top" @keyup.enter.native="login('ruleForm')" :rules="rules" :model="loginForm" status-icon size="large" ref="ruleForm" label-width="120px" class="demo-ruleForm">
                      <h1 class="underline d-inline pb-1 custom_font_size">تسجيل الدخول</h1>
                      <p class="text-muted mt-3">تسجيل الدخول الي النظام</p>
                      <el-form-item prop="email" class="left_right">
                        <el-input id="username" name="username" prefix-icon="el-icon-message" :placeholder="$t('user.email')" @keydown.space.prevent v-model="loginForm.email"></el-input>
                      </el-form-item>

                      <el-form-item prop="password" class="left_right">
                        <el-input name="password" id="password" prefix-icon="el-icon-lock" type="password" :placeholder="$t('user.password')" v-model.trim="loginForm.password" autocomplete="off"></el-input>
                      </el-form-item>
                      <!-- <CCol col="6" class="text-right"> -->
                      <router-link to="/reset" color="el-button el-button--text custom_hover" class="d-block px-0">هل نسيت كلمة المرور ؟</router-link>
                      <router-link to="/recovery/fix" color="el-button el-button--text custom_hover" class="px-0">هل تواجه مشكلة في الدخول ؟</router-link>
                      <!-- </CCol> -->
                      <CRow class="d-flex align-items-center justify-content-between">
                        <CCol col="12">
                          <el-form-item class="mb-0 my-1">
                            <el-button type="primary" @click="login('ruleForm')" style="width: 100%; background-color: #3c4b64; border: 0; font-size: 12px" class="small pill">
                              <i class="el-icon-arrow-right el-icon-right"></i>
                              دخول
                            </el-button>
                          </el-form-item>
                        </CCol>
                      </CRow>
                      <!-- <CButton color="link" class="pr-0"> انشاء حساب جديد</CButton> -->
                      <span class="font-weight-lighter">ليس لديك حساب ؟</span><router-link to="/register" color="el-button el-button--text custom_hover" class="px-0"> انشاء حساب جديد</router-link>
                    </el-form>
                  </CForm>
                  <CElementCover v-if="isLoad" :opacity="0.8">
                    <CSpinner size="5xl" color="info" />
                  </CElementCover>
                </div>
              </div>
            </CCard>
            <!-- <CCard class="border-0" v-else>
              <div class="mainBox shadow-lg">
                <div class="imgBox rounded-left">
                  <img :src="url" class="rounded-left bgImg" alt="" />
                  <div class="centerDiv">
                    <img class="logo shadow-sm d-block" :src="logo" alt="" />
                  </div>
                </div>
                <div class="contBox">
                  <div dir="rtl" class="d-flex justify-content-between align-items-center">
                    <i class="el-icon-warning" style="font-size: 100px"></i>
                    <div class="activation">
                      <h4>جارى تحديث النظام</h4>
                      <p class="text-muted">النظام الالكترونى مغلق فى المدة من  27/1/2022   الى   29/1/2022   للتحديث</p>
                    </div>
                  </div>
                </div>
              </div>
            </CCard> -->
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
      url: '/bg.jpg',
      logo: '/naqaaelogo.png',
      loginForm: {
        email: '',
        password: '',
      },
      rules: {
        email: [{ required: true, message: 'من فضلك يجب ادخال البريد الالكتروني', trigger: 'blur' }, { trigger: 'blur' }],
        password: [{ required: true, message: 'من فضلك يجب ادخال   كلمة المرور', trigger: 'blur' }, { trigger: 'blur' }],
      },
      isLoad: false,
    };
  },
  watch: {
    'loginForm.email'(value) {
      this.loginForm.email = value.replace(/ +/g, '');
    },
    'loginForm.password'(value) {
      this.loginForm.password = value.replace(/ +/g, '');
    },
  },
  methods: {
    login: function (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.isLoad = true;
          this.$store
            .dispatch('user/login', this.loginForm)
            .then(() => {
              this.isLoad = false;
              if (this.$store.state.user.recoveryMode) {
                this.$router.push('/recovery');
              } else {
                this.$router.push('/');
              }
            })
            .catch(err => {
              this.isLoad = false;
            });
        } else {
          return false;
        }
      });
    },
    Register: function () {
      this.$router.push('/register');
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
  .custom_font_size {
    font-size: 20px;
    div {
      font-size: 10px;
    }
    &.c-subheader {
      overflow: hidden;
    }
    .breadcrumb {
      flex-wrap: nowrap;
      padding-left: 0;
      padding-right: 0;
      overflow: hidden;
      width: 80%;
      //  height: 30px; /* 40px - more place for scrollbar, is hidden under parent box */
      white-space: nowrap;
      overflow-x: auto;
      overflow-y: hidden;
      -webkit-overflow-scrolling: touch;
      li {
        padding: 0 !important;
        font-size: 12px;
      }
    }
  }
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
