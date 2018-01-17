import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import { offline } from 'redux-offline';
import offlineConfig from './node_modules/redux-offline/lib/defaults';
import createSagaMiddleware from 'redux-saga';

import appReducer from './src/store/reducers';
import hotspotSaga from './src/store/sagas';

import AppWithNavigationState from './src/navigation/AppNavigator';

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  appReducer,
  compose(applyMiddleware(sagaMiddleware), offline(offlineConfig))
);

sagaMiddleware.run(hotspotSaga);

class WifiApp extends Component {
  render() {
    return (
      <Provider store={store}>
        <AppWithNavigationState />
      </Provider>
    );
  }
}

AppRegistry.registerComponent('cquopen', () => WifiApp);
