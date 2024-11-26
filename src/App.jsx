import React, { useState } from "react";
import axios from "axios";

function App() {
  const [tweets, setTweets] = useState([{ translated_content: "" }]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle input change for tweet data
  const handleTweetChange = (index, field, value) => {
    const updatedTweets = [...tweets];
    updatedTweets[index][field] = value;
    setTweets(updatedTweets);
  };

  // Add a new tweet input field
  const addTweet = () => {
    setTweets([...tweets, { translated_content: "" }]);
  };

  // Remove a tweet input field
  const removeTweet = (index) => {
    const updatedTweets = tweets.filter((_, i) => i !== index);
    setTweets(updatedTweets);
  };

  // Submit the data to the backend
  const analyzeSentiment = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/analyze_sentiment",
        { tweets }
      );
      setResult(response.data);
    } catch (error) {
      console.error("Error analyzing sentiment:", error);
      alert("An error occurred while analyzing sentiment. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        maxWidth: "800px",
        margin: "auto",
      }}
    >
      <h1>Sentiment Analysis</h1>
      <p>Enter tweets below to analyze their sentiment:</p>

      {tweets.map((tweet, index) => (
        <div
          key={index}
          style={{
            marginBottom: "20px",
            borderBottom: "1px solid #ccc",
            paddingBottom: "10px",
          }}
        >
          <textarea
            placeholder="Enter translated content"
            value={tweet.translated_content}
            onChange={(e) =>
              handleTweetChange(index, "translated_content", e.target.value)
            }
            rows="2"
            style={{
              width: "100%",
              marginBottom: "10px",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          ></textarea>

          <button
            onClick={() => removeTweet(index)}
            style={{
              background: "#f44336",
              color: "white",
              border: "none",
              padding: "5px 10px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Remove Tweet
          </button>
        </div>
      ))}

      <button
        onClick={addTweet}
        style={{
          background: "#4CAF50",
          color: "white",
          border: "none",
          padding: "10px 15px",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Add Tweet
      </button>

      <br />
      <br />

      <button
        onClick={analyzeSentiment}
        style={{
          background: "#008CBA",
          color: "white",
          border: "none",
          padding: "10px 20px",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        {loading ? "Analyzing..." : "Analyze Sentiment"}
      </button>

      {result && (
        <div
          style={{
            marginTop: "20px",
            padding: "20px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            background: "#0a0a0a",
          }}
        >
          <h3>Results</h3>
          <p>
            <strong>Positive Count:</strong> {result.positive_count}
          </p>
          <p>
            <strong>Neutral Count:</strong> {result.neutral_count}
          </p>
          <p>
            <strong>Negative Count:</strong> {result.negative_count}
          </p>
          <h4>Running Average Sentiment Over Time:</h4>
          <pre>{JSON.stringify(result.running_avg, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
