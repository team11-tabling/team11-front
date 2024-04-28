import React, { useEffect, useState } from "react";
import { EventSourcePolyfill } from "event-source-polyfill";

function ShopInfo(props) {
  const [shop, setShop] = useState(null);
  const [waitingNum, setWaitingNum] = useState(0); // 초기값을 숫자로 설정

  const { shopId } = props;
  const token = localStorage.getItem('Authorization');

  useEffect(() => {
    const requestOptions = {
      method: 'GET',
      headers: { Authorization: `${token}` }
    };

    fetch(`https://load.p-hako.com/api/shops/${shopId}`, requestOptions)
      .then(response => response.json())
      .then(data => {
        const shopData = data.data || null;
        setShop(shopData);
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
      });

    // SSE 연결 설정
    const eventSource = new EventSourcePolyfill(`https://load.p-hako.com/api/shops/waiting-info/${shopId}`, {
      headers: { Authorization: token },
      heartbeatTimeout: 86400000,
      withCredentials: true
    });

    eventSource.onmessage = event => {
      const data = JSON.parse(event.data);
      setWaitingNum(data.waitingNum); // JSON에서 waitingNum 필드를 참조하여 상태 업데이트
    };

    eventSource.onerror = function(error) {
      console.error('EventSource failed:', error);
      eventSource.close();
    };

    return () => eventSource.close();  // 컴포넌트 언마운트 시 SSE 연결 해제

  }, [shopId, token]);

  if (!shop) {
    return <div>Loading...</div>;
  }

  return (
      <div className="shop-info">
        <h1>{shop.placeName}</h1>
        <br/>
        <p>주소: {shop.city} - {shop.address}</p>
        <p>전화번호: {shop.phone}</p>
        <p>오픈 시간: {shop.openTime.toString().substring(0, 5)}</p>
        <p>마감 시간: {shop.closeTime.toString().substring(0, 5)}</p>
        <p>대기인 수: {waitingNum}</p>
      </div>
  );
}

export default ShopInfo;
