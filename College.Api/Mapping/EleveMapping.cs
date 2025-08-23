using College.Api.Domain.Entities;
using College.Api.Dtos;

namespace College.Api.Mapping
{
    public static class EleveMapping
    {
        // Mapping Eleve -> EleveDto
        public static EleveDto ToDto(this Eleve eleve)
        {
            if (eleve == null) return null;

            return new EleveDto
            {
                Id = eleve.Id,
                Nom = eleve.Nom,
                Prenom = eleve.Prenom,
                Genre = eleve.Genre,
                ClasseId = eleve.ClasseId,
                ClassName = eleve.Classe?.NiveauNom ?? ""
            };
        }

        // Mapping d'une liste Eleve -> liste EleveDto
        public static List<EleveDto> ToDtoList(this IEnumerable<Eleve> eleves)
        {
            return eleves.Select(e => e.ToDto()).ToList();
        }

        // Mapping Note -> NoteDto avec eleve en paramètre
        public static NoteDto ToDto(this Note note, Eleve eleve)
        {
            if (note == null) return null;

            return new NoteDto
            {
                Id = note.Id,
                NoteValue = note.NoteValue,
                EleveId = note.EleveId,
                EleveLastName = eleve.Nom,
                EleveFirstName = eleve.Prenom,
                MatiereId = note.MatiereId,
                MatiereNom = note.Matiere?.Nom ?? "",
                ProfesseurId = note.ProfesseurId,
                ProfesseurLastName = note.Professeur?.Nom ?? "",
                ProfesseurFirstName = note.Professeur?.Prenom ?? "",
                CreatedAt = note.CreatedAt
            };
        }

        // Mapping d'une liste Note -> liste NoteDto
        public static List<NoteDto> ToDtoList(this IEnumerable<Note> notes, Eleve eleve)
        {
            return notes.Select(n => n.ToDto(eleve)).ToList();
        }
    }
}
