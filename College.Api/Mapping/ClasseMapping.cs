using College.Api.Domain.Entities;
using College.Api.Dtos;

namespace College.Api.Mapping
{
    public static class ClasseMapping
    {
        public static ClasseDto ToDto(this Classe classe)
        {
            return new ClasseDto
            {
                Id = classe.Id,
                NiveauNom = classe.NiveauNom,
                ProfesseurPrincipalId = classe.ProfesseurPrincipalId,
                ProfesseurPrincipalNom = classe.ProfesseurPrincipal != null
                    ? classe.ProfesseurPrincipal.Nom
                    : "Non défini",
                ProfesseurPrincipalPrenom = classe.ProfesseurPrincipal?.Prenom ?? "",
                Eleves = classe.Eleves.Select(e => $"{e.Prenom} {e.Nom}").ToList()
            };
        }

        public static List<ClasseDto> ToDtoList(this IEnumerable<Classe> classes)
        {
            return classes.Select(c => c.ToDto()).ToList();
        }
    }
}
