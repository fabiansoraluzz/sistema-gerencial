using MediatR;

namespace SistemaGerencial.Application.Finanzas.Queries.GetCuentasPorCobrar;

public record GetCuentasPorCobrarQuery(
    string? Estado = null,
    int Pagina = 1,
    int TamanoPagina = 20
) : IRequest<GetCuentasPorCobrarResult>;