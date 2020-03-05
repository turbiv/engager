import React, { Component } from "react";
import { Route, NavLink, HashRouter } from "react-router-dom";
import withStyles from "@material-ui/core/styles/withStyles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import MenuCreator from "./MenuCreator";
import OrdersManager from "./OrdersManager";
import GeneralInfo from "./GeneralInfo";

const styles = {
  appbarRoot: {
    flexGrow: 1
  },
  appbarTabMenu: {
    flexGrow: 1
  }
};

class TopMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabValue: this.currentTab()
    };
  }

  handleTabChange = (event, tabValue) => {
    this.setState({ tabValue });
  };

  currentTab = () => {
    //console.log("path", window.location.hash);
    if (window.location.hash === "#/") {
      return 0;
    }
    if (window.location.hash === "#/profile") {
      return 1;
    }
    if (window.location.hash === "#/orders") {
      return 2;
    }
    return 0;
  };

  render() {
    const { classes } = this.props;

    const MenuMap = [
      {
        label: "Build menu",
        pathname: "/"
      },
      {
        label: "Profile",
        pathname: "/profile"
      },
      {
        label: "Orders",
        pathname: "/orders"
      }
    ];

    return (
      <HashRouter>
        <div className={classes.appbarRoot}>
          <AppBar position="static">
            <Toolbar>
              <Tabs
                value={this.state.tabValue}
                className={classes.appbarTabMenu}
                onChange={this.handleTabChange}
              >
                {MenuMap.map((item, index) => {
                  const MyNavLink = React.forwardRef((props, ref) => (
                    // <NavLink to={item.pathname} label={item.label} />
                    <NavLink {...props} />
                  ));
                  return (
                    <Tab
                      key={index}
                      component={MyNavLink}
                      to={item.pathname}
                      label={item.label}
                    />
                  );
                })}
              </Tabs>

              <Button color="inherit">Login</Button>
            </Toolbar>
          </AppBar>
        </div>

        <div className="content">
          <Route exact path="/" component={MenuCreator} />
          <Route path="/orders" component={OrdersManager} />
          <Route path="/profile" component={GeneralInfo} />
        </div>
      </HashRouter>
    );
  }
}

export default withStyles(styles)(TopMenu);

//withRouter(props => <MyComponent {...props}/>);
