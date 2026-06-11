namespace SistemaGerencial.Domain.Entities;

public class AreaEmpresa : BaseEntity
{
    public Guid EmpresaId { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string? Descripcion { get; set; }
    public string ColorHex { get; set; } = "#1E4D8C";
    public bool EstaActiva { get; set; } = true;

    public Empresa Empresa { get; set; } = null!;
}