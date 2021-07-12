import React, { useEffect } from "react";
import { Stage, Layer, Rect } from "react-konva";
import styled from "styled-components";
import { Provider } from "react-redux";

import { useWindowSize } from "./useWindowSize";
import { store } from "./store/store";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { AdvisorHand } from "./AdvisorHand";
import {
  selectAdvisors,
  selectDecks,
  drawCard,
  shuffleLibrary,
  setNewTurn,
} from "./store/gameSlice";
import { Button } from "./Button";

export const sceneWidth = 3840;
export const sceneHeight = 2160;
export const percentToPx = ({ x, y }: { x: number; y: number }) => {
  return {
    x: Math.max(0, Math.min(1, x)) * sceneWidth,
    y: Math.max(0, Math.min(1, y)) * sceneHeight,
  };
};

export const PlaySpace = () => {
  const dispatch = useAppDispatch();
  const advisors = useAppSelector(selectAdvisors) ?? [];
  const decks = useAppSelector(selectDecks) ?? {};

  useEffect(() => {
    // on intial load draw 1 card from each deck
    advisors.forEach((a) => {
      dispatch(shuffleLibrary(a));
      dispatch(drawCard(a));
    });
  }, []);

  const [width, height] = useWindowSize();
  const scale = Math.min(width / sceneWidth, height / sceneHeight);

  return (
    <Stage
      width={sceneWidth}
      height={sceneHeight}
      scale={{ x: scale, y: scale }}
    >
      <Provider store={store}>
        <Layer>
          <Background width={sceneWidth} height={sceneHeight} />
        </Layer>

        <Layer>
          <Button
            text="New Turn"
            height={sceneHeight * 0.04}
            width={sceneWidth * 0.1}
            x={10}
            y={900}
            onClick={() => {
              dispatch(setNewTurn());
              // todo: more thought about number of draws
              advisors.map((a) => {
                dispatch(drawCard(a));
                dispatch(drawCard(a));
              });
            }}
          />
          {advisors.map((a, i) => (
            <AdvisorHand
              key={a}
              x={sceneWidth * 0.25 * i}
              y={sceneHeight * 0.6}
              advisorKey={a}
              deck={decks[a].hand}
            />
          ))}
        </Layer>
      </Provider>
    </Stage>
  );
};

const Background = styled(Rect).attrs({
  fill: "lightblue",
})``;
