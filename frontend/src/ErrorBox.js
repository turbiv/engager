import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import classNames from "classnames";
import ErrorIcon from "@material-ui/icons/Error";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import uuid from "uuid";

const styles = theme => ({
  noItems: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.error.dark
  },
  icon: {
    fontSize: 20
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1)
  },
  message: {
    display: "flex",
    alignItems: "center"
  }
});

const ErrorBox = props => {
  const { errors, classes, ...other } = props;
  const Icon = ErrorIcon;

  console.log("errors", errors);
  const displayErrors = [];
  errors.forEach(error => {
    displayErrors.push(
      <div className={classes.message} key={uuid.v4()}>
        <Icon className={classNames(classes.icon, classes.iconVariant)} />
        {error}
      </div>
    );
  });

  return (
    <SnackbarContent
      className={classes.noItems}
      aria-describedby="client-snackbar"
      message={<span>{displayErrors}</span>}
      {...other}
    />
  );
};

export default withStyles(styles)(ErrorBox);
