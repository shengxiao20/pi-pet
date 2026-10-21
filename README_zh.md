# Pi 的 Reze 宠物

[English](README.md)
支持工作中、已完成、已中止和错误状态动画反应，并支持自定义角色素材的 Pi 终端动态宠物。
带上自己的素材来创建 DIY 终端宠物：按照[自定义角色和素材](#自定义角色和素材)中的素材布局添加角色及其状态专属 PNG 动画，无需修改已安装的 npm 包。
## 环境要求
  使用 `regular` 模式 TUI 的 Pi。
  支持原生内嵌图片的终端，例如 iTerm2 或 Kitty。
在不支持内嵌图片的终端中，Pi 会自动回退为文本图片占位符。
## 安装
```bash
pi install npm:pi-pet-reze
```
仅为当前项目安装：
```bash
pi install --local npm:pi-pet-reze
```
安装后重启 Pi。
## 宠物菜单
运行：
```text
/pet
```
该菜单可显示或隐藏宠物，并切换其角色。
选定的角色会立即显示。
选择仅对当前 Pi 进程有效；重启 Pi 后会按字母顺序选择第一个角色文件夹。
## Agent 动画
宠物会在完整的用户请求生命周期内使用一个 `working` 动画，随后切换为 Pi 的最终结果动画：
```text
User submits a message
└── working
    ├── Pi requests the model
    ├── Pi streams the response
    └── Pi runs tools

Agent settles
├── completed → completed
├── aborted   → aborted
└── error     → error
```
用户提交消息
└── working（工作中）
    ├── Pi 请求模型
    ├── Pi 流式输出响应
    └── Pi 运行工具
Agent 结束
├── completed（已完成）→ completed
├── aborted（已中止）  → aborted
└── error（错误）      → error
对于用户消息，`working` 从 Pi 的 `before_agent_start` 事件开始。
Pi 可能执行自动重试、恢复、压缩或排队的续跑工作；只有在 `agent_settled` 后才选择最终结果动画。
## 用户配置
首次加载时，该包会创建用户配置文件：
```text
~/.pi/agent/pi-pet-reze/config.json
```
编辑该文件，然后在 Pi 中运行 `/reload`：
```json
{
  "display": {
    "maxWidthCells": 24,
    "maxHeightCells": 24,
    "topMarginCells": 1,
    "horizontalAlignment": "left",
    "leftMarginCells": 1,
    "rightMarginCells": 1
  }
}
```
| 属性 | 含义 |
| `maxWidthCells` / `maxHeightCells` | 图片的最大终端单元格尺寸。 |
| `topMarginCells` | 宠物上方的空白组件行数。 |
| `horizontalAlignment` | `"left"` 或 `"right"`。 |
| `leftMarginCells` | 左对齐时左边缘的间距。 |
| `rightMarginCells` | 右对齐时右边缘的间距。 |
`config.json` 是个人状态，不会被包更新覆盖。
npm 包只包含 `config.default.json`，它仅用于首次初始化此用户文件。
## 自定义角色和素材
使用自己的 PNG 素材来创建个人终端宠物。
将它放入下方所述的用户素材目录；无需修改已安装的 npm 包。
随包角色安装在 npm 包目录下。
将个人角色添加到：
```text
~/.pi/agent/pi-pet-reze/assets/
```
每个直接子目录都是一个可选角色。
它必须包含以该目录名称命名的三张待机帧：
```text
~/.pi/agent/pi-pet-reze/assets/
└── power/
    ├── power1.png  # idle frame 1
    ├── power2.png  # idle frame 2
    ├── power3.png  # idle frame 3
    ├── working/
    │   ├── power1.png
    │   ├── power2.png
    │   └── power3.png
    ├── completed/
    │   ├── power1.png
    │   ├── power2.png
    │   └── power3.png
    ├── aborted/
    │   ├── power1.png
    │   ├── power2.png
    │   └── power3.png
    └── error/
        ├── power1.png
        ├── power2.png
        └── power3.png
```
每个动画使用以下序列：
```text
<character>1.png → <character>2.png → <character>3.png → <character>2.png → repeat
<角色名>1.png → <角色名>2.png → <角色名>3.png → <角色名>2.png → 循环
```
根目录文件是必需的，并提供待机动画。
`working`、`completed`、`aborted` 和 `error` 目录是可选的；若其中一个不存在，对应状态会使用该角色的待机帧。
结果目录名称必须与 Pi 的 `AgentActivityOutcome` 值完全匹配。
用户角色文件夹会与随包角色文件夹合并。
若两者具有相同文件夹名称，用户文件夹优先。
## 许可
扩展代码采用 [MIT License](LICENSE) 许可。
随包的 Reze 素材仍受 [NOTICE](NOTICE) 中单独的权利声明约束。
## 署名
该包包含用户提供的 Reze 角色素材。
在公开发布前，请确保你拥有重新分发该素材所需的权利。
