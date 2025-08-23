using College.Api.Domain.Entities;
using College.Api.Domain.Interfaces;
using College.Api.Dtos;
using College.Api.Mapping;
using Microsoft.AspNetCore.Mvc;

namespace College.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ElevesController : ControllerBase
    {
        private readonly IEleveRepository _eleveRepository;
        private readonly IRepository<Classe> _classeRepository;

        public ElevesController(IEleveRepository eleveRepository, IRepository<Classe> classeRepository)
        {
            _eleveRepository = eleveRepository;
            _classeRepository = classeRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<EleveDto>>> GetAllStudents()
        {

            var eleves = await _eleveRepository.GetAllAsync();
            var eleveDtos = eleves
                    .Where(e => e != null) 
                    .Select(e => new EleveDto
                                {
                                    Id = e.Id,
                                    Nom = e.Nom,
                                    Prenom = e.Prenom,
                                    Genre = e.Genre,
                                    ClasseId = e.ClasseId,
                                    ClassName = e.Classe?.NiveauNom ?? string.Empty,
                                })
                    .ToList(); 

            return Ok(eleveDtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<EleveDto>> GetStudentById(int id)
        {
            var eleve = await _eleveRepository.GetByIdAsync(id);
            if (eleve == null) return NotFound($"L'élève avec l'ID {id} n'existe pas.");
            return Ok(eleve.ToDto());
        }

        [HttpGet("classe/{classeId}")]
        public async Task<ActionResult<IEnumerable<EleveDto>>> GetStudentByClasse(int classeId)
        {
            var eleves = await _eleveRepository.GetElevesByClasseIdAsync(classeId);
            return Ok(eleves.ToDtoList());
        }

        [HttpGet("{id}/notes")]
        public async Task<ActionResult<IEnumerable<NoteDto>>> GetstudentNotes(int id)
        {
            var eleve = await _eleveRepository.GetEleveWithNotesAsync(id);

            if (eleve == null) return NotFound($"L'élève avec l'ID: {id} n'existe pas'.");
            return Ok(eleve.Notes.ToDtoList(eleve));
        }

  
        [HttpPost]
        public async Task<ActionResult<EleveDto>> CreateStudent(CreateEleveDto createEleveDto)
        {
            try
            {
                // Validation des données 
                if (createEleveDto == null)
                    return BadRequest("Les données de l'élève sont requises.");

                if (string.IsNullOrWhiteSpace(createEleveDto.Nom))
                    return BadRequest("Le nom est requis.");

                if (string.IsNullOrWhiteSpace(createEleveDto.Prenom))
                    return BadRequest("Le prénom est requis.");

                if (string.IsNullOrWhiteSpace(createEleveDto.Genre))
                    return BadRequest("Le genre est requis.");

                // Vérification  de l'ID de classe
                if (createEleveDto.ClasseId <= 0)
                    return BadRequest($"L'ID de classe doit être un nombre positif. Reçu: {createEleveDto.ClasseId}");

                // Vérification de l'exitence de la classe
                if (!await _classeRepository.ExistsAsync(createEleveDto.ClasseId))
                {
                    return BadRequest($"La classe avec l'ID {createEleveDto.ClasseId} n'existe pas.");
                }

                // Création de l'élève
                var eleve = new Eleve
                {
                    Nom = createEleveDto.Nom.Trim(),
                    Prenom = createEleveDto.Prenom.Trim(),
                    Genre = createEleveDto.Genre.Trim(),
                    ClasseId = createEleveDto.ClasseId
                };

                var createdEleve = await _eleveRepository.AddAsync(eleve);

                // Récupération des données 
                var eleveWithClasse = await _eleveRepository.GetByIdAsync(createdEleve.Id);

                if (eleveWithClasse == null)
                    return StatusCode(500, "Erreur lors de la création de l'élève.");

                return CreatedAtAction(nameof(GetStudentById),
                    new { id = eleveWithClasse.Id },
                    eleveWithClasse.ToDto());
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erreur interne: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStudent(int id, UpdateEleveDto updateEleveDto)
        {
            var eleve = await _eleveRepository.GetByIdAsync(id);

            if (eleve == null) return NotFound($"L'élève avec l'ID: {id} n'existe pas.");

            if (!await _classeRepository.ExistsAsync(updateEleveDto.ClasseId))
                return BadRequest("La classe n'existe pas.");

            eleve.Nom = updateEleveDto.Nom;
            eleve.Prenom = updateEleveDto.Prenom;
            eleve.Genre = updateEleveDto.Genre;
            eleve.ClasseId = updateEleveDto.ClasseId;

            await _eleveRepository.UpdateAsync(eleve);

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent(int id)
        {
            var eleve = await _eleveRepository.GetByIdAsync(id);
            if (eleve == null) return NotFound($"L'élève avec l'ID {id} n'existe pas.");

            await _eleveRepository.DeleteAsync(eleve);

            return NoContent();
        }
    }
}
