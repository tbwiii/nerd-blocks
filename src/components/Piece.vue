<template lang="pug">
.piece(
  ref="el"
  @mousedown="grab"
  @mouseup="release"
  :id="piece.id"
  :class="{dragging, unused}"
  :style="style")
  .block(
    v-for="block in blocks"
    :key="block"
    :style=`{
      'grid-column-start': block.x,
      'grid-row-start': block.y,
    }`
  )
</template>

<script setup>
import { ref, computed, watchEffect, onMounted } from 'vue';
import { useBlocksStore } from '@/store/blocks';
import { useDraggable } from '@vueuse/core';

const store = useBlocksStore();

const props = defineProps({
  piece: Object
});

const el = ref(null);
const dragging = ref(false);
const unused = computed(() => props.piece.unused);
const style = ref(null);

const grab = () => {
  dragging.value = true;
}

const release = () => {
  dragging.value = false;
  store.update_piece(props.piece, 'unused', false)
}

const blocks = computed(() => {
  return props.piece.blocks.map((block) => {
    let x = block[0];
    let y = block[1];

    if (unused.value || dragging.value) {
      x += 1;
      y += 1;
      if (props.piece.offset_x) {
        x += props.piece.offset_x;
      }
      if (props.piece.offset_y) {
        y += props.piece.offset_y;
      }
    } else {
      x += props.piece.x;
      y += props.piece.y;
    }

    return {
      x,
      y
    };
  });
});

onMounted(() => {
  const dragData = useDraggable(el, {
    initialValue: {
      x: el.value.getBoundingClientRect().left,
      y: el.value.getBoundingClientRect().top
    }
  });

  watchEffect(() => {
    style.value = dragData.style.value;
  });
});
</script>

<style lang="scss" scoped>
.piece {
  display: contents;
  grid-auto-columns: var(--cell-size);
  grid-auto-rows: var(--cell-size);
  gap: 1px;
  cursor: pointer;

  &.unused {
    --cell-size: 8vmin;
    display: grid;
  }

  &.dragging {
    --cell-size: 13vmin;
    display: grid;
    z-index: 100;
    position: fixed;
  }
}

.block {
  --gap: 6px;

  position: relative;
  z-index: 0;
  height: calc(var(--cell-size) - (var(--gap) * 2));
  width: calc(var(--cell-size) - (var(--gap) * 2));
  margin: var(--gap);
  grid-row-end: span 1;
  grid-column-end: span 1;

  // transition-property: height, width;
  // transition-duration: 0.2s;
  // transition-timing-function: ease;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--color);
    border: 4px solid color-mix(in srgb, var(--color) 80%, #000 20%);
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
</style>