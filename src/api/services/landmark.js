import { API_ADDRESS } from '../../../env_vars';

export const fetchLandmarks = latlng => {
  const { lat, lng } = latlng;
  return fetch(`${API_ADDRESS}/landmarks?lat=${lat}&lng=${lng}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
    },
  })
    .then(res => res.json())
    .then(json => json.landmarks.map(l => ({ ...l, type: 'point' })))
    .catch(err => console.log('Landmark Fetch Error: ', err));
};
