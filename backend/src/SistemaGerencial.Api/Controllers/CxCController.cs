using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaGerencial.Application.Finanzas.Commands.CrearCuentaPorCobrar;
using SistemaGerencial.Application.Finanzas.Queries.GetCuentasPorCobrar;

namespace SistemaGerencial.Api.Controllers;

[ApiController]
[Route("api/cxc")]
[Authorize]
public class CxCController : ControllerBase
{
    private readonly IMediator _mediator;

    public CxCController(IMediator mediator)
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
            new GetCuentasPorCobrarQuery(estado, pagina),
            cancellationToken);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Crear(
        [FromBody] CrearCuentaPorCobrarCommand command,
        CancellationToken cancellationToken)
    {
        var id = await _mediator.Send(command, cancellationToken);
        return Ok(new { id });
    }
}