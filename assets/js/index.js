import {ColorTheme, getCurrentColorTheme, setColorTheme} from "./colorTheme.js";
import {replaceIncludeElements} from "./include.js";

await replaceIncludeElements(document);

setColorTheme(getCurrentColorTheme());

document.querySelector(".light-theme-button")?.addEventListener("click", () => setColorTheme(ColorTheme.LIGHT));
document.querySelector(".dark-theme-button")?.addEventListener("click", () => setColorTheme(ColorTheme.DARK));