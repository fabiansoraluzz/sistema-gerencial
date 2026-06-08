using SistemaGerencial.Domain.Entities;

namespace SistemaGerencial.Application.Common.Interfaces;

public interface ITokenService
{
    string GenerarAccessToken(Usuario usuario);
    string GenerarRefreshToken();
}