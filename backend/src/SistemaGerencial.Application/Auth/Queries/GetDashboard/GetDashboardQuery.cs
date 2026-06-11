using MediatR;
using SistemaGerencial.Application.Finanzas.Queries.GetDashboard;

namespace SistemaGerencial.Application.Auth.Queries.GetDashboard;

public record GetDashboardQuery : IRequest<DashboardDto>;