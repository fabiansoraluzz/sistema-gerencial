using MediatR;

namespace SistemaGerencial.Application.Finanzas.Queries.GetCuentasPorPagar;

public record GetCuentasPorPagarQuery(
    string? Estado = null,
    int Pagina = 1,
    int TamanoPagina = 20
) : IRequest<GetCuentasPorPagarResult>;