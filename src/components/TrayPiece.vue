<template lang="pug">
TransitionGroup.piece(
  @click="triage_click"
  @mousedown="grab_start"
  :id="piece.id"
  :style="style"
  :class="{dragging}"
  :name="dragging ? 'none' : 'token'"
  tag="div"
  ref="el"
  )
  .block(
    v-for="block, i in blocks"
    :key="i"
    :style=`{
      'grid-column-start': block.x,
      'grid-row-start': block.y,
    }`
  )
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { useBlocksStore } from '@/store/blocks';

const store = useBlocksStore();
const props = defineProps({
  piece: Object
});

const el = ref(null);
const dragging = ref(false);
const style = reactive({
  top: 0,
  left: 0
});

let dragStartTime = 0;
let hasMoved = false;

const grab_start = (e) => {
  dragStartTime = Date.now();
  hasMoved = false;

  const initialX = e.clientX;
  const initialY = e.clientY;

  const moveHandler = (moveEvent) => {
    const dx = moveEvent.clientX - initialX;
    const dy = moveEvent.clientY - initialY;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      hasMoved = true;

      style.top = `calc(${moveEvent.clientY}px - 5vmin)`;
      style.left = `calc(${moveEvent.clientX}px - 5vmin)`;

      if (!dragging.value) {
        dragging.value = true;
        window.addEventListener('mousemove', grab_move);
      }
    }
  };

  window.addEventListener('mousemove', moveHandler);
  window.addEventListener('mouseup', () => {
    window.removeEventListener('mousemove', moveHandler);
    grab_end(e);
  }, { once: true });
};

const grab_move = (e) => {
  style.top = `calc(${e.clientY}px - 5vmin)`;
  style.left = `calc(${e.clientX}px - 5vmin)`;
}

const grab_end = (e) => {
  const duration = Date.now() - dragStartTime;
  if (hasMoved || duration > 200) { // Adjust the duration threshold as needed
    e.stopPropagation();
    e.preventDefault();
    window.removeEventListener('mousemove', grab_move);

    if (dragging.value) {
      store.place_piece(props.piece);
      setTimeout(() => {
        dragging.value = false;
      }, 100);
    }
  }
};


const rotate = () => store.rotate(props.piece);
const reflect = () => store.reflect(props.piece);

const click = ref(null);
const triage_click = async () => {
  const triage = new Promise((resolve) => {
    if (dragging.value) return;

    if (click.value) {
      clearTimeout(click.value)
      resolve('dblclick')
    }
    click.value = setTimeout(() => {
      click.value = null;
      resolve('click')
    }, 200);
  });
  const result = await triage;

  if (result === 'click') rotate();
  if (result === 'dblclick') reflect();
}

const blocks = computed(() => {
  return props.piece.blocks.map((block) => {
    let x = 1 + block[0];
    let y = 1 + block[1];

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

</script>

<style lang="scss" scoped>
.token-move {
  transition: all 0.2s ease;
}

.piece {
  transition-property: grid-auto-columns, grid-auto-rows;
  transition-duration: 0.2s;
  transition-timing-function: ease;

  &.dragging {
    --cell-size: 10vmin;
    z-index: 100;
    position: fixed;
  }

  .block {
    // transition-property: height, width;
    // transition-duration: 0.2s;
    // transition-timing-function: ease;
  }

}</style>