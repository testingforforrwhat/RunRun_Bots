import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { Form, Button, ButtonGroup, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AddressValidator from "./AddressInputValidator";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 37.7749,
  lng: -122.4194,
};

function CreateNewOrder() {
  const navigate = useNavigate();

  // --- Form states ---
  const [itemDescription, setItemDescription] = useState("");
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [pickupLatLng, setPickupLatLng] = useState(null);
  const [destinationLatLng, setDestinationLatLng] = useState(null);
  const [deliveryMethod, setDeliveryMethod] = useState("Robot");
  const [paymentMethod, setPaymentMethod] = useState("");

  // --- UI states ---
  const [errorMsg, setErrorMsg] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [orderId, setOrderId] = useState("");

  // --- Validation States ---
  const [pickupValidated, setPickupValidated] = useState(false);
  const [destinationValidated, setDestinationValidated] = useState(false);

  // --- Bill & ETA ---
  const [estimatedTime, setEstimatedTime] = useState("--");
  const [bill, setBill] = useState("--");

  // --- New confirm modal state ---
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // --- Fake geocoder ---
  const toLatLng = (address) => {
    const fakePositions = {
      "1 Market St": { lat: 37.7936, lng: -122.395 },
      "Golden Gate Park": { lat: 37.7694, lng: -122.4862 },
      "Ferry Building": { lat: 37.7955, lng: -122.3937 },
      "Twin Peaks": { lat: 37.7544, lng: -122.4477 },
      "Pier 39": { lat: 37.8087, lng: -122.4098 },
      "San Francisco Zoo": { lat: 37.7325, lng: -122.503 },
    };
    return fakePositions[address] || null;
  };

  // --- Handle Confirm Payment ---
  const handleConfirmPayment = () => {
    if (
      !itemDescription ||
      !pickup ||
      !destination ||
      !deliveryMethod ||
      !paymentMethod
    ) {
      setErrorMsg("Please complete the information above.");
      return;
    }

    // reset error and generate order
    setErrorMsg("");
    setOrderId("ORD-" + Math.floor(100000 + Math.random() * 900000)); // fake order id
    setShowSuccessModal(true);
    setCountdown(5);
  };
  // --- Bill and ETA display logic ---
  useEffect(() => {
    if (pickupValidated && destinationValidated) {
      if (deliveryMethod === "Robot") {
        setBill("$20.00");
        setEstimatedTime("2h 00min");
      } else if (deliveryMethod === "Drone") {
        setBill("$40.00");
        setEstimatedTime("1h 00min");
      }
    } else {
      setBill("--");
      setEstimatedTime("--");
    }
  }, [pickupValidated, destinationValidated, deliveryMethod]);
  // --- Countdown effect ---
  useEffect(() => {
    if (!showSuccessModal) return;
    if (countdown === 0) {
      navigate("/ordermanage");
      return;
    }
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, showSuccessModal, navigate]);

  // --- New functions for manage orders confirm ---
  const handleManageOrdersClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmNavigation = () => {
    setShowConfirmModal(false);
    navigate("/ordermanage");
  };

  return (
    <div
      style={{
        display: "flex",
        marginTop: "70px",
        padding: "20px",
        gap: "20px",
      }}
    >
      {/* Left Side */}
      <div style={{ flex: 1 }}>
        <h3>Create New Order</h3>

        {/* Item Description */}
        <Form.Group className="mb-3">
          <Form.Label>Item Description</Form.Label>
          <Form.Control
            type="text"
            placeholder="e.g., Electronics"
            value={itemDescription}
            onChange={(e) => setItemDescription(e.target.value)}
          />
        </Form.Group>

        <AddressValidator
          label="Sending Location"
          address={pickup}
          setAddress={(v) => {
            setPickup(v);
            setPickupValidated(false);
          }} // reset when user types
          setLatLng={(latlng) => {
            setPickupLatLng(latlng);
            setPickupValidated(true);
          }}
        />

        <AddressValidator
          label="Delivery Location"
          address={destination}
          setAddress={(v) => {
            setDestination(v);
            setDestinationValidated(false);
          }} // reset when user types
          setLatLng={(latlng) => {
            setDestinationLatLng(latlng);
            setDestinationValidated(true);
          }}
        />

        {/* Delivery Method */}
        <Form.Group className="mb-3">
          <Form.Label>Delivery Method</Form.Label>
          <div>
            <ButtonGroup>
              {["Robot", "Drone"].map((method) => (
                <Button
                  key={method}
                  variant={
                    deliveryMethod === method ? "primary" : "outline-primary"
                  }
                  onClick={() => setDeliveryMethod(method)}
                >
                  {method}
                </Button>
              ))}
            </ButtonGroup>
          </div>
        </Form.Group>

        <hr />

        {/* Bill & ETA */}
        <div style={{ marginBottom: "20px" }}>
          <p>
            <strong>Bill to Pay:</strong> {bill}
          </p>
          <p>
            <strong>Estimated Time:</strong> {estimatedTime}
          </p>
        </div>

        {/* Payment Method */}
        <Form.Group className="mb-3">
          <Form.Label>Payment Method</Form.Label>
          <div>
            <ButtonGroup>
              {["Credit Card", "PayPal", "Venmo"].map((method) => (
                <Button
                  key={method}
                  variant={
                    paymentMethod === method ? "primary" : "outline-primary"
                  }
                  onClick={() => setPaymentMethod(method)}
                >
                  {method}
                </Button>
              ))}
            </ButtonGroup>
          </div>
        </Form.Group>

        {/* Confirm Payment */}
        <Button
          variant="success"
          style={{ width: "100%" }}
          onClick={handleConfirmPayment}
        >
          Confirm Payment
        </Button>

        {/* Error Message */}
        {errorMsg && (
          <div style={{ color: "red", marginTop: "10px" }}>{errorMsg}</div>
        )}
      </div>

      {/* Right Side */}
      <div
        style={{
          flex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <LoadScript
          googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        >
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={12}
            options={{ streetViewControl: false }}
          >
            {/* ✅ Marker A for pickup */}
            {pickupLatLng && <Marker position={pickupLatLng} label="A" />}

            {/* ✅ Marker B for delivery */}
            {destinationLatLng && (
              <Marker position={destinationLatLng} label="B" />
            )}
          </GoogleMap>
        </LoadScript>

        {/* Manage Orders Button */}
        <Button
          variant="secondary"
          style={{ marginTop: "20px", width: "200px" }}
          onClick={handleManageOrdersClick}
        >
          Manage My Orders
        </Button>
      </div>

      {/* Success Modal */}
      <Modal show={showSuccessModal} centered>
        <Modal.Header>
          <Modal.Title>Payment Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Payment Success!
          <br />
          Your order ID is <strong>{orderId}</strong>.<br />
          Navigating to home page in {countdown}...
        </Modal.Body>
      </Modal>

      {/* Confirm Navigation Modal */}
      <Modal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Leave This Page?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          The current new order progress will not be saved.
          <br />
          Are you sure you want to go back to the home page?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmModal(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmNavigation}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default CreateNewOrder;
