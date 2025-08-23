namespace College.Api.Dtos
{
    public class ProfesseurDto
    {
        public int Id { get; set; }
        public string Nom { get; set; } = string.Empty;
        public string Prenom { get; set; } = string.Empty;
        public string Genre { get; set; } = string.Empty;
        public List<string> Matieres { get; set; } = new List<string>();
    }
}
