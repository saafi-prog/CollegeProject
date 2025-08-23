using College.Api.Domain.Entities;

namespace College.Api.Domain.Interfaces
{
    public interface IEleveRepository : IRepository<Eleve>
    {
        Task<IEnumerable<Eleve>> GetElevesByClasseIdAsync(int classeId);
        Task<Eleve?> GetEleveWithNotesAsync(int eleveId);
    }
}
