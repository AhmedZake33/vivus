<template>
  <!-- <CContainer class="d-flex align-items-center min-vh-100">
    <CRow class="w-100 justify-content-center">
      <CCol md="6">
        <div class="w-100">
        <div class="clearfix">
          <h1 class="float-left display-3 mr-4">404</h1>
          <h4 class="pt-3">Oops! You're lost.</h4>
          <p class="text-muted">The page you are looking for was not found.</p>
        </div>
        <CInput
          class="mb-3"
          placeholder="What are you looking for?"
        >
          <template #prepend-content><CIcon name="cil-magnifying-glass"/></template>
          <template #append>
            <CButton color="info">Search</CButton>
          </template>
        </CInput>
      </div>
      </CCol>
    </CRow>
  </CContainer> -->
  <!-- <main class="container custom_page">
    <span class="particle">4</span>
    <span class="particle">4</span>
    <span class="particle">4</span>
    <span class="particle">4</span>
    <span class="particle">4</span>
    <span class="particle">4</span>
    <span class="particle">4</span>
    <span class="particle">4</span>
    <span class="particle">4</span>
    <span class="particle">4</span>
    <span class="particle">4</span>
    <span class="particle">4</span>
    <span class="particle">4</span>
    <span class="particle">4</span>
    <span class="particle">4</span>
    <span class="particle">4</span>
    <span class="particle">4</span>
    <span class="particle">4</span>
    <span class="particle">4</span>
    <span class="particle">4</span>
    <span class="particle">4</span>
    <span class="particle">4</span>
    <span class="particle">4</span>
    <span class="particle">4</span>
    <span class="particle">4</span>
    <span class="particle">4</span>
    <span class="particle">4</span>
    <span class="particle">4</span>
    <span class="particle">4</span>
    <span class="particle">4</span>
    <span class="particle">4</span>
    <span class="particle">4</span>
    <span class="particle">4</span>
    <span class="particle">4</span>
    <span class="particle">4</span>
    <span class="particle">4</span>
    <span class="particle">4</span>
    <span class="particle">4</span>
    <span class="particle">4</span>
    <span class="particle">4</span>
    <span class="particle">0</span>
    <span class="particle">0</span>
    <span class="particle">0</span>
    <span class="particle">0</span>
    <span class="particle">0</span>
    <span class="particle">0</span>
    <span class="particle">0</span>
    <span class="particle">0</span>
    <span class="particle">0</span>
    <span class="particle">0</span>
    <span class="particle">0</span>
    <span class="particle">0</span>
    <span class="particle">0</span>
    <span class="particle">0</span>
    <span class="particle">0</span>
    <span class="particle">0</span>
    <span class="particle">0</span>
    <span class="particle">0</span>
    <span class="particle">0</span>
    <span class="particle">0</span>
    <span class="particle">0</span>
    <span class="particle">0</span>
    <span class="particle">0</span>
    <span class="particle">0</span>
    <span class="particle">0</span>
    <span class="particle">0</span>
    <span class="particle">0</span>
    <span class="particle">0</span>
    <span class="particle">0</span>
    <span class="particle">0</span>
    <span class="particle">0</span>
    <span class="particle">0</span>
    <span class="particle">0</span>
    <span class="particle">0</span>
    <span class="particle">0</span>
    <span class="particle">0</span>
    <span class="particle">0</span>
    <span class="particle">0</span>
    <span class="particle">0</span>
    <span class="particle">0</span>
    <article class="content">
      <p>خطأ 404</p>
      <p>الصفحة التي تبحث عنها غير موجودة</p>
      <p>
        <button>رجوع</button>
      </p>
    </article>
  </main> -->
  <main class="custom_main">
    <div>
      <div>
        <span>404&nbsp;خطأ</span>
        <span>الصفحة&nbsp;غير&nbsp;موجوده</span>
      </div>
      <svg  class="custom_svg" viewBox="0 0 200 600">
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
        <span class="mb-2">نأسف&nbsp;لهذا&nbsp;!</span>
        <span>
          <router-link to="/" class="custom_back_error_btn">
            <b>الرجوع الي&nbsp;الصفحة الرئيسيه</b>
          </router-link>
        </span>
      </div>
    </div>
  </main>
  <!-- <div class="text-center">
    <i id="err-icon" class="el-icon-warning"></i>
    <h1 class="custom_h1">404 Not Found!</h1>
    <p>The file or directory you are looking for isn't here!</p>
  </div> -->
</template>

<script>
export default {
  name: 'Page404',
  mounted() {
    document.body.classList.add('custom_body_error');
  },
  destroyed() {
    document.body.classList.remove('custom_body_error');
  },
};
</script>

