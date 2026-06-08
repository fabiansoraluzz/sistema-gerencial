using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using SistemaGerencial.Application.Auth.Commands.Login;

namespace SistemaGerencial.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(
        this IServiceCollection services)
    {
        services.AddMediatR(cfg =>
            cfg.RegisterServicesFromAssembly(
                typeof(DependencyInjection).Assembly));

        services.AddValidatorsFromAssembly(
            typeof(DependencyInjection).Assembly);

        return services;
    }
}