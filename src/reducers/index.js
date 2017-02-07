import { combineReducers } from 'redux';
import { UPDATE_PITCH, UPDATE_CAN_USE_MIC } from './../constants'

const tunerInitialState = {
    foundNote: false,
    pitch: '-',
    noteNum: -1,
    note: '--',
    detune: '-'
}

const permissionsInitialState = {
  canUseMic: false
};

const instrumentsInitialState = {
  instruments: [
    {
      name: 'Mandolin',
      slug: '/mandolin',
      type: 'stringed',
      strings: '4 pairs',
      tuning: ['G', 'D', 'A', 'E'],
      clefs: ['Treble']
    }
  ]
}

let instruments = (state = instrumentsInitialState, action) => {
  let actionType = action.type;

  switch (actionType) {
    default:
      return state
  }
}

let tuner = (state = tunerInitialState, action) => {
  let result = action.result;
  let actionType = action.type;

  switch (actionType) {
    case UPDATE_PITCH:
      return Object.assign({}, state, result);
    default:
      return state
  }
};

let permissions = (state = permissionsInitialState, action) => {
  let canUseMic = action.canUseMic;
  let actionType = action.type;
  switch (actionType) {
    case UPDATE_CAN_USE_MIC:
      return {canUseMic: canUseMic};
    default:
      return state
  }
};

export default combineReducers({
  tuner,
  permissions,
  instruments
});



// (function (window) {
//   var canvas = document.getElementById("canvas");
//   var canvasCtx = canvas.getContext("2d");
//   var freqToMatch = 440;
//
//   var onGotInput = function (stream) {
//     // context setup
//     var ctx = new AudioContext();
//     var mediaStreamSource = ctx.createMediaStreamSource(stream);
//     var scriptNode = ctx.createScriptProcessor(4096, 1, 1);
//     var analyser = ctx.createAnalyser();
//     analyser.fftSize = 2048;
//
//     // mediaStreamSource.connect(analyser);
//     mediaStreamSource.connect(scriptNode);
//     scriptNode.connect(analyser);
//     var freqToMatch = 440;
//     var sampleRate = ctx.sampleRate;
//     var sampleRateReciprocal =  1 / sampleRate;
//     var periodInSamples = Math.floor((1.0 / freqToMatch) * sampleRate);
//     var autocorrelatorSize = periodInSamples * 2;
//     var iterations = 2;
//     var autocorr = new Float32Array(autocorrelatorSize);
//     for (var i = 0; i < autocorrelatorSize; i++) {
//       autocorr[i] = 0;
//     }
//     console.log(autocorrelatorSize);
//     var autocorrPos = 0;
//
//     var iteration = 0;
//     var averagePeriodInSamples = periodInSamples;
//     var prevDiff = 0.0;
//     var diff = 0.0;
//     var periodAccum = 0;
//     var peak = 0.0;
//     var rateofchange = 0.0;
//
//     scriptNode.onaudioprocess = function (audioProcessingEvent) {
//       var inputBuffer = audioProcessingEvent.inputBuffer;
//       var outputBuffer = audioProcessingEvent.outputBuffer;
//       var inputData = inputBuffer.getChannelData(0);
//       var outputData = outputBuffer.getChannelData(0);
//
//       // Loop through the samples
//       for (var sample = 0; sample < inputBuffer.length; sample++) {
//         // make output equal to the same as the input
//         if (iteration == 0) {
//           autocorr[autocorrPos] = inputData[sample];
//           diff = autocorr[autocorrPos] * autocorr[autocorrPos];
//         } else {
//           var d = inputData[sample] - autocorr[autocorrPos];
//           diff = d * d;
//         }
//
//         if (diff <= 0.00000001 && diff >= 0.0) {
//           rateofchange = periodAccum / sampleRate;
//           periodAccum = 0;
//         } else {
//           periodAccum++;
//         }
//
//         outputData[sample] = diff;
//         if (autocorrPos >= autocorrelatorSize) {
//           autocorrPos = 0;
//         } else {
//           autocorrPos++;
//         }
//
//         if (sample === inputBuffer.length - 1) {
//           if (iteration >= iterations) {
//             // calculate the result?
//             iteration = 0;
//           } else {
//             iteration++;
//           }
//         }
//
//       }
//     };
//
//     // buf
//     var bufferLength = analyser.frequencyBinCount;
//     var dataArray = new Float32Array(bufferLength);
//     // viz
//     canvas.width  = 800;
//     canvas.height = 400;
//     var WIDTH = canvas.width;
//     var HEIGHT = canvas.height;
//     canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
//     var draw = function draw() {
//       drawVisual = requestAnimationFrame(draw);
//
//       analyser.getFloatTimeDomainData(dataArray);
//
//       canvasCtx.fillStyle = 'rgb(200, 200, 200)';
//       canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
//
//       canvasCtx.lineWidth = 2;
//       canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
//
//       canvasCtx.beginPath();
//
//       var sliceWidth = canvas.width * 1.0 / bufferLength;
//       var x = 0;
//
//       for (var i = 0; i < bufferLength; i++) {
//
//         var v = dataArray[i];
//         if (Math.random() > 0.99999) {
//           console.log(v);
//         }
//         var y = canvas.height - (v * canvas.height);
//
//         if (i === 0) {
//           canvasCtx.moveTo(x, y);
//         } else {
//           canvasCtx.lineTo(x, y);
//         }
//
//         x += sliceWidth;
//       }
//
//       canvasCtx.lineTo(canvas.width, canvas.height / 2);
//       canvasCtx.stroke();
//
//     };
//     draw();
//   };
//
//
//   navigator.mediaDevices
//     .getUserMedia({audio: true})
//     .then(onGotInput);
// })(window);
