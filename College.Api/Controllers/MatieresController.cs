using College.Api.Domain.Entities;
using College.Api.Domain.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace College.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MatieresController : ControllerBase
    {
        private readonly IRepository<Matiere> _matiereRepository;

        public MatieresController(IRepository<Matiere> matiereRepository)
        {
            _matiereRepository = matiereRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IList<Matiere>>> GetAllMatieres()
        {
            var matieres = await _matiereRepository.GetAllAsync();
            return Ok(matieres);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Matiere>> GetMatiereById(int id)
        {
            var matiere = await _matiereRepository.GetByIdAsync(id);

            if (matiere == null)
            {
                return NotFound();
            }

            return Ok(matiere);
        }
    }
}