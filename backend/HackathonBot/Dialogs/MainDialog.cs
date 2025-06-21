using Microsoft.Bot.Builder;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Extensions.Logging;
using System.Threading;
using System.Threading.Tasks;

namespace HackathonBot.Dialogs;

public class MainDialog : ComponentDialog
{
    protected readonly ILogger _logger;

    public MainDialog(ILogger<MainDialog> logger,
                        CopilotStudioDialog copilotDialog,
                        ConversationState conversationState) : base(nameof(MainDialog))
    {
        _logger = logger;

        AddDialog(copilotDialog);
        AddDialog(new TextPrompt(nameof(TextPrompt)));
        AddDialog(new WaterfallDialog(nameof(WaterfallDialog), new WaterfallStep[]
        {
            MensagemInicialAsync
        }));

        InitialDialogId = nameof(WaterfallDialog);
    }

    private async Task<DialogTurnResult> MensagemInicialAsync(WaterfallStepContext stepContext, CancellationToken cancellationToken)
    {
        return await stepContext.BeginDialogAsync(nameof(CopilotStudioDialog), null, cancellationToken);
    }
}

