import React, { useState, useEffect, useRef } from "react";
import Header from "./Header";
import Footer from "./Footer";
import loadImage from "./assets/load.png";
import ReactMarkdown from 'react-markdown';
import './index.css'; 

const App = () => {
  const [messages, setMessages] = useState([]);
  const [apiResponses, setApiResponses] = useState([]);
  const [loading, setLoading] = useState(false);

  const a = useRef(null);

  useEffect(() => {
    if (a.current) {
     a.current.scrollTop = a.current.scrollHeight;
    }
  }, [messages, apiResponses]);

  const handleNewMessage = (message) => {
    setMessages([...messages, message]);
  };

  const handleApiResponse = (response) => {
    console.log("API Response Received: ", response);
    setApiResponses((prevResponses) => [...prevResponses, response]);
    setLoading(false);
  };

  console.log("Current API Responses: ", apiResponses);

  return (
    <>
      <Header />
      <div
        className="main"
        ref={a}
        style={{ overflowY: "auto", maxHeight: "80vh" }}
      >
        {messages.map((msg, index) => (
          <div key={index}>
            <div className="chat text-container">{<li>{msg}</li>}</div>
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
              <div className="ai-chat text-container">
                <div className="aiImg"></div>
                <ReactMarkdown>{apiResponses[index]}</ReactMarkdown>
              </div>
            )}
          </div>
        ))}
      </div>
      <Footer
        onMessageSubmit={(message) => {
          handleNewMessage(message);
          setLoading(true);
        }}
        onApiResponse={handleApiResponse}
      />
    </>
  );
};

export default App;
