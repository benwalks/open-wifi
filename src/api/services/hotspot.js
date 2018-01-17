import { API_ADDRESS } from '../../../env_vars';

export const fetchHotspots = latlng => {
  const { lat, lng } = latlng;
  return fetch(`${API_ADDRESS}/hotspots?lat=${lat}&lng=${lng}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
    },
  })
    .then(res => res.json())
    .then(json => {
      return json.hotspots.map(h => ({
        ...h,
        type: 'point',
      }));
    })
    .catch(err => console.log('Hotspot Fetch Error: ', err));
};

export const postHotspot = (hotspot, location) => {
  // Setup JSON body data structure as per the API requirements
  const body = {
    loc: {
      type: 'Point',
      coordinates: [location.longitude, location.latitude],
    },
    ssid: hotspot.SSID,
    bssid: hotspot.BSSID,
    signalStrength: hotspot.level,
  };

  return fetch(`${API_ADDRESS}/hotspot`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
    .then(res => res.json())
    .then(json => json)
    .catch(err => console.log(err));
};

export const logConnection = hotspotId => {
  return fetch(`${API_ADDRESS}/hotspot/log/${hotspotId}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: '{}',
  })
    .then(res => res.json())
    .then(json => json)
    .catch(err => console.log(err));
};

export const reportHotspot = hotspotId => {
  return fetch(`${API_ADDRESS}/hotspot/report/${hotspotId}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.json())
    .then(json => json)
    .catch(err => console.log(err));
};
