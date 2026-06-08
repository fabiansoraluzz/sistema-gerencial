namespace SistemaGerencial.Domain.Entities;

public class Usuario : BaseEntity
{
    public Guid EmpresaId { get; set; }
    public Guid RolId { get; set; }
    public string NombreCompleto { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Estado { get; set; } = "activo";
    public int IntentosFallidos { get; set; } = 0;
    public DateTime? BloqueadoHasta { get; set; }
    public DateTime? UltimoAccesoEn { get; set; }
    public bool RequiereCambioPassword { get; set; } = false;
    public bool EstaDeAcuerdoPolitica { get; set; } = false;
    public DateTime? FechaAcuerdoPolitica { get; set; }
    public string? TfaSecret { get; set; }
    public bool TfaHabilitado { get; set; } = false;

    // Navegación
    public Empresa Empresa { get; set; } = null!;
}