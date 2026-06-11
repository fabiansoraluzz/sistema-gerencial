using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SistemaGerencial.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddContactos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Contactos",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    EmpresaId = table.Column<Guid>(type: "uuid", nullable: false),
                    Nombre = table.Column<string>(type: "text", nullable: false),
                    TipoContacto = table.Column<string>(type: "text", nullable: false),
                    Documento = table.Column<string>(type: "text", nullable: true),
                    TipoDocumento = table.Column<string>(type: "text", nullable: true),
                    Telefono = table.Column<string>(type: "text", nullable: true),
                    Email = table.Column<string>(type: "text", nullable: true),
                    Direccion = table.Column<string>(type: "text", nullable: true),
                    EstaActivo = table.Column<bool>(type: "boolean", nullable: false),
                    CreadoPor = table.Column<Guid>(type: "uuid", nullable: true),
                    CreadoEn = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ActualizadoEn = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    EliminadoEn = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Contactos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Contactos_Empresas_EmpresaId",
                        column: x => x.EmpresaId,
                        principalTable: "Empresas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CuentasPorPagar_ContactoId",
                table: "CuentasPorPagar",
                column: "ContactoId");

            migrationBuilder.CreateIndex(
                name: "IX_CuentasPorCobrar_ContactoId",
                table: "CuentasPorCobrar",
                column: "ContactoId");

            migrationBuilder.CreateIndex(
                name: "IX_Contactos_EmpresaId",
                table: "Contactos",
                column: "EmpresaId");

            migrationBuilder.AddForeignKey(
                name: "FK_CuentasPorCobrar_Contactos_ContactoId",
                table: "CuentasPorCobrar",
                column: "ContactoId",
                principalTable: "Contactos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_CuentasPorPagar_Contactos_ContactoId",
                table: "CuentasPorPagar",
                column: "ContactoId",
                principalTable: "Contactos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CuentasPorCobrar_Contactos_ContactoId",
                table: "CuentasPorCobrar");

            migrationBuilder.DropForeignKey(
                name: "FK_CuentasPorPagar_Contactos_ContactoId",
                table: "CuentasPorPagar");

            migrationBuilder.DropTable(
                name: "Contactos");

            migrationBuilder.DropIndex(
                name: "IX_CuentasPorPagar_ContactoId",
                table: "CuentasPorPagar");

            migrationBuilder.DropIndex(
                name: "IX_CuentasPorCobrar_ContactoId",
                table: "CuentasPorCobrar");
        }
    }
}
