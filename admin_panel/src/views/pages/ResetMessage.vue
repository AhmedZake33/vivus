<template>
  <div class="c-app flex-row align-items-center">
    <CContainer>
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
                  <div dir="rtl" class="d-flex justify-content-between align-items-center">
                    <el-image src="/success.gif" style="width: 100px" class="d-block"></el-image>
                    <div class="activation">
                      <h4>تمت العملية بنجاح</h4>
                      <p class="text-muted">تم تغير كلمة المرور بنجاح برجاء تسجيل الدخول</p>
                      <div class="d-block">
                        <router-link to="/login" color="el-button el-button--text custom_hover" class="px-0"> تسجيل الدخول</router-link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
export default {
  name: 'ActivationMessage',
  data() {
    return {
      url: '/bg.jpg',
      logo: '/naqaaelogo.png',
    };
  },
};
</script>

<style scoped></style>
