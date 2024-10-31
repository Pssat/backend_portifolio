const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const serviceAccount = {
  type: "service_account",
  project_id: "banco-de-dados-99124",
  private_key_id: "6944a3496c05b7da81d2556c90343f84a5f3952e",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCtDF7M5IpsjKvn\nXLlfIqIn61uWh3Ck97Kr9MkqtTqWUrPFl5SPHNafWxPuWRo5yozEkof+Q7vykOLV\nzjzVVALEFyiWcX4IUqjLsDaB4gVW3FSI0nsu5tb/xHo61oSamhaz08zwTcZNKxt/\nz8pNHwwU+iKLfEpAXcfR9nwjxqMat5ykUofwCPjx4Fsv9lyvHONfgkf04cd+dsTa\nu+cx05ExdDLPJrNeA+hIBF9od9754bCzGHKwTTJrxQoi2qDcXgS/Cg8KZW+bFWuJ\nLiHThgn231x4p4+34yYQDsUh9znpUpCQCosWGDF43gih/ftJpkcG38zCbb1oVqxl\nFMBIqHlDAgMBAAECggEAJLQtfV7yH1D8+y83ID8bzsTEYdqrYUoqav+aFYVn/k9f\nUwcyGuK+gQFT6meawOw9zEnaL2uVdz8U5c1/KK5PgeD5mmNLHJ/PrphbD1Rt1n0Y\nLwcZ2ppautglJsquSI5rR0wiuUt9xotgo0zi91Wg/egKILTFmP5rLhUOQpZUrQsv\n+GFlIuVozOvS+k+B2HBwu3fcPE1D45xUUp3CXMrS+dGVHOZYeu6NwuwCaHas33RX\nvHrxEJN5OzPffniKqImIIeacKHZywpVwnRCQk3TfYTvvTOAySYiYe061onq09IMd\nTaQTN5sQ+UYy5O4gHvGYkS5BC0oUmi6wkyyIK3CFCQKBgQDsju/TKBMEql/Up2BX\nj5etCHlucQOAY8C7P06ZTbU3fiQI85cxC3BAuMB6lgxyPnKGVD0bLsD9/5zhGdfy\nVWxikuMKwOuWAu5Rx5t9jvYBo8jfpl708Db8vDxxQVSOYMAgqnvdKWrPyPAlMvs7\nF24x7v3Pt2pHNXkfUgQ+5m99CwKBgQC7RTdJ6dP7LfAAyiiapgVQo/yUmOGwxZqb\ncwBCi6alkKSPEQGe3PoX5GQW1S46uDBe3s2JqdCbiwMQzUQv7hBsRLAlTCT5E7Jk\nFeF4qobwDwhe4SezScm4RQnrUqyIibQPXIMuS0vrYcQZGOTzpqBdwDtzwXIz5z3R\nsn67Te7nqQKBgQCQiHzLfQ6xqQ9INMPOe/NmS2k2K2LCTTByt6lkTXBNaYrG1V4p\nHx4EzVz9CTStkK4UmN+E/jn4dvb5KfshG0RPrgN+jITkcQH/gX/lZTW1psaSr2oR\nKbvPC4u6fvoUy9RXoRJw/F9AeTsQ32dUoWo4pBb7lMsgmvFYS5pAfDbeJQKBgQCA\nwUcRL45KnTvtHxEpusnettDbTf2mL0ZsaHYeSqvqG3e40aV+l0nwEVxrgmjFgIvp\nPmCsrK+7sakK7UZbed+awOMm0aJ+CffV7mFWOFCMTpmfukg0caAabIU0YWQ0gBDn\nmuCqfKSXEmHkK4SGrOKHcrqtjKw7WVrciU+u8hc2+QKBgQDGy6k+5zmb8PyNE5Wh\nTkDZprp/BEGWILNV5akGsqpiGuGUFJLfu7KKAjLO6xf9CkEy8h764mXpxln/NU5R\nyRUhzSWsjaQC2vVv39yB9YI5rYQJ33DhhnsQFzAkkwasOJ0U1eMaWBJ7sqxOEAUQ\nQUheH/ok3DH7e6e4dYX6szTQfA==\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-renli@banco-de-dados-99124.iam.gserviceaccount.com",
  client_id: "104964841090503786324",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-renli%40banco-de-dados-99124.iam.gserviceaccount.com",
  universe_domain: "googleapis.com"
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
    } else {
      const vetor = response.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log('Dados retornados com sucesso:', vetor);
      res.status(200).json({ vetor });
    }
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
    const { id } = req.body;
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
    console.log('Cartão não atualizado: Campos obrigatórios ausentes');
  } else if (typeof id !== 'string' || typeof nome !== 'string' || typeof img !== 'string') {
    res.status(400).json({ erro: 'Campos id, nome e img devem ser strings' });
    console.log('Cartão não atualizado: Campos devem ser strings');
  } else {
    try {
      const docRef = bd.collection('cartoes').doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        res.status(404).json({ erro: 'Cartão com ID ' + id + ' não encontrado' });
        console.log('Cartão não encontrado com ID ' + id);
      } else {
        const dadosAtualizados = { mensagem, img };
        await docRef.update(dadosAtualizados);

        res.status(200).json({ mensagem: 'Cartão com ID ' + id + ' atualizado' });
        console.log('Cartão com ID ' + id + ' atualizado');
      }
    } catch (error) {
      console.error('Erro ao atualizar cartão:', error);
      res.status(500).json({ mensagem: 'Erro ao atualizar cartão' });
    }
  }
});


module.exports = app;
// app.listen(3000, () => {
//   console.log('rodando');
// });
