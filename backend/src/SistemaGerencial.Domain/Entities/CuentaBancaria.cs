namespace SistemaGerencial.Domain.Entities;

public class CuentaBancaria : BaseEntity
{
    public Guid EmpresaId { get; set; }
    public string NombreBanco { get; set; } = string.Empty;
    public string? NumeroCuenta { get; set; }
    public string TipoCuenta { get; set; } = "corriente";
    public string Moneda { get; set; } = "PEN";
    public long SaldoInicialCentimos { get; set; } = 0;
    public bool EstaActiva { get; set; } = true;

    public Empresa Empresa { get; set; } = null!;
}