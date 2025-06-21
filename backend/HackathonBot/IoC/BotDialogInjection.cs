using ChatBot.Application.Services.Copilot;
using HackathonBot.Config;
using HackathonBot.Dialogs;
using HackathonBot.Storage;
using Microsoft.Bot.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Diagnostics.CodeAnalysis;

namespace HackathonBot.IoC;

[ExcludeFromCodeCoverage]
public static class BotDialogInjection
{
    public static void AddDialogInjections(this IServiceCollection serviceCollection)
    {
        serviceCollection.AddSingleton<MainDialog>();
        serviceCollection.AddSingleton<CopilotStudioDialog>();
    }

    public static void AddStateInjections(this IServiceCollection serviceCollection)
    {
        // Criar o storage personalizado com expiração de 10 minutos
        IStorage storage = new ExpiringMemoryStorage(TimeSpan.FromMinutes(10));

        // User state e Conversation State usando o mesmo storage com expiração
        serviceCollection.AddSingleton(new UserState(storage));
        serviceCollection.AddSingleton(new ConversationState(storage));
    }

    public static void AddServicesInjections(this IServiceCollection serviceCollection, IConfiguration configuration)
    {
        var apiSettings = configuration.GetSection("CopilotConfig").Get<CopilotConfig>();
        serviceCollection.AddSingleton<CopilotStudioService>(provider =>
            new CopilotStudioService(apiSettings.ApiKey));
    }
}
