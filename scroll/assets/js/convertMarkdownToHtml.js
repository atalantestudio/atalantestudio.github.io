/**
 * @param {String} text
 */
export function convertMarkdownToHtml(text) {
	text = text.replace(/([\s\S]+?)(\n{2,}|$)/g, "<p>$1</p>");
	text = text.replaceAll(/`(.*?)`/g, "<code>$1</code>");
	text = text.replace(/\[(.*)\]\((.*?)\)/g, "<a href='$2'>$1</a>");
	text = text.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
	text = text.replace(/\*(.*?)\*/g, "<i>$1</i>");

	return text;
}