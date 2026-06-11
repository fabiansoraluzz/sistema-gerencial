using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SistemaGerencial.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddFinanzasEntidades : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CuentasPorCobrar",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    EmpresaId = table.Column<Guid>(type: "uuid", nullable: false),
                    ContactoId = table.Column<Guid>(type: "uuid", nullable: false),
                    AreaId = table.Column<Guid>(type: "uuid", nullable: true),
                    Concepto = table.Column<string>(type: "text", nullable: false),
                    MontoTotalCentimos = table.Column<long>(type: "bigint", nullable: false),
                    MontoCobradoCentimos = table.Column<long>(type: "bigint", nullable: false),
                    FechaEmision = table.Column<DateOnly>(type: "date", nullable: false),
                    FechaVencimiento = table.Column<DateOnly>(type: "date", nullable: false),
                    Estado = table.Column<string>(type: "text", nullable: false),
                    NumeroDocumento = table.Column<string>(type: "text", nullable: true),
                    TieneIgv = table.Column<bool>(type: "boolean", nullable: false),
                    CreadoPor = table.Column<Guid>(type: "uuid", nullable: true),
                    CreadoEn = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ActualizadoEn = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    EliminadoEn = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CuentasPorCobrar", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CuentasPorCobrar_Empresas_EmpresaId",
                        column: x => x.EmpresaId,
                        principalTable: "Empresas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CuentasPorPagar",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    EmpresaId = table.Column<Guid>(type: "uuid", nullable: false),
                    ContactoId = table.Column<Guid>(type: "uuid", nullable: false),
                    AreaId = table.Column<Guid>(type: "uuid", nullable: true),
                    Concepto = table.Column<string>(type: "text", nullable: false),
                    MontoTotalCentimos = table.Column<long>(type: "bigint", nullable: false),
                    MontoPagadoCentimos = table.Column<long>(type: "bigint", nullable: false),
                    FechaEmision = table.Column<DateOnly>(type: "date", nullable: false),
                    FechaVencimiento = table.Column<DateOnly>(type: "date", nullable: false),
                    Estado = table.Column<string>(type: "text", nullable: false),
                    NumeroDocumento = table.Column<string>(type: "text", nullable: true),
                    TieneIgv = table.Column<bool>(type: "boolean", nullable: false),
                    CreadoPor = table.Column<Guid>(type: "uuid", nullable: true),
                    CreadoEn = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ActualizadoEn = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    EliminadoEn = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CuentasPorPagar", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CuentasPorPagar_Empresas_EmpresaId",
                        column: x => x.EmpresaId,
                        principalTable: "Empresas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MovimientosCaja",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    EmpresaId = table.Column<Guid>(type: "uuid", nullable: false),
                    CuentaBancariaId = table.Column<Guid>(type: "uuid", nullable: true),
                    CategoriaId = table.Column<Guid>(type: "uuid", nullable: true),
                    AreaId = table.Column<Guid>(type: "uuid", nullable: true),
                    Tipo = table.Column<string>(type: "text", nullable: false),
                    MontoCentimos = table.Column<long>(type: "bigint", nullable: false),
                    Descripcion = table.Column<string>(type: "text", nullable: true),
                    FechaMovimiento = table.Column<DateOnly>(type: "date", nullable: false),
                    MetodoPago = table.Column<string>(type: "text", nullable: false),
                    Referencia = table.Column<string>(type: "text", nullable: true),
                    EstaConciliado = table.Column<bool>(type: "boolean", nullable: false),
                    TieneIgv = table.Column<bool>(type: "boolean", nullable: false),
                    IgvCentimos = table.Column<long>(type: "bigint", nullable: false),
                    NumeroDocumento = table.Column<string>(type: "text", nullable: true),
                    GastosRecurrentesId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreadoPor = table.Column<Guid>(type: "uuid", nullable: true),
                    CreadoEn = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ActualizadoEn = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    EliminadoEn = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MovimientosCaja", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MovimientosCaja_Empresas_EmpresaId",
                        column: x => x.EmpresaId,
                        principalTable: "Empresas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CuentasPorCobrar_EmpresaId",
                table: "CuentasPorCobrar",
                column: "EmpresaId");

            migrationBuilder.CreateIndex(
                name: "IX_CuentasPorPagar_EmpresaId",
                table: "CuentasPorPagar",
                column: "EmpresaId");

            migrationBuilder.CreateIndex(
                name: "IX_MovimientosCaja_EmpresaId",
                table: "MovimientosCaja",
                column: "EmpresaId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CuentasPorCobrar");

            migrationBuilder.DropTable(
                name: "CuentasPorPagar");

            migrationBuilder.DropTable(
                name: "MovimientosCaja");
        }
    }
}
