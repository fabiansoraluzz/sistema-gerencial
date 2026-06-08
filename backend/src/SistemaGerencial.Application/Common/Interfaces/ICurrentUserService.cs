namespace SistemaGerencial.Application.Common.Interfaces;

public interface ICurrentUserService
{
    Guid? UserId { get; }
    Guid? EmpresaId { get; }
    string? Email { get; }
    bool IsAuthenticated { get; }
}