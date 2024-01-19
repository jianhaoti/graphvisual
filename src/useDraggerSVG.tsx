//useDraggerSVG.tsx
import React, { useRef, useEffect } from "react";

function useDraggerSVG(
    id: string, 
    ref: React.RefObject<SVGElement>, 
    draggable: boolean,
    onDrag: (id: string, newPosition: { x: number; y: number }) => void
    ) {
    const isClicked = useRef(false);
    const coords = useRef({
        startX: 0,
        startY: 0,
        lastX: 0,
        lastY: 0
    }); 

    useEffect(() => {
        if (!ref.current || !draggable) return;

        const target = ref.current;
        if (!target) throw new Error("Element with given ref doesn't exist.");

        const onMouseDown = (e: MouseEvent) => {

            isClicked.current = true;
            coords.current.startX = e.clientX;
            coords.current.startY = e.clientY;
        };

        const onMouseUp = () => {
            isClicked.current = false;
        };

        const onMouseMove = (e: MouseEvent) => {
            if (!isClicked.current || !target) return;

            const dx = e.clientX - coords.current.startX;
            const dy = e.clientY - coords.current.startY;

            // Assuming the target is an SVG circle
            const cx = parseFloat(target.getAttribute('cx') || '0') + dx;
            const cy = parseFloat(target.getAttribute('cy') || '0') + dy;

            target.setAttribute('cx', cx.toString());
            target.setAttribute('cy', cy.toString());

            // Update the start coordinates for the next move
            coords.current.startX = e.clientX;
            coords.current.startY = e.clientY;
            
            if (onDrag) {
                onDrag(id, { x: cx, y: cy });
            }
        };

        target.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('mousemove', onMouseMove);

        return () => {
            target.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('mousemove', onMouseMove);
        };
    }, [id, ref, draggable, onDrag]); // Depend on 'ref' so hook updates if element changes
}

export default useDraggerSVG;