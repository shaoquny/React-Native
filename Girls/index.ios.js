/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

'use strict';

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
  RefreshControl,
  Alert,
  Navigator,
  CameraRoll
} from 'react-native';

var rootServer = 'http://127.0.0.1:8082/?';
var picUrls;

class XXXiao extends React.Component {

  renderScene(route, navigator) {
    var Component = route.component;
    var reqUrl = route.reqUrl;

    return (
      <View style={styles.navigator}>
        <Component navigator={navigator} route={route} reqUrl={reqUrl} />
      </View>
    );
  }

	render() {
        return (
            <Navigator
                initialRoute={{name: 'WelcomeView', component: WelcomeView, reqUrl: null}}
                configureScene={() => {
                    return Navigator.SceneConfigs.FloatFromRight;
                }}
                renderScene={this.renderScene}
             />
        );
    }
}

var FeedView = React.createClass({

  getInitialState() {
    return {
      isRefreshing: false,
      rowData: null
    };
  },

  componentDidMount() {
    fetch(rootServer+'type=1&url='+this.props.reqUrl)
      .then((response) => response.json())
      .then((responseData) => {
        picUrls = responseData;
        this.setState({
          isRefreshing: false,
          rowData: picUrls.map(createThumbRow)
        });
      }).done();
  },

  onPressFeed() {
      this.props.navigator.pop();
  },

  render() {
    var _scrollView: ScrollView;
    return (
      <View style={styles.container1}>
        <Text style={styles.welcome}>
          Beauty Girl
        </Text>
        <ScrollView
          ref={(scrollView) => { _scrollView = scrollView; }}
          style={styles.scrollView}
        >
          {this.state.rowData}
        </ScrollView>
        <Text style={styles.welcome} onPress={this.onPressFeed}>
          Back To Beauty List
        </Text>
      </View>
    );
  }
});

var WelcomeView = React.createClass({
  getInitialState() {
    return {
      isRefreshing: false,
      scrollView: null,
      page: 0,
      rowData: null
    };
  },

  // componentWillMount() {
  //   fetch(rootServer+'type=0&page='+this.state.page)
  //     .then((response) => response.json())
  //     .then((responseData) => {
  //       this.setState({
  //         page: responseData.page,
  //         rowData: responseData.data
  //       });
  //     }).done();
  // },

  componentDidMount() {
    fetch(rootServer+'type=0&page='+this.state.page)
        .then((response) => response.json())
        .then((responseData) => {
          this.setState({
            page: responseData.page,
            rowData: responseData.data
          });
        }).done();
  },

  render() {
    const RowData = !this.state.rowData ?  null : this.state.rowData.map((dict, i) => {
      return <WelcomeThumb key={i} dict={dict} onPressed={this._onPressed}/>;
    });
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Beauty Girl
        </Text>
        <ScrollView
          ref={(scrollView) => { this.state.scrollView = scrollView; }}
          style={styles.scrollView}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this._onRefresh}
              tintColor='#ff0000'
              title="Loading..."
              colors={['#ff0000', '#00ff00', '#0000ff']}
              progressBackgroundColor="#ffff00"
            />
          }
        >
          {RowData}
        </ScrollView>
        <View style={styles.bottomButtonContainer}>
          <TouchableHighlight style={styles.bottomButtonCell} underlayColor='#909090' onPress={this._onPressedPrevious}>
            <View>
              <Text style={styles.bottomButton}>
                Previous
              </Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight style={styles.bottomButtonCell} underlayColor='#909090' onPress={this._onPressedNext}>
            <View>
              <Text style={styles.bottomButton}>
                Next
              </Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    );
  },

  _onRefresh() {
    this.setState({
      isRefreshing: true
    });
    fetch(rootServer+'type=2')
          .then((response) => response.json())
          .then((responseData) => {
            picUrls = responseData;
            this.setState({
              isRefreshing: false,
              page: responseData.page,
              rowData: responseData.data
            });
          }).done();
  },

  _onPressed(url) {
    this.props.navigator.push({
      name: 'FeedView',
      component: FeedView,
      reqUrl: url
    });
  },

  _onPressedPrevious() {
    this.state.scrollView.scrollTo({y:0});
    fetch(rootServer+'type=0&page='+(this.state.page-1))
        .then((response) => response.json())
        .then((responseData) => {
          this.setState({
            page: responseData.page,
            rowData: responseData.data
          });
        }).done();
  },

  _onPressedNext() {
    this.state.scrollView.scrollTo({y:0});
    fetch(rootServer+'type=0&page='+(this.state.page+1))
        .then((response) => response.json())
        .then((responseData) => {
          this.setState({
            page: responseData.page,
            rowData: responseData.data
          });
        }).done();
  }

});

var Thumb = React.createClass({
  render: function() {
    return (
      <View style={styles.button}>
        <TouchableHighlight onPress={this._onPressed}>
          <Image style={styles.imageContent}
            resizeMode={Image.resizeMode.contain}
            source={{uri:this.props.uri}}
          />
        </TouchableHighlight>
      </View>
    );
  },

  _onPressed() {
    CameraRoll.saveImageWithTag(this.props.uri)
      .then(function(data) {
          console.log(data);
        }, function(err) {
          console.log(err);
        }
      );
  }
});

var WelcomeThumb = React.createClass({

  _onPressed() {
    this.props.onPressed(this.props.dict.url);
  },

  render() {
    return (
      <View style={styles.button}>
        <TouchableHighlight 
          onPress={this._onPressed}
          underlayColor='#aaaaaa'
        >
          <Image style={styles.imageContentWelcome}
            resizeMode={Image.resizeMode.contain}
            source={{uri:this.props.dict.img}}
          />
        </TouchableHighlight>
      </View>
    );
  }
});

var THUMBS_INDEX = 0;
var THUMBS = [];
var createThumbRow = (uri, i) => <Thumb key={i} uri={uri} />;
var createWelcomeThumbRow = (dict, i) => <WelcomeThumb key={i} dict={dict} onPressed={this._onPressed}/>

const styles = StyleSheet.create({
  navigator: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  container1: {
    flex: 1,
    backgroundColor: '#F5C0FF',
  },
  welcome: {
    fontSize: 20,
    alignItems: 'center',
    textAlign: 'center',
    margin: 15,
    marginBottom: 5,
  },
  bottomButtonContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: '#aaaaaa',
  },
  bottomButtonCell: {
    flex: 1,
    height: 50,
  },
  bottomButton: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  nextButton: {
    flex: 1,
    fontSize: 20,
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  imageContentWelcome: {
    width : 400,
    height : 263
  },
  imageContent: {
    width : 400,
    height : 600
  },
  scrollView: {
    backgroundColor: '#6A85B1',
    height: 600,
  },
  button: {
    margin: 7,
    padding: 5,
    alignItems: 'center',
    backgroundColor: '#eaeaea',
    borderRadius: 3,
  },
});

AppRegistry.registerComponent('XXXiao', () => XXXiao);
