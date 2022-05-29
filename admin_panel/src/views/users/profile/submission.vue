<template>
    <CRow>
        <CCol col="12" lg="12" sm="12" v-if="hasPermission('show_users') || Auth.id == $route.params.id">
            <Submissions :system="$route.params.system == '1' ? 'HE' : 'SC'" :user="Number($route.params.id)" @init="init"></Submissions>
        </CCol>
    </CRow>
</template>

<script>
    import Cookies from "js-cookie";
    import Submissions from "../../components/submissions";

    export default {
        name: "submission",
        components: {Submissions},
        data(){
            return {
                Auth: JSON.parse(Cookies.get("user")),
            }
        },
        methods:{
            init(query) {
                this.$store.dispatch('submission/submissions', {query: query});
            },
        }
    }
</script>

<style scoped>

</style>