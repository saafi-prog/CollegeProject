# CollegeProject

## Description

Application de gestion d'un collège avec en **Backend en C# .NET 8 (ASP.NET MVC, Entity Framework, Repository Pattern)** et en **Frontend en React + JSX**.

## Structure du projet

- **College.Api** : backend (ASP.NET MVC, EF Core, C# .NET 8)
- **college-frontend** : frontend (React, Vite)
- **Data/Scripts** : scripts SQL et dump PostgreSQL (pg_dump)

## Stack technique

- **Backend** : C# .NET 8, ASP.NET MVC, Entity Framework, Repository Pattern
- **Base de données** : PostgreSQL 17
- **Frontend** : React (JSX), Vite, Tailwind CSS
- **Gestion du code** : Git & GitHub

## Installation & Démarrage

### 1. Pré-requis
- .NET 8 SDK
- Node.js 
- PostgreSQL 17

### 2. Base de données
- Créer une base de données PostgreSQL (`collegedb`).
- Restaurer le dump :  
  bash
  psql -U postgres -h localhost -p 5433 -d collegedb -f Data/Scrip""""ts/collegedb_dump.sql

  Ou exécuter les scripts 01_create_db.sql, 02_tables.sql, 03_seed.sql.

### 3. Lancement de l 'application back end : 
- se mettre dans le repertoire:
bash
cd College.Api
dotnet restore
dotnet run

### 4. Lancement de l 'application front end : 
- se mettre dans le repertoire:
bash
cd college-frontend
npm install
npm run dev
