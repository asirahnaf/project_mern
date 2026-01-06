import React from "react";
import MainContainer from "../container/MainContainer";
import HomeFeedSearch from "../components/homeFeed/HomeFeedSearch";
import ProductLists from "../components/homeFeed/ProductLists";
import WeatherAdvisoryWidget from "../components/WeatherAdvisoryWidget";
import MarketRatesWidget from "../components/MarketRatesWidget";

const HomeFeedPage = () => {
  return (
    <main className="w-full mt-12 h-full min-h-dvh">
      <MainContainer>
        <WeatherAdvisoryWidget />
        <MarketRatesWidget />
        <ProductLists />
      </MainContainer>
    </main>
  );
};

export default HomeFeedPage;
