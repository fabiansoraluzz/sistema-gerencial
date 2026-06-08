using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SistemaGerencial.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddCodigoEmpresa : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Codigo",
                table: "Empresas",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Codigo",
                table: "Empresas");
        }
    }
}
