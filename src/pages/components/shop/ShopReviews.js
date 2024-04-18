import React, {useEffect, useState} from "react";

function MyReviews(props) {
  const [reviews, setReviews] = useState([]);
  const {shopId} = props;
  const token = localStorage.getItem('Authorization');

  useEffect(() => {
    const requestOptions = {
      method: 'GET',
      headers: {
        Authorization : `${token}`
      }
    };

    fetch(`http://localhost:8080/api/reviews/shop/${shopId}` , requestOptions)
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


// list를 조회한다
// 가게를 클릭한다

// 리스트를 띄우고
// 저장을하고 < 저장을하면 return값이 있을텐데 id값을 리턴받아서
// /shop/1
// GET shops/1
