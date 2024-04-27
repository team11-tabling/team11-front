import React, { useEffect, useState } from "react";

function MyReviews({ shopId, refreshTrigger }) {
  const [reviews, setReviews] = useState([]);
  const token = localStorage.getItem('Authorization');

  useEffect(() => {
    const requestOptions = {
      method: 'GET',
      headers: {
        Authorization: `${token}`
      }
    };

    fetch(`http://localhost:8080/api/reviews/shop/${shopId}`, requestOptions)
    .then(response => response.json())
    .then(data => {
      const reviewsData = data.data || [];
      setReviews(reviewsData);
    })
    .catch(error => {
      console.error('Error fetching data: ', error);
    });
  }, [shopId, token, refreshTrigger]); // shopId와 token을 의존성 배열에 추가하여, 해당 값이 변경될 때마다 useEffect가 실행되도록 함

  return (
      <div className="reviews">
        <table>
          <thead>
          <tr>
            <th>회원 번호</th>
            <th>리뷰 내용</th>
          </tr>
          </thead>
          <tbody>
          {reviews.map((review, index) => (
              <tr key={index}>
                <td>{review.userId}</td>
                <td>{review.description}</td>
              </tr>
          ))}
          </tbody>
        </table>
      </div>
  );
}

export default MyReviews;
