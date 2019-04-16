var po = console.info;

function et (translate_string) {
	return t && t[translate_string] ? t[translate_string] : translate_string;
}

function etl (translate_string) {
	return tl && tl[translate_string] ? tl[translate_string] : translate_string;
}
