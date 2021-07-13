import React, { useEffect } from "react";
import { Stage, Layer, Rect } from "react-konva";
import styled from "styled-components";
import { Provider } from "react-redux";

import { Theme } from "./theme";
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

export const Board = () => {
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
  const scale = Math.min(width / Theme.sceneWidth, height / Theme.sceneHeight);

  return (
    <Stage
      width={Theme.sceneWidth}
      height={Theme.sceneHeight}
      scale={{ x: scale, y: scale }}
    >
      <Provider store={store}>
        <Layer>
          <Background width={Theme.sceneWidth} height={Theme.sceneHeight} />
        </Layer>

        <Layer>
          {advisors.map((a, i) => (
            <AdvisorHand
              key={a}
              x={Theme.sceneWidth * 0.25 * i}
              y={Theme.sceneHeight * 0.7}
              advisorKey={a}
              deck={decks[a].hand}
            />
          ))}

          <Button
            text="New Turn"
            x={Theme.sceneWidth * 0.92}
            y={Theme.sceneHeight * 0.95}
            onClick={() => {
              dispatch(setNewTurn());
              // todo: more thought about number of draws
              advisors.map((a) => {
                dispatch(drawCard(a));
                dispatch(drawCard(a));
              });
            }}
          />
        </Layer>

        <Layer name="top-layer" />
      </Provider>
    </Stage>
  );
};

const Background = styled(Rect).attrs({
  fill: "lightblue",
})``;
