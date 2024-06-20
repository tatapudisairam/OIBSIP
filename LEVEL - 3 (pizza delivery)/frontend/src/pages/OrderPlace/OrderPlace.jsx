import React, { useContext, useEffect, useState } from 'react'
import './OrderPlace.css'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

const OrderPlace = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext)

  const [data, setData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  })

  const onChangeHandler = (event) => {
    const { name, value } = event.target
    setData(data => ({ ...data, [name]: value }))
  }

  const placeOrder = async (event) => {
    event.preventDefault();
    let orderItems = [];
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = { ...item, quantity: cartItems[item._id] };
        orderItems.push(itemInfo);
      }
    });
  
    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2,
    };
  
    try {
      console.log("Order Data: ", orderData);
      let response = await axios.post(`${url}/api/order/place`, orderData, { headers: { token } });
      console.log("Response: ", response);
      if (response.data.success) {
        const { order_id, currency, amount } = response.data;
        const options = {
          key: "rzp_test_2hpYUWR0FPBlGx",
          amount: amount,
          currency: currency,
          name: "Pizza Delivery",
          description: "Test Transaction",
          order_id: order_id,
          handler: async function (response) {
            const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;
            const verifyResponse = await axios.post(`${url}/api/order/verify`, {
              orderId: order_id,
              razorpayPaymentId: razorpay_payment_id,
              razorpayOrderId: razorpay_order_id,
              razorpaySignature: razorpay_signature
            });
            if (verifyResponse.data.success) {
              navigate("/myorders");
            } else {
              alert("Error: " + verifyResponse.data.message);
            }
          },
          prefill: {
            name: `${data.firstname} ${data.lastname}`,
            email: data.email,
            contact: data.phone
          },
          notes: {
            address: `${data.street}, ${data.city}, ${data.state}, ${data.zipcode}, ${data.country}`
          },
          theme: {
            color: "#3399cc"
          }
        };
        const razorpayObject = new window.Razorpay(options);
        razorpayObject.open();
      } else {
        alert("Error: " + response.data.message);
      }
    } catch (error) {
      console.error("Order placement error: ", error);
      alert("Error placing order. Please try again.");
    }
  };

  const navigate = useNavigate();

  useEffect(()=>{
    if(!token){
      navigate("/cart");
    }else if(getTotalCartAmount()==0){
      navigate("/cart");
    }
  }, [token])

  return (
    <form onSubmit={placeOrder} className='place-order'>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input required name='firstname' onChange={onChangeHandler} value={data.firstname} type="text" placeholder='First Name' />
          <input required name='lastname' onChange={onChangeHandler} value={data.lastname} type="text" placeholder='Last Name' />
        </div>
        <input required name='email' onChange={onChangeHandler} value={data.email} type='email' placeholder='Email' />
        <input required name='street' onChange={onChangeHandler} value={data.street} type='text' placeholder='Street' />
        <div className="multi-fields">
          <input required name='city' onChange={onChangeHandler} value={data.city} type='text' placeholder='City' />
          <input required name='state' onChange={onChangeHandler} value={data.state} type='text' placeholder='State' />
        </div>
        <div className="multi-fields">
          <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} type='text' placeholder='Zip code' />
          <input required name='country' onChange={onChangeHandler} value={data.country} type='text' placeholder='Country' />
        </div>
        <input required name='phone' onChange={onChangeHandler} value={data.phone} type='text' placeholder='Phone' />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
            </div>
          </div>
          <button type='submit'>PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  )
}

export default OrderPlace
