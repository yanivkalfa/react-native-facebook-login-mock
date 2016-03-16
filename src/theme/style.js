import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  FBLMButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems:'center',

    height: 30,
    width: 175,
    paddingLeft: 2,

    backgroundColor: 'rgb(66,93,174)',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: 'rgb(66,93,174)',

    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 0
    }
  },
  FBLMButtonContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems:'center'
  },
  FBLMIconWrap:{
    flex:1
  },
  FBLMIcon: {
    fontSize:14,
    color:'white'
  },
  FBLMTextWrap:{
    flex:2,
    alignItems:'center'
  },
  FBLMText: {
    color: 'white',
    fontWeight: '600',
    fontFamily: 'Helvetica neue',
    fontSize: 14
  },
  FBLMTextLoggedIn: {
    marginLeft: 5
  },
  FBLMTextLoggedOut: {
    marginLeft: 18
  }
});

