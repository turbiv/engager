import React, { Component } from "react";
import { Select, MenuItem, InputLabel, FormControl } from "@material-ui/core";
import uuid from "uuid";

class SelectAutoSave extends Component {
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
    const value = event.target.value;
    this.setState({ value });

    if (initial !== value) onSave(value);
  };

  render() {
    const { items } = this.props;
    const { className, label } = this.props;

    return (
      <FormControl className={className}>
        <InputLabel htmlFor="select">{label}</InputLabel>
        <Select
          value={this.state.value}
          onChange={this.handleChange}
          inputProps={{
            name: "select"
          }}
        >
          {items.map(item => {
            return (
              <MenuItem key={uuid.v4()} value={item.value}>
                {item.data}
              </MenuItem>
            );
          })}
          ;
        </Select>
      </FormControl>
    );
  }
}
export default SelectAutoSave;
