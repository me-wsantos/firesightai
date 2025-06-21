using Microsoft.Bot.Builder;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Threading;
using System;

namespace HackathonBot.Storage;

/// <summary>
/// Storage que adiciona expiração aos itens armazenados no MemoryStorage
/// </summary>
public class ExpiringMemoryStorage : IStorage
{
    private readonly MemoryStorage _innerStorage;
    private readonly ConcurrentDictionary<string, DateTime> _expirationTimes;
    private readonly TimeSpan _expirationTime;
    private readonly Timer _expirationTimer;
    private readonly TimeSpan _cleanupInterval = TimeSpan.FromMinutes(1);

    /// <summary>
    /// Inicializa uma nova instância de ExpiringMemoryStorage
    /// </summary>
    /// <param name="expirationTime">Tempo de expiração para cada item no cache (padrão: 10 minutos)</param>
    public ExpiringMemoryStorage(TimeSpan? expirationTime = null)
    {
        _innerStorage = new MemoryStorage();
        _expirationTimes = new ConcurrentDictionary<string, DateTime>();
        _expirationTime = expirationTime ?? TimeSpan.FromMinutes(10);

        // Inicia um timer para limpar itens expirados periodicamente
        _expirationTimer = new Timer(CleanupExpiredItems, null, _cleanupInterval, _cleanupInterval);
    }

    /// <summary>
    /// Lê itens do storage
    /// </summary>
    /// <param name="keys">Chaves a serem lidas</param>
    /// <param name="cancellationToken">Token de cancelamento</param>
    /// <returns>Um dicionário com os itens encontrados</returns>
    public async Task<IDictionary<string, object>> ReadAsync(string[] keys,
        CancellationToken cancellationToken = default)
    {
        if (keys == null)
            return new Dictionary<string, object>();

        // Filtra as chaves para incluir apenas itens não expirados
        var validKeys = new List<string>();
        foreach (var key in keys)
        {
            if (!string.IsNullOrEmpty(key) &&
                (!_expirationTimes.TryGetValue(key, out var expiration) || expiration > DateTime.UtcNow))
            {
                validKeys.Add(key);

                // Atualiza o tempo de expiração
                _expirationTimes[key] = DateTime.UtcNow.Add(_expirationTime);
            }
        }

        // Se todas as chaves estiverem expiradas, retorne um dicionário vazio
        if (validKeys.Count == 0)
            return new Dictionary<string, object>();

        // Usa o MemoryStorage interno para obter os dados
        return await _innerStorage.ReadAsync(validKeys.ToArray(), cancellationToken).ConfigureAwait(false);
    }

    /// <summary>
    /// Grava itens no storage
    /// </summary>
    /// <param name="changes">Dicionário de itens a serem gravados</param>
    /// <param name="cancellationToken">Token de cancelamento</param>
    /// <returns>Task representando a operação assíncrona</returns>
    public Task WriteAsync(IDictionary<string, object> changes, CancellationToken cancellationToken = default)
    {
        if (changes == null)
            return Task.CompletedTask;

        // Atualiza os tempos de expiração para cada chave
        foreach (var key in changes.Keys)
        {
            if (!string.IsNullOrEmpty(key))
            {
                _expirationTimes[key] = DateTime.UtcNow.Add(_expirationTime);
            }
        }

        // Usa o MemoryStorage interno para escrever os dados
        return _innerStorage.WriteAsync(changes, cancellationToken);
    }

    /// <summary>
    /// Remove itens do storage
    /// </summary>
    /// <param name="keys">Chaves a serem removidas</param>
    /// <param name="cancellationToken">Token de cancelamento</param>
    /// <returns>Task representando a operação assíncrona</returns>
    public Task DeleteAsync(string[] keys, CancellationToken cancellationToken = default)
    {
        if (keys == null)
            return Task.CompletedTask;

        // Remove os tempos de expiração
        foreach (var key in keys)
        {
            if (!string.IsNullOrEmpty(key))
            {
                _expirationTimes.TryRemove(key, out _);
            }
        }

        // Usa o MemoryStorage interno para remover os dados
        return _innerStorage.DeleteAsync(keys, cancellationToken);
    }

    /// <summary>
    /// Limpa itens expirados do cache periodicamente
    /// </summary>
    private void CleanupExpiredItems(object state)
    {
        try
        {
            var keysToRemove = new List<string>();
            var now = DateTime.UtcNow;

            // Identifica chaves expiradas
            foreach (var pair in _expirationTimes)
            {
                if (pair.Value <= now)
                {
                    keysToRemove.Add(pair.Key);
                }
            }

            // Remove as chaves expiradas
            if (keysToRemove.Count > 0)
            {
                _innerStorage.DeleteAsync(keysToRemove.ToArray(), CancellationToken.None).ConfigureAwait(false);

                foreach (var key in keysToRemove)
                {
                    _expirationTimes.TryRemove(key, out _);
                }
            }
        }
        catch
        {
            // Ignora exceções no timer para evitar falhas
        }
    }

    /// <summary>
    /// Finaliza o timer quando o objeto é descartado
    /// </summary>
    public void Dispose()
    {
        _expirationTimer?.Dispose();
    }
}
