import React, { useState } from "react";
import Modal from "./Modal";

const NumberMultiplier = () => {
  const [inputValue, setInputValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const number = parseInt(inputValue);
    if (isNaN(number)) {
      setModalContent("유효한 숫자를 입력해주세요!");
      setIsModalOpen(true);
      return;
    }
    try {
      const response = await fetch("http://localhost:3001/api/multiply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ number }),
      });
      const data = await response.json();
      setModalContent(`결과: ${data.result}`);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error:", error);
      setModalContent("서버와의 통신 중 오류가 발생했습니다.");
      setIsModalOpen(true);
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "40px auto",
        padding: "20px",
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h1
        style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}
      >
        숫자 곱하기
      </h1>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <div>
          <label
            htmlFor="number"
            style={{ display: "block", marginBottom: "0.5rem" }}
          >
            숫자 입력
          </label>
          <input
            type="text"
            id="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
            placeholder="숫자를 입력하세요"
          />
        </div>
        <button
          type="submit"
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#4f46e5",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          계산하기
        </button>
      </form>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="응답결과"
      >
        <p>{modalContent}</p>
      </Modal>
    </div>
  );
};

export default NumberMultiplier;
