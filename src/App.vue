<template lang="pug">
#game
  Transition(name="fade")
    template(v-if="loading")
      .loader
        h1 loading...
  .inner(:inert="success")
    Board
    Tray(v-if="ready")

  Transition(name="fade")
    Victory(v-if="success")
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useBlocksStore } from '@/store/blocks';

import Board from './components/Board.vue';
import Tray from './components/Tray.vue';
import Victory from './components/Victory.vue';

const store = useBlocksStore();
const placing = computed(() => store.placing);
const success = computed(() => store.success);
const ready = ref(false);
const loading = ref(true);

store.init();

watch(placing, (value) => {
  if (value) document.documentElement.classList.add('placing');
  else document.documentElement.classList.remove('placing');
});

onMounted(() => {
  setTimeout(() => {
    ready.value = true;
    setTimeout(() => {
      loading.value = false;
    }, 500);
  }, 500);
});

</script>

<style scoped lang="scss">
#game {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;

}
.inner {
  --cell-size: 10vmin;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  grid-area: 1 / 1 / 2 / 2;
  transition: 0.5s ease;

  &[inert] {
    filter: grayscale(70%);
    opacity: 0.1;
  }
}

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
