"use strict";

/**
 * Deep clone an object
 * Much faster than JSON
 * @param {object} src source object
 * @param {[object]} target optional target object, blank object by default
 */
function copy7(src, target = {}) {
	for(const key in src) {
		if(!Object.prototype.hasOwnProperty.call(src, key)) { continue; }
		const value = src[key];
		if(typeof value === "object" && value) {
			target[key] = {};
			copy7(value, target[key]);
		} else {
			target[key] = value;
		}
	}
	return target;
}

module.exports = copy7;
