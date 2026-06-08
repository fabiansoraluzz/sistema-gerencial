using MediatR;
using SistemaGerencial.Application.Auth.DTOs;

namespace SistemaGerencial.Application.Auth.Commands.RefreshToken;

public record RefreshTokenCommand(string RefreshToken)
    : IRequest<RefreshTokenResponse>;