namespace College.Api.Domain.Entities
{
    public class Note : BaseEntity
    {
        public decimal NoteValue { get; set; }
        public int EleveId { get; set; }
        public int MatiereId { get; set; }
        public int ProfesseurId { get; set; }

        public required virtual Eleve Eleve { get; set; }
        public required virtual Matiere Matiere { get; set; }
        public required virtual Professeur Professeur { get; set; }
    }
}
