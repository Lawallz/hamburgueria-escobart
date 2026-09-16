# Painel administrativo Escobart

Esta versão adiciona um painel em `/admin` ao projeto do commit
`6cb09f91b00bb3989af85a97b1bd76d5d275ec10`.

## Instalação no Windows

1. Faça uma cópia de segurança da pasta atual do projeto.
2. Extraia o ZIP em uma pasta nova para testar. Ele contém o projeto completo,
   sem node_modules, .git, senhas ou dados de teste.
3. Abra o PowerShell na pasta extraída. Use Node.js 22 ou mais recente.
4. Execute:

```powershell
npm install
Copy-Item .env.example .env
notepad .env
```

No `.env`, preencha `ADMIN_PASSWORD` com uma senha exclusiva de pelo menos 12
caracteres. Não envie esse arquivo ao GitHub. Mantenha:

```dotenv
APP_ORIGIN=http://localhost:3000
PORT=3000
DATA_DIR=./data
```

Depois:

```powershell
npm run dev
```

Site: http://localhost:3000

Painel: http://localhost:3000/admin

Entre com a senha que você definiu. Não há senha padrão nem cadastro público.
Use exatamente `localhost`, pois a proteção de origem verifica o endereço.

## O que o dono pode fazer

- Cadastrar, editar e excluir produtos, com confirmação para exclusão.
- Alterar nome, descrição, preço base, categoria e ingredientes.
- Trocar a imagem por endereço HTTPS ou arquivo já existente em `/assets/`.
- Pausar/reativar um produto. Produtos pausados deixam de aparecer ao público.
- Escolher quais produtos aparecem nos destaques.
- Buscar produtos e filtrar por categoria.

As categorias são as existentes no código. Esta versão não cria categorias
personalizadas, não faz upload de fotos e não edita horários, WhatsApp ou taxa
de entrega. Preços específicos de marcas, tamanhos e adicionais continuam no
componente `MenuSection.tsx`, não no editor de preço base. As opções do carrinho
já existentes foram preservadas.

O cardápio público carrega os dados do servidor e consulta atualizações a cada
30 segundos enquanto a página está visível, e quando a janela recebe foco.
Pedidos já montados no carrinho não são recalculados automaticamente quando
um produto muda no painel. O fluxo original de WhatsApp não registra pedidos
num banco de dados nem confirma o seu recebimento.

## Dados e publicação

O servidor grava o cardápio em `data/menu.json`, inicializado com os produtos
atuais. Essa pasta é ignorada pelo Git. Faça backup dela; apagar o arquivo
restaura o cardápio inicial na próxima inicialização.

Esta implementação usa arquivo JSON no servidor, não localStorage. Todos os
clientes consultam o mesmo cardápio. Requer **um processo Node.js e um volume
persistente**, sem múltiplas réplicas. Não publique apenas a pasta `dist` em
hospedagem estática e não use disco temporário de funções serverless.

Para produção:

1. Configure `ADMIN_PASSWORD`, `APP_ORIGIN=https://seu-dominio`,
   `NODE_ENV=production`, `PORT` e `DATA_DIR` (disco persistente).
2. Instale também as dependências de desenvolvimento, pois o servidor usa `tsx`.
3. Execute `npm run build` e depois `npm start`.
4. Configure HTTPS no provedor/proxy e mantenha site e API na mesma origem.
5. Faça backup periódico de `DATA_DIR`.

Se a hospedagem for Vercel ou similar, adapte a persistência para um banco de
dados antes de publicar. As mudanças neste ZIP não foram enviadas ao GitHub.

## Acesso

Sessão de 8 horas em cookie HttpOnly/SameSite Strict (Secure em produção).
Senhas são verificadas com scrypt no servidor; nunca são enviadas ao frontend.
Reiniciar o servidor encerra as sessões. Tentativas incorretas são limitadas
por IP a 10 em 15 minutos; atrás de proxy, o limite pode ser compartilhado.
Requisições de alteração verificam a origem. Revisões impedem que uma aba
sobrescreva silenciosamente alterações já salvas por outra.

Para trocar a senha, atualize ADMIN_PASSWORD no ambiente e reinicie o servidor.

## Verificação

```powershell
npm run lint
npm run build
npm test
```

Os testes usam uma pasta temporária e verificam autenticação, bloqueio de
origem, validação, conflito entre revisões, criação, edição, exclusão,
disponibilidade, persistência após reinicialização, logout e limite de login.
A porta 3199 deve estar livre para rodar os testes.
