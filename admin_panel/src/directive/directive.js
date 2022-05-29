import Vue from "vue";
import store from "../store/store";
import Cookies from "js-cookie";

Vue.directive("hasRoles", function(el, binding, vnode) {
  if (Cookies.get("roles").includes(binding.value)) {
    el.style.display = "none";
  }
});

Vue.directive("hasPermissions", function(el, binding, vnode) {
  //   console.log(store.getters["roles/userRolesPermissionsName"]);
  if (
    !store.getters["roles/userRolesPermissionsName"].includes(binding.value)
  ) {
    // el.style.display = "none";
    // console.log("el =>", el, "bindin =>", binding.value);
  } else {
    // console.log("else : el =>", el, "bindin =>", binding.value);
    // el.style.display = "block";
  }
});

// Vue.directive("hasPermissions", function(el, binding, vnode) {
//     if (
//       !Cookies.get("userPermissions").includes(binding.value) &&
//       !Cookies.get("userRolesPermissions").includes(binding.value)
//     ) {
//       el.style.display = "none";
//     }
//   });
