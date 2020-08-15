const { inspect } = require("util");

// a layered eval function that supports async/await syntax, promise previewing, variables, returning and other complex code
async function ev(f,sym) {
	try {
		let _ = eval(`(()=>{
			return ${f}
		})()`);
		return _ instanceof Promise ? {[sym || "Promise"]:await _} : _;
	} catch(e) {
		// no-op
	}
	try {
		return await eval(`(async()=>{
			return ${f}
		})()`);
	} catch(e) {
		// no-op
	}
	try {
		let _ = eval(`(()=>{
			${f}
		})()`);
		return _ instanceof Promise ? {[sym || "Promise"]:await _} : _;
	} catch(e) {
		// no-op
	}
	try {
		return await eval(`(async() => {
			${f}
		})()`);
	} catch(e) {
		return e;
	}
}

// returns a string with an optional max string length by reducing inspect depth
async function evs(f, maxLength = Infinity, thisArg = null, showHidden = false) {
	let sym = Symbol("Promise");
	let obj = await ev.call(thisArg,f,sym);
	let promise;
	if(obj && typeof obj === "object") {
		promise = Object.hasOwnProperty.call(obj,sym);
		if(promise) { obj = obj[sym]; }
		let inspected = inspect(obj,{getters: true, showHidden, depth: 3}).replace(/ {2}/g,"\t");
		if(inspected.length > maxLength) { inspected = inspect(obj,{getters: true, showHidden, depth: 2}).replace(/ {2}/g,"\t"); }
		if(inspected.length > maxLength) { inspected = inspect(obj,{getters: true, showHidden, depth: 1}).replace(/ {2}/g,"\t"); }
		if(inspected.length > maxLength) { inspected = inspect(obj,{getters: true, showHidden, depth: 0}).replace(/ {2}/g,"\t"); }
		if(inspected.length > maxLength) {
			let str = "";
			let lines = inspected.split("\n");
			for(let i = 0; i < lines.length; i++) {
				if((str + lines[i]).length > maxLength - 30) {
					str += `\n ... and ${lines.length - i} more lines`;
					break;
				}
				str += `${lines[i]}\n`;
			}
			inspected = str;
		}
		obj = inspected;
	}
	return `${promise ? "<Promise> " : ""}${obj}`;
}

// export it so you can simply require this file
module.exports = {
	eval:ev,
	evalStringified:evs
}
