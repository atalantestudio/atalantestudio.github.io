export {};

const includeElements = document.querySelectorAll("include");

for (const includeElement of includeElements) {
	const url = includeElement.getAttribute("src");

	if (!url) {
		console.error("Could not find 'src' attribute in <include> element.");

		continue;
	}

	const response = await fetch(url);

	if (!response.ok) {
		continue;
	}

	const text = await response.text();
	const parser = new DOMParser();
	const document = parser.parseFromString(text, "text/html");

	includeElement.replaceWith(...document.body.children);
}