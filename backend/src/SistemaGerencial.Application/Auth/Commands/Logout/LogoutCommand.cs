using MediatR;

namespace SistemaGerencial.Application.Auth.Commands.Logout;

public record LogoutCommand(string RefreshToken) : IRequest;