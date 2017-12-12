'use strict';

import React, { Component } from 'react';
import {  AsyncStorage,
          Dimensions,
          ActivityIndicator,
          StyleSheet,
          Text,
          View,
          Platform,
          TouchableHighlight,
          Image,
          Navigator,
          I18nManager } from 'react-native';
import SwipeCards from './SwipeCards';
import LightboxView from './LightboxView';
import {server_data} from '../../data/server.data';
import language from '../../data/language.data';
//I18nManager.forceRTL(true);

/*Images*/
const ruler = 'group_405';
const gps = 'group_406';
const plus = 'group_565';
const location = 'group_437';
const hanger = 'hanger';
const refresh = 'rotate_picture';


//const server = server_data.DevServer
const server = server_data.Server

var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;
console.log(height, width)
var toolbarsHeight=127;

class Card extends Component{
  constructor(props){
    super(props);
    this.mount = true;
    this.state = {
         profileInfo:{
         name:'',
         image:'http://s3.amazonaws.com/cdn.roosterteeth.com/default/tb/user_profile_female.jpg',
         items:[],
      }
    }
  }
  componentDidMount(){
    this._getProfilePicFromFacebook()
  }
  componentWillUnmount(){
    this.mount = false;
  }
  _getProfilePicFromFacebook(){
    console.log('Get Data from facebook');
    let api = `https://graph.facebook.com/v2.9/${this.props.owner_id}/picture?type=normal&access_token=${this.props.credentials.token}&redirect=false`;
    let timeout = new Promise((resolve, reject) => {
      setTimeout(reject, 5000, 'request timed out');
    })
    let fetch1 = fetch(api)
    return Promise.race([timeout, fetch1])
                  .then((response) => response.json())
                  .then((json) => {
                    if (this.mount){
                      this.setState({
                          profileInfo: {...this.state.profileInfo, image: json.data.url},
                      });
                    }
                  })
                  .catch((error) => {
                    console.log(error);
                  })
  }
  render() {
    let distance = this.props.distance.substring(0,3) + this.props.textObject.km
    return (
        <View key={this.props.id} style={{height:height/1.4,flex:1, backgroundColor: 'white'}}>
          <View style={styles.card}>
            <View style={{height: (height/1.1)/2}}>
            <LightboxView images={this.props.image} navigator={this.props.navigator} >
              <Image
                style={{width: width/1.2, height: height/1.4, top: -height*0.1}}
                resizeMode="cover"
                source={{ uri: this.props.image ? this.props.image.img1 : null }}
              />
            </LightboxView>
            </View>
            <View style={styles.profilePicBackground}>
                  <Image style={styles.profilePic} source={{uri:this.state.profileInfo.image}} />
            </View>
            <View style={{zIndex: 100, justifyContent: 'flex-start', alignItems: 'center',  marginTop: width/17, paddingBottom: width/20}}>
                <Text style={styles.userName}>{this.props.userName}</Text>
                <View style={{flexDirection: 'row', justifyContent:'center', alignItems:'center',marginBottom: height/150, marginTop: height/100}}>
                    {this.props.size !== 0 && this.props.size !== '0' && <Image resizeMode='contain' source={{uri: ruler}} style={{width: width/20, height: width/45}}/>}
                    <Text style={styles.size}>{(this.props.size !== 0 && this.props.size !== '0') ? this.props.size : this.props.textObject.accessory}</Text>
                    <Text style={{fontSize: width/36}}>|</Text>
                    <Image resizeMode='contain' style={{marginHorizontal: width/70, width: width/60, height: width/40}} source={{uri: gps}} />
                    <Text style={styles.distance}>{distance}</Text>
                </View>
                <Text style={{ fontSize: width/20, color:'black',}}>{this.props.name}</Text>
                <View style={{flexDirection: 'row', justifyContent:'center', alignItems:'center'}}>
                  <Text style={{fontSize: width/26, color:'black',marginHorizontal: width/90}}>{this.props.swap}</Text>
                </View>
                <View style={{flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row'}}>
                  <Text style={{alignSelf: 'flex-end', fontSize: width/22}}>{this.props.textObject.currency}</Text>
                  <Text style={{fontSize: width/14, color:'black', top: Platform.OS === 'ios' ? 0 : 4}}>{this.props.price}</Text>
                </View>
            </View>
          </View>
        </View>
    );
  }
}
class NoMoreCards extends Component{
  render() {
    return (
      <View style={styles.noMoreCards}>
        <View style={{top: -height/10, justifyContent: 'center', alignItems: 'center'}}>
        <Text>{this.props.textObject.noMoreCardsTitle}</Text>
        <Image style={styles.hanger} source={{uri: hanger}} />
        <Text>{this.props.textObject.noMoreCardsSub1}</Text>
        <Text>{this.props.textObject.noMoreCardsSub2}</Text>
        </View>
        {Platform.OS === 'ios' &&
        <TouchableHighlight onPress={() => this.props.refresh()} underlayColor='#f0f0f0' style={{width: width/6.6, height:width/6.6, borderRadius: width/14, justifyContent: 'center', alignItems: 'center'}}>
          <View style={styles.refreshButton}>
              <Image source={{uri: refresh}} resizeMode='contain' style={{width: width/10, height: width/12}}/>
          </View>
        </TouchableHighlight>}
      </View>
    )
  }
}
class NetError extends Component{
  render() {
    return (
      <View style={styles.noMoreCards}>
        <View style={{top: -height/10, justifyContent: 'center', alignItems: 'center'}}>
        <Text>{this.props.textObject.netErrorTitle}</Text>
        <Image style={[styles.x,{transform: [{rotate: '45 deg'}]}]} source={{uri: plus}} />
        <Text>{this.props.textObject.netErrorSub}</Text>
        </View>
        {Platform.OS === 'ios' &&
        <TouchableHighlight onPress={() => this.props.refresh()} underlayColor='#f0f0f0' style={{width: width/6.6, height:width/6.6, borderRadius: width/14, justifyContent: 'center', alignItems: 'center'}}>
          <View style={styles.refreshButton}>
              <Image source={{uri: refresh}} resizeMode='contain' style={{width: width/10, height: width/12}}/>
          </View>
        </TouchableHighlight>}
      </View>
    )
  }
}
class LocationError extends Component{
  render() {
    return (
      <View style={styles.noMoreCards}>
        <View style={{top: -height/10, justifyContent: 'center', alignItems: 'center'}}>
        <Text>{this.props.textObject.locationErrorTitle}</Text>
        <Image style={styles.x} source={{uri: location}} />
        <Text>{this.props.textObject.locationErrorSub}</Text>
        </View>
        {Platform.OS === 'ios' &&
        <TouchableHighlight onPress={() => this.props.refresh()} underlayColor='#f0f0f0' style={{width: width/6.6, height:width/6.6, borderRadius: width/14, justifyContent: 'center', alignItems: 'center'}}>
          <View style={styles.refreshButton}>
              <Image source={{uri: refresh}} resizeMode='contain' style={{width: width/10, height: width/12}}/>
          </View>
        </TouchableHighlight>}
      </View>
    )
  }
}
class Loadding extends Component{
  render(){
    return(<View style={styles.noMoreCards}>
              <View style={{top: -height/10, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator style={styles.centering} size={Platform.OS === 'ios' ? 'large' :  75} animating={true} color='#b0b0b0'/>
              </View>
          </View>
    )
  }
}
export default class Tinder extends Component{
  constructor(props){
    super(props);
    this.textObject = language.getTextObject(language.getLanguage()).tinder
    this.user = this.props.user;
    this.initialPosition = null;
    this.page = 0;
	  this.mount = true;
    this.lastIndex = 0;
    this.state = {
        LocationError: false,
        NetError: false,
        cards: null,
        MoreCards: false,
        distance: 10,
        topPrice: 1000,
        bottomPrice: 1,
        jeans: ['32', '34', '36', '38', '40', '42', '44', '46', '48'],
        coats: ['32', '34', '36', '38', '40', '42', '44', '46', '48'],
        swimsuits: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
        overalls: ['32', '34', '36', '38', '40', '42', '44', '46', '48'],
        pants: ['32', '34', '36', '38', '40', '42', '44', '46', '48'],
        dresses: ['32', '34', '36', '38', '40', '42', '44', '46', '48'],
        skirts: ['32', '34', '36', '38', '40', '42', '44', '46', '48'],
        accessories: true,
        shirts: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
        shoes: ['35','35.5','36', '36.5','37','37.5','38','38.5','39','39.5','40','40.5','41','41.5','42','42.5','43'],

    }
    this._renderCard = this._renderCard.bind(this);
    this._renderNoMoreCard = this._renderNoMoreCard.bind(this);
    this._getCardsFromServer = this._getCardsFromServer.bind(this);
    this.cardRemoved = this.cardRemoved.bind(this);
    this.handleYup = this.handleYup.bind(this);
    this.handleNope = this.handleNope.bind(this);
    this._getSettings()
  }
  _getSettings = async() => {
     try{
        console.log('getting data');
        let tempSettingObj = await AsyncStorage.getItem('UID' + this.user.id + '_Setting')
        if (tempSettingObj != null){
          console.log('Succeed!')
          tempSettingObj = JSON.parse(tempSettingObj)
          if (this.mount){
            this.setState({
                  distance: tempSettingObj.radius,
                  topPrice: tempSettingObj.topPrice,
                  bottomPrice: tempSettingObj.bottomPrice,
                  jeans: tempSettingObj.jeans,
                  coats: tempSettingObj.coats,
                  swimsuits: tempSettingObj.swimsuits,
                  overalls: tempSettingObj.overalls,
                  pants: tempSettingObj.pants,
                  dresses: tempSettingObj.dresses,
                  skirts: tempSettingObj.skirts,
                  accessories: tempSettingObj.accessories,
                  shirts: tempSettingObj.shirts,
                  shoes: tempSettingObj.shoes,
            });
            return
          }
          throw "Can't update state will Component Tinder is unmount"
        }
    }
    catch(error){
      console.log('error occur while getting data:');
      console.log(error);
    }
  }
  _saveGPStoDB(){
    AsyncStorage.setItem('UID' + this.user.id + '_Location', JSON.stringify(this.initialPosition))
  }
  componentDidMount(){
    this._getGPSLocation(false)
  }
  componentWillUnmount(){
	  this.mount = false
    console.log('Unmount')
    //navigator.geolocation.clearWatch(this.watchID);
  }
  _getGPSLocation(enableHighAccuracy=false){
    console.log('Feting GPS')
    return navigator.geolocation.getCurrentPosition(
      (position) => {
        this.initialPosition = position;
        this._saveGPStoDB()
        this.getCards();
      },
      (error) => {
        console.log(error);
        if (!enableHighAccuracy){
          this._getGPSLocation(true)
        }
        else{
          if (this.mount){
            this.setState({
              LocationError: true,
            })
            return;
          }
        }
      },
      {enableHighAccuracy: enableHighAccuracy, timeout: 20000, maximumAge: 60000}
    );
  }
  getCards(){
    let reqBody=JSON.stringify({
      userID: this.user.id,
      lat: this.initialPosition.coords.latitude.toString(),
      lng: this.initialPosition.coords.longitude.toString(),
      radius: this.state.distance.toString(),
      topPrice: this.state.topPrice,
      bottomPrice: this.state.bottomPrice,
      jeans: this.state.jeans,
      coats: this.state.coats,
      swimsuits: this.state.swimsuits,
      overalls: this.state.overalls,
      pants: this.state.pants,
      dresses: this.state.dresses,
      skirts: this.state.skirts,
      accessories: this.state.accessories,
      shirts: this.state.shirts,
      shoes: this.state.shoes,
      page: this.page.toString()
    });
    return this._getCardsFromServer(reqBody);
  }
  _getCardsFromServer(reqBody){
    console.log('Feting data from server')
    let timeout = new Promise((resolve, reject) => {
      setTimeout(reject, 5000, 'request timed out');
    })
    let fetch1 = fetch(server + '/get',
            {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              body: reqBody,
            })
    return Promise.race([timeout, fetch1])
                  .then(response => response.json())
                  .then((responseJson) => {
                          console.log("json parse got: ");
                          let temp = this.state.cards
                          if (!temp){
                            temp = []
                          }
                          if (this.mount){
                              this.setState({
                                cards: temp.slice(this.lastIndex).concat(responseJson),
                                MoreCards: !(responseJson.length < 10)});
                            }
                          })
                  .catch((error) => {
                              console.log('Failur on Getting Cards')
                              console.log(error);
                              if (this.mount){
                                let temp = this.state.cards
                                if (!temp){
                                  console.log('NetError : TRUE')
                                  this.setState({
                                    NetError: true
                                  });
                                }
                              }
                            });
  }
  handleYup(card){
    console.log("like card id:")
    let data = JSON.stringify({
              userID: this.user.id,
              itemID: card.id,
    })
    fetch(server + '/likeItem',{
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
                body: data}
    ).then((response) => response.json())
    .then((responseJson) => {
      console.log('badge1')
      this.props.addBadgeToBage()
    })
    .catch((error) => {
      console.log(error)});
    return false
  }
  handleNope(card){
    console.log("dislike card id:")
    let data = JSON.stringify({
              userID: this.user.id,
              itemID: card.id,
    })
    fetch(server + '/dislikeItem',{
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
                body: data}
    )
    .then((response) => response.json())
    .then((res) => console.log(res))
    .catch((error) => console.log(error));
    return false
  }
  cardRemoved(index){
    console.log(`The index is ${index}`);
    let CARD_REFRESH_LIMIT = 2
    if (this.state.cards.length - index <= CARD_REFRESH_LIMIT) {
      console.log(`There are only ${this.state.cards.length - index - 1} cards left.`);
      if (this.state.MoreCards) {
       this.lastIndex = index+1
       this.page++
       this.getCards();
      }

    }
  }
  _renderCard(cardData){
    if (typeof cardData.image == 'string'){
      try{
        cardData.image = JSON.parse(cardData.image);
      }
      catch(error){
        console.log('Parsing Image object error', error)
        cardData.image = {}
      }
    }
    return (<Card navigator={this.props.navigator} credentials={this.props.credentials} user={this.props.user} {...cardData} textObject={this.textObject} />)
  }
  _renderNoMoreCard(){
    return (<NoMoreCards refresh={this.props.refreshControl} textObject={this.textObject}/>)
  }
  render() {
    if(this.state.LocationError)
      return (<LocationError refresh={this.props.refreshControl} textObject={this.textObject}/>)
    else if(this.state.NetError)
      return (<NetError refresh={this.props.refreshControl} textObject={this.textObject}/>)
    else if(!this.state.cards || !this.initialPosition)
      return (<Loadding/>)
    else{
      return (
        <View style={{height: height, backgroundColor: 'white'}}>
          <SwipeCards
            cards={this.state.cards}
            loop={false}
            cardKey='id'
            stack={true}
            stackDepth={3}
            renderCard={(cardData) => this._renderCard(cardData)}
            renderNoMoreCards={this._renderNoMoreCard}
            showYup={false}
            showNope={false}
            handleYup={this.handleYup}
            handleNope={this.handleNope}
            cardRemoved={this.cardRemoved}
            stackOffsetY={20}
            onClickHandler={() => {return}}
          />
        </View>
      )
    }
  }
}
const styles = StyleSheet.create({
  refreshButton:{
    width: width/7,
    height:width/7,
    borderRadius: width/14,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
        shadowOffset: {
          width: 0,
          height: 2,
    },
    shadowRadius: 2,
    shadowOpacity: 0.2,
  },
  card: {
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: 'white',
    height:height/1.4,
  },
  hanger:{
    width:100,
    height:100,
    resizeMode:'contain',
  },
  x:{
    width:50,
    height:50,
    resizeMode:'contain',
  },
   profilePicBackground:{
    width: width/8,
    height: width/8,
    borderRadius: width/16,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 150,
    top: (height/1.17)/2
  },
  profilePic:{
    width: width/9,
    height: width/9,
    borderRadius: width/18,
  },
  userName:{
    marginTop: width/50,
    fontSize: width/25
  },
  size:{
    marginHorizontal: width/45,
    fontSize: width/36,
  },
  distance:{
    fontSize: width/36,
  },
  details:{
    flex:1,
    alignItems:'center',
    flexDirection:'row',
    marginBottom:5
  },
  info: {
    alignItems:'center',
    flexDirection:'row',
    marginBottom:10
  },
  clothImage: {
    width: width/1.2,
    height: (height/1.4)/2,
  },
  text: {
    fontSize: 20,
    paddingTop: 10,
    paddingBottom: 10
  },
  noMoreCards: {
    flex: 1,
    backgroundColor: 'white',
    height:height,
    flexDirection:'column',
    justifyContent: 'center',
    alignItems: 'center',
  }
})
