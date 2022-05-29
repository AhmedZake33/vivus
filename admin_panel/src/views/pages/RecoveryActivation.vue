<template>
  <div class="c-app flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol md="12">
          <CCardGroup>
              <CCardBody>
                <CCard class="border-0">
                  <div class="mainBox shadow-lg">
                    <div class="imgBox rounded-left">
                      <img :src="url" class="rounded-left bgImg" alt="" />
                      <div class="centerDiv">
                        <img class="logo shadow-sm  d-block" :src="logo" alt="" />
                      </div>
                    </div>
                    <div class="contBox">
                      <div dir="rtl" class="d-flex justify-content-between align-items-center" v-if="!isLoad">
                        <el-image src="/success.gif" style="width: 100px" class="d-block"></el-image>
                        <div class="activation">
                          <h4>تمت العملية بنجاح</h4>
                          <p class="text-muted"> برجاء الانتظار سوف يتم مراجعة الحساب خلال يومين عمل بحد اقصى</p>
                          <div class="d-block">
                            <router-link to="/login" color="el-button el-button--text custom_hover" class="px-0"> تسجيل الدخول</router-link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CCard>
              </CCardBody>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
export default {
  name: 'active',
  data() {
    return {
      isLoad: true,
      url: '/bg.jpg',
      logo: '/naqaaelogo.png'
    };
  },
  mounted() {
    this.active();
  },
  methods: {
    active: function () {
      this.isLoad = true;
      if (this.$route.params.token) {
        this.$store.dispatch('user/recoveryactive', { query: {token:this.$route.params.token}})
                .then(() => {
                  this.isLoad = false;
                }).catch(err => {
          this.$message({
            message: 'لم يتم تفعيل حسابك برجاء المحاولة مرة اخرة ',
            type: 'error',
          });
          this.isLoad = false;
        });
      }
    },
  },
};
</script>

<style lang="scss">
.custom_hover {
  opacity: 0.8;
  &:hover {
    opacity: 1;
  }
}
.activation * {
  text-align: right;
}
</style>
