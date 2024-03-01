<template lang="pug">
#victory.victory(ref="victory")
  button.victory__dismiss(@click="store.dismiss") dismiss
  .victory__main
    h1.victory__title Congratulations!
    h3.victory__subtitle You win!
    p.victory__info You beat the game in:
    .victory__timer
      span.victory__timer-minutes {{ String(time.minutes).padStart(2, '0') }}
      span.victory__timer-colon :
      span.victory__timer-seconds {{ String(time.seconds).padStart(2, '0') }}
      span.victory__timer-colon :
      span.victory__timer-milliseconds {{ String(time.milliseconds).padStart(2, '0') }}
    button.btn.victory__reset(@click="store.init") Play again
  span.victory__confetti(
    v-for="confetti, i in confetti"
    :key="i"
    :style="confetti.style"
    :class="confetti.className"
  )
</template>

<script setup>
import { useBlocksStore } from '@/store/blocks';
import { ref, computed, onMounted } from 'vue';

const store = useBlocksStore();

const victory = ref(null);
const confetti = ref([]);

const time = computed(() => store.current_time);

const make_confetti = () => {
  const count = Math.ceil((victory.value.offsetWidth / 100) * 10);
  const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  confetti.value = Array(count).fill().map(() => {
    const top = `${random(10, 50)}%`;
    const left = `${random(0, 100)}%`;
    const width = `${random(6, 8)}px`;
    const height = `${random(3, 4)}px`;
    const animationDelay = `${random(0, 30) / 10}s`;
    const className = `victory__confetti--color-${random(1, 9)}`;

    return {
      style: {
        top,
        left,
        width,
        height,
        animationDelay
      },
      className
    };
  });
}

onMounted(make_confetti);
</script>

<style lang="scss" scoped>
.victory {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
  text-align: center;
  position: relative;
  grid-area: 1 / 1 / 2 / 2;

  &__dismiss {
    position: absolute;
    top: 0;
    right: 0;
    padding: 1rem;
    font-size: 1.125rem;
    cursor: pointer;
    transition: 0.2s ease;

    &:hover {
      color: var(--random-1);
    }
  }

  &__main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    position: relative;
    font-weight: 700;
    gap: 1rem;
    text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.6);
  }

  &__title {
    @include fluid(font-size, 2rem, 5rem);
    margin: 0;
    line-height: 1;
  }

  &__subtitle {
    @include fluid(font-size, 1.875rem, 3rem);
    line-height: 1;
    margin: 0;
  }

  &__info {
    @include fluid(font-size, 1.125rem, 1.5rem);
    line-height: 1;
    margin: 1rem 0 0;
  }

  &__timer {
    @include fluid(font-size, 1.125rem, 1.3875rem);

    &-minutes {
      color: var(--random-1);
    }

    &-seconds {
      color: var(--random-2);
    }

    &-milliseconds {
      color: var(--random-3);
    }

    &-colon {
      animation: blink 2s infinite ease-in-out;
    }
  }

  &__reset {
    --color: var(--random-4);
    margin-top: 2rem;
    text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.6);

    &:hover {
      text-shadow: 0px 0px 0px rgba(0, 0, 0, 0.6);
    }
  }

  :deep(.victory__confetti) {
    opacity: 0;
    position: absolute;
    animation: confetti 2s ease-in-out infinite;

    @for $i from 1 through 9 {
      &.victory__confetti--color-#{$i} {
        background-color: var(--random-#{$i});
      }
    }
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
}

@keyframes confetti {
  0% {
    opacity: 0;
    transform: translateY(0%) rotate(0deg);
    z-index: -1;
  }

  10% {
    opacity: 0.8;
  }

  35% {
    transform: translateY(-10vh) rotate(270deg);
    z-index: 2;
  }

  80% {
    opacity: 0.8;
  }

  100% {
    opacity: 0;
    transform: translateY(20vh) rotate(980deg);
    z-index: 2;
  }
}
</style>