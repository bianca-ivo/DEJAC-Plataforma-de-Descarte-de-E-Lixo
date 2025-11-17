import React from "react";
import styled from "styled-components";

const Image = styled.img`
  width: 120px; 
  height: auto; 
  margin-top: 10px; 
`;

const ImageComponent = () => {
  return <Image src="/imagens/recycle-bin.png" alt="Recicle" />;
};

export default ImageComponent;