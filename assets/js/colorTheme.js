const COLOR_THEME_STORAGE_KEY = "atalante.github.io:color-theme";

const ColorProperty = {
	PRIMARY: "primary-color",
	SECONDARY: "secondary-color",
	TERTIARY: "tertiary-color",
	TEXT: "text-color",
	TEXT_HOVER: "text-hover-color",
	LINK_BORDER_COLOR: "link-border-color",
	LINK_HOVER_BACKGROUND_COLOR: "link-hover-background-color",
	TARGET_BACKGROUND_COLOR: "target-background-color",
	EXTERNAL_LINK_COLOR: "external-link-color",
	EXTERNAL_LINK_HOVER_COLOR: "external-link-hover-color",
	NOTE_ERROR_COLOR: "note-error-color",
	NOTE_INFO_COLOR: "note-info-color",
	NOTE_WARNING_COLOR: "note-warning-color",
};

const ColorThemeSuffix = [
	"light",
	"dark",
];

const ColorTheme = {
	LIGHT: 0,
	DARK: 1,
};

function getColorTheme() {
	const colorThemeValue = localStorage.getItem(COLOR_THEME_STORAGE_KEY);

	if (!colorThemeValue) {
		return ColorTheme.LIGHT;
	}

	return Number(colorThemeValue);
}

/**
 * @param {Number} colorTheme
 */
function setColorTheme(colorTheme) {
	localStorage.setItem(COLOR_THEME_STORAGE_KEY, colorTheme.toString());
}

export function changeColorTheme() {
	const colorTheme = Number(!getColorTheme());

	setColorTheme(colorTheme);
	updateColorTheme();
}

export function updateColorTheme() {
	const colorTheme = getColorTheme();

	const style = getComputedStyle(document.documentElement);
	const suffix = ColorThemeSuffix[colorTheme];

	for (const property of Object.values(ColorProperty)) {
		const value = style.getPropertyValue(`--${property}-${suffix}`);

		document.documentElement.style.setProperty(`--${property}`, value);
	}

	const button = document.querySelector("header .color-theme-button");

	if (!button) {
		return;
	}

	if (colorTheme == ColorTheme.LIGHT) {
		button.textContent = "Light Mode";
	}
	else {
		button.textContent = "Dark Mode";
	}
}