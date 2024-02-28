<template lang="pug">
#tray(v-if="pieces.length")
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

.tray-enter-active,
.tray-leave-active {
  transition: height 0.5s ease;
}

.tray-enter-from,
.tray-leave-to {
  height: 0;
}

#tray {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.inner {
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
</style>