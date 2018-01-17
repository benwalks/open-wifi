const wifi = {
  isEnabled: false,
  currentSSID: '',
  wifiInRange: [],
  connectionStatus: false,
};

export default (state = wifi, action) => {
  switch (action.type) {
    case 'WIFI_ENABLED':
      return Object.assign({}, state, { isEnabled: false });
    case 'WIFI_DISABLED':
      return Object.assign({}, state, { isEnabled: false });
    case 'UPDATE_LOCAL_WIFI':
      return Object.assign({}, state, { wifiInRange: action.wifiArray });
    default:
      return state;
  }
};
