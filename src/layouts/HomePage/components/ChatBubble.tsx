import React from 'react';

interface ChatBubbleProps {
    onClick: () => void; // הגדרת ה-props שהקומפוננטה מקבלת
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            style={{
                position: "fixed",
                bottom: "20px",
                right: "20px",
                backgroundColor: "#f56",
                color: "white",
                borderRadius: "50%",
                width: "50px",
                height: "50px",
                border: "none",
                cursor: "pointer",
                zIndex: 1000
            }}>
            💬
        </button>
    );
};

export default ChatBubble;
