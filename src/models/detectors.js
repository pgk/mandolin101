// autocorrelation based on

let MIN_SAMPLES = 0;  // will be initialized when AudioContext is created.
let GOOD_ENOUGH_CORRELATION = 0.9; // this is the "bar" for how close a correlation needs to be

let autoCorrelate = (buf, sampleRate) => {
  let SIZE = buf.length;
	let MAX_SAMPLES = Math.floor(SIZE / 2);
	let bestOffset = -1;
	let bestCorrelation = 0;
	let rms = 0;
	let foundGoodCorrelation = false;
	let correlations = new Array(MAX_SAMPLES);

  rms = Math.sqrt(buf.map((a) => a * a).reduce((a, b) => a + b) /  SIZE);

	if (rms < 0.01) {
    return -1;
  }

  let computeCorrelation = (buf, offset) => {
    let correlation = 0;

		for (let i = 0; i < MAX_SAMPLES; i++) {
			correlation += Math.abs((buf[i]) - (buf[i + offset]));
		}
		correlation = 1 - (correlation / MAX_SAMPLES);
    return correlation;
  };

	let lastCorrelation = 1;
	for (let offset = MIN_SAMPLES; offset < MAX_SAMPLES; offset++) {
    let correlation = computeCorrelation(buf, offset);
		correlations[offset] = correlation; // store it, for the tweaking we need to do below.
		if ((correlation > GOOD_ENOUGH_CORRELATION) && (correlation > lastCorrelation)) {
			foundGoodCorrelation = true;
			if (correlation > bestCorrelation) {
				bestCorrelation = correlation;
				bestOffset = offset;
			}
		} else if (foundGoodCorrelation) {
			// short-circuit - we found a good correlation, then a bad one, so we'd just be seeing copies from here.
			// Now we need to tweak the offset - by interpolating between the values to the left and right of the
			// best offset, and shifting it a bit.  This is complex, and HACKY in this code (happy to take PRs!) -
			// we need to do a curve fit on correlations[] around bestOffset in order to better determine precise
			// (anti-aliased) offset.
			// we know bestOffset >=1,
			// since foundGoodCorrelation cannot go to true until the second pass (offset=1), and
			// we can't drop into this clause until the following pass (else if).
			var shift = (correlations[bestOffset + 1] - correlations[bestOffset - 1]) / correlations[bestOffset];
			return sampleRate / (bestOffset + (8 * shift));
		}
		lastCorrelation = correlation;
	}
	if (bestCorrelation > 0.01) {
		// console.log("f = " + sampleRate/bestOffset + "Hz (rms: " + rms + " confidence: " + bestCorrelation + ")")
		return sampleRate / bestOffset;
	}
	return -1;
//	var best_frequency = sampleRate/bestOffset;
};

export { autoCorrelate };


// // make output equal to the same as the input
//
// if (iteration == 0) {
//   autocorr[autocorrPos] = inputData[sample];
//   diff = autocorr[autocorrPos] * autocorr[autocorrPos];
// } else {
//   var d = inputData[sample] - autocorr[autocorrPos];
//   diff = d * d;
// }
//
// if (diff <= 0.00000001 && diff >= 0.0) {
//   rateofchange = periodAccum / sampleRate;
//   periodAccum = 0;
// } else {
//   periodAccum++;
// }
//
// outputData[sample] = diff;
// if (autocorrPos >= autocorrelatorSize) {
//   autocorrPos = 0;
// } else {
//   autocorrPos++;
// }
//
// if (sample === inputBuffer.length - 1) {
//   if (iteration >= iterations) {
//     // calculate the result?
//     iteration = 0;
//   } else {
//     iteration++;
//   }
// }
