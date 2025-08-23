using AutoMapper;
using College.Api.Domain.Entities;
using College.Api.Domain.Interfaces;
using College.Api.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace College.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotesController : ControllerBase
    {
        private readonly IRepository<Note> _noteRepository;
        private readonly IRepository<Eleve> _eleveRepository;
        private readonly IRepository<Matiere> _matiereRepository;
        private readonly IRepository<Professeur> _professeurRepository;
        private readonly IMapper _mapper;

        public NotesController(IRepository<Note> noteRepository,IRepository<Eleve> eleveRepository,IRepository<Matiere> matiereRepository,IRepository<Professeur> professeurRepository,IMapper mapper)
        {
            _noteRepository = noteRepository;
            _eleveRepository = eleveRepository;
            _matiereRepository = matiereRepository;
            _professeurRepository = professeurRepository;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<NoteDto>>> GetAllNotes()
        {
            var notes = await _noteRepository.GetAllAsync();
            var noteDtos = _mapper.Map<IEnumerable<NoteDto>>(notes);
            return Ok(noteDtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<NoteDto>> GetNoteById(int id)
        {
            var note = await _noteRepository.GetByIdAsync(id);
            if (note == null) return NotFound($"Note avec l'ID {id} non trouvée.");

            var noteDto = _mapper.Map<NoteDto>(note);
            return Ok(noteDto);
        }

        [HttpPost]
        public async Task<ActionResult<NoteDto>> CreateNote(CreateNoteDto createNoteDto)
        {
            if (createNoteDto.NoteValue < 0 || createNoteDto.NoteValue > 20)
                return BadRequest("La note doit être comprise entre 0 et 20.");

            if (!await _eleveRepository.ExistsAsync(createNoteDto.EleveId))
                return BadRequest($"Pas d'élève avec cet ID : {createNoteDto.EleveId}.");

            if (!await _matiereRepository.ExistsAsync(createNoteDto.MatiereId))
                return BadRequest($"La matière {createNoteDto.MatiereId} n'existe pas.");

            if (!await _professeurRepository.ExistsAsync(createNoteDto.ProfesseurId))
                return BadRequest($"Le professeur avec cet ID :{createNoteDto.ProfesseurId} n'existe pas.");

            var note = _mapper.Map<Note>(createNoteDto);
            var createdNote = await _noteRepository.AddAsync(note);
            var noteDto = _mapper.Map<NoteDto>(createdNote);

            return CreatedAtAction(nameof(GetNoteById), new { id = noteDto.Id }, noteDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateNote(int id, UpdateNoteDto updateNoteDto)
        {
            var note = await _noteRepository.GetByIdAsync(id);

                if (note == null) return NotFound($"La Note avec l'ID {id} n'existe pas.");

                if (updateNoteDto.NoteValue < 0 || updateNoteDto.NoteValue > 20)
                    return BadRequest("La note doit être comprise entre 0 et 20.");

                if (!await _matiereRepository.ExistsAsync(updateNoteDto.MatiereId))
                    return BadRequest($"La matière {updateNoteDto.MatiereId} n'existe pas.");

                if (!await _professeurRepository.ExistsAsync(updateNoteDto.ProfesseurId))
                    return BadRequest($"Le professeur {updateNoteDto.ProfesseurId} n'existe pas.");

            _mapper.Map(updateNoteDto, note);
            await _noteRepository.UpdateAsync(note);

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNote(int id)
        {
            var note = await _noteRepository.GetByIdAsync(id);
            if (note == null) return NotFound($"La Note avec l'ID {id} n'existe pas.");

            await _noteRepository.DeleteAsync(note);
            return NoContent();
        }
    }
}
