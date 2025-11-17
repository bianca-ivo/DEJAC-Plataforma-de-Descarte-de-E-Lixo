import { collection, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import Grid from "./components/Grid";
import ImageComponent from "./components/ImageComponent";
import ImageRComponent from "./components/ImageRComponent";
import ImageREComponent from "./components/ImageREComponent";
import Rodape from "./components/Rodape";
import { db } from "./firebaseConfig";
import GlobalStyle from "./styles/global";


function User() {
  const [users, setUsers] = useState([]);
  const [onEdit, setOnEdit] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const usersList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersList.sort((a, b) => (a.nome > b.nome ? 1 : -1)));
    }, (error) => {
      toast.error("Erro ao carregar usuários: " + error.message);
    });

    return () => unsubscribe(); 
  }, []);

  const Table = styled.table`
  background-color: #fff;
  padding: 20px;
  box-shadow: 0px 0px 5px #ccc;
  border-radius: 5px;
  margin: 20px auto;
  word-break: break-all;
  margin-right: 3%;
  margin-top: 30px;
  width: -webkit-fill-available;
`;

const Thead = styled.thead``;

const Tbody = styled.tbody``;

const Tr = styled.tr``;

const Th = styled.th`
  text-align: start;
  border-bottom: inset;
  padding-bottom: 5px;
  font-size: 14px;

  @media (max-width: 500px) {
      ${(props) => props.onlyWeb && "display: none"}
  }
`;

const Container = styled.div`
  width: 100%;
  max-width: 1200px; 
  margin: 20px auto; 
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 0 20px; 
`;

const Title = styled.p`
  font-size: 16px;  
  margin-top: 20px;
  text-align: center;
`;

const Title1 = styled.h2`
  color: #3CB371;
  font-size: 25px;
`;

const Title2 = styled.p`
  font-size: 16px;  
  margin-top: 20px;
  margin-bottom: 20px;
  text-align: center;
`;

const Title3 = styled.h2`
  color: #3CB371;
  font-size: 22px;
`;

const Title4 = styled.p`
  font-size: 16px;  
  margin-top: 20px;
  text-align: justify;
`;

const Title5 = styled.p`
  color: #3CB371;
  font-size: 20px;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const Td = styled.td`
  padding-top: 15px;
  padding-right:20px;
  text-align: ${(props) => (props.alignCenter ? "center" : "start")};
  width: ${(props) => (props.width ? props.width : "auto")};

  @media (max-width: 500px) {
      ${(props) => props.onlyWeb && "display: none"}
  }
`;

  return (
    <>
    <Container>
    <ImageComponent />
      <Title>Se você tem um computador, celular ou tablet que não utiliza mais, saiba que existem formas corretas e ecológicas de destinar esses tipos de produtos</Title>
      <Title1>Não descarte no lixo comum</Title1>
      <Title2>Reunimos os endereços e contatos de empresas localizadas na cidade de Jacareí, e também, dos serviços públicos para que você possa ter em mãos essas informacões úteis sempre que precisar!</Title2>
      <Grid users={users} setUsers={setUsers} setOnEdit={setOnEdit} hideIcons={true} />
      <Title>Confira na tabela abaixo alguns exemplos de produtos que podem ser reciclados:</Title>
      <Table>
            <Thead>
                <Tr>
                    <Th>Grandes equipamentos</Th>
                    <Th>Pequenos equipamentos e eletroportáteis</Th>
                    <Th>Equipamentos de informática e telefonia</Th>
                    <Th>Pilhas e baterias portáteis</Th>
                </Tr>
            </Thead>
            <Tbody>
                    <Tr>
                        <Td>geladeiras</Td>
                        <Td>câmeras digitais</Td>
                        <Td>computadores</Td>
                        <Td>pilhas (AA, AAA, C/D)</Td>
                    </Tr>
                    <Tr>
                        <Td>máquinas de lavar</Td>
                        <Td>rádios</Td>
                        <Td>tablets</Td>
                        <Td>recarregáveis</Td>
                    </Tr>
                    <Tr>
                        <Td>fogões</Td>
                        <Td>secadores de cabelo</Td>
                        <Td>notebooks</Td>
                        <Td>baterias portáteis</Td>
                    </Tr>
                    <Tr>
                        <Td>ar condicionados</Td>
                        <Td>ventiladores</Td>
                        <Td>celulares</Td>
                        <Td></Td>
                    </Tr>
                    <Tr>
                        <Td>microondas</Td>
                        <Td>torradeiras</Td>
                        <Td>impressoras</Td>
                        <Td></Td>
                    </Tr>
            </Tbody>
        </Table>
        <Title3>Saiba mais sobre reciclagem de eletrônicos!</Title3>
        <Title4>
        Pesquisas e relatórios desenvolvidos por entidades voltadas ao fomento das boas práticas de sustentabilidade apontam para uma crescente no número de equipamentos eletrônicos que são descartados incorretamente no meio ambiente, e também, para as consequências que esse tipo de situação causa ao planeta e à saúde de pessoas e animais.<br></br><br></br> 
        O relatório referente ao ano de 2019 <a href="https://news.un.org/pt/story/2022/01/1777952">The Global E-waste Monitor</a>, da Universidade das Nações Unidas (ONU), apresentou dados sobre descarte de lixo eletrônico no mundo, sendo contabilizados mais 53 milhões de toneladas de equipamentos eletroeletrônicos e pilhas descartadas somente naquele ano, sendo que menos de 3% desse total foi devidamente reciclado.<br></br><br></br>No Brasil, a <a href="https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2010/lei/l12305.htm">Lei 12.305/2010</a> dispõe sobre a destinação correta do lixo eletrônico e define metas para que fabricantes, importadores, distribuidores e comerciantes disponibilizem pontos de Entrega Voluntária e, assim, promovam a logística reversa de suas atividades comerciais. 
        O chumbo, por exemplo, pode desencadear no indivíduo quadros de diarreia, vômitos e convulsões, podendo levar o indivíduo ao coma ou a óbito.
        </Title4>
     
        <Title4>
        Os metais que podem ser provenientes dos e-lixos são classificados como:
        Elementos essenciais: sódio, potássio, cálcio, ferro, zinco, cobre, níquel e magnésio, Micro contaminantes ambientais: arsênico, chumbo, cádmio, mercúrio, alumínio, titânio, estanho e tungstênio, Elementos essenciais e simultaneamente micro contaminantes: cromo, zinco, ferro, cobalto, manganês e níquel.

        </Title4>
        <Title4>
        Na cidade de Jacareí, a gestão municipal, por meio da Secretaria de Meio Ambiente, disponibiliza à população os <a href="https://www.jacarei.sp.gov.br/tag/levs/">Locais de Entrega Voluntária (LEVs)</a>, que são pontos localizados estrategicamente no município aptos a receber e destinar corretamente diversos tipos de resíduos, eletroeletrônicos, eletrodomésticos e sucata em geral.

        </Title4>

        <Title5>
            Portanto, <strong>RECICLE</strong>, faça sua parte e ajude a compartilhar essa atitude no seu bairro!
        </Title5>
        <ImageRComponent />
    </Container>
    <ToastContainer autoClose={3000} position="bottom-left" />
      <GlobalStyle />
      <Rodape />
    </>
  );
}

export default User;