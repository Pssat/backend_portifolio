const express = require('express');
const cors = require('cors');

const app = express();
const porta = 3000;

app.use(cors());
app.use(express.json());

const vetor = [
    { mensagem: 'Projetos 1',  numero: 'https://cdn.leonardo.ai/users/bfc04243-3633-4215-abd8-25cc426aef65/generations/0d9dd8bc-5ca7-4dce-b1eb-43ac57b2aae0/AlbedoBase_XL_create_images_about_something_cyberpunk_with_pur_2.jpg' },
    { mensagem: 'Projetos 2',  numero: 'https://cdn.leonardo.ai/users/bfc04243-3633-4215-abd8-25cc426aef65/generations/0d9dd8bc-5ca7-4dce-b1eb-43ac57b2aae0/AlbedoBase_XL_create_images_about_something_cyberpunk_with_pur_1.jpg' },
    { mensagem: 'Projetos 3',  numero: 'https://cdn.leonardo.ai/users/bfc04243-3633-4215-abd8-25cc426aef65/generations/f7d929ba-1f59-4057-8f6f-56ff5441337d/AlbedoBase_XL_create_images_about_cyber_with_purple_and_ora_0.jpg' },
    { mensagem: 'Projetos 4',  numero: 'https://cdn.leonardo.ai/users/bfc04243-3633-4215-abd8-25cc426aef65/generations/f7d929ba-1f59-4057-8f6f-56ff5441337d/AlbedoBase_XL_create_images_about_cyber_with_purple_and_ora_3.jpg' },
    { mensagem: 'Projetos 5',  numero: 'https://cdn.leonardo.ai/users/bfc04243-3633-4215-abd8-25cc426aef65/generations/55b10401-dab3-426c-ac38-0bd8421c5b32/AlbedoBase_XL_create_images_about_something_tech_and_cyberpun_1.jpg' },
    { mensagem: 'Projetos 6',  numero: 'https://cdn.leonardo.ai/users/bfc04243-3633-4215-abd8-25cc426aef65/generations/55b10401-dab3-426c-ac38-0bd8421c5b32/AlbedoBase_XL_create_images_about_something_tech_and_cyberpun_3.jpg' },
    { mensagem: 'Projetos 7',  numero: 'https://cdn.leonardo.ai/users/bfc04243-3633-4215-abd8-25cc426aef65/generations/0d9dd8bc-5ca7-4dce-b1eb-43ac57b2aae0/AlbedoBase_XL_create_images_about_something_cyberpunk_with_pur_3.jpg' },
    { mensagem: 'Projetos 8',  numero: 'https://cdn.leonardo.ai/users/bfc04243-3633-4215-abd8-25cc426aef65/generations/f7d929ba-1f59-4057-8f6f-56ff5441337d/AlbedoBase_XL_create_images_about_cyber_with_purple_and_ora_2.jpg' },
    { mensagem: 'Projetos 9',  numero: 'https://cdn.leonardo.ai/users/bfc04243-3633-4215-abd8-25cc426aef65/generations/f7d929ba-1f59-4057-8f6f-56ff5441337d/AlbedoBase_XL_create_images_about_cyber_with_purple_and_ora_1.jpg' },
    { mensagem: 'Projetos 10',  numero: 'https://cdn.leonardo.ai/users/bfc04243-3633-4215-abd8-25cc426aef65/generations/d89cf335-b304-49e0-b305-edbced050a66/AlbedoBase_XL_create_images_about_something_tech_and_cyberpun_2.jpg' }
];

app.get('/fds', (req, res) => {
    res.status(200).json({vetor});
    console.log('ta potente')
});

app.post('/fds', (req, res) => {
    const { nome, img } = req.body; 
    vetor.push({ mensagem: nome, numero: img });
    console.log(vetor);
    res.status(201).json({ mensagem: 'é POST' });
});

app.delete('/fds', (req, res) => {
    const { index } = req.body; 
    vetor.splice(index, 1); 
    console.log(vetor + ' deletado');
    res.status(201).json({ mensagem: 'Ta Bala' });
});
app.put('/fds', (req, res) => {
    const { nome, img, id } = req.body; 
    vetor[id] = { nome: nome, img: img }; 
    res.status(200).json({ mensagem: 'Cartão atualizado com sucesso' });
});


app.listen(porta, () => {
    console.log(`Servidor rodando na porta ${porta}`);
});
