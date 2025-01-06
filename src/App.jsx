import React, { useState, useEffect, useRef } from "react";
import Header from "./Header";
import Footer from "./Footer";
import loadImage from "./assets/load.png";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [apiResponses, setApiResponses] = useState([]);
  const [loading, setLoading] = useState(false); // Add loading state

  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, apiResponses]);

  const handleNewMessage = (message) => {
    setMessages([...messages, message]);
  };

  const handleApiResponse = (response) => {
    console.log("API Response Received: ", response);
    setApiResponses((prevResponses) => [...prevResponses, response]);
    setLoading(false); // Stop loading when response is received
  };

  console.log("Current API Responses: ", apiResponses); // Debug log

  return (
    <>
      <Header />
      <div
        className="main"
        ref={chatContainerRef}
        style={{ overflowY: "auto", maxHeight: "80vh" }}
      >
        {messages.map((msg, index) => (
          <div key={index}>
            <div className="chat">{msg.text}</div>
            {loading && !apiResponses[index] && (
              <div className="loading">
                <img
                  src={loadImage}
                  alt="Loading..."
                  style={{ maxWidth: "5%", margin: "10px", maxHeight: "5%" }}
                />
              </div>
            )}
            {apiResponses[index] && (
              <div className="ai-chat">
                <div className="aiImg"></div>
                <div>{apiResponses[index]}</div>
              </div>
            )}
          </div>
        ))}
      </div>
      <Footer
        onMessageSubmit={(message) => {
          handleNewMessage(message);
          setLoading(true); // Start loading when message is submitted
        }}
        onApiResponse={handleApiResponse}
      />
    </>
  );
};

export default App;
