import React, { useState } from 'react';

const Footer = ({ onMessageSubmit, onApiResponse }) => {
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log("Search Term: ", search);
    setIsLoading(true);
    
    onMessageSubmit(search); // Pass the message to the App component

    // Fetch data from the API
    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyD4wutXSYZASwfbcTHOwKsBoX-2QqKVVHw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: search
                }
              ]
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched Data: ", data); // Debug log to review structure

      // Extract the output text from the response based on the logged structure
      let outputText = data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text;
      console.log("Extracted Output Text: ", outputText);

      // Determine if the request is for code or simple text
      const isCodeRequest = search.toLowerCase().includes("code") || search.toLowerCase().includes("program");

      if (isCodeRequest) {
        // Wrap the output text in triple backticks and specify the language to preserve formatting
        outputText = `\`\`\`cpp\n${outputText}\n\`\`\``;
      } else {
        // Remove unwanted special characters but keep programming symbols
        outputText = outputText ? outputText.replace(/[^\w\s.,;:{}()\[\]<>/\\!"'`~@$%^&*+=|-]/g, '') : "No output available";
      }

      console.log("Formatted Output Text: ", outputText);
      onApiResponse(outputText);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }

    // Reset the input fields
    setSearch("");
  };

  return (
    <>
      <form onSubmit={submitHandler}>
        <div id='fot'>
          <div className='bar'>
            <div id='search'>
              <input
                className='search'
                type='text'
                placeholder='Message'
                value={search}
                onChange={handleChange}
              />
            </div>
            <button id='svg'>
              <i id='send' className="fa-solid fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default Footer;