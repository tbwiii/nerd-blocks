<template lang="pug">
#tray.tray(v-if="pieces.length")
  Teleport(to="#grid_host")
    TransitionGroup.tray__grid(tag="div")
      Piece(
        v-for="piece in pieces"
        :key="piece.id"
        :piece="piece")
</template>

<script setup>
import { computed } from 'vue'
import { useBlocksStore } from '@/store/blocks';

import Piece from './Piece.vue';

const store = useBlocksStore();

const pieces = computed(() => store.pieces);
</script>

<style lang="scss" scoped>
.tray {
  display: flex;
  &__grid {
    position: relative;
    display: grid;
    grid-template-columns: repeat(6, var(--cell-size));
    grid-template-rows: repeat(6, var(--cell-size));
    gap: 1px;
    flex: 1 1 100%;
    border: 1px solid transparent;
  }
}
</style>