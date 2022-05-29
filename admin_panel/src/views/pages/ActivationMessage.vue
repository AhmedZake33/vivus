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
                                            <h4>برجاء تفعيل الحساب الخاص بك </h4>
                                            <p class="text-muted">
                                                برجاء فتح البريد الإلكتروني الذى سجلت به وتفعيل الحساب
                                            </p>
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
        name: "ActivationMessage",
        data() {
            return {
                url: '/bg.jpg',
                logo: '/naqaaelogo.png'
            }
        }
    }
</script>

<style scoped>

</style>