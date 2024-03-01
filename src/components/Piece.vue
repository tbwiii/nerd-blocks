<template lang="pug">
TransitionGroup.piece(
  @click.native="grab_start"
  v-touch:hold="isTouch ? grab_start : null"
  v-touch:tap="isTouch ? triage_tap : null"
  v-touch:swipe="isTouch ? triage_swipe : null"
  :id="piece.id"
  :class="{placing, placed, animating}"
  :style="style",
  :tag="'div'"
  ref="piece_el")
  .piece__block(
    v-for="block, i in blocks"
    :key="i"
    :style="block"
    ref="block_els"
  )
</template>

<script setup>
import { ref, computed, nextTick, inject, onMounted } from 'vue';
import { useBlocksStore } from '@/store/blocks';

const store = useBlocksStore();
const emit = defineEmits(['mounted']);

const isTouch = inject('isTouch');

const piece_el = ref(null);
const block_els = ref(null);
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
  let x, y;

  if (isTouch.value) {
    x = e.touches[0].clientX;
    y = e.touches[0].clientY;
  } else {
    x = e.clientX;
    y = e.clientY;
  }

  if (!store.timing && !store.dismissed) store.start_timer();

  if (placing.value) return;
  placing.value = true;

  store.set_placing(true);
  store.set_position(props.piece, {
    top: y,
    left: x
  });

  if (isTouch.value) {
    window.addEventListener('touchmove', grab_move);
    setTimeout(() => {
      window.addEventListener('touchend', grab_end);
    }, 150);
  } else {
    window.addEventListener('mousemove', grab_move);
    window.addEventListener('keyup', triage_key);
    setTimeout(() => {
      window.addEventListener('click', grab_end);
    }, 150);
  }
};

const grab_move = (e) => {
  let x, y;
  if (isTouch.value) {
    x = e.touches[0].clientX;
    y = e.touches[0].clientY;
  } else {
    x = e.clientX;
    y = e.clientY;
  }

  store.set_position(props.piece, {
    top: y,
    left: x
  });
};

const grab_end = () => {
  window.removeEventListener('touchmove', grab_move);
  window.removeEventListener('mousemove', grab_move);

  window.removeEventListener('touchend', grab_end);
  window.removeEventListener('click', grab_end);

  window.removeEventListener('keyup', triage_key);

  store.place_piece(props.piece);
  placing.value = false;
  store.set_placing(false);
};

const set_size = () => {
  const height = piece_el.value.$el.clientHeight;
  const width = piece_el.value.$el.clientWidth;
  store.set_size(props.piece, { height, width });
};

const do_flip = async (invoke) => {
  if (animating.value) return;
  animating.value = true;

  const data = new Map();

  block_els.value.forEach((block, i) => {
    const { x, y } = block.getBoundingClientRect();
    const info = {
      start: { x, y },
      end: {}
    };
    data.set(block, info);
  });

  invoke();
  await nextTick();

  block_els.value.forEach((block, i) => {
    const { x, y } = block.getBoundingClientRect();
    const info = data.get(block);
    info.end.x = x;
    info.end.y = y;
    data.set(block, info);
  });

  const animations = [];

  block_els.value.forEach(block => {
    const info = data.get(block);
    const x = `${info.start.x - info.end.x}px`;
    const y = `${info.start.y - info.end.y}px`;

    const animation = block.animate([
      { transform: `translate(${x}, ${y})` },
      { transform: 'translate(0, 0)' }
    ], {
      duration: 300,
      easing: 'ease',
    });

    animations.push(animation.finished);
  });

  await Promise.all(animations);
  set_size();
  animating.value = false;
}

const rotate = (counterclockwise = false) => {
  const invoke = () => store.rotate(props.piece, counterclockwise);
  do_flip(invoke);
};

const reflect = (horizontal = false) => {
  const invoke = () => store.reflect(props.piece, horizontal);
  do_flip(invoke);
};

const triage_key = (e) => {
  if (placed.value) return;
  e.preventDefault();
  if (e.key === ' ') rotate();
  else if (e.key === 'Shift') rotate(true);
  else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') reflect(true);
  else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') reflect();
  else if (e.key === 'Escape') grab_end();
};

const tap_timeout = ref(null);
const triage_tap = () => {
  if (placing.value || placed.value) return;
  if (tap_timeout.value) {
    clearTimeout(tap_timeout.value);
    tap_timeout.value = null;
    return rotate(true);
  }

  tap_timeout.value = setTimeout(() => {
    tap_timeout.value = null;
    rotate();
  }, 300);
};

const triage_swipe = (dir) => {
  if (placing.value || placed.value) return;
  if (dir === 'left' || dir === 'right') return reflect();
  else if (dir === 'top' || dir === 'bottom') return reflect(true);
};

onMounted(() => {
  set_size();
  emit('mounted');
});
</script>

<style lang="scss" scoped>
.piece {
  --reference: var(--cell-size-sm);
  display: grid;
  grid-auto-columns: var(--reference);
  grid-auto-rows: var(--reference);
  gap: 1px;
  pointer-events: none;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;

  &.placing,
  &.placed {
    --reference: var(--cell-size);
  }

  .placing &:not(.placing) {
    .piece__block {
      pointer-events: none;
    }
  }

  &.placed {
    z-index: 1;
    position: static;
  }

  &.animating {
    .piece__block {
      transition: none;
    }
  }

  &__block {
    --gap: calc(var(--reference) * (3 / 40));
    --size: calc(var(--reference) - (var(--gap) * 2));
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
      font-size: calc(var(--reference) * 0.2);
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