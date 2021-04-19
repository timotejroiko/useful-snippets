"use strict";

const { inspect } = require("util");

// a layered eval function that supports async/await syntax, promise previewing, variables, comment, returns and other complex code
async function ev(f) {
	try {
		const result = eval(`(()=>{
			return ${f}
		})()`);
		const p = result instanceof Promise;
		let error = false;
		return {
			promise: p,
			data: p ? await result.catch(e => { error = true; return e; }) : result,
			error
		};
	} catch(e) {
		// no-op
	}
	try {
		return {
			data: await eval(`(async()=>{
				return ${f}
			})()`)
		};
	} catch(e) {
		// no-op
	}
	try {
		const result = eval(`(()=>{
			${f}
		})()`);
		const p = result instanceof Promise;
		let error = false;
		return {
			promise: p,
			data: p ? await result.catch(e => { error = true; return e; }) : result,
			error
		};
	} catch(e) {
		// no-op
	}
	try {
		return {
			data: await eval(`(async() => {
				${f}
			})()`)
		};
	} catch(e) {
		return {
			error: true,
			data: e
		};
	}
}

// returns a string with an optional max string length by reducing inspect depth
async function evs(f, thisArg, maxLength = Infinity, maxLineLength = Infinity, showHidden = false) {
	const obj = await ev.call(thisArg, f);
	let inspected = obj.data;
	if(typeof inspected !== "string") {
		inspected = inspect(obj.data, {
			getters: true,
			showHidden,
			depth: 3
		}).replace(/ {2}/g, "\t");
		if(inspected.length > maxLength) {
			inspected = inspect(obj.data, {
				getters: true,
				showHidden,
				depth: 2
			}).replace(/ {2}/g, "\t");
		}
		if(inspected.length > maxLength) {
			inspected = inspect(obj.data, {
				getters: true,
				showHidden,
				depth: 1
			}).replace(/ {2}/g, "\t");
		}
		if(inspected.length > maxLength) {
			inspected = inspect(obj.data, {
				getters: true,
				showHidden,
				depth: 0
			}).replace(/ {2}/g, "\t");
		}
	}
	let str = "";
	if(obj.promise) { str += "<Promise> "; }
	if(obj.error) { str += "<Error> "; }
	const lines = inspected.split("\n");
	if(lines.length) {
		for(let i = 0; i < lines.length; i++) {
			const append = `\n ... and ${lines.length - i} more lines`;
			let line = lines[i];
			if(line.length > maxLineLength) {
				line = `${line.slice(0, maxLineLength - 5)} ...`;
			}
			if((str + line).length > maxLength - append.length) {
				str += append;
				break;
			}
			str += `${line}\n`;
		}
	} else {
		str += inspected;
	}
	if(str.length > maxLength) {
		const append = `\n ... and ${str.length - maxLength - 35} more chars`;
		str = `${str.slice(0, maxLength - 35)}${append}`;
	}
	return str;
}

// export it so you can simply require this file
module.exports = {
	eval: ev,
	evalStringified: evs
};
