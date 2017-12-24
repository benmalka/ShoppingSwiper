import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  Alert,
  Dimensions,
  TouchableHighlight,
  UIManager,
  AsyncStorage,
  LayoutAnimation,
  StatusBar,
  Linking,
  ActivityIndicator,
  I18nManager,
} from 'react-native';
import SwipeCards from './SwipeCards';
import {post_resuest} from '../../Controllers/RestRequestController';

I18nManager.forceRTL(true)

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
//const FacebookAPI = server_data.Facebook

const card = [
    {id: "1", productName: "Matan", image: "https://airbitz.co/go/wp-content/uploads/2017/01/buy-websites.jpg", price: "101", currency: "$", website: "Ebay", link: "https://www.ebay.com/itm/lomography-lomoinstant-marrakesh-edition-3-lenses-instant-film-camera-flash/351652040056?hash=item51e0184d78"},
    {id: "2", productName: "Ben", image: "https://airbitz.co/go/wp-content/uploads/2017/01/buy-websites.jpg", price: "23", currency: "₪", website: "Ebay", link: "https://www.ebay.com/i/131674281841?rt=nc"},
    {id: "3", productName: "Avi", image: "https://airbitz.co/go/wp-content/uploads/2017/01/buy-websites.jpg", price: "56", currency: "€", website: "Ebay", link: "https://www.ebay.com/i/173004744064?rt=nc"},
    {id: "4", productName: "Timmy", image: "https://airbitz.co/go/wp-content/uploads/2017/01/buy-websites.jpg", price: "37", currency: "$", website: "Ebay", link: "https://www.ebay.com/itm/1969-Camaro-Chevrolet-Car-Chevy-Built-1-SS-12-RS-24-Carousel-Orange-25-Model-18/302559050034?_trkparms=aid%3D222007%26algo%3DSIM.MBE%26ao%3D1%26asc%3D20160908110712%26meid%3Dd419704029dd4a34a6decd06d0f3aeea%26pid%3D100677%26rk%3D9%26rkt%3D11%26sd%3D173004744064&_trksid=p2385738.c100677.m4598"}
]
const ios = Platform.OS === 'ios';
var {height, width} = Dimensions.get('window');

class Card extends Component{
    render(){
        return (
            <View style={styles.card}>
                <Image resizeMode='cover' source={{uri: this.props.image}} style={{width: width/1.2, height: (height/1.5)/1.8, backgroundColor: 'transparent'}}/>
                <View style={{alignItems: 'center', paddingVertical: height/50}}>
                    <Text style={{marginVertical: height/80}}>{this.props.productName}</Text>
                    <Text style={{marginVertical: height/80}}>{this.props.currency}{this.props.price}</Text>
                    <Text style={{marginVertical: height/80}}>{this.props.website}</Text>
                </View>
            </View>
        )
    }
}

export default class CardScreen extends Component {
 constructor(props){
     super(props)
     this.page = 0;
     this.lastIndex = 0;
     this.state = {
         maxPrice: 0,
         internetError: false,
         moreCards: false,
         cards: null,
     }
     this._getCardsFromServer = this._getCardsFromServer.bind(this);
     this._cardRemoved = this._cardRemoved.bind(this);
     this._handleSwipeLeft = this._handleSwipeLeft.bind(this);
     this._handleSwipeRight = this._handleSwipeRight.bind(this);
     this._renderCard = this._renderCard.bind(this)
     this._renderNoMoreCard = this._renderNoMoreCard.bind(this)

 }
 componentDidMount(){
     this.isMount = true
     this._getCardsFromServer()
 }
 componentWillUnmount(){
     this.isMount = false
 }
 _getCardsFromServer(){
    let body = {
        userID: this.props.userID,
        maxPrice: this.state.maxPrice,
        page: this.page
    }
    post_resuest('getItems', body)
    .then((response) => response.json())
    .then((json) => {
        let tmp_cards = this.state.cards
        if (!tmp_cards){
            tmp_cards = []
        }
        if (this.isMount){
            this.setState({
                cards: tmp_cards.slice(this.lastIndex).concat(json),
                moreCards: !(json.length < 10)
            })
        }
    })
    .catch((error) => {
        console.log(`Error on "getCardsFromServer": ${error.message}`)
        if (this.isMount){
            this.setState({
                internetError: true
            })
        }
    })
 }
 _handleSwipeLeft(card){
    console.log(`No! ${card.productName}`)
 }
 _handleSwipeRight(card){
    console.log(`Yes! ${card.productName}`)
    let body = {
        userID: this.props.user.userID,
        itemID: card.id
    }
    post_resuest('likeItem', body)
    .then((response) => response.json())
    .then((json) => {
        console.log(json.output)
    })
    .catch((error) => {
        console.log(error.message)
    })
 }
 _renderCard(data){
    return(<Card {...data}/>)
 }
 _renderNoMoreCard(){
    return (<View><Text>No More Cards </Text></View>)
 }
 _cardRemoved(index){
    console.log(`The index is ${index}`);
    let CARD_REFRESH_LIMIT = 2
    if (this.state.cards.length - index <= CARD_REFRESH_LIMIT) {
      console.log(`There are only ${this.state.cards.length - index - 1} cards left.`);
      if (this.state.moreCards) {
       this.lastIndex = index+1
       this.page++
       this._getCardsFromServer();
      }

    }
 }
 render(){
    if(this.state.internetError){
        return (<InternetError refresh={this.props.refreshControl} textObject={this.textObject}/>)
    }
    else if(!this.state.cards){
        return (<Loadding/>)
    }
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
                handleYup={this._handleSwipeRight}
                handleNope={this._handleSwipeLeft}
                cardRemoved={this._cardRemoved}
                stackOffsetY={20}
                onClickHandler={() => {return}}
            />
            </View>
        )
    }
 }
}

const styles = StyleSheet.create({
    backgroundView: {
        height: height,
        width: width,
        backgroundColor: 'red'
    },
    card:{
        width: width/1.2,
        height: height/1.5
    }
})