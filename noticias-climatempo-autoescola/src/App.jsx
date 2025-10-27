import React, { useState, useEffect } from "react";
// Componentes de UI
import { Card, CardContent, CardHeader, CardTitle } from "./components/Card";
import { Badge } from "./components/Badge"
//import { useCharset } from "./useCharset";
import { InteractiveButton } from "./components/InteractiveButton";

// Ícones
import {
	Cloud,
	Sun,
	CloudRain,
	Wind,
	Droplets,
	Thermometer,
	Eye,
	Gauge,
	MapPin,
	Calendar,
	Search, // Ícone para a busca
	Moon, // Ícone para noite
	CloudLightning, // Ícone para tempestade
	Snowflake, // Ícone para neve
	CloudFog, // Ícone para névoa
	AlertCircle, // Ícone de erro
} from "lucide-react";

// --- CONFIGURAÇÃO DA API ---
// Usando a chave que você forneceu
const API_KEY = "a20a6eac94fbbb7f3cafade4a7717db0";

// Endpoints da API Gratuita
const GEO_API_URL = "https://api.openweathermap.org/geo/1.0/direct";
const CURRENT_WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_API_URL = "https://api.openweathermap.org/data/2.5/forecast";

// --- COMPONENTES INTERNOS ---

/**
 * Função auxiliar para renderizar o ícone do clima com base no código da API
 */
const getWeatherIcon = (iconCode, size = "w-10 h-10") => {
	switch (iconCode) {
		case "01d":
			return <Sun className={`${size} text-yellow-500`} />;
		case "01n":
			return <Moon className={`${size} text-gray-400`} />;
		case "02d":
			return <Sun className={`${size} text-yellow-500`} />; // Poucas nuvens (dia)
		case "02n":
			return <Moon className={`${size} text-gray-400`} />; // Poucas nuvens (noite)
		case "03d":
		case "03n":
		case "04d":
		case "04n":
			return <Cloud className={`${size} text-gray-400`} />; // Nublado
		case "09d":
		case "09n":
		case "10d":
		case "10n":
			return <CloudRain className={`${size} text-blue-500`} />; // Chuva
		case "11d":
		case "11n":
			return <CloudLightning className={`${size} text-yellow-600`} />; // Tempestade
		case "13d":
		case "13n":
			return <Snowflake className={`${size} text-blue-300`} />; // Neve
		case "50d":
		case "50n":
			return <CloudFog className={`${size} text-gray-500`} />; // Névoa
		default:
			return <Cloud className={`${size} text-gray-400`} />;
	}
};

/**
 * Componente para o Clima Atual
 */
const CurrentWeather = ({ data, todayForecast }) => (
	<Card className="shadow-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-3xl overflow-hidden">
		<CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
			<div className="flex flex-col items-center md:items-start text-center md:text-left">
				<Badge className="mb-2 bg-white/30 text-white backdrop-blur-sm border-0 shadow capitalize">
					{data.condition}
				</Badge>
				<h2 className="text-8xl font-bold">{data.temperature}°</h2>
				<p className="text-xl font-light">sensação {data.feelsLike}°</p>
				<p className="text-lg mt-1">
					Máx: {todayForecast.high}° / Mín: {todayForecast.low}°
				</p>
			</div>
			<div className="flex-shrink-0">
				{getWeatherIcon(data.icon, "w-32 h-32")}
			</div>
		</CardContent>
	</Card>
);

/**
 * Componente auxiliar para os Detalhes
 */
const DetailItem = ({ icon, label, value, unit }) => (
	<div className="flex items-center gap-3 p-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm">
		<div className="p-2 bg-blue-100/50 rounded-lg">
			{React.cloneElement(icon, { className: "w-5 h-5 text-blue-600" })}
		</div>
		<div>
			<span className="text-sm text-gray-600">{label}</span>
			<p className="font-bold text-gray-900">
				{value} {unit}
			</p>
		</div>
	</div>
);

/**
 * Componente para Detalhes do Clima
 * --- MODIFICADO: Removido o Índice UV ---
 */
