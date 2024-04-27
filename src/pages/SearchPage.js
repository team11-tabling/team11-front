import React, { useState } from 'react';
import './css/SearchPage.css';
import { useNavigate  } from 'react-router-dom';
import PopularShop from './components/shop/PopularShop';

function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const token = localStorage.getItem('Authorization');
  const navigate = useNavigate();
  const [popularShopVisible, setPopularShopVisible] = useState(true); // PopularShop 컴포넌트 표시 여부  const [popularShopVisible, setPopularShopVisible] = useState(true); // PopularShop 컴포넌트 표시 여부

  const handleSearch = (e) => {
    e.preventDefault();

    fetch(`http://localhost:8080/api/shops?search=${query}`,
        {
          method: 'GET', // 또는 'POST', 'PUT', 'DELETE' 등
          credentials: 'include', // 쿠키 정보를 함께 보냄
          headers: {
            'Authorization': token, // 헤더에 Authorization 추가
          }
        })
    .then(response => response.json())
    .then(data => {
      setResults(data.data.documents);
      setPopularShopVisible(false); // PopularShop 숨기기
      console.log('Fetching data with query:', data.data.documents);
    })
    .catch(error => console.error('Error:', error));
  };

  const registerShop = (shopData) => {
    fetch('http://localhost:8080/api/shops', {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(shopData)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Shop registered with ID:', data);
      // 상점 등록 후 상세 페이지로 라우팅
      navigate(`/shop/${data}`);
    })
    .catch(error => console.error('Error registering shop:', error));
  };

  const handleItemClick = (shop) => {
    registerShop(shop);
  };


  return (
      <div className="search-container">
        <h1><strong>식당 검색하기</strong></h1>
        <form onSubmit={handleSearch}>
          <input
              type="text"
              placeholder="검색어를 입력하세요"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="search-input"
          />
          <button type="submit" className="search-button">검색</button>
        </form>
        <div className="results-container">
          {results?.map((result, index) => (
              <div key={index} className="result-item" onClick ={()=> handleItemClick(result)}>
                <h3>{result.place_name}</h3>
                <p>{result.address_name}</p>
                <p>{result.phone}</p>
              </div>
          ))}
        </div>
        <div>
        {popularShopVisible && <PopularShop />}
        </div>
      </div>
  );
}

export default SearchPage;
