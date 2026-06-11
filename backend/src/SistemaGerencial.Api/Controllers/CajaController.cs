using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaGerencial.Application.Finanzas.Commands.CrearMovimientoCaja;
using SistemaGerencial.Application.Finanzas.Queries.GetMovimientosCaja;

namespace SistemaGerencial.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CajaController : ControllerBase
{
    private readonly IMediator _mediator;

    public CajaController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetMovimientos(
        [FromQuery] string? tipo,
        [FromQuery] int mes = 0,
        [FromQuery] int anio = 0,
        [FromQuery] int pagina = 1,
        CancellationToken cancellationToken = default)
    {
        var result = await _mediator.Send(
            new GetMovimientosCajaQuery(tipo, mes, anio, pagina),
            cancellationToken);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> CrearMovimiento(
        [FromBody] CrearMovimientoCajaCommand command,
        CancellationToken cancellationToken)
    {
        var id = await _mediator.Send(command, cancellationToken);
        return Ok(new { id });
    }
}