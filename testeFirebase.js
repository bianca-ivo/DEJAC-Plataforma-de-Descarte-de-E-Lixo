import { db } from './firebase.js';

async function testConnection() {
  try {
    const testDoc = db.collection('testes').doc('conexao');

    await testDoc.set({
      status: 'conectado',
      timestamp: new Date()
    });

    const doc = await testDoc.get();
    if (doc.exists) {
      console.log('Conexão bem-sucedida!');
      console.log('Dados:', doc.data());
    } else {
      console.log('Documento não encontrado.');
    }
  } catch (error) {
    console.error('Erro na conexão com o Firebase:', error);
  }
}

testConnection();
