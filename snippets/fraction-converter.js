"use strict";

function intFromFrac(n) {
	let res = n;
	while(!Number.isInteger(res)) { res *= 10; }
	return res;
}

function countFrac(n) {
	let res = n;
	let count = 0;
	while(!Number.isInteger(res)) {
        res *= 10;
        count++;
    }
	return count;
}

module.exports = {
    intFromFrac,
    countFrac
}
