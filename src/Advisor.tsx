import * as React from "react";
import styled from "styled-components";
import { Button } from "antd";

import { Card, SmallCard } from "./Card";

export interface Advisor {
  label: string;
  order: number;
  back: string;
}

interface AdvisorButtonProps {
  advisor: Advisor;
  onClick?: React.MouseEventHandler<HTMLElement>;
}
export const AdvisorButton = (props: AdvisorButtonProps) => {
  return <Button onClick={props.onClick}>{props.advisor.label}</Button>;
};

interface AdvisorHandProps {
  advisor: Advisor;
  deck: Card[];
}
export const AdvisorHand = (props: AdvisorHandProps) => {
  return (
    <Background src={props.advisor.back}>
      {props.advisor.label}
      <Hand>
        {props.deck.map((c, i) => (
          <TiltCard card={c} key={i} pos={i} />
        ))}
      </Hand>
    </Background>
  );
};

const Hand = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 70px;
`;

const TiltCard = styled(SmallCard)<{ pos: number }>`
  @keyframes example0 {
    from {
      transform: rotateZ(0);
    }
    to {
      transform: ${`rotateZ(${-12.5 + 0 * 6.25}deg) translateY(40px)`};
    }
  }
  @keyframes example1 {
    from {
      transform: rotateZ(0);
    }
    to {
      transform: ${`rotateZ(${-12.5 + 1 * 6.25}deg) translateY(10px)`};
    }
  }
  @keyframes example2 {
    from {
      transform: rotateZ(0);
    }
    to {
      transform: ${`rotateZ(${-12.5 + 2 * 6.25}deg)`};
    }
  }
  @keyframes example3 {
    from {
      transform: rotateZ(0);
    }
    to {
      transform: ${`rotateZ(${-12.5 + 3 * 6.25}deg) translateY(10px)`};
    }
  }
  @keyframes example4 {
    from {
      transform: rotateZ(0);
    }
    to {
      transform: ${`rotateZ(${-12.5 + 4 * 6.25}deg) translateY(40px)`};
    }
  }

  width: 180px;
  border: solid 1px rgb(6, 78, 98);
  animation-name: ${({ pos }) => `example${pos}`};
  animation-duration: 0.5s;
  animation-timing-function: ease;
  animation-fill-mode: forwards;
  z-index: 30;

  :hover {
    border: solid 2px rgb(6, 78, 98);
    box-shadow: rgba(0, 0, 0, 0.22) 0px 19px 43px;
    z-index: 31;
  }
`;

const Background = styled.div<{ src: string }>`
  background: ${({ src }) => `center center url(${src})`};
  background-size: cover;
  padding: 50px;
`;
