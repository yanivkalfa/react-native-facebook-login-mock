import react, {
  Component,
  View,
  StyleSheet,
  PropTypes,
  NativeModules,
  requireNativeComponent,
  NativeMethodsMixin,
  DeviceEventEmitter,
} from 'react-native';

import { getFBCredentials, login, logout } from './util';
const { FBLoginManager } = NativeModules;

export default class FBLoginMock extends Component {
  constructor(props) {
    super(props);


    Object.assign(this, NativeMethodsMixin);

    this.state = {
      credentials: null,
      subscriptions: [],
    };
  }

  handleLogin(){
    login(this.props.permissions || null).then((data) => {
      this.setState({ credentials : data.credentials });
    }).catch((err) => {
      this.setState({ credentials : null });
    })
  }

  handleLogout(){
    logout().then((data) => {
      this.setState({ credentials : null });
    }).catch((err) => {
      console.warn(err);
    })
  }

  onPress() {
    this.state.credentials
      ? this.handleLogout()
      : this.handleLogin();

    this.props.onPress && this.props.onPress();
  }


  invokeHandler(eventType, eventData) {
    const eventHandler = this.props["on" + eventType];
    if (typeof eventHandler !== 'function') throw new Error('Handler is not a functions');
    eventHandler(eventData);
  }

  componentWillMount() {
    const subscriptions = this.state.subscriptions;
    Object.keys(FBLoginManager.Events).forEach((eventType) => {
      let sub = DeviceEventEmitter.addListener( FBLoginManager.Events[eventType], this.invokeHandler.bind(this, eventType) );
      subscriptions.push(sub);
    });

    // Add listeners to state
    this.setState({ subscriptions : subscriptions });
  }

  unSubscribeEvents(subscription) {
    subscription.remove();
  }

  componentWillUnmount() {
    this.state.subscriptions.forEach(this.unSubscribeEvents);
  }

  componentDidMount() {
    getFBCredentials.then((data)=>{
      if( !this.isMounted() ) return false;
      this.setState({ credentials : data.credentials });
    }).catch((err) =>{
      this.setState({ credentials : null });
      console.log(err);
    });
  }

  render() {
    const loginText = this.props.loginText || "Log in with Facebook";
    const logoutText = this.props.logoutText || "Log out";
    const text = this.state.credentials ? logoutText : loginText;
    return (
      <View style={this.props.style}>
        <TouchableHighlight
          style={styles.container}
          onPress={this.onPress}
        >
          <View style={styles.FBLoginButton}>
            <Image style={styles.FBLogo} source={require('../images/FB-f-Logo__white_144.png')} />
            <Text style={[styles.FBLoginButtonText, this.state.credentials ? styles.FBLoginButtonTextLoggedIn : styles.FBLoginButtonTextLoggedOut]}
                  numberOfLines={1}>{text}</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }

}

FBLoginMock.propTypes = {
  style: View.propTypes.style,
  permissions: PropTypes.array, // default: ["public_profile", "email"],
  loginText: PropTypes.string,
  logoutText: PropTypes.string,
  loginBehavior: PropTypes.number, // default: Native
  onLogin: PropTypes.func,
  onLogout: PropTypes.func,
  onLoginFound: PropTypes.func,
  onLoginNotFound: PropTypes.func,
  onError: PropTypes.func,
  onCancel: PropTypes.func,
  onPermissionsMissing: PropTypes.func
};


var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  FBLoginButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    height: 50,
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
    },
  },
  FBLoginButtonText: {
    color: 'white',
    fontWeight: '600',
    fontFamily: 'Helvetica neue',
    fontSize: 14.2,
  },
  FBLoginButtonTextLoggedIn: {
    marginLeft: 5,
  },
  FBLoginButtonTextLoggedOut: {
    marginLeft: 18,
  },
  FBLogo: {
    position: 'absolute',
    height: 14,
    width: 14,

    left: 7,
    top: 7,
  },
});
/*
var FBLoginMock = React.createClass({
  statics: {
    Events: FBLoginManager.Events,
  },

  propTypes: {
    style: View.propTypes.style,
    permissions: PropTypes.array, // default: ["public_profile", "email"]
    loginBehavior: PropTypes.number, // default: Native
    onLogin: PropTypes.func,
    onLogout: PropTypes.func,
    onLoginFound: PropTypes.func,
    onLoginNotFound: PropTypes.func,
    onError: PropTypes.func,
    onCancel: PropTypes.func,
    onPermissionsMissing: PropTypes.func,
  },

  getInitialState: function(){
    return {
      credentials: null,
      subscriptions: [],
    };
  },

  mixins: [NativeMethodsMixin],

  componentWillMount: function(){
    var _this = this;
    var subscriptions = this.state.subscriptions;

    // For each event key in FBLoginManager constantsToExport
    // Create listener and call event handler from props
    // e.g.  this.props.onError, this.props.onLogin
    Object.keys(FBLoginManager.Events).forEach(function(event){
      subscriptions.push(DeviceEventEmitter.addListener(
        FBLoginManager.Events[event],
        (eventData) => {
          // event handler defined? call it and pass along any event data
          var eventHandler = _this.props["on"+event];
          eventHandler && eventHandler(eventData);
        }
      ));
    })

    // Add listeners to state
    this.setState({ subscriptions : subscriptions });
  },

  componentWillUnmount: function(){
    var subscriptions = this.state.subscriptions;
    subscriptions.forEach(function(subscription){
      subscription.remove();
    });
  },

  componentDidMount: function(){
    var _this = this;
    FBLoginManager.getCredentials(function(error, data){
      if( !_this.isMounted() ) return;
      if (!error) {
        _this.setState({ credentials : data.credentials });
      } else {
        _this.setState({ credentials : null });
      }
    });
  },

  render: function() {
    var props = {
      ...this.props,
      style: ([styles.base, this.props.style]),
    };

    return <RCTFBLogin {...props} />
  },
});

var RCTFBLogin = requireNativeComponent('RCTFBLogin', FBLogin);

var styles = StyleSheet.create({
  base: {
    width: 500,
    height: 30,
  },
});
*/
