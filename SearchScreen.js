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
var TimerMixin = require('react-timer-mixin');

var invariant = require('invariant');
var dismissKeyboard = require('dismissKeyboard');

var SkillCell = require('./SkillCell');
var SkillScreen = require('./SkillScreen');
var SearchBar = require('SearchBar');
var ToggleBar = require('ToggleBar');

// Results should be cached keyed by the query
// with values of null meaning "being fetched"
// and anything besides null and undefined
// as the result of a valid query
var resultsCache = {
  dataForQuery: {},
  nextPageNumberForQuery: {},
  totalForQuery: {},
};

var LOADING = {};

var SearchScreen = React.createClass({
  mixins: [TimerMixin],

  timeoutID: (null: any),

  getInitialState: function() {
    return {
      isLoading: false,
      isLoadingTail: false,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      filter: '',
      queryNumber: 0,
    };
  },

  componentDidMount: function() {
    this.searchSkills('');
  },

  _urlForQueryAndPage: function(query: string): string {
    //var apiKey = API_KEYS[this.state.queryNumber % API_KEYS.length];
    //var printing = API_URL + 'movies.json?apikey=' + apiKey + '&q=' +
    //encodeURIComponent(query) + '&page_limit=20&page=' + pageNumber;
    if (query) {
      //console.log(printing);
      return 'http://localhost:5000/skills/search?q=' + query;
    } else {
      // With no query, load all skills
      return (
        'http://localhost:5000/skills/'
      );
    }
  },

  searchSkills: function(query: string) {
    this.timeoutID = null;

    this.setState({filter: query});

    this.setState({
      isLoading: true,
      queryNumber: this.state.queryNumber + 1,
      isLoadingTail: false,
    });
    console.log('Searching Skills: ' + query);

    fetch(this._urlForQueryAndPage(query))
      .then((response) => response.json())
      .catch((error) => {
        this.setState({
          dataSource: this.getDataSource([]),
          isLoading: false,
        });
      })
      .then((responseData) => {
        if (this.state.filter !== query) {
          // do not update state if the query is stale
          return;
        }

        this.setState({
          isLoading: false,
          dataSource: this.getDataSource(responseData.skills),
        });
      })
      .done();
  },


  getDataSource: function(skills: Array<any>): ListView.DataSource {
    return this.state.dataSource.cloneWithRows(skills);
  },

  selectSkill: function(skill:string) {

      this.props.navigator.push({
        title: skill,
        component: SkillScreen,
        //passProps: {skill},
      });
  },

  onSearchChange: function(event: Object) {
    var filter = event.nativeEvent.text.toLowerCase();
    console.log('On search change: ' + filter);

    this.clearTimeout(this.timeoutID);
    this.timeoutID = this.setTimeout(() => this.searchSkills(filter), 100);
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
    skill: string,
    sectionID: number | string,
    rowID: number | string,
    highlightRowFunc: (sectionID: ?number | string, rowID: ?number | string) => void,
  ) {
    return (
      <SkillCell
        //key={skill}
        onSelect={() => console.log("fasdfasd")}
        onHighlight={() => highlightRowFunc(sectionID, rowID)}
        onUnhighlight={() => highlightRowFunc(null, null)}
        skill = {skill}
      />
    );
  },

  render: function() {
    //console.log('Rendering');
    var content = this.state.dataSource.getRowCount() === 0 ?
      <NoSkills
        filter={this.state.filter}
        isLoading={this.state.isLoading}
      /> :
      <ListView
        ref="listview"
        renderSeparator={this.renderSeparator}
        dataSource={this.state.dataSource}
        renderRow={this.renderRow}
        automaticallyAdjustContentInsets={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps={true}
        showsVerticalScrollIndicator={false}
      />;

    return (
      <View style={styles.container}>
        <SearchBar
          onSearchChange={this.onSearchChange}
          isLoading={this.state.isLoading}
          onFocus={() =>
            this.refs.listview && this.refs.listview.getScrollResponder().scrollTo(0, 0)}
        />
        <View style={styles.separator} />
        {content}
        <View style={styles.separator} />
        <View style={styles.centerText} >
        <Text> TeachMe </Text>
        </View>
      </View>
    );
  },
});

var NoSkills = React.createClass({
  render: function() {
    var text = '';
    if (this.props.filter) {
      text = `No results for "${this.props.filter}"`;
    } else if (!this.props.isLoading) {
      // If we're looking at the latest movies, aren't currently loading, and
      // still have no results, show a message
      text = 'No skills found';
    }

    return (
      <View style={[styles.container, styles.rightText]}>
        <Text style={styles.noSkillsText}>{text}</Text>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'yellow',
  },
  centerText: {
    alignItems: 'center',
  },
  rightText: {
  // textAlign: 'left',
  },
  noSkillsText: {
    marginTop: 80,
    color: '#888888',
  },
  separator: {
    height: 2,
    backgroundColor: 'blue',
  },
  scrollSpinner: {
    marginVertical: 20,
  },
  rowSeparator: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: 1,
    marginLeft: 4,
  },
  rowSeparatorHide: {
    opacity: 0.0,
  },
});

module.exports = SearchScreen;
