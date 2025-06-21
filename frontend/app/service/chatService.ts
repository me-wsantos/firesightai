/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { extractJsonMarkdown } from '../utils/extractJsonMarkdown';

export const chatService = async (llmContext: string[], dataAnalysis: any[] = []) => {
  try {
    const result = await axios.post(`/api/agents/supervisor`, { llmContext })

    const { data } = result
    
    const dataString = extractJsonMarkdown(data.data)
    const objResponse = JSON.parse(dataString);


    if (objResponse.myscope === "false") {
      return { ok: true, data: objResponse.optimizedQuestion }
    }

    if (objResponse.chosenAgent === "Data Analyst Agent") { // Agent de Análise de Dados

      if (!dataAnalysis || dataAnalysis.length == 0) {
        return { ok: true, data: "Preciso dos dados para análise para responder sua pergunta! Por favor, selecione o perído que deseja analisar." };
      }
      const response = await dataAnalysisRun(llmContext, dataAnalysis);
      return { ok: true, data: response.data }
    }

    if (objResponse.chosenAgent === "Auditor Agent") { // Agent de Auditoria
      const response = await auditorRun(llmContext);
      return { ok: true, data: response.data }
    }

    if (objResponse.chosenAgent === "Chart Agent") { // Agent de Gráficos
      const response = await chartRun(llmContext, dataAnalysis);

      const dataString = extractJsonMarkdown(response.data)
      const objResponse = JSON.parse(dataString);

      if (!objResponse || !objResponse.type) {
        return { ok: true, data: "Não consegui gerar o gráfico com os dados fornecidos." };
      }

      // Ordena os valores para mostrar nos gráficos barra e linha
      if (objResponse.type != "pie") {
        // Extrai somente os nomes e valores

        const orderData = objResponse.category.map((item: any, index: number) => {
          return { name: item, value: objResponse.series[index] }
        })

        // Adiciona os dados a propriedade order do objeto objResponse
        objResponse.order = orderData;

        //ordena os dados por valor
        objResponse.order.sort((a: any, b: any) => b.value - a.value);

        // Cria o objeto dataGraph com os dados formatados
        const dataGraph = {
          type: objResponse.type,
          category: objResponse.order.map((item: any) => item.name),
          series: objResponse.order.map((item: any) => item.value),
          message: objResponse.message,
          title: objResponse.title,
        }

        return { ok: true, data: JSON.stringify(dataGraph), charType: objResponse.type, title: objResponse.title }
      }

      return { ok: true, data: JSON.stringify(objResponse), charType: objResponse.type, title: objResponse.title }
    }

    return data

  } catch (error) {
    console.error("Error in chatService:", error)
    return { ok: false, error }
  }
}

const dataAnalysisRun = async (llmContext: string[], dataAnalysis: any[]) => {
  try {
    const result = await axios.post(`/api/agents/dataAnalyst`, { llmContext, dataAnalysis })
    const { data } = result
    return data

  } catch (error) {
    return { ok: false, error }
  }
}

const auditorRun = async (llmContext: string[]) => {
  try {
    const result = await axios.post(`/api/agents/auditor`, { llmContext })
    const { data } = result
    return data

  } catch (error) {
    return { ok: false, error }
  }
}
const chartRun = async (llmContext: string[], dataAnalysis: any[]) => {
  try {
    const result = await axios.post(`/api/agents/chart`, { llmContext, dataAnalysis })
    const { data } = result
    return data

  } catch (error) {
    return { ok: false, error }
  }
}
