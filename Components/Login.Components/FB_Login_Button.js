import React, { Component } from 'react';
import {Dimensions,
        TouchableHighlight,
        Image,
        StyleSheet,
        Text,
        View } from 'react-native';

var {height, width} = Dimensions.get('window')

export default class FB_Button extends Component {
  constructor(props) {
      super(props);
    }
    render(){
        return (
          <View> 
              <View style={styles.facebookView}>
                <Text style={styles.facebookText}>Login via Facebook</Text>
              </View>
          </View>
      )
    }
}
const styles = StyleSheet.create({
  facebookView:{
    width: width/1.7,
    height: height/13,
    backgroundColor: 'rgb(65,95,155)'
  },
  tryUsContainer:{
    alignItems:'center',
    justifyContent:'center',
    height:50,
  },
  tryUsText:{
    width:200,
    height:50,
    textAlign:'center',
    fontWeight:'bold',
    fontSize:15,
    paddingTop:13.5,
    color:'white',
    backgroundColor:'#f44336',
    borderColor:'black',
  },
  orText: {
    textAlign:'center',
    width:200,
    color:'white',
    fontWeight:'bold',
    fontSize:20,
    marginTop:10
  },
  facebookText: {
    textAlign:'center',
    color:'white',
    fontWeight:'bold',
    fontSize:15,
    top:13.5,
  },
  back:{
    width:200,
    height:50,
    resizeMode:'stretch',
  },
  tryView:{
    marginTop:10,
    width:200,
    height:50,
  },
});