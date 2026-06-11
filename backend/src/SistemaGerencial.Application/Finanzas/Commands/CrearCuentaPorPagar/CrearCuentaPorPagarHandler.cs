using MediatR;
using Microsoft.EntityFrameworkCore;
using SistemaGerencial.Application.Common.Interfaces;
using SistemaGerencial.Domain.Entities;

namespace SistemaGerencial.Application.Finanzas.Commands.CrearCuentaPorPagar;

public class CrearCuentaPorPagarHandler
    : IRequestHandler<CrearCuentaPorPagarCommand, Guid>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public CrearCuentaPorPagarHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<Guid> Handle(
        CrearCuentaPorPagarCommand request,
        CancellationToken cancellationToken)
    {
        var empresaId = _currentUser.EmpresaId!.Value;
        var usuarioId = _currentUser.UserId!.Value;

        var contacto = await _context.Contactos
            .FirstOrDefaultAsync(c =>
                c.EmpresaId == empresaId
                && c.Nombre == request.NombreContacto.Trim()
                && c.EliminadoEn == null,
                cancellationToken);

        if (contacto == null)
        {
            contacto = new Contacto
            {
                EmpresaId = empresaId,
                Nombre = request.NombreContacto.Trim(),
                TipoContacto = request.TipoContacto,
                CreadoPor = usuarioId,
            };
            await _context.Contactos.AddAsync(contacto, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }

        var cxp = new CuentaPorPagar
        {
            EmpresaId = empresaId,
            ContactoId = contacto.Id,
            Concepto = request.Concepto,
            MontoTotalCentimos = (long)(request.MontoTotal * 100),
            MontoPagadoCentimos = 0,
            FechaEmision = request.FechaEmision,
            FechaVencimiento = request.FechaVencimiento,
            Estado = "pendiente",
            NumeroDocumento = request.NumeroDocumento,
            TieneIgv = request.TieneIgv,
            CreadoPor = usuarioId,
        };

        await _context.CuentasPorPagar.AddAsync(cxp, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        return cxp.Id;
    }
}