using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace College.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "matieres",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nom = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_matieres", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "professeurs",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nom = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    prenom = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    genre = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_professeurs", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "classes",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    niveau_nom = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    professeur_principal_id = table.Column<int>(type: "integer", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_classes", x => x.id);
                    table.ForeignKey(
                        name: "FK_classes_professeurs_professeur_principal_id",
                        column: x => x.professeur_principal_id,
                        principalTable: "professeurs",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "professeur_matieres",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    professeur_id = table.Column<int>(type: "integer", nullable: false),
                    matiere_id = table.Column<int>(type: "integer", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_professeur_matieres", x => x.id);
                    table.ForeignKey(
                        name: "FK_professeur_matieres_matieres_matiere_id",
                        column: x => x.matiere_id,
                        principalTable: "matieres",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_professeur_matieres_professeurs_professeur_id",
                        column: x => x.professeur_id,
                        principalTable: "professeurs",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "eleves",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nom = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    prenom = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    genre = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    classe_id = table.Column<int>(type: "integer", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_eleves", x => x.id);
                    table.ForeignKey(
                        name: "FK_eleves_classes_classe_id",
                        column: x => x.classe_id,
                        principalTable: "classes",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "notes",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    valeur = table.Column<decimal>(type: "numeric(4,2)", nullable: false),
                    eleve_id = table.Column<int>(type: "integer", nullable: false),
                    matiere_id = table.Column<int>(type: "integer", nullable: false),
                    professeur_id = table.Column<int>(type: "integer", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_notes", x => x.id);
                    table.ForeignKey(
                        name: "FK_notes_eleves_eleve_id",
                        column: x => x.eleve_id,
                        principalTable: "eleves",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_notes_matieres_matiere_id",
                        column: x => x.matiere_id,
                        principalTable: "matieres",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_notes_professeurs_professeur_id",
                        column: x => x.professeur_id,
                        principalTable: "professeurs",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_classes_professeur_principal_id",
                table: "classes",
                column: "professeur_principal_id");

            migrationBuilder.CreateIndex(
                name: "IX_eleves_classe_id",
                table: "eleves",
                column: "classe_id");

            migrationBuilder.CreateIndex(
                name: "IX_matieres_nom",
                table: "matieres",
                column: "nom",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_notes_eleve_id",
                table: "notes",
                column: "eleve_id");

            migrationBuilder.CreateIndex(
                name: "IX_notes_matiere_id",
                table: "notes",
                column: "matiere_id");

            migrationBuilder.CreateIndex(
                name: "IX_notes_professeur_id",
                table: "notes",
                column: "professeur_id");

            migrationBuilder.CreateIndex(
                name: "IX_professeur_matieres_matiere_id",
                table: "professeur_matieres",
                column: "matiere_id");

            migrationBuilder.CreateIndex(
                name: "IX_professeur_matieres_professeur_id_matiere_id",
                table: "professeur_matieres",
                columns: new[] { "professeur_id", "matiere_id" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "notes");

            migrationBuilder.DropTable(
                name: "professeur_matieres");

            migrationBuilder.DropTable(
                name: "eleves");

            migrationBuilder.DropTable(
                name: "matieres");

            migrationBuilder.DropTable(
                name: "classes");

            migrationBuilder.DropTable(
                name: "professeurs");
        }
    }
}
