import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react';

import { Body, ControlButton, Controls, Header, WindowRoot } from './FloatingWindow.styles';

export interface FloatingWindowProps {
  children: ReactNode;
  title?: string;
  onClose: () => void;
  onMinimize?: () => void;
  onFocus?: () => void;
  zIndex?: number;
  minimized?: boolean;
  initialPosition?: { x: number; y: number };
  className?: string;
}

export function FloatingWindow({
  children,
  title,
  onClose,
  onMinimize,
  onFocus,
  zIndex = 1000,
  minimized = false,
  initialPosition = { x: 120, y: 120 },
  className,
}: FloatingWindowProps) {
  const [position, setPosition] = useState(initialPosition);
  const [dragging, setDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });

  const onMouseDown = (event: MouseEvent) => {
    onFocus?.();
    setDragging(true);
    offset.current = {
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    };
  };

  useEffect(() => {
    if (!dragging) {
      return;
    }

    const handleMouseMove = (event: globalThis.MouseEvent) => {
      setPosition({
        x: event.clientX - offset.current.x,
        y: event.clientY - offset.current.y,
      });
    };

    const handleMouseUp = () => {
      setDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging]);

  return (
    <WindowRoot
      role="dialog"
      aria-label={title}
      className={className}
      style={{
        left: position.x,
        top: position.y,
        zIndex,
        display: minimized ? 'none' : 'flex',
      }}
      onMouseDown={() => onFocus?.()}
    >
      <Header onMouseDown={onMouseDown}>
        <span>{title}</span>
        <Controls onMouseDown={(event: MouseEvent) => event.stopPropagation()}>
          {onMinimize && (
            <ControlButton type="button" onClick={onMinimize} aria-label="Minimize" title="Minimize">
              &minus;
            </ControlButton>
          )}
          <ControlButton type="button" onClick={onClose} aria-label="Close" title="Close">
            &times;
          </ControlButton>
        </Controls>
      </Header>

      <Body>{children}</Body>
    </WindowRoot>
  );
}

FloatingWindow.displayName = 'FloatingWindow';

export default FloatingWindow;
