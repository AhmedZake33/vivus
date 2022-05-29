<template>
    <el-image
            lazy
            style=" width: 30px;height: 30px;vertical-align: middle;border-radius: 50%;"
            :src="`${baseUrl}${url}`"
            fit="contain">
        <div slot="error" class="image-slot">
            <fa-icon
                    v-if="item.extension != 'html'"
                    :icon="['fas', 'file-alt']"
                    size="lg"
            />
            <fa-icon
                    v-if="item.extension == 'html'"
                    :icon="['fas', 'file-code']"
                    size="lg"
            />
        </div>
        <div slot="placeholder" class="image-slot">
            <CSpinner color="info" size="sm"/>
        </div>
    </el-image>
</template>

<script>
    export default {
        name: "image",
        props: {
            url: String,
            item:{}
        },
        data() {
            return {
                baseUrl: process.env.VUE_APP_BASE_URL,
            }
        }
    }
</script>

<style scoped>

</style>
