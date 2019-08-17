window.onload = function() {
  init();
};

function init() {
  let canvas = document.getElementById("canvas");
  canvas.width = 800;
  canvas.height = 800;
  canvas.style.backgroundColor = "#D9AF8B";
  ctx = canvas.getContext("2d");
  game = new Game();
}
class Game {
  constructor() {
    this.width = 200;
    this.size = 4;
    this.grid = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
    // generate 2 nomor baru
    this.setTwoNumber();
    this.listener();
    this.draw();
  }
  newGrid() {
    return [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
  }
  flipGrid(grid) {
    for (let i = 0; i < this.size; i++) {
      grid[i].reverse();
    }
    return grid;
  }
  rotateGrid() {
    let newGrid = this.newGrid();
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        newGrid[i][j] = this.grid[j][i];
      }
    }
    return newGrid;
  }
  listener() {
    document.onkeyup = function(e) {
      let rotated = false;
      let flipped = false;
      let played = true;
      if (e.keyCode == 40) {
        //   NOTHING
      } else if (e.keyCode == 38) {
        this.grid = this.flipGrid(this.grid);
        flipped = true;
      } else if (e.keyCode == 39) {
        this.grid = this.rotateGrid(this.grid);
        rotated = true;
      } else if (e.keyCode == 37) {
        this.grid = this.rotateGrid(this.grid);
        this.grid = this.flipGrid(this.grid);
        rotated = true;
        flipped = true;
      } else {
        played = false;
      }

      if (played) {
        let past = this.copyGrid(this.grid);
        for (let i = 0; i < this.size; i++) {
          this.grid[i] = this.operate(this.grid[i]);
        }
        let changed = this.compare(past, this.grid);

        if (flipped) {
          this.grid = this.flipGrid(this.grid);
        }

        if (rotated) {
          this.grid = this.rotateGrid(this.grid);
          this.grid = this.rotateGrid(this.grid);
          this.grid = this.rotateGrid(this.grid);
        }

        //jika sesuatu berubah maka generate nomor baru
        if (changed) {
          this.setNumber();
        }

        // update gambar
        this.update();
      }
    }.bind(this);
  }
  compare(a, b) {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (a[i][j] != b[i][j]) {
          return true;
        }
      }
    }
    return false;
  }
  copyGrid(grid) {
    let gridClone = this.newGrid();
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        gridClone[i][j] = grid[i][j];
      }
    }
    return gridClone;
  }
  operate(row) {
    row = this.slide(row);
    row = this.combine(row);
    row = this.slide(row);
    return row;
  }
  update() {
    ctx.clearRect(0, 0, 800, 800);
    this.draw();
  }
  slide(row) {
    //filter array yang nilainya 0, dan return kan array yang != 0
    let arr = row.filter(val => val);
    // cari brp banyak yg kosong
    let missing = 4 - arr.length;
    // buat array baru yg missing
    let zeros = Array(missing).fill(0);
    arr = zeros.concat(arr);
    return arr;
  }
  combine(row) {
    for (let i = this.size - 1; i >= 0; i--) {
      let a = row[i];
      let b = row[i - 1];
      if (a == b) {
        row[i] = a + b;
        row[i - 1] = 0;
      }
    }
    return row;
  }
  setTwoNumber() {
    this.setNumber();
    this.setNumber();
  }
  draw() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        ctx.beginPath();
        ctx.strokeStyle = "#8C5C4A";
        ctx.lineWidth = 15;
        ctx.rect(i * this.width, j * this.width, this.width, this.width);
        ctx.stroke();
        ctx.closePath();

        if (this.grid[i][j] == 0) continue;

        if (this.grid[i][j] != 0) {
          let val = this.grid[i][j];
          ctx.beginPath();
          ctx.strokeStyle = "#8C5C4A";

          ctx.fillStyle = "#A6775B";
          ctx.lineWidth = 15;
          ctx.rect(i * this.width, j * this.width, this.width, this.width);
          ctx.fill();
          ctx.stroke();

          ctx.font = "normal 96px Calibri";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = "white";

          ctx.fillText(
            val,
            i * this.width + this.width / 2,
            j * this.width + this.width / 2
          );

          ctx.closePath();
        }
      }
    }
  }
  setNumber() {
    let options = [];
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.grid[i][j] === 0) {
          options.push({ x: i, y: j });
        }
      }
    }
    if (options.length > 0) {
      let spot = options[Math.floor(Math.random() * (options.length - 1))];
      let random = Math.round(Math.random());
      this.grid[spot.x][spot.y] = random > 0.5 ? 2 : 4;
    }
  }
}
