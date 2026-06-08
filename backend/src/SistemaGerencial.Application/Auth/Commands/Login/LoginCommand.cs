using MediatR;
using SistemaGerencial.Application.Auth.DTOs;

namespace SistemaGerencial.Application.Auth.Commands.Login;

public record LoginCommand(string Email, string Password)
    : IRequest<LoginResponse>;