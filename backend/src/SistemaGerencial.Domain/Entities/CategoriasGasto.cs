namespace SistemaGerencial.Domain.Entities;

public class CategoriaGasto : BaseEntity
{
    public Guid EmpresaId { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Tipo { get; set; } = "ambos";
    public string ColorHex { get; set; } = "#666666";
    public bool EsSistema { get; set; } = false;

    public Empresa Empresa { get; set; } = null!;
}