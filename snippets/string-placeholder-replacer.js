"use strict";

function replace(string, object) {
	let res = "";
	for(let index = string.indexOf("["), n = 0; index > -1; index = string.indexOf("[", n)) {
		const start = index + 1;
		const end = string.indexOf("]", start);
		const extracted = string.slice(start, end);
		if(!extracted) {continue;}
		let val = object;
		for(let i = extracted.indexOf("."), t = 0; (val = val[extracted.slice(t, i > -1 ? i : void 0)]); i = extracted.indexOf(".", t)) {
			if(!val || i === -1) { break; }
			t = i + 1;
		}
		res += string.slice(n, index) + val;
		n = end + 1;
	}
	return res;
}

/*
let obj = {
	some: {
		thing: Tim
	}
}
replace("Hello [some.thing]", obj) // "Hello Tim"
*/

module.exports = replace;
