namespace SistemaGerencial.Application.Auth.DTOs;

public class UsuarioDto
{
    public Guid Id { get; set; }
    public string NombreCompleto { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public Guid EmpresaId { get; set; }
    public string NombreEmpresa { get; set; } = string.Empty;
}