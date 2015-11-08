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
  PixelRatio,
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
  View
} = React;

//var getStyleFromScore = require('./getStyleFromScore');
//var getImageSource = require('./getImageSource');
//var getTextFromScore = require('./getTextFromScore');

var SkillCell = React.createClass({
  render: function() {
    return (
      //<View>
        // <TouchableElement
        //   onPress={this.props.onSelect}
        //   onShowUnderlay={this.props.onHighlight}
        //   onHideUnderlay={this.props.onUnhighlight}>
        //   <View style={styles.row}>
            /* $FlowIssue #7363964 - There's a bug in Flow where you cannot
              * omit a property or set it to undefined if it's inside a shape,
              * even if it isn't required */
            // <Image
            //   source={'https://www.brandwatch.com/wp-content/uploads/brandwatch/troll.jpg'}
            //   style={styles.cellImage}
            // />
          // <View style={styles.textContainer}>
          //     <Text style={styles.movieTitle} numberOfLines={2}>
          //       {this.props.skill}
          //     </Text>
              // <Text style={styles.movieYear} numberOfLines={1}>
              //   {this.props.skill}
              //   {' '}&bull;{' '}
                // <Text style={getStyleFromScore(criticsScore)}>
                //   Critics {getTextFromScore(criticsScore)}
                // </Text>
              // </Text>
        //     </View>
        //   </View>
        // </TouchableElement>
      //</View>
      <View style={styles.container}>
              <Image
                source={{uri:'https://www.brandwatch.com/wp-content/uploads/brandwatch/troll.jpg'}}
                style={styles.thumbnail}
              />
              <View style={styles.rightContainer}>
                <Text style={styles.title}>{this.props.skill}</Text>
                <Text style={styles.year}>{this.props.skill}</Text>
              </View>
            </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  rightContainer: {
    flex: 1,
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
    width: 53,
    height: 81,
  },
  listView: {
    paddingTop: 20,
    backgroundColor: 'white',
  },
});

module.exports = SkillCell;
