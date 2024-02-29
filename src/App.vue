<template lang="pug">
#game
  Transition(name="fade")
    Loader(v-if="loading")
  .inner(:inert="success")
    Board(@mounted="complete_loading")
    Timer

  Transition(name="fade")
    Victory(v-if="success")
</template>

<script setup>
import { ref, computed, nextTick, watch } from 'vue';
import { useBlocksStore } from '@/store/blocks';

import Loader from './components/Loader.vue';
import Board from './components/Board.vue';
import Timer from './components/Timer.vue';
import Victory from './components/Victory.vue';

const store = useBlocksStore();
const placing = computed(() => store.placing);
const success = computed(() => store.success && !store.dismissed);
const loading = ref(true);

const complete_loading = async () => {
  await nextTick();
  store.init();
  setTimeout(() => loading.value = false, 500);
};

watch(placing, (value) => {
  if (value) document.documentElement.classList.add('placing');
  else document.documentElement.classList.remove('placing');
});
</script>

<style scoped lang="scss">
#game {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  grid-area: 2 / 2 / 3 / 3;
  width: 100%;
  min-height: 100vh;
}

.inner {
  --cell-size: 10vmin;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr max-content;
  gap: 2rem;
  grid-area: 1 / 1 / 2 / 2;
  transition: 0.5s ease;
  height: 100%;

  &[inert] {
    filter: grayscale(70%);
    opacity: 0.1;
  }
}


.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
