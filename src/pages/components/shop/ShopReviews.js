import React, { useEffect, useState } from "react";

function MyReviews(props) {
  const [reviews, setReviews] = useState([]);
  const { shopId } = props;
  const token = localStorage.getItem('Authorization');

  useEffect(() => {
    const requestOptions = {
      method: 'GET',
      headers: {
        Authorization: `${token}`
      }
    };

    fetch(`http://tabling-load-balancer-1692678199.ap-northeast-2.elb.amazonaws.com:8080/api/reviews/shop/${shopId}`, requestOptions)
    .then(response => response.json())
    .then(data => {
      const reviewsData = data.data || [];
      setReviews(reviewsData);
    })
    .catch(error => {
      console.error('Error fetching data: ', error);
    });
  }, [shopId, token]); // shopId와 token을 의존성 배열에 추가하여, 해당 값이 변경될 때마다 useEffect가 실행되도록 함

  return (
      <div className="reviews">
        <h1>Reviews</h1>
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
