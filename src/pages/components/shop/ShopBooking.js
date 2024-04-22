import React, { useState, useEffect } from 'react';
import { EventSourcePolyfill } from 'event-source-polyfill';

function Bookings(props) {
  const [reservedDatetime, setReservedDatetime] = useState(new Date().toISOString());
  const [reservedParty, setReservedParty] = useState('');
  const [bookingMessage, setBookingMessage] = useState(''); // 이벤트 메시지를 저장할 상태 추가
  const [bookingStatus, setBookingStatus] = useState('reserve'); // 예약 상태를 저장할 상태 추가
  const { shopId } = props;
  const token = localStorage.getItem('Authorization');
  const [bookingId, setBookingId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const apiEndpoint = bookingStatus === 'reserve' ? 'http://localhost:8080/api/bookings' : `http://localhost:8080/api/bookings/${bookingId}`; // 예약 상태에 따라 API 주소 변경
    const method = bookingStatus === 'reserve' ? 'POST' : 'DELETE'; // 예약 상태에 따라 사용할 메소드 변경
    fetch(apiEndpoint, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`
      },
      body: JSON.stringify({ reservedParty, reservedDatetime, shopId }),
    })
    .then(response => {
      if (response.ok) {
        // 예약 성공 시 버튼 상태와 메시지 업데이트
        setBookingStatus(bookingStatus === 'reserve' ? 'cancel' : 'reserve'); // 예약 상태를 토글
        return response.json();
      } else {
        throw new Error('Failed to make a booking');
      }
    })
    .then(data => {
      setBookingId(data.data.bookingId);
    })
    .catch(error => {
      console.error("Error:", error);
    });
  };

  useEffect(() => {
    // bookingStatus가 변경될 때마다 SSE를 구독하도록 함
    if (bookingStatus === 'reserve') {
      handleSSE(token, bookingStatus);
    }
  }, [bookingStatus, token]);

  const handleSSE = (token, bookingType) => {
    const eventSource = new EventSourcePolyfill(`http://localhost:8080/api/alarm/shop?bookingType=` + bookingType, {
      headers: {
        Authorization: token,
      },
    });

    eventSource.onmessage = function(event) {
      const eventData = event.data;
      setBookingMessage(eventData);
    };

    eventSource.onerror = (error) => {
      console.error("SSE Error:", error);
      eventSource.close();
    };
  };

  return (
      <div className="booking">
        <form onSubmit={handleSubmit}>
          <label>
            예약 인원 :
            <input
                className="party"
                type="text"
                value={reservedParty}
                onChange={(e) => setReservedParty(e.target.value)}
            />
          </label>
          <button className="btn" type="submit" disabled={!reservedParty}>
            {bookingStatus === 'reserve' ? '줄서기' : '취소하기'}
          </button>
        </form>
        {/* 예약 메시지를 표시하는 부분 추가 */}
        {bookingMessage && (
            <div className="booking-message">
              <p>{bookingMessage}</p>
            </div>
        )}
      </div>
  );
}

export default Bookings;
