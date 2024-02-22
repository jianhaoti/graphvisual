import { useState } from "react";

// Hook to manage iteration over an array of any type
export const useArrayIterator = <T>(items: T[]) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // Function to move to the next item
  const goToNextItem = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsCompleted(true); // Mark as completed when reaching the end
    }
  };

  // Function to move to the previous item
  const goToPreviousItem = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsCompleted(false); // Reset completion status when moving back
    }
  };

  // Expose the current index, navigation functions, and completion status
  return {
    currentIndex,
    goToNextItem,
    goToPreviousItem,
    isCompleted,
  };
};
