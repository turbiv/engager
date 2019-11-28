import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";

export default class TextEditAutoSave extends Component {
  constructor(props) {
    super(props);
    const { initial } = this.props;
    this.state = {
      value: initial === undefined ? "" : initial
    };
  }

  render() {
    const { onSave, textProps, tooltip } = this.props;
    const isNumber = textProps.type === "number";
    return (
      <Tooltip title={tooltip ? tooltip : ""}>
        <TextField
          value={this.state.value}
          onBlur={e => {
            const { initial } = this.props;
            if (initial !== this.state.value) {
              onSave(isNumber ? parseInt(this.state.value) : this.state.value);
            }
          }}
          onChange={e => {
            const value = e.target.value;
            this.setState({ value });
          }}
          {...textProps}
        />
      </Tooltip>
    );
  }
}
