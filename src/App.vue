<template lang="pug">
.board
  template(v-for="row in rows")
    .cell(
      v-for="column in columns"
      :id="`${row}${column}`")

  #C.piece
    .block
    .block
    .block
    .block

  #R.piece
    .block
    .block
    .block

  #O.piece
    .block

  #I4.piece
    .block
    .block
    .block
    .block

  #I3.piece
    .block
    .block
    .block

  #I2.piece
    .block
    .block

  #Z.piece
    .block
    .block
    .block
    .block

  #T.piece
    .block
    .block
    .block
    .block

  #J.piece
    .block
    .block
    .block
    .block

</template>

<script setup>
import { ref } from 'vue'

const rows = ref(['a', 'b', 'c', 'd', 'e', 'f']);
const columns = ref(['1', '2', '3', '4', '5', '6']);


</script>

<style scoped lang="scss">
.board {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(6, 1fr);
  width: 80vmin;
  background: #ddd;
  gap: 1px;
  border: 1px solid #ddd;
}

.cell {
  aspect-ratio: 1 / 1;
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

.piece {
  display: contents;
}

#C {
  --color: var(--piece-c)
}
#R {
  --color: var(--piece-r)
}
#O {
  --color: var(--piece-o)
}
#I4 {
  --color: var(--piece-i4)
}
#I3 {
  --color: var(--piece-i3)
}
#I2 {
  --color: var(--piece-i2)
}
#Z {
  --color: var(--piece-z)
}
#T {
  --color: var(--piece-t)
}
#J {
  --color: var(--piece-j)
}

.block {
  --gap: 6px;

  position: relative;
  z-index: 0;
  margin: var(--gap);
  grid-row-end: span 1;
  grid-column-end: span 1;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--color);
    z-index: 2;
  }

  &::after {
    --width: calc(100% + (var(--gap) / 2) + 0.5px);
    --height: calc(100% + (var(--gap) / 2) + 0.5px);
    
    content: '';
    position: absolute;
    z-index: 1;
    background: color-mix(in srgb, var(--color) 50%, #000 50%);
    width: var(--width);
    height: var(--height);
  }
}

#C {
  --row: 1;
  --column: 1;

  .block {
    &:nth-child(1) {
      grid-row-start: calc(var(--row) + 0);
      grid-column-start: calc(var(--column) + 0);
      &::after {
        top: calc(var(--gap) / 2);
        left: calc(var(--gap) / 2);
      }
    }

    &:nth-child(2) {
      grid-row-start: calc(var(--row) + 0);
      grid-column-start: calc(var(--column) + 1);
      &::after {
        top: calc(var(--gap) / 2);
        right: calc(var(--gap) / 2);
      }
    }

    &:nth-child(3) {
      grid-row-start: calc(var(--row) + 1);
      grid-column-start: calc(var(--column) + 0);
      &::after {
        left: calc(var(--gap) / 2);
        bottom: calc(var(--gap) / 2);
      }
    }

    &:nth-child(4) {
      grid-row-start: calc(var(--row) + 1);
      grid-column-start: calc(var(--column) + 1);
      &::after {
        right: calc(var(--gap) / 2);
        bottom: calc(var(--gap) / 2);
      }
    }
  }
}

#R {
  --row: 1;
  --column: 3;

  .block {
    &:nth-child(1) {
      z-index: 1;
      grid-row-start: calc(var(--row) + 0);
      grid-column-start: calc(var(--column) + 0);
      &::after {
        --width: calc(100% - var(--gap));
        top: calc(var(--gap) / 2);
        left: calc(var(--gap) / 2);
      }
    }

    &:nth-child(2) {
      grid-row-start: calc(var(--row) + 0);
      grid-column-start: calc(var(--column) + 1);
      &::after {
        --width: calc(100% + (var(--gap) * 2));
        --height: calc(100% - var(--gap));
        top: calc(var(--gap) / 2);
        right: calc(var(--gap) / 2);
      }
    }

    &:nth-child(3) {
      grid-row-start: calc(var(--row) + 1);
      grid-column-start: calc(var(--column) + 0);
      &::after {
        --width: calc(100% - var(--gap));
        left: calc(var(--gap) / 2);
        bottom: calc(var(--gap) / 2);
      }
    }
  }
}

#O {
  --row: 2;
  --column: 4;

  .block {
    grid-row-start: calc(var(--row) + 0);
    grid-column-start: calc(var(--column) + 0);
    &::after {
      display: none;
    }
  }
}

