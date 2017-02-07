import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';
import { createTuner } from './models/tuner';
import './index.css';

import { UPDATE_PITCH, UPDATE_CAN_USE_MIC } from './constants'

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

const rootReducer = combineReducers({
  tuner,
  permissions
});

const store = createStore(rootReducer);

createTuner(store);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
