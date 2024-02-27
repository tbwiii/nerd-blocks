import { ref, reactive, computed } from 'vue';
import { defineStore } from 'pinia';

export const useBlocksStore = defineStore('blocks', () => {
  const pieces = reactive([
    {
      id: 'C',
      unused: true,
      x: 1,
      y: 1,
      blocks: [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ],
    },
    {
      id: 'I2',
      unused: true,
      x: 3,
      y: 3,
      blocks: [
        [0, 0],
        [0, 1],
      ],
    },
    {
      id: 'I3',
      unused: true,
      x: 2,
      y: 3,
      blocks: [
        [0, 0],
        [0, 1],
        [0, 2],
      ],
    },
    {
      id: 'I4',
      unused: true,
      x: 1,
      y: 3,
      blocks: [
        [0, 0],
        [0, 1],
        [0, 2],
        [0, 3],
      ],
    },
    {
      id: 'J',
      unused: true,
      x: 4,
      y: 4,
      blocks: [
        [0, 0],
        [1, 0],
        [2, 0],
        [2, 1],
      ],
    },
    {
      id: 'O',
      unused: true,
      x: 4,
      y: 2,
      blocks: [[0, 0]],
    },
    {
      id: 'R',
      unused: true,
      x: 3,
      y: 1,
      blocks: [
        [0, 0],
        [1, 0],
        [0, 1],
      ],
    },
    {
      id: 'T',
      unused: true,
      x: 5,
      y: 5,
      offset_x: 1,
      offset_y: 0,
      blocks: [
        [0, 0],
        [-1, 1],
        [0, 1],
        [1, 1],
      ],
    },
    {
      id: 'Z',
      unused: true,
      x: 3,
      y: 5,
      offset_x: 1,
      offset_y: 0,
      blocks: [
        [0, 0],
        [1, 0],
        [-1, 1],
        [0, 1],
      ],
    },
  ]);

  const update_piece = (piece, key, value) => {
    const match = pieces.find(p => p === piece);
    match[key] = value;
  };

  return {
    pieces,
    update_piece,
  };
});
