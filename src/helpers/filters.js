import _ from 'lodash';

import { wifiBlacklist, securityBlacklist } from './';

export const filterHotspots = (wifiArray, existingHotspots) =>
  wifiArray.filter(wifi => {
    // Remove false positives
    if (wifi.SSID.length === 0) {
      return false;
    }

    const lowerSSID = wifi.SSID.toLowerCase();
    const lowerCapabilities = wifi.capabilities.toLowerCase();

    const isBlacklisted = wifiBlacklist.some(w => lowerSSID.includes(w));
    const isProtected = securityBlacklist.some(w =>
      lowerCapabilities.includes(w)
    );
    const exists = _.some(existingHotspots, { bssid: wifi.BSSID });
    const isStrong = wifi.level >= -80;

    return !isBlacklisted && !isProtected && !exists && isStrong;
  });

export const formatAnnotations = (data, selectedId) => {
  if (!data) {
    return [];
  }
  return data.map(d => {
    return d.ssid
      ? {
          id: d.id,
          ssid: d.ssid,
          coordinates: d.coordinates || [0, 0],
          annotationImage: {
            source: {
              uri: d.id === selectedId ? 'wifimarkerselected' : 'wifimarker',
            },
            height: 45,
            width: 45,
          },
          type: 'point',
        }
      : {
          id: d.id,
          title: d.name,
          subtitle: d.description,
          coordinates: d.coordinates,
          type: 'point',
        };
  });
};
