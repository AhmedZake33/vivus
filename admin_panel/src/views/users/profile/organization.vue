<template>
    <CRow>
        <CCol col="12" lg="12" sm="12" v-if="hasPermission('show_users') || Auth.id == $route.params.id ">
            <Organizations :system="$route.params.system == '1' ? 'HE' : 'SC'" :user="Number($route.params.id)"></Organizations>
        </CCol>
    </CRow>
</template>

<script>
    import Organizations from "../../components/organizations";
    import Cookies from "js-cookie";
    export default {
        name: "organization",
        components: {Organizations},
        data(){
            return {
                Auth: JSON.parse(Cookies.get("user")),
            }
        }
    }
</script>

<style scoped>

</style>