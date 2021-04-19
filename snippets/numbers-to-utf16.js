"use strict";

function int2u(n) {
	if(!Number.isInteger(n) && typeof n !== "bigint") { throw new Error("invalid int or bigint"); }
	let bin = BigInt(n).toString(2);
	let str = "";
	if(bin.length % 16) { bin = "0".repeat(16 - (bin.length % 16)) + bin; }
	for(let i = 0; i < bin.length; i += 16) {
		str += String.fromCharCode(`0b${bin.slice(i, i + 16)}`);
	}
	return str;
}

function float2u(n) {
	if(typeof n !== "number" || n.toString() % 1 === 0) { throw new Error("invalid float"); }
	const bin = n.toString().split(".").map(x => Number(x).toString(2));
	const str = ["", ""];
	for(let x = 0; x < 2; x++) {
		if(bin[x].length % 15) { bin[x] = "0".repeat(15 - (bin[x].length % 15)) + bin[x]; }
		for(let i = 0; i < bin[x].length; i += 15) {
			str[x] += String.fromCharCode(`0b${bin[x].slice(i, i + 15)}`);
		}
	}
	return str.join("\uFFFF");
}

function u2int(u) {
	if(typeof u !== "string") { throw new Error("invalid string"); }
	let bin = "";
	for(let i = 0; i < u.length; i++) {
		bin += u[i].charCodeAt().toString(2).padStart(16, "0");
	}
	return Number(`0b${bin}`);
}

function u2bigint(u) {
	if(typeof u !== "string") { throw new Error("invalid string"); }
	let bin = "";
	for(let i = 0; i < u.length; i++) {
		bin += u[i].charCodeAt().toString(2).padStart(16, "0");
	}
	return BigInt(`0b${bin}`);
}

function u2float(u) {
	if(typeof u !== "string") { throw new Error("invalid string"); }
	const bin = ["", ""];
	const str = u.split("\uFFFF");
	for(let x = 0; x < 2; x++) {
		for(let i = 0; i < str[x].length; i++) {
			bin[x] += str[x][i].charCodeAt().toString(2).padStart(15, "0");
		}
	}
	return Number(bin.map(x => Number(`0b${x}`)).join("."));
}

module.exports = {
	int2u,
	float2u,
	u2int,
	u2bigint,
	u2float
};
