using College.Api.Domain.Entities;
using College.Api.Domain.Interfaces;
using College.Api.Dtos;
using College.Api.Infrastructure.Data;
using College.Api.Mapping;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace College.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClassesController : ControllerBase
    {
        private readonly IRepository<Classe> _classeRepository;
        private readonly CollegeDbContext _context;

        public ClassesController(IRepository<Classe> classeRepository, CollegeDbContext context)
        {
            _classeRepository = classeRepository;
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ClasseDto>>> GetAllClasses()
        {
            var classes = await _context.Classes
                .Include(c => c.ProfesseurPrincipal)
                .Include(c => c.Eleves)
                .ToListAsync();

            return Ok(classes.ToDtoList());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ClasseDto>> GetClasseById(int id)
        {
            var classe = await _context.Classes
                .Include(c => c.ProfesseurPrincipal)
                .Include(c => c.Eleves)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (classe == null) return NotFound();

            return Ok(classe.ToDto());
        }
    }
}
