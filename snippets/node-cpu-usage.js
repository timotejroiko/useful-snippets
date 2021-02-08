"use strict";

// get approximate CPU usage of the current proccess over a given amount of time in milliseconds
async function cpuUsage(time) {
	// store current cpu timings
	const startTime = process.hrtime();
	const startCPU = process.cpuUsage();

	// wait for a defined time in ms
	await new Promise(r => { setTimeout(r, time); });

	// get timings difference
	const elapsedTime = process.hrtime(startTime);
	const elapsedCPU = process.cpuUsage(startCPU);

	// calculate high resolution milliseconds from process.hrtime()
	const milliseconds = (elapsedTime[0] * 1000) + (elapsedTime[1] / 1000000);

	// calculate high resolution milliseconds of CPU activity
	const timings = (elapsedCPU.user / 1000) + (elapsedCPU.system / 1000);

	// calculate percentage from cpu time and total time
	const percentage = 100 * timings / milliseconds;

	// return approcimate percentage of cpu used by this process
	return percentage;
}

// compact version
async function cpuUsageCompact(time) {
	const start = [process.hrtime(), process.cpuUsage()];
	await new Promise(r => { setTimeout(r, time); });
	const elap = [process.hrtime(start[0]), process.cpuUsage(start[1])];
	return 100 * ((elap[1].user / 1000) + (elap[1].system / 1000)) / ((elap[0][0] * 1000) + (elap[0][1] / 1000000));
}

// export it so you can simply require this file
module.exports = {
	cpuUsage,
	cpuUsageCompact
};
