import React from "react";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import RTL from "./RTL";

const theme = createMuiTheme({
  direction: "rtl", // Both here and <body dir="rtl">
});

export default function Direction() {
  return (
    <RTL>
      <ThemeProvider theme={theme}>
        <div dir="rtl">
          <TextField
            id="standard-basic"
            label="مزيد من المعلومات"
            multiline
            // onChange={handleChange}
            name="description"
            className="t-margin"
          />
        </div>
      </ThemeProvider>
    </RTL>
  );
}
