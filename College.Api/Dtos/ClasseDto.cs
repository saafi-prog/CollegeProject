namespace College.Api.Dtos
{
    public class ClasseDto
    {
        public int Id { get; set; }
        public string NiveauNom { get; set; } = string.Empty;
        public int? ProfesseurPrincipalId { get; set; }
        public string ProfesseurPrincipalNom { get; set; } = "Non défini";
        public string ProfesseurPrincipalPrenom { get; set; } = "";
        public List<string> Eleves { get; set; } = new List<string>();
    }
}
