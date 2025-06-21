// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
using Microsoft.Bot.Builder;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Schema;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Threading;

namespace HackathonBot.Bots;

public class DialogBot<T> : ActivityHandler
    where T : Dialog
{
    protected readonly Dialog Dialog;
    protected readonly BotState UserState;
    protected readonly ILogger Logger;
    private readonly IStatePropertyAccessor<DialogState> _dialogStateAccessor;
    protected readonly ConversationState _conversationState;

    public DialogBot(ConversationState conversationState, UserState userState, T dialog, ILogger<DialogBot<T>> logger)
    {
        _conversationState = conversationState;
        UserState = userState;
        Dialog = dialog;
        Logger = logger;

        _dialogStateAccessor = _conversationState.CreateProperty<DialogState>("DialogState");
    }

    public override async Task OnTurnAsync(ITurnContext turnContext, CancellationToken cancellationToken = default(CancellationToken))
    {
        await base.OnTurnAsync(turnContext, cancellationToken);

        await _conversationState.SaveChangesAsync(turnContext, false, cancellationToken);
        await UserState.SaveChangesAsync(turnContext, false, cancellationToken);
    }

    protected override async Task OnMessageActivityAsync(ITurnContext<IMessageActivity> turnContext, CancellationToken cancellationToken)
    {
        Logger.LogInformation("Running dialog with Message Activity.");

        var text = turnContext.Activity.Text?.Trim().ToLowerInvariant();
        await Dialog.RunAsync(turnContext, _conversationState.CreateProperty<DialogState>("DialogState"), cancellationToken);
    }
}
