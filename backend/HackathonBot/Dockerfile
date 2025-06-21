# Etapa base de runtime
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 3978

# Etapa de build
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src

# Copia o csproj e restaura dependências
COPY ["HackathonBot.csproj", "./"]
RUN dotnet restore "HackathonBot.csproj"

# Copia o restante da aplicação
COPY . .

# Build do projeto
RUN dotnet build "HackathonBot.csproj" -c Release -o /app/build

# Etapa de publish
FROM build AS publish
RUN dotnet publish "HackathonBot.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Imagem final
FROM base AS final
WORKDIR /app

# Criação de usuário sem privilégios
ENV HOME=/app
RUN useradd -m -d /app -s /bin/bash appuser && chown -R appuser:appuser /app

# Copia os arquivos publicados
COPY --from=publish /app/publish .

# Variáveis de ambiente
ENV ASPNETCORE_URLS=http://+:3978
ENV ASPNETCORE_ENVIRONMENT=Production
ENV RUNNING_IN_CONTAINER=true
ENV Logging__LogLevel__System.Net.Http.HttpClient=Warning

# Usa usuário não root
USER appuser

# Comando de inicialização
ENTRYPOINT ["dotnet", "HackathonBot.dll"]
