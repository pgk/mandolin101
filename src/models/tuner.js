import { autoCorrelate } from './detectors';

let noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

let _log2 = Math.log(2);

let concertAinHz = 440;

let noteFromPitch = (frequency) => {
	let noteNum = 12 * (Math.log( frequency / concertAinHz ) / _log2 );
	return Math.round( noteNum ) + 69;
};

let frequencyFromNoteNumber = (note) => concertAinHz * Math.pow(2, (note - 69) / 12);

let centsOffFromPitch = ( frequency, note ) => {
	return Math.floor(1200 * Math.log(frequency / frequencyFromNoteNumber( note )) / _log2);
};


let createPitchDetector = (analyser, buf, audioContext) => {
  return () => {
    analyser.getFloatTimeDomainData( buf );
  	let ac = autoCorrelate(buf, audioContext.sampleRate);
    let results = {
      foundNote: false,
      pitch: '-',
      noteNum: -1,
      note: '--',
      detune: '-'
    };
    if (ac === -1) {
      return results;
    } else {
      let pitch = ac;
      let noteNum = noteFromPitch(pitch);
      results['foundNote'] = true;
      results['pitch'] = Math.round(pitch);
      results['noteNum'] = noteNum;
      results['note'] = noteStrings[noteNum % 12];
      results['detune'] = centsOffFromPitch(pitch, noteNum);
      return results;
    }
  };
};

let createTuner = (store) => {

  let onGotInput = (stream) => {
    store.dispatch({type: 'UPDATE_CAN_USE_MIC', canUseMic: true});
    let sz = 4096;
    let audioContext = new AudioContext();
    let mediaStreamSource = audioContext.createMediaStreamSource(stream);
    let analyser = audioContext.createAnalyser();
    analyser.fftSize = sz;
    mediaStreamSource.connect(analyser);
    let buf = new Float32Array(sz);
    let detectPitch = createPitchDetector(analyser, buf, audioContext);
    let tid = setInterval(() => {
      let result = detectPitch();
      store.dispatch({type: 'UPDATE_PITCH', result: result});
    }, 10);
  };

  navigator.mediaDevices
    .getUserMedia({audio: true})
    .then(onGotInput).catch(function(err) {
      store.dispatch({type: 'UPDATE_CAN_USE_MIC', canUseMic: false});
    });
};

export { createTuner };

// class TunerCanvas extends Component {
//   render () {
//     return (
//       <div className="TunerCanvas">
//         <canvas id="canvas"></canvas>
//       </div>
//     );
//   }
// }
