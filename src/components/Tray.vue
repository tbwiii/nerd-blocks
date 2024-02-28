<template lang="pug">
#tray.tray(v-if="pieces.length")
  .tray__inner
    Piece(
      v-for="piece in pieces"
      :key="piece.id"
      :piece="piece",
      :tray="true")
  Teleport(to="#grid_host")
    .tray__grid
      Piece(
        v-for="piece in used_pieces"
        :key="piece.id"
        :piece="piece",
        :tray="false")
</template>

<script setup>
import { computed } from 'vue'
import { useBlocksStore } from '@/store/blocks';

import Piece from './Piece.vue';
// import BoardPiece from './BoardPiece.vue';

const store = useBlocksStore();

const pieces = computed(() => store.unused_pieces);
const used_pieces = computed(() => store.used_pieces);

const rotate = (piece) => {
  if (animating.value) return;
  animating.value = true;
  store.rotate(piece);
  setTimeout(() => {
    animating.value = false;
  }, 250);
}
const reflect = (piece) => {
  if (animating.value) return;
  animating.value = true;
  store.reflect(piece);
  setTimeout(() => {
    animating.value = false;
  }, 250);
}
</script>

<style lang="scss" scoped>
.tray-enter-active,
.tray-leave-active {
  transition: height 0.5s ease;
}

.tray-enter-from,
.tray-leave-to {
  height: 0;
}

.tray {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &__inner {
    --cell-size: 3vmin;
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    align-items: center;
    justify-items: center;
    width: 80vw;
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

  &__grid {
    position: relative;
    display: grid;
    grid-template-columns: repeat(6, var(--cell-size));
    grid-template-rows: repeat(6, var(--cell-size));
    gap: 1px;
    border: 1px solid transparent;
    align-self: start;
    z-index: 2;
  }
}
</style>