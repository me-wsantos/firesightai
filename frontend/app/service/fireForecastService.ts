
interface IProps {
  startDate: string;
  startHour: number;
  lat: number;
  long: number;
}

export const fireForecastService = async (params: IProps) => {
  try {
    const resp = await fetch(`/api/fireForecast`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    })

    const data = await resp.json();

    return { data };

  } catch (error) {
    return { ok: false, error }
  }
}