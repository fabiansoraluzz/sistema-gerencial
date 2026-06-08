using System.Security.Cryptography;
using System.Text;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SistemaGerencial.Application.Auth.DTOs;
using SistemaGerencial.Application.Common.Interfaces;
using SistemaGerencial.Domain.Entities;

namespace SistemaGerencial.Application.Auth.Commands.RefreshToken;

public class RefreshTokenCommandHandler
    : IRequestHandler<RefreshTokenCommand, RefreshTokenResponse>
{
    private readonly IApplicationDbContext _context;
    private readonly ITokenService _tokenService;
    private readonly JwtSettings _jwtSettings;

    public RefreshTokenCommandHandler(
        IApplicationDbContext context,
        ITokenService tokenService,
        JwtSettings jwtSettings)
    {
        _context = context;
        _tokenService = tokenService;
        _jwtSettings = jwtSettings;
    }

    public async Task<RefreshTokenResponse> Handle(
        RefreshTokenCommand request,
        CancellationToken cancellationToken)
    {
        // Hashear el token recibido para buscar en BD
        var tokenHash = HashToken(request.RefreshToken);

        // Buscar sesión activa
        var sesion = await _context.SesionesActivas
            .Include(s => s.Usuario)
                .ThenInclude(u => u.Empresa)
            .FirstOrDefaultAsync(
                s => s.RefreshTokenHash == tokenHash
                  && s.RevocadaEn == null,
                cancellationToken);

        if (sesion == null)
            throw new UnauthorizedAccessException(
                "Refresh token inválido o expirado.");

        if (sesion.ExpiraEn < DateTime.UtcNow)
        {
            // Revocar el token expirado
            sesion.RevocadaEn = DateTime.UtcNow;
            await _context.SaveChangesAsync(cancellationToken);
            throw new UnauthorizedAccessException(
                "Refresh token expirado. Inicia sesión nuevamente.");
        }

        if (sesion.Usuario.Estado != "activo")
            throw new UnauthorizedAccessException(
                "Tu cuenta está inactiva.");

        if (!sesion.Usuario.Empresa.EstaActiva)
            throw new UnauthorizedAccessException(
                "Tu suscripción no está activa.");

        // Revocar el token anterior (rotación de tokens)
        sesion.RevocadaEn = DateTime.UtcNow;

        // Generar nuevos tokens
        var nuevoAccessToken = _tokenService
            .GenerarAccessToken(sesion.Usuario);
        var nuevoRefreshToken = _tokenService.GenerarRefreshToken();

        // Guardar nueva sesión
        var nuevaSesion = new SesionActiva
        {
            UsuarioId = sesion.UsuarioId,
            EmpresaId = sesion.EmpresaId,
            RefreshTokenHash = HashToken(nuevoRefreshToken),
            IpOrigen = sesion.IpOrigen,
            UserAgent = sesion.UserAgent,
            ExpiraEn = DateTime.UtcNow.AddDays(
                _jwtSettings.RefreshExpiryDays)
        };

        await _context.SesionesActivas.AddAsync(
            nuevaSesion, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        return new RefreshTokenResponse
        {
            AccessToken = nuevoAccessToken,
            RefreshToken = nuevoRefreshToken,
            ExpiresAt = DateTime.UtcNow.AddMinutes(
                _jwtSettings.ExpiryMinutes)
        };
    }

    private static string HashToken(string token)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(token));
        return Convert.ToBase64String(bytes);
    }
}