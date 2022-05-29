<template>
  <main class="custom_main">
    <div class="w-50">
      <div >
        <span>401&nbsp;خطأ</span>
        <span>{{$t('Global.page401')}}</span>
      </div>
      <svg class="custom_svg" viewBox="0 0 200 600" style="margin-left:30px">
        <polygon points="118.302698 8 59.5369448 66.7657528 186.487016 193.715824 14 366.202839 153.491505 505.694344 68.1413353 591.044514 200 591.044514 200 8"></polygon>
      </svg>
    </div>
    <svg class="crack custom_svg" viewBox="0 0 200 600">
      <polyline points="118.302698 8 59.5369448 66.7657528 186.487016 193.715824 14 366.202839 153.491505 505.694344 68.1413353 591.044514"></polyline>
    </svg>
    <div>
      <svg class="custom_svg" viewBox="0 0 200 600">
        <polygon points="118.302698 8 59.5369448 66.7657528 186.487016 193.715824 14 366.202839 153.491505 505.694344 68.1413353 591.044514 0 591.044514 0 8"></polygon>
      </svg>
      <div>
        <span style="text-align: end;">نأسف&nbsp;لهذا&nbsp;!</span>
        <span>
          <router-link :to="goBack()" class="custom_back_error_btn mb-1" v-if="Auth">
            <b>الرجوع الي&nbsp;الصفحة الرئيسيه</b>
          </router-link>
          <router-link to="" @click.native="login" class="custom_back_error_btn" style="text-align: end;">
            <b>تسجيل الدخول </b>
          </router-link>
        </span>
      </div>
    </div>
  </main>
</template>

<script>
import { deleteToken, removeAuth, removeToken, setLogged } from '../../utils/auth';
import Cookies from 'js-cookie';

export default {
  name: 'Page401',
  data() {
    return {
      Auth: this.authUser(),
    };
  },

  methods: {
    goBack() {
        return `/users/${this.Auth.id}`
    //   this.$router.push(`/users/${this.Auth.id}`);
    },
    login() {
      removeToken();
      deleteToken();
      removeAuth();
      this.$router.push(`/login`);
    },
  },
  mounted() {
    setLogged('1');
    document.body.classList.add('custom_body_error');
  },
  destroyed() {
    document.body.classList.remove('custom_body_error');
  },
};
</script>
