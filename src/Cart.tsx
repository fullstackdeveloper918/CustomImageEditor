import React from 'react';
import { useLocation } from 'react-router-dom';

const Cart = () => {
  const location = useLocation();
  const { image } = location.state || {}; // Destructure the image object from state
  console.log(image, "khaskfhdkash");

  return (
    <div>
      <h2>Cart</h2>
      {image ? (
        <div>
          <h3>Selected Image:</h3>
          <img
            src={image.src} // Access src directly
            alt={image.id} // Use the ID for alt text
            style={{
              width: image.width, // Set width
              height: image.height, // Set height
              transform: `rotate(${image.rotation}deg)`, // Rotate as needed
            }}
          />
          <p>ID: {image.id}</p>
          <p>Width: {image.width}</p>
          <p>Height: {image.height}</p>
          <p>Rotation: {image.rotation}°</p>
        </div>
      ) : (
        <p>No image selected.</p>
      )}
    </div>
  );
};

export default Cart;
