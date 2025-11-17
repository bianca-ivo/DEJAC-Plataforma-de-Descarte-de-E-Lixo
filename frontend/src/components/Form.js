import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebaseConfig";
import axios from "axios";
import React, { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { doc, updateDoc } from "firebase/firestore";




const FormContainer = styled.form`

  display: flex;
  align-items: flex-end;
  gap: 10px;
  flex-wrap: wrap;
  background-color: #fff;
  padding: 20px;
  box-shadow: 0px 0px 5px #ccc;
  border-radius: 5px;
  width: 100%
  margin-left: 20px;
`;

const InputArea = styled.div`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  width: ${({ name }) =>
    name === "nome"
      ? "280px"
      : name === "endereco"
      ? "520px"
      : name === "email"
      ? "280px"
      : name === "fone"
      ? "100px"
      : "200px"};
  padding: 0 10px;
  border: 1px solid #3cb371;
  border-radius: 5px;
  height: 40px;
`;

const Label = styled.label``;

const Button = styled.button`
  padding: 10px;
  cursor: pointer;
  border-radius: 5px;
  border: 1px solid #3cb371;
  background-color: #98fb98;
  color: black;
  font-weight: bold;
  height: 42px;

  &:hover {
    font-size: 14px;
    color: white;
    background-color: black;
  }
`;

const Form = ({ getUsers, onEdit, setOnEdit }) => {

  const ref = useRef();

  useEffect(() => {
    if (onEdit) {
      const point = ref.current;

      point.nome.value = onEdit.nome;
      point.endereco.value = onEdit.endereco;
      point.numero.value = onEdit.numero;
      point.fone.value = onEdit.fone;
      point.email.value = onEdit.email;
      point.cep.value = onEdit.cep;
      point.bairro.value = onEdit.bairro || "";
      point.cidade.value = onEdit.cidade || "";
      point.estado.value = onEdit.estado || "";
    }
  }, [onEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const point = ref.current;

    if (
      !point.nome.value ||
      !point.endereco.value ||
      !point.numero.value ||
      !point.bairro.value ||
      !point.cidade.value ||
      !point.estado.value ||
      !point.fone.value ||
      !point.email.value ||
      !point.cep.value
    ) {
      return toast.warn("Preencha todos os campos");
    }

    try {
    const novoPonto = {
    nome: point.nome.value,
    endereco: point.endereco.value,
    numero: point.numero.value,
    bairro: point.bairro.value,
    cidade: point.cidade.value,
    estado: point.estado.value,
    fone: point.fone.value,
    email: point.email.value,
    cep: point.cep.value,
  };

  if (onEdit && onEdit.id) {
    console.log("Editando ponto com ID:", onEdit.id);
    const docRef = doc(db, "users", onEdit.id);
    await updateDoc(docRef, novoPonto);
    toast.success("Ponto de entrega atualizado com sucesso!");
  } else {
    console.log("Adicionando novo ponto");
    await addDoc(collection(db, "users"), novoPonto);
    toast.success("Ponto de entrega salvo com sucesso!");
    }

} catch (error) {
  console.error("Erro ao salvar ponto:", error);
  return toast.error("Erro ao salvar ponto no servidor.");
}

// 🧼 Limpar os inputs do formulário corretamente:
Array.from(point.elements).forEach((element) => {
  if (element.tagName === "INPUT") {
    element.value = "";
  }
});

setOnEdit(null);
getUsers();
  };

  const handleCepChange = async (e) => {
    const cep = e.target.value.replace(/[^\d]+/g, "");
    const point = ref.current;

    point.cep.value = cep;

    if (cep.length === 8) {
      try {
        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        const data = response.data;

        if (data.erro) {
          return toast.error("CEP não encontrado.");
        }

        point.endereco.value = data.logradouro;
        point.bairro.value = data.bairro;
        point.cidade.value = data.localidade;
        point.estado.value = data.uf;
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
        return toast.error("Erro ao buscar informações do CEP");
      }
    }
  };

  const validateNumberInput = (e) => {
    const value = e.target.value;
    const regex = /^[0-9]*$/;
    if (!regex.test(value)) {
      toast.warn("Apenas números são aceitos.");
      e.target.value = value.replace(/\D/g, ""); // Remove letras
    }
  };

  return (
  <>
    <FormContainer ref={ref} onSubmit={handleSubmit}>
      <InputArea>
        <Label>Nome</Label>
        <Input name="nome" />
      </InputArea>
      <InputArea>
        <Label>CEP</Label>
        <Input name="cep" onChange={handleCepChange} maxLength={8} />
      </InputArea>
      <InputArea>
        <Label>Endereço</Label>
        <Input name="endereco" />
      </InputArea>
      <InputArea>
        <Label>N.º</Label>
        <Input name="numero" onInput={validateNumberInput} />
      </InputArea>
      <InputArea>
        <Label>Bairro</Label>
        <Input name="bairro" />
      </InputArea>
      <InputArea>
        <Label>Cidade</Label>
        <Input name="cidade" />
      </InputArea>
      <InputArea>
        <Label>Estado</Label>
        <Input name="estado" />
      </InputArea>
      <InputArea>
        <Label>Telefone</Label>
        <Input name="fone" onInput={validateNumberInput} />
      </InputArea>
      <InputArea>
        <Label>Email/Site/Rede Social</Label>
        <Input name="email" />
      </InputArea>

      <Button type="submit">SALVAR</Button>
    </FormContainer>
  </>
);

};

export default Form;
