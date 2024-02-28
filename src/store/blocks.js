import { ref, reactive, computed } from 'vue';
import { cloneDeep, remove } from 'lodash-es';
import { defineStore } from 'pinia';

export const useBlocksStore = defineStore('blocks', () => {
  const pieces = ref([
    {
      id: 'C',
      x: null,
      y: null,
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
      x: null,
      y: null,
      span: [1, 2],
      blocks: [
        [0, 0],
        [0, 1],
      ],
    },
    {
      id: 'I3',
      x: null,
      y: null,
      span: [1, 3],
      blocks: [
        [0, 0],
        [0, 1],
        [0, 2],
      ],
    },
    {
      id: 'I4',
      x: null,
      y: null,
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
      x: null,
      y: null,
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
      x: null,
      y: null,
      span: [1, 1],
      blocks: [[0, 0]],
    },
    {
      id: 'R',
      x: null,
      y: null,
      span: [2, 2],
      blocks: [
        [0, 0],
        [1, 0],
        [0, 1],
      ],
    },
    {
      id: 'T',
      x: null,
      y: null,
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
      x: null,
      y: null,
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
  const unused_pieces = ref([]);
  const roadblocks = ref([]);
  const inactive = ref(true);
  const active_cell = reactive({ x: 1, y: 1 });

  const success = computed(
    () => used_pieces.value.length === pieces.value.length
  );

  // const success = ref(true);

  const create_roadblocks = () => {
    const dice = [
      ['f1', 'a6'],
      ['b6', 'f2', 'e1', 'a5'],
      ['a2', 'c2', 'b1', 'b3', 'b2', 'a3'],
      ['f6', 'c6', 'd6', 'b5', 'a4', 'c5'],
      ['e5', 'f5', 'd5', 'f4', 'e4', 'e6'],
      ['a1', 'f3', 'd1', 'e2', 'd2', 'c1'],
      ['d4', 'c3', 'e3', 'd3', 'b4', 'c4'],
    ];

    // randomly pick one value from each dice
    roadblocks.value = dice.map(
      die => die[Math.floor(Math.random() * die.length)]
    );
  };

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

  const validate_placement = piece => {
    const piece_cells = piece.blocks.map(block => ({
      x: block[0] + active_cell.x,
      y: block[1] + active_cell.y,
    }));

    const off_board = piece_cells.some(
      cell => cell.x < 1 || cell.x > 6 || cell.y < 1 || cell.y > 6
    );

    const roadblock_collision = piece_cells.some(cell => {
      return roadblocks.value.some(roadblock => {
        const address = roadblock
          .split('')
          .map((part, i) => {
            if (i === 0) return part.charCodeAt(0) - 96;
            return parseInt(part);
          })
          .reverse();

        return address[0] === cell.x && address[1] === cell.y;
      });
    });

    const piece_collision = piece_cells.some(cell => {
      return used_pieces.value
        .filter(p => p !== piece)
        .some(used_piece => {
          return used_piece.blocks.some(used_block => {
            return (
              used_block[0] + used_piece.x === cell.x &&
              used_block[1] + used_piece.y === cell.y
            );
          });
        });
    });

    return !off_board && !roadblock_collision && !piece_collision;
  };

  const place_piece = (piece, already_placed = false) => {
    if (inactive.value) {
      if (already_placed) return_piece(piece);
      return;
    }

    if (!validate_placement(piece)) return;

    piece.x = active_cell.x;
    piece.y = active_cell.y;

    if (already_placed) return;

    const mover = remove(unused_pieces.value, p => p === piece);
    used_pieces.value.push(...mover);
  };

  const return_piece = piece => {
    piece.x = 0;
    piece.y = 0;

    const mover = remove(used_pieces.value, p => p === piece);
    unused_pieces.value.push(...mover);
  };

  const clear_board = () => {
    used_pieces.value = [];
    unused_pieces.value = cloneDeep(pieces.value);
  };

  const init = () => {
    clear_board();
    roadblocks.value = [];
    inactive.value = true;
    active_cell.x = 1;
    active_cell.y = 1;
    create_roadblocks();
  };

  return {
    pieces,
    used_pieces,
    unused_pieces,
    roadblocks,
    inactive,
    active_cell,
    success,
    init,
    clear_board,
    create_roadblocks,
    rotate,
    reflect,
    update_active_cell,
    place_piece,
    return_piece,
  };
});
