const COLOR_THEME_STORAGE_KEY = "atalante.github.io:color-theme";

const ThemeProperties = [
	"primary-color",
	"secondary-color",
	"tertiary-color",
	"text-color",
	"text-hover-color",
	"link-border-color",
	"link-hover-background-color",
	"target-background-color",
	"external-link-color",
	"external-link-hover-color",
	"note-color",
	"note-error-color",
	"note-info-color",
	"note-warning-color",
	"highlight-color",
	"highlight-class-color",
	"highlight-function-color",
	"highlight-keyword-color",
	"highlight-namespace-color",
	"highlight-operator-color",
	"highlight-type-color",
];

const ColorThemeSuffix = [
	"light",
	"dark",
];

/**
 * @enum {Number}
 */
export const ColorTheme = {
	LIGHT: 0,
	DARK: 1,
};

export function getCurrentColorTheme() {
	const colorThemeValue = localStorage.getItem(COLOR_THEME_STORAGE_KEY);

	if (!colorThemeValue) {
		return ColorTheme.LIGHT;
	}

	/**
	 * @type {ColorTheme}
	 */
	const colorTheme = Number(colorThemeValue);

	return colorTheme;
}

/**
 * @param {ColorTheme} colorTheme
 */
export function setColorTheme(colorTheme) {
	localStorage.setItem(COLOR_THEME_STORAGE_KEY, colorTheme.toString());

	const style = getComputedStyle(document.documentElement);
	const suffix = ColorThemeSuffix[colorTheme];

	for (const property of ThemeProperties) {
		const value = style.getPropertyValue(`--${property}-${suffix}`);

		document.documentElement.style.setProperty(`--${property}`, value);
	}
}