const WeatherDetails = ({ data }) => (
	<Card className="shadow-xl bg-white/70 backdrop-blur-lg rounded-3xl h-full">
		<CardHeader>
			<CardTitle className="text-xl font-semibold text-gray-800">
				Detalhes do Clima
			</CardTitle>
		</CardHeader>
		<CardContent className="grid grid-cols-2 gap-4">
			<DetailItem
				icon={<Thermometer />}
				label="Sensação"
				value={data.feelsLike}
				unit="°C"
			/>
			<DetailItem
				icon={<Droplets />}
				label="Umidade"
				value={data.humidity}
				unit="%"
			/>
			<DetailItem
				icon={<Wind />}
				label="Vento"
				value={data.windSpeed}
				unit="km/h"
			/>
			<DetailItem
				icon={<Eye />}
				label="Visibilidade"
				value={data.visibility}
				unit="km"
			/>
			<DetailItem
				icon={<Gauge />}
				label="Pressão"
				value={data.pressure}
				unit="hPa"
			/>
		</CardContent>
	</Card>
);

/**
 * Componente para Previsão Semanal
 * --- MODIFICADO: Ajustado o slice para 5 dias ---
 */
const WeeklyForecast = ({ forecast }) => (
	<Card className="shadow-xl bg-white/70 backdrop-blur-lg rounded-3xl">
		<CardHeader>
			<CardTitle className="text-xl font-semibold text-gray-800">
				Previsão para 5 dias
			</CardTitle>
		</CardHeader>
		<CardContent>
			<ul className="divide-y divide-gray-200/50">
				{/* Pula o primeiro dia (hoje) e pega os próximos 5 */}
				{forecast.slice(1, 6).map((day, index) => (
					<li
						key={index}
						className="flex flex-col sm:flex-row items-center justify-between py-3 gap-2 sm:gap-4"
					>
						<div className="flex items-center gap-3 w-full sm:w-1/3">
							{getWeatherIcon(day.icon, "w-8 h-8")}
							<div>
								<p className="font-semibold text-gray-800 capitalize">
									{day.day}
								</p>
								<p className="text-sm text-gray-600">{day.date}</p>
							</div>
						</div>
						<div className="flex items-center gap-2 text-sm text-blue-600 w-full sm:w-1/3 justify-start sm:justify-center">
							<Droplets className="w-4 h-4" />
							<span>Chuva: {day.chanceOfRain}%</span>
						</div>
						<div className="text-left sm:text-right w-full sm:w-1/3">
							<p className="font-semibold text-gray-800">
								{day.high}° / <span className="text-gray-600">{day.low}°</span>
							</p>
						</div>
					</li>
				))}
			</ul>
		</CardContent>
	</Card>
);

/**
 * --- NOVA FUNÇÃO DE TRANSFORMAÇÃO ---
 * Adapta os dados das APIs /weather e /forecast
 */
const transformWeatherData = (currentData, forecastData, geoData) => {
	// 1. Transforma o Clima Atual
	const current = {
		location: `${geoData.name}, ${geoData.country}`,
		temperature: Math.round(currentData.main.temp),
		condition: currentData.weather[0].description,
		icon: currentData.weather[0].icon,
		humidity: currentData.main.humidity,
		windSpeed: Math.round(currentData.wind.speed * 3.6), // m/s para km/h
		pressure: currentData.main.pressure,
		uvIndex: "N/A", // Não disponível na API gratuita
		visibility: Math.round(currentData.visibility / 1000), // metros para km
		feelsLike: Math.round(currentData.main.feels_like),
	};

	// 2. Transforma a Previsão (agrupando de 3h em 3h para diário)
	const dailyForecasts = {};

	forecastData.list.forEach((item) => {
		// Cria uma chave de data (ex: "25/10/2025")
		const dateKey = new Date(item.dt * 1000).toLocaleDateString("pt-BR");

		if (!dailyForecasts[dateKey]) {
			// Inicializa o dia
			dailyForecasts[dateKey] = {
				dt: item.dt,
				tempsMin: [item.main.temp_min],
				tempsMax: [item.main.temp_max],
				pops: [item.pop], // Probabilidade de precipitação
				icons: [],
				conditions: [],
			};
		}

		// Adiciona dados ao dia
		dailyForecasts[dateKey].tempsMin.push(item.main.temp_min);
		dailyForecasts[dateKey].tempsMax.push(item.main.temp_max);
		dailyForecasts[dateKey].pops.push(item.pop);

		// Tenta pegar o ícone e condição de por volta do meio-dia (mais representativo)
		const hour = new Date(item.dt * 1000).getHours();
		if (hour >= 12 && hour <= 15) {
			dailyForecasts[dateKey].icon = item.weather[0].icon;
			dailyForecasts[dateKey].condition = item.weather[0].description;
		}
	});

	// 3. Formata os dados diários agrupados
	const forecast = Object.values(dailyForecasts).map((dayData, index) => {
		const dateObj = new Date(dayData.dt * 1000);

		return {
			day:
				index === 0
					? "Hoje"
					: dateObj.toLocaleDateString("pt-BR", { weekday: "long" }),
			date: dateObj.toLocaleDateString("pt-BR", {
				day: "numeric",
				month: "short",
			}),
			high: Math.round(Math.max(...dayData.tempsMax)),
			low: Math.round(Math.min(...dayData.tempsMin)),
			// Pega a maior chance de chuva do dia
			chanceOfRain: Math.round(Math.max(...dayData.pops) * 100),
			// Usa o ícone do meio-dia ou o primeiro ícone encontrado
			icon: dayData.icon || dayData.icons[0] || forecastData.list[0].weather[0].icon,
			condition: dayData.condition || dayData.conditions[0] || forecastData.list[0].weather[0].description,
		};
	});

	return { current, forecast };
};

