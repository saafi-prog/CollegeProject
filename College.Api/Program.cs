using College.Api.Domain.Interfaces;
using College.Api.Infrastructure.Data;
using College.Api.Infrastructure.Repositories; // <- Repository<T>
using College.Api.Mapping;
using Microsoft.EntityFrameworkCore;
using Npgsql.EntityFrameworkCore.PostgreSQL;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// DbContext
builder.Services.AddDbContext<CollegeDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Dépôt générique
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

// Dépôts spécifiques EleveRepository
builder.Services.AddScoped<IEleveRepository, EleveRepository>();

// AutoMapper
builder.Services.AddAutoMapper(
    typeof(ProfesseurMapping),
    typeof(NoteMapping),
    typeof(EleveMapping)
);

// CORS pour React - Configuration plus permissive pour le développement
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins(
               "http://localhost:5173",// Vite (HTTP)
               "http://localhost:3000", // CRA (Create React App) en HTTP
               "https://localhost:5173",// Vite (HTTPS)
               "https://localhost:3000" // CRA (Create React App) en HTTPS 
           )
           .AllowAnyHeader()
           .AllowAnyMethod()
           .AllowCredentials();
    });

    // Policy plus permissive pour le développement
    options.AddPolicy("DevelopmentCors", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// CORS doit être avant UseAuthorization
app.UseCors(app.Environment.IsDevelopment() ? "DevelopmentCors" : "AllowReactApp");

app.UseAuthorization();

// Redirection automatique vers Swagger
app.MapGet("/", () => Results.Redirect("/swagger"));

// Endpoint de statut API (utile pour les vérifications)
app.MapGet("/Api/status", () => new
{
    Status = "OK",
    Message = "API College fonctionne correctement",
    Timestamp = DateTime.Now,
    Version = "1.0"
});

// Redirection des routes incorrectes vers Swagger
app.MapGet("/eleves", () => Results.Redirect("/swagger"));
app.MapGet("/classes", () => Results.Redirect("/swagger"));
app.MapGet("/professeurs", () => Results.Redirect("/swagger"));
app.MapGet("/notes", () => Results.Redirect("/swagger"));

app.UseStaticFiles();
app.MapControllers();

// Supprimé car cela interfère avec notre API
// app.MapFallbackToFile("index.html");

app.Run();