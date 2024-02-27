<template lang="pug">
.cell(
  :id="props.cell.id"
  :class="{ roadblock }"
  ref="cell")
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useBlocksStore } from '@/store/blocks';
import { useMouseInElement } from '@vueuse/core';

const store = useBlocksStore();
const props = defineProps({
  cell: Object,
});

const cell = ref(null);
const { isOutside } = useMouseInElement(cell);

const roadblock = computed(() => {
  return store.roadblocks.includes(props.cell.id);
});

watch(isOutside, (value) => {
  if (!value) {
    store.update_active_cell(props.cell);
  }
});
</script>

<style lang="scss" scoped>
.cell {
  background-color: var(--black);

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

  &.roadblock {
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      inset: 15%;
      border-radius: 50%;
      background-color: var(--roadblock);
    }
  }
}
</style>