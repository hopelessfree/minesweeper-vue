import type { BlockState } from '~/types'
const directions = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
]

export class GamePlay {
  mineGenerated = false // 游戏是否已经生成过雷

  public WIDTH = 10
  public HEIGHT = 10
  public state = ref()

  constructor(width: number, height: number) {
    this.WIDTH = width
    this.HEIGHT = height
    this.reset()
  }

  /**
   * 开始游戏和重新开始游戏
   */
  reset = () => {
    this.mineGenerated = false
    this.state.value = Array.from(
      { length: this.HEIGHT },
      (_, y) => Array.from(
        { length: this.WIDTH },
        (_, x): BlockState => ({
          x,
          y,
          mine: false,
          revealed: false,
          adjacentMines: 0,
        }),
      ),
    )
  }

  /**
   * 生成地雷
   */
  generateMines = (state: BlockState[][], initial: BlockState) => {
    for (const row of state) {
      for (const block of row) {
        if (Math.abs(initial.x - block.x) <= 1)
          continue

        if (Math.abs(initial.y - block.y) <= 1)
          continue

        block.mine = Math.random() < 0.5
      }
    }

    this.updateNumbers(state)
  }

  /**
   * 生成周围的雷数
   */
  updateNumbers = (satate: BlockState[][]) => {
    satate.forEach((row: BlockState[]) => {
      row.forEach((block) => {
        if (block.mine)
          return
        this.getSiblings(block)
          .forEach(item => item.mine && block.adjacentMines++)
      })
    })
  }

  /**
   * 获取周围的空白
   */
  getSiblings = (block: BlockState) => {
    return directions
      .map(([dx, dy]) => {
        const x2 = block.x + dx
        const y2 = block.y + dy
        if (x2 < 0 || x2 >= this.WIDTH || y2 < 0 || y2 >= this.HEIGHT)
          return undefined

        return this.state.value[y2][x2]
      })
      .filter(Boolean) as BlockState[]
  }

  /**
   * 展开周围的空白
   */
  expendZero = (block: BlockState) => {
    if (block.adjacentMines > 0)
      return

    this.getSiblings(block)
      .forEach((item) => {
        if (!item.revealed) {
          item.revealed = true
          this.expendZero(item)
        }
      })
  }

  /**
   * 右键 - 种棋子
   */
  onRightClick = (block: BlockState) => {
    if (block.revealed)
      return

    block.flagged = !block.flagged
  }

  /**
   * 左键 - 点击方格
   */
  onClick = (block: BlockState) => {
    if (this.mineGenerated === false) {
      this.generateMines(this.state.value, block)
      this.mineGenerated = true
    }

    if (block.mine)
      alert('BOOOOOOOOM!')

    block.revealed = true
    this.expendZero(block)
  }

  /**
   * 检验游戏状态
   */
  checkGameState = () => {
    if (this.mineGenerated === false)
      return

    const blocks = this.state.value.flat()
    if (blocks.every((b: BlockState) => b.flagged || b.revealed)) {
      if (blocks.some((b: BlockState) => b.flagged && !b.mine))
        alert('You cheat')

      else
        alert('You Win')
    }
  }
}
