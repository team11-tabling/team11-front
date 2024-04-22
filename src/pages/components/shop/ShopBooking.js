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

  // 컴포넌트가 처음 렌더링될 때 API를 조회하여 초기 데이터 설정
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/bookings/shop/${shopId}`, {
          method: 'GET',
          headers: {
            Authorization: token
          }
        });
        if (response.ok) {
          const data = await response.json();
          // 데이터가 null이 아닌 경우에만 해당 상태를 설정
          if (data.data) {
            setReservedParty(data.data.reservedParty);
            setReservedDatetime(data.data.reservedDatetime);
            setBookingStatus(data.data.state);
            setBookingId(data.data.bookingId);

            if (data.data.state === 'WAITING') {
              handleSSE(token, data.data.state);
            }
          }
        } else {
          throw new Error('Failed to fetch initial data');
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    fetchInitialData();
  }, [shopId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const apiEndpoint = bookingStatus === 'reserve' ? 'http://localhost:8080/api/bookings' : `http://localhost:8080/api/bookings/${bookingId}`; // 예약 상태에 따라 API 주소 변경
    const method = bookingStatus === 'reserve' ? 'POST' : 'DELETE'; // 예약 상태에 따라 사용할 메소드 변경
    try {
      const response = await fetch(apiEndpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        },
        body: JSON.stringify({ reservedParty, reservedDatetime, shopId }),
      });
      if (response.ok) {
        const data = await response.json();
        setBookingId(data.data.bookingId);
        // 예약 성공 시 버튼 상태와 메시지 업데이트
        if (data.data.state === 'DONE') {
          setBookingStatus('reserve');
        } else {
          setBookingStatus(bookingStatus === 'reserve' ? 'cancel' : 'reserve'); // 예약 상태를 토글
        }

        if (bookingStatus === 'reserve') {
          handleSSE(token, data.data.state);
        }
      } else {
        throw new Error('Failed to make a booking');
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSSE = (token, bookingType) => {
    const eventSource = new EventSourcePolyfill(`http://localhost:8080/api/alarm/shop?bookingType=${bookingType}`, {
      headers: {
        Authorization: token,
      },
      heartbeatTimeout: 86400000,
    });

    eventSource.onmessage = function (event) {
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
