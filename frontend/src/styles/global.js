import { createGlobalStyle } from "styled-components";

const Global = createGlobalStyle`

* {
    margin: 0;
    padding: 0;
    font-family: 'poppins', sans-serif;
}

body {
    width: 100vw;
    height: 100vh;
    display: contents;
    justify-content: center;
    background-color: #f2f2f2;
    margin-left: 20px;
}
`;

export default Global;