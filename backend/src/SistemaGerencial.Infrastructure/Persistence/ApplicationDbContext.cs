using Microsoft.EntityFrameworkCore;
using SistemaGerencial.Application.Common.Interfaces;
using SistemaGerencial.Domain.Entities;

namespace SistemaGerencial.Infrastructure.Persistence;

public class ApplicationDbContext : DbContext, IApplicationDbContext
{
    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Empresa> Empresas => Set<Empresa>();
    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<Rol> Roles => Set<Rol>();
    public DbSet<SesionActiva> SesionesActivas => Set<SesionActiva>();
    public DbSet<MovimientoCaja> MovimientosCaja => Set<MovimientoCaja>();
    public DbSet<CuentaPorCobrar> CuentasPorCobrar => Set<CuentaPorCobrar>();
    public DbSet<CuentaPorPagar> CuentasPorPagar => Set<CuentaPorPagar>();
    public DbSet<AreaEmpresa> AreasEmpresa => Set<AreaEmpresa>();
    public DbSet<CuentaBancaria> CuentasBancarias => Set<CuentaBancaria>();
    public DbSet<CategoriaGasto> CategoriasGasto => Set<CategoriaGasto>();
    public DbSet<Contacto> Contactos => Set<Contacto>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(
            typeof(ApplicationDbContext).Assembly);
    }
}