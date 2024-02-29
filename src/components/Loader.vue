<template lang="pug">
#loader.loader
  h1.loader__text
    span loading
    em .
    em .
    em .
</template>

<script setup>

</script>

<style lang="scss" scoped>
.loader {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--black);
  z-index: 1000;

  * {
    margin: 0;
  }

  em {
    display: inline-block;
    font-style: normal;
    &:nth-of-type(1) {
      animation: bloop-1 1s infinite ease-in;
    }
    &:nth-of-type(2) {
      animation: bloop-2 1s 0.2s infinite ease-in;
    }
    &:nth-of-type(3) {
      animation: bloop-3 1s 0.4s infinite ease-in;
    }
  }
}

@keyframes bloop-1 {
  0% {
    transform: translateY(0);
    color: var(--random-1);
  }
  25% {
    transform: translateY(20%);
  }
  40% {
    transform: translateY(-4%);
  }
  50% {
    transform: translateY(0);
    color: var(--random-4);
  }
  100% {
    transform: translateY(0);
    color: var(--random-7);
  }
}

@keyframes bloop-2 {
  0% {
    transform: translateY(0);
    color: var(--random-2);
  }
  25% {
    transform: translateY(20%);
  }
  40% {
    transform: translateY(-4%);
  }
  50% {
    transform: translateY(0);
    color: var(--random-5);
  }
  100% {
    transform: translateY(0);
    color: var(--random-8);
  }
}

@keyframes bloop-3 {
  0% {
    transform: translateY(0);
    color: var(--random-3);
  }
  25% {
    transform: translateY(20%);
  }
  40% {
    transform: translateY(-4%);
  }
  50% {
    transform: translateY(0);
    color: var(--random-6);
  }
  100% {
    transform: translateY(0);
    color: var(--random-9);
  }
}
</style>