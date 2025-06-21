import azure.functions as func
import logging
import urllib.request
import json

app = func.FunctionApp(http_auth_level=func.AuthLevel.FUNCTION)

EXPECTED_FIELDS = [
    "temperature_2m",
    "relative_humidity_2m",
    "wind_speed_10m",
    "surface_pressure",
    "et0_fao_evapotranspiration",
    "soil_temperature_0_to_7cm",
    "soil_moisture_0_to_7cm",
    "vapour_pressure_deficit",
    "shortwave_radiation_instant",
    "boundary_layer_height"
]

API_URL = "https://wildfire-hackathon-endpoint-v2.eastus2.inference.ml.azure.com/score"
API_KEY = ""

@app.route(route="fire_prediction")
def fire_prediction(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Received request for wildfire prediction.')

    try:
        req_body = req.get_json()
    except ValueError:
        req_body = {key: req.params.get(key) for key in EXPECTED_FIELDS}

    # Verifica se todos os campos esperados estão presentes
    missing = [field for field in EXPECTED_FIELDS if field not in req_body]
    if missing:
        return func.HttpResponse(
            f"Missing fields in request: {', '.join(missing)}",
            status_code=400
        )

    try:
        # Cria dicionário com valores convertidos para float
        input_data = {field: float(req_body[field]) for field in EXPECTED_FIELDS}
    except ValueError as e:
        return func.HttpResponse(f"Invalid input format: {e}", status_code=400)

    # Monta o payload no formato esperado pelo modelo
    payload = json.dumps({
        "Inputs": {
            "data": [input_data]
        }
    }).encode("utf-8")

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}"
    }

    try:
        request = urllib.request.Request(API_URL, payload, headers)
        response = urllib.request.urlopen(request)
        result = response.read()
        return func.HttpResponse(result.decode("utf-8"), mimetype="application/json")
    except urllib.error.HTTPError as error:
        logging.error(f"Error calling model: {error}")
        return func.HttpResponse(
            f"Model request failed: {error.read().decode('utf-8', 'ignore')}",
            status_code=500
        )
