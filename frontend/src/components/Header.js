import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const HeaderContainer = styled.header`
  width: 100vw;
  max-width: 100%;
  background-color:rgb(248, 248, 248);
  padding: 1rem 5vw;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem 2vw;
  }
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.5rem;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const LogoutButton = styled.button`
  background-color: white;
  color: #3cb371;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  padding: 0.6rem 1rem;
  cursor: pointer;
  transition: 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background-color: #2e8b57;
    color: white;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/"); // Redireciona para homepage
  };

  return (
    <HeaderContainer>
      <LogoutButton onClick={handleLogout}>Sair</LogoutButton>
    </HeaderContainer>
  );
};

export default Header;
