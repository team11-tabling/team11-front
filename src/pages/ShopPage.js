import React, {useState} from 'react';
import { useParams } from 'react-router-dom';
import "./css/ShopPage.css"
import ShopReviews from "./components/shop/ShopReviews";
import ShopInfo from "./components/shop/ShopInfo";
import Bookings from "./components/shop/ShopBooking";
import ReviewForm from "./components/shop/ReviewForm";



function ShopPage() {
  const { id } = useParams(); // 동적인 값을 받아옴

  const [refreshReviews, setRefreshReviews] = useState(false);

  const triggerRefresh = () => {
    console.log("Refresh")
    setRefreshReviews(prev => !prev);
  };

  return (
      <div>
        <ShopInfo shopId={id}></ShopInfo>
        <Bookings shopId={id}></Bookings>
        <ReviewForm shopId={id} onReviewSubmit={triggerRefresh}/>
        <ShopReviews shopId={id} refreshTrigger={refreshReviews}></ShopReviews>
      </div>
  );
}

export default ShopPage;
