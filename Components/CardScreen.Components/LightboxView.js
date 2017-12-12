/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  AppRegistry,
  Dimensions,
  Image,
  Navigator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  I18nManager
} from 'react-native';
import ViewPager from './ViewPager';
import Lightbox from '../LightBox.Components/Lightbox';
import language from '../../data/language.data';

var window = Dimensions.get('window');
var height = window.height
var width= window.width;


export default class LightboxView extends Component{
 constructor(props){
    super(props);
    var dataSource = new ViewPager.DataSource({
      pageHasChanged: (p1, p2) => p1 !== p2,
    });
    var IMGS = []
    let images = Object.keys(this.props.images).filter((item) => {return this.props.images[item]})
    images.forEach((item) => IMGS.push(this.props.images[item]))
    if (language.isRTL()){
      IMGS.reverse()
    }
    this.state ={
      dataSource: dataSource.cloneWithPages(IMGS),
    }
    this._renderImages = this._renderImages.bind(this);
    this._renderCarousel = this._renderCarousel.bind(this);
  }
  _renderImages(image, index,index1){
    // return (
    //   <PhotoView  key={index}
    //               source={{uri: image}}
    //               minimumZoomScale={1}
    //               maximumZoomScale={3}
    //               androidScaleType="center"
    //               resizeMode='contain'
    //               onLoad={() => console.log("Image loaded!")}
    //               style={{width: width, height: height }} />
    //
    if (Platform.OS === 'ios'){
      return (
        <ScrollView contentContainerStyle={{ alignItems: 'center', justifyContent: 'center', }}
                    maximumZoomScale={3}
                    minimumZoomScale={1}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    style={{ overflow: 'hidden' }}>
                    <Image key={image} resizeMode='contain' source={{uri: image}} style={{width: width, height: height, opacity: 1}}/>
        </ScrollView>
      )
    }
    return(
          <Image key={image} resizeMode='contain' source={{uri: image}} style={{flex: 1,opacity: 1}}/>
      )
  }
  _renderCarousel(){
    let img = Object.keys(this.props.images).filter((item) => {return this.props.images[item]})
    if (this.state.dataSource.pageIdentities.length > 1){
      return(<ViewPager
              style={{width: width, height: height}}
              dataSource={this.state.dataSource}
              renderPage={this._renderImages}
              initialPage={img.length-1}/>)
    }
    if (Platform.OS === 'ios'){
      return (
        <ScrollView contentContainerStyle={{ alignItems: 'center', justifyContent: 'center', }}
                    maximumZoomScale={3}
                    minimumZoomScale={1}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    style={{ overflow: 'hidden' }}>
                    <Image resizeMode='cover' source={{uri: this.props.images.img1}} style={{height: height, width: width}}/>
        </ScrollView>
      )
    }
    return (<Image resizeMode='contain' source={{uri: this.props.images.img1}} style={{height: height, width: width}}/>)
  }
  render() {
    return (
        <Lightbox renderContent={this._renderCarousel}
                  style={{width: this.props.width  || width/1.2,height: this.props.height || (height/1.07)/2, overflow: 'hidden'}}
                  underlayColor="white"
                  navigator={this.props.navigator}
                  swipeToDismiss={false}
                  springConfig={{tension: 30, friction: 7}}
                  disableTouch={this.props.disableTouch}>
           {this.props.children}
        </Lightbox>
    );
  }
}


var styles = StyleSheet.create({});
