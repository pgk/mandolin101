import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { createTuner } from './models/tuner'
import reducer from './reducers'
import './index.css'

const store = createStore(reducer)

// bootstrap our tuner
createTuner(store)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
