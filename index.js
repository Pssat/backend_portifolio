const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const serviceAccount = require('./Chave-Firebase.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const bd = admin.firestore();
const app = express();
const porta = 3000;

app.use(cors());
app.use(express.json());

// Rota GET
app.get('/fds', async (req, res) => {
  try {
    const response = await bd.collection('cartoes').get();
    if (response.empty) {
      console.log('Nenhum cartão encontrado.');
      return res.status(404).json({ mensagem: 'Nenhum cartão encontrado' });
    }
    const vetor = response.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log('Dados retornados com sucesso:', vetor);
    res.status(200).json({ vetor });
  } catch (e) {
    console.error('Erro ao buscar dados:', e);
    res.status(500).json({ mensagem: 'Erro: ' + e.message });
  }
});



// // Rota POST
// app.post('/fds', async (req, res) => {
//     try {
//         const { nome, img } = req.body;
//         if (!nome || !img) {
//             return res.status(400).json({ erro: 'Campos nome e img são obrigatórios' });
//         }
//         if (typeof nome !== 'string' || typeof img !== 'string') {
//             return res.status(400).json({ erro: 'Campos nome e img devem ser strings' });
//         }
//         const novoDoc = await bd.collection('cartoes').add({
//             mensagem: nome,
//             numero: img
//         });
//         console.log(`Documento adicionado com ID: ${novoDoc.id}`);
//         res.status(201).json({ mensagem: 'Documento adicionado com sucesso', id: novoDoc.id });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ erro: 'Erro interno no servidor' });
//     }
// });

// // Rota DELETE
// app.delete('/fds', async (req, res) => {
//     // Log para verificar o corpo da requisição
//     console.log('Requisição DELETE recebida:', req.body);

//     try {
//         // Desestruturação do ID do corpo da requisição
//         const { id } = req.body;

//         // Verificação se o ID foi enviado
//         if (!id) {
//             return res.status(400).json({ erro: 'O campo id é obrigatório' });
//         }

//         // Verifica se o ID é uma string e não está vazio
//         if (typeof id !== 'string' || id.trim() === '') {
//             return res.status(400).json({ erro: 'O campo id deve ser uma string não vazia' });
//         }

//         // Referência do documento a ser deletado
//         const docRef = bd.collection('cartoes').doc(id);

//         // Tentativa de obter o documento
//         const doc = await docRef.get();

//         // Verifica se o documento existe
//         if (!doc.exists) {
//             return res.status(404).json({ erro: 'Documento não encontrado' });
//         }

//         // Deleta o documento
//         await docRef.delete();
//         console.log(`Documento com ID ${id} deletado com sucesso`);

//         // Resposta de sucesso
//         res.status(200).json({ mensagem: 'Documento deletado com sucesso' });

//     } catch (error) {
//         // Log do erro para ajudar na depuração
//         console.error('Erro ao deletar documento:', error);
//         res.status(500).json({ erro: 'Erro interno no servidor' });
//     }
// });



// // Rota PUT
// app.put('/fds', async (req, res) => {
//     try {
//         const { nome, img, id } = req.body;
//         if (!id || !nome || !img) {
//             return res.status(400).json({ erro: 'Campos id, nome e img são obrigatórios' });
//         }
//         if (typeof id !== 'string' || typeof nome !== 'string' || typeof img !== 'string') {
//             return res.status(400).json({ erro: 'Campos id, nome e img devem ser strings' });
//         }
//         const docRef = bd.collection('cartoes').doc(id);
//         const doc = await docRef.get();
//         if (!doc.exists) {
//             return res.status(404).json({ erro: 'Documento não encontrado' });
//         }
//         await docRef.update({
//             mensagem: nome,
//             numero: img
//         });
//         console.log(`Documento com ID ${id} atualizado: { nome: ${nome}, img: ${img} }`);
//         res.status(200).json({ mensagem: 'Cartão atualizado com sucesso' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ erro: 'Erro interno no servidor' });
//     }
// });

app.listen(porta, () => {
    console.log(`Servidor rodando na porta ${porta}`);
});