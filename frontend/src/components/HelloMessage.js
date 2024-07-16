import React, { useState, useEffect } from "react";

const HelloMessage = () => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHelloMessage();
  }, []);

  const fetchHelloMessage = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:3001/api/hello");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMessage(data.message);
    } catch (e) {
      setError("메시지를 불러오는 데 실패했습니다.");
      console.error("Fetching error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "20px auto",
        padding: "20px",
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2
        style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}
      >
        Hello 메시지
      </h2>
      {isLoading ? (
        <p>로딩 중...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <p>{message}</p>
      )}
      <button
        onClick={fetchHelloMessage}
        style={{
          marginTop: "10px",
          padding: "8px 16px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        메시지 새로고침
      </button>
    </div>
  );
};

export default HelloMessage;
