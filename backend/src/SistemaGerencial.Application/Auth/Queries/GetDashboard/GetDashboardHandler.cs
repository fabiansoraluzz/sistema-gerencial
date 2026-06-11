using MediatR;
using Microsoft.EntityFrameworkCore;
using SistemaGerencial.Application.Common.Interfaces;
using SistemaGerencial.Application.Finanzas.Queries.GetDashboard;

namespace SistemaGerencial.Application.Auth.Queries.GetDashboard;

public class GetDashboardHandler
    : IRequestHandler<GetDashboardQuery, DashboardDto>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public GetDashboardHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<DashboardDto> Handle(
        GetDashboardQuery request,
        CancellationToken cancellationToken)
    {
        var empresaId = _currentUser.EmpresaId!.Value;
        var ahora = DateTime.UtcNow;
        var inicioMes = new DateTime(ahora.Year, ahora.Month, 1, 0, 0, 0, DateTimeKind.Utc);
        var inicioMesAnterior = inicioMes.AddMonths(-1);
        var finMesAnterior = inicioMes.AddSeconds(-1);

        // ── Caja disponible ──────────────────────────────────────
        var movimientos = await _context.MovimientosCaja
            .Where(m => m.EmpresaId == empresaId && m.EliminadoEn == null)
            .ToListAsync(cancellationToken);

        var ingresosMes = movimientos
            .Where(m => m.Tipo == "ingreso" && m.FechaMovimiento >= DateOnly.FromDateTime(inicioMes))
            .Sum(m => m.MontoCentimos);

        var egresosMes = movimientos
            .Where(m => m.Tipo == "egreso" && m.FechaMovimiento >= DateOnly.FromDateTime(inicioMes))
            .Sum(m => m.MontoCentimos);

        var ingresosMesAnterior = movimientos
            .Where(m => m.Tipo == "ingreso"
                && m.FechaMovimiento >= DateOnly.FromDateTime(inicioMesAnterior)
                && m.FechaMovimiento <= DateOnly.FromDateTime(finMesAnterior))
            .Sum(m => m.MontoCentimos);

        var egresosMesAnterior = movimientos
            .Where(m => m.Tipo == "egreso"
                && m.FechaMovimiento >= DateOnly.FromDateTime(inicioMesAnterior)
                && m.FechaMovimiento <= DateOnly.FromDateTime(finMesAnterior))
            .Sum(m => m.MontoCentimos);

        var cajaTotal = movimientos
            .Where(m => m.Tipo == "ingreso").Sum(m => m.MontoCentimos)
            - movimientos.Where(m => m.Tipo == "egreso").Sum(m => m.MontoCentimos);

        var cajaMesAnterior = movimientos
            .Where(m => m.FechaMovimiento <= DateOnly.FromDateTime(finMesAnterior))
            .Sum(m => m.Tipo == "ingreso" ? m.MontoCentimos : -m.MontoCentimos);

        // ── CxC ───────────────────────────────────────────────────
        var cxcPendientes = await _context.CuentasPorCobrar
            .Where(c => c.EmpresaId == empresaId
                && c.EliminadoEn == null
                && (c.Estado == "pendiente" || c.Estado == "parcial" || c.Estado == "vencido"))
            .SumAsync(c => c.MontoTotalCentimos - c.MontoCobradoCentimos, cancellationToken);

        var cxcMesAnterior = await _context.CuentasPorCobrar
            .Where(c => c.EmpresaId == empresaId
                && c.EliminadoEn == null
                && c.CreadoEn <= finMesAnterior
                && (c.Estado == "pendiente" || c.Estado == "parcial" || c.Estado == "vencido"))
            .SumAsync(c => c.MontoTotalCentimos - c.MontoCobradoCentimos, cancellationToken);

        // ── CxP ───────────────────────────────────────────────────
        var cxpPendientes = await _context.CuentasPorPagar
            .Where(c => c.EmpresaId == empresaId
                && c.EliminadoEn == null
                && (c.Estado == "pendiente" || c.Estado == "parcial" || c.Estado == "vencido"))
            .SumAsync(c => c.MontoTotalCentimos - c.MontoPagadoCentimos, cancellationToken);

        var cxpMesAnterior = await _context.CuentasPorPagar
            .Where(c => c.EmpresaId == empresaId
                && c.EliminadoEn == null
                && c.CreadoEn <= finMesAnterior
                && (c.Estado == "pendiente" || c.Estado == "parcial" || c.Estado == "vencido"))
            .SumAsync(c => c.MontoTotalCentimos - c.MontoPagadoCentimos, cancellationToken);

        // ── Movimientos mensuales (últimos 6 meses) ───────────────
        var hace6Meses = inicioMes.AddMonths(-6);
        var nombres = new[] { "Ene","Feb","Mar","Abr","May","Jun",
                               "Jul","Ago","Sep","Oct","Nov","Dic" };

        var mensuales = new List<MovimientoMensualDto>();
        for (int i = 5; i >= 0; i--)
        {
            var inicio = inicioMes.AddMonths(-i);
            var fin = inicio.AddMonths(1).AddSeconds(-1);
            var ing = movimientos
                .Where(m => m.Tipo == "ingreso"
                    && m.FechaMovimiento >= DateOnly.FromDateTime(inicio)
                    && m.FechaMovimiento <= DateOnly.FromDateTime(fin))
                .Sum(m => m.MontoCentimos);
            var egr = movimientos
                .Where(m => m.Tipo == "egreso"
                    && m.FechaMovimiento >= DateOnly.FromDateTime(inicio)
                    && m.FechaMovimiento <= DateOnly.FromDateTime(fin))
                .Sum(m => m.MontoCentimos);
            mensuales.Add(new MovimientoMensualDto
            {
                Mes = nombres[inicio.Month - 1],
                TotalIngresos = ing / 100m,
                TotalEgresos = egr / 100m,
            });
        }

        // ── Alertas ───────────────────────────────────────────────
        var alertas = new List<AlertaDashboardDto>();
        var en3Dias = DateOnly.FromDateTime(ahora.AddDays(3));
        var hoy = DateOnly.FromDateTime(ahora);

        var cxcVencidas = await _context.CuentasPorCobrar
            .Where(c => c.EmpresaId == empresaId
                && c.EliminadoEn == null
                && c.Estado != "cobrado" && c.Estado != "anulado"
                && c.FechaVencimiento <= en3Dias)
            .OrderBy(c => c.FechaVencimiento)
            .Take(3)
            .ToListAsync(cancellationToken);

        foreach (var cxc in cxcVencidas)
        {
            var dias = cxc.FechaVencimiento.DayNumber - hoy.DayNumber;
            var cuando = dias < 0 ? "vencida"
                : dias == 0 ? "vence hoy"
                : $"vence en {dias} día{(dias == 1 ? "" : "s")}";
            alertas.Add(new AlertaDashboardDto
            {
                Tipo = dias < 0 ? "danger" : "warning",
                Mensaje = $"Cuenta por cobrar de S/. {(cxc.MontoTotalCentimos - cxc.MontoCobradoCentimos) / 100m:N2} — {cuando}",
                Modulo = "cxc"
            });
        }

        var cxpVencidas = await _context.CuentasPorPagar
            .Where(c => c.EmpresaId == empresaId
                && c.EliminadoEn == null
                && c.Estado != "pagado" && c.Estado != "anulado"
                && c.FechaVencimiento <= en3Dias)
            .OrderBy(c => c.FechaVencimiento)
            .Take(3)
            .ToListAsync(cancellationToken);

        foreach (var cxp in cxpVencidas)
        {
            var dias = cxp.FechaVencimiento.DayNumber - hoy.DayNumber;
            var cuando = dias < 0 ? "vencida"
                : dias == 0 ? "vence hoy"
                : $"vence en {dias} día{(dias == 1 ? "" : "s")}";
            alertas.Add(new AlertaDashboardDto
            {
                Tipo = dias < 0 ? "danger" : "warning",
                Mensaje = $"Cuenta por pagar de S/. {(cxp.MontoTotalCentimos - cxp.MontoPagadoCentimos) / 100m:N2} — {cuando}",
                Modulo = "cxp"
            });
        }

        // ── Variaciones ───────────────────────────────────────────
        static decimal Variacion(decimal actual, decimal anterior) =>
            anterior == 0 ? 0 : Math.Round((actual - anterior) / anterior * 100, 1);

        return new DashboardDto
        {
            CajaDisponible = cajaTotal / 100m,
            TotalPorCobrar = cxcPendientes / 100m,
            TotalPorPagar = cxpPendientes / 100m,
            UtilidadDelMes = (ingresosMes - egresosMes) / 100m,
            CajaVariacionPorcentaje = Variacion(cajaTotal, cajaMesAnterior),
            CobrarVariacionPorcentaje = Variacion(cxcPendientes, cxcMesAnterior),
            PagarVariacionPorcentaje = Variacion(cxpPendientes, cxpMesAnterior),
            UtilidadVariacionPorcentaje = Variacion(
                ingresosMes - egresosMes,
                ingresosMesAnterior - egresosMesAnterior),
            MovimientosMensuales = mensuales,
            Alertas = alertas,
        };
    }
}