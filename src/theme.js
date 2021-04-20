import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

const Theme = (props) => {
  const theme = createMuiTheme({
    direction: "rtl", // Both here and <body dir="rtl">
    // palette: {
    //   primary: {
    //     main: "#e53935",
    //     dark: "#ab000d",
    //   },
    // },
  });

  return (
    <ThemeProvider theme={theme} children={props.children}></ThemeProvider>
  );
};

export default Theme;
