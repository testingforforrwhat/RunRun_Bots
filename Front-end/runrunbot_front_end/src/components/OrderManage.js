import React, { useState } from "react";
import GoogleMapComponent from "./GoogleMapComponent";

const orders = [
  {
    id: 1,
    pickup: "1 Market St, San Francisco, CA",
    destination: "Golden Gate Park, San Francisco, CA",
    deliveryMethod: "Robot",
    status: "In process",
    estimatedTime: "12:00pm",
    orderPlacedTime: "9:30am",
    orderDate: "2025-03-28",
  },
  {
    id: 2,
    pickup: "Ferry Building, San Francisco, CA",
    destination: "Twin Peaks, San Francisco, CA",
    deliveryMethod: "Drone",
    status: "Pending",
    estimatedTime: "1:30pm",
    orderPlacedTime: "10:15am",
    orderDate: "2025-03-27",
  },
  {
    id: 3,
    pickup: "Pier 39, San Francisco, CA",
    destination: "San Francisco Zoo, San Francisco, CA",
    deliveryMethod: "Robot",
    status: "Delivered",
    estimatedTime: "11:00am",
    orderPlacedTime: "8:50am",
    orderDate: "2025-03-25",
  },
];

const OrderManage = () => {
  const [routeRequest, setRouteRequest] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setRouteRequest({
      origin: order.pickup,
      destination: order.destination,
      travelMode: "DRIVING",
    });
  };

  return (
    <div style={{ marginTop: "70px", display: "flex", gap: "20px" }}>
      {/* Left Section */}
      <div style={{ flex: 1 }}>
        <h3>Orders:</h3>
        {orders.map((order) => (
          <button
            key={order.id}
            onClick={() => handleOrderClick(order)}
            style={{
              display: "block",
              marginBottom: "10px",
              backgroundColor: order.status !== "Delivered" ? "#e0f0ff" : "",
              padding: "8px",
              borderRadius: "5px",
            }}
          >
            Order #{order.id} | Placed: {order.orderPlacedTime} | Date:{" "}
            {order.orderDate}
          </button>
        ))}

        {/* Display selected order details */}
        {selectedOrder && (
          <div
            style={{
              marginTop: "20px",
              padding: "10px",
              border: "1px solid #ccc",
            }}
          >
            <h4>Selected Order:</h4>
            <p>
              <strong>Sending from:</strong> {selectedOrder.pickup}
            </p>
            <p>
              <strong>Deliver to:</strong> {selectedOrder.destination}
            </p>
            <p>
              <strong>Delivery Method:</strong> {selectedOrder.deliveryMethod}
            </p>
            <p>
              <strong>Status:</strong> {selectedOrder.status}
            </p>
            <p>
              <strong>Estimated time:</strong> {selectedOrder.estimatedTime}
            </p>
            <p>
              <strong>Order placed time:</strong>{" "}
              {selectedOrder.orderPlacedTime}
            </p>
            <p>
              <strong>Order date:</strong> {selectedOrder.orderDate}
            </p>
          </div>
        )}
      </div>

      {/* Right Section */}
      <div style={{ flex: 2 }}>
        <GoogleMapComponent
          routeRequest={routeRequest}
          deliveryMethod={selectedOrder?.deliveryMethod}
        />
      </div>
    </div>
  );
};

export default OrderManage;
