import React from 'react'
import { View, StyleSheet, Text, TouchableHighlight, Platform } from 'react-native'
import FontAwesome, { Icons } from 'react-native-fontawesome'
import PropTypes from 'prop-types'

import InfoCard from './InfoCard'
import ConnectButton from './ConnectButton'

const HotspotInfo = ({
  name,
  ssid,
  connections,
  lastConnected,
  businessPartner,
  password,
  distance,
  formattedDistance,
  onConnectTouch,
  available,
  wifiEnabled,
  isConnecting,
  isConnected,
  currentSSID,
  reportWifi
}) => {
  const dist = distance()
  let button

  if (Platform.OS === 'ios') {
    if (dist <= 25) {
      button = (
        <View style={styles.buttonSection}>
          <ConnectButton
            text="You're in range!"
            icon='wifi'
            colour='#CD5602'
            action={null}
          />
          <Text style={styles.tooFar}>
            Connect to this access point in your wifi settings!
          </Text>
        </View>
      )
    } else {
      button = (
        <View style={styles.buttonSection}>
          <Text style={styles.tooFar}>
            Please move closer to this wifi point to be within range
          </Text>
        </View>
      )
    }
  } else {
    if (available) {
      button = (
        <View style={styles.buttonSection}>
          <ConnectButton
            text='CONNECT'
            icon='wifi'
            colour='#CD5602'
            action={() => onConnectTouch(ssid, password)}
          />
        </View>
      )
    }

    if (ssid === currentSSID && isConnected) {
      button = (
        <View style={styles.buttonSection}>
          <ConnectButton
            text='CONNECTED!'
            icon='check'
            colour='#ADBDF0'
            action={null}
          />
        </View>
      )
    }
    if (available && isConnecting && !isConnected) {
      button = (
        <View style={styles.buttonSection}>
          <ConnectButton
            text='Connecting...'
            icon='spinner'
            colour='#CD5602'
            action={null}
          />
        </View>
      )
    }

    if (!available && dist && dist > 25) {
      button = (
        <Text style={styles.tooFar}>
          We can't detect this access point, try moving closer
        </Text>
      )
    }

    if (available && dist && dist <= 25) {
      button = (
        <TouchableHighlight
          onPress={reportWifi}
          activeOpacity={1}
          underlayColor='transparent'
        >
          <View style={styles.reportWrap}>
            <Text style={styles.reportText}>
              Report this hotspot as no longer existing
            </Text>
          </View>
        </TouchableHighlight>
      )
    }

    if (!wifiEnabled) {
      button = (
        <Text style={styles.tooFar}>
          Please turn on your wifi connection
        </Text>
      )
    }
  }

  return (
    <InfoCard>
      <View>
        <View style={styles.header}>
          <Text style={styles.title}>{name || ssid}</Text>
          <Text style={styles.distance}>{formattedDistance()}</Text>
        </View>
        <View style={styles.reviews}>
          <Text style={styles.reviewTitle}>Hotspot Details</Text>
          <View style={styles.reviewSection}>
            <View style={styles.reviewType}>
              <FontAwesome style={styles.reviewIcon}>
                {Icons.barChart}
              </FontAwesome>
              <Text style={styles.reviewText}>Total connections:</Text>
            </View>
            <Text style={styles.reviewNumber}>{connections}</Text>
          </View>
          <View style={styles.reviewSection}>
            <View style={styles.reviewType}>
              <FontAwesome style={styles.reviewIcon}>
                {Icons.wifi}
              </FontAwesome>
              <Text style={styles.reviewText}>Last connection: </Text>
            </View>
            <Text style={styles.reviewNumber}>{lastConnected}</Text>
          </View>
          <View style={styles.reviewSection}>
            <View style={styles.reviewType}>
              <FontAwesome style={styles.reviewIcon}>
                {Icons.thumbsUp}
              </FontAwesome>
              <Text style={styles.reviewText}>Business partner?</Text>
            </View>
            <Text style={styles.reviewNumber}>
              {businessPartner ? 'Yes' : 'No'}
            </Text>
          </View>
        </View>
        <View style={styles.buttonWrap}>
          {button}
        </View>
      </View>
    </InfoCard>
  )
}

HotspotInfo.propTypes = {
  name: PropTypes.string.isRequired,
  ssid: PropTypes.string.isRequired,
  password: PropTypes.string,
  distance: PropTypes.func.isRequired,
  formattedDistance: PropTypes.func.isRequired,
  onConnectTouch: PropTypes.func.isRequired,
  available: PropTypes.bool.isRequired,
  wifiEnabled: PropTypes.bool,
  currentSSID: PropTypes.string.isRequired,
  isConnecting: PropTypes.bool.isRequired,
  isConnected: PropTypes.bool,
  connections: PropTypes.number.isRequired,
  lastConnected: PropTypes.string,
  businessPartner: PropTypes.bool.isRequired
}

export default HotspotInfo

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#9F9F9F',
    paddingBottom: 15
  },
  title: {
    color: '#CD5602',
    maxWidth: 80 + '%'
  },
  distance: {
    marginLeft: 'auto',
    color: '#CD5602'
  },
  reviews: {
    paddingTop: 15,
    paddingBottom: 15
  },
  reviewTitle: {
    color: '#CD5602',
    paddingBottom: 10
  },
  reviewSection: {
    display: 'flex',
    flexDirection: 'row'
  },
  reviewIcon: {
    color: '#9F9F9F',
    fontSize: 12,
    width: 15,
    marginRight: 8
  },
  reviewText: {
    color: '#9F9F9F',
    marginLeft: 3
  },
  reviewType: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: 50 + '%'
  },
  reviewNumber: {
    fontSize: 14,
    color: '#2D2D2D'
  },
  reviewStars: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  reviewStar: {
    fontSize: 14,
    color: '#CD5602'
  },
  tooFar: {
    textAlign: 'center',
    fontSize: 14,
    color: '#CD5602',
    marginTop: 3
  },
  buttonWrap: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  reportWrap: {
    width: 60 + '%'
  },
  reportText: {
    fontSize: 14,
    color: '#CD5602'
  }
})
