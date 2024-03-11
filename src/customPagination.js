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
  height: "27px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  margin: "4px", // Same margin as buttons for consistency
  fontSize: "0.75rem", // Matching font size
  userSelect: "none",
});
const CustomArrowButtons = styled(Button)(({ theme, showArrows }) => ({
  borderRadius: "50%",
  minWidth: "3.5vh",
  height: "3.5vh",
  padding: "0",
  margin: "4px",
  display: "flex",
  color: "white",
  backgroundColor: "transparent",
  opacity: showArrows ? "1" : "0", // Control opacity based on showArrows prop
  "&:hover": {
    backgroundColor: showArrows ? "rgba(255, 255, 255, 0.08)" : "transparent",
  },
  "&.Mui-disabled": {
    color: "white",
    opacity: showArrows ? ".15" : "0", // Adjust disabled state opacity
  },
}));

const CustomButton = styled(
  ({
    borderColor,
    textColor,
    selectedFontWeight,
    showArrows,
    ...otherProps
  }) => <Button {...otherProps} />
)(({ borderColor }) => ({
  // Your styles using borderColor and other props
  borderRadius: "50%",
  minWidth: "3.5vh",
  minHeight: "3.5vh",
  padding: "0",
  margin: ".5vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  border: `.25vh solid ${borderColor}`, // Use borderColor for the border color
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  fontSize: "1.2vh",
  textTransform: "none",
}));

// Custom Pagination Component
const CustomPagination = ({
  arr,
  borderColor,
  textColor,
  selectedFontWeight,
  showArrows,
}) => {
  // Adjust these values as needed based on your specific requirements
  const totalItems = arr.length;
  let siblingCount = 2;

  // Example adjustment: If total number of items exceeds a certain threshold, reduce siblingCount to adjust the layout
  if (totalItems > 6) {
    siblingCount = 0; // This will show 2 nodes in the center for large counts
  }

  const { items } = usePagination({
    count: arr.length,
    boundaryCount: 1,
    siblingCount: siblingCount, // Use the dynamically determined siblingCount here
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
            children = (
              <CustomArrowButtons
                type="button"
                {...item}
                showArrows={showArrows && arr.length > 1}
              >
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
