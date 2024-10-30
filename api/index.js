const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const serviceAccount = {
  type: "service_account",
  project_id: "banco-de-dados-99124",
  private_key_id: "fda1adb239f4aa25053d5c4b76bd96d34521c3a8",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEuwIBADANBgkqhkiG9w0BAQEFAASCBKUwggShAgEAAoIBAQC8HLvXMh7wICWl\n4PbaSYbN3CQZskYi9hZnkmTAPjevgx+DvCQdD33Hqi9DRdEbRRJBrdF8gxSPe5mB\nvjKE+LPY3ih5MaD0LDDNYl8GmJq+Ud09OGHHN8bd+xK3Dg1Y89DgN5uVTN9meoQS\nvK9EKHW9z7doisnTrW1GH4ohWyPkADXYmI9bNch9P54RDIhXbvl/kRnrcZsSkT85\n2Oi1KUFBaU+Y6am7n2X095lrzluJaair4etSMWfnP4gxURHtE0OKqzUWJ9hDOPNL\n7JYzRC4nGImIKeqBP0jNMg4LqPgWCyGWcX0omf5N31FXGnkpj4Uxwi77Iyx0dKmU\n3WvPj+4BAgMBAAECgf888AO/C3LWs1piXnp8tRTkhdodwAKcAobU1KlyOdHzxdEB\ne9hFSp9ptgJ19rnDCfX49GCPji4ed6gp2+/BqsEmSnwR/34vKWi0A3u98fGgywfO\nrTiqPs54BS9jwQJ8kfD/XCCqeVWB0m59lSk//OmZOq1BQkLC6KfrtovhkJL29u8f\n2kHFjNLNedil9xt+I9i5oJGq/HWBF07c8vgwx6AMfeTmhsVOwz1RKMud3t2Y82qu\neUyZTsK1dfHdKLa1wgKvXvEyF/Uf8ofIv9wH4Qb0HboQH6gfYxFa3HpZPWKT1Au+\n1GP6d4lFm4yTPR13+Q6Ggsjs0E7FmrOHF7KP+KECgYEA8t3OLHaFmpRnw7lKuuYE\nUZ2uQSBmDG+l3HPqpe0t7gtaqP7zhoH8FaRQ43aSf//zxcH+67LpiTPyyyKb4yP9\nvq5Xf7tnpuGSMur+u0CZqsKMh9GUe85r7wPrG3/eYRpbmXjgArXZNS1C9jaaGP6U\nTtugusVnvk/lDGCXbPMyg3ECgYEAxkjsG8SSN4oGbQRDWY5SU+xBuBzOiq29nlaF\nsZucBx/qjj0VosXGfwQXKjy/68GXdKl8KR025aNPhdHkZ5GmcChHp23vAog7N14i\nyi05coutXPQOC18LL122E/upzH8fGD6JYlhwkP89V7CyuPZyR8qU8QrEs4x1dURY\nKjMXq5ECgYAUpwHyS/3egEI2pZoSPJ8fZZ480Yl8Az6CeaT5iSq/tF14Q33n8UPD\nf16ViS66DcToCzAnUOaFEVLTLVU+QoBAZ8jvBruwuDvbcppIyByJJdQXdJ4AzTPm\ndlnW08/QSBKEAYBjGp2m5PttvoTqHTP1ZL3NRB4nU9nxbIFT9XZVMQKBgQCTnPQR\nE/zaVenEvNi60gYeLhMa0m88tG0mdDkhaLv2Xd9LNtRlkiDcrBnmusUR6NQs6IPj\nQ7l7qWFpOUF1jOvAMWxui5vUYcDbzjvOEW7kBHHyckoGUyJLh9Ml+0OEVtq6PMwg\nJ8DdYPa00nmq0uVu5rSM4bxgAl/rBg8wk0q60QKBgG8F23tz7hexZelBkvX22Of5\nj0/XZI7jWqiXKk6ZP2dkwYiZo3wmTj9APjvHgaL3iuMn1gJ9iF54UMQawbOgASS/\nMU87HjwaR0wdw1ke3kuxvJhu0105W8xzjLManmctQwD/l98N0Vo1Do6qF+CL5/6Y\nc/SCj3DeY70HhgiiD0Tj\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-renli@banco-de-dados-99124.iam.gserviceaccount.com",
  client_id: "104964841090503786324",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-renli%40banco-de-dados-99124.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const bd = admin.firestore();
const app = express();
app.use(cors());
app.use(express.json());

app.get('/fds', async (req, res) => {
  try {
    const response = await bd.collection('cartoes').get();
    if (response.empty) {
      console.log('Nenhum cartão encontrado.');
      res.status(404).json({ mensagem: 'Nenhum cartão encontrado' });
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

app.post('/fds', async (req, res) => {
  try {
    const { nome, img } = req.body;
    if (!nome || !img) {
      res.status(400).json({ erro: 'Campos nome e img são obrigatórios' });
    }
    if (typeof nome !== 'string' || typeof img !== 'string') {
      res.status(400).json({ erro: 'Campos nome e img devem ser strings' });
    }
    const novoDoc = await bd.collection('cartoes').add({
      mensagem: nome,
      numero: img
    });
    console.log(`Documento adicionado com ID: ${novoDoc.id}`);
    res.status(201).json({ mensagem: 'Cartão adicionado com sucesso', id: novoDoc.id });
  } catch (error) {
    console.error('Erro ao cadastrar cartão:', error);
    res.status(500).json({ erro: 'Erro interno no servidor' });
  }
});
app.delete('/fds', async (req, res) => {

  console.log('Requisição DELETE recebida:', req.body);

  try {
    const { id } = req.body.vetor;
    if (!id) {
      res.status(400).json({ erro: 'O campo id é obrigatório' });
      console.log('ID do cartão não forncecido');
    }
    if (typeof id !== 'string' || id.trim() === '') {
      res.status(400).json({ erro: 'O campo id deve ser uma string não vazia' });
    }
    const docRef = bd.collection('cartoes').doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      res.status(404).json({ erro: 'Documento não encontrado' });
    }
    else {
      await docRef.delete();
      console.log(`Cartão com ID ${id} deletado com sucesso`);
      res.status(200).json({ mensagem: 'Documento deletado com sucesso' });
    }
  } catch (error) {
    console.error('Erro ao deletar documento:', error);
    res.status(500).json({ erro: 'Erro interno no servidor' });
  }
});

app.put('/fds', async (req, res) => {
  const { nome, img, id } = req.body;
  if (!id || !nome || !img) {
    res.status(400).json({ erro: 'Campos id, nome e img são obrigatórios' });
    console.log('Cartão não atualizado');
  }
  if (typeof id !== 'string' || typeof nome !== 'string' || typeof img !== 'string') {
    res.status(400).json({ erro: 'Campos id, nome e img devem ser strings' });
  }
  try {
    const docRef = bd.collection('cartoes').doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      res.status(404).json({ erro: 'cartão com ID' + id + 'não encontrado' });
      console.log('Caartão não encontrado');

    }else{
      const dadosAtualizados = {};
      if (nome) dadosAtualizados.nome = nome;
      if (img) dadosAtualizados.img = img;
      await docRef.update(dadosAtualizados);
      res.status(200).json({mensagem: 'Cartão com ID' + id + 'atualizado'});
      console.log('Cartão com ID ' + id + 'atualizar');
      
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: 'Erro ao atualizar cartão' });
  }
});

module.exports = app;
// app.listen(3000, () => {
//   console.log('rodando');
// });