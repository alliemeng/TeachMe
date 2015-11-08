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
 * @providesModule PersonList
 * @flow
 */
'use strict';

var React = require('react-native');
var PersonCell = require('./PersonCell');

var {
  View,
  Text,
  StyleSheet,
  ListView
} = React;

var PersonList = React.createClass({
  getInitialState: function() {
    var dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      dataSource: dataSource.cloneWithRows([])
    }
  },
  getDataSource: function(people: Array<any>): ListView.DataSource {
    return this.state.dataSource.cloneWithRows(people);
  },
  componentDidMount: function() {
    fetch('http://localhost:5000/users')
      .then((response) => response.json())
      .catch((error) => {
        this.setState({
          dataSource: this.getDataSource([])
        });
      })
      .then((responseData) => {
        this.setState({
          dataSource: this.getDataSource(responseData),
        });
      })
      .done();
  },
  onSelect: function() {
    console.log('Selected');
  },
  renderRow: function(person) {
    return <PersonCell person={person} onSelect={this.onSelect} />;
  },
  renderSeparator: function() {
    return <View style={styles.separator} />;
  },
  render: function() {
    var content;
    if (this.state.dataSource.getRowCount() < 1)
      content = <LoadingPeople />;
    else
      content = <ListView 
                  dataSource={this.state.dataSource} 
                  renderRow={this.renderRow} style={styles.listContent} 
                  renderSeparator={this.renderSeparator}
                />;
    return (
      <View style={styles.searchBar}>
        {content}
      </View>
    );
  }
});

var LoadingPeople = React.createClass({
  render: function() {
    var text = 'Loading people nearby...';
    
    return (
      <View style={styles.loading}>
        <Text style={styles.center}>{text}</Text>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  loading: {
    marginTop: 80
  },
  center: {
    textAlign: 'center'
  },
  listContent: {
    marginTop: 20
  },
  separator: {
    height: 2,
    backgroundColor: '#BBB',
  }
});

module.exports = PersonList;
