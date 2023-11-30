import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect'; // For additional matchers

import AccountArea from '../src/AccountArea';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
};

beforeEach(() => {
  // Clear any previous localStorage mocks
  localStorageMock.getItem.mockClear();

  // Mock localStorage to use the mock functions
  Object.defineProperty(window, 'localStorage', { value: localStorageMock });
});

test('renders loading message and fetches products', async () => {
  // Mock a successful product fetch
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ products: [{ id: 1, name: 'Product 1' }] }),
    })
  );

  render(
    <Router>
      <AccountArea />
    </Router>
