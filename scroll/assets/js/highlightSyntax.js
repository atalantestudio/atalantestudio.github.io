/**
 * @param {String} syntax
 */
export function highlightSyntax(syntax) {
	syntax = syntax.replace(/\n/g, "<br />");
	syntax = syntax.replace(/(?<=\<)\b(\w+)\b(?=\>)/g, "<span class='namespace'>$1</span>");
	syntax = syntax.replace(/\b([A-Z]\w*)\b/g, "<span class='namespace'>$1</span>");
	syntax = syntax.replace(/\b(\w+)\b(?=\()/, `<span class="function">$1</span>`);
	syntax = syntax.replace(/\b(const|explicit|operator|static|template|typename)\b/g, "<span class='keyword'>$1</span>");
	syntax = syntax.replace(/(&{1,2})/g, "<span class='operator'>$1</span>");
	syntax = syntax.replace(/\b(void)\b/g, "<span class='type'>$1</span>");
	syntax = syntax.replace(/\b(\w+)\b(?=<[^/])/g, "<span class='namespace'>$1</span>");

	return syntax;
}