<template lang="pug">
#board.board
  .board__hero
    .board__hero-inner(data-avoid)
      h1.board__hero-title
        span Nerd
        span Blocks
      .board__hero-controls
        button.btn(@click="store.init") New Game
        button.btn(@click="store.clear_board" :disabled="!can_clear") Clear Board
    small.board__hero-directions(data-avoid)
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
import { ref, computed, watch, watchEffect, defineEmits, onMounted } from 'vue'
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

<style lang="scss">
.roadblock-move {
  transition-duration: 0.3s;
  transition-timing-function: ease;

  @for $i from 1 through 7 {
    &:nth-of-type(#{$i}) {
      transition-delay: #{($i - 1) * 0.075}s;
    }
  }
}
</style>

<style lang="scss" scoped>
.board {
  display: flex;
  flex-direction: row-reverse;

  &__hero {
    display: flex;
    flex-direction: column;
    justify-content: center;
    grid-area: 1 / 3 / 3 / 4;

    &-inner {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 2rem;
      padding: 2rem;
    }

    &-title {
      display: flex;
      flex-direction: column;
      font-size: 4rem;
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
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
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
    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: auto auto;
    padding: 2rem;
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
      justify-content: flex-end;
      padding-inline-end: 0.75rem;
    }
  }

  &__files {
    grid-template-columns: repeat(6, var(--cell-size));
    grid-template-rows: auto;
    grid-area: 1 / 2 / 2 / 3;

    .board__label {
      align-items: flex-end;
      padding-block-end: 0.75rem;
    }
  }

  &__label {
    display: flex;
    justify-content: center;
    align-items: center;
    text-transform: uppercase;
    font-size: 2rem;
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