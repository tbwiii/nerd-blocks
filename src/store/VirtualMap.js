export default class VirtualMap {
  constructor(width, height, buffer = 10) {
    this.originalWidth = width;
    this.originalHeight = height;
    this.buffer = buffer;
    this.resetGrid(); // Initialize grid and avoid elements
  }

  resetGrid() {
    this.width = this.originalWidth - this.buffer * 2; // Account for buffer on both sides
    this.height = this.originalHeight - this.buffer * 2; // Account for buffer on top and bottom
    this.grid = this.initializeGrid();
    this.fetchAvoidElements();
  }

  initializeGrid() {
    // Initialize a 2D array representing the window grid with all false (meaning free)
    return Array.from({ length: this.height }, () =>
      new Array(this.width).fill(false)
    );
  }

  fetchAvoidElements() {
    // Populate the grid with true where elements should be avoided
    document.querySelectorAll('[data-avoid]').forEach(elem => {
      const rect = elem.getBoundingClientRect();
      this.markAreaAsOccupied(rect);
    });
  }

  markAreaAsOccupied(rect) {
    // Convert element rectangle to grid coordinates and mark as occupied
    const startX = Math.max(Math.floor(rect.left) - this.buffer, 0);
    const startY = Math.max(Math.floor(rect.top) - this.buffer, 0);
    const endX = Math.min(Math.ceil(rect.right) + this.buffer, this.width);
    const endY = Math.min(Math.ceil(rect.bottom) + this.buffer, this.height);

    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
          this.grid[y][x] = true;
        }
      }
    }
  }

  findPlacementFor({ width, height }) {
    let attempts = 0;
    const maxAttempts = 500;
    while (attempts < maxAttempts) {
      attempts++;
      const x = Math.floor(Math.random() * (this.width - width));
      const y = Math.floor(Math.random() * (this.height - height));
      if (this.isAreaFree(x, y, width, height) || attempts === maxAttempts) {
        this.markAreaAsOccupied({
          left: x,
          top: y,
          right: x + width,
          bottom: y + height,
        });
        return { left: x + this.buffer, top: y + this.buffer };
      }
    }
  }

  isAreaFree(startX, startY, width, height) {
    for (let y = startY; y < startY + height; y++) {
      for (let x = startX; x < startX + width; x++) {
        if (this.grid[y][x]) return false;
      }
    }
    return true;
  }
}
