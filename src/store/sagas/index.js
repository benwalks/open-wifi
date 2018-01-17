import { call, put, takeEvery, takeLatest, all } from 'redux-saga/effects';
import {
  fetchHotspots,
  logConnection,
  reportHotspot,
  postHotspot,
} from '../../api/services/hotspot';
import { fetchLandmarks } from '../../api/services/landmark';

function* fetchNewHotspots(action) {
  try {
    const hotspots = yield call(fetchHotspots, action.latlng);
    yield put({
      type: 'HOTSPOT_LOAD_SUCCEEDED',
      hotspots: hotspots,
      location: action.latlng,
    });
    const landmarks = yield call(fetchLandmarks, action.latlng);
    yield put({ type: 'LANDMARK_LOAD_SUCCEEDED', landmarks: landmarks });
    yield put({ type: 'INITIAL_LOAD_COMPLETE' });
  } catch (e) {
    yield put({ type: 'HOTSPOT_LOAD_FAILED', message: e.message });
  }
}

function* logConnSaga(action) {
  try {
    const hotspot = yield call(logConnection, action.hotspotId);
    yield put({ type: 'CONN_LOG_SUCCEEDED', hotspot });
  } catch (e) {
    yield put({ type: 'HOTSPOT_LOAD_FAILED', message: e.message });
  }
}

function* reportHotspotSaga(action) {
  try {
    const hotspot = yield call(reportHotspot, action.hotspotId);
    yield put({ type: 'HOTSPOT_REPORTED', hotspot });
  } catch (e) {
    yield put({ type: 'HOTSPOT_LOAD_FAILED', message: e.message });
  }
}

function* postHotspotSaga(action) {
  try {
    const hotspot = yield call(postHotspot, action.hotspot, action.location);
    if (hotspot.message) {
      return;
    }
    yield put({ type: 'HOTSPOT_POST_SUCCEEDED', hotspot });
  } catch (e) {
    yield put({ type: 'HOTSPOT_POST_FAILED', message: e.message });
  }
}

function* hotspotSaga() {
  yield all([
    takeLatest('POST_HOTSPOT', postHotspotSaga),
    takeLatest('HOTSPOTS_REQUESTED', fetchNewHotspots),
    takeEvery('LOG_CONNECTION', logConnSaga),
    takeEvery('REPORT_HOTSPOT', reportHotspotSaga),
  ]);
}

export default hotspotSaga;
