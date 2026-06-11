using Microsoft.EntityFrameworkCore;
using SistemaGerencial.Domain.Entities;
using System.Collections.Generic;

namespace SistemaGerencial.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<Empresa> Empresas { get; }
    DbSet<Usuario> Usuarios { get; }
    DbSet<Rol> Roles { get; }
    DbSet<SesionActiva> SesionesActivas { get; }
    DbSet<MovimientoCaja> MovimientosCaja { get; }
    DbSet<CuentaPorCobrar> CuentasPorCobrar { get; }
    DbSet<CuentaPorPagar> CuentasPorPagar { get; }
    DbSet<AreaEmpresa> AreasEmpresa { get; }
    DbSet<CuentaBancaria> CuentasBancarias { get; }
    DbSet<CategoriaGasto> CategoriasGasto { get; }
    DbSet<Contacto> Contactos { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}