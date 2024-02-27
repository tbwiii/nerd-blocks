<template lang="pug">
#game
  #board
    template(v-for="row in rows")
      .cell(
        v-for="column in columns"
        :id="`${row}${column}`")
    Piece(
      v-for="piece in board_pieces"
      :key="piece.id"
      :piece="piece")
  

  #tray
    Piece(
      v-for="piece in tray_pieces"
      :key="piece.id"
      :piece="piece")

</template>

<script setup>
import { ref, computed } from 'vue'
import { useBlocksStore } from './store/blocks';

import Piece from './components/Piece.vue';

const rows = ref(['a', 'b', 'c', 'd', 'e', 'f']);
const columns = ref(['1', '2', '3', '4', '5', '6']);

const store = useBlocksStore();
const board_pieces = computed(() => store.pieces.filter((piece) => !piece.unused));
const tray_pieces = computed(() => store.pieces.filter((piece) => piece.unused));

</script>

<style scoped lang="scss">
#game {
  --cell-size: 13vmin;
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin: 10vmin;
}

#board {
  display: grid;
  grid-template-columns: repeat(6, var(--cell-size));
  grid-template-rows: repeat(6, var(--cell-size));
  background: #ddd;
  gap: 1px;
  border: 1px solid #ddd;
  align-self: start;
}

#tray {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.cell {
  background-color: #242424;

  $rows: 6;
  $columns: 6;

  $child: 1;

  @for $i from 1 through $rows {
    @for $j from 1 through $columns {
      &:nth-child(#{$child}) {
        grid-area: #{$i} / #{$j} / #{$i + 1} / #{$j + 1};
      }

      $child: $child + 1;
    }
  }
}

</style>
