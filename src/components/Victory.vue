<template lang="pug">
#victory
  button.dismiss(@click="store.dismiss") dismiss
  .text(ref="victory")
    h1 Congratulations!
    h3 You win!
    p You beat the game in:
    .timer
      span.timer__minutes {{ String(time.minutes).padStart(2, '0') }}
      span.timer__colon :
      span.timer__seconds {{ String(time.seconds).padStart(2, '0') }}
      span.timer__colon :
      span.timer__milliseconds {{ String(time.milliseconds).padStart(2, '0') }}
    button.btn(@click="store.init") Play again
    span.particle(
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
  const count = Math.ceil((victory.value.offsetWidth / 50) * 10);
  const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  confetti.value = Array(count).fill().map(() => {
    const top = `${random(10, 50)}%`;
    const left = `${random(0, 100)}%`;
    const width = `${random(6, 8)}px`;
    const height = `${random(3, 4)}px`;
    const animationDelay = `${random(0, 30) / 10}s`;
    const className = `c${random(1, 12)}`;

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
#victory {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
  text-align: center;
  position: relative;
  grid-area: 1 / 1 / 2 / 2;
}

.dismiss {
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

.text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: relative;
  font-weight: 700;
  gap: 1rem;
  text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.6);

  h1 {
    font-size: 5rem;
    margin: 0;
    line-height: 1;
  }

  h3 {
    line-height: 1;
    font-size: 3rem;
    margin: 0;
  }

  p {
    line-height: 1;
    font-size: 1.5rem;
    margin: 1rem 0 0;


  }

  .timer {
    font-size: 1.3875rem;

    &__minutes {
      color: var(--random-1);
    }

    &__seconds {
      color: var(--random-2);
    }

    &__milliseconds {
      color: var(--random-3);
    }

    &__colon {
      animation: blink 2s infinite ease-in-out;
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
  }

  button {
    --color: var(--random-4);
    margin-top: 2rem;
    text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.6);

    &:hover {
      text-shadow: 0px 0px 0px rgba(0, 0, 0, 0.6);
    }
  }

  :deep(.particle) {
    opacity: 0;
    position: absolute;
    animation: confetti 2s ease-in-out infinite;

    &.c1 {
      background-color: var(--red);
    }

    &.c2 {
      background-color: var(--orange);
    }

    &.c3 {
      background-color: var(--yellow);
    }

    &.c4 {
      background-color: var(--green);
    }

    &.c5 {
      background-color: var(--teal);
    }

    &.c6 {
      background-color: var(--blue);
    }

    &.c7 {
      background-color: var(--indigo);
    }

    &.c8 {
      background-color: var(--purple);
    }

    &.c9 {
      background-color: var(--pink);
    }

    &.c10 {
      background-color: var(--beige);
    }

    &.c11 {
      background-color: var(--algae);
    }

    &.c12 {
      background-color: var(--rose);
    }
  }
}


@keyframes confetti {
  0% {
    opacity: 0;
    transform: translateY(0%) rotate(0deg);
    z-index: -1;
  }

  10% {
    opacity: 1;
  }

  35% {
    transform: translateY(-2200%) rotate(270deg);
    z-index: 2;
  }

  80% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform: translateY(1000%) rotate(980deg);
    z-index: 2;
  }
}
</style>