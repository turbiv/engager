import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import {
  Typography,
  Button,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Divider,
  ExpansionPanelActions
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import TextEditAutoSave from "./TextEditAutoSave";
import SelectAutoSave from "./SelectAutoSave";
import * as scheduling from "./SchedulerDialog";

import styles from "./MenuCreatorSellableStyles";
import * as menuactions from "./MenuCreatorActions";

class BonusTypeSelectorEntry extends Component {
  constructor(props) {
    super(props);
    this.refSchedulerDialog = React.createRef();
  }
  state = {
    type: ""
  };
  handleChange = event => {
    this.setState({ type: event.target.value });
  };

  getSchedulingFormatted(bonusScheduling) {
    if (bonusScheduling.days.length === 0) return "Set show time";
    return scheduling.getSchedulingDisplay(bonusScheduling);
  }

  render() {
    const { classes } = this.props;
    const { sellable } = this.props;
    const { bonus } = this.props;

    const styleShowTotal =
      bonus.interest_type === "total" ? {} : { display: "none" };
    const styleShowPercent =
      bonus.interest_type === "percent" ? {} : { display: "none" };
    const bonusScheduling = {
      fromTime: bonus.time.time_between[0],
      toTime: bonus.time.time_between[1],
      days: bonus.time.days.slice(0)
    };

    return (
      <div className={classes.bonusCell}>
        <scheduling.SchedulerDialog
          request={bonusScheduling}
          ref={dialog => (this.refSchedulerDialog = dialog)}
          onSave={scheduling => {
            menuactions.updateSellableBonus(
              sellable,
              bonus,
              "scheduling",
              scheduling
            );
          }}
        />
        <div className={`${classes.fullCardRow}  ${classes.bonusRow}`}>
          <div className={classes.leftColumnLabel}>
            <Typography variant="subtitle1">Bonus type</Typography>
          </div>
          <div className={classes.rightColumnLabel}>
            <SelectAutoSave
              className={classes.bonusTypeSelector}
              items={[
                { value: "happy_hour", data: "Happy hours" },
                { value: "order_two_or_more", data: "Buy two or more" }
              ]}
              initial={bonus.condition}
              label="Bonus type"
              onSave={value => {
                menuactions.updateSellableBonus(
                  sellable,
                  bonus,
                  "condition",
                  value
                );
              }}
            />
          </div>
        </div>
        <div className={`${classes.fullCardRow}  ${classes.bonusRow}`}>
          <div className={classes.leftColumnLabel}>
            <Typography variant="subtitle1">Visual appearence</Typography>
          </div>
          <div className={classes.rightColumnLabel}>
            <TextEditAutoSave
              textProps={{
                className: classes.bonusTextLabel,
                placeholder: "Short label"
              }}
              initial={bonus.display.small.text}
              tooltip="Text in center of bonus medalion"
              onSave={value => {
                menuactions.updateSellableBonus(
                  sellable,
                  bonus,
                  "short_text",
                  value
                );
              }}
            />
            <TextEditAutoSave
              textProps={{
                placeholder: "Long label",
                className: classes.bonusTextLabelLong
              }}
              initial={bonus.display.big.subtext}
              tooltip="Text around bonus medalion"
              onSave={value => {
                menuactions.updateSellableBonus(
                  sellable,
                  bonus,
                  "long_text",
                  value
                );
              }}
            />
          </div>
        </div>

        <div className={`${classes.fullCardRow}  ${classes.bonusRow}`}>
          <div className={classes.leftColumnLabel}>
            <Typography variant="subtitle1">Discount method</Typography>
          </div>
          <div className={classes.rightColumnLabel}>
            <SelectAutoSave
              className={classes.bonusTypeSelector}
              items={[
                { value: "percent", data: "Percent" },
                { value: "total", data: "Fixed" }
              ]}
              initial={bonus.interest_type}
              label="Discount"
              onSave={value => {
                menuactions.updateSellableBonus(
                  sellable,
                  bonus,
                  "interest_type",
                  value
                );
              }}
            />
          </div>

          <TextEditAutoSave
            initial={bonus.interest.total[0]}
            onSave={value => {
              menuactions.updateSellableBonus(
                sellable,
                bonus,
                "interest_e",
                value
              );
            }}
            className={classes.priceEuro}
            textProps={{
              style: styleShowTotal,
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
            initial={bonus.interest.total[1]}
            onSave={value => {
              menuactions.updateSellableBonus(
                sellable,
                bonus,
                "interest_c",
                value
              );
            }}
            className={classes.priceEuro}
            textProps={{
              style: styleShowTotal,
              type: "number",
              size: "small",
              label: "Cents",
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
            initial={bonus.interest.percent}
            onSave={value => {
              menuactions.updateSellableBonus(
                sellable,
                bonus,
                "percent",
                value
              );
            }}
            className={classes.priceEuro}
            textProps={{
              style: styleShowPercent,
              type: "number",
              size: "small",
              label: "Percent",
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
        </div>
        <div className={`${classes.fullCardRow}  ${classes.bonusRow}`}>
          <div className={classes.leftColumnLabel}>
            <Typography variant="subtitle1">Bonus scheduling</Typography>
          </div>
          <div className={classes.rightColumnLabel}>
            <Button
              variant="outlined"
              classes={{ label: classes.bonusSchedulerButton }}
              onClick={() => {
                this.refSchedulerDialog.setState({ open: true });
              }}
            >
              {this.getSchedulingFormatted(bonusScheduling)}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

const bonusExpansionPanelStyles = theme => ({
  panel: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1 / 2),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  bonusExpansionPanelDetails: {
    padding: 0
  },
  bonusPanelHeader: {
    flexBasis: "33.33%"
  },

  bonusExpansionPanelSummary: {
    margin: "0px",
    "&$expanded": {
      margin: "0px"
    }
  },
  expanded: {}
});

class BonusPanelBase extends Component {
  render() {
    const { classes } = this.props;
    const { mainClasses } = this.props;
    const { expanded, onChange } = this.props;
    const { sellable } = this.props;
    const { bonus } = this.props;

    return (
      <ExpansionPanel
        className={classes.panel}
        expanded={expanded}
        onChange={onChange}
      >
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          classes={{
            content: classes.bonusExpansionPanelSummary,
            expanded: classes.expanded,
            root: classes.bonusExpansionPanelSummary
          }}
        >
          <div className={classes.bonusPanelHeader}>
            <Typography variant="subtitle1">Bonus details</Typography>
          </div>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails
          classes={{ root: classes.bonusExpansionPanelDetails }}
        >
          <BonusTypeSelectorEntry
            classes={mainClasses}
            bonus={bonus}
            sellable={sellable}
          />
        </ExpansionPanelDetails>
        <Divider />
        <ExpansionPanelActions>
          <Button
            size="small"
            onClick={() => {
              menuactions.removeSellableBonus(sellable, bonus);
            }}
          >
            Delete
          </Button>
        </ExpansionPanelActions>
      </ExpansionPanel>
    );
  }
}

const BonusPanel = withStyles(bonusExpansionPanelStyles)(BonusPanelBase);

class BonusTab extends Component {
  state = {
    expanded: "bonus0"
  };

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false
    });
  };
  render() {
    const { classes } = this.props;
    const { sellable } = this.props;
    const { expanded } = this.state;

    const bonuses = sellable.bonuses ? sellable.bonuses : [];

    return (
      <div className={`${classes.tab}   ${classes.bonusTab}`}>
        {bonuses.map((bonus, index) => {
          return (
            <BonusPanel
              bonus={bonus}
              key={bonus.id}
              sellable={sellable}
              mainClasses={classes}
              expanded={expanded === "bonus" + index}
              onChange={this.handleChange("bonus" + index)}
            />
          );
        })}

        <div
          className={`${classes.fullCardRow}  ${classes.centerContent} ${
            classes.bonusAddButtonRow
          }`}
        >
          <Button
            className={classes.bonusAddButton}
            color="primary"
            variant="outlined"
            onClick={() => {
              menuactions.setSellableNewBonus(sellable);
            }}
          >
            Add bonus
          </Button>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(BonusTab);
