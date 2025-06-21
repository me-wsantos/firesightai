using Microsoft.Bot.Connector.DirectLine;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace ChatBot.Application.Services.Copilot;

public class CopilotStudioService
{
    private readonly string _directLineSecret;
    private readonly DirectLineClient _directLineClient;
    private Conversation _conversation;
    private string _lastUserId;

    public CopilotStudioService(string directLineSecret)
    {
        _directLineSecret = directLineSecret;
        _directLineClient = new DirectLineClient(_directLineSecret);
    }

    public async Task InitializeConversationAsync(string userId)
    {
        if (_conversation == null || _lastUserId != userId)
        {
            _conversation = await _directLineClient.Conversations.StartConversationAsync();
            _lastUserId = userId;
        }
    }

    public async Task<string> SendMessageAsync(string message, string userId = "user")
    {
        await InitializeConversationAsync(userId);

        var messageTimestamp = DateTime.UtcNow;

        var activity = new Activity
        {
            Type = ActivityTypes.Message,
            From = new ChannelAccount { Id = userId },
            Text = message
        };

        await _directLineClient.Conversations.PostActivityAsync(_conversation.ConversationId, activity);

        // Polling
        var timeout = TimeSpan.FromMinutes(3);
        var stopwatch = System.Diagnostics.Stopwatch.StartNew();

        do
        {
            await Task.Delay(500);

            try
            {
                var activitySet = await _directLineClient.Conversations.GetActivitiesAsync(_conversation.ConversationId);

                var botResponse = activitySet.Activities
                    .Where(a => a.From.Id != userId &&
                               !string.IsNullOrEmpty(a.Text) &&
                               a.Type == Microsoft.Bot.Connector.DirectLine.ActivityTypes.Message &&
                               a.Timestamp > messageTimestamp)
                    .OrderByDescending(a => a.Timestamp)
                    .FirstOrDefault();

                if (botResponse != null)
                {
                    stopwatch.Stop();
                    return botResponse.Text;
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error while searching for activities: {ex.Message}");
            }

        } while (stopwatch.Elapsed < timeout);

        stopwatch.Stop();
        return "Sorry, I couldn't get an answer in the time box (3min).";
    }

    public void Dispose()
    {
        _directLineClient?.Dispose();
    }
}
