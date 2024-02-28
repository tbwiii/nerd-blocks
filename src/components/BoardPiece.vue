<template lang="pug">
TransitionGroup.piece(
  @mousedown="grab_start"
  :id="piece.id"
  :class="{dragging}"
  tag="div"
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
    button(v-if="i === 0" @click.stop="return_piece")
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

const animating = ref(false);
const dragging = ref(false);
const style = reactive({
  top: 0,
  left: 0
});

const grab_start = (e) => {
  if (dragging.value) return;
  dragging.value = true;
  store.set_placing(true);

  style.top = `calc(${e.clientY}px - 5vmin)`;
  style.left = `calc(${e.clientX}px - 5vmin)`;

  window.addEventListener('mousemove', grab_move);
  setTimeout(() => {
    window.addEventListener('mouseup', grab_end);
    window.addEventListener('keyup', triage_key);
  }, 150);
}

const grab_move = (e) => {
  style.top = `calc(${e.clientY}px - 5vmin)`;
  style.left = `calc(${e.clientX}px - 5vmin)`;
}

const grab_end = (e) => {
  window.removeEventListener('mousemove', grab_move);
  window.removeEventListener('mouseup', grab_end);
  window.removeEventListener('keyup', triage_key);

  store.place_piece(props.piece, true);
  dragging.value = false;
  store.set_placing(false);
}

const rotate = () => {
  if (animating.value) return;
  animating.value = true;
  store.rotate(props.piece);
  setTimeout(() => {
    animating.value = false;
  }, 250);
}
const reflect = () => {
  if (animating.value) return;
  animating.value = true;
  store.reflect(props.piece);
  setTimeout(() => {
    animating.value = false;
  }, 250);
}

const triage_key = (e) => {
  if (e.key === 'Enter' || e.key === 'ArrowRight' || e.key === 'ArrowLeft') reflect();
  if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'ArrowDown') rotate();
  if (e.key === 'Escape') grab_end();
}

const blocks = computed(() => {
  return props.piece.blocks.map((block) => {
    let x = block[0];
    let y = block[1];

    x += 1;
    y += 1;

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