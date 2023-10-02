import { Box } from "@mui/material";
import { serverLink } from "utils";

const UserImage = ({ image, size = "60px" }) => {
  return (
    <Box width={size} height={size}>
      <img
        style={{ objectFit: "cover", borderRadius: "50%" }}
        width={size}
        height={size}
        alt="user"
        src={`${serverLink}/assets/${image}`}
      />
    </Box>
  );
};

export default UserImage;
