namespace College.Api.Dtos
{
    public class EleveDto
    {
        public int Id { get; set; }
        public string Nom { get; set; } = string.Empty;
        public string Prenom { get; set; } = string.Empty;
        public string Genre { get; set; } = string.Empty;
        public int ClasseId { get; set; }
        public string ClassName { get; set; } = string.Empty;
    }

    public class CreateEleveDto
    {
        public string Nom { get; set; } = string.Empty;
        public string Prenom { get; set; } = string.Empty;
        public string Genre { get; set; } = string.Empty;
        public int ClasseId { get; set; }
    }

    public class UpdateEleveDto
    {
        public string Nom { get; set; } = string.Empty;
        public string Prenom { get; set; } = string.Empty;
        public string Genre { get; set; } = string.Empty;
        public int ClasseId { get; set; }
    }
}
