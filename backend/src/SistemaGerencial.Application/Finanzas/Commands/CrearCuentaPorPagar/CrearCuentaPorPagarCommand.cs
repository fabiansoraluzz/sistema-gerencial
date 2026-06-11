using MediatR;

namespace SistemaGerencial.Application.Finanzas.Commands.CrearCuentaPorPagar;

public record CrearCuentaPorPagarCommand(
    string NombreContacto,
    string TipoContacto,
    string Concepto,
    decimal MontoTotal,
    DateOnly FechaEmision,
    DateOnly FechaVencimiento,
    string? NumeroDocumento,
    bool TieneIgv
) : IRequest<Guid>;