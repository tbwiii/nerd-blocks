<template lang="pug">
#timer.timer
  span.timer__text
    span.timer__minutes {{ String(time.minutes).padStart(2, '0') }}
    span.timer__colon :
    span.timer__seconds {{ String(time.seconds).padStart(2, '0') }}
    span.timer__colon :
    span.timer__milliseconds {{ String(time.milliseconds).padStart(2, '0') }}
</template>

<script setup>
import { computed } from 'vue';
import { useBlocksStore } from '@/store/blocks';

const store = useBlocksStore();
const time = computed(() => store.current_time);
</script>

<style lang="scss" scoped>
.timer {
  display: flex;
  align-self: flex-end;
  justify-self: flex-end;
  padding: 1rem;

  &__text {
    font-size: 2rem;
    font-weight: 700;
    transition: 0.2s ease;
    line-height: 1;
  }

  &__minutes {
    color: var(--random-5);
  }

  &__seconds {
    color: var(--random-6);
  }

  &__milliseconds {
    color: var(--random-7);
  }

  &__colon {
    animation: blink 2s infinite ease-in-out;
  }
}

@keyframes blink {
  0% {
    opacity: 0.5;
  }

  50.5% {
    opacity: 1;
  }

  100% {
    opacity: 0.5;
  }
}</style>