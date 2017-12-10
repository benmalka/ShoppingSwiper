/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Image,
  View,
  Button,
  Alert,
  Dimensions,
  AsyncStorage,
  TouchableHighlight,
  I18nManager,
} from 'react-native';
import Navigator from 'Components/Navigation.Components/Navigator';
import Login from 'Components/Login.Components/Login_Screen';

const FloatFromRight = {
  ...Navigator.SceneConfigs.FloatFromRight,
  gestures: {
    pop: {
      ...Navigator.SceneConfigs.FloatFromRight.gestures.pop,
      edgeHitWidth: 0,
    },
  },
};

export default class App extends Component {
  constructor(props){
    super(props);
  }
  waitLocation(){
        return <Navigator
          configureScene={(route, routeStack) => FloatFromRight}
          initialRoute={{id: firstScene}}
          renderScene={this.navigate}/>
  }

  render() {
   return this.waitLocation();
  }

  navigate(route, navigator){
    var Component = route.component
    switch(route.id){
      case 'Login_Screen':return (<LoginScene navigator={navigator} />);
      case 'Card_Screen': return (<View><Text>Card Screen</Text></View>);
      case 'Favorites_Screen': return (<View><Text>Favorites Screen</Text></View>);
      }
  }
}



