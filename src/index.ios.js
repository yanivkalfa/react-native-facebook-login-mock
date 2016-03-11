import React, {
  Component,
  View,
  StyleSheet,
  Text,
  Image,
  TouchableHighlight,
  PropTypes,
  NativeModules,
  DeviceEventEmitter
} from 'react-native';

import extend from 'extend';

import { getFBCredentials, login, logout, catchError } from './util';
import defaultStyles from './theme/style';
const { FBLoginManager } = NativeModules;

export default class FBLoginMock extends Component {
  constructor(props) {
    super(props);

    this.willUnmountSoon = false;
    this.state = {
      credentials: null,
      subscriptions: [],
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
    // extending default styles with provided styles.
    const extendedStyles = extend(true, {}, defaultStyles, this.props.styleOverride);
    this.setState({styles: StyleSheet.create(extendedStyles) });

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
    const loginText = this.props.loginText || "Log in with Facebook";
    const logoutText = this.props.logoutText || "Log out";
    const text = this.state.credentials ? logoutText : loginText;
    const styles = this.state.styles;
    return (
      <View style={styles.FBLoginMock}>
        <TouchableHighlight
          style={styles.FBLoginMockButtonContainer}
          onPress={this.onPress.bind(this)}
        >
          <View style={styles.FBLoginMockButton}>
            <Image style={styles.FBLoginMockLogo} source={require('../images/FB-f-Logo__white_144.png')} />
            <Text style={[styles.FBLoginMockButtonText, this.state.credentials ? styles.FBLoginMockButtonTextLoggedIn : styles.FBLoginMockButtonTextLoggedOut]}
                  numberOfLines={1}>{text}</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

FBLoginMock.propTypes = {
  styleOverride: PropTypes.object,
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