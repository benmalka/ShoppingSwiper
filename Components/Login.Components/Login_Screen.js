import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
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
import {FBLogin, FBLoginManager} from 'react-native-facebook-login';
import FB_Button from './FB_Login_Button';
import {post_request, facebook_post_request} from '../../Controllers/RestRequestController';

I18nManager.forceRTL(true)

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
//const FacebookAPI = server_data.Facebook


const ios = Platform.OS === 'ios';
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height; //full width



export default class Login extends Component {
  constructor(props){
    super(props);
    this.isMount = true
    this.textObject = {}
    this.state= {
      stillLooking:true,
    };
    this.errorHandler = this.errorHandler.bind(this);
    
  }
  componentWillMount(){
    LayoutAnimation.linear()
  }
  componentWillUnmount(){
    this.isMount = false
  }
  goToCardScreen(user) {
    this.props.navigator.resetTo({
      id: 'Card_Screen',
      user: user,
    })
  }
  _updateServer(obj_body){
    let body = {
      userID: obj_body.id,
      userName: obj_body.name,
      userFirstName: obj_body.first_name,
      userLastName: obj_body.last_name,
      userEmail: obj_body.email,
      userGender: obj_body.gender,
    }
    post_request('addUser', body)
    .then((response) => response.json())
    .then((json) => {
      if (json.output === 'success'){
        this.goToCardScreen(body)
      }
      else{
        this.errorHandler({message: json.output})
      }
    })
    .catch((error) => {
      this.errorHandler(error)
    })
  }
  onUserFound(e){
    console.log(e);
    facebook_post_request(e.credentials.userId, e.credentials.token, ['last_name','first_name', 'gender', 'email'])
    .then((response) => response.json())
    .then((json) => {
      console.log(json)
      this._updateServer(json)
    })
    .catch((error) => {
      this.errorHandler(error)
    })
  }
  errorHandler(error){
    console.log(error);
    Alert.alert('ERROR', error.message);
    this.setState({stillLooking:false});
  }
  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#417f86" barStyle={ios ? 'dark-content' : 'light-content'}/>
            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',marginBottom: height/11}}>
                <FBLogin
                    buttonView={this.state.stillLooking ? <ActivityIndicator size={75} color="#417f86"/> : <FB_Button />}
                    ref={(fbLogin) => { this.fbLogin = fbLogin }}
                    loginBehavior={FBLoginManager.LoginBehaviors.Native}
                    permissions={["email","user_friends"]}
                    onLogin={(e) => this._updateServer(e.profile)}
                    onLoginFound={(e) => this.onUserFound(e)}
                    onLoginNotFound={(e) => this.setState({stillLooking: false})}
                    onLogout={function(e){console.log(e)}}
                    onCancel={function(e){console.log(e)}}
                    onError={(error) => this.errorHandler(error)}
                    onPermissionsMissing={function(e){console.log(e)}}
                  />
            </View>
        </View>
    )
  }
}

const styles = StyleSheet.create({
  tryUsText:{
    width:200,
    height:40,
    textAlign:'center',
    fontSize:15,
    paddingTop:8.5,
    color:'white',
    backgroundColor:'blue',
    borderColor:'black',
    borderWidth:2,
  },
  tryImage:{
    alignItems : 'center',
    position:'relative',
    width:260,
    height:44,
    top:0,
    left:0,
  },
  tryText:{
    position:'absolute',
    alignItems : 'center',
    marginLeft:100,
    marginTop:10,
  },
  header:{
    fontSize:40,
    fontWeight:'bold',
    opacity:1,
    color: '#b0b0b0',
  },
  second:{
    fontSize:20,
    fontWeight:'bold',
    color: '#b0b0b0',
  },
  signup:{
    fontSize:20,
    fontWeight:'bold',
    position:'absolute',
    left:0,
    color:'white',
  },
  googleText: {
    position:'absolute',
    marginLeft:36,
    marginTop:11,
  },
  facebookText: {
    position:'absolute',
    marginLeft:22,
    marginTop:11,
  },
  signUpBack: {
    position:'absolute',
    width:124,
    height:44,
  },
  upper: {
    flex: 1,
    backgroundColor:'white',
    paddingVertical: height/100,
    alignItems : 'center',
  },
  middle: {
    height: 50,
    alignItems : 'center',
    flex: .3,
  },
  tryButton:{
    height: 50,
    alignItems : 'center',
    justifyContent: 'center',
  },
  bottom: {
    flex: .1,
    height: 50,
    alignItems : 'center',
    justifyContent: 'center',
    flexDirection:'row',
  },
  try:{
    fontSize:40,
    fontWeight:'bold',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent:'flex-end',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    flexDirection: 'column',
  },
});
