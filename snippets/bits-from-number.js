"use strict";

function bitsFromNumberAuto(n, bits, from) {
	if(Math.abs(n) > 0xFFFFFFFF) {
		return ((1n << BigInt(bits)) - 1n) & (BigInt(n) >> (BigInt(from) - 1n) );
	}
	return ((1 << bits) - 1) & (n >> (from - 1) );
}

function bitsFromNumber(n, bits, from) {
	return ((1 << bits) - 1) & (n >> (from - 1));
}

function bitsFromBigint(n, bits, from) {
	return ((1n << bits) - 1n) & (n >> (from - 1n));
}

// const countBits = n => Math.floor(Math.log2(n)) + 1; // cant use ceil
// const split = n => ((n << (32 - countBits(Math.abs(n)))) >> (32 - countBits(Math.abs(n)))) % N;

module.exports = {
	bitsFromNumberAuto,
	bitsFromNumber,
	bitsFromBigint
};
