# 微信小程序扫雷游戏

一个使用微信小程序开发的经典扫雷游戏，使用 TypeScript 编写，具有完整的游戏功能和友好的用户界面。

## 功能特点

- 9x9 的游戏面板，包含10个随机分布的地雷
- 点击揭开格子，长按标记地雷
- 自动展开空白区域
- 剩余地雷计数器
- 游戏胜利和失败判定
- 重新开始功能
- 完整的游戏说明

## 技术栈

- 微信小程序
- TypeScript
- WXML & WXSS

## 项目结构

```
miniprogram/
├── pages/
│   └── index/
│       ├── index.ts    # 游戏核心逻辑
│       ├── index.wxml  # 游戏界面
│       └── index.wxss  # 游戏样式
├── app.ts
├── app.json
└── app.wxss
```

## 运行方法

1. 克隆项目到本地
```bash
git clone [项目地址]
```

2. 使用微信开发者工具打开项目
   - 打开微信开发者工具
   - 选择"导入项目"
   - 选择项目目录
   - 填入自己的 AppID（或使用测试号）

3. 编译运行
   - 点击开发者工具的"编译"按钮
   - 在模拟器中预览效果

## 游戏玩法

1. **基本规则**
   - 点击格子揭开内容
   - 长按格子标记/取消标记地雷
   - 数字表示周围8个格子中的地雷数量
   - 揭开所有非地雷格子即可获胜

2. **操作说明**
   - 左键点击：揭开格子
   - 长按：标记/取消标记地雷
   - 点击"重新开始"：开始新游戏

## 开发说明

### 主要组件

1. **游戏数据结构**
```typescript
data: {
  gameBoard: number[][],    // 游戏面板数据，-1表示地雷，0-8表示周围地雷数量
  revealed: boolean[][],    // 记录格子是否已被揭开
  flagged: boolean[][],     // 记录格子是否被标记为地雷
  rows: number,            // 游戏面板行数
  cols: number,            // 游戏面板列数
  mines: number,           // 地雷数量
  gameOver: boolean,       // 游戏是否结束
  gameWon: boolean,        // 是否胜利
  remainingMines: number   // 剩余未标记的地雷数
}
```

2. **核心方法**
   - `initGame()`: 初始化游戏面板
   - `onCellTap()`: 处理格子点击事件
   - `onCellLongTap()`: 处理格子长按事件
   - `revealCell()`: 揭开格子
   - `checkWin()`: 检查是否获胜

### 自定义配置

可以通过修改 `data` 中的以下参数来自定义游戏难度：
```typescript
rows: 9,        // 修改行数
cols: 9,        // 修改列数
mines: 10       // 修改地雷数量
```

## 贡献指南

1. Fork 本仓库
2. 创建新的功能分支
3. 提交您的更改
4. 推送到您的分支
5. 创建 Pull Request

## 开源协议

MIT License

## 联系方式

如有问题或建议，欢迎提交 Issue 或 Pull Request。