<template>
  <router-view></router-view>
</template>

<script>
import Cookies from 'js-cookie';

export default {
  name: 'App',
  data() {
    return {
      Auth: Cookies.get('user'),
    };
  },
  watch: {
    '$i18n.locale'(val) {
      if (val == 'ar') {
        document.body.classList.remove('en');
        document.body.classList.add('ar');
      } else {
        document.body.classList.add('en');
        document.body.classList.remove('ar');
      }
    },
  },
  mounted() {
    this.Auth = this.Auth ? JSON.parse(this.Auth) : null;
    if (this.Auth) {
      this.$store.dispatch('roles/getAuthUserRolesPermissions', this.Auth.id);
    }
  },
};
</script>

<style lang="scss">
// Import Main styles for this application
@import 'assets/scss/style';
</style>
