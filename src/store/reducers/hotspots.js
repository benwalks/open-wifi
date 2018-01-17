import _ from 'lodash';
import { postHotspot, reportHotspot } from '../../api/services/hotspot';
import { distance } from '../../helpers';

export const defaultHotspots = [];

export default (state = defaultHotspots, action) => {
  switch (action.type) {
    case 'ADD_HOTSPOT': {
      let alreadyExists = _.some(state, action.hotspot);
      if (alreadyExists) {
        return state;
      }
      return [...state, action.hotspot];
    }
    case 'HOTSPOT_LOAD_SUCCEEDED': {
      if (!action.hotspots) {
        return state;
      }

      let newState = state.slice();

      // Update hotspots if they already exist (don't duplicate) otherwise add them
      action.hotspots.forEach(hotspot => {
        let alreadyExistsIndex = _.findIndex(newState, ['id', hotspot.id]);
        if (alreadyExistsIndex !== -1) {
          return newState.splice(alreadyExistsIndex, 1, hotspot);
        }
        newState.push(hotspot);
      });

      // Check for and remove stale hotspots
      // Remove stale points within the API call range (2000m)
      const clearStalePoints = newState.filter(h => {
        const userGeo = {
          lat1: action.location.lat,
          lon1: action.location.lng,
        };
        const wifiGeo = {
          lat2: h.coordinates[0],
          lon2: h.coordinates[1],
        };

        const inRange = distance(userGeo, wifiGeo) < 2000;
        const notInLatestFetch =
          _.findIndex(action.hotspots, ['id', h.id]) === -1;
        if (inRange && notInLatestFetch) {
          return false;
        }
        return true;
      });

      return clearStalePoints;
    }
    case 'CONN_LOG_SUCCEEDED': {
      let existingState = state.slice();
      var index = _.findIndex(existingState, ['id', action.hotspot._id]);
      existingState[index] = action.hotspot;
      return existingState;
    }
    case 'HOTSPOT_POST_SUCCEEDED': {
      const savedHotspot = action.hotspot.hotspot;

      const newHotspot = {
        id: savedHotspot._id,
        ssid: savedHotspot.ssid,
        coordinates: savedHotspot.loc.coordinates,
      };

      return [...state, newHotspot];
    }
    case 'HOTSPOT_REPORTED': {
      let existingState = state.slice();
      var hotspotIndex = _.findIndex(state, ['id', action.hotspot._id]);
      existingState.splice(hotspotIndex, 1);
      return existingState;
    }
    case 'HOTSPOT_LOAD_FAILED':
      console.log(action);
      return state;
    default:
      return state;
  }
};
