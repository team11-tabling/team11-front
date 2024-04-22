import React, {useEffect, useState} from "react";

function MyReviews() {
const [reviews, setReviews] = useState([]);

useEffect(() => {
  const token = localStorage.getItem('Authorization');
  const requestOptions = {
      method: 'GET',
      headers: {
        Authorization: `${token}`
      }
    };

  fetch('https://load.p-hako.com/api/reviews', requestOptions)
    .then(response => response.json())
    .then(data => {
      const reviewsData = data.data || [];
      setReviews(reviewsData);
    })
    .catch(error => {
      console.error('Error fetching data: ', error);
    });
  }, []);

return (
      <div className= "reviews">
        <h1>내 리뷰</h1>
        <table>
          <thead>
          <tr>
            <th>회원 번호</th>
            <th>가게 번호</th>
            <th>예약 번호</th>
            <th>리뷰 내용</th>
            <th>별점</th>
          </tr>
          </thead>
          <tbody>
          {reviews.map((review, index) => (
              <tr key={index}>
            <td>{review.userId}</td>
            <td>{review.shopId}</td>
            <td>{review.bookingId}</td>
            <td>{review.description}</td>
            <td>{review.star}</td>
            </tr>
            ))}
          </tbody>
        </table>
      </div>
  );
}

export default MyReviews;
