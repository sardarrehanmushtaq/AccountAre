import React, { useReducer, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

// Define action types for the reducer
const actionTypes = {
  FETCH_PRODUCTS_SUCCESS: 'FETCH_PRODUCTS_SUCCESS',
  FETCH_PRODUCTS_FAILURE: 'FETCH_PRODUCTS_FAILURE',
  SET_USER: 'SET_USER',
};

// Reducer function to manage component state
const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.FETCH_PRODUCTS_SUCCESS:
      return { ...state, products: action.payload, loading: false, error: null };
    case actionTypes.FETCH_PRODUCTS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case actionTypes.SET_USER:
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

const AccountArea = () => {
  const navigate = useNavigate();

  // Initialize state using useReducer
  const [state, dispatch] = useReducer(reducer, {
    user: null,
    products: [],
    loading: true,
    error: null,
  });

  // Fetch products and update state accordingly
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
          const errorMessage = await response.text();
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorMessage}`);
        }

        const data = await response.json();
        dispatch({ type: actionTypes.FETCH_PRODUCTS_SUCCESS, payload: data.products });
      } catch (error) {
        console.error('Error fetching products:', error);
        dispatch({ type: actionTypes.FETCH_PRODUCTS_FAILURE, payload: error.message });
      }
    };

    fetchProducts();
  }, []);

  // Check user token and navigate to login if not present
  useEffect(() => {
    const token = localStorage.getItem('productly');
    if (!token) {
      navigate('/login');
    } else {
      dispatch({ type: actionTypes.SET_USER, payload: jwt_decode(token) });
    }
  }, [navigate]);

  const calculateProgressBarWidth = () => {
    const maxProducts = Math.max(1, state.products.length);
    return (state.products.length / maxProducts) * 100;
  };

  return (
    <div>
      {state.error && (
        <div style={{ color: 'red', border: '1px solid red', padding: '8px', marginBottom: '10px' }}>
          <strong>Error:</strong> {state.error}
        </div>
      )}
      {state.loading && <p>Loading...</p>}

      <div>
        {state.products.map((product) => (
          <div key={product.id}>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
          </div>
        ))}
      </div>
      <div style={{ width: `${calculateProgressBarWidth()}%` }}>Progress Bar</div>
    </div>
  );
};

export default AccountArea;
