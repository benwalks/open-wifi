import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet, Platform, Image, Text } from 'react-native'
import { connect } from 'react-redux'
import Mapbox, { MapView } from 'react-native-mapbox-gl'
import wifi from 'react-native-android-wifi'
import _ from 'lodash'

import { distanceWithFormat, distance } from '../../helpers'
import { filterHotspots, formatAnnotations } from '../../helpers/filters'
import Button from '../utility/Button'
import HotspotInfo from '../utility/HotspotInfo'
import FlashMessage from '../utility/FlashMessage'
import Loading from './Loading'
import Card from '../utility/Card'

import { requestLocationPermissions } from '../../helpers/permissions'

import { MAPBOX_ACCESS_TOKEN } from '../../../env_vars'

// import WifiDebug from '../utility/WifiDebug'

class Home extends Component {
  constructor (props) {
    super(props)

    Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN)

    // Format the hotspots and annotations according to Mapbox's requirements
    const hotspotAnnotations = formatAnnotations(props.hotspots, null)
    const landmarkAnnotations = formatAnnotations(props.landmarks, null)

    const annotations = [...hotspotAnnotations, ...landmarkAnnotations]
    const hotspots = props.hotspots ? _.keyBy(props.hotspots, 'id') : {}

    // Set initial state
    this.state = {
      annotations,
      hotspots,
      selectedId: null,
      hotspotSelected: false,
      wifiEnabled: null,
      currentSSID: '',
      userLocation: {
        latitude: -16.920334,
        longitude: 145.770859
      },
      lastApiCallLocation: {},
      wifiInterval: null,
      isConnecting: false,
      isConnected: null,
      attemptConnect: null,
      intialLoadTimeout: false,
      error: false,
      errorMessage: ''
    }

    if (Platform.OS === 'android') {
      this.wifiAvailable()
      requestLocationPermissions()
    }

