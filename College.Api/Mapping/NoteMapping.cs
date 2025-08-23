using AutoMapper;
using College.Api.Domain.Entities;
using College.Api.Dtos;

namespace College.Api.Mapping
{
    public class NoteMapping : Profile
    {
        public NoteMapping()
        {
            // Mapping Note -> NoteDto
            CreateMap<Note, NoteDto>()
                .ForMember(dest => dest.EleveLastName, opt => opt.MapFrom(src => src.Eleve != null ? src.Eleve.Nom : ""))
                .ForMember(dest => dest.EleveFirstName, opt => opt.MapFrom(src => src.Eleve != null ? src.Eleve.Prenom : ""))
                .ForMember(dest => dest.MatiereNom, opt => opt.MapFrom(src => src.Matiere != null ? src.Matiere.Nom : ""))
                .ForMember(dest => dest.ProfesseurLastName, opt => opt.MapFrom(src => src.Professeur != null ? src.Professeur.Nom : ""))
                .ForMember(dest => dest.ProfesseurFirstName, opt => opt.MapFrom(src => src.Professeur != null ? src.Professeur.Prenom : ""));

            // Mapping CreateNoteDto -> Note
            CreateMap<CreateNoteDto, Note>();

            // Mapping UpdateNoteDto -> Note
            CreateMap<UpdateNoteDto, Note>();
        }
    }
}