#I4,
#I3,
#I2 {
  .block {
    &:nth-child(1) {
      grid-row-start: calc(var(--row) + 0);
      grid-column-start: calc(var(--column) + 0);
    }

    &:nth-child(2) {
      grid-row-start: calc(var(--row) + 1);
      grid-column-start: calc(var(--column) + 0);
    }

    &:nth-child(3) {
      grid-row-start: calc(var(--row) + 2);
      grid-column-start: calc(var(--column) + 0);
    }

    &:nth-child(4) {
      grid-row-start: calc(var(--row) + 3);
      grid-column-start: calc(var(--column) + 0);
    }

    &::after {
      --width: calc(100% - var(--gap));
      --height: calc(100% + (var(--gap) * 2));
      top: calc(var(--gap) / 2);
      left: calc(var(--gap) / 2);
    }

    &:last-child {
      &::after {
        display: none;
      }
    }
  }
}

#I4 {
  --row: 3;
  --column: 1;
}

#I3 {
  --row: 3;
  --column: 2;
}

#I2 {
  --row: 3;
  --column: 3;
}

#Z {
  --row: 5;
  --column: 3;

  .block {
    &:nth-child(1) {
      z-index: 1;
      grid-row-start: calc(var(--row) + 0);
      grid-column-start: calc(var(--column) + 0);
      &::after {
        --width: calc(100% - var(--gap));
        --height: calc(100% + (var(--gap) * 2));
        top: calc(var(--gap) / 2);
        left: calc(var(--gap) / 2);
      }
    }

    &:nth-child(2) {
      grid-row-start: calc(var(--row) + 0);
      grid-column-start: calc(var(--column) + 1);
      &::after {
        --width: calc(100% + (var(--gap) * 2));
        --height: calc(100% - var(--gap));
        top: calc(var(--gap) / 2);
        right: calc(var(--gap) / 2);
      }
    }

    &:nth-child(3) {
      grid-row-start: calc(var(--row) + 1);
      grid-column-start: calc(var(--column) - 1);
      &::after {
        --width: calc(100% + (var(--gap) * 2));
        --height: calc(100% - var(--gap));
        top: calc(var(--gap) / 2);
        left: calc(var(--gap) / 2);
      }
    }

    &:nth-child(4) {
      z-index: 2;
      grid-row-start: calc(var(--row) + 1);
      grid-column-start: calc(var(--column) + 0);
      &::after {
        display: none;
      }
    }
  }
}

#T {
  --row: 5;
  --column: 5;

  .block {
    &:nth-child(1) {
      grid-row-start: calc(var(--row) + 0);
      grid-column-start: calc(var(--column) + 0);
      &::after {
        --width: calc(100% - var(--gap));
        --height: calc(100% + (var(--gap) * 2));
        top: calc(var(--gap) / 2);
        left: calc(var(--gap) / 2);
      }
    }

    &:nth-child(2) {
      grid-row-start: calc(var(--row) + 1);
      grid-column-start: calc(var(--column) - 1);
      &::after {
        --width: calc(100% + (var(--gap) * 2));
        --height: calc(100% - var(--gap));
        top: calc(var(--gap) / 2);
        left: calc(var(--gap) / 2);
      }
    }

    &:nth-child(3) {
      z-index: 2;
      grid-row-start: calc(var(--row) + 1);
      grid-column-start: calc(var(--column) + 0);
      &::after {
        display: none;
      }
    }

    &:nth-child(4) {
      grid-row-start: calc(var(--row) + 1);
      grid-column-start: calc(var(--column) + 1);
      &::after {
        --width: calc(100% + (var(--gap) * 2));
        --height: calc(100% - var(--gap));
        top: calc(var(--gap) / 2);
        right: calc(var(--gap) / 2);
      }
    }
  }
}

#J {
  --row: 4;
  --column: 4;
  .block {
    &:nth-child(1) {
      grid-row-start: calc(var(--row) + 0);
      grid-column-start: calc(var(--column) + 0);
      &::after {
        --width: calc(100% + (var(--gap) * 2));
        --height: calc(100% - var(--gap));
        top: calc(var(--gap) / 2);
        left: calc(var(--gap) / 2);
      }
    }

    &:nth-child(2) {
      grid-row-start: calc(var(--row) + 0);
      grid-column-start: calc(var(--column) + 1);
      &::after {
        --width: calc(100% + (var(--gap) * 2));
        --height: calc(100% - var(--gap));
        top: calc(var(--gap) / 2);
        left: calc(var(--gap) / 2);
      }
    }

    &:nth-child(3) {
      grid-row-start: calc(var(--row) + 0);
      grid-column-start: calc(var(--column) + 2);
      &::after {
        --width: calc(100% - var(--gap));
        --height: calc(100% + (var(--gap) * 2));
        top: calc(var(--gap) / 2);
        left: calc(var(--gap) / 2);
      }
    }

    &:nth-child(4) {
      grid-row-start: calc(var(--row) + 1);
      grid-column-start: calc(var(--column) + 2);
      &::after {
        display: none;
      }
    }
  }
}

</style>
