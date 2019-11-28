import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Fab from "@material-ui/core/Fab";
import { ArrowDownward, ArrowUpward, Add, Delete } from "@material-ui/icons";

import * as appActions from "./reducers/app.actions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import uuid from "uuid";
import * as menuactions from "./MenuCreatorActions";

import PropTypes from "prop-types";
import MenuCreatorSellable from "./MenuCreatorSellable";
import TextEditAutoSave from "./TextEditAutoSave";
import ErrorBox from "./ErrorBox";

const styles = theme => ({
  card: {
    display: "flex",
    flexDirection: "column",
    marginTop: 30,
    marginLeft: 5,
    marginRight: 5
  },
  cardHeader: {
    backgroundColor: "#eeeeee"
  },

  categoryHeaderControls: {
    display: "flex",
    alignItems: "center"
  },
  categoryDelete: {
    marginLeft: "auto" // form delete, move to right
  },
  categoryAdd: {
    marginLeft: theme.spacing(4)
  },

  addIcon: {
    marginRight: theme.spacing(1)
  },
  editBox: {
    backgroundColor: "white"
  },

  editBoxError: {
    backgroundColor: theme.palette.error.dark,
    color: "white"
  },

  editBoxLabelError: {
    color: "white"
  },

  noItemsContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  }
});

const getCategoryErrors = (category, errors) => {
  if (errors.categories) {
    const myerrors = errors.categories.find(item => {
      return item.id === category.id;
    });
    return myerrors ? myerrors.errors : [];
  }
  return [];
};

const haveUnnamedCat = errors => {
  return errors.find(error => {
    return error.type === "no-cat-name";
  });
};
const HeaderControls = props => {
  const { classes } = props;
  const { category } = props;
  const { clientData } = props;

  const errors = getCategoryErrors(category, clientData.errors);
  const isUnNamed = haveUnnamedCat(errors);

  return (
    <div className={classes.categoryHeaderControls}>
      <TextEditAutoSave
        tooltip="Set category name"
        textProps={{
          placeholder: "Category name",
          label: "Category name",
          variant: "outlined",
          InputLabelProps: {
            className: isUnNamed ? classes.editBoxLabelError : null
          },
          InputProps: {
            className: isUnNamed ? classes.editBoxError : classes.editBox
          }
        }}
        initial={category["name"]}
        onSave={value => {
          menuactions.setCategoryName(category, value);
        }}
      />

      <Tooltip title="Add menu to category">
        <Fab
          variant="extended"
          size="medium"
          color="primary"
          className={classes.categoryAdd}
          onClick={() => {
            menuactions.addNewSellableToCategory(category);
          }}
        >
          <Add className={classes.addIcon} />
          Add menu
        </Fab>
      </Tooltip>

      <Tooltip title="Delete this category">
        <IconButton
          className={classes.categoryDelete}
          onClick={() => {
            menuactions.removeCategory(category);
          }}
        >
          <Delete />
        </IconButton>
      </Tooltip>
      <Tooltip title="Move category up">
        <IconButton>
          <ArrowUpward />
        </IconButton>
      </Tooltip>
      <Tooltip title="Move category down">
        <IconButton>
          <ArrowDownward />
        </IconButton>
      </Tooltip>
    </div>
  );
};

class MenuCreatorCategory extends Component {
  render() {
    const { classes } = this.props;
    const { category } = this.props;

    const sellableList = [];
    category.sellables.forEach(sellable => {
      sellableList.push(
        <MenuCreatorSellable
          sellable={sellable}
          category={category}
          key={uuid.v4()}
        />
      );
    });

    return (
      <Card className={classes.card}>
        <CardHeader
          className={classes.cardHeader}
          title={<HeaderControls {...this.props} />}
        />
        <CardContent>
          {sellableList}
          {sellableList.length === 0 && (
            <div className={classes.noItemsContainer}>
              <ErrorBox
                errors={["Category is empty, add at least one menu item"]}
              />
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
}

MenuCreatorCategory.propTypes = {
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
)(withStyles(styles)(MenuCreatorCategory));
