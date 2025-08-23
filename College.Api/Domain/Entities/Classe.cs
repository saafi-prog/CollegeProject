namespace College.Api.Domain.Entities
{
    public class Classe : BaseEntity
    {
        public string NiveauNom { get; set; } = string.Empty;
        public int? ProfesseurPrincipalId { get; set; }   
        public virtual Professeur? ProfesseurPrincipal { get; set; }
        public virtual ICollection<Eleve> Eleves { get; set; } = new List<Eleve>();
        
    }
}
