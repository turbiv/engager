import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { Typography, Button } from "@material-ui/core";
import TextEditAutoSave from "./TextEditAutoSave";
import UploadButton from "./UploadButton";
import PreviewImage from "./PreviewImage";
import SwitchAutoSave from "./SwitchAutoSave";
import styles from "./MenuCreatorSellableStyles";
import * as menuactions from "./MenuCreatorActions";
import * as scheduling from "./SchedulerDialog";

class PromoTab extends Component {
  getSchedulingFormatted(promoScheduling) {
    if (promoScheduling.days.length === 0) return "Set show time";
    return scheduling.getSchedulingDisplay(promoScheduling);
  }

  render() {
    const { classes } = this.props;
    const { sellable } = this.props;
    const { uploadHandlers } = this.props;

    const promoScheduling = {
      fromTime: sellable.promo.time.time_between[0],
      toTime: sellable.promo.time.time_between[1],
      days: sellable.promo.time.days.slice(0)
    };

    return (
      <div className={`${classes.tab} ${classes.tabPromo}`}>
        <div
          className={`${classes.fullCardRow} ${
            classes.previewImageLineContainer
          }`}
        >
          <div className={classes.promoImagePlaceholder}>
            {!sellable.promo.path && (
              <UploadButton
                title="Upload promotional image"
                onUpload={uploadHandlers.promo}
              />
            )}
            {sellable.promo.path && (
              <div className={classes.previewImageContainer}>
                <PreviewImage
                  fromImage={sellable.promo.path}
                  fromSize={sellable.promo.size}
                  onDelete={() => {
                    menuactions.removeImageFromSellable(
                      sellable,
                      sellable.promo.path,
                      "promo"
                    );
                  }}
                />
              </div>
            )}
          </div>

          <div className={classes.promoImagePlaceholder}>
            {!sellable.promo.square.path && (
              <UploadButton
                title="Upload thumbnail image"
                onUpload={uploadHandlers.square}
              />
            )}
            {sellable.promo.square.path && (
              <div className={classes.previewImageContainer}>
                <PreviewImage
                  fromImage={sellable.promo.square.path}
                  fromSize={sellable.promo.square.size}
                  onDelete={() => {
                    menuactions.removeImageFromSellable(
                      sellable,
                      sellable.promo.square.path,
                      "square"
                    );
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div className={`${classes.fullCardRow} ${classes.prmotionRow} `}>
          <div className={classes.leftPrmotionScheduling}>
            <Typography variant="subtitle1">Promotion scheduling</Typography>
          </div>
          <div>
            <scheduling.SchedulerDialog
              request={promoScheduling}
              ref={dialog => (this.refSchedulerDialog = dialog)}
              onSave={scheduling => {
                menuactions.updateSellablePromo(
                  sellable,
                  "scheduling",
                  scheduling
                );
              }}
            />

            <Button
              variant="outlined"
              classes={{ label: classes.bonusSchedulerButton }}
              onClick={() => {
                this.refSchedulerDialog.setState({ open: true });
              }}
            >
              {this.getSchedulingFormatted(promoScheduling)}
            </Button>
          </div>
        </div>

        <div className={`${classes.fullCardRow} ${classes.prmotionRow} `}>
          <div className={classes.leftPrmotionScheduling}>
            <Typography variant="subtitle1">Push promo to client</Typography>
          </div>
          <div className={classes.rightPrmotionScheduling}>
            <SwitchAutoSave
              initial={sellable.promo.push}
              onSave={value => {
                menuactions.updateSellablePromo(sellable, "push", value);
              }}
            />
            {sellable.promo.push && (
              <TextEditAutoSave
                textProps={{
                  className: classes.promoMessageText,
                  placeholder: "message to show"
                }}
                initial={sellable.promo.message}
                tooltip="Message shown in mobile notification"
                onSave={value => {
                  menuactions.updateSellablePromo(sellable, "message", value);
                }}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(PromoTab);
