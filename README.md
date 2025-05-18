# RAG Simples

Instale as dependências

```bash
npm install
```

Agora você precisa colocar as perguntas e respostas no arquivo `faq.txt.`
Eu usei exemplos relacionados a Star Wars, mas você pode escrever perguntas e respostas que façam sentido para você.

Agora que temos a `faq.txt` preenchida, execute o seguinte comando:

```bash
npm run update:embeddings
```

Isso irá criar um arquivo chamado `faq.json`, que já estará na estrutura correta para ser pesquisado, pois já inclui o campo de embedding (vetor).

Agora, execute o agente e faça suas perguntas, como no exemplo abaixo:

```bash
npm start 'Quem usa sabre de luz verde ?'
```
