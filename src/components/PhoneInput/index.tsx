import React from "react";
import { TextField } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";

const PhoneInputComponent = (props: any, ref: React.Ref<HTMLInputElement>) => {
  return (
    <TextField
      id="outlined-basic"
      label="Phone"
      inputRef={ref}
      variant="outlined"
      fullWidth
      InputProps={{
        endAdornment: <PhoneIcon />,
      }}
      {...props}
    />
  );
};

export default React.forwardRef(PhoneInputComponent);
