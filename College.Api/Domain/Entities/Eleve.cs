namespace College.Api.Domain.Entities
{
    public class Eleve : BaseEntity
    {
        public string Nom {  get; set; } = string.Empty;
        public string Prenom { get; set;} = string.Empty;
        public string Genre { get; set;} = string.Empty;
        public int ClasseId { get; set; }

        public  virtual Classe? Classe { get; set; }
        public virtual ICollection<Note> Notes { get; set; } = new List<Note>();
    }
}
