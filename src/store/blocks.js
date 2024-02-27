import { ref, reactive } from 'vue';
import { defineStore } from 'pinia';

export const useBlocksStore = defineStore('blocks', () => {
  const pieces = reactive([
    {
      id: 'C',
      x: 1,
      y: 1,
      span: [2, 2],
      blocks: [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ],
    },
    {
      id: 'I2',
      x: 3,
      y: 3,
      span: [1, 2],
      blocks: [
        [0, 0],
        [0, 1],
      ],
    },
    {
      id: 'I3',
      x: 2,
      y: 3,
      span: [1, 3],
      blocks: [
        [0, 0],
        [0, 1],
        [0, 2],
      ],
    },
    {
      id: 'I4',
      x: 1,
      y: 3,
      span: [1, 4],
      blocks: [
        [0, 0],
        [0, 1],
        [0, 2],
        [0, 3],
      ],
    },
    {
      id: 'J',
      x: 4,
      y: 4,
      span: [2, 3],
      blocks: [
        [0, 0],
        [1, 0],
        [2, 0],
        [2, 1],
      ],
    },
    {
      id: 'O',
      x: 4,
      y: 2,
      span: [1, 1],
      blocks: [[0, 0]],
    },
    {
      id: 'R',
      x: 3,
      y: 1,
      span: [2, 2],
      blocks: [
        [0, 0],
        [1, 0],
        [0, 1],
      ],
    },
    {
      id: 'T',
      x: 5,
      y: 5,
      span: [3, 2],
      blocks: [
        [1, 0],
        [0, 1],
        [1, 1],
        [2, 1],
      ],
    },
    {
      id: 'Z',
      x: 3,
      y: 5,
      span: [3, 2],
      blocks: [
        [1, 0],
        [2, 0],
        [0, 1],
        [1, 1],
      ],
    },
  ]);

  const used_pieces = ref([]);
  const inactive = ref(true);
  const active_cell = reactive({ x: 1, y: 1 });

  const rotate = piece => {
    const blocks = piece.blocks;
    const rotated = blocks.map(block => [-block[1], block[0]]);
    const minX = Math.min(...rotated.map(block => block[0]));
    const minY = Math.min(...rotated.map(block => block[1]));
    const adjusted = rotated.map(block => [block[0] - minX, block[1] - minY]);

    piece.blocks = adjusted;
    piece.span.reverse();
  };

  const reflect = piece => {
    const blocks = piece.blocks;
    const reflected = blocks.map(block => [-block[0], block[1]]);
    const minX = Math.min(...reflected.map(block => block[0]));
    const maxX = Math.max(...reflected.map(block => block[0]));
    const adjusted = reflected.map(block => [
      block[0] - Math.min(minX, 0) + (minX >= 0 ? maxX : 0),
      block[1],
    ]);

    piece.blocks = adjusted;
  };

  const update_active_cell = cell => {
    if (!cell) {
      inactive.value = true;
    } else {
      inactive.value = false;
      active_cell.x = cell.x;
      active_cell.y = cell.y;
    }
  };

  const place_piece = piece => {
    if (inactive.value) return;

    const piece_cells = piece.blocks.map(block => ({
      x: block[0] + active_cell.x,
      y: block[1] + active_cell.y,
    }));

    const off_board = piece_cells.some(
      cell => cell.x < 1 || cell.x > 6 || cell.y < 1 || cell.y > 6
    );

    if (off_board) return;

    const collision = piece_cells.some(cell => {
      return used_pieces.value.some(used_piece => {
        return used_piece.blocks.some(used_block => {
          return (
            used_block[0] + used_piece.x === cell.x &&
            used_block[1] + used_piece.y === cell.y
          );
        });
      });
    });

    if (collision) return;

    piece.x = active_cell.x;
    piece.y = active_cell.y;

    pieces.splice(pieces.indexOf(piece), 1);
    used_pieces.value.push(piece);
  };

  const return_piece = piece => {
    piece.x = 0;
    piece.y = 0;

    used_pieces.value.splice(used_pieces.value.indexOf(piece), 1);
    pieces.push(piece);
  };

  return {
    pieces,
    used_pieces,
    inactive,
    active_cell,
    rotate,
    reflect,
    update_active_cell,
    place_piece,
    return_piece,
  };
});
