import React, { Component } from "react";
import PropTypes from "prop-types";
import uuid from "uuid";

import MenuCreatorToolbar from "./MenuCreatorToolbar";
import MenuCreatorCategory from "./MenuCreatorCategory";
import * as appActions from "./reducers/app.actions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as menuactions from "./MenuCreatorActions";

import { withSnackbar } from "notistack";

class MenuCreator extends Component {
  showPublishedStatus = promise => {
    promise
      .then(() => {
        this.props.enqueueSnackbar("Profile successfully published", {
          variant: "success",
          preventDuplicate: true,
          anchorOrigin: {
            vertical: "top",
            horizontal: "right"
          }
        });
      })
      .catch(() => {
        this.props.enqueueSnackbar("Failed to publish Profile", {
          variant: "error",
          preventDuplicate: true,
          anchorOrigin: {
            vertical: "top",
            horizontal: "right"
          }
        });
      });
  };

  render() {
    const { clientData } = this.props;

    const listCategories = [];

    clientData.profile.categories.forEach(category => {
      return listCategories.push(
        <MenuCreatorCategory category={category} key={uuid.v4()} />
      );
    });

    return (
      <div>
        <MenuCreatorToolbar
          onAddItem={() => {
            menuactions.createNewCategoryWithSellable();
          }}
          onPublishToStaging={() => {
            this.showPublishedStatus(menuactions.publishToStaging(clientData));
          }}
          onPublishToProduction={() => {
            this.showPublishedStatus(
              menuactions.publishToProduction(clientData)
            );
          }}
        />
        {listCategories}
      </div>
    );
  }
}

MenuCreator.propTypes = {
  actions: PropTypes.object.isRequired,
  clientData: PropTypes.object.isRequired
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
)(withSnackbar(MenuCreator));
