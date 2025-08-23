using College.Api.Domain.Entities;
using College.Api.Domain.Interfaces;
using College.Api.Infrastructure.Data;
using College.Api.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

namespace College.Api.Infrastructure.Repositories
{
    public class EleveRepository : Repository<Eleve>, IEleveRepository
    {
        public EleveRepository(CollegeDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Eleve>> GetElevesByClasseIdAsync(int classeId)
        {
            return await _dbSet
                .Include(e => e.Classe)
                .Where(e => e.ClasseId == classeId)
                .OrderBy(e => e.Nom)
                .ThenBy(e => e.Prenom)
                .ToListAsync();
        }

        public async Task<Eleve?> GetEleveWithNotesAsync(int eleveId)
        {
            return await _dbSet
                .Include(e => e.Notes)
                    .ThenInclude(n => n.Matiere)
                .Include(e => e.Notes)
                    .ThenInclude(n => n.Professeur)
                .Include(e => e.Classe)
                .FirstOrDefaultAsync(e => e.Id == eleveId);
        }

        public override async Task<IEnumerable<Eleve>> GetAllAsync()
        {
            return await _dbSet
                .Include(e => e.Classe)
                .OrderBy(e => e.Classe.NiveauNom)
                .ThenBy(e => e.Nom)
                .ThenBy(e => e.Prenom)
                .ToListAsync();
        }
    }
}