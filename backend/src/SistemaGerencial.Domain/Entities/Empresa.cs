namespace SistemaGerencial.Domain.Entities;

public class Empresa : BaseEntity
{
    public string? Codigo { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string? Ruc { get; set; }
    public string? Rubro { get; set; }
    public string? LogoUrl { get; set; }
    public string ZonaHoraria { get; set; } = "America/Lima";
    public string Moneda { get; set; } = "PEN";
    public bool EstaActiva { get; set; } = true;
    public string Configuracion { get; set; } = "{}";

    // Navegación
    public ICollection<Usuario> Usuarios { get; set; } = new List<Usuario>();
    public ICollection<Rol> Roles { get; set; } = new List<Rol>();
}