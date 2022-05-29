<template>
    <CCol col="12" lg="12" sm="12" >
         <Archive notArchiveRoot :archive_id="Number($route.params.id)"></Archive>
    </CCol>
</template>

<script>
    import Archive from "../../managment/archive/index";
    export default {
        name: "showArchive",
        components: {Archive},
        destroyed(){
            
        }
    }
</script>

<style scoped>

</style>