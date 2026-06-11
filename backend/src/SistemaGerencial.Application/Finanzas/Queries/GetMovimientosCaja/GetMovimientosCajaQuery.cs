using MediatR;

namespace SistemaGerencial.Application.Finanzas.Queries.GetMovimientosCaja;

public record GetMovimientosCajaQuery(
    string? Tipo = null,
    int Mes = 0,
    int Anio = 0,
    int Pagina = 1,
    int TamanoPagina = 20
) : IRequest<GetMovimientosResult>;