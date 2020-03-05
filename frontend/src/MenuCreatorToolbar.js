import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";

const styles = theme => ({
  contentMenuCreator: {
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

const MenuCreatorToolbar = props => {
  const { classes } = props;

  return (
    <div className={classes.contentMenuCreator}>
      <div className={classes.menuToobar}>
        <div className={classes.menuToobarLeft}>
          <Button
            variant="outlined"
            color="primary"
            className={classes.button}
            onClick={props.onAddItem}
          >
            New category
          </Button>
        </div>
        <div>
          <Button
            variant="outlined"
            className={classes.button}
            onClick={props.onPublishToStaging}
          >
            Publish to staging
          </Button>

          <Button
            variant="outlined"
            className={classes.button}
            onClick={props.onPublishToProduction}
          >
            Publish to production
          </Button>
        </div>
      </div>
    </div>
  );
};
MenuCreatorToolbar.propTypes = {
  onAddItem: PropTypes.func,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(MenuCreatorToolbar);
