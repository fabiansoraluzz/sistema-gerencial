namespace SistemaGerencial.Application.Finanzas.Queries.GetDashboard;

public class DashboardDto
{
    public decimal CajaDisponible { get; set; }
    public decimal TotalPorCobrar { get; set; }
    public decimal TotalPorPagar { get; set; }
    public decimal UtilidadDelMes { get; set; }
    public decimal CajaVariacionPorcentaje { get; set; }
    public decimal CobrarVariacionPorcentaje { get; set; }
    public decimal PagarVariacionPorcentaje { get; set; }
    public decimal UtilidadVariacionPorcentaje { get; set; }
    public List<MovimientoMensualDto> MovimientosMensuales { get; set; } = new();
    public List<AlertaDashboardDto> Alertas { get; set; } = new();
}

public class MovimientoMensualDto
{
    public string Mes { get; set; } = string.Empty;
    public decimal TotalIngresos { get; set; }
    public decimal TotalEgresos { get; set; }
}

public class AlertaDashboardDto
{
    public string Tipo { get; set; } = string.Empty;
    public string Mensaje { get; set; } = string.Empty;
    public string Modulo { get; set; } = string.Empty;
}