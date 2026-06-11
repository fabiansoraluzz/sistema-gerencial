using FluentValidation;

namespace SistemaGerencial.Application.Finanzas.Commands.CrearMovimientoCaja;

public class CrearMovimientoCajaValidator
    : AbstractValidator<CrearMovimientoCajaCommand>
{
    public CrearMovimientoCajaValidator()
    {
        RuleFor(x => x.Tipo)
            .NotEmpty().WithMessage("El tipo es obligatorio")
            .Must(t => t == "ingreso" || t == "egreso")
            .WithMessage("El tipo debe ser ingreso o egreso");

        RuleFor(x => x.Monto)
            .GreaterThan(0).WithMessage("El monto debe ser mayor a 0")
            .LessThanOrEqualTo(9_999_999.99m)
            .WithMessage("El monto no puede superar S/. 9,999,999.99")
            .PrecisionScale(11, 2, false)
            .WithMessage("El monto solo acepta 2 decimales");

        RuleFor(x => x.Descripcion)
            .NotEmpty().WithMessage("La descripción es obligatoria")
            .MaximumLength(300).WithMessage("Máximo 300 caracteres");

        RuleFor(x => x.MetodoPago)
            .NotEmpty().WithMessage("El método de pago es obligatorio")
            .Must(m => new[]
            {
                "efectivo","yape","plin","transferencia",
                "tarjeta_debito","tarjeta_credito","cheque"
            }.Contains(m))
            .WithMessage("Método de pago no válido");

        RuleFor(x => x.NumeroDocumento)
            .MaximumLength(20).WithMessage("Máximo 20 caracteres")
            .When(x => x.NumeroDocumento != null);

        RuleFor(x => x.Referencia)
            .MaximumLength(100).WithMessage("Máximo 100 caracteres")
            .When(x => x.Referencia != null);
    }
}