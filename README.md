# Reze Pet for Pi

A blinking pet widget for Pi's terminal UI. It includes bundled characters and supports user-added characters without modifying the npm installation.

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

## Characters and assets

Bundled characters are installed under the npm package. Add personal characters under:

```text
~/.pi/agent/pi-pet-reze/assets/
```

Each immediate subdirectory is a selectable character. It must contain three files named after that directory:

```text
~/.pi/agent/pi-pet-reze/assets/
└── power/
    ├── power1.png  # open eyes
    ├── power2.png  # half blink
    └── power3.png  # closed eyes
```

The animation sequence is:

```text
<character>1.png → <character>2.png → <character>3.png → <character>2.png → repeat
```

User character folders are merged with bundled character folders. If both have the same folder name, the user folder takes precedence.

## Attribution

This package includes user-provided Reze character artwork. Ensure you have the rights needed to redistribute the artwork before publishing it publicly.
