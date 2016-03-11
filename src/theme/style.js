export default {
  FBLoginMock: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  FBLoginMockButtonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  FBLoginMockButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

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
  FBLoginMockButtonText: {
    color: 'white',
    fontWeight: '600',
    fontFamily: 'Helvetica neue',
    fontSize: 14.2
  },
  FBLoginMockButtonTextLoggedIn: {
    marginLeft: 5
  },
  FBLoginMockButtonTextLoggedOut: {
    marginLeft: 18
  },
  FBLoginMockLogo: {
    position: 'absolute',
    height: 14,
    width: 14,

    left: 7,
    top: 7
  }
}