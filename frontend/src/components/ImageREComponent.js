import React from "react";
import styled from "styled-components";

const Image = styled.img`
  width: 500px; 
  height: auto; 
  margin-top: 10px; 
`;

const ImageREComponent = () => {
  return <Image src="/imagens/reciclar-lixo-eletronico.jpg" alt="Recicle" />;
};

export default ImageREComponent;