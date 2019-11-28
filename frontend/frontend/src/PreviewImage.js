import React from "react";
import { IconButton, Tooltip, Typography } from "@material-ui/core";
import * as backend from "./Backend";
import { withStyles } from "@material-ui/core/styles";

import { Delete } from "@material-ui/icons";

const styles = theme => ({
  previewImageDelete: {
    position: "absolute",
    top: 0,
    right: theme.spacing(1)
  },
  previewImageSize: {
    position: "absolute",
    bottom: theme.spacing(1),
    right: theme.spacing(2)
  },

  previewImage: {
    objectFit: "contain",
    height: "100%"
  },
  container: {
    height: "100%",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative"
  }
});

const PreviewImage = props => {
  const { classes } = props;
  const { onDelete } = props;
  const { fromImage } = props;
  const { fromSize } = props;

  return (
    <div className={classes.container}>
      <img
        alt=""
        src={backend.getImageUrl(fromImage)}
        className={classes.previewImage}
      />
      <div className={classes.previewImageDelete}>
        <Tooltip title="Remove image">
          <IconButton aria-label="Remove image" onClick={onDelete}>
            <Delete />
          </IconButton>
        </Tooltip>
      </div>
      {"h" in fromSize && (
        <div className={classes.previewImageSize}>
          <Typography variant="subtitle1">
            width={fromSize.w}, height={fromSize.h}
          </Typography>
        </div>
      )}
    </div>
  );
};

export default withStyles(styles)(PreviewImage);
