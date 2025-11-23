import {convertMarkdownToHtml} from "./convertMarkdownToHtml.js";
import {highlightLanguageCpp, highlightSyntax} from "./highlightSyntax.js";

/**
 * @param {HTMLElement} element
 * @param {Boolean} recursive
 */
function cloneNode(element, recursive) {
	/**
	 * @type {HTMLElement}
	 */
	// @ts-ignore
	const clonedElement = element.cloneNode(recursive);

	return clonedElement;
}

/**
 * @param {String} path
 */
function getFileName(path) {
	return path.split("/").reverse()[0];
}

/**
 * @param {String} log
 */
function highlightConsoleLog(log) {
	log = log.replace(/(\[[\s\S]*?)(?=(\[|$))/g, "<span class='log'>$1</span>");
	log = log.replace(/( TRACE )/g, "<span class='level-trace'>$1</span>");
	log = log.replace(/( DEBUG )/g, "<span class='level-debug'>$1</span>");
	log = log.replace(/( INFO )/g, "<span class='level-info'>$1</span>");
	log = log.replace(/( WARNING )/g, "<span class='level-warning'>$1</span>");
	log = log.replace(/( ERROR )/g, "<span class='level-error'>$1</span>");
	log = log.replace(/(?<=\])(\s+)(\w*)(\s+)(?=\<)/g, "$1<span class='source'>$2</span>$3");
	log = log.replace(/(\[.*?\])/g, "<span class='timestamp'>$1</span>");

	return log;
}

/**
 * @param {HTMLElement} articleElement
 * @param {HTMLTemplateElement} templateElement
 * @param {String} articleText
 * @param {import("./Documentation.js").Documentation} documentation
 */
export function loadDocumentation(articleElement, templateElement, articleText, documentation) {
	// @ts-ignore
	const converter = new showdown.Converter();	
	converter.setOption("tables", true);

	articleElement.innerHTML = converter.makeHtml(articleText);

	// Remove "id" attribute from H1 headings.
	{
		const headingElements = articleElement.querySelectorAll("h1");

		for (const headingElement of headingElements) {
			headingElement.removeAttribute("id");
		}
	}

	/**
	 * @type {HTMLLinkElement}
	 */
	// @ts-ignore
	const anchorLinkTemplateElement = templateElement.content.querySelector(".anchor-link");

	/**
	 * @type {HTMLSpanElement}
	 */
	// @ts-ignore
	const anchorPrefixTemplateElement = templateElement.content.querySelector(".anchor-prefix");

	{
		const headingElements = articleElement.querySelectorAll("h2, h3");
		let parentId = "";

		for (const headingElement of headingElements) {
			headingElement.id = headingElement.textContent;
			headingElement.classList.add("anchor");

			if (headingElement.tagName === "H2") {
				parentId = headingElement.id;
			}
			else if (parentId && headingElement.textContent.startsWith(parentId)) {
				const anchorPrefixElement = cloneNode(anchorPrefixTemplateElement, true);
				anchorPrefixElement.textContent = `${parentId}.`;

				headingElement.textContent = headingElement.textContent.substring(parentId.length + 1);
				headingElement.prepend(anchorPrefixElement);
			}

			const anchorLinkElement = cloneNode(anchorLinkTemplateElement, true);
			anchorLinkElement.setAttribute("href", `#${headingElement.id}`);

			headingElement.prepend(anchorLinkElement);
		}
	}

	{
		const nodeIterator = document.createNodeIterator(articleElement, NodeFilter.SHOW_COMMENT, () => NodeFilter.FILTER_ACCEPT);

		while (true) {
			const node = nodeIterator.nextNode();

			if (!node) {
				break;
			}

			const declarationId = String(node.nodeValue).trim();

			if (!(declarationId in documentation.declarations)) {
				continue;
			}

			// @ts-ignore
			insertDeclarationDocumentation(declarationId, documentation, node, node.parentNode, templateElement);
		}
	}

	{
		const blockquoteElements = articleElement.querySelectorAll("blockquote");

		for (const blockquoteElement of blockquoteElements) {
			if (blockquoteElement.children[0].textContent.startsWith("[!INFO]")) {
				blockquoteElement.classList.add("note", "note-info");
				blockquoteElement.children[0].innerHTML = blockquoteElement.children[0].innerHTML.substring(8);

				continue;
			}
			else if (blockquoteElement.children[0].textContent.startsWith("[!WARNING]")) {
				blockquoteElement.classList.add("note", "note-warning");
				blockquoteElement.children[0].innerHTML = blockquoteElement.children[0].innerHTML.substring(11);
			}
			else if (blockquoteElement.children[0].textContent.startsWith("[!ERROR]")) {
				blockquoteElement.classList.add("note", "note-error");
				blockquoteElement.children[0].innerHTML = blockquoteElement.children[0].innerHTML.substring(9);
			}
		}
	}

	{
		const codeElements = articleElement.querySelectorAll(".language-cpp");

		for (const codeElement of codeElements) {
			codeElement.innerHTML = highlightLanguageCpp(codeElement.textContent);
		}
	}

	{
		const codeElements = articleElement.querySelectorAll("code[class*='log:console']");

		for (const codeElement of codeElements) {
			codeElement.className = "";
			codeElement.classList.add("log-console", "language-log-console");
			codeElement.innerHTML = highlightConsoleLog(codeElement.textContent);
		}
	}
}

/**
 * @param {String} declarationId
 * @param {import("./Documentation.js").Documentation} documentation
 * @param {Node} node
 * @param {Node} parentNode
 * @param {HTMLTemplateElement} templateElement
 */
function insertDeclarationDocumentation(declarationId, documentation, node, parentNode, templateElement) {
	// TODO
	const currentReleaseIndex = 1;

	/**
	 * @type {HTMLUListElement}
	 */
	// @ts-ignore
	const overloadListTemplateElement = templateElement.content.querySelector(".overload-list");

	/**
	 * @type {HTMLLIElement}
	 */
	// @ts-ignore
	const overloadListItemTemplateElement = templateElement.content.querySelector(".overload-list-item");

	const declaration = documentation.declarations[declarationId];
	const overloadListElement = cloneNode(overloadListTemplateElement, true);

	for (const overload of declaration) {
		if (overload.releaseIndex > currentReleaseIndex) {
			continue;
		}

		if (overload.deprecationReleaseIndex && overload.deprecationReleaseIndex <= currentReleaseIndex) {
			continue;
		}

		const release = documentation.releases[overload.releaseIndex];

		const overloadListItemElement = cloneNode(overloadListItemTemplateElement, true);

		const overloadLinkElement = overloadListItemElement.children[0];
		overloadLinkElement.setAttribute("href", `${documentation.repositoryUrl}/blob/${release.commitHash}/${overload.filePath}#L${overload.line}`);
		overloadLinkElement.textContent = `${getFileName(overload.filePath)}:${overload.line}`;

		const overloadSyntaxElement = overloadListItemElement.children[1];
		overloadSyntaxElement.innerHTML = highlightSyntax(overload.syntax);

		if (overload.description) {
			overloadListItemElement.innerHTML += convertMarkdownToHtml(overload.description);
		}

		overloadListElement.appendChild(overloadListItemElement);
	}

	parentNode.replaceChild(overloadListElement, node);
}