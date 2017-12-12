'use strict';

import React, {Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  LayoutAnimation,
  I18nManager,
} from 'react-native';

var deviceWidth = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
var ACTIVE_DOT_SIZE = deviceWidth/25;
var DOT_SIZE = deviceWidth/35;
var DOT_SAPCE = deviceWidth/90;

var styles = StyleSheet.create({
  tab: {
    alignItems: 'center',
  },

  tabs: {
    flexDirection: I18nManager.isRTL ? 'row' : 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: height/15,
  },

  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: '#f0f0f0',
  },

  curDot: {
    //position: 'absolute',
    width: ACTIVE_DOT_SIZE,
    height: ACTIVE_DOT_SIZE,
    borderRadius: ACTIVE_DOT_SIZE / 2,
    backgroundColor: '#a967cc',
  },
});

export default class DefaultViewPageIndicator extends Component{
  constructor(props){
    super(props)
    this.state ={
       viewWidth: 0,
    }
  }
  renderIndicator(page) {
    //var isTabActive = this.props.activePage === page;
    return (
      <TouchableOpacity style={styles.tab} key={'idc_' + page} onPress={() => this.props.goToPage(page)}>
        <View style={{width: ACTIVE_DOT_SIZE, height: ACTIVE_DOT_SIZE, marginHorizontal: DOT_SAPCE, justifyContent: 'center', alignItems: 'center'}}>
        <View style={this.props.activePage !== page ? styles.dot : styles.curDot} />
        </View>
      </TouchableOpacity>
    );
  }
  render() {
    var pageCount = this.props.pageCount;
    var itemWidth = DOT_SIZE + (DOT_SAPCE * 2);
    var offset = (this.state.viewWidth - itemWidth * pageCount) / 2 + itemWidth * this.props.activePage;

    //var left = offset;
    var offsetX = itemWidth * (this.props.activePage - this.props.scrollOffset);
    var left = this.props.scrollValue.interpolate({
      inputRange: [0, 1], outputRange: [offsetX, offsetX + itemWidth]
    })

    var indicators = [];
    for (var i = 0; i < pageCount; i++) {
      indicators.push(this.renderIndicator(i))
    }

    return (
      <View style={styles.tabs}
        onLayout={(event) => {
            var viewWidth = event.nativeEvent.layout.width;
            if (!viewWidth || this.state.viewWidth === viewWidth) {
              return;
            }
            this.setState({
              viewWidth: viewWidth,
            });
          }}>
        {indicators}
        {/*<Animated.View style={[styles.curDot, {left}]} />*/}
      </View>
    );
  }
}
