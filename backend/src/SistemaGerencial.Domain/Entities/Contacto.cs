namespace SistemaGerencial.Domain.Entities;

public class Contacto : BaseEntity
{
    public Guid EmpresaId { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string TipoContacto { get; set; } = "paciente";
    public string? Documento { get; set; }
    public string? TipoDocumento { get; set; } = "dni";
    public string? Telefono { get; set; }
    public string? Email { get; set; }
    public string? Direccion { get; set; }
    public bool EstaActivo { get; set; } = true;
    public Guid? CreadoPor { get; set; }

    public Empresa Empresa { get; set; } = null!;
    public ICollection<CuentaPorCobrar> CuentasPorCobrar { get; set; } = new List<CuentaPorCobrar>();
    public ICollection<CuentaPorPagar> CuentasPorPagar { get; set; } = new List<CuentaPorPagar>();
}