import React from "react";
import { Stage, Layer, Rect, Text } from "react-konva";
import styled from "styled-components";

import { useWindowSize } from "./useWindowSize";
import { Hand } from "./Hand";

export const sceneWidth = 3840;
export const sceneHeight = 2160;
export const percentToPx = ({ x, y }: { x: number; y: number }) => {
  return {
    x: Math.max(0, Math.min(1, x)) * sceneWidth,
    y: Math.max(0, Math.min(1, y)) * sceneHeight,
  };
};

export const PlaySpace = () => {
  const [width, height] = useWindowSize();
  const scale = Math.min(width / sceneWidth, height / sceneHeight);
  return (
    <Stage
      width={sceneWidth}
      height={sceneHeight}
      scale={{ x: scale, y: scale }}
    >
      <Layer>
        <Background width={sceneWidth} height={sceneHeight} />
      </Layer>
      <Layer>
        <Text text="Click" fontSize={60} />
        <Hand x={600} y={150} width={1500/2} height={2100/2} rotationDeg={20} />
      </Layer>
    </Stage>
  );
};

const Background = styled(Rect).attrs({
  fill: "lightblue",
})``;
