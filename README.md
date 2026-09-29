# 📚 Sistema de Gerenciamento de Biblioteca

## Sobre o projeto

Sistema de gerenciamento de biblioteca composto por **dois aplicativos mobile** que se comunicam através do mesmo banco de dados **Firebase (Cloud Firestore)**:

| Aplicativo | Quem usa | O que faz |
| --- | --- | --- |
| **App do Administrador** | Bibliotecário(a) | Cadastra livros, edita livros, exclui livros e aprova ou recusa os pedidos de empréstimo |
| **App do Usuário** | Leitor(a) | Consulta o catálogo, vê a disponibilidade de cada livro, solicita empréstimos e acompanha o status dos seus pedidos |

O projeto implementa um **CRUD completo** (Create, Read, Update e Delete) totalmente conectado ao Firebase.

## Funcionalidades

### App do Administrador

- **Create:** cadastrar novos livros no catálogo
- **Read:** listar os livros cadastrados e os pedidos de empréstimo
- **Update:** editar os dados dos livros e atualizar o status dos empréstimos (aprovar ou recusar)
- **Delete:** remover livros do catálogo

### App do Usuário

- **Read:** visualizar o catálogo de livros e a disponibilidade de cada um
- **Create:** solicitar o empréstimo de um livro
- **Read:** acompanhar a lista de "Meus Empréstimos" com o status de cada pedido

### Status de um empréstimo

| Status | Significado |
| --- | --- |
| `solicitado` | O usuário fez o pedido e aguarda a decisão do administrador |
| `aprovado` | O administrador aprovou; o livro aparece como **Emprestado** no catálogo |
| `recusado` | O administrador recusou; o livro volta a ficar disponível para novo pedido |

## Tecnologias

- [React Native](https://reactnative.dev/) com [Expo](https://expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/) (navegação por abas)
- TypeScript
- [Firebase](https://firebase.google.com/) / Cloud Firestore (banco de dados)

## Estrutura do banco de dados (Firestore)

### Coleção `livros`

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `titulo` | string | Título do livro |
| `autor` | string | Autor do livro |

### Coleção `emprestimo`

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `idLivro` | string | ID do documento do livro |
| `idUsuario` | string | ID do documento do usuário |
| `tituloLivro` | string | Título do livro (copiado no momento do pedido) |
| `autorLivro` | string | Autor do livro (copiado no momento do pedido) |
| `dataEmprestimo` | timestamp | Data em que o pedido foi feito |
| `status` | string | `solicitado`, `aprovado` ou `recusado` |

### Coleção `usuario`

Armazena os usuários do sistema; o ID do documento é usado como `idUsuario` nos empréstimos.

## Como executar

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão LTS)
- Aplicativo **Expo Go** no celular **ou** um emulador do **Android Studio**
- Um projeto criado no [Firebase Console](https://console.firebase.google.com/) com o **Cloud Firestore** ativado

### Passo a passo

1. Clone o repositório:

   ```bash
   git clone https://github.com/mengueu/Prova-PPDM
   ```

2. Entre na pasta do aplicativo que deseja executar (administrador ou usuário) e instale as dependências:

   ```bash
   cd 08-administrador
   ou
   cd 09-usuario
   ```
   ```bash
   npm install
   ```

3. Crie o arquivo `firebaseConfig.ts` na raiz do app com as credenciais do seu projeto Firebase:

   ```typescript
   import { initializeApp } from 'firebase/app';
   import { getFirestore } from 'firebase/firestore';

   const firebaseConfig = {
     apiKey: 'SUA_API_KEY',
     authDomain: 'SEU_PROJETO.firebaseapp.com',
     projectId: 'SEU_PROJECT_ID',
     storageBucket: 'SEU_PROJETO.appspot.com',
     messagingSenderId: 'SEU_SENDER_ID',
     appId: 'SEU_APP_ID',
   };

   const app = initializeApp(firebaseConfig);
   export const db = getFirestore(app);
   ```

4. Inicie o projeto:

   ```bash
   npx expo start
   ```

5. Abra o app escaneando o QR Code com o **Expo Go** ou pressione `a` para abrir no emulador Android.

---
<br>

# 📚Library Management System

## About the project

A library management system made of **two mobile apps** that talk to the same **Firebase (Cloud Firestore)** database:

| App | Who uses it | What it does |
| --- | --- | --- |
| **Admin App** | Librarian | Registers books, edits books, deletes books, and approves or rejects loan requests |
| **User App** | Reader | Browses the catalog, checks each book's availability, requests loans, and tracks the status of their requests |

The project implements a **full CRUD** (Create, Read, Update, and Delete) fully connected to Firebase.

## Features

### Admin App

- **Create:** register new books in the catalog
- **Read:** list registered books and loan requests
- **Update:** edit book data and update loan status (approve or reject)
- **Delete:** remove books from the catalog

### User App

- **Read:** view the book catalog and each book's availability
- **Create:** request a book loan
- **Read:** follow the "My Loans" list with the status of each request

### Loan status

| Status | Meaning |
| --- | --- |
| `solicitado` (requested) | The user made the request and is waiting for the admin's decision |
| `aprovado` (approved) | The admin approved it; the book shows as **Borrowed** in the catalog |
| `recusado` (rejected) | The admin rejected it; the book becomes available for a new request |

## Tech stack

- [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/) (tab navigation)
- TypeScript
- [Firebase](https://firebase.google.com/) / Cloud Firestore (database)

## Database structure (Firestore)

### Collection `livros` (books)

| Field | Type | Description |
| --- | --- | --- |
| `titulo` | string | Book title |
| `autor` | string | Book author |

### Collection `emprestimo` (loans)

| Field | Type | Description |
| --- | --- | --- |
| `idLivro` | string | Book document ID |
| `idUsuario` | string | User document ID |
| `tituloLivro` | string | Book title (copied at request time) |
| `autorLivro` | string | Book author (copied at request time) |
| `dataEmprestimo` | timestamp | Date the request was made |
| `status` | string | `solicitado`, `aprovado`, or `recusado` |

### Collection `usuario` (users)

Stores the system's users; the document ID is used as `idUsuario` in the loans.

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version)
- The **Expo Go** app on your phone **or** an **Android Studio** emulator
- A project created in the [Firebase Console](https://console.firebase.google.com/) with **Cloud Firestore** enabled

### Step by step

1. Clone the repository:

   ```bash
   git clone https://github.com/mengueu/Prova-PPDM
   ```

2. Go into the folder of the app you want to run (admin or user) and install the dependencies:

    ```bash
   cd 08-administrador
   or
   cd 09-usuario
   ```
   ```bash
   npm install
   ```

3. Create the `firebaseConfig.ts` file in the app's root with your Firebase project credentials:

   ```typescript
   import { initializeApp } from 'firebase/app';
   import { getFirestore } from 'firebase/firestore';

   const firebaseConfig = {
     apiKey: 'YOUR_API_KEY',
     authDomain: 'YOUR_PROJECT.firebaseapp.com',
     projectId: 'YOUR_PROJECT_ID',
     storageBucket: 'YOUR_PROJECT.appspot.com',
     messagingSenderId: 'YOUR_SENDER_ID',
     appId: 'YOUR_APP_ID',
   };

   const app = initializeApp(firebaseConfig);
   export const db = getFirestore(app);
   ```

4. Start the project:

   ```bash
   npx expo start
   ```

5. Open the app by scanning the QR Code with **Expo Go**, or press `a` to open it on the Android emulator.