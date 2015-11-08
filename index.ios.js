/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var PersonList = require('PersonList');

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
} = React;

var TeachMe = React.createClass({
  render: function() {
    return (
      <View style={styles.container}>
        <PersonList />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    
  },
});

AppRegistry.registerComponent('TeachMe', () => TeachMe);
