const DOCUMENT_PARSER = new DOMParser();

/**
 * @param {Document} document
 */
export async function replaceIncludeElements(document) {
	const includeElements = document.querySelectorAll("include");

	for (const includeElement of includeElements) {
		const includePath = includeElement.getAttribute("src");

		if (!includePath) {
			console.error("Could not find 'src' attribute in <include> element.");

			continue;
		}

		const response = await fetch(includePath);

		if (!response.ok) {
			continue;
		}

		const text = await response.text();
		const document = DOCUMENT_PARSER.parseFromString(text, "text/html");

		replaceIncludeElements(document);

		includeElement.replaceWith(...document.body.children);
	}
}