<template>
    <CRow>
        <CCol col="12" lg="12">
            <Show :loading="$store.getters['logs/logLoad']" font-icon="cil-speedometer"
                  :items="$store.getters['logs/log']" @init="init"
                  :name="$t('Global.general')" except="user">
                <template #custom_show>
                    <span v-for="(log, i) in $store.getters['logs/log']" :key="i">
                      <span v-show="log.key === 'user'" v-if="log.value">
                          <router-link :to="{ path: `/users/${log.value.id}` }">
                              <i class="el-icon-user-solid"></i>
                            {{ log.value.ar_name  }}
                          </router-link>
                      </span>
                    </span>
                </template>
                <template #bottom_other_data>
                    <tr v-for="(log, i) in $store.getters['logs/log']" :key="i+3" v-if="log.key === 'url'">
                        <th scope="row" width="26%">{{ $t(`Global.showCurrentLog`) }}</th>
                        <td width="80%"> <router-link :to="log.value" v-if="log.value">{{$t('Global.goToPage')}}</router-link> </td>
                    </tr>
                </template>
            </Show>
        </CCol>
        <CCol col="12" lg="6">
            <Show :loading="$store.getters['logs/logLoad']" font-icon="cil-speedometer"
                  :items="$store.getters['logs/logOldValue']"
                  :name="$t('Global.oldValue')" big_th>
            </Show>

        </CCol>
        <CCol col="12" lg="6">
            <Show :loading="$store.getters['logs/logLoad']" font-icon="cil-speedometer"
                  :items="$store.getters['logs/logNewValue']"
                  :name="$t('Global.newValue')" big_th>
            </Show>
        </CCol>
    </CRow>
</template>

<script>
    import Show from "../../components/Show";

    export default {
        name: "log",
        components: {Show},
        methods: {
            init() {
                this.$store.dispatch("logs/getLog", this.$route.params.id);
            }
        }
    };
</script>

<style scoped></style>
