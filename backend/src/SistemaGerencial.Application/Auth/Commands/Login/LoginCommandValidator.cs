using FluentValidation;

namespace SistemaGerencial.Application.Auth.Commands.Login;

public class LoginCommandValidator : AbstractValidator<LoginCommand>
{
    public LoginCommandValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("El correo es obligatorio")
            .EmailAddress().WithMessage("El correo no tiene un formato válido")
            .MaximumLength(150).WithMessage("El correo no puede superar 150 caracteres");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("La contraseña es obligatoria")
            .MinimumLength(6).WithMessage("La contraseña debe tener al menos 6 caracteres")
            .MaximumLength(100).WithMessage("La contraseña no puede superar 100 caracteres");
    }
}