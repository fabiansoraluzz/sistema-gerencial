using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SistemaGerencial.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAreasYCuentas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AreasEmpresa",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    EmpresaId = table.Column<Guid>(type: "uuid", nullable: false),
                    Nombre = table.Column<string>(type: "text", nullable: false),
                    Descripcion = table.Column<string>(type: "text", nullable: true),
                    ColorHex = table.Column<string>(type: "text", nullable: false),
                    EstaActiva = table.Column<bool>(type: "boolean", nullable: false),
                    CreadoEn = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ActualizadoEn = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    EliminadoEn = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AreasEmpresa", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AreasEmpresa_Empresas_EmpresaId",
                        column: x => x.EmpresaId,
                        principalTable: "Empresas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CategoriasGasto",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    EmpresaId = table.Column<Guid>(type: "uuid", nullable: false),
                    Nombre = table.Column<string>(type: "text", nullable: false),
                    Tipo = table.Column<string>(type: "text", nullable: false),
                    ColorHex = table.Column<string>(type: "text", nullable: false),
                    EsSistema = table.Column<bool>(type: "boolean", nullable: false),
                    CreadoEn = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ActualizadoEn = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    EliminadoEn = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CategoriasGasto", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CategoriasGasto_Empresas_EmpresaId",
                        column: x => x.EmpresaId,
                        principalTable: "Empresas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CuentasBancarias",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    EmpresaId = table.Column<Guid>(type: "uuid", nullable: false),
                    NombreBanco = table.Column<string>(type: "text", nullable: false),
                    NumeroCuenta = table.Column<string>(type: "text", nullable: true),
                    TipoCuenta = table.Column<string>(type: "text", nullable: false),
                    Moneda = table.Column<string>(type: "text", nullable: false),
                    SaldoInicialCentimos = table.Column<long>(type: "bigint", nullable: false),
                    EstaActiva = table.Column<bool>(type: "boolean", nullable: false),
                    CreadoEn = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ActualizadoEn = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    EliminadoEn = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CuentasBancarias", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CuentasBancarias_Empresas_EmpresaId",
                        column: x => x.EmpresaId,
                        principalTable: "Empresas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MovimientosCaja_AreaId",
                table: "MovimientosCaja",
                column: "AreaId");

            migrationBuilder.CreateIndex(
                name: "IX_MovimientosCaja_CategoriaId",
                table: "MovimientosCaja",
                column: "CategoriaId");

            migrationBuilder.CreateIndex(
                name: "IX_MovimientosCaja_CuentaBancariaId",
                table: "MovimientosCaja",
                column: "CuentaBancariaId");

            migrationBuilder.CreateIndex(
                name: "IX_AreasEmpresa_EmpresaId",
                table: "AreasEmpresa",
                column: "EmpresaId");

            migrationBuilder.CreateIndex(
                name: "IX_CategoriasGasto_EmpresaId",
                table: "CategoriasGasto",
                column: "EmpresaId");

            migrationBuilder.CreateIndex(
                name: "IX_CuentasBancarias_EmpresaId",
                table: "CuentasBancarias",
                column: "EmpresaId");

            migrationBuilder.AddForeignKey(
                name: "FK_MovimientosCaja_AreasEmpresa_AreaId",
                table: "MovimientosCaja",
                column: "AreaId",
                principalTable: "AreasEmpresa",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_MovimientosCaja_CategoriasGasto_CategoriaId",
                table: "MovimientosCaja",
                column: "CategoriaId",
                principalTable: "CategoriasGasto",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_MovimientosCaja_CuentasBancarias_CuentaBancariaId",
                table: "MovimientosCaja",
                column: "CuentaBancariaId",
                principalTable: "CuentasBancarias",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MovimientosCaja_AreasEmpresa_AreaId",
                table: "MovimientosCaja");

            migrationBuilder.DropForeignKey(
                name: "FK_MovimientosCaja_CategoriasGasto_CategoriaId",
                table: "MovimientosCaja");

            migrationBuilder.DropForeignKey(
                name: "FK_MovimientosCaja_CuentasBancarias_CuentaBancariaId",
                table: "MovimientosCaja");

            migrationBuilder.DropTable(
                name: "AreasEmpresa");

            migrationBuilder.DropTable(
                name: "CategoriasGasto");

            migrationBuilder.DropTable(
                name: "CuentasBancarias");

            migrationBuilder.DropIndex(
                name: "IX_MovimientosCaja_AreaId",
                table: "MovimientosCaja");

            migrationBuilder.DropIndex(
                name: "IX_MovimientosCaja_CategoriaId",
                table: "MovimientosCaja");

            migrationBuilder.DropIndex(
                name: "IX_MovimientosCaja_CuentaBancariaId",
                table: "MovimientosCaja");
        }
    }
}
