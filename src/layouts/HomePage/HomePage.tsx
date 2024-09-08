import {ExploreTopBooks} from "./components/ExploreTopBooks";
import {Carousel} from "./components/Carousel";
import Heros from "./components/Heros";
import LibraryServices from "./components/LibraryServices";
import React, { useState } from "react";
import ChatBubble from "./components/ChatBubble";
import Chat from "../Utils/Chat";

const HomePage = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);

    const handleChatToggle = () => {
        setIsChatOpen(!isChatOpen);
    };

    return (
        <>
            {/*<CategoryDropdown/>*/}
            <ExploreTopBooks/>
            <Carousel/>
            <Heros/>
            <LibraryServices/>
            <ChatBubble onClick={handleChatToggle} /> {/* העברת הפונקציה כפרופס */}
            {isChatOpen && <Chat onClose={handleChatToggle} />}
        </>
    );
};

export default HomePage;
