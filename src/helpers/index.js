export const distanceWithFormat = (latLongOne, latlongTwo) =>
  formatDistance(calculateDistance(latLongOne, latlongTwo));

export const distance = (latLongOne, latlongTwo) =>
  nanHandler(calculateDistance(latLongOne, latlongTwo));

const calculateDistance = (latlongOne, latlongTwo) => {
  const { lat1, lon1 } = latlongOne;
  const { lat2, lon2 } = latlongTwo;

  const R = 6371e3;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRad = dist => {
  return dist * (Math.PI / 180);
};

const formatDistance = meters => {
  if (isNaN(meters)) {
    // Loading state for distances that aren't a number
    return '...km';
  }
  if (meters > 1099) {
    // Return result in km
    return `${(parseInt(meters) / 1000).toPrecision(3)}km`;
  }
  return `${parseInt(meters)}m`;
};

const nanHandler = meters => {
  if (isNaN(meters)) {
    return undefined;
  }
  return meters;
};

export const wifiBlacklist = [
  'telstra air',
  'fon wifi',
  'wifimesh',
  'telstra',
  'fon',
  'freedominternet',
  'guest',
  'print',
  'printer',
  'staff',
  'hp',
  'mantra',
  'setup',
  'tp-link',
  'ibis',
  'novotel',
  'mantra',
  'solax',
  'staff',
  'i7',
  'gilligan',
  'palazzo',
  'enrol me',
  'hotel cairns',
  'ozspots',
];

export const securityBlacklist = ['wpa', 'wps', 'ble'];
