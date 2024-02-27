<template lang="pug">
#game
  Board
  Tray
</template>

<script setup>
import Board from './components/Board.vue';
import Tray from './components/Tray.vue';

</script>

<style scoped lang="scss">
#game {
  --cell-size: 10vmin;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
}

</style>