// --- COMPONENTE PRINCIPAL ---
export default function App() {
	const [currentTime, setCurrentTime] = useState(new Date());
	const [city, setCity] = useState("Rio de Janeiro"); // Cidade padrão
	const [searchQuery, setSearchQuery] = useState("Rio de Janeiro"); // Estado para o input
	const [weatherData, setWeatherData] = useState(null); // Estado para os dados da API
	const [loading, setLoading] = useState(true); // Estado de carregamento
	const [error, setError] = useState(null); // Estado de erro

	useEffect(() => {
		// Atualiza o relógio
		const timer = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	// --- NOVO: useEffect para SEO e Metadados ---
	useEffect(() => {
		// --- 1. Otimização de SEO e Título Dinâmico ---
		if (weatherData) {
			const location = weatherData.current.location;
			const description = `Veja a previsão do tempo atual e para 5 dias em ${location}. Temperaturas, umidade e chance de chuva.`;

			// Define o título da página (importante para SEO)
			document.title = `Clima em ${location} - Previsão do Tempo`;

			// Define a meta-descrição (importante para SEO)
			let metaDescription = document.querySelector('meta[name="description"]');
			if (!metaDescription) {
				metaDescription = document.createElement('meta');
				metaDescription.name = 'description';
				document.head.appendChild(metaDescription);
			}
			metaDescription.setAttribute("content", description);
		} else {
			// Título padrão enquanto carrega ou em caso de erro
			document.title = "Carregando Previsão do Tempo...";
		}

		// --- 2. Correção de Encoding (cedilha, acentos) e Idioma (SEO) ---

		// Define o idioma da página (importante para SEO e acessibilidade)
		// document.documentElement.lang = "pt-BR";

		// Garante que o meta charset UTF-8 existe
		// Isso corrige problemas com acentos e 'ç'
		let metaCharset = document.querySelector('meta[charset]');
		if (!metaCharset) {
			metaCharset = document.createElement('meta');
			metaCharset.setAttribute('charset', 'UTF-8');
			document.head.prepend(metaCharset);
		} else {
			metaCharset.setAttribute('charset', 'UTF-8');
		}

	}, [weatherData]); // Roda sempre que 'weatherData' mudar

	useEffect(() => {
		// Busca os dados do clima quando o componente monta ou a 'city' muda
		if (!city) {
			setLoading(false);
			return;
		}

		const fetchWeatherData = async () => {
			setLoading(true);
			setError(null);
			setWeatherData(null);

			try {
				// --- ETAPA 1: Geocodificação (Cidade -> Lat/Lon) ---
				const geoResponse = await fetch(
					`${GEO_API_URL}?q=${city}&limit=1&appid=${API_KEY}`
				);

				// --- VERIFICAÇÃO DE ERRO MELHORADA ---
				if (!geoResponse.ok) {
					const errorData = await geoResponse.json();
					throw new Error(
						`Erro na Geocodificação: ${errorData.message || geoResponse.statusText}`
					);
				}

				const geoData = await geoResponse.json();

				if (!geoData || geoData.length === 0) {
					throw new Error("Cidade não encontrada. Tente novamente.");
				}

				const { lat, lon, name, country } = geoData[0];
				const locationData = { name, country };

				// --- ETAPA 2: Buscar Clima e Previsão (em paralelo) ---
				const [currentWeatherResponse, forecastResponse] = await Promise.all([
					fetch(
						`${CURRENT_WEATHER_API_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=pt_br`
					),
					fetch(
						`${FORECAST_API_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=pt_br`
					),
				]);

				// --- VERIFICAÇÃO DE ERRO MELHORADA ---
				if (!currentWeatherResponse.ok) {
					const errorData = await currentWeatherResponse.json();
					throw new Error(
						`Erro no Clima Atual: ${errorData.message || currentWeatherResponse.statusText}`
					);
				}
				if (!forecastResponse.ok) {
					const errorData = await forecastResponse.json();
					throw new Error(
						`Erro na Previsão: ${errorData.message || forecastResponse.statusText}`
					);
				}

				const currentData = await currentWeatherResponse.json();
				const forecastData = await forecastResponse.json();

				// --- ETAPA 3: Adaptar os dados ---
				const transformedData = transformWeatherData(
					currentData,
					forecastData,
					locationData
				);
				setWeatherData(transformedData);
			} catch (err) {
				console.error("Detalhes do erro:", err); // Log para depuração
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchWeatherData();
	}, [city]); // Dependência: refaz a busca se 'city' mudar

	const handleSearch = (e) => {
		e.preventDefault();
		if (searchQuery.trim() && searchQuery.trim().toLowerCase() !== city.toLowerCase()) {
			setCity(searchQuery.trim());
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-100">
			{/* Background Elements */}
			<div className="absolute inset-0 overflow-hidden -z-0">
				<div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/20 rounded-full blur-xl"></div>
				<div className="absolute top-40 right-20 w-48 h-48 bg-indigo-200/20 rounded-full blur-xl"></div>
				<div className="absolute bottom-20 left-1/2 w-64 h-64 bg-sky-200/20 rounded-full blur-xl"></div>
			</div>

			<div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
				{/* Header e Busca */}
				<div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
					<div className="text-center md:text-left">
						<h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
							Previsão do Tempo
						</h1>
						<div className="flex items-center justify-center md:justify-start gap-2 text-gray-600 mt-2">
							<Calendar className="w-4 h-4" />
							<p className="text-lg">
								{currentTime.toLocaleDateString("pt-BR", {
									weekday: "long",
									day: "numeric",
									month: "long",
								})}
								{" • "}
								{currentTime.toLocaleTimeString("pt-BR", {
									hour: "2-digit",
									minute: "2-digit",
								})}
							</p>
						</div>
					</div>
					{/* Formulário de Busca */}
					<form
						onSubmit={handleSearch}
						className="flex w-full max-w-sm shadow-lg bg-white/80 rounded-full overflow-hidden backdrop-blur-sm"
					>
						<input
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Buscar cidade..."
							className="w-full px-5 py-3 bg-transparent focus:outline-none text-gray-700"
						/>
						<button
							type="submit"
							className="px-5 text-blue-600 hover:bg-blue-100/50 transition-colors"
							aria-label="Buscar"
						>
							<Search className="w-5 h-5" />
						</button>
					</form>
				</div>

				{/* Conteúdo Principal */}
				{loading && (
					<div className="flex justify-center items-center h-96">
						<div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
					</div>
				)}

				{error && (
					<div className="flex flex-col justify-center items-center h-96 text-center bg-red-100/50 text-red-700 p-8 rounded-3xl shadow-lg">
						<AlertCircle className="w-16 h-16 mb-4" />
						<h2 className="text-2xl font-semibold mb-2">Ocorreu um erro</h2>
						<p className="text-lg">{error}</p>
					</div>
				)}

				{weatherData && !loading && !error && (
					<>
						{/* Header da Localização (agora dinâmico) */}
						<div className="text-center mb-8">
							<div className="flex items-center justify-center gap-3 mb-4">
								<div className="p-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
									<MapPin className="w-6 h-6 text-blue-600" />
								</div>
								<h2 className="text-3xl font-bold text-gray-800">
									{weatherData.current.location}
								</h2>
							</div>
						</div>

						{/* Main Weather Grid */}
						<div className="grid lg:grid-cols-3 gap-8 mb-8">
							<div className="lg:col-span-2">
								<CurrentWeather
									data={weatherData.current}
									todayForecast={weatherData.forecast[0]}
								/>
							</div>
							<div className="lg:col-span-1">
								<WeatherDetails data={weatherData.current} />
							</div>
						</div>

						{/* Weekly Forecast */}
						<WeeklyForecast forecast={weatherData.forecast} />

						{/* Footer */}
						<div className="text-center mt-12 py-6">
							<p className="text-gray-500 text-sm">
								Dados climáticos para {weatherData.current.location}
							</p>
						</div>
					</>
				)}
			</div>
		</div>
	);
}

