<template>
  <div class="c-app">
    <TheSidebar />
    <CWrapper>
      <TheHeader />
      <div class="c-body">
        <main class="c-main" :dir="$i18n.locale === 'ar' ? 'rtl' : ''">
          <CContainer fluid>
            <transition name="fade">
              <router-view :key="$route.fullPath"></router-view>
            </transition>
          </CContainer>
        </main>
      </div>
      <TheFooter />
    </CWrapper>
  </div>
</template>

<script>
import TheSidebar from './TheSidebar';
import TheHeader from './TheHeader';
import TheFooter from './TheFooter';

export default {
  name: 'TheContainer',
  components: {
    TheSidebar,
    TheHeader,
    TheFooter,
  },
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.card {
  transition: all 0.3s ease-in-out;
  border: 0 !important;
  box-shadow: 0 .5rem 1rem rgba(0,0,21,.15)!important;
}
.card:hover{
    box-shadow: 0 1rem 3rem rgba(0,0,21,.175)!important;
}
.page-item.active .page-link {
  background-color: #173f5f;
  border-color: #173f5f;
}
a {
  color: #173f5f;
  font-weight: bold;
  text-decoration: none;
}
.table-action-item {
  margin: 5px;
  cursor: pointer;
}
a:hover {
  color: #173f5f;
  font-weight: bold;
  text-decoration: none;
}
.page-link {
  color: #173f5f;
}

.customDrop .btn {
  color: #fff;
  border-radius: 50px !important;
  background-color: #173f5f !important;
  border-color: #173f5f !important;
}

.btn-success:not(:disabled):not(.disabled):active:focus,
.show > .btn-success.dropdown-toggle:focus {
  box-shadow: 0 0 0 0.2rem rgb(58 64 60 / 50%);
}

.c-footer {
  background-color: #fff;
}
html{
    scroll-behavior: smooth;
    scroll-margin-top:2rem;
}
html:not([dir='rtl']) .dropdown-toggle::after {
  margin-bottom: -1px;
}

.item {
  padding: 8px;
  cursor: pointer;
  text-align: initial;
}
.item:hover {
  background-color: #dddddd;
}
span,
small,
p,
h6,
h1,
h2,
h3,
h4,
div,
a {
  word-break: break-word !important;
}
</style>
