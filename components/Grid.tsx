import React, { useState, useEffect, useRef } from "react";

export interface Prompt {
  id: number;
  question: string;
  color: string;
}

interface GridProps {
  prompts: Prompt[];
}

const Grid: React.FC<GridProps> = ({ prompts }) => {
  // Constants for layout
  const bubbleSize = 180; // Base size of a bubble
  const baseSpacing = bubbleSize * 1.3; // Default spacing
  const selectedSpacing = bubbleSize * 1.4; // Spacing for current bubble

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [bubblePositions, setBubblePositions] = useState<
    Array<{ x: number; y: number }>
  >([]);
  const gridRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [startTime, setStartTime] = useState(0);
  const [moveDistance, setMoveDistance] = useState(0);
  const lastPosition = useRef({ x: 0, y: 0 });

  // Calculate positions for radial layout
  const calculateRadialPositions = () => {
    // First calculate base positions with normal spacing
    const calculateBasePositions = () => {
      const positions = [];
      const center = { x: 0, y: 0 };

      // Hexagonal grid directions (60 degree intervals)
      const hexDirections = [
        { x: 1, y: 0 }, // right
        { x: 0.5, y: 0.866 }, // bottom right
        { x: -0.5, y: 0.866 }, // bottom left
        { x: -1, y: 0 }, // left
        { x: -0.5, y: -0.866 }, // top left
        { x: 0.5, y: -0.866 }, // top right
      ];

      // Center bubble
      positions.push(center);

      if (prompts.length <= 1) return positions;

      // Calculate how many rings we need
      const maxRings = Math.ceil(Math.sqrt(prompts.length / 3)); // Approximate number of rings needed
      let currentIndex = 1; // Start after center bubble

      // For each ring
      for (
        let ring = 1;
        ring <= maxRings && currentIndex < prompts.length;
        ring++
      ) {
        const ringRadius = baseSpacing * ring;
        const positionsInRing = ring * 6; // Number of positions in this ring

        // For each position in the ring
        for (
          let i = 0;
          i < positionsInRing && currentIndex < prompts.length;
          i++
        ) {
          const angle = (i * 2 * Math.PI) / positionsInRing;
          const x = ringRadius * Math.cos(angle);
          const y = ringRadius * Math.sin(angle);

          positions.push({ x, y });
          currentIndex++;
        }
      }

      return positions;
    };

    const basePositions = calculateBasePositions();
    if (!basePositions || basePositions.length === 0) {
      return [];
    }

    const selectedPos = basePositions[selectedIndex] || { x: 0, y: 0 };

    // Now adjust all positions based on distance to selected bubble
    return basePositions.map((pos, index) => {
      if (!pos) return { x: 0, y: 0 };
      if (index === selectedIndex) return pos;

      // Calculate distance from this bubble to the selected bubble
      const dx = pos.x - selectedPos.x;
      const dy = pos.y - selectedPos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Calculate scale factor based on distance
      // Closer bubbles move more, farther bubbles move less
      const scaleFactor = Math.max(
        1,
        (selectedSpacing / baseSpacing) *
          (1 + Math.exp(-distance / baseSpacing))
      );

      // Calculate the direction vector from selected to this bubble
      const dirX = dx / (distance || 1); // Avoid division by zero
      const dirY = dy / (distance || 1);

      // Move the bubble outward from the selected bubble
      return {
        x: selectedPos.x + dirX * distance * scaleFactor,
        y: selectedPos.y + dirY * distance * scaleFactor,
      };
    });
  };

  // Update positions on mount and when dependencies change
  useEffect(() => {
    setBubblePositions(calculateRadialPositions());
  }, [selectedIndex, position]);

  // Handle mouse/touch events
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setDragging(true);
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    setStartPos({
      x: clientX - position.x,
      y: clientY - position.y,
    });
    lastPosition.current = { x: clientX, y: clientY };
    setStartTime(Date.now());
    setMoveDistance(0);
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dragging) return;

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    // Calculate distance moved
    const dx = clientX - lastPosition.current.x;
    const dy = clientY - lastPosition.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    setMoveDistance((prev) => prev + distance);
    lastPosition.current = { x: clientX, y: clientY };

    // Calculate new position relative to start position
    const newX = clientX - startPos.x;
    const newY = clientY - startPos.y;

    // Calculate dynamic boundaries based on number of rings
    const maxRings = Math.ceil(Math.sqrt(prompts.length / 3));
    const maxRadius = baseSpacing * (maxRings + 0.5); // Add 0.5 for padding

    // Calculate distance from center
    const distanceFromCenter = Math.sqrt(newX * newX + newY * newY);

    // If moving beyond the hexagonal boundary, scale back the position
    if (distanceFromCenter > maxRadius) {
      const scale = maxRadius / distanceFromCenter;
      setPosition({
        x: newX * scale,
        y: newY * scale,
      });
    } else {
      setPosition({
        x: newX,
        y: newY,
      });
    }
  };

  const handleMouseUp = () => {
    const endTime = Date.now();
    const duration = endTime - startTime;
    const wasClick = moveDistance < 10 && duration < 200; // Consider it a click if moved less than 10px and less than 200ms

    setDragging(false);
    if (!wasClick) {
      updateSelectedPrompt();
    }
  };

  // Function to update the selected prompt based on position
  const updateSelectedPrompt = () => {
    const container = containerRef.current;
    if (!container) return;

    // Calculate center of the container
    const containerRect = container.getBoundingClientRect();
    const centerX = containerRect.left + containerRect.width / 2;
    const centerY = containerRect.top + containerRect.height / 2;

    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    // Find the prompt closest to the center
    const promptElements = document.querySelectorAll(".app-icon");
    promptElements.forEach((el, index) => {
      const rect = el.getBoundingClientRect();
      const promptCenterX = rect.left + rect.width / 2;
      const promptCenterY = rect.top + rect.height / 2;

      const distance = Math.sqrt(
        Math.pow(promptCenterX - centerX, 2) +
          Math.pow(promptCenterY - centerY, 2)
      );

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    if (closestIndex !== selectedIndex) {
      setSelectedIndex(closestIndex);
    }
  };

  const handleBubbleInteraction = (
    index: number,
    isSelected: boolean,
    e: React.MouseEvent | React.TouchEvent
  ) => {
    e.preventDefault();
    e.stopPropagation();

    // Only handle the interaction if it wasn't a drag
    if (moveDistance < 10) {
      if (isSelected) {
        // Navigate to discussion page
        console.log("Navigate to discussion for:", prompts[index].question);
      } else {
        // Pan to the bubble by updating position to center it
        const targetBubble = bubblePositions[index];
        if (targetBubble) {
          setPosition({
            x: -targetBubble.x,
            y: -targetBubble.y,
          });
          setTimeout(() => {
            updateSelectedPrompt();
          }, 50);
        }
      }
    }
  };

  // Update selected prompt based on position
  useEffect(() => {
    if (!dragging) {
      updateSelectedPrompt();
    }
  }, [position, dragging]);

  // Add touch event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      handleMouseDown(e as unknown as React.TouchEvent);
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      handleMouseMove(e as unknown as React.TouchEvent);
    };

    const handleTouchEnd = () => {
      handleMouseUp();
    };

    container.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    container.addEventListener("touchend", handleTouchEnd);

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [dragging, position, startPos, startTime]);

  return (
    <div className="flex flex-col h-screen bg-black">
      {/* App grid container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-hidden relative flex items-center justify-center touch-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          ref={gridRef}
          className="relative transform transition-transform duration-300"
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`,
            transitionProperty: dragging ? "none" : "transform",
          }}
          onTransitionEnd={() => {
            // Recalculate selected bubble after transition completes
            updateSelectedPrompt();
          }}
        >
          {prompts.map((prompt, index) => {
            const isSelected = index === selectedIndex;
            const bubblePos = bubblePositions[index] || { x: 0, y: 0 };

            return (
              <div
                key={prompt.id}
                className={`app-icon rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer absolute ${
                  isSelected ? "ring-4 ring-white shadow-2xl" : "shadow-xl"
                }`}
                style={{
                  width: isSelected ? "380px" : "180px",
                  height: isSelected ? "380px" : "180px",
                  backgroundColor: prompt.color,
                  zIndex: isSelected ? 10 : 1,
                  opacity: isSelected ? 1 : 0.9,
                  left: `calc(50% + ${bubblePos.x}px)`,
                  top: `calc(50% + ${bubblePos.y}px)`,
                  transform: `translate(-50%, -50%) ${
                    isSelected ? "scale(1.1)" : "scale(1)"
                  }`,
                  boxShadow:
                    "0 10px 15px -3px rgba(255, 255, 255, 0.3), 0 4px 6px -2px rgba(255, 255, 255, 0.2)",
                  overflow: "hidden",
                  touchAction: "none", // Prevent default touch behavior
                }}
                onClick={(e) => handleBubbleInteraction(index, isSelected, e)}
                onTouchEnd={(e) =>
                  handleBubbleInteraction(index, isSelected, e)
                }
              >
                <div className="p-6 text-center flex flex-col items-center justify-center h-full">
                  {isSelected ? (
                    <>
                      <p className="text-3xl text-white font-medium leading-tight mb-4">
                        {prompt.question}
                      </p>
                      <button
                        className="mt-2 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white text-sm transition-colors"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          // Navigate to discussion page
                          console.log(
                            "Navigate to discussion for:",
                            prompt.question
                          );
                        }}
                      >
                        Join Discussion
                      </button>
                    </>
                  ) : (
                    <p className="text-base text-white font-medium leading-tight line-clamp-3">
                      {prompt.question}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Grid;
