import { Typography, TypographyProps } from "@mui/material";
import { Link } from "react-router-dom";

export function Copyright(props: TypographyProps) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link to="/" replace={true}>
        Tattoo Tattle
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
