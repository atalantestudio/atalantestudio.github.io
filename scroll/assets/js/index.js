import {loadDocumentation} from "./loadDocumentation.js";

async function _loadDocumentation() {
	/**
	 * @type {HTMLTemplateElement}
	 */
	// @ts-ignore
	const templateElement = document.querySelector(".documentation-template");

	/**
	 * @type {HTMLElement}
	 */
	// @ts-ignore
	const articleElement = document.querySelector("article");

	const articleResponse = await fetch("scroll.md", {
		cache: "no-store",
	});

	const articleText = await articleResponse.text();

	const documentationResponse = await fetch("scroll.json", {
		cache: "no-store",
	});

	/**
	 * @type {import("./Documentation.js").Documentation}
	 */
	const documentationText = await documentationResponse.json();

	loadDocumentation(articleElement, templateElement, articleText, documentationText);
}

await _loadDocumentation();