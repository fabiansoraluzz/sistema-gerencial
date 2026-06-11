using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaGerencial.Application.Finanzas.Commands.CrearCuentaPorPagar;
using SistemaGerencial.Application.Finanzas.Queries.GetCuentasPorPagar;

namespace SistemaGerencial.Api.Controllers;

[ApiController]
[Route("api/cxp")]
[Authorize]
public class CxPController : ControllerBase
{
    private readonly IMediator _mediator;

    public CxPController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> Get(
        [FromQuery] string? estado,
        [FromQuery] int pagina = 1,
        CancellationToken cancellationToken = default)
    {
        var result = await _mediator.Send(
            new GetCuentasPorPagarQuery(estado, pagina),
            cancellationToken);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Crear(
        [FromBody] CrearCuentaPorPagarCommand command,
        CancellationToken cancellationToken)
    {
        var id = await _mediator.Send(command, cancellationToken);
        return Ok(new { id });
    }
}