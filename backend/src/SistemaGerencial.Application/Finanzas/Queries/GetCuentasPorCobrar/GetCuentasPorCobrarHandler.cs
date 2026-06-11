using MediatR;
using Microsoft.EntityFrameworkCore;
using SistemaGerencial.Application.Common.Interfaces;

namespace SistemaGerencial.Application.Finanzas.Queries.GetCuentasPorCobrar;

public class GetCuentasPorCobrarHandler
    : IRequestHandler<GetCuentasPorCobrarQuery, GetCuentasPorCobrarResult>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public GetCuentasPorCobrarHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<GetCuentasPorCobrarResult> Handle(
        GetCuentasPorCobrarQuery request,
        CancellationToken cancellationToken)
    {
        var empresaId = _currentUser.EmpresaId!.Value;
        var hoy = DateOnly.FromDateTime(DateTime.UtcNow);

        var query = _context.CuentasPorCobrar
            .Include(c => c.Contacto)
            .Where(c => c.EmpresaId == empresaId
                && c.EliminadoEn == null);

        if (!string.IsNullOrEmpty(request.Estado))
            query = query.Where(c => c.Estado == request.Estado);

        var total = await query.CountAsync(cancellationToken);

        var totalPendienteCentimos = await query
            .Where(c => c.Estado != "cobrado" && c.Estado != "anulado")
            .SumAsync(c => c.MontoTotalCentimos - c.MontoCobradoCentimos,
                cancellationToken);

        var totalVencidoCentimos = await query
            .Where(c => c.Estado == "vencido")
            .SumAsync(c => c.MontoTotalCentimos - c.MontoCobradoCentimos,
                cancellationToken);

        var totalCobradoCentimos = await query
            .Where(c => c.Estado == "cobrado")
            .SumAsync(c => c.MontoTotalCentimos, cancellationToken);

        var items = await query
            .OrderBy(c => c.FechaVencimiento)
            .Skip((request.Pagina - 1) * request.TamanoPagina)
            .Take(request.TamanoPagina)
            .Select(c => new CuentaPorCobrarDto
            {
                Id = c.Id,
                NombreContacto = c.Contacto.Nombre,
                TipoContacto = c.Contacto.TipoContacto,
                Concepto = c.Concepto,
                MontoTotal = c.MontoTotalCentimos / 100m,
                MontoCobrado = c.MontoCobradoCentimos / 100m,
                MontoPendiente = (c.MontoTotalCentimos - c.MontoCobradoCentimos) / 100m,
                FechaEmision = c.FechaEmision,
                FechaVencimiento = c.FechaVencimiento,
                Estado = c.Estado,
                NumeroDocumento = c.NumeroDocumento,
                DiasVencimiento = c.FechaVencimiento.DayNumber - hoy.DayNumber,
                CreadoEn = c.CreadoEn,
            })
            .ToListAsync(cancellationToken);

        return new GetCuentasPorCobrarResult
        {
            Items = items,
            Total = total,
            TotalPendiente = totalPendienteCentimos / 100m,
            TotalVencido = totalVencidoCentimos / 100m,
            TotalCobrado = totalCobradoCentimos / 100m,
        };
    }
}