> **Versão com painel administrativo:** consulte [PAINEL-ADMIN.md](PAINEL-ADMIN.md) para instalar, configurar a senha e publicar. Esta versão requer servidor Node.js e armazenamento persistente. A descrição original abaixo refere-se à versão anterior, somente frontend.

<div align="center">

# 🍔 HAMBURGUERIA ESCOBART 🍔
### *O Cartel do Sabor Artesanal & Comanda Digital via WhatsApp*

[![Status do Projeto](https://img.shields.io/badge/STATUS-EM_PRODU%C3%87%C3%83O-green?style=for-the-badge&logo=git&logoColor=white)](https://github.com)
[![Tecnologias](https://img.shields.io/badge/TECH-REACT_%7C_TYPESCRIPT_%7C_TAILWIND-blue?style=for-the-badge&logo=react&logoColor=white)](https://github.com)

<p align="center">
  <b>Um cardápio digital moderno, de altíssima conversão e com painel administrativo em Node.js, desenvolvido sob medida para revolucionar o atendimento de salão e delivery da Hamburgueria Escobart.</b>
</p>

</div>

---

## 📌 Sobre o Projeto

A **Hamburgueria Escobart** é um estabelecimento gastronômico de essência marcante, unindo cortes nobres, burgers artesanais inspirados na cultura temática, porções generosas e caipirinhas exclusivas batizadas com nomes de times da *Champions League*. 

Este repositório abriga o código-fonte do **site oficial e cardápio interativo**. A versão atual inclui servidor Node.js para o painel administrativo e a persistência do cardápio. O fluxo de pedidos direciona a mensagem montada pelo cliente ao WhatsApp do atendimento.

---

## 🔥 Funcionalidades Principais

*   🍔 **Cardápio Dinâmico por Categorias:** Filtre facilmente entre hambúrgueres artesanais, clássicos, porções, cervejas, caipirinhas e destilados.
*   ⚡ **Modais de Customização Inteligente:** Escolha tamanhos de porções (P, M, G), cortes de batata, complementos de bacon, queijos extras e especificidades de bebidas sem poluir a interface visual.
*   🛒 **Carrinho Flutuante & Checkout via WhatsApp:** O cliente monta o pedido completo visualmente e o site formata uma mensagem limpa e organizada, enviada direto para o WhatsApp do atendimento/cozinha.
*   🎨 **Design Exclusivo:** Identidade visual agressiva, tipografia forte, cores contrastantes (Amarelo Brand, Carvão e Off-White) que conferem personalidade única à marca.
*   ⭐ **Voz da Comunidade (Depoimentos):** Seção interativa onde os clientes podem deixar seus relatos e avaliações sobre a experiência no "cartel".

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído utilizando ferramentas modernas e focadas em alta performance:

*   **React** (com TypeScript) — Componentização e tipagem segura.
*   **Tailwind CSS** — Estilização rápida e responsiva com foco em design system customizado.
*   **Lucide React** — Ícones limpos e modernos.
*   **Vite** — Empacotador ultrarrápido para desenvolvimento local.

---

## 🚀 Como Executar o Projeto Localmente

Certifique-se de ter o [Node.js](https://nodejs.org/) instalado em sua máquina antes de prosseguir.

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/Lawallz/hamburgueria-escobart.git
   cd hamburgueria-escobart
   npm ci
   ```

2. Copie `.env.example` para `.env` e configure `ADMIN_PASSWORD` com uma senha exclusiva de pelo menos 12 caracteres. Confira `APP_ORIGIN=http://localhost:3000`.
3. Execute `npm run dev` e abra http://localhost:3000. O painel fica em http://localhost:3000/admin.

## Verificação

```bash
npm run lint
npm run build
npm test
```

## Hospedagem

O painel requer processo Node.js e armazenamento persistente. Publicar apenas `dist/` não disponibiliza a API administrativa. Consulte [PAINEL-ADMIN.md](PAINEL-ADMIN.md) para configuração do servidor, persistência e backups.
