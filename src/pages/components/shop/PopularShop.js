import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const PopularShop = () => {
  const [popularShops, setPopularShops] = useState([]);
  const token = localStorage.getItem('Authorization');

  useEffect(() => {
    const requestOptions = {
      method: 'GET',
      headers: {
        Authorization: `${token}`
      }
    };

    fetch(`https://load.p-hako.com/api/shops/popular`, requestOptions)
    .then(response => response.json())
    .then(data => {
      const popularShopData = data.data || [];
      console.log(popularShopData)
      setPopularShops(popularShopData);
    })
    .catch(error => {
      console.error('Error fetching data: ', error);
    });
  }, [token]); 

  return (
    <div className="popular">
      <h1>인기 가게 목록</h1>
      <div className="shop-list">
        {popularShops.slice(0, 3).map((popularShop) => (
          <div key={popularShop.shopId} className="shop-item" >
            <Link to={`/shop/${popularShop.id}`} className='shop-link'>
            <h4>{popularShop.placeName}</h4>
            <ul> 
              
              <li>{popularShop.address}</li>
              <li>{popularShop.phone}</li>
              <li>오픈 : {popularShop.openTime}</li>
              <li>마감 : {popularShop.closeTime}</li>
              <li>대기 팀 : {popularShop.waitingNum || 0}</li>
            </ul>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );  
}

export default PopularShop;
