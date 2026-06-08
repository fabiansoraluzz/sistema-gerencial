using System.Security.Cryptography;
using System.Text;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SistemaGerencial.Application.Common.Interfaces;

namespace SistemaGerencial.Application.Auth.Commands.Logout;

public class LogoutCommandHandler : IRequestHandler<LogoutCommand>
{
    private readonly IApplicationDbContext _context;

    public LogoutCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(
        LogoutCommand request,
        CancellationToken cancellationToken)
    {
        var tokenHash = HashToken(request.RefreshToken);

        var sesion = await _context.SesionesActivas
            .FirstOrDefaultAsync(
                s => s.RefreshTokenHash == tokenHash
                  && s.RevocadaEn == null,
                cancellationToken);

        // Si no existe la sesión no hacemos nada
        // (ya fue revocada o nunca existió)
        if (sesion == null) return;

        sesion.RevocadaEn = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);
    }

    private static string HashToken(string token)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(token));
        return Convert.ToBase64String(bytes);
    }
}