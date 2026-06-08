namespace SistemaGerencial.Domain.Entities;

public class SesionActiva : BaseEntity
{
    public Guid UsuarioId { get; set; }
    public Guid EmpresaId { get; set; }
    public string RefreshTokenHash { get; set; } = string.Empty;
    public string? IpOrigen { get; set; }
    public string? UserAgent { get; set; }
    public DateTime ExpiraEn { get; set; }
    public DateTime? RevocadaEn { get; set; }

    // Navegación
    public Usuario Usuario { get; set; } = null!;
}