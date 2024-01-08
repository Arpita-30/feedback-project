import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const FeedbackForm = () => {
  const [customerName, setCustomerName] = useState('');
  const [feedback, setFeedback] = useState('');
  console.log(localStorage.getItem('token'));

  const navigate = useNavigate()
  const handleAddFeedback = async (e) => {
    e.preventDefault()

    try {
      await axios.post('http://localhost:3001/feedback', { customerName, feedback }, {
        headers: { Authorization: localStorage.getItem('token') },
      });
      navigate("/feedback");


    } catch (error) {
      console.error('Error adding feedback:', error.message);
    }
  };

  return (
    <>
      <div className="add-feed_container">
        <h2>Feedback</h2>
        <br />
        <form style={{ display: "flex", flexDirection: "column" }} onSubmit={handleAddFeedback}>
          <label htmlFor="feedback" style={{ fontWeight: 600, marginBottom: 10 }}>Give your feedback here:</label>
          <textarea minLength={50} maxLength={1000} rows={20} id="feedback" onChange={(e) => setFeedback(e.target.value)} />
          <br />
          <div style={{ display: "flex", flexDirection: "row", gap: 30, alignItems: "center", justifyContent: "center" }}>
            <button type='button' onClick={() => navigate("/feedback")} style={{ alignSelf: "center" }}> Back </button>
            <button type='submit' style={{ alignSelf: "center" }}>Submit</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default FeedbackForm;
