<template>
    <CRow  v-if="hasPermission('show_users') || Number(Auth.id) === Number($route.params.id)">
        <div v-model="locale = $i18n.locale" ></div>
        <CCol sm="3"  v-for="archive in $store.getters['user/archives']" >
            <router-link v-if="archive"  :to="{ path: `/users/user/archives/archive/${archive.id}`.toString() }">
                <CWidgetProgressIcon
                        :header="(archive.title == $route.params.id)? $t('Global.myFiles'): archive.title"
                        color="info"
                        :value="100"
                        style="text-align: initial"
                        v-loading="$store.getters['user/archiveLoad']"
                >
                    <i class="el-icon-folder"></i>
                </CWidgetProgressIcon>
            </router-link>
        </CCol>
    </CRow>
</template>

<script>
    import Cookies from "js-cookie";
    import Archive from '../../managment/archive/index';
    export default {
        name: "archive",
        components:{Archive},
        data() {
            return {
                Auth: JSON.parse(Cookies.get("user")),
                locale:this.$i18n.locale
            }
        },
        watch: {
            locale: function (val) {
                this.$store.dispatch('user/archive',{id:this.$route.params.id , query:{lang:val}})
            },
        },
        mounted() {
            this.$store.dispatch('user/archive',{id:this.$route.params.id , query:{lang:this.$i18n.locale}})
        },
    }
</script>

<style scoped>

</style>