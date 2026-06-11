using MediatR;

namespace SistemaGerencial.Application.Finanzas.Commands.CrearMovimientoCaja;

public record CrearMovimientoCajaCommand(
    string Tipo,
    decimal Monto,
    string Descripcion,
    DateOnly FechaMovimiento,
    string MetodoPago,
    Guid? CuentaBancariaId,
    Guid? CategoriaId,
    Guid? AreaId,
    string? NumeroDocumento,
    string? Referencia,
    bool TieneIgv
) : IRequest<Guid>;