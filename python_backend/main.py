from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List
from math import sqrt
import uvicorn
import pandas as pd
import io

app = FastAPI(title="HVAC Formula Calculator API")

# CORS middleware to allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==================== Pydantic Models ====================

class VolumeAirHeatGainRequest(BaseModel):
    Ks: float = Field(..., description="Sensible heat gained (W)")
    t: float = Field(..., description="Allowable temperature rise (°C)")
    Kl: float = Field(..., description="Latent heat gained (W)")
    h: float = Field(..., description="Vapor pressure difference (mm Hg)")
    wo: float = Field(..., description="Specific humidity outside")
    wi: float = Field(..., description="Specific humidity inside")


class VolumeAirHeatGainResponse(BaseModel):
    Qs: float = Field(..., description="Sensible air volume (m³/h)")
    Ql_vapor: float = Field(..., description="Latent air volume by vapor pressure (m³/h)")
    Q_humidity: float = Field(..., description="Latent air volume by humidity (m³/h)")
    Qt_vapor: float = Field(..., description="Total air volume (vapor method, m³/h)")
    Qt_humidity: float = Field(..., description="Total air volume (humidity method, m³/h)")


class WindowCalculationsRequest(BaseModel):
    V_room: float = Field(..., description="Room volume (m³)")
    n_ach: float = Field(..., description="Air changes per hour")
    K: float = Field(0.6, description="Coefficient of flow")
    V: float = Field(..., description="Wind speed (m/h)")
    equal_opening: bool = Field(True, description="Calculate equal openings")
    A_effective: Optional[float] = Field(None, description="Effective area for unequal openings (m²)")
    calc_inlet: Optional[bool] = Field(None, description="True for inlet, False for outlet (unequal only)")


class WindowCalculationsResponse(BaseModel):
    Q: float = Field(..., description="Calculated airflow rate (m³/h)")
    A: Optional[float] = Field(None, description="Opening area for equal openings (m²)")
    Ai: float = Field(..., description="Inlet area (m²)")
    Ao: float = Field(..., description="Outlet area (m²)")


class VolumeAirForcesRequest(BaseModel):
    A_inlet: float = Field(..., description="Free area of inlet opening (m²)")
    h: float = Field(..., description="Vertical distance between inlet and outlet (m)")
    t_i: float = Field(..., description="Indoor temperature at height h (°C)")
    t_o: float = Field(..., description="Outdoor temperature (°C)")
    A_smaller: float = Field(..., description="Smaller opening area (m²)")
    V: float = Field(..., description="Outdoor wind speed (m/h)")
    K: float = Field(0.6, description="Effectiveness coefficient")


class VolumeAirForcesResponse(BaseModel):
    Qt: float = Field(..., description="Thermal flow (m³/min)")
    Qw: float = Field(..., description="Wind flow (m³/min)")
    Q_combined: float = Field(..., description="Resultant combined flow (m³/min)")


class QFromACHRequest(BaseModel):
    ACH: float = Field(..., description="Air changes per hour")
    V: float = Field(..., description="Room volume (m³)")
    rho: float = Field(1.2, description="Air density (kg/m³)")
    Cp: float = Field(1005.0, description="Specific heat (J/kg·K)")
    delta_T: float = Field(..., description="Temperature difference (K)")


class QFromACHResponse(BaseModel):
    Q: float = Field(..., description="Heat load (W)")


class ElementInput(BaseModel):
    U: float = Field(..., description="U-value (W/m²·K)")
    A: float = Field(..., description="Area (m²)")


class ByElementRequest(BaseModel):
    elements: List[ElementInput] = Field(..., description="List of building elements")
    delta_T: float = Field(..., description="Temperature difference (K)")


class ByElementResponse(BaseModel):
    Q_total: float = Field(..., description="Total heat load by element (W)")
    elements_UA: List[float] = Field(..., description="UA value for each element")


class WindowPRequest(BaseModel):
    heat_gain_shading: float = Field(..., description="Heat gain through shading device (W)")
    heat_gain_clear_glass: float = Field(..., description="Heat gain through clear glass (W)")


class WindowPResponse(BaseModel):
    shade_factor: float = Field(..., description="Shade factor (%)")


class SolarHeatGainRequest(BaseModel):
    area: float = Field(..., description="Area of window glass glazing (m²)")
    SHGC: float = Field(..., description="Solar Heat Gain Coefficient")
    projection_factor: float = Field(1.0, description="Projection factor of horizontal shading")
    solar_irradiation: float = Field(..., description="Solar irradiation (W/m²)")


class SolarHeatGainResponse(BaseModel):
    Q_solar: float = Field(..., description="Equivalent solar heat gain (W)")
    effective_SHGC: float = Field(..., description="Effective SHGC (SHGC × Projection Factor)")


