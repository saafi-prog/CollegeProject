using College.Api.Domain.Entities;
using College.Api.Domain.Interfaces;
using College.Api.Dtos;
using College.Api.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace College.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProfesseursController : ControllerBase
    {
        private readonly IRepository<Professeur> _professeurRepository;
        private readonly CollegeDbContext _context;

        public ProfesseursController(IRepository<Professeur> professeurRepository, CollegeDbContext context)
        {
            _professeurRepository = professeurRepository;
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProfesseurDto>>> GetAllTeachers()
        {
            try
            {
                // Lister les professeurs
                var professeurs = await _context.Professeurs.ToListAsync();
                var professeurIds = professeurs.Select(p => p.Id).ToList();

                // les matières par professeur
                var professeurMatieresNoms = await _context.ProfesseurMatieres
                    .Where(pm => professeurIds.Contains(pm.ProfesseurId))
                    .Select(pm => new { pm.ProfesseurId, MatiereName = pm.Matiere.Nom })
                    .ToListAsync();

                // Grouper par professeur
                var matieresByProfesseur = professeurMatieresNoms
                    .GroupBy(pm => pm.ProfesseurId)
                    .ToDictionary(g => g.Key, g => g.Select(x => x.MatiereName).ToList());

                var professeurDtos = professeurs.Select(p => new ProfesseurDto
                {
                    Id = p.Id,
                    Nom = p.Nom,
                    Prenom = p.Prenom,
                    Genre = p.Genre,
                    Matieres = matieresByProfesseur.GetValueOrDefault(p.Id, new List<string>())
                }).ToList();

                return Ok(professeurDtos);
            }
            catch (Exception ex)
            {
                return BadRequest($"Erreur: {ex.Message}");
            }
        }


        [HttpGet("par-matiere")]
        public async Task<ActionResult<Dictionary<string, List<ProfesseurDto>>>> GetTeachersGroupedByMatiere()
        {
            try
            {
                // lister les professeurs
                var professeurs = await _context.Professeurs.ToListAsync();
                var professeurIds = professeurs.Select(p => p.Id).ToList();

                // Récupérer les données  
                var professeurMatieresData = await _context.ProfesseurMatieres
                    .Where(pm => professeurIds.Contains(pm.ProfesseurId))
                    .Select(pm => new {
                        pm.ProfesseurId,
                        pm.Professeur.Nom,
                        pm.Professeur.Prenom,
                        pm.Professeur.Genre,
                        MatiereName = pm.Matiere.Nom
                    })
                    .ToListAsync();

                // Grouper  par matière
                var result = professeurMatieresData
                    .GroupBy(pm => pm.MatiereName)
                    .ToDictionary(
                        g => g.Key,
                        g => g.GroupBy(x => x.ProfesseurId) 
                             .Select(profGroup => new ProfesseurDto
                             {
                                 Id = profGroup.Key,
                                 Nom = profGroup.First().Nom,
                                 Prenom = profGroup.First().Prenom,
                                 Genre = profGroup.First().Genre,
                                 Matieres = professeurMatieresData
                                     .Where(pm => pm.ProfesseurId == profGroup.Key)
                                     .Select(pm => pm.MatiereName)
                                     .Distinct()
                                     .ToList()
                             })
                             .ToList()
                    );

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Erreur: {ex.Message}");
            }
        }
    }
}