import React, { useState } from 'react';
import { ReviewFormStyle } from '../../../components/Common';

function ReviewForm({ shopId, onReviewSubmit }) {
  const [review, setReview] = useState('');
  const token = localStorage.getItem('Authorization');

  const handleReviewChange = (event) => {
    setReview(event.target.value);
  };

  const handleReviewSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 필요하다면 여기에 인증 헤더 등 추가
          Authorization: token
        },
        body: JSON.stringify({
          shopId,
          description: review
        })
      });

      if (!response.ok) { // HTTP 상태 코드가 200-299가 아닌 경우
        throw new Error('Network response was not ok');
      }

      alert('리뷰가 등록되었습니다!');
      setReview('');
      if (onReviewSubmit) {
        onReviewSubmit();
      }
    } catch (error) {
      alert('이용한 내역에만 리뷰작성이 가능합니다');
      console.error('Error:', error);
    }
  };


  return (
      <div className="review">
        <h1>Reviews</h1>
        <div className="review-form">
          <ReviewFormStyle onSubmit={handleReviewSubmit}>
          <textarea
              value={review}
              onChange={handleReviewChange}
              placeholder="리뷰를 작성해 주세요."
              className="review-textarea"
          />
            {/* 버튼을 form 안으로 이동 */}
            <button type="submit" className="submit-button">등록</button>
          </ReviewFormStyle>
        </div>
      </div>
  );
}

export default ReviewForm;
