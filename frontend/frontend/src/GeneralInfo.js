import React, { Component } from "react";
import uuid from "uuid";
import { connect } from "react-redux";
import * as backend from "./Backend";
import * as actions from "./GeneralInfoActions";
import IconButton from "@material-ui/core/IconButton";
import { Delete } from "@material-ui/icons";
import UploadButton from "./UploadButton";
import Grid from "@material-ui/core/Grid";
import TextEditAutoSave from "./TextEditAutoSave";
import PreviewImage from "./PreviewImage";

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

import withStyles from "@material-ui/core/styles/withStyles";

const styles = theme => ({
  multilineEditorGrid: {
    flexGrow: 1
  },
  deleteIcon: {
    marginLeft: "auto" // form delete, move to right
  },
  mapContainer: {
    height: 300,
    width: 300
  },
  mapImagePlaceholder: {
    height: "100%",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    boxShadow: theme.shadows[1],
    borderRadius: theme.shape.borderRadius,
    border: "1px solid"
  },
  mapImageImageContainer: {
    height: "100%",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative"
  },

  latlngSpace: {
    height: theme.spacing(2)
  }
});

const ContactInfoLine = props => {
  const { label, clientData, dataKey } = props;

  return (
    <Grid item>
      <Grid container={true} alignItems="center" justify="flex-start">
        <Grid item xs={2}>
          <Typography variant="subtitle1">{label}</Typography>
        </Grid>
        <Grid item xs={5}>
          <TextEditAutoSave
            textProps={{
              fullWidth: true,
              placeholder: label,
              label: label,
              variant: "outlined"
            }}
            initial={
              clientData.profile.info ? clientData.profile.info[dataKey] : ""
            }
            onSave={value => {
              actions.updateContactInfo(value, dataKey);
            }}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

const ContantInfo = props => {
  const { clientData } = props;
  return (
    <Grid item>
      <ExpansionPanel defaultExpanded={true}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <div>
            <Typography variant="h6">Contant info</Typography>
          </div>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Grid container={true} direction="column" spacing={2}>
            <ContactInfoLine
              label="Phone number"
              clientData={clientData}
              dataKey="phone"
            />
            <ContactInfoLine
              label="E-mail"
              clientData={clientData}
              dataKey="email"
            />
            <ContactInfoLine
              label="Facebook profile"
              clientData={clientData}
              dataKey="social"
            />
          </Grid>
        </ExpansionPanelDetails>
        <Divider />
      </ExpansionPanel>
    </Grid>
  );
};

const MultilineEditorLine = props => {
  const { classes, editLabel, element, index, dataKey } = props;

  return (
    <Grid container spacing={2}>
      <Grid item xs>
        <TextEditAutoSave
          textProps={{
            fullWidth: true,
            placeholder: editLabel,
            label: editLabel,
            variant: "outlined"
          }}
          initial={element}
          onSave={value => {
            actions.updateContactInfoListElement(value, index, dataKey);
          }}
        />
      </Grid>
      <Grid item>
        <IconButton
          className={classes.deleteIcon}
          onClick={() => {
            actions.removeContactInfoListElement(index, dataKey);
          }}
        >
          <Delete />
        </IconButton>
      </Grid>
    </Grid>
  );
};

const MultilineEditor = props => {
  const { classes, title, clientData, dataKey } = props;

  const list =
    clientData.profile.info && clientData.profile.info[dataKey]
      ? clientData.profile.info[dataKey]
      : [];

  return (
    <Grid item>
      <ExpansionPanel defaultExpanded={true}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <div>
            <Typography variant="h6">{title}</Typography>
          </div>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <div className={classes.multilineEditorGrid}>
            {list.map((element, index) => {
              return (
                <MultilineEditorLine
                  key={uuid.v4()}
                  element={element}
                  index={index}
                  {...props}
                />
              );
            })}
          </div>
        </ExpansionPanelDetails>
        <Divider />
        <ExpansionPanelActions>
          <Button
            variant="outlined"
            onClick={() => {
              actions.addContactInfoListElement(dataKey);
            }}
          >
            Add line
          </Button>
        </ExpansionPanelActions>
      </ExpansionPanel>
    </Grid>
  );
};

const LocationInfo = props => {
  const { classes, clientData } = props;
  const haveLocation = () => {
    return clientData.profile.info && clientData.profile.info.location;
  };
  const path = haveLocation() ? clientData.profile.info.location.preview : "";
  const lat = haveLocation() ? clientData.profile.info.location.lat : "";
  const lng = haveLocation() ? clientData.profile.info.location.lng : "";

  return (
    <Grid item>
      <ExpansionPanel defaultExpanded={true}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <div>
            <Typography variant="h6">Location</Typography>
          </div>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Grid container={true} spacing={2}>
            <Grid item xs={3}>
              <TextEditAutoSave
                textProps={{
                  fullWidth: true,
                  placeholder: "Longitude",
                  label: "Longitude",
                  variant: "outlined"
                }}
                initial={lat}
                onSave={value => actions.setLatLng(value, "lat")}
              />
              <div className={classes.latlngSpace} />
              <TextEditAutoSave
                textProps={{
                  fullWidth: true,
                  placeholder: "Latitude",
                  label: "Latitude",
                  variant: "outlined"
                }}
                initial={lng}
                onSave={value => actions.setLatLng(value, "lng")}
              />
            </Grid>

            <Grid item className={classes.mapContainer}>
              {!path && (
                <div className={classes.mapImagePlaceholder}>
                  <UploadButton
                    title="Upload location preview"
                    onUpload={selectedFile => {
                      backend.uploadImage(selectedFile).then(iuuid => {
                        actions.setMapImage(iuuid);
                      });
                    }}
                  />
                </div>
              )}

              {path && (
                <div className={classes.mapImageImageContainer}>
                  <PreviewImage
                    fromImage={path}
                    fromSize={{}}
                    onDelete={() => actions.removeMapImage(path)}
                  />
                </div>
              )}
            </Grid>
          </Grid>
        </ExpansionPanelDetails>
        <Divider />
      </ExpansionPanel>
    </Grid>
  );
};

class GeneralInfo extends Component {
  render() {
    const { classes } = this.props;
    const { clientData } = this.props;

    return (
      <Grid container={true} direction="column" spacing={2}>
        <ContantInfo clientData={clientData} />
        <MultilineEditor
          title="Open hours"
          editLabel="Open hours line"
          dataKey="openHours"
          {...this.props}
        />

        <MultilineEditor
          title="Address"
          editLabel="Address line"
          dataKey="address"
          {...this.props}
        />

        <LocationInfo classes={classes} clientData={clientData} />
      </Grid>
    );
  }
}

GeneralInfo.propTypes = {};

function mapStateToProps(state, ownProps) {
  return {
    clientData: state.clientData
  };
}

export default connect(mapStateToProps)(withStyles(styles)(GeneralInfo));
