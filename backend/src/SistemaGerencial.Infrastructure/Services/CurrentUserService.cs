using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using SistemaGerencial.Application.Common.Interfaces;

namespace SistemaGerencial.Infrastructure.Services;

public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public Guid? UserId
    {
        get
        {
            var value = _httpContextAccessor.HttpContext?
                .User.FindFirstValue(ClaimTypes.NameIdentifier);
            return value != null ? Guid.Parse(value) : null;
        }
    }

    public Guid? EmpresaId
    {
        get
        {
            var value = _httpContextAccessor.HttpContext?
                .User.FindFirstValue("empresa_id");
            return value != null ? Guid.Parse(value) : null;
        }
    }

    public string? Email =>
        _httpContextAccessor.HttpContext?
            .User.FindFirstValue(ClaimTypes.Email);

    public bool IsAuthenticated =>
        _httpContextAccessor.HttpContext?
            .User.Identity?.IsAuthenticated ?? false;
}