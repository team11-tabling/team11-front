import React, { useEffect, useState } from "react";

function MyFavorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('Authorization');
    const requestOptions = {
      method: 'GET',
      headers: {
        Authorization: `${token}`
      }
    };

    fetch('http://tabling-load-balancer-1692678199.ap-northeast-2.elb.amazonaws.com:8080/api/wishs', requestOptions)
    .then(response => response.json())
    .then(data => {
      // 받아온 데이터에서 'data' 키에 해당하는 배열을 추출
      const favoritesData = data.data || [];
      setFavorites(favoritesData); // 상태 업데이트
    })
    .catch(error => {
      console.error('Error fetching data: ', error);
    });
  }, []);

  return (
      <div className="favorites">
        <h1>내 관심가게</h1>
        <table>
          <thead>
          <tr>
            <th>회원 번호</th>
            <th>가게 번호</th>
          </tr>
          </thead>
          <tbody>
          {favorites.map((favorite, index) => (
              <tr key={index}>
                <td>{favorite.userId}</td>
                <td>{favorite.shopId}</td>
              </tr>
          ))}
          </tbody>
        </table>
      </div>
  );
}

export default MyFavorites;
