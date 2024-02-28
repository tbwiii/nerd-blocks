<template lang="pug">
#board
  #controls
    h1
      span Nerd
      span Blocks
    button.btn(@click="store.init") New Game
    button.btn(@click="store.clear_board") Clear Board
  #files
    .label(v-for="column in columns") {{ column }}

  #ranks
    .label(v-for="row in rows") {{ row }}

  #map(ref="map")
    Cell(
      v-for="cell in grid"
      :key="cell.id"
      :cell="cell")
  
  #grid
    Piece(
      v-for="piece in pieces"
      :key="piece.id"
      :piece="piece")
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useMouseInElement } from '@vueuse/core';
import { useBlocksStore } from '@/store/blocks';

import Cell from './BoardCell.vue';
import Piece from './BoardPiece.vue';

const store = useBlocksStore();
const pieces = computed(() => store.used_pieces);

const map = ref(null);
const { isOutside } = useMouseInElement(map);

watch(isOutside, (value) => {
  if (value) {
    store.update_active_cell(null);
  }
});

const rows = ref(['a', 'b', 'c', 'd', 'e', 'f']);
const columns = ref(['1', '2', '3', '4', '5', '6']);
const grid = computed(() => {
  return rows.value.reduce((_grid, row, i) => {
    _grid.push(...columns.value.map((column, j) => {
      return {
        id: `${row}${column}`,
        x: j + 1,
        y: i + 1
      };
    }));
    return _grid;
  }, []);
});

</script>

<style lang="scss" scoped>
#board {
  display: grid;
  grid-template-columns: auto auto auto;
  grid-template-rows: auto auto;
}

#controls {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 4rem;
  gap: 1rem;
  grid-area: 1 / 3 / 3 / 4;

  h1 {
    display: flex;
    flex-direction: column;
    font-size: 4rem;
    font-weight: 700;
    margin: 0;
    line-height: 1;

    span {
      color: var(--teal);

      &:last-child {
        color: var(--indigo);
      }
    }
  }
}

#ranks,
#files {
  display: grid;
  gap: 1px;
}

#ranks {
  grid-template-columns: auto;
  grid-template-rows: repeat(6, var(--cell-size));
  grid-area: 2 / 1 / 3 / 2;

  .label {
    justify-content: flex-end;
    padding-inline-end: 0.75rem;
  }
}

#files {
  grid-template-columns: repeat(6, var(--cell-size));
  grid-template-rows: auto;
  grid-area: 1 / 2 / 2 / 3;

  .label {
    align-items: flex-end;
    padding-block-end: 0.75rem;
  }
}

.label {
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
  font-size: 2rem;
  font-weight: bold;
  line-height: 0.8;
}

#map {
  display: grid;
  grid-template-columns: repeat(6, var(--cell-size));
  grid-template-rows: repeat(6, var(--cell-size));
  grid-area: 2 / 2 / 3 / 3;
  background: var(--gray);
  gap: 1px;
  border: 1px solid var(--gray);
  align-self: start;
}

#grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(6, var(--cell-size));
  grid-template-rows: repeat(6, var(--cell-size));
  grid-area: 2 / 2 / 3 / 3;
  gap: 1px;
  border: 1px solid transparent;
  align-self: start;
  z-index: 2;
}
</style>