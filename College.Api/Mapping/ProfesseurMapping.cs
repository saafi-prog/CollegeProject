using AutoMapper;
using College.Api.Domain.Entities;
using College.Api.Dtos;

namespace College.Api.Mapping
{
    public class ProfesseurMapping : Profile
    {
        public ProfesseurMapping()
        {
            CreateMap<Professeur, ProfesseurDto>()
                .ForMember(p => p.Matieres,
                           opt => opt.MapFrom(src => src.ProfesseurMatieres
                                                       .Select(pm => pm.Matiere.Nom)
                                                       .ToList()));
        }
    }
}
