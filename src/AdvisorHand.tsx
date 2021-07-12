import * as React from "react";
import { Group, Text } from "react-konva";
import Konva from "konva";

import { Theme } from "./theme";
import { useAppDispatch } from "./store/hooks";
import { drawCard } from "./store/gameSlice";
import { AdvisorType, advisors } from "./store/advisors";
import { SmallCard } from "./SmallCard";
import { Button } from "./Button";

interface Props extends Konva.NodeConfig {
  advisorKey: AdvisorType;
  deck: string[];
}
export const AdvisorHand = (props: Props) => {
  const dispatch = useAppDispatch();
  const advisor = advisors[props.advisorKey];
  const cardHeight = Theme.cardWidth * 1.4;

  return (
    <Group {...props}>
      <Text
        text={advisor.label}
        fontSize={cardHeight * 0.1}
        x={Theme.spacing.xxs}
        y={Theme.spacing.xxs}
      />
      <Button
        text="Draw Card"
        x={Theme.cardWidth * 1.2}
        onClick={() => {
          dispatch(drawCard(props.advisorKey));
        }}
      />
      {props.deck.map((c, i) => (
        <SmallCard
          cardKey={c}
          key={i}
          x={Theme.spacing.xxs + i * (Theme.cardWidth + Theme.spacing.xxs)}
          y={Theme.spacing.xxs + Theme.sceneHeight * 0.07}
          width={Theme.cardWidth}
          height={cardHeight}
        />
      ))}
    </Group>
  );
};
