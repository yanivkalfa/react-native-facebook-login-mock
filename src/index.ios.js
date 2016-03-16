import React, {
  Component,
  View,
  Text,
  TouchableHighlight,
  PropTypes,
  NativeModules,
  DeviceEventEmitter
} from 'react-native';

const Icon = require('react-native-vector-icons/FontAwesome');

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

  prepareStyle(){
    const { style ={} } = this.props;
    const FBLMText = style.FBLMText || styles.FBLMText;
    const FBLMTextLoggedIn = style.FBLMTextLoggedIn || styles.FBLMTextLoggedIn;
    const FBLMTextLoggedOut = style.FBLMTextLoggedOut || styles.FBLMTextLoggedOut;

    return {
      FBLMButton: style.FBLMButton || styles.FBLMButton,
      FBLMButtonContent: style.FBLMButtonContent || styles.FBLMButtonContent,
      FBLMIconWrap: style.FBLMIconWrap || styles.FBLMIconWrap,
      FBLMIcon: style.FBLMIcon || styles.FBLMIcon,
      FBLMTextWrap: style.FBLMTextWrap || styles.FBLMTextWrap,
      FBLMText: [FBLMText, this.state.credentials ? FBLMTextLoggedIn : FBLMTextLoggedOut],
    }
  }

  render() {
    const { loginText = "Log in with Facebook", logoutText = "Log out"} = this.props;
    const text = this.state.credentials ? logoutText : loginText;
    const { FBLMButton, FBLMButtonContent, FBLMIconWrap, FBLMIcon, FBLMTextWrap, FBLMText} = this.prepareStyle();
    return (
      <TouchableHighlight style={ FBLMButton } onPress={this.onPress.bind(this)}>
        <View style={FBLMButtonContent}>
          <View style={ FBLMIconWrap }>
            <Icon name="facebook" style={ FBLMIcon }/>
          </View>
          <View style={ FBLMTextWrap }>
            <Text style={FBLMText} numberOfLines={1}>{text}</Text>
          </View>
          <View style={ FBLMIconWrap }></View>
        </View>
      </TouchableHighlight>
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