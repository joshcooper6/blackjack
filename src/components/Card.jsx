import React from "react";

function Card(props) {
    const { card, index } = props;
  
    return (
      <div
        className="flex border p-4 rounded-xl w-[100px] h-[150px] justify-between flex-col"
        key={index}
      >
        <div className="self-start flex-col flex">
          <span>{card.value}</span>
        </div>
        <div>{card.suit}</div>
        <div className="self-end flex-col flex">
          <span>{card.value}</span>
        </div>
      </div>
    );
  }

export default Card;