export interface IDataPrediction {
  latitude: number
  longitude: number
  temperature_2m: number
  relative_humidity_2m: number
  precipitation: number
  wind_speed_10m: number
  cloud_cover: number
  surface_pressure: number
  pressure_msl: number
  et0_fao_evapotranspiration: number
  soil_temperature_0_to_7cm: number
  daily_precipitation_sum: number
  daily_temperature_2m_max: number
  prediction: number,
  soil_moisture_0_to_7cm: number
  vapour_pressure_deficit: number
  shortwave_radiation_instant: number
  boundary_layer_height: number
}

export interface IMessage {
  text: string;
  isGpt: boolean;
}

export interface IAppContext {
  latitude: number
  setLatitude(value: number): void
  longitude: number
  setLongitude(value: number): void
  startDate: string,
  setStartDate(value: string): void
  startHour: number
  setStartHour(value: number): void
  dataPrediction: IDataPrediction
  setDataPrediction(value: IDataPrediction): void
  isLoading: boolean
  setIsLoading(value: boolean): void
  activeMap: 'predictive' | 'historical'
  setActiveMap(value: 'predictive' | 'historical'): void
  messages: IMessage[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setMessages(value: any):void
  llmContext: string[]
  setLlmContext(value: string[]): void
}