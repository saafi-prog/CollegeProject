namespace College.Api.Domain.Entities
{
    public class Matiere : BaseEntity
    {
        public string Nom { get; set; } = string.Empty;

        public virtual ICollection<ProfesseurMatieres> ProfesseurMatieres { get; set; } = new List<ProfesseurMatieres>();
        public virtual ICollection<Note> Notes { get; set; } = new List<Note>();
    }
}
