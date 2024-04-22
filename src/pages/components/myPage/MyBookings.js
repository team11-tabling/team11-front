import React, { useState, useEffect } from "react";

function MyBookings() {
  
  const [lastTenBookings, setLastTenBookings] = useState([]); // 마지막 10개 예약 상태


  useEffect(() => {
    const token = localStorage.getItem('Authorization');
    const requestOptions = {
      method: 'GET',
      headers: {
        Authorization: `${ token }`
      }
    };

    fetch('http://tabling-load-balancer-1692678199.ap-northeast-2.elb.amazonaws.com:8080/api/bookings/my', requestOptions)
      .then(response => response.json())
      .then(data => {
        // 받아온 데이터에서 'data' 키에 해당하는 배열을 추출
        const bookingsData = data.data || [];
        

        // 마지막 10개 예약을 설정
        const lastTen = bookingsData.slice(Math.max(bookingsData.length - 10, 0));
        setLastTenBookings(lastTen);
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
      });
  }, []);

  return (
    <div className="booking">
      <h1>예약 내역</h1>
      <table>
        <thead>
          <tr>
            <th>예약 번호</th>
            <th>회원 번호</th>
            <th>가게 번호</th>
            <th>Ticket Number</th>
            <th>상태</th>
            <th>줄서기 시간</th>
            <th>인원</th>
          </tr>
        </thead>
        <tbody>
          {lastTenBookings.map(booking => (
            <tr key={booking.bookingId}>
              <td>{booking.bookingId}</td>
              <td>{booking.userId}</td>
              <td>{booking.shopId}</td>
              <td>{booking.ticketNumber}</td>
              <td>{booking.state}</td>
              <td>{new Date(booking.reservedDateTime).toLocaleString()}</td>
              <td>{booking.reservedParty}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MyBookings;
