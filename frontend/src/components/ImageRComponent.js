import React from "react";
import styled from "styled-components";

const Image = styled.img`
  width: 120px; 
  height: auto; 
  margin-top: 10px; 
  margin-bottom: 100px;
`;

const ImageRComponent = () => {
  return <Image src="/imagens/renewable-energy.png" alt="Recicle" />;
};

export default ImageRComponent;