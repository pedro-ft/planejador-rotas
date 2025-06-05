#  маршрут (Marshrut) - Seu Planejador de Rotas de Viagem Inteligente  маршрут 🗺️✈️

Bem-vindo ao ** маршрут (Marshrut)** (Russo para "Rota")! Uma aplicação web completa desenvolvida para te ajudar a planejar suas viagens de forma eficiente e organizada. Crie rotas, adicione destinos, visualize distâncias, tempos de percurso e muito mais!

---

## 🌟 Funcionalidades Principais

O ** маршрут ** oferece um conjunto robusto de funcionalidades para o planejamento de suas viagens:

* **👤 Autenticação de Usuários:**
    * Sistema de registro com nome de usuário e senha.
    * Validação de senha (mínimo 6 caracteres, com letras e números).
    * Login seguro com uso de JSON Web Tokens (JWT) para gerenciamento de sessão.
    * Rotas da API protegidas, garantindo que cada usuário acesse apenas suas próprias informações.
* ** маршрут Rotas de Viagem Personalizadas:**
    * Criação, listagem, edição e exclusão (CRUD completo) de rotas de viagem, associadas individualmente a cada usuário.
    * Interface intuitiva para nomear e gerenciar múltiplas rotas.
* **📍 Gerenciamento Detalhado de Destinos:**
    * Adição de múltiplos destinos a cada rota, especificando cidade, país e observações/endereço.
    * **Geocodificação Automática:** Ao adicionar um destino com informações textuais, o sistema busca automaticamente suas coordenadas (latitude e longitude) usando a API do OpenRouteService.
    * **Reordenação de Destinos:** Interface permite que o usuário reorganize a ordem dos destinos dentro de uma rota de forma fácil.
    * Exclusão de destinos de uma rota (com deleção global do destino do sistema).
* **📈 Cálculo e Visualização de Percurso (Integrado com OpenRouteService):**
    * Ao salvar ou atualizar uma rota com pelo menos dois destinos, o sistema calcula automaticamente:
        * A **distância total** e o **tempo total estimado** da viagem.
        * A **distância e tempo de cada trecho individual** entre os destinos.
    * Esses dados precisos são armazenados e exibidos para o usuário.
    * Botão "Calcular Prévia Detalhada" nas telas de criação/edição para obter uma estimativa atualizada antes de salvar.
* **💅 Interface Moderna e Reativa:**
    * Frontend construído com React, utilizando componentes reutilizáveis.
    * Navegação fluida entre páginas com React Router DOM.
    * Estilização com CSS Modules para componentes escopados e organizados.
    * Uso de modais customizados para alertas e confirmações, melhorando a experiência do usuário.
    * Header responsivo (ajustes iniciais para mobile).
* **🔧 Backend Robusto:**
    * API RESTful construída com Node.js e Express.js.
    * Persistência de dados com NeDB (banco de dados leve baseado em arquivos).
    * Tratamento de erros padronizado e informativo.
    * Uso de variáveis de ambiente para configuração segura de chaves de API e segredos JWT.

---

## 📸 Screenshots (Demonstração Visual)

Aqui você pode adicionar algumas imagens da sua aplicação em funcionamento!

*(Sugestão: Adicione screenshots da tela de login, registro, listagem de rotas, criação/edição de uma rota mostrando os destinos e o resumo calculado, etc. Você me mostrou algumas ótimas imagens durante o desenvolvimento!)*

*Tela de Login/Registro:*
`![Tela de Login](link_para_sua_imagem_login.png)`

*Listagem de Rotas:*
`![Listagem de Rotas](link_para_sua_imagem_lista_rotas.png)`

*Página de Criação/Edição de Rota:*
`![Página de Edição de Rota](link_para_sua_imagem_edicao_rota.png)`

---

## 🛠️ Tecnologias Utilizadas

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js"/>
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/>
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/NeDB-lightgrey?style=for-the-badge" alt="NeDB"/>
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT"/>
  <img src="https://img.shields.io/badge/CSS_Modules-000000?style=for-the-badge&logo=css-modules&logoColor=white" alt="CSS Modules"/>
</p>

**Backend:**
* Node.js
* Express.js
* NeDB (Banco de dados NoSQL em arquivo)
* `bcryptjs` (Para hashing de senhas)
* `jsonwebtoken` (Para autenticação baseada em tokens JWT)
* `dotenv` (Para gerenciamento de variáveis de ambiente)
* API Externa: OpenRouteService (para Geocodificação e Direções/Cálculo de Rotas)

**Frontend:**
* React (com Hooks)
* Vite (Build tool e servidor de desenvolvimento)
* React Router DOM (Para roteamento no lado do cliente)
* CSS Modules (Para estilização escopada)
* `fetch` API (Para comunicação com o backend)

