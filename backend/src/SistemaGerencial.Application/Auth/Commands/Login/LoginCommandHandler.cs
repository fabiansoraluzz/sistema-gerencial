using MediatR;
using Microsoft.EntityFrameworkCore;
using SistemaGerencial.Application.Auth.DTOs;
using SistemaGerencial.Application.Common.Interfaces;
using SistemaGerencial.Domain.Entities;

namespace SistemaGerencial.Application.Auth.Commands.Login;

public class LoginCommandHandler : IRequestHandler<LoginCommand, LoginResponse>
{
    private readonly IApplicationDbContext _context;
    private readonly ITokenService _tokenService;
    private readonly JwtSettings _jwtSettings;

    public LoginCommandHandler(
        IApplicationDbContext context,
        ITokenService tokenService,
        JwtSettings jwtSettings)
    {
        _context = context;
        _tokenService = tokenService;
        _jwtSettings = jwtSettings;
    }

    public async Task<LoginResponse> Handle(
        LoginCommand request,
        CancellationToken cancellationToken)
    {
        // Buscar usuario por email
        var usuario = await _context.Usuarios
            .Include(u => u.Empresa)
            .FirstOrDefaultAsync(
                u => u.Email == request.Email.ToLower().Trim()
                  && u.EliminadoEn == null,
                cancellationToken);

        // Validar existencia
        if (usuario == null)
            throw new UnauthorizedAccessException(
                "Credenciales incorrectas.");

        // Validar estado
        if (usuario.Estado != "activo")
            throw new UnauthorizedAccessException(
                "Tu cuenta está inactiva. Contacta al administrador.");

        // Validar bloqueo
        if (usuario.BloqueadoHasta.HasValue
            && usuario.BloqueadoHasta > DateTime.UtcNow)
            throw new UnauthorizedAccessException(
                "Cuenta bloqueada temporalmente. Intenta más tarde.");

        // Validar empresa activa
        if (!usuario.Empresa.EstaActiva)
            throw new UnauthorizedAccessException(
                "Tu suscripción no está activa. Contacta al soporte.");

        // Verificar password
        if (!BCrypt.Net.BCrypt.Verify(request.Password, usuario.PasswordHash))
        {
            usuario.IntentosFallidos++;
            if (usuario.IntentosFallidos >= 5)
                usuario.BloqueadoHasta = DateTime.UtcNow.AddMinutes(30);

            await _context.SaveChangesAsync(cancellationToken);
            throw new UnauthorizedAccessException("Credenciales incorrectas.");
        }

        // Login exitoso — resetear intentos
        usuario.IntentosFallidos = 0;
        usuario.BloqueadoHasta = null;
        usuario.UltimoAccesoEn = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);

        // Generar tokens
        var accessToken = _tokenService.GenerarAccessToken(usuario);
        var refreshToken = _tokenService.GenerarRefreshToken();

        // Guardar sesión activa
        var sesion = new SesionActiva
        {
            UsuarioId = usuario.Id,
            EmpresaId = usuario.EmpresaId,
            RefreshTokenHash = HashToken(refreshToken),
            ExpiraEn = DateTime.UtcNow.AddDays(_jwtSettings.RefreshExpiryDays)
        };
        await _context.SesionesActivas.AddAsync(sesion, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        return new LoginResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiryMinutes),
            Usuario = new UsuarioDto
            {
                Id = usuario.Id,
                NombreCompleto = usuario.NombreCompleto,
                Email = usuario.Email,
                EmpresaId = usuario.EmpresaId,
                NombreEmpresa = usuario.Empresa.Nombre
            }
        };

    }

    private static string HashToken(string token)
    {
        var bytes = System.Security.Cryptography.SHA256
            .HashData(System.Text.Encoding.UTF8.GetBytes(token));
        return Convert.ToBase64String(bytes);
    }
}