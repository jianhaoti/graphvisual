import React, {useRef, useEffect} from "react";

function useDraggerHTML(id: string): void {  
    const isClicked = useRef<Boolean>(false)
    const coords = useRef<{
      startX: number
      startY: number
      lastX: number
      lastY: number
    }>({
      startX: 0,
      startY: 0,
      lastX: 0,
      lastY: 0
    })   

    useEffect(() => {
    const target = document.getElementById(id); //this replaced the box
    if(!target) throw new Error("Element with given id doesn't exist.");

    const container = target.parentElement; //this detects the container which the box is in
    if(!container) throw new Error("Target must have a parent.");

    const onMouseDown = (e: MouseEvent) => {
      isClicked.current = true
      coords.current.startX = e.clientX;  
      coords.current.startY = e.clientY;  
    }

    const onMouseUp = (e: MouseEvent) => {
      isClicked.current = false
      coords.current.lastX = target.offsetLeft;
      coords.current.lastY = target.offsetTop;
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isClicked.current) return;

      const nextX = e.clientX - coords.current.startX + coords.current.lastX;
      const nextY = e.clientY - coords.current.startY + coords.current.lastY;

      target.style.left = `${nextX}px`
      target.style.top = `${nextY}px`
    }

    target.addEventListener('mousedown', onMouseDown)
    target.addEventListener('mouseup', onMouseUp)
    container.addEventListener('mousemove', onMouseMove)
    container.addEventListener('mouseleave', onMouseUp)

    const cleanup = () => {
      target.removeEventListener('mousedown', onMouseDown)
      target.removeEventListener('mouseup', onMouseUp)
      container.removeEventListener('mousemove', onMouseMove)
      container.removeEventListener('mouseleave', onMouseUp)
    }
    return cleanup

  }, [id])
    
}

export default useDraggerHTML;