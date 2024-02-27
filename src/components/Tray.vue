<template lang="pug">
#tray
  nav.controls
    button(@click="store.init") New Game
    button(@click="store.clear_board") Clear Board
  .inner
    Piece(
      v-for="piece in pieces"
      :key="piece.id"
      :piece="piece")
</template>

<script setup>
import { computed } from 'vue'
import { useBlocksStore } from '@/store/blocks';

import Piece from './TrayPiece.vue';

const store = useBlocksStore();
const pieces = computed(() => store.unused_pieces);
</script>

<style lang="scss" scoped>
#tray {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.controls {
  display: flex;
  gap: 1rem;
}
.inner {
  --cell-size: 3vmin;
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  place-content: center;
  place-items: center;
  width: 80vw;
  height: 150px;
  position: relative;
  z-index: 100;

  &::before,
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
  }

  &::before {
    background: var(--white);
    opacity: 0.1;
  }

  &::after {
    border: 1px solid var(--white);
    opacity: 0.4;
  }
}
</style>