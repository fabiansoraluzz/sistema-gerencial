namespace SistemaGerencial.Application.Finanzas.Queries.GetMovimientosCaja;

public class MovimientoCajaDto
{
    public Guid Id { get; set; }
    public string Tipo { get; set; } = string.Empty;
    public decimal Monto { get; set; }
    public string Descripcion { get; set; } = string.Empty;
    public DateOnly FechaMovimiento { get; set; }
    public string MetodoPago { get; set; } = string.Empty;
    public string? NombreArea { get; set; }
    public string? NombreCategoria { get; set; }
    public string? NumeroDocumento { get; set; }
    public bool TieneIgv { get; set; }
    public decimal IgvMonto { get; set; }
    public DateTime CreadoEn { get; set; }
}

public class GetMovimientosResult
{
    public List<MovimientoCajaDto> Items { get; set; } = new();
    public int Total { get; set; }
    public decimal TotalIngresos { get; set; }
    public decimal TotalEgresos { get; set; }
    public decimal Saldo { get; set; }
}