<style lang="scss" scoped>
// $anims: float, floatReverse, float2, floatReverse2;
// $easeSmooth: cubic-bezier(0.39, 0.575, 0.28, 0.995);
// $color: #595959;

// body {
//   margin: 0;
//   font-size: 20px;
// }
// * {
//   box-sizing: border-box;
// }

// .container {
//   position: relative;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   height: 100vh;
//   // background: white;
//   // color: black;
//   // font-family: arial, sans-serif;
//   // overflow: hidden;
// }

// // .custom_page{
// //     margin: 0 !important;
// // }
// .content {
//   position: relative;
//   width: 600px;
//   max-width: 100%;
//   margin: 20px;
//   background: white;
//   padding: 60px 40px;
//   text-align: center;
//   box-shadow: -10px 10px 67px -12px rgba(0, 0, 0, 0.2);
//   opacity: 0;
//   animation: apparition 0.8s 1.2s $easeSmooth forwards;

//   p {
//     font-size: 1.3rem;
//     margin-top: 0;
//     margin-bottom: 0.6rem;
//     // letter-spacing: 0.1rem;
//     color: $color;

//     &:last-child {
//       margin-bottom: 0;
//     }
//   }

//   button {
//     display: inline-block;
//     margin-top: 2rem;
//     padding: 0.5rem 1rem;
//     border: 3px solid $color;
//     background: transparent;
//     font-size: 1rem;
//     color: $color;
//     text-decoration: none;
//     cursor: pointer;
//     font-weight: bold;
//   }
// }

// .particle {
//   position: absolute;
//   display: block;
//   pointer-events: none;

//   @for $i from 1 through 80 {
//     &:nth-child(#{$i}) {
//       $size: random(20) + 10;
//       $blur: $i * 0.02;
//       $speed: random(20) + 20;
//       $delay: random(10) * 0.1;
//       $anim: nth($anims, random(length($anims)));

//       top: random(100) / (100 + $size/8) * 100%;
//       left: random(100) / (100 + $size/10) * 100%;
//       font-size: $size + px;
//       filter: blur((#{$blur}) + px);
//       animation: $speed + s $anim infinite;
//     }
//   }
// }

// @keyframes apparition {
//   from {
//     opacity: 0;
//     transform: translateY(100px);
//   }

//   to {
//     opacity: 1;
//     transform: translateY(0);
//   }
// }

// @keyframes float {
//   0%,
//   100% {
//     transform: translateY(0);
//   }
//   50% {
//     transform: translateY(180px);
//   }
// }

// @keyframes floatReverse {
//   0%,
//   100% {
//     transform: translateY(0);
//   }
//   50% {
//     transform: translateY(-180px);
//   }
// }

// @keyframes float2 {
//   0%,
//   100% {
//     transform: translateY(0);
//   }
//   50% {
//     transform: translateY(28px);
//   }
// }

// @keyframes floatReverse2 {
//   0%,
//   100% {
//     transform: translateY(0);
//   }
//   50% {
//     transform: translateY(-28px);
//   }
// }

// @mixin animation($delay, $duration, $animation) {
//   animation-delay: $delay;
//   animation-duration: $duration;
//   animation-name: $animation;
//   animation-iteration-count: infinite;
//   animation-fill-mode: forwards;
// }
</style>

<style lang="scss">
// @import url(https://fonts.googleapis.com/css?family=Droid+Sans:400,700);
// * {
//   cursor: url('https://puu.sh/j1a8v/067742b89d.ico'), default;
// }
// body {
//   background: #34495e;
//   text-align: center;
//   font-family: 'Droid Sans', sans-serif;
// }
// .custom_h1 {
//   margin-top: 30px;
//   color: #bdc3c7;
//   text-shadow: 0px 2px 0px rgba(150, 150, 150, 1);
// }
// #err-icon {
//   font-size: 80pt;
//   color: #bdc3c7;
//   margin-top: 150px;
//   text-shadow: 0px 3px 0px rgba(150, 150, 150, 1);
//   -webkit-transition: 0.5s;
// }
// #err-icon:hover {
//   -webkit-transform: scale(1.1);
//   color: #e74c3c;
//   text-shadow: 0px 3px 0px rgba(192, 57, 43, 1);
// }
// p {
//   color: rgba(189, 195, 199, 1);
//   font-weight: bold;
// }

$grey: #ebedef;
$red: #f04f54;
$green: #43cb9d;

$p: 12px;
$f: 'brandon-grotesque', 'Brandon Grotesque', 'Source Sans Pro', 'Segoe UI', Frutiger, 'Frutiger Linotype', 'Dejavu Sans', 'Helvetica Neue', Arial, sans-serif;

$easeOutExpo: cubic-bezier(0.19, 1, 0.22, 1);

