import React, { useState, useEffect } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
    MainContainer,
    ChatContainer,
    MessageList,
    Message as ChatMessage,
    MessageInput,
    TypingIndicator
} from "@chatscope/chat-ui-kit-react";
import { useOktaAuth } from '@okta/okta-react';
import BookModel from '../../models/BookModel';
import HistoryModel from '../../models/HistoryModel';

const API_KEY = process.env.REACT_APP_CHAT_API_KEY;
const BASE_URL = process.env.REACT_APP_API;

interface Message {
    message: string;
    sender: "User" | "ChatBot" | "ChatGPT";
    direction: "incoming" | "outgoing";
    position: "single" | "first" | "normal" | "last";
}

const Chat: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [typing, setTyping] = useState<boolean>(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            message: "Hello! How can I help you today?",
            sender: "ChatGPT",
            direction: "incoming",
            position: "single",
        }
    ]);
    const { authState } = useOktaAuth();
    const [books, setBooks] = useState<BookModel[]>([]);
    const [histories, setHistories] = useState<HistoryModel[]>([]);
    const [systemMessage, setSystemMessage] = useState<{ role: string, content: string } | null>(null);

    useEffect(() => {
        const fetchBooks = async () => {
            const url = `${BASE_URL}/books`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Something went wrong!');
            }
            const responseJson = await response.json();
            const loadedBooks: BookModel[] = responseJson._embedded.books.map((book: any) => ({
                id: book.id,
                title: book.title,
                author: book.author,
                description: book.description,
                copies: book.copies,
                copiesAvailable: book.copiesAvailable,
                category: book.category,
                img: book.img,
            }));
            setBooks(loadedBooks);
        };

        const fetchUserHistory = async () => {
            if (authState && authState.isAuthenticated) {
                const url = `${BASE_URL}/histories/search/findBooksByUserEmail/?userEmail=${authState.accessToken?.claims.sub}&page=0&size=100`;
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Something went wrong!');
                }
                const responseJson = await response.json();
                setHistories(responseJson._embedded.histories);
            }
        };

        fetchBooks().catch(console.error);
        fetchUserHistory().catch(console.error);
    }, [authState]);

    useEffect(() => {
        if (books.length > 0 && histories.length > 0) {
            const allBookTitles = books.map(book => book.title).join(', ');
            const readBookTitles = histories.map(history => history.title).join(', ');

            const systemMessageContent = `בספריה יש את הספרים הבאים: ${allBookTitles}. אני קראתי את הספרים ${readBookTitles}. תדבר איתי כאילו אתה ספרן מקצועי בספריית LibraNet שלנו.`;

            setSystemMessage({
                role: "system",
                content: systemMessageContent
            });
        }
    }, [books, histories]);

    const handleSend = async (message: string) => {
        const newMessage: Message = {
            message,
            sender: "User",
            direction: "outgoing",
            position: "single",
        };

        const newMessages = [...messages, newMessage];
        setMessages(newMessages);
        setTyping(true);

        await processMessageToChatGPT(newMessages);
    };

    const processMessageToChatGPT = async (chatMessages: Message[]) => {
        const apiMessages = chatMessages.map((messageObject) => {
            const role = messageObject.sender === "ChatGPT" ? "assistant" : "user";
            return { role, content: messageObject.message };
        });

        if (systemMessage) {
            apiMessages.unshift(systemMessage); // Add system message to the beginning
        }

        const apiRequestBody = {
            model: "gpt-3.5-turbo",
            messages: apiMessages
        };

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(apiRequestBody)
        });

        const data = await response.json();

        setMessages((prevMessages) => [
            ...prevMessages,
            {
                message: data.choices[0].message.content,
                sender: "ChatGPT",
                direction: "incoming",
                position: "single"
            }
        ]);
        setTyping(false);
    };

    return (
        <div className="App">
            <div style={{ position: "fixed", bottom: "120px", right: "20px", height: "400px", width: "350px", backgroundColor: "#fff", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", borderRadius: "8px", zIndex: 1000 }}>
                <div style={{ position: "absolute", top: "10px", right: "10px", cursor: "pointer", zIndex: 1001 }} onClick={onClose}>
                    ❌
                </div>
                <MainContainer style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <ChatContainer style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <MessageList
                            scrollBehavior={"smooth"}
                            typingIndicator={typing ? <TypingIndicator content="ChatGPT is typing..." /> : null}
                            style={{ flex: 1, overflowY: 'auto', paddingBottom: '10px' }}
                        >
                            {messages.map((message, i) => (
                                <ChatMessage
                                    key={i}
                                    model={{
                                        message: message.message,
                                        sentTime: "just now",
                                        sender: message.sender,
                                        direction: message.direction,
                                        position: message.position,
                                    }}
                                />
                            ))}
                        </MessageList>
                        <MessageInput placeholder="Type message here" onSend={handleSend} style={{ flexShrink: 0, marginTop: 'auto', borderRadius: '0 0 8px 8px' }} />
                    </ChatContainer>
                </MainContainer>
            </div>
        </div>
    );
};

export default Chat;
