import React, { useRef, useEffect } from "react";

function useDraggerSVG(id: string, ref: React.RefObject<SVGElement>): void {
    const isClicked = useRef(false);
    const coords = useRef({
        startX: 0,
        startY: 0,
        lastX: 0,
        lastY: 0
    });

    useEffect(() => {
        if (!ref.current) return;

        const target = ref.current;
        if (!target) throw new Error("Element with given ref doesn't exist.");

        const onMouseDown = (e: MouseEvent) => {
            isClicked.current = true;
            coords.current.startX = e.clientX;
            coords.current.startY = e.clientY;
        };

        const onMouseUp = () => {
            isClicked.current = false;
            // Update lastX and lastY if needed for subsequent drags
            // This depends on how you want to handle the dragging logic
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
        };

        target.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('mousemove', onMouseMove);

        return () => {
            target.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('mousemove', onMouseMove);
        };
    }, [id, ref]); // Depend on 'ref' so hook updates if element changes
}

export default useDraggerSVG;
