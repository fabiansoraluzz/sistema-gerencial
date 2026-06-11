using MediatR;

namespace SistemaGerencial.Application.Finanzas.Commands.CrearCuentaPorCobrar;

public record CrearCuentaPorCobrarCommand(
    string NombreContacto,
    string TipoContacto,
    string Concepto,
    decimal MontoTotal,
    DateOnly FechaEmision,
    DateOnly FechaVencimiento,
    string? NumeroDocumento,
    bool TieneIgv
) : IRequest<Guid>;