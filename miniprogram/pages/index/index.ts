// index.ts
// 获取应用实例
const app = getApp<IAppOption>()

Component({
  data: {
    gameBoard: [] as number[][],  // 游戏面板数据，-1表示地雷，0-8表示周围地雷数量
    revealed: [] as boolean[][],   // 记录格子是否已被揭开
    flagged: [] as boolean[][],    // 记录格子是否被标记为地雷
    rows: 9,                       // 游戏面板行数
    cols: 9,                       // 游戏面板列数
    mines: 10,                     // 地雷数量
    gameOver: false,              // 游戏是否结束
    gameWon: false,               // 是否胜利
    remainingMines: 10,           // 剩余未标记的地雷数
  },

  lifetimes: {
    attached() {
      this.initGame()
    }
  },

  methods: {
    // 初始化游戏
    initGame() {
      const { rows, cols, mines } = this.data
      // 初始化游戏面板
      const gameBoard = Array(rows).fill(0).map(() => Array(cols).fill(0))
      const revealed = Array(rows).fill(false).map(() => Array(cols).fill(false))
      const flagged = Array(rows).fill(false).map(() => Array(cols).fill(false))

      // 随机放置地雷
      let minesPlaced = 0
      while (minesPlaced < mines) {
        const row = Math.floor(Math.random() * rows)
        const col = Math.floor(Math.random() * cols)
        if (gameBoard[row][col] !== -1) {
          gameBoard[row][col] = -1
          minesPlaced++
        }
      }

      // 计算每个格子周围的地雷数量
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          if (gameBoard[i][j] !== -1) {
            let count = 0
            // 检查周围8个方向
            for (let di = -1; di <= 1; di++) {
              for (let dj = -1; dj <= 1; dj++) {
                const ni = i + di
                const nj = j + dj
                if (ni >= 0 && ni < rows && nj >= 0 && nj < cols && gameBoard[ni][nj] === -1) {
                  count++
                }
              }
            }
            gameBoard[i][j] = count
          }
        }
      }

      this.setData({
        gameBoard,
        revealed,
        flagged,
        gameOver: false,
        gameWon: false,
        remainingMines: mines
      })
    },

    // 处理点击格子事件
    onCellTap(e: any) {
      const { row, col } = e.currentTarget.dataset
      if (this.data.gameOver || this.data.flagged[row][col]) return

      const { gameBoard, revealed } = this.data
      if (gameBoard[row][col] === -1) {
        // 点到地雷，游戏结束
        this.revealAll()
        this.setData({ gameOver: true })
        wx.showModal({
          title: '游戏结束',
          content: '很遗憾，你踩到地雷了！',
          showCancel: false,
          success: () => {
            this.initGame()
          }
        })
      } else {
        // 揭开安全的格子
        this.revealCell(row, col)
        // 检查是否获胜
        this.checkWin()
      }
    },

    // 处理长按格子事件（标记地雷）
    onCellLongTap(e: any) {
      const { row, col } = e.currentTarget.dataset
      if (this.data.gameOver || this.data.revealed[row][col]) return

      const { flagged, remainingMines } = this.data
      const newFlagged = [...flagged]
      newFlagged[row][col] = !newFlagged[row][col]

      this.setData({
        flagged: newFlagged,
        remainingMines: remainingMines + (newFlagged[row][col] ? -1 : 1)
      })
    },

    // 揭开格子
    revealCell(row: number, col: number) {
      const { rows, cols, gameBoard, revealed, flagged } = this.data
      if (row < 0 || row >= rows || col < 0 || col >= cols || revealed[row][col] || flagged[row][col]) return

      const newRevealed = [...revealed]
      newRevealed[row][col] = true
      this.setData({ revealed: newRevealed })

      // 如果是空格子（周围没有地雷），则自动揭开周围的格子
      if (gameBoard[row][col] === 0) {
        for (let di = -1; di <= 1; di++) {
          for (let dj = -1; dj <= 1; dj++) {
            this.revealCell(row + di, col + dj)
          }
        }
      }
    },

    // 揭开所有格子
    revealAll() {
      const { rows, cols } = this.data
      const newRevealed = Array(rows).fill(true).map(() => Array(cols).fill(true))
      this.setData({ revealed: newRevealed })
    },

    // 检查是否获胜
    checkWin() {
      const { rows, cols, gameBoard, revealed, flagged } = this.data
      let win = true

      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          // 如果有非地雷格子未被揭开，则未获胜
          if (gameBoard[i][j] !== -1 && !revealed[i][j]) {
            win = false
            break
          }
        }
        if (!win) break
      }

      if (win) {
        this.setData({ gameWon: true, gameOver: true })
        wx.showModal({
          title: '恭喜',
          content: '你赢了！',
          showCancel: false,
          success: () => {
            this.initGame()
          }
        })
      }
    },

    // 重新开始游戏
    restartGame() {
      this.initGame()
    }
  }
})