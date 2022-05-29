<template>
<div>
      <CDropdown inNav class="c-header-nav-items" placement="bottom-end" add-menu-classes="pt-0">
    <template #toggler>
      <CHeaderNavLink v-if="$store.state.user.rerender">
        <router-link class="ml-2 mr-2" :to="`/users/${authUser().id}`">
          {{ authUser().ar_name }}
        </router-link>
        <el-avatar :src="authUser().photo || '/img/avatars/avatardf.png'" class="custom_avatar" :size="40" icon="el-icon-user-solid custom_avatar_icon"></el-avatar>
      </CHeaderNavLink>
    </template>
    <CDropdownHeader tag="div" class="text-center" color="light">
      <strong>Settings</strong>
    </CDropdownHeader>
    <CDropdownItem :to="`/users/${authUser().id}`"> <CIcon name="cil-user" /> {{ $t('Global.profile') }} </CDropdownItem>
    <CDropdownItem @click="logout"> <CIcon name="cil-lock-locked" /> {{ $t('Global.logout') }} </CDropdownItem>
  </CDropdown>
  </div>
</template>

<script>
import Cookies from 'js-cookie';

export default {
  name: 'TheHeaderDropdownAccnt',
  data() {
    return {
      itemsCount: 42,
    };
  },
  methods: {
    logout: function() {
      this.$store.dispatch('user/logout').then(() => {
        this.$router.push('/login');
      });
    },
  },
};
</script>

<style scoped>
.c-icon {
  margin-right: 0.3rem;
}
</style>
