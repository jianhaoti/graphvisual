import { useEffect, useRef } from "react";

function useSelect(id: string, color: string) {
  const isClicked = useRef<boolean>(false);

  useEffect(() => {
    const target = document.getElementById(id);
    if (!target) throw new Error("Nothing chosen.");

    const changeColor = () => {
      if (!isClicked.current) {
        target.style.backgroundColor = "";
      } else {
        target.style.backgroundColor = color;
      }
    };

    const onClick = (e: MouseEvent) => {
      changeColor();
      isClicked.current = !isClicked.current;
    };

    target.addEventListener("click", onClick);

    return () => {
      target.removeEventListener("click", onClick);
    };
  }, [id, color]);
  return isClicked.current;
}

export default useSelect;
