import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FeedbackList = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/feedback', {
          headers: { Authorization: localStorage.getItem('token') },
        });
        setFeedbackList(response.data);

      } catch (error) {
        console.error('Error fetching feedback:', error.message);
      }
    };

    fetchData();
  }, []);

  const Card = ({ children, dottedBorder = false, bordered = true, onClick }) => {
    return <>
      <div style={{ cursor: onClick ? "pointer" : "default" }} onClick={() => { onClick?.() }} className={`card${dottedBorder ? " --dotted-b" : ""}${bordered ? " --bordered" : ""}`}>
        <div className='card-inner'>
          {children}
        </div>
      </div>
    </>
  }

  return (
    <div className='feedback-main'>
      <h2>Add feedback</h2>
      <Card onClick={() => { navigate('/add-feedback') }} dottedBorder={true}>
        <div style={{ display: "flex", flex: 1, flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          <span style={{ color: "#7f19e6" }}> &#x2B;</span>
          Add new feedback</div>
      </Card>
      <h2>Feedback List</h2>
      {feedbackList.length === 0 ? <Card>No feedbacks found</Card> :
        <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 10 }}>{feedbackList.map((feedback) => (
          <Card key={feedback._id}>
            <div style={{ display: "flex", flex: 1, padding: 10 }}>{feedback.feedback}</div>
          </Card>
        ))}</div>
      }
    </div>
  );
};

export default FeedbackList;
