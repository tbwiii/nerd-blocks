<template lang="pug">
.piece(
  @click="grab_start"
  :id="piece.id"
  :class="{dragging}"
  :style=`{
    ...style,
    'grid-column': column,
    'grid-row': row,
  }`)
  .block(
    v-for="block, i in blocks"
    :key="block"
    :style=`{
      'grid-column-start': block.x,
      'grid-row-start': block.y,
    }`
  )
    button(v-if="i === 0" @click="return_piece")
      i.icon-back
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
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

const dragging = ref(false);
const style = reactive({
  top: 0,
  left: 0
});

const grab_start = (e) => {
  if (dragging.value) return;
  dragging.value = true;

  style.top = `calc(${e.clientY}px - 5vmin)`;
  style.left = `calc(${e.clientX}px - 5vmin)`;

  window.addEventListener('mousemove', grab_move);
  setTimeout(() => {
    window.addEventListener('click', grab_end);
  }, 50);
}

const grab_move = (e) => {
  style.top = `calc(${e.clientY}px - 5vmin)`;
  style.left = `calc(${e.clientX}px - 5vmin)`;
}

const grab_end = (e) => {
  window.removeEventListener('mousemove', grab_move);
  window.removeEventListener('click', grab_end);

  store.place_piece(props.piece, true);
  dragging.value = false;
}

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
  if (dragging.value) return;
  console.log('returning piece');
  store.return_piece(props.piece);
};

</script>

<style lang="scss" scoped>
</style>