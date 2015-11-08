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
  ActivityIndicatorIOS,
   ListView,
   Platform,
   ProgressBarAndroid,
   StyleSheet,
   Text,
   View,
 } = React;


var SkillScreen = React.createClass({
  //var pplwithskill = [];

  allpeoplewithskill: function(skill: string): string {
    //var apiKey = API_KEYS[this.state.queryNumber % API_KEYS.length];
    //var printing = API_URL + 'movies.json?apikey=' + apiKey + '&q=' +
    //encodeURIComponent(query) + '&page_limit=20&page=' + pageNumber;
    userdata = 'http://localhost:5000/users';

    // for each (person in userdata){
    //
    // }
  },

  renderSeparator: function(
    sectionID: number | string,
    rowID: number | string,
    adjacentRowHighlighted: boolean
  ) {
    var style = styles.rowSeparator;
    if (adjacentRowHighlighted) {
        style = [style, styles.rowSeparatorHide];
    }
    return (
      <View key={'SEP_' + sectionID + '_' + rowID}  style={style}/>
    );
  },

  renderRow: function(
    skill: Object,
    sectionID: number | string,
    rowID: number | string,
    highlightRowFunc: (sectionID: ?number | string, rowID: ?number | string) => void,
  ) {
    return (
      <PersonCell/>
    );
  },


  render: function() {
    return (
    <Text> 'asdf' </Text>
    );
  },
});


module.exports = SkillScreen;
