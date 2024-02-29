<template lang="pug">
TransitionGroup.piece(
  @click.native="grab_start"
  :id="piece.id"
  :class="{placing, placed}"
  :tag="'div'"
  :style="style",
  ref="el")
  .piece__block(
    v-for="block, i in blocks"
    :key="i"
    :style="block"
  )
</template>

<script setup>
import { ref, computed, defineEmits, onMounted } from 'vue';
import { useBlocksStore } from '@/store/blocks';

const store = useBlocksStore();
const emit = defineEmits(['mounted']);
const el = ref(null);
const props = defineProps({
  piece: Object
});

const position = computed(() => {
  const top = props.piece.position.top;
  const left = props.piece.position.left;
  const offset = placing.value ? 5 : 0;
  if (isNaN(parseInt(top)) || isNaN(parseInt(left))) return false;
  return {
    top: `calc(${props.piece.position.top}px - ${offset}vmin)`,
    left: `calc(${props.piece.position.left}px - ${offset}vmin)`
  };
})

const column = computed(() => {
  const start = props.piece.x;
  const end = props.piece.span[0];
  if (isNaN(parseInt(start)) || isNaN(parseInt(end))) return false;
  return { gridColumn: `${start} / span ${end}` };
});

const row = computed(() => {
  const start = props.piece.y;
  const end = props.piece.span[1];
  if (isNaN(parseInt(start)) || isNaN(parseInt(end))) return false;
  return { gridRow: `${start} / span ${end}` };
});

const style = computed(() => ({
  ...(position.value),
  ...(column.value),
  ...(row.value)
}));

const blocks = computed(() => props.piece.blocks.map((block) => ({
  'grid-column-start': 1 + block[0],
  'grid-row-start': 1 + block[1],
})));

const placing = ref(false);
const placed = computed(() => props.piece.placed && !placing.value);
const animating = ref(false);

const grab_start = (e) => {
  if (!store.timing && !store.dismissed) store.start_timer();
  if (placing.value) return;
  placing.value = true;
  store.set_placing(true);

  store.set_position(props.piece, {
    top: e.clientY,
    left: e.clientX
  });

  window.addEventListener('mousemove', grab_move);
  // window.addEventListener('touchmove', grab_move);
  window.addEventListener('keyup', triage_key);
  setTimeout(() => {
    window.addEventListener('click', grab_end);
    // window.addEventListener('touchend', grab_end);
  }, 150);
};

const grab_move = (e) => {
  store.set_position(props.piece, {
    top: e.clientY,
    left: e.clientX
  });
};

const grab_end = (e) => {
  window.removeEventListener('mousemove', grab_move);
  // window.removeEventListener('touchmove', grab_move);
  window.removeEventListener('click', grab_end);
  // window.removeEventListener('touchend', grab_end);
  window.removeEventListener('keyup', triage_key);

  store.place_piece(props.piece);
  placing.value = false;
  store.set_placing(false);
};

const set_size = () => {
  const height = el.value.$el.clientHeight;
  const width = el.value.$el.clientWidth;
  store.set_size(props.piece, { height, width });
};

const rotate = (counterclockwise = false) => {
  if (animating.value) return;
  animating.value = true;
  store.rotate(props.piece, counterclockwise);
  setTimeout(() => {
    set_size();
    animating.value = false;
  }, 250);
};

const reflect = (horizontal = false) => {
  if (animating.value) return;
  animating.value = true;
  store.reflect(props.piece, horizontal);
  setTimeout(() => {
    set_size();
    animating.value = false;
  }, 250);
};

const triage_key = (e) => {
  e.preventDefault();
  if (e.key === ' ') rotate();
  else if (e.key === 'Shift') rotate(true);
  else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') reflect(true);
  else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') reflect();
  else if (e.key === 'Escape') grab_end();
};

onMounted(() => {
  set_size();
  emit('mounted');
});
</script>

<style lang="scss" scoped>
.piece {
  --cell-size: 5vmin;
  display: grid;
  grid-auto-columns: var(--cell-size);
  grid-auto-rows: var(--cell-size);
  gap: 1px;
  // transition: transform 5s ease;
  pointer-events: none;
  position: fixed;
  z-index: 100;

  &.placing {
    --cell-size: 10vmin;
  }

  .placing &:not(.placing) {
    .piece__block {
      pointer-events: none;
    }
  }

  &.placed {
    --cell-size: 10vmin;
    z-index: 1;
    position: static;
  }

  &__block {
    --gap: calc(var(--cell-size) * (3 / 40));
    --size: calc(var(--cell-size) - (var(--gap) * 2));
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    cursor: pointer;
    pointer-events: all;
    z-index: 0;
    height: var(--size);
    width: var(--size);
    margin: var(--gap);
    grid-row-end: span 1;
    grid-column-end: span 1;
    box-shadow: 0 0 calc(var(--gap) * 1.5) rgba(0, 0, 0, 1);
    transition: 0.3s ease;

    &::before {
      transition: 0.2s ease;
      content: '';
      position: absolute;
      inset: 0;
      background: var(--color);
      border: calc(var(--gap) * 2) solid color-mix(in srgb, var(--color) 80%, #000 20%);
    }

    &::after {
      content: '';
      position: absolute;
      inset: calc(var(--gap) * -1.1);
      border: calc(var(--gap) * 1.1) solid transparent;
    }

    i {
      display: block;
      font-size: calc(var(--cell-size) * 0.2);
      opacity: 0;
      visibility: hidden;
      transition: 0.2s ease;
      padding: 0.25rem;
      background: var(--black);
      border-radius: 3px;
    }
  }
}
</style>