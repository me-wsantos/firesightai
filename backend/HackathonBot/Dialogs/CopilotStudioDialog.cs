using ChatBot.Application.Services.Copilot;
using Microsoft.Bot.Builder;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Schema;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace HackathonBot.Dialogs;

public class CopilotStudioDialog : ComponentDialog
{
    private readonly CopilotStudioService _copilotService;

    public CopilotStudioDialog(CopilotStudioService copilotService) : base(nameof(CopilotStudioDialog))
    {
        _copilotService = copilotService;

        var waterfallSteps = new WaterfallStep[]
        {
            InicioAsync,
            ConversarAsync
        };

        AddDialog(new WaterfallDialog(nameof(WaterfallDialog), waterfallSteps));
        AddDialog(new TextPrompt(nameof(TextPrompt)));

        InitialDialogId = nameof(WaterfallDialog);
    }

    private async Task<DialogTurnResult> InicioAsync(WaterfallStepContext stepContext, CancellationToken cancellationToken)
    {
        if (stepContext.Options is Dictionary<string, bool> options &&
            options.TryGetValue("conversando", out var ativo) && ativo == true)
        {
            return EndOfTurn;
        }

        return await stepContext.PromptAsync(nameof(TextPrompt),
            new PromptOptions
            {
                Prompt = MessageFactory.Text("" +
            "Hi there! I’m your Wildfire Assistant.\r\n\r\nI’m here to help you better understand wildfires — from satellite data and fire detection to trends, terminology, and prevention tips.\r\n\r\nYou can ask me things like:\r\n• “Tell me about the fire activity in Brazil.”\r\n• “What satellite detects wildfires?”\r\n• “What's the wildfire risk in my area? I can estimate it — for any city in Brazil”\r\n\r\nJust type your question and I’ll do my best to assist you.\r\n\r\n What would you like to know today?")
            },
            cancellationToken);
    }

    private async Task<DialogTurnResult> ConversarAsync(WaterfallStepContext stepContext, CancellationToken cancellationToken)
    {
        var userQuestion = (string)stepContext.Result;

        await stepContext.Context.SendActivityAsync(new Activity { Type = ActivityTypes.Typing }, cancellationToken);

        try
        {
            var copilotResponse = await _copilotService.SendMessageAsync(userQuestion, stepContext.Context.Activity.From.Id);

            await stepContext.Context.SendActivityAsync(MessageFactory.Text(copilotResponse), cancellationToken);
        }
        catch (Exception ex)
        {
            await stepContext.Context.SendActivityAsync(
                MessageFactory.Text($"Oops! Something went wrong with Copilot: {ex.Message}"),
                cancellationToken);
        }
        var dialogOptions = new Dictionary<string, bool>
            {
                { "conversando", true }
            };

        return await stepContext.ReplaceDialogAsync(nameof(CopilotStudioDialog), dialogOptions, cancellationToken);
    }
}