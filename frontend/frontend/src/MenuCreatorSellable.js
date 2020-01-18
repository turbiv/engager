import React, { Component } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import {
  Tabs,
  Tab,
  Card,
  Typography,
  IconButton,
  CardActions,
  Tooltip,
  Divider
} from "@material-ui/core";

import { ArrowDownward, ArrowUpward, Delete } from "@material-ui/icons";

import * as appActions from "./reducers/app.actions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as backend from "./Backend";
import * as menuactions from "./MenuCreatorActions";
import TextEditAutoSave from "./TextEditAutoSave";
import styles from "./MenuCreatorSellableStyles";
import BonusTab from "./MenuCreatorSellableBonusTab";
import PromoTab from "./MenuCreatorSellablePromoTab";
import UploadButton from "./UploadButton";
import PreviewImage from "./PreviewImage";
import ErrorBox from "./ErrorBox";

const PreviewTab = props => {
  const { classes } = props;
  const { sellable } = props;
  const { uploadHandlers } = props;

  return (
    <div className={classes.tab}>
      <div
        className={`${classes.fullCardRow} ${
          classes.previewImageLineContainer
        }`}
      >
        {!sellable.intro.path && (
          <UploadButton
            title="Upload preview image"
            onUpload={uploadHandlers.intro}
          />
        )}
        {sellable.intro.path && (
          <div className={classes.previewImageContainer}>
            <PreviewImage
              fromImage={sellable.intro.path}
              fromSize={sellable.intro.size}
              onDelete={() => {
                menuactions.removeImageFromSellable(
                  sellable,
                  sellable.intro.path,
                  "intro"
                );
              }}
            />
          </div>
        )}
      </div>
      <div className={classes.textLine}>
        <TextEditAutoSave
          initial={sellable["name"]}
          onSave={value => {
            menuactions.setSellableName(sellable, value);
          }}
          textProps={{
            label: "Menu title",
            placeholder: "Enter menu title",
            fullWidth: true,
            margin: "normal"
          }}
        />
      </div>
    </div>
  );
};

const DescriptionTab = props => {
  const { classes } = props;
  const { sellable } = props;

  return (
    <div className={classes.tab}>
      <div className={`${classes.textLine} ${classes.descriptionText}`}>
        <TextEditAutoSave
          initial={sellable["desc"]}
          onSave={value => {
            menuactions.setSellableDescription(sellable, value);
          }}
          textProps={{
            label: "Menu description",
            multiline: true,
            fullWidth: true,
            rows: 12,
            rowsMax: 12,
            margin: "normal",
            variant: "outlined"
          }}
        />
      </div>
    </div>
  );
};

