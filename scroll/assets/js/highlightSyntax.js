/**
 * @param {String} syntax
 */
export function highlightSyntax(syntax) {
	syntax = syntax.replace(/\n/g, "<br />");
	syntax = syntax.replace(/(?<=\<)\b(\w+)\b(?=\>)/g, "<span class='namespace'>$1</span>");
	syntax = syntax.replace(/\b(const\b|explicit\b|operator(<<)|static\b|template\b|typename\b)/g, "<span class='keyword'>$1</span>");
	syntax = syntax.replace(/\b(uint32|uint64|void)\b/g, "<span class='type'>$1</span>");
	syntax = syntax.replace(/(\~?\w+\b)(?=\()/, `<span class="function">$1</span>`);
	syntax = syntax.replace(/(&{1,2})/g, "<span class='operator'>$1</span>");
	syntax = syntax.replace(/(?<!\S)\b([A-Z]\w*?)\b(?!\()/g, "<span class='namespace'>$1</span>");
	syntax = syntax.replace(/\b(\w+)(?=::)/g, "<span class='namespace'>$1</span>");
	syntax = syntax.replace(/\b(\w+)(?=(<{1,2}[^/<]))/g, "<span class='namespace'>$1</span>");

	return syntax;
}

/**
 * @param {String} code
 */
export function highlightLanguageCpp(code) {
	code = code.replaceAll("    ", "\t");

	code = code.replace(/\<(.*?)\>/g, "<span class='string'>&lt;$1&gt;</span>");
	code = code.replace(/\b(return)/g, "<span class='keyword'>$1</span>");
	code = code.replace(/(#include)\b/g, "<span class='keyword'>$1</span>");
	code = code.replace(/(?<=(?:int|void)\s+)(\w+)(?=\()/g, "<span class='function'>$1</span>");
	code = code.replace(/(?<=\.)(\w+)(?=\()/g, "<span class='function'>$1</span>");
	code = code.replace(/\b(int|void)\b/g, "<span class='type'>$1</span>");
	code = code.replace(/(?<=::)([A-Z]+)\b/g, "<span class='string'>$1</span>");
	code = code.replace(/(\\.)/g, "<span class='escape'>$1</span>");
	code = code.replace(/(".*?[^\\]")/g, "<span class='string'>$1</span>");
	code = code.replace(/\b(__.*?__)\b/g, "<span class='macro'>$1</span>");
	code = code.replace(/\b(\d+)\b/g, "<span class='number'>$1</span>");
	code = code.replace(/\b(\w+)(?=::)/g, "<span class='namespace'>$1</span>");
	code = code.replace(/^(\/\/.*)/gm, "<span class='comment'>$1</span>");

	code = code.replace(/\b(ConsoleLogger)\b/g, "<span class='namespace'>$1</span>");

	return code;
}