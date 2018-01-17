import { combineReducers } from 'redux';

import nav from './navigation';
import hotspots from './hotspots';
import landmarks from './landmarks';
import health from './flashMessage';
import wifi from './wifi';
import loading from './loading';

// Combine all reducers
const AppReducer = combineReducers({
  nav,
  hotspots,
  landmarks,
  health,
  wifi,
  loading,
});

// Export combined reducers
export default AppReducer;
