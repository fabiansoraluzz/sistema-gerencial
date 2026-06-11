using FluentValidation;

namespace SistemaGerencial.Application.Finanzas.Commands.CrearCuentaPorCobrar;

public class CrearCuentaPorCobrarValidator
    : AbstractValidator<CrearCuentaPorCobrarCommand>
{
    public CrearCuentaPorCobrarValidator()
    {
        RuleFor(x => x.NombreContacto)
            .NotEmpty().WithMessage("El nombre del contacto es obligatorio")
            .MaximumLength(50).WithMessage("Máximo 50 caracteres");

        RuleFor(x => x.TipoContacto)
            .NotEmpty().WithMessage("El tipo de contacto es obligatorio")
            .Must(t => new[]
            {
                "paciente","aseguradora","empresa","otro"
            }.Contains(t))
            .WithMessage("Tipo de contacto no válido");

        RuleFor(x => x.Concepto)
            .NotEmpty().WithMessage("El concepto es obligatorio")
            .MaximumLength(300).WithMessage("Máximo 300 caracteres");

        RuleFor(x => x.MontoTotal)
            .GreaterThan(0).WithMessage("El monto debe ser mayor a 0")
            .LessThanOrEqualTo(9_999_999.99m)
            .WithMessage("El monto no puede superar S/. 9,999,999.99")
            .PrecisionScale(11, 2, false)
            .WithMessage("El monto solo acepta 2 decimales");

        RuleFor(x => x.FechaVencimiento)
            .GreaterThanOrEqualTo(x => x.FechaEmision)
            .WithMessage("La fecha de vencimiento debe ser igual o posterior a la emisión");

        RuleFor(x => x.NumeroDocumento)
            .MaximumLength(20).WithMessage("Máximo 20 caracteres")
            .When(x => x.NumeroDocumento != null);
    }
}