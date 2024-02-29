<template lang="pug">
i.roadblock(
  :id="props.roadblock.id"
  :style=`{
    'grid-column-start': props.roadblock.x,
    'grid-row-start': props.roadblock.y,
  }`)
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useBlocksStore } from '@/store/blocks';

const props = defineProps({
  roadblock: Object,
});
</script>

<style lang="scss" scoped>
.roadblock {
  align-self: center;
  justify-self: center;
  border-radius: 50%;
  aspect-ratio: 1 / 1;
  width: calc(var(--cell-size) * 0.65);
  background-color: var(--roadblock);
}

.roadblock-move {
  transition-duration: 0.3s;
  transition-timing-function: ease;

  @for $i from 1 through 7 {
    &:nth-of-type(#{$i}) {
      transition-delay: #{($i - 1) * 0.075}s;
    }
  }
}
</style>