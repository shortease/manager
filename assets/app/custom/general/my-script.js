var po = console.info;

function et (translate_string) {
	if (!t) return;
	if (!t[translate_string]) return translate_string;
	else return t[translate_string];
}

function etl (translate_string) {
	if (!tl) return;
	if (!tl[translate_string]) return translate_string;
	else return tl[translate_string];
}
