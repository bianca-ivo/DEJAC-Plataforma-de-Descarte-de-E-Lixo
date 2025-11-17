import { deleteDoc, doc } from "firebase/firestore";
import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import styled from "styled-components";
import { db } from "../firebaseConfig";

const Table = styled.table`
  background-color: #fff;
  padding: 20px;
  box-shadow: 0px 0px 5px #ccc;
  border-radius: 5px;
  margin: 20px auto;
  margin-right: 3%;
  margin-top: 0px;
  width: -webkit-fill-available;
`;

export const Thead = styled.thead``;

export const Tbody = styled.tbody``;

export const Tr = styled.tr``;

export const Th = styled.th`
  text-align: start;
  border-bottom: inset;
  padding-bottom: 5px;
  word-wrap: break-word;
  white-space: normal;

  @media (max-width: 500px) {
    ${(props) => props.onlyWeb && "display: none"}
  }
`;

const Td = styled.td`
  padding-top: 15px;
  padding-right: 20px;
  text-align: ${(props) => (props.alignCenter ? "center" : "start")};
  width: ${(props) => (props.width ? props.width : "auto")};
  max-width: 200px;
  overflow: visible;
  text-overflow: clip;
  white-space: normal;
  overflow-wrap: break-word; // Adicione isso para quebra de linha adequada

  @media (max-width: 500px) {
    ${(props) => props.onlyWeb && "display: none"}
  }
`;

const TrashIcon = styled(FaTrash)`
  cursor: pointer;
  &:hover {
    color: red;
  }
`;

const EditIcon = styled(FaEdit)`
  cursor: pointer;
  &:hover {
    color: orange;
  }
`;

const Grid = ({ users, setUsers, setOnEdit, hideIcons }) => {
  const handleEdit = (item) => {
    setOnEdit(item);
  };

  const handleDelete = async (id) => {
    try {
      const docRef = doc(db, "users", id);

      await deleteDoc(docRef);

      const newArray = users.filter((point) => point.id !== id);
      setUsers(newArray);

      toast.success("Registro excluído com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir registro: " + error.message);
    }

    setOnEdit(null);
  };

  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Nome</Th>
          <Th>Endereço</Th>
          <Th>N.º</Th>
          <Th>Bairro</Th>
          <Th>Cidade</Th>
          <Th>Estado</Th>
          <Th onlyWeb>Telefone</Th>
          <Th>Email/Site/Rede Social</Th>
          {hideIcons ? null : <Th></Th>}
          {hideIcons ? null : <Th></Th>}
        </Tr>
      </Thead>
      <Tbody>
        {users.map((item, i) => (
          <Tr key={i}>
            <Td width="15%" style={{ maxWidth: "100px" }}>
              {item.nome}
            </Td>
            <Td width="20%" style={{ maxWidth: "100px" }}>
              {item.endereco}
            </Td>
            <Td width="5%" style={{ maxWidth: "50px" }}>
              {item.numero}
            </Td>
            <Td width="10%" style={{ maxWidth: "90px" }}>
              {item.bairro}
            </Td>
            <Td width="10%" style={{ maxWidth: "90px" }}>
              {item.cidade}
            </Td>
            <Td width="10%" style={{ maxWidth: "70px" }}>
              {item.estado}
            </Td>
            <Td width="12%" onlyWeb style={{ maxWidth: "60px" }}>
              {item.fone}
            </Td>
            <Td width="20%" style={{ maxWidth: "100px" }}>
              <a
                href={
                  item.email.startsWith("http")
                    ? item.email
                    : item.email.includes("@")
                    ? `mailto:${item.email}`
                    : `https://${item.email}`
                }
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  overflowWrap: "break-word",
                  cursor: "pointer",
                }}
              >
                <span
                  style={{ fontWeight: "normal" }}
                  onMouseEnter={(e) => (e.target.style.fontWeight = "bold")}
                  onMouseLeave={(e) => (e.target.style.fontWeight = "normal")}
                >
                  {item.email}
                </span>
              </a>
            </Td>

            {hideIcons ? null : (
              <>
                <Td alignCenter width="5%">
                  <EditIcon onClick={() => handleEdit(item)} />
                </Td>
                <Td alignCenter width="5%">
                  <TrashIcon onClick={() => handleDelete(item.id)} />
                </Td>
              </>
            )}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default Grid;
