import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";

const styles = theme => ({
  contentOrders: {
    padding: "10px 10px 10px 10px"
  },

  menuToobar: {
    display: "flex",
    flexGrow: 1
  },
  menuToobarLeft: {
    flexGrow: 1
  },
  button: {
    margin: theme.spacing(1)
  }
});

const OrdersToolbar = props => {
  const { classes } = props;

  return (
    <div className={classes.contentOrders}>
      <div className={classes.menuToobar}>
        <div className={classes.menuToobarLeft}>
          <Button
            variant="outlined"
            color="primary"
            className={classes.button}
            onClick={props.onRefresh}
          >
            Refreh
          </Button>
        </div>
      </div>
    </div>
  );
};
OrdersToolbar.propTypes = {
  onRefresh: PropTypes.func,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(OrdersToolbar);
