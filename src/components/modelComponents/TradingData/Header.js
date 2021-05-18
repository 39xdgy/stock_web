import React from "react";
import styled from "styled-components";
// TRADING-DAY COMPONENTS
import Clock from "react-live-clock";
import SearchInput from "./Search/index.js";

const HeaderStyles = styled.div`
  user-select: none;
  @import url(https://fonts.googleapis.com/css?family=Arvo:700);
  @import url(https://fonts.googleapis.com/css?family=Seaweed+Script);

  #titling {
    background-color: #222;
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
    justify-content: center;
    padding: 20px 0;
  }

  .clock {
    text-align: center;
    background: white;
    color: #000;
    letter-spacing: 0.5rem;
    color: black;
    font-weight: 500;
    font-size: 1.5rem;
    border-radius: 0.25em;
    line-height: 2rem;
    align-self: center;
  }
  .search {
    width: 100%;
  }
`;

export default Header => {
  return (
    <HeaderStyles>
      <div className='clock'>
        <Clock
          format={"HH:mm:ss"}
          ticking={true}
          timezone={"America/New_York"}
          interval={1000}
        />
      </div>
      <div>
        <div className='search'>
          <SearchInput />
        </div>
      </div>
    </HeaderStyles>
  );
};