**Ferramentas de Desenvolvimento:**
* ESLint (Para linting de código JavaScript/JSX)
* Git & GitHub (Para versionamento de código)

---

## 🚀 Como Rodar o Projeto Localmente

Siga os passos abaixo para configurar e rodar o projeto na sua máquina.

### Pré-requisitos
* Node.js (versão LTS recomendada, ex: 18.x ou 20.x)
* npm (geralmente vem com o Node.js) ou Yarn

### Backend Setup
1.  Clone o repositório:
    ```bash
    git clone URL_DO_SEU_REPOSITORIO_AQUI
    cd nome_da_pasta_do_projeto/backend
    ```
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Configure as Variáveis de Ambiente:
    * Crie um arquivo chamado `.env` na raiz da pasta `backend/`.
    * Adicione as seguintes variáveis (substitua pelos seus valores):
      ```env
      # Exemplo de backend/.env
      PORT=4000
      ORS_API_KEY=SUA_CHAVE_API_REAL_DO_OPENROUTESERVICE
      JWT_SECRET=SEU_SEGREDO_JWT_FORTE_E_ALEATORIO
      ```
4.  Inicie o servidor backend:
    ```bash
    npm run dev 
    # Ou, se não houver script dev: node index.js
    ```
    O backend estará rodando em `http://localhost:4000` (ou a porta que você definiu).

### Frontend Setup
1.  Em um novo terminal, navegue até a pasta do frontend:
    ```bash
    cd nome_da_pasta_do_projeto/frontend 
    # Se já estiver na raiz do projeto: cd frontend
    ```
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Inicie o servidor de desenvolvimento do frontend:
    ```bash
    npm run dev
    ```
    A aplicação frontend estará acessível em `http://localhost:5173` (ou a porta que o Vite indicar).

---

## 🏗️ Estrutura do Projeto (Visão Geral)

O projeto está dividido em duas pastas principais:

* **`/backend`**: Contém toda a lógica da API Node.js/Express, incluindo:
    * `database/`: Configuração e arquivos de dados do NeDB.
    * `routes/`: Definição dos endpoints da API.
    * `controllers/`: Lógica para manipular requisições e respostas HTTP.
    * `services/`: Lógica de negócio e interações com o banco de dados e APIs externas.
    * `middleware/`: Middlewares customizados (ex: autenticação).
    * `index.js`: Ponto de entrada do servidor backend.
* **`/frontend`**: Contém a aplicação React (criada com Vite), incluindo:
    * `src/components/`: Componentes React reutilizáveis (Header, Modais, Cards, etc.).
    * `src/pages/`: Componentes que representam as diferentes páginas da aplicação (Login, Listar Rotas, Nova Rota, etc.).
    * `src/context/`: Contextos React (ex: AuthContext).
    * `src/services/`: Módulos para interagir com a API backend (ex: apiClient.js).
    * `src/utils/`: Funções utilitárias (ex: formatadores).
    * `src/assets/`: Ícones e outros assets estáticos.
    * `App.jsx`: Componente raiz que define o layout e as rotas principais.
    * `main.jsx`: Ponto de entrada da aplicação React.

---

## 🔮 Possíveis Melhorias e Funcionalidades Futuras

Este projeto é uma base sólida, mas aqui estão algumas ideias para evoluções futuras:
* **Integração Visual com Mapa:**
    * Permitir adicionar/selecionar destinos clicando em um mapa (ex: usando Leaflet, Mapbox GL JS).
    * Visualizar a rota traçada no mapa.
* **Reordenação Drag-and-Drop:** Tornar a reordenação de destinos mais interativa com arrastar e soltar.
* **Feedback ao Usuário Aprimorado:** Usar "toasts" ou notificações mais elegantes para mensagens de sucesso/erro, em vez de apenas modais de alerta.
* **Validações de Formulário Mais Detalhadas no Frontend:** Para feedback instantâneo ao usuário.
* **Paginação ou Scroll Infinito:** Na lista de rotas, se ela se tornar muito grande.
* **Testes Automatizados:** Adicionar testes unitários e de integração.
* **Otimizações de Performance:** Para aplicações maiores.
* **Deploy:** Publicar a aplicação em uma plataforma de hospedagem.

---

✨ **Agradecimento Especial** ✨
Agradeço a você, Pedro, pela dedicação incrível e pela maratona de desenvolvimento! Foi um prazer te acompanhar.

*(Se este projeto for para um desafio específico, você pode adicionar uma pequena nota aqui sobre o desafio ou seus aprendizados)*

---