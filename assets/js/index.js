import {changeColorTheme, updateColorTheme} from "./colorTheme.js";
import {replaceIncludeElements} from "./include.js";

await replaceIncludeElements(document);

updateColorTheme();

document.querySelector(".color-theme-button")?.addEventListener("click", changeColorTheme);