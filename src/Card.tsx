import * as React from "react";
import styled from "styled-components";
import { Card as AntdCard, Avatar, Popconfirm } from "antd";
import { PlaySquareOutlined, InfoCircleOutlined } from "@ant-design/icons";

interface Props {
  card: Card;
  className?: string;
}
export const SmallCard = ({ card, className }: Props) => {
  return (
    <AntdCard
      className={className}
      cover={<img alt="example" src={card.imageSrc} />}
      hoverable={true}
      actions={[
        <Popconfirm
          title={`Play ${card.label}?`}
          onConfirm={() => card.play()}
          okText="Yes"
          cancelText="No"
        >
          <PlaySquareOutlined key="play" disabled={!card.canPlay()} />{" "}
        </Popconfirm>,
        <InfoCircleOutlined key="info" />,
      ]}
    >
      <AntdCard.Meta
        avatar={<Avatar src={card.typeSrc} />}
        title={card.label}
        description={card.description}
      />
    </AntdCard>
  );
};

export interface Card {
  id: string;
  label: string;
  description: string;
  costDesc: JSX.Element;
  imageSrc: string;
  typeSrc: string;
  canPlay: () => boolean;
  play: () => void;
}

export interface LeaderCard extends Card {}

export interface ScienceCard extends Card {}

export interface InteriorCard extends Card {}
