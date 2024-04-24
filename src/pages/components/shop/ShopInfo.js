import React, { useEffect, useState } from "react";

function ShopInfo(props) {
  const [shop, setShop] = useState(null);
  const { shopId } = props;
  const token = localStorage.getItem('Authorization');

  useEffect(() => {
    const requestOptions = {
      method: 'GET',
      headers: {
        Authorization: `${token}`
      }
    };

    fetch(`http://localhost:8080/api/shops/${shopId}`, requestOptions)
    .then(response => response.json())
    .then(data => {
      const shopData = data.data || null; // 데이터가 없을 경우를 대비하여 null로 설정
      setShop(shopData);
    })
    .catch(error => {
      console.error('Error fetching data: ', error);
    });
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
        <p>대기인 수: {shop.waitingNum}</p>
      </div>
  );
}

export default ShopInfo;
