using Microsoft.EntityFrameworkCore;
using SistemaGerencial.Domain.Entities;

namespace SistemaGerencial.Infrastructure.Persistence;

public static class ApplicationDbContextSeed
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        // Solo sembrar si no hay datos
        if (await context.Empresas.AnyAsync())
            return;

        // Empresa de prueba
        var empresa = new Empresa
        {
            Id = Guid.NewGuid(),
            Nombre = "Clínica Demo",
            Ruc = "20123456789",
            Rubro = "Salud",
            ZonaHoraria = "America/Lima",
            Moneda = "PEN",
            EstaActiva = true,
            Configuracion = "{}"
        };
        await context.Empresas.AddAsync(empresa);

        // Rol administrador
        var rolAdmin = new Rol
        {
            Id = Guid.NewGuid(),
            EmpresaId = empresa.Id,
            Nombre = "gerente",
            Descripcion = "Gerente con acceso completo",
            EsSistema = true
        };
        await context.Roles.AddAsync(rolAdmin);

        // Usuario administrador
        var usuario = new Usuario
        {
            Id = Guid.NewGuid(),
            EmpresaId = empresa.Id,
            RolId = rolAdmin.Id,
            NombreCompleto = "Administrador Demo",
            Email = "admin@clinicademo.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
            Estado = "activo",
            EstaDeAcuerdoPolitica = true,
            FechaAcuerdoPolitica = DateTime.UtcNow
        };
        await context.Usuarios.AddAsync(usuario);

        await context.SaveChangesAsync();
    }
}