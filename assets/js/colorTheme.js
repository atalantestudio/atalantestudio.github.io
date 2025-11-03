const COLOR_THEME_STORAGE_KEY = "atalante.github.io:color-theme";

const ColorProperty = {
	PRIMARY: "primary-color",
	SECONDARY: "secondary-color",
	TERTIARY: "tertiary-color",
	TEXT: "text-color",
	TEXT_HOVER: "text-hover-color",
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