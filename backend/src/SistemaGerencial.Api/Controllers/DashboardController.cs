using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaGerencial.Application.Auth.Queries.GetDashboard;
using SistemaGerencial.Application.Finanzas.Queries.GetDashboard;

namespace SistemaGerencial.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly IMediator _mediator;

    public DashboardController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> Get(CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new GetDashboardQuery(), cancellationToken);
        return Ok(result);
    }
}