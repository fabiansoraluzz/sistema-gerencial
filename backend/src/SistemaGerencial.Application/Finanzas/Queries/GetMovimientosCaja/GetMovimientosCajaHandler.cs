using MediatR;
using Microsoft.EntityFrameworkCore;
using SistemaGerencial.Application.Common.Interfaces;

namespace SistemaGerencial.Application.Finanzas.Queries.GetMovimientosCaja;

public class GetMovimientosCajaHandler
    : IRequestHandler<GetMovimientosCajaQuery, GetMovimientosResult>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public GetMovimientosCajaHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<GetMovimientosResult> Handle(
        GetMovimientosCajaQuery request,
        CancellationToken cancellationToken)
    {
        var empresaId = _currentUser.EmpresaId!.Value;
        var ahora = DateTime.UtcNow;
        var mes = request.Mes > 0 ? request.Mes : ahora.Month;
        var anio = request.Anio > 0 ? request.Anio : ahora.Year;

        var query = _context.MovimientosCaja
            .Include(m => m.Area)
            .Include(m => m.Categoria)
            .Where(m => m.EmpresaId == empresaId
                && m.EliminadoEn == null
                && m.FechaMovimiento.Month == mes
                && m.FechaMovimiento.Year == anio);

        if (!string.IsNullOrEmpty(request.Tipo))
            query = query.Where(m => m.Tipo == request.Tipo);

        var total = await query.CountAsync(cancellationToken);

        var totalIngresosCentimos = await query
            .Where(m => m.Tipo == "ingreso")
            .SumAsync(m => m.MontoCentimos, cancellationToken);

        var totalEgresosCentimos = await query
            .Where(m => m.Tipo == "egreso")
            .SumAsync(m => m.MontoCentimos, cancellationToken);

        var items = await query
            .OrderByDescending(m => m.FechaMovimiento)
            .ThenByDescending(m => m.CreadoEn)
            .Skip((request.Pagina - 1) * request.TamanoPagina)
            .Take(request.TamanoPagina)
            .Select(m => new MovimientoCajaDto
            {
                Id = m.Id,
                Tipo = m.Tipo,
                Monto = m.MontoCentimos / 100m,
                Descripcion = m.Descripcion ?? string.Empty,
                FechaMovimiento = m.FechaMovimiento,
                MetodoPago = m.MetodoPago,
                NombreArea = m.Area != null ? m.Area.Nombre : null,
                NombreCategoria = m.Categoria != null ? m.Categoria.Nombre : null,
                NumeroDocumento = m.NumeroDocumento,
                TieneIgv = m.TieneIgv,
                IgvMonto = m.IgvCentimos / 100m,
                CreadoEn = m.CreadoEn,
            })
            .ToListAsync(cancellationToken);

        return new GetMovimientosResult
        {
            Items = items,
            Total = total,
            TotalIngresos = totalIngresosCentimos / 100m,
            TotalEgresos = totalEgresosCentimos / 100m,
            Saldo = (totalIngresosCentimos - totalEgresosCentimos) / 100m,
        };
    }
}