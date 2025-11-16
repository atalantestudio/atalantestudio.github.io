import {loadJsonDocumentation} from "./loadDocumentation.js";

/**
 * @param {HTMLTitleElement} titleElement
 * @param {HTMLTemplateElement} templateElement
 */
function updateToAnchor(titleElement, templateElement) {
	titleElement.classList.add("anchor");

	/**
	 * @type {HTMLAnchorElement}
	 */
	const anchorLinkElement = templateElement.content.querySelector(".anchor-link").cloneNode(true);

	anchorLinkElement.href = `#${titleElement.textContent}`;

	titleElement.id = titleElement.textContent;
	titleElement.appendChild(anchorLinkElement);
}

/**
 * @param {String} signature
 */
function highlightSignature(signature) {
	let highlightedSignature = signature;

	highlightedSignature = highlightedSignature.replace(/\\n/g, "<br />");
	highlightedSignature = highlightedSignature.replace(/\b(\w+)\b(?=\()/, `<span class="function">$1</span>`);
	highlightedSignature = highlightedSignature.replace(/\b(const|explicit|static|template|typename)\b/g, "<span class='keyword'>$1</span>");
	// highlightedSignature = highlightedSignature.replace(/(&{1,2})/g, "<span class='operator'>$1</span>");
	// highlightedSignature = highlightedSignature.replace(/\b(\w+)(?=::)/g, "<span class='namespace'>$1</span>");
	// highlightedSignature = highlightedSignature.replace(/\b([A-Z]\w*|(?<=::)\w+)\b/g, "<span class='namespace'>$1</span>");
	highlightedSignature = highlightedSignature.replace(/\b(void)\b/g, "<span class='type'>$1</span>");

	// highlightedSignature = highlightedSignature.replace(/\b(ConsoleLogger|FileLogger|Logger)\b/g, "<a href='#$1' class='link link-external'>$1</a>");

	return highlightedSignature;
}

/**
 * @param {String} log
 */
function highlightConsoleLog(log) {
	let highlightedLog = log;

	highlightedLog = highlightedLog.replace(/^(\[.*\])/, "<span class='timestamp'>$1</span>");
	highlightedLog = highlightedLog.replace(/(?<=(WARNING|ERROR)\s+)([\S\s]*)/m, "<span class='log'>$2</span>");
	highlightedLog = highlightedLog.replace(/( TRACE )/, "<span class='level-label-trace'>$1</span>");
	highlightedLog = highlightedLog.replace(/( DEBUG )/, "<span class='level-label-debug'>$1</span>");
	highlightedLog = highlightedLog.replace(/( INFO )/, "<span class='level-label-info'>$1</span>");
	highlightedLog = highlightedLog.replace(/( WARNING )/, "<span class='level-label-warning'>$1</span>");
	highlightedLog = highlightedLog.replace(/( ERROR )/, "<span class='level-label-error'>$1</span>");

	return highlightedLog;
}

/**
 * @param {String} log
 */
function highlightFileLog(log) {
	let highlightedLog = log;

	// TODO

	return highlightedLog;
}

/**
 * @param {HTMLElement} articleElement
 * @param {HTMLTemplateElement} templateElement
 */
async function loadMarkdownDocumentation(articleElement, templateElement) {
	const documentationResponse = await fetch("scroll.md", {
		cache: "no-store",
	});

	let documentationMarkdown = await documentationResponse.text();

	// Replace '_' by '~'.
	documentationMarkdown = documentationMarkdown.replaceAll("_", "~");

	// @ts-ignore
	const converter = new showdown.Converter();	
	converter.setOption("tables", true);

	const documentationHtml = converter.makeHtml(documentationMarkdown);

	articleElement.innerHTML = documentationHtml;

	// Remove "id" attribute from H1 headings.
	{
		/**
		 * @type {NodeListOf<HTMLHeadingElement>}
		 */
		const headingElements = articleElement.querySelectorAll("h1");

		for (const headingElement of headingElements) {
			headingElement.removeAttribute("id");
		}
	}

	// Transform H2-H6 headings to anchors.
	{
		/**
		 * @type {NodeListOf<HTMLTitleElement>}
		 */
		const titleElements = articleElement.querySelectorAll("h2, h3, h4, h5, h6");

		for (const titleElement of titleElements) {
			updateToAnchor(titleElement, templateElement);
		}
	}

	// Highlight console logs.
	{
		const codeElements = articleElement.querySelectorAll("code[class~='log:console']");

		for (const codeElement of codeElements) {
			codeElement.innerHTML = highlightConsoleLog(codeElement.textContent.trim());
		}
	}

	{
		const blockquoteElements = articleElement.querySelectorAll("blockquote");

		for (const blockquoteElement of blockquoteElements) {
			if (blockquoteElement.children[0].textContent.startsWith("[!INFO]")) {
				blockquoteElement.children[0].textContent = blockquoteElement.children[0].textContent.substring(8);

				blockquoteElement.classList.add("note", "note-info");
			}

			if (blockquoteElement.children[0].textContent.startsWith("[!WARNING]")) {
				blockquoteElement.children[0].textContent = blockquoteElement.children[0].textContent.substring(11);

				blockquoteElement.classList.add("note", "note-warning");
			}

			if (blockquoteElement.children[0].textContent.startsWith("[!ERROR]")) {
				blockquoteElement.children[0].textContent = blockquoteElement.children[0].textContent.substring(9);

				blockquoteElement.classList.add("note", "note-error");
			}
		}
	}
}

async function loadDocumentation() {
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

	await loadMarkdownDocumentation(articleElement, templateElement);
	await loadJsonDocumentation(articleElement, templateElement);
}

await loadDocumentation();