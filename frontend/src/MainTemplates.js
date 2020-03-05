import React from "react"
import Particles from "react-particles-js";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";

export const MainRenderTemplate = ({children, style}) =>{
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
            "speed": 1,
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
         background: "#606c88"
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
        <Paper style={{padding: 30, paddingTop: 50, paddingBottom: 40}} elevation={3}>
            {children}
        </Paper>
      </div>
    </div>
  )
};

/*
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
 */