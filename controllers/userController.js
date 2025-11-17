import { addUser, deleteUser, getAllUsers, updateUser } from "./model/User.js";

export const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const addUserController = async (req, res) => {
  const { nome, cep, endereco, numero, bairro, cidade, estado, fone, email } = req.body;

  try {
    const userId = await addUser({
      nome,
      cep,
      endereco,
      numero,
      bairro,
      cidade,
      estado,
      fone,
      email,
    });
    return res.status(201).json({ message: "Usuário criado com sucesso.", id: userId });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const updateUserController = async (req, res) => {
  const { id } = req.params;
  const { nome, cep, endereco, numero, bairro, cidade, estado, fone, email } = req.body;

  try {
    await updateUser(id, {
      nome,
      cep,
      endereco,
      numero,
      bairro,
      cidade,
      estado,
      fone,
      email,
    });
    return res.status(200).json("Usuário atualizado com sucesso.");
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const deleteUserController = async (req, res) => {
  const { id } = req.params;

  try {
    await deleteUser(id);
    return res.status(200).json("Usuário deletado com sucesso.");
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