# ==================== Calculation Functions ====================

def calculate_air_volume_sensible(Ks: float, t: float) -> float:
    """Sensible heat air volume (m^3/h)"""
    if t == 0:
        return 0.0
    Qs = 2.9768 * Ks / t
    return Qs


def calculate_air_volume_latent_vapor(Kl: float, h: float) -> float:
    """Latent heat air volume (vapor pressure, m^3/h)"""
    if h == 0:
        return 0.0
    Ql = 4127.26 * Kl / h
    return Ql


def calculate_air_volume_latent_humidity(Kl: float, diff_w0_wi: float) -> float:
    """Latent heat air volume (specific humidity, m^3/h)"""
    if diff_w0_wi == 0:
        return 0.0
    Q = Kl / (814 * diff_w0_wi)
    return Q


def calculate_total_air_volume(Q: float, Ql_or_Qs: float) -> float:
    """Total air volume (m^3/h)"""
    Qt = Q + Ql_or_Qs
    return Qt


def ventilation_opening_area(Q: float, V: float, K: float = 0.6) -> float:
    """Calculate required opening area for permanent ventilation"""
    if K * V == 0:
        return 0.0
    A = Q / (K * V)
    return A


def unequal_openings(Ai: Optional[float] = None, Ao: Optional[float] = None, A_effective: Optional[float] = None):
    """Calculate the missing inlet/outlet opening area"""
    if A_effective is None:
        raise ValueError("A_effective is required.")
    
    if Ai is not None and Ao is None:
        denom = (2 / A_effective) - (1 / Ai)
        if denom <= 0:
            return {"Ai": Ai, "Ao": float('inf')}
        Ao = 1 / denom
    elif Ao is not None and Ai is None:
        denom = (2 / A_effective) - (1 / Ao)
        if denom <= 0:
            return {"Ai": float('inf'), "Ao": Ao}
        Ai = 1 / denom
    
    return {"Ai": Ai, "Ao": Ao}


def ventilation_thermal(A_m2: float, h_m: float, t_i_C: float, t_o_C: float) -> float:
    """Q_t = 7.0 * A * sqrt(h * (t_i - t_o)) - Returns m^3/min"""
    return 7.0 * A_m2 * sqrt(max(0.0, h_m * (t_i_C - t_o_C)))


def ventilation_wind(A_smaller_m2: float, V_m_per_h: float, K: float) -> float:
    """Q_w = K * A * V - Returns m^3/h"""
    return K * A_smaller_m2 * V_m_per_h


def ventilation_wind_m3_per_min(A_smaller_m2: float, V_m_per_h: float, K: float) -> float:
    """Wind-driven flow in m^3/min"""
    return ventilation_wind(A_smaller_m2, V_m_per_h, K) / 60.0


def ventilation_combined(A_m2: float, h_m: float, t_i_C: float, t_o_C: float,
                         A_smaller_m2: float, V_m_per_h: float, K: float) -> float:
    """Q^2 = Q_w^2 + Q_t^2 - Returns m^3/min"""
    Q_t = ventilation_thermal(A_m2, h_m, t_i_C, t_o_C)
    Q_w = ventilation_wind_m3_per_min(A_smaller_m2, V_m_per_h, K)
    return sqrt(Q_w**2 + Q_t**2)


def shade_factor(heat_gain_shading: float, heat_gain_clear_glass: float) -> float:
    """Calculate shade factor percentage"""
    if heat_gain_clear_glass == 0:
        return 0.0
    S = (heat_gain_shading / heat_gain_clear_glass) * 100
    return S


def calculate_solar_heat_gain(area: float, shgc: float, projection_factor: float, solar_irradiation: float) -> dict:
    """Calculate equivalent solar heat gain through glazing
    Q_solar = Area × Effective_SHGC × I
    Effective_SHGC = SHGC × Projection_Factor
    """
    effective_shgc = shgc * projection_factor
    q_solar = area * effective_shgc * solar_irradiation
    return {"Q_solar": q_solar, "effective_SHGC": effective_shgc}


# ==================== API Endpoints ====================

@app.get("/")
async def root():
    return {
        "message": "HVAC Formula Calculator API",
        "version": "1.0.0",
        "endpoints": [
            "/api/volume-air-heat-gain",
            "/api/window-calculations",
            "/api/volume-air-forces",
            "/api/q-from-ach",
            "/api/by-element",
            "/api/window-p",
            "/api/solar-heat-gain"
        ]
    }


