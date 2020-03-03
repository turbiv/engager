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

const RenderLoadProgress = ({text}) => {
  return(
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <Avatar>
        <CircularProgress/>
      </Avatar>
      <Typography component="h1" variant="h5" style={{padding: 10}}>
        {text}
      </Typography>
    </div>
  )
};

const RenderNonAuth = () => {
  return(
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <Avatar>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5" style={{padding: 10}}>
        Not authorized
      </Typography>
    </div>
  )
};

const RenderGoogleLogin = ({onSuccess, onFailure, style}) => {

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      ...style
    }}>
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
    </div>
  );
};

const SelectionContent = ({clientData}) =>{
  const [action, setAction] = useState("google_login");
  const [loggedin, setLoggedin] = useState(true);
  const [logincheck, setLoginCheck] = useState(true);

  const style = loggedin ? { display: "none" } : {};


  useEffect(() => {
    setTimeout(() => {
      if (action === "google_login" && loggedin) {
        setLoggedin(false);
        setLoginCheck(false)
      }
    }, 5000); // eslint-disable-next-line
  }, []);

  const handleResponseGoogleSuccess = response => {
    console.log("success from google");
    setAction("app");
    setAuthToken(response.tokenId);
    retrieveClientProfile();
  };

  const handleResponseGoogleFailed = response => {
    console.log("responseGoogleFailed");
    console.log(response);
    setAction("google_login");
    setAction(false);
  };

  if(logincheck) return <RenderLoadProgress text={"Loading signin"}/>;
  if (action === "google_login") return <RenderGoogleLogin
    onSuccess={handleResponseGoogleSuccess} onFailure={handleResponseGoogleFailed} style={style}/>;
  if (action === "app") {
    if (clientData.isFetching) {
      return <RenderLoadProgress text={"Loading your data"}/>
    } else {
      return clientData.error ? <RenderNonAuth/> : <TopMenu />;
    }
  }
  return null;
};

const Main = (props) =>{
  const { clientData } = props;

  return(
    <MainRenderTemplate>
      <SelectionContent clientData={clientData} setAuthToken={props.setAuthToken} retrieveClientProfile={props.retrieveClientProfile}/>
    </MainRenderTemplate>
  );
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
