/**
 * The examples provided by Facebook are for non-commercial testing and
 * evaluation purposes only.
 *
 * Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * @flow
 */
'use strict';

var React = require('react-native');
var {
  Image,
  TouchableHighlight,
  StyleSheet,
  Text,
  View
} = React;
const { BlurView, VibrancyView } = require('react-native-blur');

var PersonSkillToken = React.createClass({
  render: function() {
    var skill = this.props.skill;
    var tokenStyle = 'good';
    if (skill.upvotes > 10)
      tokenStyle = 'great';
    if (skill.upvotes > 20)
      tokenStyle = 'excellent';
    return (
      <Text style={[styles.token, styles['token_' + tokenStyle]]}>
        <Text style={[styles.tokenText, styles.tokenPrimary]}>{skill.name} {' '}</Text>
        <Text style={styles.tokenText}>{skill.suggestedPoints}</Text>
      </Text>
    )
  }
})

var PersonCell = React.createClass({
  render: function() {
    var person = this.props.person;
    return (
      <View>
        <TouchableHighlight onPress={this.props.onSelect}>
          <View style={styles.container}>
            <Image source={{uri: 'http://graph.facebook.com/v2.5/' + person.imageID + '/picture'}} style={[styles.background, styles.container]}>
              <BlurView blurType="light" style={[styles.container, styles.clear, styles.content]}>
                <Image source={{uri: 'http://graph.facebook.com/v2.5/' + person.imageID + '/picture'}} style={styles.thumbnail} />
                <View style={styles.rightContainer}>
                  <Text style={styles.name}>{person.name}</Text>
                  <View style={[styles.row, styles.clear]}>{person.skills.map(function(skill) { return <PersonSkillToken skill={skill} /> })}</View>
                </View>
              </BlurView>
            </Image>
          </View>
        </TouchableHighlight>
      </View>
    )
  }
});

var styles = StyleSheet.create({
  content: {
    padding: 10
  },
  background: {
    // position: 'absolute',
    // left: 0,
    // right: 0,
    // height: 48
  },
  token: {
    borderRadius: 4,
    borderWidth: 2,
    marginLeft: 4,
    marginRight: 4,
    padding: 5,
    overflow: 'hidden'
  },
  clear: {
    backgroundColor: 'transparent'
  },
  token_good: {
    backgroundColor: '#EEE',
    borderColor: '#AAA'
  },
  token_great: {
    borderColor: 'rgba(47, 213, 110, 1.0)',
    backgroundColor: 'rgba(47, 213, 110, 0.2)'
  },
  token_excellent: {
    borderColor: 'rgba(90, 190, 246, 1.0)',
    backgroundColor: 'rgba(90, 190, 246, 0.2)'
  },
  tokenText: {
    paddingLeft: 4,
    paddingRight: 4,
    textAlign: 'center'
  },
  tokenPrimary: {
    fontWeight: 'bold'
  },
  container: {
    backgroundColor: 'transparent',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  row: {
    flex: 1,
    flexDirection: 'row'
  },
  rightContainer: {
    flex: 1,
    paddingLeft: 10
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  year: {
    textAlign: 'center',
  },
  thumbnail: {
    width: 40,
    height: 40,
  },
  listView: {
    paddingTop: 20,
    backgroundColor: 'white',
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 4
  },
  cellImage: {

  }
});

module.exports = PersonCell;
