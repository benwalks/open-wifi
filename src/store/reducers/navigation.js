import { NavigationActions } from 'react-navigation';
import { AppNavigator } from '../../navigation/AppNavigator';

// NAVIGATION STATE
const homeParams = AppNavigator.router.getActionForPathAndParams('Home');
const initialNavState = AppNavigator.router.getStateForAction(homeParams);

export default (state = initialNavState, action) => {
  let nextState;
  switch (action.type) {
    case 'Home':
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.back(),
        state
      );
      break;
    case 'About':
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'About' }),
        state
      );
      break;
    default:
      nextState = AppNavigator.router.getStateForAction(action, state);
      break;
  }

  return nextState || state;
};
