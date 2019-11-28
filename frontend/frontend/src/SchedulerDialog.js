import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import TextEditAutoSave from "./TextEditAutoSave";
import Days from "./constants/Days";
import moment from "moment/moment.js";
import uuid from "uuid";

const DialogTitle = withStyles(theme => ({
  root: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing(2)
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
}))(props => {
  const { children, classes, onClose } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="Close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const styles = theme => ({
  content: {
    display: "flex",
    flexDirection: "column"
  },
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  dayCell: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  timePicker: {
    width: 150,
    marginLeft: theme.spacing(1)
  }
});

class CheckboxAutoSave extends Component {
  constructor(props) {
    super(props);
    const { initial } = this.props;
    this.state = {
      value: initial === undefined ? "" : initial
    };
  }

  handleChange = event => {
    const { initial } = this.props;
    const { onSave } = this.props;
    const value = event.target.checked;
    this.setState({ value });

    if (initial !== value) onSave(value);
  };

  render() {
    return (
      <Checkbox
        color="primary"
        checked={this.state.value}
        onChange={this.handleChange}
      />
    );
  }
}

class DialogContentBase extends React.Component {
  constructor(props) {
    super(props);
    this.save = () => {
      console.log("save");
    };
  }

  render() {
    const { classes } = this.props;
    const { onSave } = this.props;
    const { request } = this.props;

    return (
      <div>
        <MuiDialogContent>
          <div className={classes.row}>
            {Days.map(day => {
              return (
                <div className={classes.dayCell} key={uuid.v4()}>
                  <div>{day.name}</div>
                  <div>
                    <CheckboxAutoSave
                      color="primary"
                      initial={
                        request.days.find(d => {
                          return d === day.index;
                        }) === day.index
                      }
                      onSave={value => {
                        //request.days
                        if (value) request.days.push(day.index);
                        else
                          request.days = request.days.filter(d => {
                            return d !== day.index;
                          });
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className={classes.row}>
            <TextEditAutoSave
              initial={request.fromTime}
              textProps={{
                label: "From time",
                type: "time",
                className: classes.timePicker,
                InputLabelProps: {
                  shrink: true
                },
                inputProps: {
                  step: 300 // 5 min
                }
              }}
              onSave={value => {
                request.fromTime = value;
              }}
            />
            <TextEditAutoSave
              initial={request.toTime}
              textProps={{
                label: "To time",
                type: "time",
                className: classes.timePicker,
                InputLabelProps: {
                  shrink: true
                },
                inputProps: {
                  step: 300 // 5 min
                }
              }}
              onSave={value => {
                request.toTime = value;
              }}
            />
          </div>
        </MuiDialogContent>
        <MuiDialogActions>
          <Button
            onClick={() => {
              onSave(request);
            }}
            color="primary"
          >
            OK
          </Button>
        </MuiDialogActions>
      </div>
    );
  }
}

const DialogContent = withStyles(styles)(DialogContentBase);

export class SchedulerDialog extends React.Component {
  state = {
    open: false
  };

  handleClickOpen = () => {
    this.setState({
      open: true
    });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { request } = this.props;
    const { onSave } = this.props;
    return (
      <Dialog
        onClose={this.handleClose}
        aria-labelledby="customized-dialog-title"
        open={this.state.open}
      >
        <DialogTitle id="customized-dialog-title" onClose={this.handleClose}>
          Schedule appearence
        </DialogTitle>
        <DialogContent
          request={request}
          onSave={scheduling => {
            onSave(scheduling);
            this.handleClose();
          }}
          onClose={this.handleClose}
        />
      </Dialog>
    );
  }
}

export const getSchedulingDisplay = schedule => {
  const selectedDays = Days.filter(day => {
    return (
      schedule.days.find(bday => {
        return bday === day.index;
      }) === day.index
    );
  });
  const shortDays = selectedDays.map(day => day.name);
  let title = shortDays.join(",");

  const fromTime = moment(schedule.fromTime, "HH:mm");
  const toTime = moment(schedule.toTime, "HH:mm");
  title += " ";
  title += fromTime.isValid() ? fromTime.format("LT") : "?";
  title += " - ";
  title += toTime.isValid() ? toTime.format("LT") : "?";

  return title;
};
