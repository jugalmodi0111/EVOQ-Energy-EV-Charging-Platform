import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import "./App.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Dashboard Component
const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardAnalytics();
  }, []);

  const fetchDashboardAnalytics = async () => {
    try {
      const response = await axios.get(`${API}/dashboard-analytics`);
      setAnalytics(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard analytics:", error);
      setLoading(false);
    }
  };

  const initializeSampleData = async () => {
    try {
      setLoading(true);
      await axios.post(`${API}/initialize-sample-data`);
      await fetchDashboardAnalytics();
    } catch (error) {
      console.error("Error initializing sample data:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🔋 EV Charging Station Business Platform
          </h1>
          <p className="text-lg text-gray-600">
            Comprehensive business management for EV charging infrastructure
          </p>
          {!analytics && (
            <button
              onClick={initializeSampleData}
              className="mt-4 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
            >
              Initialize Sample Data
            </button>
          )}
        </div>

        {analytics && (
          <>
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Market Research</h3>
                <p className="text-3xl font-bold text-blue-600">
                  {analytics.overview.market_research_entries}
                </p>
                <p className="text-sm text-gray-500">Cities analyzed</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Locations</h3>
                <p className="text-3xl font-bold text-green-600">
                  {analytics.overview.analyzed_locations}
                </p>
                <p className="text-sm text-gray-500">Strategic locations</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Suppliers</h3>
                <p className="text-3xl font-bold text-purple-600">
                  {analytics.overview.supplier_database}
                </p>
                <p className="text-sm text-gray-500">Verified suppliers</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Partnerships</h3>
                <p className="text-3xl font-bold text-orange-600">
                  {analytics.overview.active_partnerships}
                </p>
                <p className="text-sm text-gray-500">Active discussions</p>
              </div>
            </div>

            {/* Key Insights */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">📊 Market Insights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Key Metrics</h3>
                  <div className="space-y-2">
                    <p><strong>Bangalore Market Size:</strong> {analytics.key_metrics.bangalore_market_size}</p>
                    <p><strong>Projected Growth:</strong> {analytics.key_metrics.projected_growth}</p>
                    <p><strong>Investment per Station:</strong> {analytics.key_metrics.investment_needed}</p>
                    <p><strong>ROI Potential:</strong> {analytics.key_metrics.roi_potential}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Quick Insights</h3>
                  <ul className="space-y-1 text-sm">
                    {analytics.quick_insights.map((insight, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">📍 Recent Locations</h3>
                {analytics.recent_activity.latest_locations.map((location) => (
                  <div key={location.id} className="mb-3 p-3 bg-gray-50 rounded">
                    <h4 className="font-medium">{location.name}</h4>
                    <p className="text-sm text-gray-600">{location.address}</p>
                    <p className="text-sm text-green-600">
                      Revenue Potential: ₹{location.revenue_potential?.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">🤝 Recent Partnerships</h3>
                {analytics.recent_activity.latest_partnerships.map((partnership) => (
                  <div key={partnership.id} className="mb-3 p-3 bg-gray-50 rounded">
                    <h4 className="font-medium">{partnership.organization_name}</h4>
                    <p className="text-sm text-gray-600">{partnership.organization_type}</p>
                    <span className={`text-sm px-2 py-1 rounded ${
                      partnership.status === 'Active' ? 'bg-green-100 text-green-800' :
                      partnership.status === 'In Discussion' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {partnership.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Market Research Component
const MarketResearch = () => {
  const [marketData, setMarketData] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    fetchMarketData();
  }, []);

  const fetchMarketData = async () => {
    try {
      const response = await axios.get(`${API}/market-data`);
      setMarketData(response.data);
    } catch (error) {
      console.error("Error fetching market data:", error);
    }
  };

  const analyzeCity = async (city) => {
    try {
      const response = await axios.get(`${API}/market-analysis/${city}`);
      setAnalysis(response.data);
      setSelectedCity(city);
    } catch (error) {
      console.error("Error analyzing city:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">📈 Market Research & Analysis</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Market Data List */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Cities Database</h2>
              {marketData.map((data) => (
                <div key={data.id} className="mb-3">
                  <button
                    onClick={() => analyzeCity(data.city)}
                    className={`w-full text-left p-3 rounded transition duration-200 ${
                      selectedCity === data.city
                        ? 'bg-blue-100 border-2 border-blue-500'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <h3 className="font-medium">{data.city}</h3>
                    <p className="text-sm text-gray-600">{data.region}</p>
                    <p className="text-sm text-green-600">
                      EV Adoption: {data.ev_adoption_rate}%
                    </p>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Market Analysis */}
          {analysis && (
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">
                  Market Analysis: {analysis.city}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Market Overview</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Population:</strong> {analysis.market_data.population.toLocaleString()}</p>
                      <p><strong>EV Adoption Rate:</strong> {analysis.market_data.ev_adoption_rate}%</p>
                      <p><strong>Current Stations:</strong> {analysis.market_data.current_charging_stations}</p>
                      <p><strong>Market Size:</strong> ₹{analysis.market_data.market_size_millions} Crores</p>
                      <p><strong>Growth Rate:</strong> {analysis.market_data.growth_rate_percentage}% annually</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Market Opportunity</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Potential EV Users:</strong> {Math.round(analysis.insights.total_potential_ev_users).toLocaleString()}</p>
                      <p><strong>Stations Needed:</strong> {Math.round(analysis.insights.stations_needed)}</p>
                      <p><strong>Market Gap:</strong> {Math.round(analysis.insights.market_gap)} stations</p>
                      <p><strong>Revenue Opportunity:</strong> ₹{Math.round(analysis.insights.market_opportunity / 1000000)} Crores</p>
                      <p><strong>Competition Density:</strong> {analysis.insights.competition_density.toFixed(2)}/100K people</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">Investment Recommendation</h4>
                  <p className="text-sm text-green-700">
                    {analysis.insights.market_gap > 100 
                      ? "🟢 High Priority Market - Significant opportunity with low competition"
                      : analysis.insights.market_gap > 50
                      ? "🟡 Medium Priority Market - Moderate opportunity, plan strategically"
                      : "🔴 Saturated Market - Consider niche positioning or wait for market growth"
                    }
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Location Analysis Component
const LocationAnalysis = () => {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await axios.get(`${API}/locations`);
      setLocations(response.data);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const analyzeLocation = async (locationId) => {
    try {
      const response = await axios.get(`${API}/location-analysis/${locationId}`);
      setAnalysis(response.data);
      setSelectedLocation(locationId);
    } catch (error) {
      console.error("Error analyzing location:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">📍 Strategic Location Analysis</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Locations List */}
          <div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Available Locations</h2>
              {locations.map((location) => (
                <div key={location.id} className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{location.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${
                      location.location_type === 'Metro Station' ? 'bg-blue-100 text-blue-800' :
                      location.location_type === 'Commercial' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {location.location_type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{location.address}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                    <p><strong>Daily Traffic:</strong> {location.daily_traffic.toLocaleString()}</p>
                    <p><strong>Competition:</strong> {location.competition_within_5km} within 5km</p>
                    <p><strong>Revenue Potential:</strong> ₹{location.revenue_potential?.toLocaleString()}</p>
                    <p><strong>Installation Cost:</strong> ₹{location.installation_cost?.toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => analyzeLocation(location.id)}
                    className="w-full px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition duration-200"
                  >
                    Analyze Location
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Location Analysis */}
          {analysis && (
            <div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Location Analysis</h2>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">{analysis.location.name}</h3>
                  <p className="text-gray-600 mb-4">{analysis.location.address}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-blue-50 rounded">
                      <p className="text-2xl font-bold text-blue-600">
                        {analysis.analysis.traffic_score.toFixed(1)}
                      </p>
                      <p className="text-sm text-gray-600">Traffic Score</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded">
                      <p className="text-2xl font-bold text-green-600">
                        {analysis.analysis.competition_score.toFixed(1)}
                      </p>
                      <p className="text-sm text-gray-600">Competition Score</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded">
                      <p className="text-2xl font-bold text-purple-600">
                        {analysis.analysis.revenue_score.toFixed(1)}
                      </p>
                      <p className="text-sm text-gray-600">Revenue Score</p>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded">
                      <p className="text-2xl font-bold text-orange-600">
                        {analysis.analysis.overall_score.toFixed(1)}
                      </p>
                      <p className="text-sm text-gray-600">Overall Score</p>
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg ${
                    analysis.analysis.recommendation === 'High Priority' ? 'bg-green-100 text-green-800' :
                    analysis.analysis.recommendation === 'Medium Priority' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    <h4 className="font-medium mb-1">Recommendation: {analysis.analysis.recommendation}</h4>
                    <p className="text-sm">
                      {analysis.analysis.recommendation === 'High Priority' && "Excellent location with high potential. Recommend immediate action."}
                      {analysis.analysis.recommendation === 'Medium Priority' && "Good location but requires strategic planning. Monitor market conditions."}
                      {analysis.analysis.recommendation === 'Low Priority' && "Consider other locations first or wait for market improvements."}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Location Details</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Expected Daily Users:</strong> {analysis.location.expected_daily_usage}</p>
                    <p><strong>Nearby Amenities:</strong> {analysis.location.nearby_amenities.join(", ")}</p>
                    <p><strong>Partnership Opportunity:</strong> {analysis.location.partnership_opportunity ? "Yes" : "No"}</p>
                    {analysis.location.contact_info && (
                      <p><strong>Contact:</strong> {analysis.location.contact_info}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Financial Planning Component  
const FinancialPlanning = () => {
  const [models, setModels] = useState([]);
  const [roiCalculation, setRoiCalculation] = useState(null);
  const [calculatorInputs, setCalculatorInputs] = useState({
    investment: 1000000,
    dailyUsers: 50,
    pricePerKwh: 18,
    avgChargingKwh: 15,
    monthlyCosts: 150000
  });

  useEffect(() => {
    fetchFinancialModels();
  }, []);

  const fetchFinancialModels = async () => {
    try {
      const response = await axios.get(`${API}/financial-models`);
      setModels(response.data);
    } catch (error) {
      console.error("Error fetching financial models:", error);
    }
  };

  const calculateROI = async () => {
    try {
      const response = await axios.get(`${API}/roi-calculator`, {
        params: calculatorInputs
      });
      setRoiCalculation(response.data);
    } catch (error) {
      console.error("Error calculating ROI:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">💰 Financial Planning & ROI Analysis</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ROI Calculator */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">ROI Calculator</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Initial Investment (₹)
                </label>
                <input
                  type="number"
                  value={calculatorInputs.investment}
                  onChange={(e) => setCalculatorInputs({...calculatorInputs, investment: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expected Daily Users
                </label>
                <input
                  type="number"
                  value={calculatorInputs.dailyUsers}
                  onChange={(e) => setCalculatorInputs({...calculatorInputs, dailyUsers: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price per kWh (₹)
                </label>
                <input
                  type="number"
                  value={calculatorInputs.pricePerKwh}
                  onChange={(e) => setCalculatorInputs({...calculatorInputs, pricePerKwh: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Average Charging (kWh per session)
                </label>
                <input
                  type="number"
                  value={calculatorInputs.avgChargingKwh}
                  onChange={(e) => setCalculatorInputs({...calculatorInputs, avgChargingKwh: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly Operating Costs (₹)
                </label>
                <input
                  type="number"
                  value={calculatorInputs.monthlyCosts}
                  onChange={(e) => setCalculatorInputs({...calculatorInputs, monthlyCosts: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <button
                onClick={calculateROI}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
              >
                Calculate ROI
              </button>
            </div>
          </div>

          {/* ROI Results */}
          {roiCalculation && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">ROI Analysis Results</h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2">Revenue Projections</h3>
                  <p className="text-sm"><strong>Monthly Revenue:</strong> ₹{roiCalculation.monthly_revenue.toLocaleString()}</p>
                  <p className="text-sm"><strong>Annual Revenue:</strong> ₹{(roiCalculation.monthly_revenue * 12).toLocaleString()}</p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-medium text-green-800 mb-2">Profitability</h3>
                  <p className="text-sm"><strong>Monthly Profit:</strong> ₹{roiCalculation.monthly_profit.toLocaleString()}</p>
                  <p className="text-sm"><strong>Annual Profit:</strong> ₹{roiCalculation.annual_profit.toLocaleString()}</p>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-medium text-purple-800 mb-2">ROI Metrics</h3>
                  <p className="text-sm"><strong>ROI:</strong> {roiCalculation.roi_percentage.toFixed(1)}% per year</p>
                  <p className="text-sm"><strong>Break-even:</strong> {roiCalculation.break_even_months.toFixed(1)} months</p>
                  <p className="text-sm"><strong>Payback Period:</strong> {roiCalculation.payback_period_years.toFixed(1)} years</p>
                </div>
                
                <div className={`p-4 rounded-lg ${
                  roiCalculation.roi_percentage > 20 ? 'bg-green-100 text-green-800' :
                  roiCalculation.roi_percentage > 15 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  <h4 className="font-medium mb-1">Investment Recommendation</h4>
                  <p className="text-sm">
                    {roiCalculation.roi_percentage > 20 && "🟢 Excellent ROI - Highly recommended investment"}
                    {roiCalculation.roi_percentage > 15 && roiCalculation.roi_percentage <= 20 && "🟡 Good ROI - Solid investment opportunity"}
                    {roiCalculation.roi_percentage <= 15 && "🔴 Low ROI - Consider optimizing costs or pricing"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Existing Financial Models */}
        {models.length > 0 && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Saved Financial Models</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {models.map((model) => (
                <div key={model.id} className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium mb-2">{model.scenario_name}</h3>
                  <div className="text-sm space-y-1">
                    <p><strong>Investment:</strong> ₹{model.initial_investment.toLocaleString()}</p>
                    <p><strong>ROI:</strong> {model.roi_percentage.toFixed(1)}%</p>
                    <p><strong>Break-even:</strong> {model.break_even_months} months</p>
                    <p><strong>Daily Users:</strong> {model.expected_daily_users}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Competitor Analysis Component
const CompetitorAnalysis = () => {
  const [competitors, setCompetitors] = useState([]);
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    fetchCompetitors();
    fetchCompetitorAnalysis();
  }, []);

  const fetchCompetitors = async () => {
    try {
      const response = await axios.get(`${API}/competitors`);
      setCompetitors(response.data);
    } catch (error) {
      console.error("Error fetching competitors:", error);
    }
  };

  const fetchCompetitorAnalysis = async () => {
    try {
      const response = await axios.get(`${API}/competitor-analysis`);
      setAnalysis(response.data);
    } catch (error) {
      console.error("Error fetching competitor analysis:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">🏢 Competitor Analysis</h1>
        
        {analysis && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Competitors</h3>
              <p className="text-3xl font-bold text-red-600">{analysis.total_competitors}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Market Share Available</h3>
              <p className="text-3xl font-bold text-green-600">{analysis.market_share_available}%</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Avg Market Price</h3>
              <p className="text-3xl font-bold text-blue-600">₹{analysis.average_market_price}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Suggested Price</h3>
              <p className="text-3xl font-bold text-purple-600">₹{analysis.pricing_insights?.suggested_competitive_price}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Competitors List */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Major Competitors</h2>
            {competitors.map((competitor) => (
              <div key={competitor.id} className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{competitor.company_name}</h3>
                  <span className="text-sm text-blue-600 font-medium">
                    {competitor.market_share_percentage}% market share
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{competitor.business_model}</p>
                <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                  <p><strong>Stations:</strong> {competitor.charging_stations_count}</p>
                  <p><strong>Price/kWh:</strong> ₹{competitor.average_price_per_kwh}</p>
                </div>
                <div className="mb-2">
                  <p className="text-xs font-medium text-green-700">Strengths:</p>
                  <p className="text-xs text-gray-600">{competitor.strengths?.join(", ")}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-red-700">Weaknesses:</p>
                  <p className="text-xs text-gray-600">{competitor.weaknesses?.join(", ")}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Analysis */}
          {analysis && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Market Pricing Analysis</h2>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2">Price Range</h3>
                  <p className="text-sm">Min: ₹{analysis.pricing_insights?.min_price}/kWh</p>
                  <p className="text-sm">Max: ₹{analysis.pricing_insights?.max_price}/kWh</p>
                  <p className="text-sm">Average: ₹{analysis.average_market_price}/kWh</p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-medium text-green-800 mb-2">Competitive Strategy</h3>
                  <p className="text-sm">
                    <strong>Recommended Price:</strong> ₹{analysis.pricing_insights?.suggested_competitive_price}/kWh
                  </p>
                  <p className="text-xs text-green-700 mt-1">
                    5% below market average for competitive advantage
                  </p>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h3 className="font-medium text-yellow-800 mb-2">Market Opportunity</h3>
                  <p className="text-sm">Available market share: {analysis.market_share_available}%</p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Focus on underserved areas and superior customer service
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Supplier Management Component
const SupplierManagement = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    fetchSuppliers();
    fetchSupplierAnalysis();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get(`${API}/suppliers`);
      setSuppliers(response.data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  const fetchSupplierAnalysis = async () => {
    try {
      const response = await axios.get(`${API}/supplier-analysis`);
      setAnalysis(response.data);
    } catch (error) {
      console.error("Error fetching supplier analysis:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">🏭 Supplier Management</h1>
        
        {analysis && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Suppliers</h3>
              <p className="text-3xl font-bold text-blue-600">{analysis.total_suppliers}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">China Suppliers</h3>
              <p className="text-3xl font-bold text-red-600">{analysis.china_suppliers}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Avg Price/Unit</h3>
              <p className="text-3xl font-bold text-green-600">₹{Math.round(analysis.average_price_per_unit).toLocaleString()}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibent text-gray-700 mb-2">Avg Quality</h3>
              <p className="text-3xl font-bold text-purple-600">{analysis.average_quality_rating?.toFixed(1)}/10</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Suppliers List */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Supplier Database</h2>
            {suppliers.map((supplier) => (
              <div key={supplier.id} className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{supplier.company_name}</h3>
                  <span className={`px-2 py-1 rounded text-xs ${
                    supplier.country === 'China' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {supplier.country}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                  <p><strong>Contact:</strong> {supplier.contact_person}</p>
                  <p><strong>Email:</strong> {supplier.email}</p>
                  <p><strong>Price/Unit:</strong> ₹{supplier.price_per_unit?.toLocaleString()}</p>
                  <p><strong>Quality:</strong> {supplier.quality_rating}/10</p>
                  <p><strong>MOQ:</strong> {supplier.min_order_quantity} units</p>
                  <p><strong>Lead Time:</strong> {supplier.lead_time_days} days</p>
                </div>
                <div className="mb-2">
                  <p className="text-xs font-medium">Products:</p>
                  <p className="text-xs text-gray-600">{supplier.product_types?.join(", ")}</p>
                </div>
                <div className="mb-2">
                  <p className="text-xs font-medium">Certifications:</p>
                  <p className="text-xs text-gray-600">{supplier.certifications?.join(", ")}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Cost Analysis */}
          {analysis && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Cost Analysis</h2>
              <div className="space-y-4">
                <div className="p-4 bg-red-50 rounded-lg">
                  <h3 className="font-medium text-red-800 mb-2">China Import Strategy</h3>
                  <p className="text-sm mb-2">{analysis.cost_savings_potential?.china_vs_others}</p>
                  <p className="text-sm">{analysis.cost_savings_potential?.bulk_order_savings}</p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-medium text-green-800 mb-2">Best Value Suppliers</h3>
                  {analysis.best_value_suppliers?.slice(0, 3).map((supplier, index) => (
                    <div key={supplier.id} className="mb-2 p-2 bg-white rounded text-xs">
                      <p className="font-medium">{supplier.company_name}</p>
                      <p>Quality: {supplier.quality_rating}/10 | Price: ₹{supplier.price_per_unit?.toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2">Import Planning</h3>
                  <div className="text-sm space-y-1">
                    <p><strong>Phase 1 (0-6 months):</strong> Import 100 units from top 2 suppliers</p>
                    <p><strong>Phase 2 (6-18 months):</strong> Scale to 500 units, negotiate better rates</p>
                    <p><strong>Phase 3 (18+ months):</strong> Consider local manufacturing setup</p>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-medium text-purple-800 mb-2">Risk Mitigation</h3>
                  <ul className="text-xs space-y-1">
                    <li>• Diversify across 3-4 suppliers</li>
                    <li>• Maintain 2-month inventory buffer</li>
                    <li>• Negotiate payment terms (30% advance)</li>
                    <li>• Verify certifications (BIS, CE, FCC)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Partnership Management Component
const PartnershipManagement = () => {
  const [partnerships, setPartnerships] = useState([]);

  useEffect(() => {
    fetchPartnerships();
  }, []);

  const fetchPartnerships = async () => {
    try {
      const response = await axios.get(`${API}/partnerships`);
      setPartnerships(response.data);
    } catch (error) {
      console.error("Error fetching partnerships:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Signed': return 'bg-blue-100 text-blue-800';
      case 'In Discussion': return 'bg-yellow-100 text-yellow-800';
      case 'Negotiating': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">🤝 Partnership Management</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Partnership Pipeline */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Partnership Pipeline</h2>
            {partnerships.map((partnership) => (
              <div key={partnership.id} className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{partnership.organization_name}</h3>
                  <span className={`px-2 py-1 rounded text-xs ${getStatusColor(partnership.status)}`}>
                    {partnership.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{partnership.organization_type}</p>
                <div className="text-sm mb-2">
                  <p><strong>Partnership Type:</strong> {partnership.partnership_type}</p>
                  <p><strong>Revenue Model:</strong> {partnership.revenue_sharing_model}</p>
                </div>
                <div className="mb-2">
                  <p className="text-xs font-medium">Potential Locations:</p>
                  <p className="text-xs text-gray-600">{partnership.potential_locations?.join(", ")}</p>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <p><strong>Contact:</strong> {partnership.contact_person}</p>
                  <p>{partnership.email}</p>
                </div>
                {partnership.notes && (
                  <p className="text-xs text-blue-600 mt-1 italic">{partnership.notes}</p>
                )}
              </div>
            ))}
          </div>

          {/* Partnership Strategy */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Metro Station Strategy</h2>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2">BMRCL Partnership</h3>
                  <p className="text-sm mb-2">Target: 25 metro stations across Bangalore</p>
                  <p className="text-sm mb-2"><strong>Revenue Model:</strong> 70-30 split</p>
                  <p className="text-sm"><strong>Investment per station:</strong> ₹8-12 Lakhs</p>
                  <p className="text-sm"><strong>Expected ROI:</strong> 22-28% annually</p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-medium text-green-800 mb-2">Priority Stations</h3>
                  <ul className="text-sm space-y-1">
                    <li>• MG Road (15K+ daily footfall)</li>
                    <li>• Brigade Road (12K+ daily footfall)</li>
                    <li>• Whitefield (18K+ daily footfall)</li>
                    <li>• Electronic City (25K+ daily footfall)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Commercial Partnerships</h2>
              <div className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-medium text-purple-800 mb-2">Shopping Malls</h3>
                  <p className="text-sm mb-1"><strong>Target:</strong> Forum, Phoenix, UB City Mall</p>
                  <p className="text-sm mb-1"><strong>Model:</strong> Fixed rent + revenue share</p>
                  <p className="text-sm"><strong>Benefit:</strong> High dwell time, premium customers</p>
                </div>
                
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h3 className="font-medium text-orange-800 mb-2">IT Parks & Offices</h3>
                  <p className="text-sm mb-1"><strong>Target:</strong> Manyata, EGL, Prestige Tech Parks</p>
                  <p className="text-sm mb-1"><strong>Model:</strong> Employee charging programs</p>
                  <p className="text-sm"><strong>Benefit:</strong> Predictable usage, corporate rates</p>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h3 className="font-medium text-yellow-800 mb-2">Hotels & Restaurants</h3>
                  <p className="text-sm mb-1"><strong>Target:</strong> Taj, ITC, Premium restaurants</p>
                  <p className="text-sm mb-1"><strong>Model:</strong> Hospitality charging service</p>
                  <p className="text-sm"><strong>Benefit:</strong> Premium pricing, value-added service</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Business Plan Generator Component
const BusinessPlanGenerator = () => {
  const [businessPlans, setBusinessPlans] = useState([]);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [planInputs, setPlanInputs] = useState({
    targetCity: 'Bangalore',
    investmentBudget: 50000000,
    timelineMonths: 24,
    targetStations: 25
  });

  useEffect(() => {
    fetchBusinessPlans();
  }, []);

  const fetchBusinessPlans = async () => {
    try {
      const response = await axios.get(`${API}/business-plans`);
      setBusinessPlans(response.data);
    } catch (error) {
      console.error("Error fetching business plans:", error);
    }
  };

  const generateBusinessPlan = async () => {
    try {
      setGenerating(true);
      const response = await axios.post(`${API}/generate-business-plan`, planInputs);
      setGeneratedPlan(response.data);
      setGenerating(false);
    } catch (error) {
      console.error("Error generating business plan:", error);
      setGenerating(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">📋 Business Plan Generator</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Plan Generator */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Generate New Plan</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target City
                  </label>
                  <select
                    value={planInputs.targetCity}
                    onChange={(e) => setPlanInputs({...planInputs, targetCity: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Bangalore">Bangalore</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Pune">Pune</option>
                    <option value="Chennai">Chennai</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Investment Budget (₹)
                  </label>
                  <input
                    type="number"
                    value={planInputs.investmentBudget}
                    onChange={(e) => setPlanInputs({...planInputs, investmentBudget: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Timeline (months)
                  </label>
                  <input
                    type="number"
                    value={planInputs.timelineMonths}
                    onChange={(e) => setPlanInputs({...planInputs, timelineMonths: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Stations
                  </label>
                  <input
                    type="number"
                    value={planInputs.targetStations}
                    onChange={(e) => setPlanInputs({...planInputs, targetStations: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <button
                  onClick={generateBusinessPlan}
                  disabled={generating}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 disabled:opacity-50"
                >
                  {generating ? 'Generating...' : 'Generate Business Plan'}
                </button>
              </div>
            </div>
          </div>

          {/* Generated Plan */}
          {generatedPlan && (
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">{generatedPlan.plan_name}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Investment Overview</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Total Investment:</strong> ₹{generatedPlan.total_investment_required.toLocaleString()}</p>
                      <p><strong>Target Stations:</strong> {generatedPlan.target_stations}</p>
                      <p><strong>Timeline:</strong> {generatedPlan.timeline_months} months</p>
                      <p><strong>Investment per Station:</strong> ₹{Math.round(generatedPlan.total_investment_required / generatedPlan.target_stations).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Revenue Projections</h3>
                    <div className="space-y-2 text-sm">
                      {Object.entries(generatedPlan.revenue_projections).map(([year, revenue]) => (
                        <p key={year}>
                          <strong>{year.replace('_', ' ').toUpperCase()}:</strong> ₹{Math.round(revenue).toLocaleString()}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                {generatedPlan.market_insights && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-medium text-blue-800 mb-2">Market Insights</h3>
                    <div className="text-sm space-y-1">
                      <p><strong>Market Size:</strong> ₹{generatedPlan.market_insights.market_size} Crores</p>
                      <p><strong>Growth Rate:</strong> {generatedPlan.market_insights.growth_rate}% annually</p>
                      <p><strong>Competition:</strong> {generatedPlan.market_insights.competition_gap}</p>
                      <p><strong>Success Probability:</strong> {generatedPlan.market_insights.success_probability}</p>
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Key Milestones</h3>
                  <div className="space-y-2">
                    {generatedPlan.key_milestones.map((milestone, index) => (
                      <div key={index} className="flex items-center p-2 bg-gray-50 rounded">
                        <span className="w-16 text-sm font-medium text-blue-600">
                          Month {milestone.month}
                        </span>
                        <span className="text-sm">{milestone.milestone}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2 text-red-700">Risk Factors</h3>
                    <ul className="text-sm space-y-1">
                      {generatedPlan.risk_factors.map((risk, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-red-500 mr-2">⚠</span>
                          {risk}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2 text-green-700">Mitigation Strategies</h3>
                    <ul className="text-sm space-y-1">
                      {generatedPlan.mitigation_strategies.map((strategy, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-2">✓</span>
                          {strategy}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Saved Business Plans */}
        {businessPlans.length > 0 && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Saved Business Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {businessPlans.map((plan) => (
                <div key={plan.id} className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium mb-2">{plan.plan_name}</h3>
                  <div className="text-sm space-y-1">
                    <p><strong>Region:</strong> {plan.target_region}</p>
                    <p><strong>Investment:</strong> ₹{plan.total_investment_required?.toLocaleString()}</p>
                    <p><strong>Timeline:</strong> {plan.timeline_months} months</p>
                    <p><strong>Stations:</strong> {plan.target_stations}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Regulatory Compliance Component
const RegulatoryCompliance = () => {
  const [regulations, setRegulations] = useState([]);
  const [complianceData, setComplianceData] = useState(null);
  const [selectedState, setSelectedState] = useState('Karnataka');

  useEffect(() => {
    fetchRegulations();
    fetchCompliance(selectedState);
  }, []);

  const fetchRegulations = async () => {
    try {
      const response = await axios.get(`${API}/regulatory-info`);
      setRegulations(response.data);
    } catch (error) {
      console.error("Error fetching regulations:", error);
    }
  };

  const fetchCompliance = async (state) => {
    try {
      const response = await axios.get(`${API}/regulatory-compliance/${state}`);
      setComplianceData(response.data);
    } catch (error) {
      console.error("Error fetching compliance data:", error);
    }
  };

  const handleStateChange = (state) => {
    setSelectedState(state);
    fetchCompliance(state);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">⚖️ Regulatory Compliance</h1>
        
        <div className="mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-3">Select State/Region</h2>
            <div className="flex flex-wrap gap-2">
              {['Karnataka', 'Maharashtra', 'Delhi', 'Tamil Nadu', 'Gujarat'].map((state) => (
                <button
                  key={state}
                  onClick={() => handleStateChange(state)}
                  className={`px-4 py-2 rounded transition duration-200 ${
                    selectedState === state
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {state}
                </button>
              ))}
            </div>
          </div>
        </div>

        {complianceData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Compliance Overview */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Compliance Overview - {complianceData.state}</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-blue-50 rounded">
                  <p className="text-2xl font-bold text-blue-600">{complianceData.total_requirements}</p>
                  <p className="text-sm text-gray-600">Requirements</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded">
                  <p className="text-2xl font-bold text-green-600">₹{complianceData.total_fees?.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Total Fees</p>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded">
                  <p className="text-2xl font-bold text-orange-600">{complianceData.max_processing_time_days}</p>
                  <p className="text-sm text-gray-600">Processing Days</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded">
                  <p className="text-2xl font-bold text-purple-600">6</p>
                  <p className="text-sm text-gray-600">Steps</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Compliance Checklist</h3>
                <div className="space-y-2">
                  {complianceData.compliance_checklist?.map((item, index) => (
                    <div key={index} className="flex items-center p-2 bg-gray-50 rounded">
                      <input type="checkbox" className="mr-3" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Detailed Requirements */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Detailed Requirements</h2>
              
              {complianceData.requirements?.map((req, index) => (
                <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium mb-2">{req.regulation_type}</h3>
                  <p className="text-sm text-gray-600 mb-2">{req.description}</p>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                    <p><strong>Fee:</strong> ₹{req.fees_applicable?.toLocaleString()}</p>
                    <p><strong>Processing:</strong> {req.processing_time_days} days</p>
                    <p><strong>Authority:</strong> {req.authority}</p>
                  </div>
                  
                  <div className="mb-2">
                    <p className="text-xs font-medium text-blue-700">Required Documents:</p>
                    <ul className="text-xs text-gray-600 ml-4">
                      {req.required_documents?.map((doc, docIndex) => (
                        <li key={docIndex} className="list-disc">{doc}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <p className="text-xs font-medium text-green-700">Compliance Requirements:</p>
                    <ul className="text-xs text-gray-600 ml-4">
                      {req.compliance_requirements?.map((comp, compIndex) => (
                        <li key={compIndex} className="list-disc">{comp}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Implementation Timeline */}
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">🗓️ Implementation Timeline</h2>
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-blue-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">1</div>
              <div className="flex-1">
                <h3 className="font-medium">Business Registration & Initial Setup</h3>
                <p className="text-sm text-gray-600">Register business, obtain PAN, GST registration</p>
                <p className="text-xs text-blue-600">Timeline: 7-14 days | Cost: ₹15,000-₹25,000</p>
              </div>
            </div>
            
            <div className="flex items-center p-4 bg-green-50 rounded-lg">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">2</div>
              <div className="flex-1">
                <h3 className="font-medium">Technical Certifications</h3>
                <p className="text-sm text-gray-600">Obtain electrical contractor license and technical safety certifications</p>
                <p className="text-xs text-green-600">Timeline: 15-30 days | Cost: ₹35,000-₹50,000</p>
              </div>
            </div>
            
            <div className="flex items-center p-4 bg-yellow-50 rounded-lg">
              <div className="w-8 h-8 bg-yellow-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">3</div>
              <div className="flex-1">
                <h3 className="font-medium">Environmental & Safety Clearances</h3>
                <p className="text-sm text-gray-600">Environmental impact assessment and fire safety certificate</p>
                <p className="text-xs text-yellow-600">Timeline: 20-35 days | Cost: ₹40,000-₹60,000</p>
              </div>
            </div>
            
            <div className="flex items-center p-4 bg-purple-50 rounded-lg">
              <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">4</div>
              <div className="flex-1">
                <h3 className="font-medium">EV Charging Station License</h3>
                <p className="text-sm text-gray-600">Apply for and obtain the main operating license</p>
                <p className="text-xs text-purple-600">Timeline: 30-45 days | Cost: ₹25,000-₹35,000</p>
              </div>
            </div>
            
            <div className="flex items-center p-4 bg-red-50 rounded-lg">
              <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">5</div>
              <div className="flex-1">
                <h3 className="font-medium">Site Preparation & Installation</h3>
                <p className="text-sm text-gray-600">Prepare site, install equipment, final inspections</p>
                <p className="text-xs text-red-600">Timeline: 15-25 days | Cost: Variable by location</p>
              </div>
            </div>
            
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-gray-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">6</div>
              <div className="flex-1">
                <h3 className="font-medium">Launch & Operations</h3>
                <p className="text-sm text-gray-600">Final approvals, soft launch, full operations</p>
                <p className="text-xs text-gray-600">Timeline: 5-10 days | Ongoing operational costs</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-green-100 rounded-lg">
            <h3 className="font-medium text-green-800 mb-2">📋 Total Compliance Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <p><strong>Total Timeline:</strong> 3-5 months</p>
              <p><strong>Total Cost:</strong> ₹1.2-2.2 Lakhs</p>
              <p><strong>Success Rate:</strong> 95% with proper documentation</p>
            </div>
          </div>
        </div>

        {/* Expert Tips */}
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">💡 Expert Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-blue-800 mb-2">🚀 Acceleration Tips</h3>
              <ul className="text-sm space-y-1">
                <li>• Hire a regulatory consultant for faster processing</li>
                <li>• Apply for multiple permits simultaneously where possible</li>
                <li>• Maintain digital copies of all documents</li>
                <li>• Build relationships with regulatory authorities</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-red-800 mb-2">⚠️ Common Pitfalls</h3>
              <ul className="text-sm space-y-1">
                <li>• Incomplete technical specifications</li>
                <li>• Missing environmental impact assessments</li>
                <li>• Incorrect electrical safety certifications</li>
                <li>• Delayed renewal applications</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Implementation Roadmap Component
const ImplementationRoadmap = () => {
  const [currentPhase, setCurrentPhase] = useState(0);
  
  const phases = [
    {
      title: "Phase 1: Research & Planning (Months 1-6)",
      status: "active",
      tasks: [
        { task: "Complete comprehensive market research", status: "completed", timeline: "Month 1" },
        { task: "Analyze competitor landscape", status: "completed", timeline: "Month 1" },
        { task: "Identify strategic locations", status: "in-progress", timeline: "Month 2" },
        { task: "Build supplier database (China focus)", status: "pending", timeline: "Month 3" },
        { task: "Secure initial partnerships (Metro/Malls)", status: "pending", timeline: "Month 4-5" },
        { task: "Develop detailed business plan", status: "pending", timeline: "Month 6" }
      ]
    },
    {
      title: "Phase 2: Regulatory & Financial Setup (Months 7-12)",
      status: "upcoming",
      tasks: [
        { task: "Complete regulatory compliance (Karnataka)", status: "pending", timeline: "Month 7-9" },
        { task: "Secure funding/investors", status: "pending", timeline: "Month 8-10" },
        { task: "Finalize supplier contracts (China)", status: "pending", timeline: "Month 9" },
        { task: "Import first batch of chargers", status: "pending", timeline: "Month 11" },
        { task: "Setup operations infrastructure", status: "pending", timeline: "Month 12" }
      ]
    },
    {
      title: "Phase 3: Market Entry (Months 13-18)",
      status: "upcoming",
      tasks: [
        { task: "Launch first 5 charging stations", status: "pending", timeline: "Month 13-14" },
        { task: "Establish metro station partnerships", status: "pending", timeline: "Month 15" },
        { task: "Scale to 15 stations across Bangalore", status: "pending", timeline: "Month 16-17" },
        { task: "Develop customer acquisition strategy", status: "pending", timeline: "Month 18" },
        { task: "Optimize operations and pricing", status: "pending", timeline: "Month 18" }
      ]
    },
    {
      title: "Phase 4: Expansion (Months 19-24)",
      status: "upcoming",
      tasks: [
        { task: "Expand to 25+ stations in Bangalore", status: "pending", timeline: "Month 19-20" },
        { task: "Enter Tier-2 cities (Mysore, Mangalore)", status: "pending", timeline: "Month 21" },
        { task: "Setup manufacturing partnerships in India", status: "pending", timeline: "Month 22" },
        { task: "Launch corporate partnership program", status: "pending", timeline: "Month 23" },
        { task: "Prepare for interstate expansion", status: "pending", timeline: "Month 24" }
      ]
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-600';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'upcoming': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">🗺️ Implementation Roadmap</h1>
        
        {/* Phase Overview */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">24-Month Implementation Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {phases.map((phase, index) => (
              <button
                key={index}
                onClick={() => setCurrentPhase(index)}
                className={`p-4 rounded-lg text-left transition duration-200 ${
                  currentPhase === index ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <h3 className="font-medium text-sm mb-2">{phase.title}</h3>
                <span className={`px-2 py-1 rounded text-xs ${getStatusColor(phase.status)}`}>
                  {phase.status}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Detailed Phase View */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">{phases[currentPhase].title}</h2>
          
          <div className="space-y-3">
            {phases[currentPhase].tasks.map((task, index) => (
              <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className={`w-4 h-4 rounded-full mr-4 ${
                  task.status === 'completed' ? 'bg-green-500' :
                  task.status === 'in-progress' ? 'bg-yellow-500' :
                  'bg-gray-300'
                }`}></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{task.task}</p>
                  <p className="text-sm text-gray-600">{task.timeline}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Metrics & Milestones */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">📈 Key Milestones</h2>
            <div className="space-y-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <h3 className="font-medium text-green-800">Month 6: Business Plan Complete</h3>
                <p className="text-sm text-green-700">✓ Market research, partnerships identified, funding strategy</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-800">Month 12: First Stations Ready</h3>
                <p className="text-sm text-blue-700">Regulatory approval, equipment imported, operations setup</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <h3 className="font-medium text-purple-800">Month 18: Market Established</h3>
                <p className="text-sm text-purple-700">15+ stations operational, brand recognition, cash flow positive</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <h3 className="font-medium text-orange-800">Month 24: Ready for Scale</h3>
                <p className="text-sm text-orange-700">25+ stations, manufacturing setup, interstate expansion ready</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">💰 Investment Timeline</h2>
            <div className="space-y-4">
              <div className="p-3 bg-red-50 rounded-lg">
                <h3 className="font-medium text-red-800">Months 1-6: ₹25 Lakhs</h3>
                <p className="text-sm text-red-700">Research, planning, regulatory setup, initial partnerships</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <h3 className="font-medium text-yellow-800">Months 7-12: ₹2.5 Crores</h3>
                <p className="text-sm text-yellow-700">Equipment procurement, site setup, first installations</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <h3 className="font-medium text-green-800">Months 13-18: ₹3.5 Crores</h3>
                <p className="text-sm text-green-700">Scale to 15 stations, working capital, marketing</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-800">Months 19-24: ₹4 Crores</h3>
                <p className="text-sm text-blue-700">Expansion to 25+ stations, manufacturing setup</p>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-gray-100 rounded-lg">
              <h3 className="font-medium text-gray-800">Total Investment: ₹10.5 Crores</h3>
              <p className="text-sm text-gray-600">Expected ROI: 25-30% annually from Month 18+</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component with Navigation
function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const navigation = [
    { id: 'dashboard', name: '📊 Dashboard', component: Dashboard },
    { id: 'market-research', name: '📈 Market Research', component: MarketResearch },
    { id: 'location-analysis', name: '📍 Location Analysis', component: LocationAnalysis },
    { id: 'financial-planning', name: '💰 Financial Planning', component: FinancialPlanning },
    { id: 'competitor-analysis', name: '🏢 Competitors', component: CompetitorAnalysis },
    { id: 'supplier-management', name: '🏭 Suppliers', component: SupplierManagement },
    { id: 'partnership-management', name: '🤝 Partnerships', component: PartnershipManagement },
    { id: 'business-plan-generator', name: '📋 Business Plans', component: BusinessPlanGenerator },
    { id: 'regulatory-compliance', name: '⚖️ Regulatory', component: RegulatoryCompliance },
    { id: 'implementation-roadmap', name: '🗺️ Roadmap', component: ImplementationRoadmap }
  ];

  const CurrentComponent = navigation.find(nav => nav.id === currentPage)?.component || Dashboard;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-gray-900">EV Business Platform</h1>
              <div className="flex space-x-1">
                {navigation.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentPage(item.id)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition duration-200 ${
                      currentPage === item.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <CurrentComponent />
    </div>
  );
}

export default App;