<template lang="pug">
#game
  .inner(:inert="success")
    Board
    Tray

  Transition(name="fade")
    Victory(v-if="success")
</template>

<script setup>
import { computed, watch } from 'vue';
import { useBlocksStore } from '@/store/blocks';

import Board from './components/Board.vue';
import Tray from './components/Tray.vue';
import Victory from './components/Victory.vue';

const store = useBlocksStore();
const placing = computed(() => store.placing);
const success = computed(() => store.success);

store.init();

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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
