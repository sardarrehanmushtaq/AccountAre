// src/AccountArea.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

const AccountArea = () => {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('productly');
        const response = await fetch('https://api.productly.app/products', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    // Cleanup function to cancel the fetch when the component unmounts
    return () => {
      // Add any cleanup logic, such as aborting the fetch if necessary
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('productly');
    if (!token) {
      navigate('/login');
    } else {
      const decodedUser = jwt_decode(token);
      setUser(decodedUser);
    }
  }, [navigate]);

  // Corrected implementation of progress bar width calculation
  const progressBarWidth = () => {
    const maxProducts = 50; // Hardcoded value
    return (products.length / maxProducts) * 100;
  };

  return (
    <div>
      {error && <p>Error: {error}</p>}
      {loading && <p>Loading...</p>}
      <div>
        {products.map((product) => (
          <div key={product.id}>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
          </div>
        ))}
      </div>
      <div style={{ width: `${progressBarWidth()}%` }}>Progress Bar</div>
    </div>
  );
};

export default AccountArea;
