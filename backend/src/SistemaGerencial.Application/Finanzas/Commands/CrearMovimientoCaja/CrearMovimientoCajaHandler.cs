using MediatR;
using SistemaGerencial.Application.Common.Interfaces;
using SistemaGerencial.Domain.Entities;

namespace SistemaGerencial.Application.Finanzas.Commands.CrearMovimientoCaja;

public class CrearMovimientoCajaHandler
    : IRequestHandler<CrearMovimientoCajaCommand, Guid>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public CrearMovimientoCajaHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<Guid> Handle(
        CrearMovimientoCajaCommand request,
        CancellationToken cancellationToken)
    {
        var empresaId = _currentUser.EmpresaId!.Value;
        var usuarioId = _currentUser.UserId!.Value;

        var igvCentimos = 0L;
        var montoCentimos = (long)(request.Monto * 100);

        if (request.TieneIgv)
        {
            // IGV 18% incluido en el monto
            igvCentimos = (long)(montoCentimos - (montoCentimos / 1.18m));
        }

        var movimiento = new MovimientoCaja
        {
            EmpresaId = empresaId,
            Tipo = request.Tipo,
            MontoCentimos = montoCentimos,
            Descripcion = request.Descripcion,
            FechaMovimiento = request.FechaMovimiento,
            MetodoPago = request.MetodoPago,
            CuentaBancariaId = request.CuentaBancariaId,
            CategoriaId = request.CategoriaId,
            AreaId = request.AreaId,
            NumeroDocumento = request.NumeroDocumento,
            Referencia = request.Referencia,
            TieneIgv = request.TieneIgv,
            IgvCentimos = igvCentimos,
            CreadoPor = usuarioId,
        };

        await _context.MovimientosCaja.AddAsync(movimiento, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        return movimiento.Id;
    }
}