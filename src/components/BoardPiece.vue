<template lang="pug">
.piece(
  @click="return_piece"
  :id="piece.id"
  :style=`{
    'grid-column': column,
    'grid-row': row,
  }`)
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
import { ref, computed } from 'vue';
import { useBlocksStore } from '@/store/blocks';

const store = useBlocksStore();
const props = defineProps({
  piece: Object
});

const column = computed(() => {
  const start = props.piece.x;
  const end = props.piece.span[0];
  return `${start} / span ${end}`;
});

const row = computed(() => {
  const start = props.piece.y;
  const end = props.piece.span[1];
  return `${start} / span ${end}`;
});

const blocks = computed(() => {
  return props.piece.blocks.map((block) => {
    let x = block[0];
    let y = block[1];

    x += 1;
    y += 1;
    if (props.piece.offset_x) {
      x += props.piece.offset_x;
    }
    if (props.piece.offset_y) {
      y += props.piece.offset_y;
    }

    return {
      x,
      y
    };
  });
});

const return_piece = () => {
  store.return_piece(props.piece);
};

</script>

<style lang="scss" scoped>
</style>