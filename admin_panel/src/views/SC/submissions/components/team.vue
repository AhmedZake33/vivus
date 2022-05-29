<template>
  <div>
    <CRow class="user_icons animate">
      <el-alert effect="dark" class="mb-2 mx-3" :title="$t('Global.attention')" type="warning" show-icon>
        <div class="d-flex">
          <span>
            {{ $t('Global.teamConfirm') }}
          </span>
        </div>
      </el-alert>
    </CRow>
    <div class="mt-3 mr-0 rounded docs_header d-flex justify-content-between align-items-center">
      <span>{{ $t(`Global.${label}`) }}</span>
    </div>
    <div class="d-flex flex-wrap">
      <div v-for="member in team" class="round p-1 border mr-1 ml-1 mb-2 text custom_item docs d-flex justify-content-between align-items-center">
        <div class="round">
          <router-link :to="`/users/${member.id}`">
            {{ member.name }}
          </router-link>
        </div>
        <div class="d-flex align-items-center ml-1 mr-1">
          <span v-if="!member.leader_approved && label == 'team' && !member.approved" class="mx-1 small text-danger">{{ $t('Global.waitLeader') }}</span>
          <i class="el-icon-circle-check text-success" v-if="member.approved"></i>
          <div v-else-if="!member.approved && member.can" class="d-flex">
            <el-button @click="handleAccept" round size="mini" class="mr-2 ml-2" type="success">{{ $t(`Global.accept`) }} </el-button>
          </div>
          <div v-if="hasPermission('stage_update')">
            <el-button @click="removeSignature($route.params.id)" round size="mini" class="mx-1 right_icon" type="danger">
              <template>
                {{ $t('Global.removeSignature') }}
              </template>
            </el-button>
          </div>
          <i class="el-icon-circle-close text-danger" v-else-if="!member.approved"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'team',
  props: {
    team: Array,
    label: String,
    canReject: { default: false, type: Boolean },
  },
  methods: {
    handleAccept() {
      this.$emit('action', true);
    },
    removeSignature(id) {
      this.$confirm(`${this.$t('Global.ensureBeforeRequest')}`, {
        confirmButtonText: `${this.$t('Global.accept')}`,
        cancelButtonText: `${this.$t('Global.cancel')}`,
        type: 'warning',
      }).then(_ => {
        this.$store.dispatch('evaluation/removeSignature', id).then(() => {
          this.$notify({
            type: 'success',
            message: `${this.$t('Global.successMessage')}`,
          });
          this.$store.dispatch('submission/preSubmission', this.$route.params.id).then(() => {
            this.$store.commit('SET_PATH_TITLE', this.$store.getters['submission/name'].name ? this.$store.getters['submission/name'].name : null);
          });
        });
      });
    },
  },
};
</script>

<style scoped></style>
