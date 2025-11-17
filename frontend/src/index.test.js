import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import HomePage from './components/Home';
import User from './User';

describe('App Router', () => {
  test('renders HomePage at / route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/usuario" element={<User />} />
          <Route path="/administrador" element={<App />} />
        </Routes>
      </MemoryRouter>
    );

    const homeElement = screen.getByText(/home/i); 
    expect(homeElement).toBeInTheDocument();
  });

  test('renders User at /usuario route', () => {
    render(
      <MemoryRouter initialEntries={['/usuario']}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/usuario" element={<User />} />
          <Route path="/administrador" element={<App />} />
        </Routes>
      </MemoryRouter>
    );

    const userElement = screen.getByText(/usuário/i); 
    expect(userElement).toBeInTheDocument();
  });

  test('renders App at /administrador route', () => {
    render(
      <MemoryRouter initialEntries={['/administrador']}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/usuario" element={<User />} />
          <Route path="/administrador" element={<App />} />
        </Routes>
      </MemoryRouter>
    );

    const appElement = screen.getByText(/admin/i); 
    expect(appElement).toBeInTheDocument();
  });
});
