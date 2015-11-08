/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
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

var TeachMe = React.createClass({
  render: function() {
    return (
      <NavigatorIOS
        style={styles.container}
        initialRoute={{
          title: '',
          component: SearchScreen,
          tintColor: "orange",
          rightButtonTitle: "Messages",
          onRightButtonPress: () => {
                AlertIOS.alert(
                  'Bar Button Action',
                  'Recognized a tap on the bar button icon',
                  [
                    {
                      text: 'OK',
                      onPress: () => console.log('Tapped OK'),
                    },
                  ]
                );
              },
          leftButtonTitle: "Settings",
          onLeftButtonPress: () => {},
        }}
      />
    //View> </View>
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
