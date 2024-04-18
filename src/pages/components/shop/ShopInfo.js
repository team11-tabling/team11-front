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
      const shop = data.data || [];
      setShop(shop);
    })
    .catch(error => {
      console.error('Error fetching data: ', error);
    });
  }, []);


  if (!shop) {
    return <div>Loading...</div>;
  }

  return (
      <div className="shop-info">
        <h1>{shop.placeName}</h1>
        <br/>
        <p>City: {shop.city} - {shop.address}</p>
        <p>Tell: {shop.phone}</p>
        <p>Open Time: {shop.openTime.toString().substring(0, 5)}</p>
        <p>Close Time: {shop.closeTime.toString().substring(0, 5)}</p>
        <p>Waiting: {shop.waitingNum}</p>
      </div>
  );
}

export default ShopInfo;
