namespace College.Api.Dtos
{
    public class NoteDto
    {
        public int Id { get; set; }
        public decimal NoteValue { get; set; }
        public int EleveId { get; set; }
        public string EleveLastName { get; set; } = string.Empty;
        public string EleveFirstName { get; set; } = string.Empty;
        public int MatiereId { get; set; }
        public string MatiereNom { get; set; } = string.Empty;
        public int ProfesseurId { get; set; }
        public string ProfesseurLastName { get; set; } = string.Empty;
        public string ProfesseurFirstName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class CreateNoteDto
    {
        public decimal NoteValue { get; set; }
        public int EleveId { get; set; }
        public int MatiereId { get; set; }
        public int ProfesseurId { get; set; }
    }

    public class UpdateNoteDto
    {
        public decimal NoteValue { get; set; }
        public int MatiereId { get; set; }
        public int ProfesseurId { get; set; }
    }
}


