import express from 'express';
import cors from 'cors';

// importação da inicialização do Firebase (apenas se necessário)
import './firebase.js'; // apenas importa para garantir a inicialização, sem reinicializar

const app = express();
const PORT = process.env.PORT || 8800;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Servidor está funcionando!');
});

// Suas rotas

// Se quiser ativar rotas de usuários no futuro, é só descomentar:
// import { addUserController, deleteUserController, getUsers, updateUserController } from './controllers/userController.js';
// app.get('/api/users', getUsers);
// app.post('/api/users', addUserController);
// app.put('/api/users/:id', updateUserController);
// app.delete('/api/users/:id', deleteUserController);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
