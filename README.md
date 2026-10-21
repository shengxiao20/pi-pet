# Reze Pet for Pi

Animated Pi terminal pet with distinct working, completed, aborted, and error reactions plus DIY character artwork support.

Bring your own artwork to build a DIY terminal pet: follow the asset layout in [DIY characters and assets](#diy-characters-and-assets) to add a character and its state-specific PNG animations without changing the installed npm package.

## Requirements

- Pi with the TUI in `regular` mode
- A terminal with native inline-image support, such as iTerm2 or Kitty

Pi automatically falls back to a text image placeholder in terminals that do not support inline images.

## Install

```bash
pi install npm:pi-pet-reze
```

For a project-local installation:

```bash
pi install --local npm:pi-pet-reze
```

Restart Pi after installation.

## Pet menu

Run:

```text
/pet
```

The menu lets you show or hide the pet and switch its character. A selected character is shown immediately. Selection is per Pi process; restarting Pi selects the first character folder alphabetically.

## Agent animations

The pet uses one `working` animation for the complete user-request lifecycle, then switches to the final Pi outcome animation:

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

`working` begins at Pi's `before_agent_start` event for a user message. Pi may perform automatic retries, recovery, compaction, or queued continuation work; the final outcome animation is selected only after `agent_settled`.

## User configuration

On first load, the package creates a user configuration file:

```text
~/.pi/agent/pi-pet-reze/config.json
```

Edit it, then run `/reload` in Pi:

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

| Property | Meaning |
| --- | --- |
| `maxWidthCells` / `maxHeightCells` | Maximum terminal-cell dimensions of the image. |
| `topMarginCells` | Blank widget rows above the pet. |
| `horizontalAlignment` | `"left"` or `"right"`. |
| `leftMarginCells` | Left edge spacing when aligned left. |
| `rightMarginCells` | Right edge spacing when aligned right. |

`config.json` is personal state and is not overwritten by package updates. The npm package contains only `config.default.json`, which seeds this user file once.

## DIY characters and assets

Use your own PNG artwork to create a personal terminal pet. Place it in the documented user asset directory below; no changes to the installed npm package are needed.

Bundled characters are installed under the npm package. Add personal characters under:

```text
~/.pi/agent/pi-pet-reze/assets/
```

Each immediate subdirectory is a selectable character. It must contain three idle frames named after that directory:

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

Every animation uses this sequence:

```text
<character>1.png → <character>2.png → <character>3.png → <character>2.png → repeat
```

The root-level files are required and provide the idle animation. The `working`, `completed`, `aborted`, and `error` directories are optional; if one is absent, its state uses the character's idle frames. Outcome directory names exactly match Pi's `AgentActivityOutcome` values.

User character folders are merged with bundled character folders. If both have the same folder name, the user folder takes precedence.

## License

The extension code is licensed under the [MIT License](LICENSE). Bundled Reze artwork remains subject to the separate rights notice in [NOTICE](NOTICE).

## Attribution

This package includes user-provided Reze character artwork. Ensure you have the rights needed to redistribute the artwork before publishing it publicly.

---

# Pi 的 Reze 宠物（中文）

为 Pi 终端提供会动的宠物。它会分别对**工作中、已完成、已中止和错误**状态作出动画反应，也支持使用自己的角色 PNG 素材。

## 环境要求

- 使用 `regular` TUI 模式的 Pi。
- 支持原生终端内嵌图片的终端，例如 iTerm2 或 Kitty。

不支持内嵌图片时，Pi 会自动显示文本图片占位符。

## 安装

```bash
pi install npm:pi-pet-reze
```

仅在当前项目安装：

```bash
pi install --local npm:pi-pet-reze
```

安装后重启 Pi。

## 使用与动画状态

运行 `/pet` 可以显示或隐藏宠物，并切换角色。选中的角色会立刻显示；选择只在当前 Pi 进程内有效，重启后按角色目录名称的字母顺序选择第一个角色。

用户提交消息后，`working` 动画从 `before_agent_start` 开始，覆盖模型请求、流式响应和工具调用。Pi 在 `agent_settled` 后才显示最终结果：`completed`、`aborted` 或 `error`。自动重试、恢复、压缩和排队续跑也都属于工作中阶段。

## 配置

首次加载时会创建个人配置文件：

```text
~/.pi/agent/pi-pet-reze/config.json
```

修改后在 Pi 中运行 `/reload`。`maxWidthCells` 和 `maxHeightCells` 限制图片的终端单元格尺寸；`topMarginCells` 设置顶部空白行；`horizontalAlignment` 可为 `"left"` 或 `"right"`；`leftMarginCells` 和 `rightMarginCells` 分别设置对应方向的边距。该文件是个人状态，包更新不会覆盖；npm 包中的 `config.default.json` 只用于首次初始化。

## 自定义角色与素材

将个人角色放入：

```text
~/.pi/agent/pi-pet-reze/assets/<角色名>/
```

每个角色目录必须在根目录中提供 `<角色名>1.png`、`<角色名>2.png`、`<角色名>3.png` 三张待机帧。可选的 `working/`、`completed/`、`aborted/` 和 `error/` 子目录各自使用同样命名的三张 PNG；缺少某个状态目录时会回退为待机帧。播放顺序为 `1 → 2 → 3 → 2 → 循环`。

用户角色与包内角色合并；若目录同名，用户角色优先。角色状态目录名称必须与 Pi 的 `AgentActivityOutcome` 值完全一致。

## 许可与署名

扩展代码采用 [MIT License](LICENSE)。随包的 Reze 素材仍受 [NOTICE](NOTICE) 中单独列出的权利声明约束；公开发布前请确认拥有重新分发自定义素材的权利。
