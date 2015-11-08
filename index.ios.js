/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var PersonList = require('PersonList');

var {
  AppRegistry,
  Settings,
  SnapshotViewIOS,
  NavigatorIOS,
  StyleSheet,
  Text,
  View,
} = React;

//import type { NavigationContext } from 'NavigationContext';
var SearchScreen = require('./SearchScreen');
var Messenger = require('Messenger');

var TeachMe = React.createClass({
  render: function() {
    return (
      <NavigatorIOS
        style={styles.container}
        initialRoute={{
          title: 'Nearby',
          component: PersonList,
          tintColor: "orange",
          rightButtonTitle: "Messages",
          onRightButtonPress: () => {
            this.props.navigator.push({
            title: 'messenger',
            component: Messenger,
            });
              },
          leftButtonTitle: "Settings",
          onLeftButtonPress: () => {},
        }}
      />
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});

AppRegistry.registerComponent('TeachMe', () => TeachMe);

module.exports = TeachMe;
