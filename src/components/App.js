import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
// import logo from './logo.svg';
import './App.css';

const App = ({tuner, permissions}) => {
  return (
    <div className="App">
      <div className="App-header">
        <h2>Instrument Tuner</h2>
      </div>
      <p className="App-intro">
        Tune your instruments here! {!permissions.canUseMic ? <span>(need permissions for microphone)</span> : ''}
      </p>
      <select>
        <option value="free">Free Mode</option>
      </select>
      <h3>{tuner.note}</h3>
      <h3>{tuner.detune}</h3>
    </div>
  );
}

App.propTypes = {
  tuner: PropTypes.object.isRequired,
  permissions: PropTypes.object.isRequired
}


const mapStateToProps = (state) => {
  return {
    tuner: state.tuner,
    permissions: state.permissions
  };
};

// const mapDispatchToProps = dispatch => ({
//     actions: bindActionCreators(TodoActions, dispatch)
// })

export default connect(
  mapStateToProps
  // mapDispatchToProps
)(App)
