import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { getAgentDir, type ExtensionAPI, type ExtensionContext, type Theme } from "@earendil-works/pi-coding-agent";
import { allocateImageId, Image, type TUI, visibleWidth } from "@earendil-works/pi-tui";

const PET_KEY = "pet";
const PACKAGE_DIRECTORY = fileURLToPath(new URL(".", import.meta.url));
const BUNDLED_ASSETS_DIRECTORY = join(PACKAGE_DIRECTORY, "assets");
const USER_DIRECTORY = join(getAgentDir(), "pi-pet-reze");
const USER_CONFIG_PATH = join(USER_DIRECTORY, "config.json");
const USER_ASSETS_DIRECTORY = join(USER_DIRECTORY, "assets");
const DEFAULT_CONFIG_PATH = join(PACKAGE_DIRECTORY, "config.default.json");

function initializeUserStorage(): void {
	mkdirSync(USER_ASSETS_DIRECTORY, { recursive: true });
	if (!existsSync(USER_CONFIG_PATH)) {
		copyFileSync(DEFAULT_CONFIG_PATH, USER_CONFIG_PATH);
	}
}

initializeUserStorage();

const CONFIG = JSON.parse(readFileSync(USER_CONFIG_PATH, "utf8")) as {
	display: {
		maxWidthCells: number;
		maxHeightCells: number;
		topMarginCells: number;
		horizontalAlignment: "left" | "right";
		leftMarginCells: number;
		rightMarginCells: number;
	};
};
const horizontalMarginKey =
	CONFIG.display.horizontalAlignment === "left" ? "leftMarginCells" : "rightMarginCells";
const horizontalMargin = CONFIG.display[horizontalMarginKey];
if (!Number.isInteger(horizontalMargin) || horizontalMargin < 0) {
	throw new Error(`display.${horizontalMarginKey} must be a non-negative integer`);
}

interface CharacterSource {
	name: string;
	assetsDirectory: string;
}

interface AnimationFrame {
	data: string;
	duration: number;
}

function getCharacters(): CharacterSource[] {
	const characters = new Map<string, CharacterSource>();
	for (const assetsDirectory of [BUNDLED_ASSETS_DIRECTORY, USER_ASSETS_DIRECTORY]) {
		for (const entry of readdirSync(assetsDirectory, { withFileTypes: true })) {
			if (entry.isDirectory()) {
				characters.set(entry.name, { name: entry.name, assetsDirectory });
			}
		}
	}
	return [...characters.values()].sort((left, right) => left.name.localeCompare(right.name));
}

function readFrames(character: CharacterSource): readonly AnimationFrame[] {
	return [1, 2, 3, 2].map((number) => ({
		data: readFileSync(join(character.assetsDirectory, character.name, `${character.name}${number}.png`)).toString(
			"base64",
		),
		duration: number === 1 ? 3_000 : number === 2 ? 90 : 140,
	}));
}

class Pet implements ImageTheme {
	private readonly images: Image[];
	private frameIndex = 0;
	private timer: ReturnType<typeof setTimeout> | undefined;

	constructor(
		private readonly tui: TUI,
		private readonly theme: Theme,
		private readonly frames: readonly AnimationFrame[],
	) {
		const imageId = allocateImageId();
		this.images = frames.map(
			({ data }) =>
				new Image(data, "image/png", this, {
					maxWidthCells: CONFIG.display.maxWidthCells,
					maxHeightCells: CONFIG.display.maxHeightCells,
					imageId,
				}),
		);
		this._scheduleNextFrame();
	}

	fallbackColor(text: string): string {
		return this.theme.fg("muted", text);
	}

	render(width: number): string[] {
		const imageWidth = Math.min(CONFIG.display.maxWidthCells - 2, width - 2);
		const targetColumn =
			CONFIG.display.horizontalAlignment === "left"
				? horizontalMargin + 1
				: Math.max(1, width - imageWidth - horizontalMargin + 1);
		const imageLines = this.images[this.frameIndex].render(CONFIG.display.maxWidthCells).map((line) => {
			const imageStart = line.indexOf("\x1b]1337;File=");
			if (imageStart >= 0) {
				return line.slice(0, imageStart) + `\x1b[${targetColumn}G` + line.slice(imageStart);
			}
			const padding =
				CONFIG.display.horizontalAlignment === "left"
					? horizontalMargin
					: Math.max(0, width - visibleWidth(line) - horizontalMargin);
			return " ".repeat(padding) + line;
		});
		return [...Array(CONFIG.display.topMarginCells).fill(""), ...imageLines];
	}

	invalidate(): void {
		this.images.forEach((image) => image.invalidate());
	}

	dispose(): void {
		clearTimeout(this.timer);
	}

	private _scheduleNextFrame(): void {
		this.timer = setTimeout(() => {
			this.frameIndex = (this.frameIndex + 1) % this.frames.length;
			this.tui.requestRender();
			this._scheduleNextFrame();
		}, this.frames[this.frameIndex].duration);
	}
}

export default function petExtension(pi: ExtensionAPI): void {
	const characters = getCharacters();
	let activeCharacter = characters[0];
	let visible = true;

	const setPet = (ctx: ExtensionContext): void => {
		ctx.ui.setWidget(
			PET_KEY,
			visible ? (tui, theme) => new Pet(tui, theme, readFrames(activeCharacter)) : undefined,
			{ placement: "belowEditor" },
		);
	};

	pi.on("session_start", (_event, ctx) => {
		if (ctx.hasUI) setPet(ctx);
	});

	pi.registerCommand("pet", {
		description: "Toggle the pet or select a character.",
		handler: async (_args, ctx) => {
			const action = await ctx.ui.select("Pet", [
				visible ? "Hide pet" : "Show pet",
				"Switch character",
			]);
			if (!action) return;

			if (action === "Hide pet") {
				visible = false;
				setPet(ctx);
				return;
			}
			if (action === "Show pet") {
				visible = true;
				setPet(ctx);
				return;
			}

			const characterName = await ctx.ui.select(
				"Select pet character",
				characters.map((character) => character.name),
			);
			if (!characterName) return;
			activeCharacter = characters.find((character) => character.name === characterName)!;
			visible = true;
			setPet(ctx);
		},
	});
}
