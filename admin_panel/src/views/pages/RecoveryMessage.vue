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
                    <img class="logo shadow-sm  d-block" :src="logo" alt="" />
                  </div>
                </div>
                <div class="contBox">
                  <div dir="rtl" class="d-flex justify-content-between align-items-center">
                    <el-image src="/success.gif" style="width: 100px" class="d-block"></el-image>
                    <div class="activation">
                      <h4>تفعيل الحساب</h4>
                      <p class="text-muted mb-1"> برجاء فحص البريد الالكتروني لتأكيد البيانات </p>
                      <p class="text-muted">سيتم فحص البيانات خلال يومين عمل بحد اقصى</p>
                      <div class="d-block">
                        <router-link to="/login" color="el-button el-button--text custom_hover" class="px-0"> تسجيل الدخول</router-link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CCard>

            <!--            <CCard class="p-3">-->
<!--              <CCardBody>-->
<!--                <div dir="rtl" class="d-flex justify-content-between align-items-center" v-if="!isLoad">-->
<!--                  <div class="activation">-->
<!--                    <h4>تفعيل الحساب</h4>-->
<!--                    <p class="text-muted">سيتم مراجعة البيانات وإرسال رسالة تفعيل للحساب خلال يومين عمل</p>-->
<!--                  </div>-->
<!--                  <el-image src="/success.gif" style="width: 70px"></el-image>-->
<!--                </div>-->
<!--              </CCardBody>-->
<!--            </CCard>-->
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
export default {
  name: 'RecoveryMessage',
  data() {
    return {
      url: '/bg.jpg',
      logo: '/naqaaelogo.png'
    }
  }
};
</script>

<style scoped></style>
