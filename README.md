# CollegeProject

## Description

Application de gestion d'un collège avec Backend C# .NET 8 (ASP.NET MVC) et Frontend React JSX.

## Structure

- College.Api : backend
- college-frontend : frontend
- Data/Scripts : scripts SQL et dump PostgreSQL

## Installation

1. Installer PostgreSQL 17
2. Restaurer le dump ou exécuter les scripts SQL
3. Configurer la chaîne de connexion dans `appsettings.json`
4. Lancer le backend : `dotnet run --project College.Api`
5. Lancer le frontend : `npm install && npm run dev`
