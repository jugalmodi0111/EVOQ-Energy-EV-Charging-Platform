from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, date
from enum import Enum

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="EV Charging Station Business Platform", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Enums
class ChargingStationType(str, Enum):
    LEVEL_1 = "Level 1 (AC 120V)"
    LEVEL_2 = "Level 2 (AC 240V)"
    DC_FAST = "DC Fast Charging"
    ULTRA_FAST = "Ultra Fast Charging"

class LocationType(str, Enum):
    METRO_STATION = "Metro Station"
    SHOPPING_MALL = "Shopping Mall"
    HIGHWAY = "Highway"
    RESIDENTIAL = "Residential"
    COMMERCIAL = "Commercial"
    RESTAURANT = "Restaurant"
    HOTEL = "Hotel"
    HOSPITAL = "Hospital"

class PartnershipStatus(str, Enum):
    POTENTIAL = "Potential"
    IN_DISCUSSION = "In Discussion"
    NEGOTIATING = "Negotiating"
    SIGNED = "Signed"
    ACTIVE = "Active"

# Data Models
class MarketData(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    region: str
    city: str
    ev_adoption_rate: float
    current_charging_stations: int
    population: int
    average_income: float
    market_size_millions: float
    growth_rate_percentage: float
    competition_level: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class LocationAnalysis(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    address: str
    latitude: float
    longitude: float
    location_type: LocationType
    daily_traffic: int
    nearby_amenities: List[str]
    competition_within_5km: int
    installation_cost: float
    expected_daily_usage: int
    revenue_potential: float
    partnership_opportunity: bool
    contact_info: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class FinancialModel(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    scenario_name: str
    initial_investment: float
    charging_station_cost: float
    installation_cost: float
    land_lease_monthly: float
    electricity_cost_per_kwh: float
    charging_price_per_kwh: float
    expected_daily_users: int
    average_charging_amount: float
    monthly_maintenance: float
    staff_cost_monthly: float
    roi_percentage: float
    break_even_months: int
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Competitor(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    company_name: str
    business_model: str
    charging_stations_count: int
    regions_covered: List[str]
    pricing_model: str
    average_price_per_kwh: float
    strengths: List[str]
    weaknesses: List[str]
    market_share_percentage: float
    funding_raised: Optional[float] = None
    website: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Supplier(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    company_name: str
    country: str
    contact_person: str
    email: str
    phone: str
    product_types: List[str]
    min_order_quantity: int
    price_per_unit: float
    lead_time_days: int
    quality_rating: float
    payment_terms: str
    certifications: List[str]
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Partnership(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    organization_name: str
    organization_type: str
    contact_person: str
    email: str
    phone: str
    partnership_type: str
    potential_locations: List[str]
    revenue_sharing_model: str
    status: PartnershipStatus
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class BusinessPlan(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    plan_name: str
    target_region: str
    timeline_months: int
    total_investment_required: float
    target_stations: int
    revenue_projections: Dict[str, float]
    key_milestones: List[Dict[str, Any]]
    risk_factors: List[str]
    mitigation_strategies: List[str]
    created_at: datetime = Field(default_factory=datetime.utcnow)

class RegulatoryInfo(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    regulation_type: str
    state: str
    description: str
    compliance_requirements: List[str]
    fees_applicable: float
    processing_time_days: int
    required_documents: List[str]
    authority: str
    last_updated: datetime = Field(default_factory=datetime.utcnow)

# Create Models
class MarketDataCreate(BaseModel):
    region: str
    city: str
    ev_adoption_rate: float
    current_charging_stations: int
    population: int
    average_income: float
    market_size_millions: float
    growth_rate_percentage: float
    competition_level: str

class LocationAnalysisCreate(BaseModel):
    name: str
    address: str
    latitude: float
    longitude: float
    location_type: LocationType
    daily_traffic: int
    nearby_amenities: List[str]
    competition_within_5km: int
    installation_cost: float
    expected_daily_usage: int
    revenue_potential: float
    partnership_opportunity: bool
    contact_info: Optional[str] = None

class FinancialModelCreate(BaseModel):
    scenario_name: str
    initial_investment: float
    charging_station_cost: float
    installation_cost: float
    land_lease_monthly: float
    electricity_cost_per_kwh: float
    charging_price_per_kwh: float
    expected_daily_users: int
    average_charging_amount: float
    monthly_maintenance: float
    staff_cost_monthly: float

# Basic API Routes
@api_router.get("/")
async def root():
    return {"message": "EV Charging Station Business Platform API", "version": "1.0.0"}

# Market Research APIs
@api_router.post("/market-data", response_model=MarketData)
async def create_market_data(input: MarketDataCreate):
    market_dict = input.dict()
    market_obj = MarketData(**market_dict)
    await db.market_data.insert_one(market_obj.dict())
    return market_obj

@api_router.get("/market-data", response_model=List[MarketData])
async def get_market_data():
    market_data = await db.market_data.find().to_list(1000)
    return [MarketData(**data) for data in market_data]

@api_router.get("/market-analysis/{city}")
async def get_market_analysis(city: str):
    """Get comprehensive market analysis for a specific city"""
    market_data = await db.market_data.find_one({"city": city})
    
    if not market_data:
        raise HTTPException(status_code=404, detail="Market data not found for this city")
    
    # Calculate market insights
    total_ev_market = market_data["population"] * (market_data["ev_adoption_rate"] / 100)
    stations_needed = total_ev_market / 50  # Assuming 1 station per 50 EVs
    market_gap = stations_needed - market_data["current_charging_stations"]
    
    analysis = {
        "city": city,
        "market_data": market_data,
        "insights": {
            "total_potential_ev_users": total_ev_market,
            "stations_needed": stations_needed,
            "market_gap": market_gap,
            "market_opportunity": market_gap * 500000,  # Estimated revenue per station per year
            "competition_density": market_data["current_charging_stations"] / market_data["population"] * 100000
        }
    }
    
    return analysis

# Location Analysis APIs
@api_router.post("/locations", response_model=LocationAnalysis)
async def create_location(input: LocationAnalysisCreate):
    location_dict = input.dict()
    location_obj = LocationAnalysis(**location_dict)
    await db.locations.insert_one(location_obj.dict())
    return location_obj

@api_router.get("/locations", response_model=List[LocationAnalysis])
async def get_locations():
    locations = await db.locations.find().to_list(1000)
    return [LocationAnalysis(**location) for location in locations]

@api_router.get("/location-analysis/{location_id}")
async def get_location_analysis(location_id: str):
    """Get detailed analysis for a specific location"""
    location = await db.locations.find_one({"id": location_id})
    
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")
    
    # Calculate location score
    traffic_score = min(location["daily_traffic"] / 1000, 10)
    competition_score = max(10 - location["competition_within_5km"], 1)
    revenue_score = min(location["revenue_potential"] / 100000, 10)
    
    overall_score = (traffic_score + competition_score + revenue_score) / 3
    
    analysis = {
        "location": location,
        "analysis": {
            "traffic_score": traffic_score,
            "competition_score": competition_score,
            "revenue_score": revenue_score,
            "overall_score": overall_score,
            "recommendation": "High Priority" if overall_score >= 7 else "Medium Priority" if overall_score >= 5 else "Low Priority"
        }
    }
    
    return analysis

# Financial Planning APIs
@api_router.post("/financial-models", response_model=FinancialModel)
async def create_financial_model(input: FinancialModelCreate):
    model_dict = input.dict()
    
    # Calculate ROI and break-even
    monthly_revenue = input.expected_daily_users * input.average_charging_amount * 30
    monthly_costs = (input.land_lease_monthly + input.monthly_maintenance + 
                    input.staff_cost_monthly + 
                    (input.expected_daily_users * input.average_charging_amount * 30 * 
                     input.electricity_cost_per_kwh / input.charging_price_per_kwh))
    
    monthly_profit = monthly_revenue - monthly_costs
    roi_percentage = (monthly_profit * 12 / input.initial_investment) * 100
    break_even_months = input.initial_investment / monthly_profit if monthly_profit > 0 else 0
    
    model_dict["roi_percentage"] = roi_percentage
    model_dict["break_even_months"] = break_even_months
    
    financial_obj = FinancialModel(**model_dict)
    await db.financial_models.insert_one(financial_obj.dict())
    return financial_obj

@api_router.get("/financial-models", response_model=List[FinancialModel])
async def get_financial_models():
    models = await db.financial_models.find().to_list(1000)
    return [FinancialModel(**model) for model in models]

@api_router.get("/roi-calculator")
async def calculate_roi(
    investment: float,
    daily_users: int,
    price_per_kwh: float,
    avg_charging_kwh: float,
    monthly_costs: float
):
    """Calculate ROI for given parameters"""
    monthly_revenue = daily_users * avg_charging_kwh * price_per_kwh * 30
    monthly_profit = monthly_revenue - monthly_costs
    annual_profit = monthly_profit * 12
    roi_percentage = (annual_profit / investment) * 100
    break_even_months = investment / monthly_profit if monthly_profit > 0 else float('inf')
    
    return {
        "monthly_revenue": monthly_revenue,
        "monthly_profit": monthly_profit,
        "annual_profit": annual_profit,
        "roi_percentage": roi_percentage,
        "break_even_months": break_even_months,
        "payback_period_years": break_even_months / 12
    }

# Competitor Analysis APIs
@api_router.post("/competitors", response_model=Competitor)
async def create_competitor(competitor: Competitor):
    await db.competitors.insert_one(competitor.dict())
    return competitor

@api_router.get("/competitors", response_model=List[Competitor])
async def get_competitors():
    competitors = await db.competitors.find().to_list(1000)
    return [Competitor(**comp) for comp in competitors]

@api_router.get("/competitor-analysis")
async def get_competitor_analysis():
    """Get comprehensive competitor analysis"""
    competitors = await db.competitors.find().to_list(1000)
    
    total_market_share = sum(comp.get("market_share_percentage", 0) for comp in competitors)
    avg_price = sum(comp.get("average_price_per_kwh", 0) for comp in competitors) / len(competitors) if competitors else 0
    
    analysis = {
        "total_competitors": len(competitors),
        "total_market_share_covered": total_market_share,
        "market_share_available": 100 - total_market_share,
        "average_market_price": avg_price,
        "top_competitors": sorted(competitors, key=lambda x: x.get("market_share_percentage", 0), reverse=True)[:5],
        "pricing_insights": {
            "min_price": min(comp.get("average_price_per_kwh", 0) for comp in competitors) if competitors else 0,
            "max_price": max(comp.get("average_price_per_kwh", 0) for comp in competitors) if competitors else 0,
            "suggested_competitive_price": avg_price * 0.95 if avg_price > 0 else 15
        }
    }
    
    return analysis

# Supplier Management APIs
@api_router.post("/suppliers", response_model=Supplier)
async def create_supplier(supplier: Supplier):
    await db.suppliers.insert_one(supplier.dict())
    return supplier

@api_router.get("/suppliers", response_model=List[Supplier])
async def get_suppliers():
    suppliers = await db.suppliers.find().to_list(1000)
    return [Supplier(**supplier) for supplier in suppliers]

@api_router.get("/suppliers/china")
async def get_china_suppliers():
    """Get suppliers specifically from China"""
    suppliers = await db.suppliers.find({"country": "China"}).to_list(1000)
    return [Supplier(**supplier) for supplier in suppliers]

@api_router.get("/supplier-analysis")
async def get_supplier_analysis():
    """Get supplier cost and quality analysis"""
    suppliers = await db.suppliers.find().to_list(1000)
    
    if not suppliers:
        return {"message": "No suppliers found"}
    
    avg_price = sum(s.get("price_per_unit", 0) for s in suppliers) / len(suppliers)
    avg_quality = sum(s.get("quality_rating", 0) for s in suppliers) / len(suppliers)
    
    analysis = {
        "total_suppliers": len(suppliers),
        "average_price_per_unit": avg_price,
        "average_quality_rating": avg_quality,
        "best_value_suppliers": sorted(suppliers, key=lambda x: x.get("quality_rating", 0) / x.get("price_per_unit", 1), reverse=True)[:5],
        "china_suppliers": len([s for s in suppliers if s.get("country") == "China"]),
        "cost_savings_potential": {
            "china_vs_others": "60-70% cost savings typically available from China suppliers",
            "bulk_order_savings": "15-25% additional savings on orders >100 units"
        }
    }
    
    return analysis

# Partnership Management APIs
@api_router.post("/partnerships", response_model=Partnership)
async def create_partnership(partnership: Partnership):
    await db.partnerships.insert_one(partnership.dict())
    return partnership

@api_router.get("/partnerships", response_model=List[Partnership])
async def get_partnerships():
    partnerships = await db.partnerships.find().to_list(1000)
    return [Partnership(**partnership) for partnership in partnerships]

@api_router.get("/partnerships/metro-stations")
async def get_metro_partnerships():
    """Get partnerships specifically with metro stations"""
    partnerships = await db.partnerships.find({
        "$or": [
            {"organization_type": "Metro Authority"},
            {"organization_name": {"$regex": "Metro|BMRCL", "$options": "i"}}
        ]
    }).to_list(1000)
    return [Partnership(**partnership) for partnership in partnerships]

# Business Plan APIs
@api_router.post("/business-plans", response_model=BusinessPlan)
async def create_business_plan(plan: BusinessPlan):
    await db.business_plans.insert_one(plan.dict())
    return plan

@api_router.get("/business-plans", response_model=List[BusinessPlan])
async def get_business_plans():
    plans = await db.business_plans.find().to_list(1000)
    return [BusinessPlan(**plan) for plan in plans]

@api_router.post("/generate-business-plan")
async def generate_business_plan(
    target_city: str,
    investment_budget: float,
    timeline_months: int,
    target_stations: int
):
    """Generate a comprehensive business plan"""
    
    # Get market data for the city
    market_data = await db.market_data.find_one({"city": target_city})
    
    if not market_data:
        # Create default market data for Bangalore
        market_data = {
            "population": 12000000,
            "ev_adoption_rate": 8.5,
            "current_charging_stations": 450,
            "market_size_millions": 850,
            "growth_rate_percentage": 35
        }
    
    # Calculate projections
    station_cost = investment_budget / target_stations
    monthly_revenue_per_station = station_cost * 0.15  # 15% monthly return assumption
    total_monthly_revenue = monthly_revenue_per_station * target_stations
    
    revenue_projections = {}
    for year in range(1, 6):
        revenue_projections[f"year_{year}"] = total_monthly_revenue * 12 * year * (1 + market_data["growth_rate_percentage"]/100) ** (year-1)
    
    milestones = [
        {"month": 3, "milestone": "Complete market research and location analysis", "status": "pending"},
        {"month": 6, "milestone": "Secure first 3 partnerships (Metro stations)", "status": "pending"},
        {"month": 9, "milestone": "Import first batch of chargers from China", "status": "pending"},
        {"month": 12, "milestone": "Launch first 5 charging stations", "status": "pending"},
        {"month": 18, "milestone": "Expand to 25 stations across Bangalore", "status": "pending"},
        {"month": 24, "milestone": "Start manufacturing setup in India", "status": "pending"}
    ]
    
    risk_factors = [
        "Regulatory changes in EV charging policies",
        "Increased competition from established players",
        "Supply chain disruptions from China",
        "Land acquisition challenges",
        "Technology obsolescence"
    ]
    
    mitigation_strategies = [
        "Maintain close relationships with regulatory authorities",
        "Focus on unique value propositions and partnerships",
        "Diversify supplier base across multiple countries",
        "Secure long-term land lease agreements",
        "Invest in R&D for future-ready technology"
    ]
    
    business_plan = {
        "plan_name": f"{target_city} EV Charging Expansion Plan",
        "target_region": target_city,
        "timeline_months": timeline_months,
        "total_investment_required": investment_budget,
        "target_stations": target_stations,
        "revenue_projections": revenue_projections,
        "key_milestones": milestones,
        "risk_factors": risk_factors,
        "mitigation_strategies": mitigation_strategies,
        "market_insights": {
            "market_size": market_data["market_size_millions"],
            "growth_rate": market_data["growth_rate_percentage"],
            "competition_gap": "High demand, moderate competition",
            "success_probability": "85% with proper execution"
        }
    }
    
    return business_plan

# Regulatory Compliance APIs
@api_router.post("/regulatory-info", response_model=RegulatoryInfo)
async def create_regulatory_info(info: RegulatoryInfo):
    await db.regulatory_info.insert_one(info.dict())
    return info

@api_router.get("/regulatory-info", response_model=List[RegulatoryInfo])
async def get_regulatory_info():
    info = await db.regulatory_info.find().to_list(1000)
    return [RegulatoryInfo(**item) for item in info]

@api_router.get("/regulatory-compliance/{state}")
async def get_regulatory_compliance(state: str):
    """Get regulatory compliance requirements for a specific state"""
    requirements = await db.regulatory_info.find({"state": state}).to_list(1000)
    
    if not requirements:
        # Return default Karnataka/India requirements
        requirements = [
            {
                "regulation_type": "EV Charging Station License",
                "state": state,
                "description": "License required to operate EV charging stations",
                "compliance_requirements": [
                    "Technical safety certification",
                    "Electrical contractor license", 
                    "Environmental clearance",
                    "Fire safety certificate"
                ],
                "fees_applicable": 25000,
                "processing_time_days": 45,
                "required_documents": [
                    "Business registration certificate",
                    "Technical specifications of chargers",
                    "Site layout plans",
                    "Electrical safety certificates"
                ],
                "authority": "Karnataka Electricity Regulatory Commission"
            }
        ]
    
    total_fees = sum(req.get("fees_applicable", 0) for req in requirements)
    max_processing_time = max(req.get("processing_time_days", 0) for req in requirements)
    
    compliance_summary = {
        "state": state,
        "total_requirements": len(requirements),
        "total_fees": total_fees,
        "max_processing_time_days": max_processing_time,
        "requirements": requirements,
        "compliance_checklist": [
            "Obtain business registration",
            "Apply for electrical contractor license",
            "Get technical safety certifications", 
            "Submit environmental impact assessment",
            "Acquire fire safety clearance",
            "Apply for EV charging station license"
        ]
    }
    
    return compliance_summary

# Sample Data Initialization API
@api_router.post("/initialize-sample-data")
async def initialize_sample_data():
    """Initialize database with sample Indian EV market data"""
    
    # Sample Market Data for Indian Cities
    market_data_samples = [
        {
            "id": str(uuid.uuid4()),
            "region": "Karnataka",
            "city": "Bangalore",
            "ev_adoption_rate": 8.5,
            "current_charging_stations": 450,
            "population": 12000000,
            "average_income": 650000,
            "market_size_millions": 850,
            "growth_rate_percentage": 35,
            "competition_level": "High",
            "created_at": datetime.utcnow()
        },
        {
            "id": str(uuid.uuid4()),
            "region": "Maharashtra",
            "city": "Mumbai",
            "ev_adoption_rate": 6.2,
            "current_charging_stations": 380,
            "population": 20000000,
            "average_income": 750000,
            "market_size_millions": 1200,
            "growth_rate_percentage": 32,
            "competition_level": "Very High",
            "created_at": datetime.utcnow()
        },
        {
            "id": str(uuid.uuid4()),
            "region": "Delhi NCR",
            "city": "Delhi",
            "ev_adoption_rate": 7.8,
            "current_charging_stations": 520,
            "population": 18000000,
            "average_income": 680000,
            "market_size_millions": 950,
            "growth_rate_percentage": 38,
            "competition_level": "High",
            "created_at": datetime.utcnow()
        }
    ]
    
    # Sample Competitors
    competitors_samples = [
        {
            "id": str(uuid.uuid4()),
            "company_name": "Tata Power",
            "business_model": "B2B and B2C charging solutions",
            "charging_stations_count": 1200,
            "regions_covered": ["Maharashtra", "Karnataka", "Delhi", "Tamil Nadu"],
            "pricing_model": "Pay per kWh",
            "average_price_per_kwh": 18,
            "strengths": ["Established brand", "Wide network", "Corporate partnerships"],
            "weaknesses": ["Higher pricing", "Slow expansion"],
            "market_share_percentage": 25,
            "funding_raised": 500,
            "website": "https://www.tatapower.com",
            "created_at": datetime.utcnow()
        },
        {
            "id": str(uuid.uuid4()),
            "company_name": "ChargeZone",
            "business_model": "Public and semi-public charging",
            "charging_stations_count": 800,
            "regions_covered": ["Karnataka", "Telangana", "Tamil Nadu"],
            "pricing_model": "Subscription + pay per use",
            "average_price_per_kwh": 16,
            "strengths": ["Tech-forward", "Mobile app", "Fast charging"],
            "weaknesses": ["Limited network", "New brand"],
            "market_share_percentage": 15,
            "funding_raised": 120,
            "website": "https://www.chargezone.in",
            "created_at": datetime.utcnow()
        },
        {
            "id": str(uuid.uuid4()),
            "company_name": "Ather Energy",
            "business_model": "Vehicle + charging ecosystem",
            "charging_stations_count": 650,
            "regions_covered": ["Karnataka", "Tamil Nadu", "Maharashtra"],
            "pricing_model": "Free for Ather owners, paid for others",
            "average_price_per_kwh": 15,
            "strengths": ["Integrated ecosystem", "Premium quality", "Tech innovation"],
            "weaknesses": ["Limited to own customers primarily", "High cost"],
            "market_share_percentage": 12,
            "funding_raised": 400,
            "website": "https://www.atherenergy.com",
            "created_at": datetime.utcnow()
        }
    ]
    
    # Sample Suppliers (China focus)
    suppliers_samples = [
        {
            "id": str(uuid.uuid4()),
            "company_name": "Shenzhen EVSE Technology",
            "country": "China",
            "contact_person": "Wang Li",
            "email": "sales@evsetech.com",
            "phone": "+86-755-2847-9988",
            "product_types": ["DC Fast Chargers", "AC Chargers", "Charging Cables"],
            "min_order_quantity": 50,
            "price_per_unit": 85000,
            "lead_time_days": 35,
            "quality_rating": 8.5,
            "payment_terms": "30% advance, 70% on shipment",
            "certifications": ["CE", "FCC", "BIS India"],
            "notes": "Reliable supplier with good India export experience",
            "created_at": datetime.utcnow()
        },
        {
            "id": str(uuid.uuid4()),
            "company_name": "Guangzhou EV Charger Solutions",
            "country": "China",
            "contact_person": "Zhang Wei",
            "email": "export@gzevcs.com", 
            "phone": "+86-20-8564-7731",
            "product_types": ["Ultra Fast Chargers", "Smart Charging Systems"],
            "min_order_quantity": 25,
            "price_per_unit": 125000,
            "lead_time_days": 42,
            "quality_rating": 9.2,
            "payment_terms": "40% advance, 60% on delivery",
            "certifications": ["CE", "UL", "BIS India", "CCS"],
            "notes": "Premium quality, higher price point",
            "created_at": datetime.utcnow()
        }
    ]
    
    # Sample Partnerships (Bangalore focus)
    partnerships_samples = [
        {
            "id": str(uuid.uuid4()),
            "organization_name": "BMRCL (Bangalore Metro)",
            "organization_type": "Metro Authority",
            "contact_person": "Rajesh Kumar",
            "email": "partnerships@bmrcl.com",
            "phone": "+91-80-2294-5555",
            "partnership_type": "Revenue Sharing",
            "potential_locations": ["MG Road Metro", "Brigade Road", "Whitefield", "Electronic City"],
            "revenue_sharing_model": "70-30 split (us-them)",
            "status": "In Discussion",
            "notes": "Very interested, needs formal proposal",
            "created_at": datetime.utcnow()
        },
        {
            "id": str(uuid.uuid4()),
            "organization_name": "Forum Mall",
            "organization_type": "Shopping Mall",
            "contact_person": "Priya Sharma",
            "email": "leasing@forummalls.in",
            "phone": "+91-80-4567-8890",
            "partnership_type": "Fixed Rent + Revenue Share",
            "potential_locations": ["Forum Mall Koramangala", "Forum Neighbourhood Whitefield"],
            "revenue_sharing_model": "₹50K/month rent + 20% revenue share",
            "status": "Negotiating",
            "notes": "Prime locations, high footfall",
            "created_at": datetime.utcnow()
        }
    ]
    
    # Sample Locations (Bangalore)
    locations_samples = [
        {
            "id": str(uuid.uuid4()),
            "name": "MG Road Metro Station",
            "address": "MG Road, Bangalore, Karnataka 560001",
            "latitude": 12.9716,
            "longitude": 77.5946,
            "location_type": "Metro Station",
            "daily_traffic": 15000,
            "nearby_amenities": ["Shopping", "Offices", "Restaurants", "Hotels"],
            "competition_within_5km": 3,
            "installation_cost": 450000,
            "expected_daily_usage": 180,
            "revenue_potential": 285000,
            "partnership_opportunity": True,
            "contact_info": "BMRCL Partnership Team",
            "created_at": datetime.utcnow()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Electronic City IT Hub",
            "address": "Electronic City Phase 1, Bangalore 560100",
            "latitude": 12.8456,
            "longitude": 77.6603,
            "location_type": "Commercial",
            "daily_traffic": 25000,
            "nearby_amenities": ["IT Companies", "Food Courts", "ATMs", "Parking"],
            "competition_within_5km": 2,
            "installation_cost": 380000,
            "expected_daily_usage": 220,
            "revenue_potential": 350000,
            "partnership_opportunity": True,
            "contact_info": "IT Park Management",
            "created_at": datetime.utcnow()
        }
    ]
    
    # Sample Regulatory Info
    regulatory_samples = [
        {
            "id": str(uuid.uuid4()),
            "regulation_type": "EV Charging Station License",
            "state": "Karnataka",
            "description": "Mandatory license for operating EV charging stations in Karnataka",
            "compliance_requirements": [
                "Technical safety certification from authorized agency",
                "Electrical contractor license (Class A or B)",
                "Environmental impact assessment (for >10 chargers)",
                "Fire safety certificate from Fire Department"
            ],
            "fees_applicable": 25000,
            "processing_time_days": 45,
            "required_documents": [
                "Business registration certificate",
                "Technical specifications of charging equipment",
                "Site layout and electrical plans",
                "Insurance coverage certificate",
                "PAN and GST registration"
            ],
            "authority": "Karnataka Electricity Regulatory Commission (KERC)",
            "last_updated": datetime.utcnow()
        }
    ]
    
    # Insert sample data
    try:
        await db.market_data.delete_many({})  # Clear existing
        await db.market_data.insert_many(market_data_samples)
        
        await db.competitors.delete_many({})
        await db.competitors.insert_many(competitors_samples)
        
        await db.suppliers.delete_many({})
        await db.suppliers.insert_many(suppliers_samples)
        
        await db.partnerships.delete_many({})
        await db.partnerships.insert_many(partnerships_samples)
        
        await db.locations.delete_many({})
        await db.locations.insert_many(locations_samples)
        
        await db.regulatory_info.delete_many({})
        await db.regulatory_info.insert_many(regulatory_samples)
        
        return {
            "message": "Sample data initialized successfully",
            "data_inserted": {
                "market_data": len(market_data_samples),
                "competitors": len(competitors_samples),
                "suppliers": len(suppliers_samples),
                "partnerships": len(partnerships_samples),
                "locations": len(locations_samples),
                "regulatory_info": len(regulatory_samples)
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to initialize data: {str(e)}")

# Dashboard Analytics API
@api_router.get("/dashboard-analytics")
async def get_dashboard_analytics():
    """Get comprehensive analytics for dashboard"""
    
    # Get counts from collections
    market_data_count = await db.market_data.count_documents({})
    locations_count = await db.locations.count_documents({})
    competitors_count = await db.competitors.count_documents({})
    suppliers_count = await db.suppliers.count_documents({})
    partnerships_count = await db.partnerships.count_documents({})
    
    # Get recent data
    recent_locations = await db.locations.find().sort("created_at", -1).limit(5).to_list(5)
    recent_partnerships = await db.partnerships.find().sort("created_at", -1).limit(5).to_list(5)
    
    analytics = {
        "overview": {
            "market_research_entries": market_data_count,
            "analyzed_locations": locations_count,
            "tracked_competitors": competitors_count,
            "supplier_database": suppliers_count,
            "active_partnerships": partnerships_count
        },
        "recent_activity": {
            "latest_locations": recent_locations,
            "latest_partnerships": recent_partnerships
        },
        "key_metrics": {
            "bangalore_market_size": "₹850 Crores",
            "projected_growth": "35% annually",
            "investment_needed": "₹5-15 Lakhs per station",
            "roi_potential": "15-25% annually"
        },
        "quick_insights": [
            "Bangalore has 450+ existing charging stations with demand for 1000+",
            "Metro station partnerships offer highest ROI potential",
            "China imports can reduce costs by 60-70%",
            "Fast charging (30-150kW) preferred by 78% users"
        ]
    }
    
    return analytics

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()