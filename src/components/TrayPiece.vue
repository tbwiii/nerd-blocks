<template lang="pug">
.container(:class="{dragging}")
  .control
    button(@click="rotate")
      i.icon-rotate
  TransitionGroup.piece(
    @mousedown="grab_start"
    :id="piece.id"
    :style="style"
    :name="dragging ? 'none' : 'token'"
    tag="div"
    )
    .block(
      v-for="block, i in blocks"
      :key="i"
      :style=`{
        'grid-column-start': block.x,
        'grid-row-start': block.y,
      }`
    )
  .control
    button(@click="reflect")
      i.icon-flip
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { useBlocksStore } from '@/store/blocks';

const store = useBlocksStore();
const props = defineProps({
  piece: Object
});

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
  }, 150);
}

const grab_move = (e) => {
  style.top = `calc(${e.clientY}px - 5vmin)`;
  style.left = `calc(${e.clientX}px - 5vmin)`;
}

const grab_end = (e) => {
  window.removeEventListener('mousemove', grab_move);
  window.removeEventListener('mouseup', grab_end);

  store.place_piece(props.piece);
  dragging.value = false;
  store.set_placing(false);
}

const rotate = () => store.rotate(props.piece);
const reflect = () => store.reflect(props.piece);

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

.container {
  --gap: calc(var(--cell-size) * (3 / 40));
  --size: calc(var(--cell-size));

  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto calc(var(--size) * 4 + var(--gap) * 3) auto;
  gap: 0.5rem;
  padding: 0.75rem 0;

  &:hover:not(.dragging) {
    .control {
      opacity: 1;
      visibility: visible;
    }
  }
}

.control {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  opacity: 0;
  visibility: hidden;
  transition: 0.2s ease;

  i {
    font-size: 1.25rem;
  }
}

.piece {
  align-self: center;
  justify-self: center;
}
</style>