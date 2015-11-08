/**
 * @providesModule Messenger
 * @flow
 */


'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  ScrollView,
  View,
  Dimensions
} = React;

var deviceWidth = Dimensions.get('window').width;

var Messenger = React.createClass({
  render: function() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container}>
          <ChatMessage>
            HEYLLLOOOOOHEYLLLOOOOOHEYLLLOOOOOHEYLLLOOOOOHEYLLLOOOOOHEYLLLOOOOOHEYLLLOOOOOHEYLLLOOOOOHEYLLLOOOOOHEYLLLOOOOOHEYLLLOOOOOHEYLLLOOOOOHEYLLLOOOOOHEYLLLOOOOOHEYLLLOOOOO
          </ChatMessage>
          <ChatMessage>
            HEYLLLOOOOO
          </ChatMessage>
          <ChatMessage />
        </ScrollView>
      </View>
    );
  }
});

var ChatMessage = React.createClass({
  render: function() {
    return (
          <View style={styles.chatOuter}>
            <View style={{alignSelf: 'center'}}>
              <TriangleLeft />
            </View>
            <View style={{flexWrap: 'wrap', width: deviceWidth - 10, padding: 5}}>
            <View style={{ alignSelf: 'flex-start',flexWrap: 'wrap', borderWidth: 1, borderColor: '#000', padding: 5, borderRadius: 5 }}>
                <Text>
                  {this.props.children}
                </Text>
            </View>
            </View>
          </View>
      )
  }
})
var Triangle = React.createClass({
  render: function() {
    return (
      <View style={[styles.triangle, this.props.style]} />
    )
  }
})

var TriangleLeft = React.createClass({
  render: function() {
    return (
      <Triangle style={styles.triangleLeft}/>
    )
  }
})

var styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  chatOuter: {
    marginTop: 30,
    flexDirection: 'row'
  },

  chatTriangle: {
    width: 15,
    height: 15,
    borderColor: '#000',
    borderWidth: 1
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderBottomWidth: 15,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'red'
  },
  triangleLeft: {
    transform: [
      {rotate: '-90deg'}
    ]
  }
})

module.exports = Messenger;
