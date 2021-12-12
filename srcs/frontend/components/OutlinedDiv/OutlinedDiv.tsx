import { TextField } from "@material-ui/core";
import React from "react";

const InputComponent = ({ inputRef, ...other }) => <div {...other} />;
export const OutlinedDiv = ({ children, label }) => (
  <TextField
    variant="outlined"
    label={label}
    multiline
    InputLabelProps={{ shrink: true }}
    InputProps={{
      inputComponent: InputComponent,
    }}
    inputProps={{ children: children }}
  />
);
