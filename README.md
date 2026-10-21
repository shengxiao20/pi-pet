# Reze Pet for Pi

[中文](README_zh.md)

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

The menu lets you show or hide the pet and switch its character.  
A selected character is shown immediately.  
Selection is per Pi process; restarting Pi selects the first character folder alphabetically.  

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



`working` begins at Pi's `before_agent_start` event for a user message.  
Pi may perform automatic retries, recovery, compaction, or queued continuation work; the final outcome animation is selected only after `agent_settled`.  

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

| --- | --- |

`config.json` is personal state and is not overwritten by package updates.  
The npm package contains only `config.default.json`, which seeds this user file once.  

## DIY characters and assets

Use your own PNG artwork to create a personal terminal pet.  
Place it in the documented user asset directory below; no changes to the installed npm package are needed.  

Bundled characters are installed under the npm package.  
Add personal characters under:  

```text
~/.pi/agent/pi-pet-reze/assets/
```

Each immediate subdirectory is a selectable character.  
It must contain three idle frames named after that directory:  

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


The root-level files are required and provide the idle animation.  
The `working`, `completed`, `aborted`, and `error` directories are optional; if one is absent, its state uses the character's idle frames.  
Outcome directory names exactly match Pi's `AgentActivityOutcome` values.  

User character folders are merged with bundled character folders.  
If both have the same folder name, the user folder takes precedence.  

## License

The extension code is licensed under the [MIT License](LICENSE).  
Bundled Reze artwork remains subject to the separate rights notice in [NOTICE](NOTICE).  

## Attribution

This package includes user-provided Reze character artwork.  
Ensure you have the rights needed to redistribute the artwork before publishing it publicly.
