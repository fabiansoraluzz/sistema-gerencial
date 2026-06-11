namespace SistemaGerencial.Domain.Entities;

public class MovimientoCaja : BaseEntity
{
    public Guid EmpresaId { get; set; }
    public Guid? CuentaBancariaId { get; set; }
    public Guid? CategoriaId { get; set; }
    public Guid? AreaId { get; set; }
    public string Tipo { get; set; } = string.Empty;
    public long MontoCentimos { get; set; }
    public string? Descripcion { get; set; }
    public DateOnly FechaMovimiento { get; set; }
    public string MetodoPago { get; set; } = "efectivo";
    public string? Referencia { get; set; }
    public bool EstaConciliado { get; set; } = false;
    public bool TieneIgv { get; set; } = false;
    public long IgvCentimos { get; set; } = 0;
    public string? NumeroDocumento { get; set; }
    public Guid? GastosRecurrentesId { get; set; }
    public Guid? CreadoPor { get; set; }

    // Navegación
    public Empresa Empresa { get; set; } = null!;
    public CuentaBancaria? CuentaBancaria { get; set; }
    public CategoriaGasto? Categoria { get; set; }
    public AreaEmpresa? Area { get; set; }
}