// *,
// *:before,
// *:after {
//   box-sizing: border-box;
// }
// * {
//   -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
//   transform-style: preserve-3d;
// }
// *:focus {
//   outline: none !important;
// }
.custom_body_error,
html {
  height: 100%;
}

.custom_body_error {
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  padding: $p;
  background: $grey;
  color: #555;
  //   font-family: $f;
  //   font-size: 24px;
  //   text-rendering: optimizeLegibility;
  //   -webkit-font-smoothing: antialiased;
}

// ::selection {
//   background: none;
// }

.custom_back_error_btn {
  display: block;
  cursor: pointer;
  animation: pulseColor 1000ms linear 3100ms forwards;
  font-weight: 500;
    border: 1px solid #555;
    border-radius: 30px;
    padding: 0.2rem 1rem;
  b {
    color: #555;

  }
  &:hover,
  &:focus {
    background-color: #ddd;
    display: block;
    cursor: pointer;
    animation: pulseColor 1000ms linear 3100ms forwards;
    font-weight: 500;
  }
  &:active {
    b {
      color: #555;
    }
  }
}

.custom_svg {
  width: 50px;
  height: auto;
}

.crack {
  position: relative;
  z-index: 4;
  margin-left: -50px;
  polyline {
    fill: none;
    stroke: $red;
    stroke-width: 10px;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 1649.099;
    stroke-dashoffset: 1649.099;
    animation: drawStroke 1500ms ease-out 500ms forwards;
  }
}

.custom_main {
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  font-size: 24px;
  > div {
    display: flex;
    align-items: center;
    align-content: center;
    position: relative;
    overflow: hidden;
    svg {
      position: relative;
      z-index: 1;
      polygon {
        fill: $grey;
      }
    }
    span {
      display: block;
      position: relative;
      z-index: 0;
      padding: 0 $p;
      line-height: 1.4;
    }
    &:first-child {
      text-align: right;
      z-index: 1;
      span {
        &:first-child {
          opacity: 0;
          transform: translateX(100%);
          animation: translateLeft 1000ms linear 1250ms forwards;
        }
        &:last-child {
          opacity: 0;
          transform: translateX(100%);
          animation: translateLeft 1000ms linear 1450ms forwards;
        }
      }
      svg {
        polygon {
          animation: removeFill 10ms ease-out 1600ms forwards;
        }
      }
    }
    &:last-child {
      z-index: 0;
      margin-left: -50px;
      span {
        &:first-child {
          opacity: 0;
          transform: translateX(-100%);
          animation: translateRight 1000ms linear 1650ms forwards;
        }
        &:last-child {
          opacity: 0;
          transform: translateX(-100%);
          animation: translateRight 1000ms linear 1850ms forwards;
        }
      }
    }
  }
}

@keyframes drawStroke {
  0% {
    stroke-dashoffset: 1649.099;
  }
  100% {
    stroke-dashoffset: 0;
  }
}

@keyframes removeFill {
  0% {
    fill: rgba($grey, 1);
  }
  100% {
    fill: rgba($grey, 0);
  }
}

@keyframes pulseColor {
  0% {
    color: white;
  }
  25% {
    color: $green;
  }
  50% {
    color: white;
  }
  75% {
    color: $green;
  }
  100% {
    color: white;
  }
}

/* https://goo.gl/v323yz */
@keyframes translateLeft {
  0% {
    transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 150, 0, 0, 1);
    opacity: 1;
  }
  7.61% {
    transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 69.561, 0, 0, 1);
  }
  11.41% {
    transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 39.355, 0, 0, 1);
  }
  15.12% {
    transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 17.801, 0, 0, 1);
  }
  18.92% {
    transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 3.02, 0, 0, 1);
  }
  22.72% {
    transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -5.661, 0, 0, 1);
  }
  30.23% {
    transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -10.852, 0, 0, 1);
  }
  50.25% {
    transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -2.282, 0, 0, 1);
  }
  70.27% {
    transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0.519, 0, 0, 1);
  }
  100% {
    transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    opacity: 1;
  }
}

/* https://goo.gl/p1Hnde */
@keyframes translateRight {
  0% {
    transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -150, 0, 0, 1);
    opacity: 1;
  }
  7.61% {
    transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -69.561, 0, 0, 1);
  }
  11.41% {
    transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -39.355, 0, 0, 1);
  }
  15.12% {
    transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -17.801, 0, 0, 1);
  }
  18.92% {
    transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -3.02, 0, 0, 1);
  }
  22.72% {
    transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 5.661, 0, 0, 1);
  }
  30.23% {
    transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 10.852, 0, 0, 1);
  }
  50.25% {
    transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 2.282, 0, 0, 1);
  }
  70.27% {
    transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -0.519, 0, 0, 1);
  }
  100% {
    transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    opacity: 1;
  }
}
</style>
