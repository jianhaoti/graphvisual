import React from "react";
import { usePagination } from "@mui/material";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button"; // Import Button for custom page items
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";

const List = styled("ul")({
  listStyle: "none",
  padding: 0,
  margin: 0,
  display: "flex",
});

const Ellipsis = styled("div")({
  color: "white", // Ensure the ellipses are white
  minWidth: "30px", // Keep consistent sizing with buttons
  height: "30px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  margin: "4px", // Same margin as buttons for consistency
  fontSize: "0.75rem", // Matching font size
  userSelect: "none",
});
const CustomArrowButtons = styled(Button)({
  borderRadius: "50%", // for hover
  minWidth: "3.86vh",
  height: "3.86vh",
  padding: "0",
  margin: "4px",
  display: "flex",
  color: "white",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  "&.Mui-disabled": {
    color: "white", // Keep text color white when disabled
    opacity: ".15", // Yellow background when disabled
  },
  backgroundColor: "transparent",
});

const ArrowPlaceholder = styled("div")({
  minWidth: "1vh",
  height: "3.86vh",
  padding: "0",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "transparent",
  borderRadius: "50%", // for hover
});

const CustomButton = styled(
  ({ borderColor, textColor, selectedFontWeight, arrowsOn, ...otherProps }) => (
    <Button {...otherProps} />
  )
)(({ borderColor }) => ({
  // Your styles using borderColor and other props
  borderRadius: "50%",
  minWidth: "4vh",
  minHeight: "4vh",
  padding: "0",
  margin: ".5vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  border: `.25vh solid ${borderColor}`, // Use borderColor for the border color
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  fontSize: "1.34vh",
  textTransform: "none",
}));

// Custom Pagination Component
const CustomPagination = ({
  arr,
  borderColor,
  textColor,
  selectedFontWeight,
  arrowsOn,
}) => {
  const { items } = usePagination({
    count: arr.length,
    boundaryCount: 1, // Number of always visible pages at the beginning and end
    siblingCount: 1, // Number of pages to display on each side of the current page
  });

  return (
    <nav>
      <List>
        {items.map(({ page, type, selected, ...item }, index) => {
          let children = null;

          // ellipses
          if (type === "start-ellipsis" || type === "end-ellipsis") {
            children = <Ellipsis>…</Ellipsis>; // Using styled ellipsis with white color
          }

          // node
          else if (type === "page") {
            // Use page index to access arr for label
            const nodeId = arr[page - 1];
            const label =
              nodeId.length > 3 ? nodeId.substr(nodeId.length - 3) : nodeId;
            if (nodeId !== "") {
              children = (
                <CustomButton
                  borderColor={borderColor}
                  type="button"
                  style={{
                    fontWeight: selected ? selectedFontWeight : "normal",
                    color: selected ? `${textColor}` : "white", // Styling button text in white
                  }}
                  {...item}
                >
                  {label} {/* Displaying custom label */}
                </CustomButton>
              );
            }
          } else if (type === "previous" || type === "next") {
            children =
              arrowsOn && arr.length > 1 ? (
                <CustomArrowButtons type="button" {...item}>
                  {type === "previous" ? (
                    <KeyboardArrowLeft />
                  ) : (
                    <KeyboardArrowRight />
                  )}
                </CustomArrowButtons>
              ) : (
                <ArrowPlaceholder />
              );
          }

          return <li key={index}>{children}</li>;
        })}
      </List>
    </nav>
  );
};

export default CustomPagination;
