import { ref, reactive, computed, watch } from 'vue';
import { defineStore } from 'pinia';
import VirtualMap from './VirtualMap';

const virtualMap = new VirtualMap(0);

export const useBlocksStore = defineStore('blocks', () => {
  const pieces = ref([
    {
      id: 'C',
      x: null,
      y: null,
      position: { top: 0, left: 0 },
      size: { height: 0, width: 0 },
      placed: false,
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
      position: { top: 0, left: 0 },
      size: { height: 0, width: 0 },
      placed: false,
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
      position: { top: 0, left: 0 },
      size: { height: 0, width: 0 },
      placed: false,
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
      position: { top: 0, left: 0 },
      size: { height: 0, width: 0 },
      placed: false,
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
      position: { top: 0, left: 0 },
      size: { height: 0, width: 0 },
      placed: false,
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
      position: { top: 0, left: 0 },
      size: { height: 0, width: 0 },
      placed: false,
      span: [1, 1],
      blocks: [[0, 0]],
    },
    {
      id: 'R',
      x: null,
      y: null,
      position: { top: 0, left: 0 },
      size: { height: 0, width: 0 },
      placed: false,
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
      position: { top: 0, left: 0 },
      size: { height: 0, width: 0 },
      placed: false,
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
      position: { top: 0, left: 0 },
      size: { height: 0, width: 0 },
      placed: false,
      span: [3, 2],
      blocks: [
        [1, 0],
        [2, 0],
        [0, 1],
        [1, 1],
      ],
    },
  ]);

  const placing = ref(false);
  const roadblocks = ref([]);
  const inactive = ref(true);
  const active_cell = reactive({ x: 1, y: 1 });

  const current_time = reactive({
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });

  const timing = ref(false);

  const start_timer = () => {
    if (timing.value) return;
    let start;
    timing.value = true;

    const timer = () => {
      if (!timing.value) return;
      if (start === undefined) {
        start = Date.now();
      }
      const elapsed = Date.now() - start;

      current_time.milliseconds = Math.floor((elapsed % 1000) / 10);
      current_time.seconds = Math.floor((elapsed % 60000) / 1000);
      current_time.minutes = Math.floor(elapsed / 60000);
      requestAnimationFrame(timer);
    };
    requestAnimationFrame(timer);
  };

  const stop_timer = () => {
    timing.value = false;
  };

  const reset_timer = () => {
    timing.value = false;
    current_time.minutes = 0;
    current_time.seconds = 0;
    current_time.milliseconds = 0;
  };

  const set_placing = value => (placing.value = value);

  const success = computed(
    () =>
      pieces.value.filter(piece => piece.placed).length === pieces.value.length
  );

  const dismissed = ref(false);

  const dismiss = () => (dismissed.value = true);

  watch(success, value => {
    if (value) {
      stop_timer();
    }
  });

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

    roadblocks.value = dice.map(die => {
      return die[Math.floor(Math.random() * die.length)]
        .split('')
        .map((part, i) => {
          if (i === 0) return part.charCodeAt(0) - 96;
          return parseInt(part);
        })
        .reverse();
    });
  };

  const rotate = (piece, counterclockwise = false) => {
    const blocks = piece.blocks;
    const rotated = blocks.map(block =>
      counterclockwise ? [block[1], -block[0]] : [-block[1], block[0]]
    );
    const minX = Math.min(...rotated.map(block => block[0]));
    const minY = Math.min(...rotated.map(block => block[1]));
    const adjusted = rotated.map(block => [block[0] - minX, block[1] - minY]);

    piece.blocks = adjusted;
    piece.span.reverse();
  };

  const reflect = (piece, horizontal = false) => {
    const blocks = piece.blocks;
    const reflected = blocks.map(block =>
      horizontal ? [block[0], -block[1]] : [-block[0], block[1]]
    );

    if (horizontal) {
      const minY = Math.min(...reflected.map(block => block[1]));
      const maxY = Math.max(...reflected.map(block => block[1]));
      const adjusted = reflected.map(block => [
        block[0],
        block[1] - Math.min(minY, 0) + (minY >= 0 ? maxY : 0),
      ]);
      piece.blocks = adjusted;
    } else {
      const minX = Math.min(...reflected.map(block => block[0]));
      const maxX = Math.max(...reflected.map(block => block[0]));
      const adjusted = reflected.map(block => [
        block[0] - Math.min(minX, 0) + (minX >= 0 ? maxX : 0),
        block[1],
      ]);
      piece.blocks = adjusted;
    }
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
        return roadblock[0] === cell.x && roadblock[1] === cell.y;
      });
    });

    const piece_collision = piece_cells.some(cell => {
      return pieces.value
        .filter(p => p !== piece && p.placed)
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

  const set_position = (piece, { top, left }) => {
    piece.position.top = top;
    piece.position.left = left;
  };

  const set_size = (piece, { height, width }) => {
    piece.size.height = height;
    piece.size.width = width;
  };

  const place_piece = piece => {
    if (inactive.value) return return_piece(piece, false);

    if (!validate_placement(piece)) return return_piece(piece, true, true);

    piece.x = active_cell.x;
    piece.y = active_cell.y;

    piece.placed = true;
  };

  const return_piece = (piece, reset_placement = true) => {
    piece.placed = false;
    piece.x = null;
    piece.y = null;

    if (reset_placement) {
      const { height, width } = piece.size;
      piece.position = virtualMap.findPlacementFor({ height, width });
    }
  };

  const clear_board = () => {
    pieces.value.forEach((piece, i) => {
      if (i === 0) virtualMap.resetGrid();
      return_piece(piece, true, false);
    });
  };

  const set_random_color = () => {
    const colors = [
      'var(--red)',
      'var(--orange)',
      'var(--yellow)',
      'var(--green)',
      'var(--teal)',
      'var(--blue)',
      'var(--indigo)',
      'var(--violet)',
      'var(--pink)',
    ];

    const color_1 = colors[Math.floor(Math.random() * colors.length)];
    colors.splice(colors.indexOf(color_1), 1);
    const color_2 = colors[Math.floor(Math.random() * colors.length)];
    colors.splice(colors.indexOf(color_2), 1);
    const color_3 = colors[Math.floor(Math.random() * colors.length)];
    colors.splice(colors.indexOf(color_3), 1);
    const color_4 = colors[Math.floor(Math.random() * colors.length)];
    colors.splice(colors.indexOf(color_4), 1);
    const color_5 = colors[Math.floor(Math.random() * colors.length)];
    colors.splice(colors.indexOf(color_5), 1);
    const color_6 = colors[Math.floor(Math.random() * colors.length)];
    colors.splice(colors.indexOf(color_6), 1);
    const color_7 = colors[Math.floor(Math.random() * colors.length)];
    colors.splice(colors.indexOf(color_7), 1);
    const color_8 = colors[Math.floor(Math.random() * colors.length)];
    colors.splice(colors.indexOf(color_8), 1);
    const color_9 = colors[Math.floor(Math.random() * colors.length)];
    colors.splice(colors.indexOf(color_9), 1);

    document.documentElement.style.setProperty('--random-1', color_1);
    document.documentElement.style.setProperty('--random-2', color_2);
    document.documentElement.style.setProperty('--random-3', color_3);
    document.documentElement.style.setProperty('--random-4', color_4);
    document.documentElement.style.setProperty('--random-5', color_5);
    document.documentElement.style.setProperty('--random-6', color_6);
    document.documentElement.style.setProperty('--random-7', color_7);
    document.documentElement.style.setProperty('--random-8', color_8);
    document.documentElement.style.setProperty('--random-9', color_9);
  };

  let lastWidth = window.innerWidth;

  const onWidthResize = () => {
    const currentWidth = window.innerWidth;
    if (currentWidth !== lastWidth) {
      virtualMap.resetGrid();
      pieces.value.forEach(piece => {
        if (!piece.placed) {
          const { height, width } = piece.size;
          piece.position = virtualMap.findPlacementFor({ height, width });
        }
      });
      lastWidth = currentWidth;
    }
  };

  const debouncedWidthResize = debounce(onWidthResize, 350);
  window.addEventListener('resize', debouncedWidthResize);

  const init = () => {
    reset_timer();
    clear_board();
    roadblocks.value = [];
    inactive.value = true;
    active_cell.x = 1;
    active_cell.y = 1;
    dismissed.value = false;
    create_roadblocks();
    set_random_color();
  };

  set_random_color();

  return {
    pieces,
    roadblocks,
    inactive,
    active_cell,
    success,
    placing,
    current_time,
    timing,
    dismissed,
    dismiss,
    start_timer,
    reset_timer,
    init,
    clear_board,
    create_roadblocks,
    rotate,
    reflect,
    update_active_cell,
    place_piece,
    return_piece,
    set_placing,
    set_position,
    set_size,
  };
});

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
