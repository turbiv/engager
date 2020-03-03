import React, {useEffect, useState} from "react";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import GoogleLogin from "react-google-login";
import {setAuthToken, retrieveClientProfile} from "./reducers/app.actions";

//Login imports
import Avatar from '@material-ui/core/Avatar';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography';
import "./css/particles.css"
import {MainRenderTemplate} from "./MainTemplates"

import TopMenu from "./TopMenu";

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

const RenderGoogleLogin = ({onSuccess, onFailure, loggedin}) => {

  const style = loggedin ? { display: "none" } : {};

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
        onSuccess={onSuccess}
        onFailure={onFailure}
      />
    </MainRenderTemplate>
  );
};

const Main = (props) =>{
  const [action, setAction] = useState("google_login");
  const [loggedin, setLoggedin] = useState(true);
  const { clientData } = props;

  useEffect(() => {
    setTimeout(() => {
      if (action === "google_login" && loggedin) {
        setLoggedin(false);
      }
    }, 5000); // eslint-disable-next-line
  }, []);

  const handleResponseGoogleSuccess = response => {
    console.log("success from google");
    setAction("app");
    props.setAuthToken(response.tokenId);
    props.retrieveClientProfile();
  };

  const handleResponseGoogleFailed = response => {
    console.log("responseGoogleFailed");
    console.log(response);
    setAction("google_login");
    setAction(false);
  };

  if (action === "google_login") return <RenderGoogleLogin
    onSuccess={handleResponseGoogleSuccess} onFailure={handleResponseGoogleFailed} loggedin={loggedin}/>;
  if (action === "app") {
    if (clientData.isFetching) {
      return <RenderLoadProgress/>
    } else {
      return clientData.error ? <RenderNonAuth/> : <TopMenu />;
    }
  }
  return null;

};

Main.propTypes = {
  clientData: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return {
    clientData: state.clientData
  };
};

const mapDispatchToProps = {
  retrieveClientProfile,
  setAuthToken
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Main);
