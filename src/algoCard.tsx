import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CardActionArea,
} from "@mui/material";

interface AlgoCardProps {
  title: string;
  grouping: string;
  description: string;
  backgroundColor: string;
  onClick: () => void;
}
const AlgoCard: React.FC<AlgoCardProps> = ({
  title,
  grouping,
  description,
  backgroundColor,
  onClick,
}) => {
  return (
    <CardActionArea onClick={onClick}>
      <Box sx={{ width: "50vw" }}>
        <Card variant="outlined" sx={{ backgroundColor, height: "17vh" }}>
          <CardContent>
            <Typography variant="h5" component="div">
              {title}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              {grouping}
            </Typography>
            <Typography variant="body2">{description}</Typography>
          </CardContent>
        </Card>
      </Box>
    </CardActionArea>
  );
};

export default AlgoCard;
