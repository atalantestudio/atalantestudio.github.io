/**
 * @param {String} text
 */
export function convertMarkdownToHtml(text) {
	text = text.replace(/([^\n]+(?:\n[^\n]+)*)\n{2,}|([^\n]+)$/g, (_, $1, $2) => `<p>${$1 || $2}</p>`);
	text = text.replace(/\n/g, "<br />");
	text = text.replace(/`(.*)`/g, "<code>$1</code>");
	text = text.replace(/\[(.*)\]\((.*)\)/g, "<a href='$2'>$1</a>");

	return text;
}