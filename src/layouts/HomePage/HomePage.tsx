import {ExploreTopBooks} from "./components/ExploreTopBooks";
import {Carousel} from "./components/Carousel";
import Heros from "./components/Heros";
import LibraryServices from "./components/LibraryServices";
import React from "react";
import {StarsReview} from "../Utils/StarsReview";
const HomePage = () => {
    return (
        <>
            <ExploreTopBooks/>
            <Carousel/>
            <Heros/>
            <LibraryServices/>
        </>
    );
};

export default HomePage;