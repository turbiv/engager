import React, { Component } from "react";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import GoogleLogin from "react-google-login";
import * as appActions from "./reducers/app.actions";

//Login imports
import Avatar from '@material-ui/core/Avatar';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography';
import "./css/particles.css"
import {MainRenderTemplate} from "./MainTemplates"

import TopMenu from "./TopMenu";

const ResponseGoogleFailed = response => {
  console.log("responseGoogleFailed");
  console.log(response);
  this.setState({
    action: "google_login",
    loggedin: false
  });
};

const ResponseGoogleSuccess = response => {
  console.log("success from google");
  this.setState({ action: "app" });
  this.props.actions.setAuthToken(response.tokenId);
  this.props.actions.retrieveClientProfile();
};

const RenderLoadProgress = () => {
  return(
    <MainRenderTemplate>
      <Avatar>
        <CircularProgress/>
      </Avatar>
      <Typography component="h1" variant="h5" style={{padding: 10}}>
        Loading your data
      </Typography>
    </MainRenderTemplate>
  )
};

const RenderNonAuth = () => {
  return(
    <MainRenderTemplate>
      <Avatar>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5" style={{padding: 10}}>
        Not authorized
      </Typography>
    </MainRenderTemplate>
  )
};

const RenderAppRouter = () => {
  return <TopMenu />;
};

const RenderGoogleLogin = () => {
  const style = this.state.loggedin ? { display: "none" } : {};

  return (
    <MainRenderTemplate style={style}>
      <Avatar>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5" style={{padding: 10}}>
        Sign in
      </Typography>
      <GoogleLogin
        clientId="922637484566-v5444u8s19lvt81d1vu07kgt3njtemo5.apps.googleusercontent.com"
        buttonText="LOGIN WITH GOOGLE"
        isSignedIn={true}
        onSuccess={this.responseGoogleSuccess}
        onFailure={this.responseGoogleFailed}
      />
    </MainRenderTemplate>
  );
}

const Main = () =>{
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
