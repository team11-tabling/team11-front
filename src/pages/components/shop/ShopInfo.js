import React, { useEffect, useState } from "react";
import {EventSourcePolyfill} from "event-source-polyfill";

function ShopInfo(props) {
  const [shop, setShop] = useState(null);

  const [waitingNum, setWaitingNum] = useState('');

  const { shopId } = props;
  const token = localStorage.getItem('Authorization');

  useEffect(() => {
    const requestOptions = {
      method: 'GET',
      headers: {
        Authorization: `${token}`
      }
    };

    fetch(`https://load.p-hako.com/api/shops/${shopId}`, requestOptions)
    .then(response => response.json())
    .then(data => {
      const shopData = data.data || null; // 데이터가 없을 경우를 대비하여 null로 설정
      const popularShopData = data.data || [];
      setWaitingNum(popularShopData);
      setShop(shopData);
    })
    .catch(error => {
      console.error('Error fetching data: ', error);
    });


    //SSE 연결 설정
    const eventSource = new EventSourcePolyfill(`https://load.p-hako.com/api/shops/waiting-info/${shopId}`, {
      headers: {
        Authorization: token,
      },
      heartbeatTimeout: 86400000,
      withCredentials : true
    });

    eventSource.onmessage = event => {
      console.log(eventSource)
      console.log("대기인 수 " + event.data)
    };
    eventSource.onerror = function(error) {
      console.error('EventSource failed:', error);
      eventSource.close();
    };

    return () => eventSource.close();  // 컴포넌트 언마운트 시 SSE 연결 해제

  }, [shopId, token]); // shopId와 token을 의존성 배열에 추가하여, 해당 값이 변경될 때마다 useEffect가 실행되도록 함


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
        <p>대기인 수: {waitingNum.waitingNum}</p>
      </div>
  );
}

export default ShopInfo;
