import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';

import Home from '../components/screens/Home';
import About from '../components/screens/About';

export const AppNavigator = StackNavigator(
  {
    Home: { screen: Home },
    About: { screen: About },
  },
  {
    headerMode: 'none',
  }
);

const AppWithNavigationState = ({ dispatch, nav, store }) => {
  return (
    <AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav })} />
  );
};

const mapStateToProps = state => ({
  nav: state.nav,
});

export default connect(mapStateToProps)(AppWithNavigationState);