const PriceTab = props => {
  const { classes } = props;
  const { sellable } = props;

  return (
    <div className={`${classes.tab}  ${classes.centerContent}`}>
      <div className={classes.fullCardRow}>
        <div className={classes.leftColumnLabel}>
          <Typography variant="h6">Selling price</Typography>
        </div>

        <div className={classes.rightColumnLabel}>
          <TextEditAutoSave
            initial={sellable.price ? sellable.price[0] : ""}
            onSave={value => {
              menuactions.setSellablePrice(sellable, value, "price", 0);
            }}
            className={classes.priceEuro}
            textProps={{
              type: "number",
              size: "small",
              label: "Euros",
              margin: "normal",
              variant: "outlined",
              InputProps: {
                className: classes.priceEuro,
                classes: {
                  root: classes.tinyEditBox
                }
              }
            }}
          />
          <TextEditAutoSave
            initial={sellable.price ? sellable.price[1] : ""}
            onSave={value => {
              menuactions.setSellablePrice(sellable, value, "price", 1);
            }}
            textProps={{
              type: "number",
              size: "small",
              label: "Cents",
              margin: "normal",
              variant: "outlined",
              InputProps: {
                classes: {
                  root: classes.tinyEditBox
                }
              }
            }}
          />
        </div>
      </div>

      <div className={classes.fullCardRow}>
        <div className={classes.leftColumnLabel}>
          <Typography variant="h6">Display old price</Typography>
        </div>

        <div className={classes.rightColumnLabel}>
          <TextEditAutoSave
            initial={sellable.oldprice ? sellable.oldprice[0] : ""}
            onSave={value => {
              menuactions.setSellablePrice(sellable, value, "oldprice", 0);
            }}
            className={classes.priceEuro}
            textProps={{
              type: "number",
              size: "small",
              label: "Euros",
              margin: "normal",
              variant: "outlined",
              InputProps: {
                className: classes.priceEuro,
                classes: {
                  root: classes.tinyEditBox
                }
              }
            }}
          />
          <TextEditAutoSave
            initial={sellable.oldprice ? sellable.oldprice[1] : ""}
            onSave={value => {
              menuactions.setSellablePrice(sellable, value, "oldprice", 1);
            }}
            textProps={{
              type: "number",
              size: "small",
              label: "Cents",
              margin: "normal",
              variant: "outlined",
              InputProps: {
                classes: {
                  root: classes.tinyEditBox
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

const SellableActions = props => {
  const { sellable } = props;
  const { category } = props;
  return (
    <div>
      <Tooltip title="Delete menu item">
        <IconButton
          onClick={() => {
            menuactions.removeSellable(category, sellable);
          }}
        >
          <Delete />
        </IconButton>
      </Tooltip>
      <Tooltip title="Move item up">
        <IconButton
          onClick={() => {
            menuactions.moveSellablePosition(category, sellable, "up");
          }}
        >
          <ArrowUpward />
        </IconButton>
      </Tooltip>
      <Tooltip
        title="Move item down"
        onClick={() => {
          menuactions.moveSellablePosition(category, sellable, "down");
        }}
      >
        <IconButton>
          <ArrowDownward />
        </IconButton>
      </Tooltip>
    </div>
  );
};

class MenuCreatorSellable extends Component {
  handleTabChange = (event, tabValue) => {
    const { sellable } = this.props;
    const { actions } = this.props;
    actions.setTabIndexForSellable(sellable, tabValue);
  };

  updateImageSize = (iuuid, what) => {
    const { sellable } = this.props;
    const img = new Image();
    img.onload = () => {
      menuactions.updateImageSize(sellable, iuuid, img.width, img.height, what);
    };
    img.src = backend.getImageUrl(iuuid);
  };

  uploadSelected = selectedFile => {
    const data = new FormData();
    data.append("image", selectedFile);
    return backend.uploadImage(selectedFile);
  };

  performUploading = (selectedFile, what) => {
    const { sellable } = this.props;

    backend.uploadImage(selectedFile, sellable._id).then(iuuid => {
      menuactions.setImageToSellable(sellable, iuuid, what);
      this.updateImageSize(iuuid, what);
    });
  };

  onUploadIntro = selectedFile => {
    this.performUploading(selectedFile, "intro");
  };

  onUploadPromo = selectedFile => {
    this.performUploading(selectedFile, "promo");
  };

  onUploadSquare = selectedFile => {
    this.performUploading(selectedFile, "square");
  };

  getSellableErrors = (sellable, errors) => {
    if (errors.sellables) {
      const myerrors = errors.sellables.find(item => {
        return item.id === sellable.id;
      });
      if (myerrors) return myerrors.errors.map(error => error.text);
    }
    return [];
  };

  render() {
    const { classes } = this.props;
    const { clientData } = this.props;
    const { sellable } = this.props;
    const tabValue =
      sellable.id in clientData.tabs ? clientData.tabs[sellable.id] : 0;
    const errors = this.getSellableErrors(sellable, clientData.errors);
    const uploadHandlers = {
      intro: this.onUploadIntro,
      promo: this.onUploadPromo,
      square: this.onUploadSquare
    };

    console.log(sellable)
    console.log("props ", this.props)

    return (
      <Card className={classes.card}>
        <Tabs value={tabValue} onChange={this.handleTabChange}>
          <Tab key={0} label="Preview" />
          <Tab key={1} label="Promo" />
          <Tab key={2} label="Description" />
          <Tab key={3} label="Price" />
          <Tab key={4} label="Bonus" />
        </Tabs>
        {tabValue === 0 && (
          <PreviewTab {...this.props} uploadHandlers={uploadHandlers} />
        )}
        {tabValue === 1 && (
          <PromoTab uploadHandlers={uploadHandlers} {...this.props} />
        )}
        {tabValue === 2 && <DescriptionTab {...this.props} />}
        {tabValue === 3 && <PriceTab {...this.props} />}
        {tabValue === 4 && <BonusTab {...this.props} />}
        <CardActions
          className={classes.sellableActionsContainer}
          disableSpacing={true}
        >
          <SellableActions {...this.props} />

          {errors.length > 0 && (
            <div className={classes.sellableErrors}>
              <Divider variant="fullWidth" />
              <ErrorBox errors={errors} />
            </div>
          )}
        </CardActions>
      </Card>
    );
  }
}

MenuCreatorSellable.propTypes = {
  onAddItem: PropTypes.func,
  classes: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    clientData: state.clientData
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(appActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(MenuCreatorSellable));
