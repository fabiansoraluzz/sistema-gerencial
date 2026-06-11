namespace SistemaGerencial.Domain.Entities;

public class CuentaPorCobrar : BaseEntity
{
    public Guid EmpresaId { get; set; }
    public Guid ContactoId { get; set; }
    public Guid? AreaId { get; set; }
    public string Concepto { get; set; } = string.Empty;
    public long MontoTotalCentimos { get; set; }
    public long MontoCobradoCentimos { get; set; } = 0;
    public DateOnly FechaEmision { get; set; }
    public DateOnly FechaVencimiento { get; set; }
    public string Estado { get; set; } = "pendiente";
    public string? NumeroDocumento { get; set; }
    public bool TieneIgv { get; set; } = false;
    public Guid? CreadoPor { get; set; }

    public Empresa Empresa { get; set; } = null!;
    public Contacto Contacto { get; set; } = null!;
}