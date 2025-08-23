namespace College.Api.Domain.Entities
{
    public class Professeur : BaseEntity
    {
        public string Nom { get; set; } = string.Empty;
        public string Prenom { get; set; } = string.Empty;
        public string Genre { get; set; } = string.Empty;

        // Navigation properties
        public virtual ICollection<Classe> ClassesPrincipales { get; set; } = new List<Classe>();
        public virtual ICollection<ProfesseurMatieres> ProfesseurMatieres { get; set; } = new List<ProfesseurMatieres>();
        public virtual ICollection<Note> Notes { get; set; } = new List<Note>();
    }
}
