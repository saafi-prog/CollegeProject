namespace College.Api.Domain.Entities
{
    public class ProfesseurMatieres : BaseEntity
    {
        public int ProfesseurId { get; set; }
        public int MatiereId { get; set; }

        public required virtual Professeur Professeur { get; set; }
        public required virtual Matiere Matiere { get; set; }
    }
}