@app.post("/api/volume-air-heat-gain", response_model=VolumeAirHeatGainResponse)
async def volume_air_heat_gain(request: VolumeAirHeatGainRequest):
    """Calculate sensible and latent air volumes"""
    Qs = calculate_air_volume_sensible(request.Ks, request.t)
    Ql_vapor = calculate_air_volume_latent_vapor(request.Kl, request.h)
    
    diff_w0_wi = request.wo - request.wi
    Q_humidity = calculate_air_volume_latent_humidity(request.Kl, diff_w0_wi)
    
    Qt_vapor = calculate_total_air_volume(Qs, Ql_vapor)
    Qt_humidity = calculate_total_air_volume(Qs, Q_humidity)
    
    return VolumeAirHeatGainResponse(
        Qs=round(Qs, 3),
        Ql_vapor=round(Ql_vapor, 3),
        Q_humidity=round(Q_humidity, 3),
        Qt_vapor=round(Qt_vapor, 3),
        Qt_humidity=round(Qt_humidity, 3)
    )


@app.post("/api/window-calculations", response_model=WindowCalculationsResponse)
async def window_calculations(request: WindowCalculationsRequest):
    """Calculate window opening areas for ventilation"""
    # Calculate Q from room volume and air changes per hour
    Q = request.V_room * request.n_ach
    
    if request.equal_opening:
        # Equal openings
        A = ventilation_opening_area(Q, request.V, request.K)
        areas = unequal_openings(A_effective=A, Ai=A)
        Ai = areas["Ai"]
        Ao = areas["Ao"]
        
        return WindowCalculationsResponse(
            Q=round(Q, 2),
            A=round(A, 3),
            Ai=round(Ai, 3),
            Ao=round(Ao, 3)
        )
    else:
        # Unequal openings
        if request.A_effective is None:
            raise ValueError("A_effective is required for unequal openings")
        
        if request.calc_inlet:
            # Calculate inlet, outlet is given
            areas = unequal_openings(Ao=request.A_effective, A_effective=request.A_effective)
        else:
            # Calculate outlet, inlet is given
            areas = unequal_openings(Ai=request.A_effective, A_effective=request.A_effective)
        
        Ai = areas["Ai"]
        Ao = areas["Ao"]
        
        return WindowCalculationsResponse(
            Q=round(Q, 2),
            A=None,
            Ai=round(Ai, 3),
            Ao=round(Ao, 3)
        )


@app.post("/api/volume-air-forces", response_model=VolumeAirForcesResponse)
async def volume_air_forces(request: VolumeAirForcesRequest):
    """Calculate thermal, wind, and combined ventilation flows"""
    Qt = ventilation_thermal(request.A_inlet, request.h, request.t_i, request.t_o)
    Qw = ventilation_wind_m3_per_min(request.A_smaller, request.V, request.K)
    Q_combined = ventilation_combined(
        request.A_inlet, request.h, request.t_i, request.t_o,
        request.A_smaller, request.V, request.K
    )
    
    return VolumeAirForcesResponse(
        Qt=round(Qt, 2),
        Qw=round(Qw, 2),
        Q_combined=round(Q_combined, 2)
    )


@app.post("/api/q-from-ach", response_model=QFromACHResponse)
async def q_from_ach(request: QFromACHRequest):
    """Calculate heat load from air changes per hour"""
    Q = request.ACH * request.V * request.rho * request.Cp * request.delta_T / 3600
    
    return QFromACHResponse(
        Q=round(Q, 2)
    )


@app.post("/api/by-element", response_model=ByElementResponse)
async def by_element(request: ByElementRequest):
    """Calculate total heat load by building elements"""
    elements_UA = []
    total_UA = 0.0
    
    for element in request.elements:
        UA = element.U * element.A
        elements_UA.append(round(UA, 2))
        total_UA += UA
    
    Q_total = total_UA * request.delta_T
    
    return ByElementResponse(
        Q_total=round(Q_total, 2),
        elements_UA=elements_UA
    )


@app.post("/api/window-p", response_model=WindowPResponse)
async def window_p(request: WindowPRequest):
    """Calculate shade factor for windows"""
    S = shade_factor(request.heat_gain_shading, request.heat_gain_clear_glass)
    
    return WindowPResponse(
        shade_factor=round(S, 2)
    )


@app.post("/api/solar-heat-gain", response_model=SolarHeatGainResponse)
async def solar_heat_gain(request: SolarHeatGainRequest):
    """Calculate equivalent solar heat gain through glazing"""
    result = calculate_solar_heat_gain(
        area=request.area,
        shgc=request.SHGC,
        projection_factor=request.projection_factor,
        solar_irradiation=request.solar_irradiation
    )
    
    return SolarHeatGainResponse(
        Q_solar=round(result["Q_solar"], 4),
        effective_SHGC=round(result["effective_SHGC"], 6)
    )


# ==================== EPW File Parsing Endpoint ====================

