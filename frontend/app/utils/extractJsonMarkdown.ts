export const extractJsonMarkdown = (data: string) => {

  const dataString = data.replace(/^```json\s*/, '') // Remove ```json do início
    .replace(/\s*```$/, '') // Remove ``` do final
    .trim();// Remove espaços extras

    return dataString;
}