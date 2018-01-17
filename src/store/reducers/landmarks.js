import _ from 'lodash';

export const defaultLandmarks = [];

export default (state = defaultLandmarks, action) => {
  switch (action.type) {
    case 'LANDMARK_LOAD_SUCCEEDED':
      let newState = state.slice();
      if (!action.landmarks) {
        return newState;
      }
      action.landmarks.forEach(landmark => {
        let alreadyExists = _.some(newState, landmark);
        if (alreadyExists) {
          return;
        }
        newState.push(landmark);
      });
      return newState;
    case 'LANDMARK_LOAD_FAILED':
      console.log(action);
      return state;
    default:
      return state;
  }
};