    this.wifiAvailable = this.wifiAvailable.bind(this)
    this.toggleDetails = this.toggleDetails.bind(this)
    this.connectToWifi = this.connectToWifi.bind(this)
    this.mapMoved = this.mapMoved.bind(this)
    this.userMoved = this.userMoved.bind(this)
    this.distToWifi = this.distToWifi.bind(this)
    this.distToWifiFormatted = this.distToWifiFormatted.bind(this)
    this.isWifiInRange = this.isWifiInRange.bind(this)
    this.reportWifi = this.reportWifi.bind(this)
    this.geolocationAvailable = this.geolocationAvailable.bind(this)
    this.addOfflinePacks = this.addOfflinePacks.bind(this)
  }

  wifiAvailable () {
    wifi.isEnabled(enabled => {
      if (enabled) {
        this.setState({ wifiEnabled: true })
      } else {
        this.setState({ wifiEnabled: false })
      }
    })
  }

  geolocationAvailable () {
    navigator.geolocation.getCurrentPosition(
      (position) => { this.setState({ errorMessage: '' }) },
      (error) => this.setState({ errorMessage: 'Please turn on your location services.' })
    )
  }

  componentDidMount () {
    if (!this.state.initialLoadComplete) {
      // Set intervals for multiple status updates / wifi checks throughout the
      // time the application is open
      if (Platform.OS === 'android') {
        let wifiInterval = setInterval(() => {
          this.wifiAvailable()
          this.geolocationAvailable()
          wifi.getSSID(ssid => this.setState({ currentSSID: ssid }))
          wifi.connectionStatus(isConnected => {
            if (isConnected) {
              this.setState({ isConnecting: false })
            }
            this.setState({ isConnected })
          })
        }, 5000)

        this.setState({ wifiInterval })
      }

      // Initial hotspot and landmark request upon the initial load
      this.props.dispatch({
        type: 'HOTSPOTS_REQUESTED',
        latlng: {
          lat: this.state.userLocation.latitude,
          lng: this.state.userLocation.longitude
        }
      })
      const lastApiCallLocation = { lat: this.state.userLocation.latitude, lng: this.state.userLocation.longitude }
      this.setState({ lastApiCallLocation })
      this.props.dispatch({ type: 'RESTORE_FLASH' })
    }
  }

  componentWillMount () {
    // Generate an initial health message on initial render
    this.props.dispatch({ type: 'SELECT_HEALTH_MESSAGE' })
  }

  componentWillUnmount () {
    if (Platform.OS === 'android') {
      // Remove the wifi status updates interval timer and the Mapbox error subscription
      clearInterval(this.state.wifiInterval)
      if (this.state.connectCheck) {
        clearInterval(this.state.connectCheck)
      }
    }
  }

  componentWillReceiveProps (nextProps) {
    // Check if any local hotspots are open and appropriate for others
    this.parseLocalHotspots(nextProps.wifi.wifiInRange)

    // Set new hotspots and landmarks to local state
    const hotspotAnnotations = formatAnnotations(nextProps.hotspots, this.state.selectedId)
    const landmarkAnnotations = formatAnnotations(nextProps.landmarks, this.state.selectedId)
    const annotations = [...hotspotAnnotations, ...landmarkAnnotations]
    const hotspots = nextProps.hotspots ? _.keyBy(nextProps.hotspots, 'id') : []

    this.setState({ annotations, hotspots })
  }

  rerenderHotspots (selectedId) {
    const hotspotAnnotations = formatAnnotations(this.props.hotspots, selectedId)
    const landmarkAnnotations = formatAnnotations(this.props.landmarks, selectedId)
    return [...hotspotAnnotations, ...landmarkAnnotations]
  }

  toggleDetails (index) {
    const newState = this.state.hotspots.slice()
    newState[index].detailedView = !newState[index.detailedView]
    this.setState({ hotspots: newState })
  }

  reportWifi () {
    // Make sure that the user is within range and the hotspot isn't within hotspots props
    this.props.dispatch({
      type: 'REPORT_HOTSPOT',
      hotspotId: this.state.selectedId
    })
    this.setState({
      hotspotSelected: false,
      selectedId: null
    })
  }

  connectToWifi (ssid, password) {
    if (Platform.OS === 'android') {
      if (!this.state.wifiEnabled) {
        wifi.setEnabled(true)
      }

      this.setState({ isConnecting: true })
      wifi.findAndConnect(ssid, password, inRange => {
        if (!inRange) {
          this.setState({ isConnected: false, isConnecting: false })
        }
        this.attemptConnect(ssid)
      })
    }
  }

  attemptConnect (attemptedSSID) {
    let connectCheck = setInterval(() => {
      const { currentSSID, selectedId } = this.state

      if (currentSSID === attemptedSSID) {
        // User is connected.  Update the Hotspot logs and clear intervals
        // and update connecting / connected state
        this.props.dispatch({
          type: 'LOG_CONNECTION',
          hotspotId: selectedId
        })
        clearInterval(this.state.connectCheck)
        this.setState({ connecting: false, connected: true })
      }
    }, 250)
    let connectTimer = setTimeout(() => {
      this.setState({ connecting: false })
      clearInterval(this.state.connectCheck)
    }, 8000)

    this.setState({ connectCheck, connectTimer })
  }

  addOfflinePacks() {
    try {
      Mapbox.addOfflinePack({
        name: 'Cairns',
        type: 'bbox',
        bounds: [-16.964980, 145.725165, -16.894632, 145.784538],
        minZoomLevel: 6,
        maxZoomLevel: 8,
        styleURL: 'mapbox://styles/cquwifi/cj3f75wpp00022spal4svin9k'
      }).catch(err => console.log(err))
      Mapbox.addOfflinePack({
        name: 'Yarrabah',
        type: 'bbox',
        metadata: {
          date: new Date()
        },
        bounds: [-16.929990, 145.860899, -16.897471, 145.885190],
        minZoomLevel: 6,
        maxZoomLevel: 8,
        styleURL: 'mapbox://styles/cquwifi/cj3f75wpp00022spal4svin9k'
      }).catch(err => console.log(err))
      Mapbox.addOfflinePack({
        name: 'Global',
        type: 'bbox',
        bounds: [-49.5, 3.52, 65.1, -64.15],
        minZoomLevel: 0,
        maxZoomLevel: 1,
        styleURL: 'mapbox://styles/cquwifi/cj3f75wpp00022spal4svin9k'
      })
    } catch (err) {
      console.log('could not preload maps', err)
    }
  }

  distToWifi () {
    const { userLocation, selectedId, hotspots } = this.state

    const userGeo = {
      lat1: userLocation.latitude,
      lon1: userLocation.longitude
    }
    const wifiGeo = {
      lat2: hotspots[selectedId].coordinates[0],
      lon2: hotspots[selectedId].coordinates[1]
    }
    return distance(userGeo, wifiGeo)
  }

  distToWifiFormatted () {
    const { userLocation, selectedId, hotspots } = this.state

    const userGeo = {
      lat1: userLocation.latitude,
      lon1: userLocation.longitude
    }
    const wifiGeo = {
      lat2: hotspots[selectedId].coordinates[0],
      lon2: hotspots[selectedId].coordinates[1]
    }
    return distanceWithFormat(userGeo, wifiGeo)
  }

  mapMoved ({ latitude, longitude }) {
    const { userLocation, lastApiCallLocation } = this.state
    const userGeo = {
      lat1: userLocation.latitude,
      lon1: userLocation.longitude
    }
    const mapGeo = {
      lat2: latitude,
      lon2: longitude
    }
    const lastCallGeo = {
      lat1: lastApiCallLocation.lat,
      lon1: lastApiCallLocation.lng
    }

    if (distance(userGeo, mapGeo) > 2000 && distance(lastCallGeo, mapGeo) > 2000) {
      this.props.dispatch({
        type: 'HOTSPOTS_REQUESTED',
        latlng: { lat: latitude, lng: longitude }
      })
      const lastApiCallLocation = { lat: latitude, lng: longitude }
      this.setState({ lastApiCallLocation })
    }
  }

  userMoved (data) {
    const { latitude, longitude } = data
    this.setState({ userLocation: { latitude, longitude } })
    const { lastApiCallLocation } = this.state
    const userGeo = {
      lat1: latitude,
      lon1: longitude
    }
    const lastCallGeo = {
      lat2: lastApiCallLocation.lat,
      lon2: lastApiCallLocation.lng
    }

    // Request new stored hotspots via API if further than 2km from last call
    if (!lastApiCallLocation.lat || distance(userGeo, lastCallGeo) > 2000) {
      this.props.dispatch({
        type: 'HOTSPOTS_REQUESTED',
        latlng: { lat: latitude, lng: longitude }
      })

      const lastApiCallLocation = { lat: latitude, lng: longitude }
      this.setState({ lastApiCallLocation })
    }
    if (Platform.OS === 'android') {
      wifi.loadWifiList(
        wifiStringList => {
          const wifiArray = JSON.parse(wifiStringList)
          this.props.dispatch({ type: 'UPDATE_LOCAL_WIFI', wifiArray })
        },
        error => {
          console.log(error)
        }
      )
    }
  }

  parseLocalHotspots (localWifiArray) {
    const freeHotspots = filterHotspots(localWifiArray, this.state.hotspots)

    if (freeHotspots && freeHotspots.length > 0) {
      freeHotspots.forEach(hotspot =>
        this.props.dispatch({
          type: 'POST_HOTSPOT',
          hotspot,
          location: this.state.userLocation
        })
      )
    }
  }

  isWifiInRange (ssid) {
    const { wifiInRange } = this.props.wifi
    const { hotspots, selectedId } = this.state

    return _.some(wifiInRange, { SSID: hotspots[selectedId].ssid })
  }

  formatConnDate (date) {
    if (!date) {
      return undefined
    }
    const d = new Date(date)
    return (
      ('0' + d.getDate()).slice(-2) +
      '-' +
      ('0' + (d.getMonth() + 1)).slice(-2) +
      '-' +
      d.getFullYear()
    )
  }

  render () {
    const { navigate } = this.props.navigation
    const { health, dispatch, loading } = this.props
    const healthMessage = health.currentMessage
    const {
      annotations,
      hotspotSelected,
      selectedId,
      hotspots,
      userLocation,
      errorMessage
    } = this.state
    const cairnsLoc = { latitude: -16.9216315, longitude: 145.7767414 }

    return (
      <View style={styles.container}>
        {loading.initialLoadComplete || Object.keys(hotspots).length
          ? <View style={styles.map}>
            <MapView
              style={styles.map}
              compassIsHidden
              initialCenterCoordinate={cairnsLoc}
              initialZoomLevel={12}
              userTrackingMode={Mapbox.userTrackingMode.follow}
              onChangeUserTrackingMode={() =>
                  this.setState({ userTrackingMode: 'none' })}
              onOpenAnnotation={e =>
                  (!e.title
                    ? this.setState({
                      selectedId: e.id,
                      hotspotSelected: true,
                      annotations: this.rerenderHotspots(e.id)
                    })
                    : null)}
              onFinishLoadingMap={this.addOfflinePacks}
              onUpdateUserLocation={this.userMoved}
              onRegionDidChange={this.mapMoved}
              onTap={e =>
                  (this.state.hotspotSelected
                    ? this.setState({
                      hotspotSelected: false,
                      selectedId: null,
                      annotations: this.rerenderHotspots(null)
                    })
                    : null)}
              annotations={annotations}
              styleURL='mapbox://styles/cquwifi/cj3f75wpp00022spal4svin9k'
              annotationsAreImmutable
              ref={map => {
                this._map = map
              }}
              />
            <View style={styles.buttonCont}>
              <Button
                text='Help'
                icon='questionCircleO'
                colour='#CD5602'
                action={() => navigate('About')}
              />
              <Button
                text='Me'
                icon='mapMarker'
                colour='#ADBDF0'
                action={() => {
                  this._map.setCenterCoordinate(
                    userLocation.latitude,
                    userLocation.longitude,
                    true,
                    () => {
                      this._map.setZoomLevel(18, true)
                    }
                  )
                }}
              />
            </View>
            {health.showFlash
            ? <FlashMessage
              heading={healthMessage.heading}
              content={healthMessage.content}
              icon='userMd'
              close={() => dispatch({ type: 'REMOVE_FLASH' })}
              />
            : null}
          </View>
          : <Loading />}
        {hotspotSelected
          ? <View style={styles.wifiInfo}>
            <HotspotInfo
              name={hotspots[selectedId].businessName}
              ssid={hotspots[selectedId].ssid}
              connections={hotspots[selectedId].connectionsCount}
              lastConnected={
                this.formatConnDate(hotspots[selectedId].lastConnected) ||
                  'n/a'
              }
              businessPartner={hotspots[selectedId].businessPartner}
              formattedDistance={this.distToWifiFormatted}
              distance={this.distToWifi}
              onConnectTouch={this.connectToWifi}
              password={hotspots[selectedId].password}
              reportWifi={this.reportWifi}
              available={this.isWifiInRange()}
              wifiEnabled={this.state.wifiEnabled}
              currentSSID={this.state.currentSSID}
              isConnecting={this.state.isConnecting}
              isConnected={this.state.isConnected}
              />
          </View>
          : null
          }
        {/* <WifiDebug availHotspots={filterHotspots(this.props.wifi.wifiInRange, hotspots)} /> */}
        
        {errorMessage
          ? <Card><Text style={{textAlign: 'center', margin: 10}}>Please turn on your phone's location services for accurate mapping</Text></Card>
          : null
        }
      </View>
    )
  }
}

Home.propTypes = {
  health: PropTypes.object.isRequired,
  hotspots: PropTypes.array.isRequired,
  landmarks: PropTypes.array,
  navigation: PropTypes.object.isRequired,
  wifi: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'stretch'
  },
  buttonCont: {
    position: 'absolute',
    top: 3 + '%',
    paddingLeft: 2 + '%',
    paddingRight: 2 + '%',
    width: 100 + '%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  wifiInfo: {
    position: 'absolute',
    bottom: 3 + '%',
    marginLeft: 2 + '%',
    marginRight: 2 + '%',
    width: 100 + '%',
    backgroundColor: '#fff'
  },
  map: {
    flex: 1
  },
  annotation: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute'
  }
})

const mapStateToProps = state => ({
  hotspots: state.hotspots,
  landmarks: state.landmarks,
  health: state.health,
  wifi: state.wifi,
  loading: state.loading
})

export default connect(mapStateToProps)(Home)
