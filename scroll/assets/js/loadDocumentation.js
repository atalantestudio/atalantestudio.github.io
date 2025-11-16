import {convertMarkdownToHtml} from "./convertMarkdownToHtml.js";
import {highlightSyntax} from "./highlightSyntax.js";

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
 * @param {String} name
 * @param {?String} parentAnchor
 */
function getId(name, parentAnchor) {
	if (!parentAnchor) {
		return name;
	}

	return `${parentAnchor}-${name}`;
}

/**
 * @param {String} path
 */
function getFileName(path) {
	return path.split("/").reverse()[0];
}

/**
 * @param {HTMLElement} articleElement
 * @param {HTMLTemplateElement} templateElement
 */
export async function loadJsonDocumentation(articleElement, templateElement) {
	const documentationResponse = await fetch("scroll.json", {
		cache: "no-store",
	});

	/**
	 * @type {import("./Documentation.js").Documentation}
	 */
	const documentation = await documentationResponse.json();

	const currentReleaseIndex = 0;

	/**
	 * @type {HTMLElement}
	 */
	// @ts-ignore
	const declarationContainerTemplateElement = templateElement.content.querySelector(".declaration-container");

	/**
	 * @type {HTMLLIElement}
	 */
	// @ts-ignore
	const overloadListItemTemplateElement = templateElement.content.querySelector(".overload-list-item");

	for (const declaration of documentation.declarations) {
		const id = getId(declaration.name, declaration.parentAnchor);
		const anchor = `#${id}`;

		const declarationContainerElement = cloneNode(declarationContainerTemplateElement, true);

		const nameElement = declarationContainerElement.children[0];
		nameElement.id = id;
		nameElement.classList.add("anchor");
		nameElement.append(declaration.name);

		const anchorLinkElement = nameElement.children[0];
		anchorLinkElement.setAttribute("href", anchor);

		const descriptionElement = declarationContainerElement.children[1];
		descriptionElement.textContent = declaration.description;

		const overloadListElement = declarationContainerElement.children[2];

		for (const overload of declaration.overloads) {
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

			const overloadDescriptionElement = overloadListItemElement.children[2];

			if (overload.description) {
				overloadDescriptionElement.innerHTML = convertMarkdownToHtml(overload.description);
			}
			else {
				overloadDescriptionElement.remove();
			}

			overloadListElement.appendChild(overloadListItemElement);
		}

		articleElement.appendChild(declarationContainerElement);
	}
}