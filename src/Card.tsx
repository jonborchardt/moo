import * as React from "react";
import { Card as AntdCard, Avatar, Popconfirm } from "antd";
import { PlaySquareOutlined, InfoCircleOutlined } from "@ant-design/icons";

import { useAppDispatch, useAppSelector } from "./store/hooks";
import { Card as StoreCard } from "./store/cards2";
import { playCard, selectCards } from "./store/gameSlice";
import { advisors } from "./store/advisors";

interface Props {
  cardKey: string;
  className?: string;
}
export const SmallCard = ({ cardKey, className }: Props) => {
  console.log(cardKey);
  const dispatch = useAppDispatch();
  const cards = useAppSelector(selectCards);
  const card: StoreCard = cards[cardKey];
  return (
    <AntdCard
      className={className}
      cover={<img alt="example" src={card.imageSrc} />}
      hoverable={true}
      actions={[
        <Popconfirm
          title={`Play ${card.label}?`}
          onConfirm={() => dispatch(playCard(card))}
          okText="Yes"
          cancelText="No"
        >
          <PlaySquareOutlined key="play" />{" "}
        </Popconfirm>,
        <InfoCircleOutlined key="info" />,
      ]}
    >
      <AntdCard.Meta
        avatar={<Avatar src={advisors[card.advisor].icon} />}
        title={card.label}
        description={card.description}
      />
    </AntdCard>
  );
};
