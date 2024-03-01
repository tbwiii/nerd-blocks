<template lang="pug">
#board.board
  .board__hero
    .board__hero-inner(data-avoid)
      h1.board__hero-title
        span Nerd
        span Blocks
      .board__hero-controls
        button.btn.board__hero-btn(@click="store.init") New Game
        button.btn.board__hero-btn(@click="store.clear_board" :disabled="!can_clear") Clear Board
    small.board__hero-directions(v-if="isLg" data-avoid)
      strong Directions
      span Click to grab a piece
      span Space to rotate clockwise
      span Shift to rotate counterclockwise
      span Up/down arrow flip vertically
      span Left/right arrow flip horizontally
      span Click on the board to place
      span Escape to drop the piece
      em You win when you fill the board
  .board__main(data-avoid)
    .board__files
      .board__label(v-for="column in columns") {{ column }}

    .board__ranks
      .board__label(v-for="row in rows") {{ row }}

    .board__map(ref="map")
      Cell(
        v-for="cell in cells"
        :key="cell.id"
        :cell="cell")
      TransitionGroup(name="roadblock")
        Roadblock(
          v-for="roadblock, i in roadblocks"
          :key="i"
          :roadblock="roadblock")

    .board__tray
      Piece(
        v-for="piece in pieces"
        @mounted="child_mounted_count++"
        :key="piece.id"
        :piece="piece")
</template>

<script setup>
import { ref, computed, watch, watchEffect, onMounted, inject } from 'vue';
import { useBlocksStore } from '@/store/blocks';
import { useMouseInElement } from '@vueuse/core';

import Cell from './Cell.vue';
import Roadblock from './Roadblock.vue';
import Piece from './Piece.vue';

const store = useBlocksStore();
const emit = defineEmits(['mounted']);

const mounted = ref(false);

const child_mounted_count = ref(0);
const pieces = computed(() => store.pieces);

const isLg = inject('isLg');

const can_clear = computed(() => store.pieces.some((piece) => piece.placed));

const rows = ref(['a', 'b', 'c', 'd', 'e', 'f']);
const columns = ref(['1', '2', '3', '4', '5', '6']);
const cells = computed(() => {
  return rows.value.reduce((_cells, row, i) => {
    _cells.push(...columns.value.map((column, j) => {
      const id = `${row}${column}`;
      const x = j + 1;
      const y = i + 1;

      return {
        id,
        x,
        y,
      };
    }));
    return _cells;
  }, []);
});

const roadblocks = computed(() => {
  return store.roadblocks.map(roadblock => {
    const x = roadblock[0];
    const y = roadblock[1];
    return {
      x,
      y,
      id: `roadblock-${x}-${y}`,
    }
  })
});

const map = ref(null);
const { isOutside } = useMouseInElement(map);

watch(isOutside, (value) => {
  if (value) {
    store.update_active_cell(null);
  }
});

onMounted(() => mounted.value = true);

watchEffect(() => {
  if (child_mounted_count.value === pieces.value.length && mounted.value) {
    emit('mounted');
  }
});

</script>

<style lang="scss" scoped>
.board {
  display: flex;
  flex-direction: column;
  align-self: center;
  justify-self: center;
    align-items: center;

  @include mq(lg) {
    flex-direction: row-reverse;
  }

  &__hero {
    display: flex;
    flex-direction: column;
    justify-content: center;
    grid-area: 1 / 3 / 3 / 4;

    &-inner {
      @include fluid(padding, 1.25rem, 2rem);
      @include fluid(gap, 1.25rem, 2rem);
      display: flex;
      align-items: center;
      gap: 2rem;
      padding: 2rem;

      @include mq(lg) {
        flex-direction: column;
        justify-content: center;
        align-items: stretch;
      }
    }

    &-title {
      @include fluid(font-size, 2.25rem, 4rem);
      display: flex;
      flex-direction: column;
      font-weight: 700;
      margin: 0;
      line-height: 1;

      span {

        transition: 0.2s ease;
        color: var(--random-1);

        &:last-child {
          color: var(--random-2);
        }
      }
    }

    &-controls {
      @include fluid(gap, 0.875rem, 1.5rem);
      display: flex;
      flex-direction: column;

      @include mqdn(lg) {
        flex: 1 1 auto;
      }
    }

    &-btn {
      @include fluid(font-size, 0.875rem, 1.125rem);
      @include fluid(padding-top, 1.125rem, 1.375rem);
      @include fluid(padding-inline, 0.5rem, 0.75rem);
      @include fluid(padding-bottom, 0.875rem, 1rem);
    }

    &-directions {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding-inline: 2rem;
      font-size: 0.875rem;

      strong {
        font-size: 1em;
      }

      span,
      em {
        font-size: 0.875em;
      }

      em {
        font-style: normal;
        color: var(--random-3);
        transition: 0.2s ease;
      }
    }
  }

  &__main {
    @include fluid(padding, 1.25rem, 2rem);
    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: auto auto;
  }

  &__ranks,
  &__files {
    display: grid;
    gap: 1px;
  }

  &__ranks {
    grid-template-columns: auto;
    grid-template-rows: repeat(6, var(--cell-size));
    grid-area: 2 / 1 / 3 / 2;

    .board__label {
      @include fluid(padding-inline-end, 0.55rem, 0.75rem);
      justify-content: flex-end;
    }
  }

  &__files {
    grid-template-columns: repeat(6, var(--cell-size));
    grid-template-rows: auto;
    grid-area: 1 / 2 / 2 / 3;

    .board__label {
      @include fluid(padding-block-end, 0.55rem, 0.75rem);
      align-items: flex-end;
    }
  }

  &__label {
    @include fluid(font-size, 1.25rem, 2rem);
    display: flex;
    justify-content: center;
    align-items: center;
    text-transform: uppercase;
    font-weight: bold;
    line-height: 0.8;
  }

  &__map {
    display: grid;
    grid-template-columns: repeat(6, var(--cell-size));
    grid-template-rows: repeat(6, var(--cell-size));
    grid-area: 2 / 2 / 3 / 3;
    background: var(--gray);
    gap: 1px;
    border: 1px solid var(--gray);
  }

  &__tray {
    display: grid;
    grid-template-columns: repeat(6, var(--cell-size));
    grid-template-rows: repeat(6, var(--cell-size));
    gap: 1px;
    position: relative;
    grid-area: 2 / 2 / 3 / 3;
    z-index: 2;
    border: 1px solid transparent;
  }
}
</style>