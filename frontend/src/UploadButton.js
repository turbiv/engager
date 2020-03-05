import React from "react";
import { Button } from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";

const styles = theme => ({
  hideUpload: {
    position: "absolute",
    top: -100000
  }
});

const UploadButton = props => {
  const { classes } = props;
  let inputElement = null;
  return (
    <div>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => {
          inputElement.click();
        }}
      >
        {props.title}
      </Button>
      <input
        type="file"
        accept="image/*"
        ref={input => (inputElement = input)}
        onChange={event => {
          props.onUpload(event.target.files[0]);
        }}
        className={classes.hideUpload}
      />
    </div>
  );
};

export default withStyles(styles)(UploadButton);
