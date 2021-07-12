import * as React from "react";
import { Group, Text } from "react-konva";
import Konva from "konva";

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
  const cardWidth = 450;
  const cardHeight = cardWidth * 1.4;
  const pad = 10;

  return (
    <Group {...props}>
      <Text text={advisor.label} fontSize={cardHeight * 0.1} x={10} y={10} />
      <Button
        text="Draw Card"
        height={cardHeight * 0.1}
        width={cardWidth * 0.5}
        x={510}
        y={10}
        onClick={() => {
          dispatch(drawCard(props.advisorKey));
        }}
      />
      {props.deck.map((c, i) => (
        <SmallCard
          cardKey={c}
          key={i}
          x={pad + i * (cardWidth + pad)}
          y={pad + 150}
          width={cardWidth}
          height={cardHeight}
        />
      ))}
    </Group>
  );
};