class EPWDataRequest(BaseModel):
    year: int = Field(..., description="Year from EPW file")
    month: int = Field(..., description="Month (1-12)")
    day: int = Field(..., description="Day (1-31)")
    hour: int = Field(..., description="Hour (1-24)")


class EPWDataResponse(BaseModel):
    temperature: float = Field(..., description="Dry bulb temperature (°C)")
    wind_speed_mh: float = Field(..., description="Wind speed (m/h)")
    wind_speed_ms: float = Field(..., description="Wind speed (m/s)")
    success: bool = Field(..., description="Whether data was found")
    message: str = Field(..., description="Status message")


@app.post("/api/upload-epw")
async def upload_epw(file: UploadFile = File(...)):
    """Upload and store EPW file data in memory for later queries"""
    try:
        # Read the file content
        content = await file.read()
        
        # Store in a simple in-memory cache (in production, use proper storage)
        # For now, we'll just parse and return available years
        df = pd.read_csv(io.BytesIO(content), skiprows=8, header=None)
        
        # Rename columns based on standard EPW format
        df = df.rename(columns={
            0: 'Year', 1: 'Month', 2: 'Day', 3: 'Hour', 4: 'Minute',
            6: 'DryBulbTemp',
            21: 'WindSpeed'
        })
        
        # Store the dataframe globally (simplified for demo)
        global epw_data
        epw_data = df
        
        
        unique_years = sorted(df['Year'].unique().tolist())

        # Get available months for each year to display like in the streamlit app
        year_month_data = {}
        month_names = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December']

        for year in unique_years:
            months_in_year = sorted(df[df['Year'] == year]['Month'].unique().tolist())
            month_name_list = [month_names[m-1] for m in months_in_year]
            year_month_data[str(year)] = month_name_list

        # Build a fully nested structure: year → month → { days, hours_by_day }
        # Keys are strings so they serialise cleanly to JSON.
        available_data: dict = {}
        for year in unique_years:
            year_df = df[df['Year'] == year]
            available_data[str(year)] = {}
            for month in sorted(year_df['Month'].unique().tolist()):
                month_df = year_df[year_df['Month'] == month]
                days = sorted(month_df['Day'].unique().tolist())
                hours_by_day: dict = {}
                for day in days:
                    hours = sorted(month_df[month_df['Day'] == day]['Hour'].unique().tolist())
                    hours_by_day[str(day)] = hours
                available_data[str(year)][str(month)] = {
                    "days": days,
                    "hours_by_day": hours_by_day
                }

        return {
            "success": True,
            "message": "EPW file uploaded successfully",
            "years": unique_years,
            "year_month_data": year_month_data,
            "available_data": available_data,
            "total_records": len(df)
        }
    except Exception as e:
        return {
            "success": False,
            "message": f"Error parsing EPW file: {str(e)}",
            "years": [],
            "total_records": 0
        }


@app.post("/api/query-epw", response_model=EPWDataResponse)
async def query_epw(request: EPWDataRequest):
    """Query EPW data for specific date and time"""
    try:
        global epw_data
        
        if epw_data is None:
            return EPWDataResponse(
                temperature=0.0,
                wind_speed_mh=0.0,
                wind_speed_ms=0.0,
                success=False,
                message="No EPW file uploaded. Please upload an EPW file first."
            )
        
        # Filter dataframe for the requested date/time
        mask = (
            (epw_data['Year'] == request.year) &
            (epw_data['Month'] == request.month) &
            (epw_data['Day'] == request.day) &
            (epw_data['Hour'] == request.hour)
        )
        
        selected_rows = epw_data[mask]
        
        if selected_rows.empty:
            return EPWDataResponse(
                temperature=0.0,
                wind_speed_mh=0.0,
                wind_speed_ms=0.0,
                success=False,
                message=f"No data found for {request.year}-{request.month:02d}-{request.day:02d} at hour {request.hour}"
            )
        
        row = selected_rows.iloc[0]
        temp = float(row['DryBulbTemp'])
        wind_ms = float(row['WindSpeed'])
        wind_mh = wind_ms * 3600.0  # Convert m/s to m/h
        
        return EPWDataResponse(
            temperature=round(temp, 2),
            wind_speed_mh=round(wind_mh, 0),
            wind_speed_ms=round(wind_ms, 2),
            success=True,
            message=f"Data found: Temp={temp}°C, Wind={wind_ms} m/s ({wind_mh} m/h)"
        )
        
    except Exception as e:
        return EPWDataResponse(
            temperature=0.0,
            wind_speed_mh=0.0,
            wind_speed_ms=0.0,
            success= False,
            message=f"Error querying EPW data: {str(e)}"
        )


# Initialize global EPW data storage
epw_data = None

