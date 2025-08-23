using College.Api.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace College.Api.Infrastructure.Data
{
    public class CollegeDbContext : DbContext
    {
        public CollegeDbContext(DbContextOptions<CollegeDbContext> options) : base(options)
        {
        }

        public DbSet<Eleve> Eleves { get; set; }
        public DbSet<Professeur> Professeurs { get; set; }
        public DbSet<Classe> Classes { get; set; }
        public DbSet<Matiere> Matieres { get; set; }
        public DbSet<Note> Notes { get; set; }
        public DbSet<ProfesseurMatieres> ProfesseurMatieres { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Eleve
            modelBuilder.Entity<Eleve>(entity =>
            {
                entity.ToTable("eleves");
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Id)
                      .HasColumnName("id")
                      .UseIdentityAlwaysColumn();

                entity.Property(e => e.Nom)
                      .HasColumnName("nom")
                      .IsRequired()
                      .HasMaxLength(100);

                entity.Property(e => e.Prenom)
                      .HasColumnName("prenom")
                      .IsRequired()
                      .HasMaxLength(100);

                entity.Property(e => e.Genre)
                      .HasColumnName("genre")
                      .HasMaxLength(10);

                entity.Property(e => e.ClasseId)
                      .HasColumnName("classe_id");

                entity.Property(e => e.CreatedAt)
                      .HasColumnName("created_at")
                      .HasColumnType("timestamp with time zone");

                entity.Property(e => e.UpdatedAt)
                      .HasColumnName("updated_at")
                      .HasColumnType("timestamp with time zone");

                entity.HasOne(e => e.Classe)
                      .WithMany(c => c.Eleves)
                      .HasForeignKey(e => e.ClasseId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // Professeur
            modelBuilder.Entity<Professeur>(entity =>
            {
                entity.ToTable("professeurs");
                entity.HasKey(p => p.Id);

                entity.Property(p => p.Id)
                      .HasColumnName("id")
                      .UseIdentityAlwaysColumn();

                entity.Property(p => p.Nom)
                      .HasColumnName("nom")
                      .IsRequired()
                      .HasMaxLength(100);

                entity.Property(p => p.Prenom)
                      .HasColumnName("prenom")
                      .IsRequired()
                      .HasMaxLength(100);

                entity.Property(p => p.Genre)
                      .HasColumnName("genre")
                      .HasMaxLength(10);

                entity.Property(p => p.CreatedAt)
                      .HasColumnName("created_at")
                      .HasColumnType("timestamp with time zone");

                entity.Property(p => p.UpdatedAt)
                      .HasColumnName("updated_at")
                      .HasColumnType("timestamp with time zone");
            });

            // Classe
            modelBuilder.Entity<Classe>(entity =>
            {
                entity.ToTable("classes");
                entity.HasKey(c => c.Id);

                entity.Property(c => c.Id)
                      .HasColumnName("id")
                      .UseIdentityAlwaysColumn();

                entity.Property(c => c.NiveauNom)
                      .HasColumnName("niveau_nom")
                      .IsRequired()
                      .HasMaxLength(100);

                entity.Property(c => c.ProfesseurPrincipalId)
                      .HasColumnName("professeur_principal_id");

                entity.Property(c => c.CreatedAt)
                      .HasColumnName("created_at")
                      .HasColumnType("timestamp with time zone");

                entity.Property(c => c.UpdatedAt)
                      .HasColumnName("updated_at")
                      .HasColumnType("timestamp with time zone");

                entity.HasOne(c => c.ProfesseurPrincipal)
                      .WithMany(p => p.ClassesPrincipales)
                      .HasForeignKey(c => c.ProfesseurPrincipalId)
                      .OnDelete(DeleteBehavior.SetNull);
            });

            // Matiere
            modelBuilder.Entity<Matiere>(entity =>
            {
                entity.ToTable("matieres");
                entity.HasKey(m => m.Id);

                entity.Property(m => m.Id)
                      .HasColumnName("id")
                      .UseIdentityAlwaysColumn();

                entity.Property(m => m.Nom)
                      .HasColumnName("nom")
                      .IsRequired()
                      .HasMaxLength(100);

                entity.Property(m => m.CreatedAt)
                      .HasColumnName("created_at")
                      .HasColumnType("timestamp with time zone");

                entity.Property(m => m.UpdatedAt)
                      .HasColumnName("updated_at")
                      .HasColumnType("timestamp with time zone");

                entity.HasIndex(m => m.Nom).IsUnique();
            });

            // Note
            modelBuilder.Entity<Note>(entity =>
            {
                entity.ToTable("notes");
                entity.HasKey(n => n.Id);

                entity.Property(n => n.Id)
                      .HasColumnName("id")
                      .UseIdentityAlwaysColumn();

                entity.Property(n => n.NoteValue)
                      .HasColumnName("notevalue")
                      .HasColumnType("decimal(4,2)");

                entity.Property(n => n.EleveId).HasColumnName("eleve_id");
                entity.Property(n => n.MatiereId).HasColumnName("matiere_id");
                entity.Property(n => n.ProfesseurId).HasColumnName("professeur_id");

                entity.Property(n => n.CreatedAt)
                      .HasColumnName("created_at")
                      .HasColumnType("timestamp with time zone");

                entity.Property(n => n.UpdatedAt)
                      .HasColumnName("updated_at")
                      .HasColumnType("timestamp with time zone");

                entity.HasOne(n => n.Eleve)
                      .WithMany(e => e.Notes)
                      .HasForeignKey(n => n.EleveId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(n => n.Matiere)
                      .WithMany(m => m.Notes)
                      .HasForeignKey(n => n.MatiereId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(n => n.Professeur)
                      .WithMany(p => p.Notes)
                      .HasForeignKey(n => n.ProfesseurId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // ProfesseurMatieres
            modelBuilder.Entity<ProfesseurMatieres>(entity =>
            {
                entity.ToTable("professeur_matieres");
                entity.HasKey(pm => pm.Id);

                entity.Property(pm => pm.Id)
                      .HasColumnName("id")
                      .UseIdentityAlwaysColumn();

                entity.Property(pm => pm.ProfesseurId).HasColumnName("professeur_id");
                entity.Property(pm => pm.MatiereId).HasColumnName("matiere_id");

                entity.Property(pm => pm.CreatedAt)
                      .HasColumnName("created_at")
                      .HasColumnType("timestamp with time zone");

                entity.Property(pm => pm.UpdatedAt)
                      .HasColumnName("updated_at")
                      .HasColumnType("timestamp with time zone");

                entity.HasOne(pm => pm.Professeur)
                      .WithMany(p => p.ProfesseurMatieres)
                      .HasForeignKey(pm => pm.ProfesseurId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(pm => pm.Matiere)
                      .WithMany(m => m.ProfesseurMatieres)
                      .HasForeignKey(pm => pm.MatiereId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasIndex(pm => new { pm.ProfesseurId, pm.MatiereId }).IsUnique();
            });

            // 🔑 Conversion globale DateTime => UTC
            var dateTimeConverter = new ValueConverter<DateTime, DateTime>(
                v => v.Kind == DateTimeKind.Utc ? v : v.ToUniversalTime(),
                v => DateTime.SpecifyKind(v, DateTimeKind.Utc)
            );

            var nullableDateTimeConverter = new ValueConverter<DateTime?, DateTime?>(
                v => v.HasValue ? (v.Value.Kind == DateTimeKind.Utc ? v.Value : v.Value.ToUniversalTime()) : v,
                v => v.HasValue ? DateTime.SpecifyKind(v.Value, DateTimeKind.Utc) : v
            );

            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                foreach (var property in entityType.GetProperties())
                {
                    if (property.ClrType == typeof(DateTime))
                        property.SetValueConverter(dateTimeConverter);

                    if (property.ClrType == typeof(DateTime?))
                        property.SetValueConverter(nullableDateTimeConverter);
                }
            }
        }

        // Gestion automatique des dates
        public override int SaveChanges()
        {
            UpdateTimestamps();
            return base.SaveChanges();
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            UpdateTimestamps();
            return base.SaveChangesAsync(cancellationToken);
        }

        private void UpdateTimestamps()
        {
            var entries = ChangeTracker.Entries()
                .Where(e => e.Entity is BaseEntity &&
                           (e.State == EntityState.Added || e.State == EntityState.Modified));

            foreach (var entry in entries)
            {
                var entity = (BaseEntity)entry.Entity;

                entity.UpdatedAt = DateTime.UtcNow;

                if (entry.State == EntityState.Added)
                {
                    entity.CreatedAt = DateTime.UtcNow;
                }
            }
        }
    }
}
