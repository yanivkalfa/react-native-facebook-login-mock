import React, {
  Component,
  View,
  Text,
  Image,
  TouchableHighlight,
  PropTypes,
  NativeModules,
  DeviceEventEmitter
} from 'react-native';

import extend from 'extend';

import { getFBCredentials, login, logout, catchError } from './util';
import styles from './theme/style';
const { FBLoginManager } = NativeModules;

export default class FBLoginMock extends Component {
  constructor(props) {
    super(props);

    this.willUnmountSoon = false;

    this.state = {
      credentials: null,
      subscriptions: []
    };
  }

  handleLogin(){
    login(this.props.permissions || null).then((data) => {
      if (!this.willUnmountSoon) this.setState({ credentials : data.credentials });
    }).catch((err) => {
      if (!this.willUnmountSoon) this.setState({ credentials : null });
    })
  }

  handleLogout(){
    logout().then((data) => {
      if (!this.willUnmountSoon) this.setState({ credentials : null });
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
    if (typeof eventHandler === 'function') eventHandler(eventData);
  }

  componentWillMount() {
    this.willUnmountSoon = false;

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
    this.willUnmountSoon = true;
    this.state.subscriptions.forEach(this.unSubscribeEvents);

  }

  componentDidMount() {
    getFBCredentials().then((data)=>{
      this.setState({ credentials : data.credentials });
    }).catch((err) =>{
      this.setState({ credentials : null });
      console.log('Request failed: ', err);
    });

  }

  render() {
    const { loginText = "Log in with Facebook", logoutText = "Log out", style } = this.props;
    const text = this.state.credentials ? logoutText : loginText;

    const FBLoginMockButtonText = style.FBLoginMockButtonText || styles.FBLoginMockButtonText;
    const FBLoginMockButtonTextLoggedIn = style.FBLoginMockButtonTextLoggedIn || styles.FBLoginMockButtonTextLoggedIn;
    const FBLoginMockButtonTextLoggedOut = style.FBLoginMockButtonTextLoggedOut || styles.FBLoginMockButtonTextLoggedOut;
    return (
      <View style={ style.FBLoginMock || styles.FBLoginMock }>
        <TouchableHighlight
          style={ style.FBLoginMockButtonContainer || styles.FBLoginMockButtonContainer }
          onPress={this.onPress.bind(this)}
        >
          <View style={ style.FBLoginMockButton || styles.FBLoginMockButton }>
            <Image style={ style.FBLoginMockLogo || styles.FBLoginMockLogo} source={require('../images/FB-f-Logo__white_144.png')} />
            <Text style={[FBLoginMockButtonText, this.state.credentials ? FBLoginMockButtonTextLoggedIn : FBLoginMockButtonTextLoggedOut]}
                  numberOfLines={1}>{text}</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

FBLoginMock.propTypes = {
  style: PropTypes.object,
  permissions: PropTypes.array, // default: ["public_profile", "email"],
  loginText: PropTypes.string,
  logoutText: PropTypes.string,
  loginBehavior: PropTypes.number, // default: Native
  onPress: PropTypes.func,
  onLogin: PropTypes.func,
  onLogout: PropTypes.func,
  onLoginFound: PropTypes.func,
  onLoginNotFound: PropTypes.func,
  onError: PropTypes.func,
  onCancel: PropTypes.func,
  onPermissionsMissing: PropTypes.func
};