using System.Linq.Expressions;

namespace College.Api.Domain.Interfaces
{
    public interface IRepository<T> where T : class
    {
        //Récupère une entité par son identifiant.
        Task<T?> GetByIdAsync(int id);

        //Récupère toutes les entités du type T.
        Task<IEnumerable<T>> GetAllAsync();

        //Récupère toutes les entités qui satisfont une condition
        Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);

        //Ajoute une nouvelle entité dans la base.
        Task<T> AddAsync(T entity);

        //Met à jour une entité existante.
        Task UpdateAsync(T entity);

        //Supprime une entité de la base.
        Task DeleteAsync(T entity);

        //Vérifie si une entité avec cet ID existe.
        Task<bool> ExistsAsync(int id);
    }
}
