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
  minWidth: "30px",
  height: "30px",
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
});
const CustomButton = styled(Button)(() => ({
  borderRadius: "50%", // Keep it circular
  minWidth: "30px",
  height: "30px",
  padding: "0",
  margin: "4px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  border: "1.5px solid #DB380F", // Conditional border color
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  color: "white",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  fontSize: "0.65rem",
  textTransform: "none",
}));

// Custom Pagination Component
const CustomPagination = ({ arr }) => {
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
            children = (
              <CustomButton
                type="button"
                style={{
                  fontWeight: selected ? "bold" : "normal",
                  color: selected ? "#DB380F" : "white", // Styling button text in white
                }}
                {...item}
              >
                {label} {/* Displaying custom label */}
              </CustomButton>
            );
          } else if (type === "previous" || type === "next") {
            children = (
              <CustomArrowButtons type="button" {...item}>
                {type === "previous" ? (
                  <KeyboardArrowLeft />
                ) : (
                  <KeyboardArrowRight />
                )}
              </CustomArrowButtons>
            );
          }

          return <li key={index}>{children}</li>;
        })}
      </List>
    </nav>
  );
};

export default CustomPagination;
