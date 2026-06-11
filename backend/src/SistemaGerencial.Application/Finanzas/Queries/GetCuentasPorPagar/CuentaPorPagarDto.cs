namespace SistemaGerencial.Application.Finanzas.Queries.GetCuentasPorPagar;

public class CuentaPorPagarDto
{
    public Guid Id { get; set; }
    public string NombreContacto { get; set; } = string.Empty;
    public string TipoContacto { get; set; } = string.Empty;
    public string Concepto { get; set; } = string.Empty;
    public decimal MontoTotal { get; set; }
    public decimal MontoPagado { get; set; }
    public decimal MontoPendiente { get; set; }
    public DateOnly FechaEmision { get; set; }
    public DateOnly FechaVencimiento { get; set; }
    public string Estado { get; set; } = string.Empty;
    public string? NumeroDocumento { get; set; }
    public int DiasVencimiento { get; set; }
    public DateTime CreadoEn { get; set; }
}

public class GetCuentasPorPagarResult
{
    public List<CuentaPorPagarDto> Items { get; set; } = new();
    public int Total { get; set; }
    public decimal TotalPendiente { get; set; }
    public decimal TotalVencido { get; set; }
    public decimal TotalPagado { get; set; }
}