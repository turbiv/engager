import React, { Component } from "react";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import GoogleLogin from "react-google-login";
import * as appActions from "./reducers/app.actions";

//Login imports
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Particles from 'react-particles-js';
import "./css/particles.css"

import TopMenu from "./TopMenu";

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      action: "google_login",
      loggedin: true // assume logged
    };
    // ugly way to show google button if user is not logged in
    setTimeout(() => {
      if (this.state.action === "google_login" && this.state.loggedin) {
        this.setState({
          action: "google_login",
          loggedin: false
        });
      }
    }, 5000);
  }

  responseGoogleFailed = response => {
    console.log("responseGoogleFailed");
    console.log(response);
    this.setState({
      action: "google_login",
      loggedin: false
    });
  };

  responseGoogleSuccess = response => {
    console.log("success from google");
    this.setState({ action: "app" });
    this.props.actions.setAuthToken(response.tokenId);
    this.props.actions.retrieveClientProfile();
  };

  renderLoadProgress() {
    return <div>Loading your data</div>;
  }

  renderNonAuth() {
    return <div>Not authorized</div>;
  }

  renderAppRouter() {
    return <TopMenu />;
  }

  renderGoogleLogin() {
    const style = this.state.loggedin ? { display: "none" } : {};

    return (
      <div>
        <Particles className={"size"} params={{
          "particles": {
            "number": {
              "value": 80,
              "density": {
                "enable": true,
                "value_area": 700
              }
            },
            "shape": {
              "polygon": {
                "nb_sides": 5
              },
            },
            "size": {
              "value": 3,
              "random": true,
              "anim": {
                "enable": false,
                "speed": 10,
                "size_min": 0.1,
                "sync": false
              }
            },
            "move": {
              "enable": true,
              "speed": 2,
              "direction": "none",
              "out_mode": "out",
              "attract": {
                "enable": false,
                "rotateX": 600,
                "rotateY": 1200
              }
            }
          },
          "interactivity": {
            "detect_on": "canvas",
            "events": {
              "onhover": {
                "enable": true,
                "mode": "grab"
              },
              "onclick": {
                "enable": true,
                "mode": "push"
              },
              "resize": true
            },
            "modes": {
              "grab": {
                "distance": 140,
                "line_linked": {
                  "opacity": 1
                }
              }
            }
          }
        }}
        style={{
          background: "#606c88",
        }}/>
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
            <CssBaseline />
            <Paper elevation={2}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: 20
              }}>
                <Avatar>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5" style={{padding: 10}}>
                  Sign in
                </Typography>
                <GoogleLogin
                  style={{padding: 10}}
                  clientId="922637484566-v5444u8s19lvt81d1vu07kgt3njtemo5.apps.googleusercontent.com"
                  buttonText="LOGIN WITH GOOGLE"
                  isSignedIn={true}
                  onSuccess={this.responseGoogleSuccess}
                  onFailure={this.responseGoogleFailed}
                />
              </div>
            </Paper>
          </div>
        </div>
    );
  }

  render() {
    const { clientData } = this.props;
    if (this.state.action === "google_login") return this.renderGoogleLogin();
    if (this.state.action === "app") {
      if (clientData.isFetching) {
        return this.renderLoadProgress();
      } else {
        return clientData.error ? this.renderNonAuth() : this.renderAppRouter();
      }
    }
    return null;
  }
}

Main.propTypes = {
  actions: PropTypes.object.isRequired,
  clientData: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    clientData: state.clientData
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(appActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Main);
