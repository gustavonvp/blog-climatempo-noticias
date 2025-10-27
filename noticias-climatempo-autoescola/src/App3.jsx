import React, { useState } from 'react';

// --- CHAVE DA API (IMPORTANTE) ---
// Obtenha sua chave de API gratuita em https://openweathermap.org/appid
const apiKey = "a20a6eac94fbbb7f3cafade4a7717db0"; // A mesma chave do seu HTML

// --- FUNÇÕES AUXILIARES DE DADOS (Fora do componente para evitar recriação) ---

/**
 * Busca dados reais da API OpenWeatherMap (Previsão de 5 dias / 3 horas).
 * @param {string} location - O nome da localização.
 * @returns {Promise<object>} - Uma promessa que resolve com os dados brutos da API.
 */
async function fetchRealWeather(location) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric&lang=pt_br`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error("Chave de API inválida ou não autorizada. Verifique sua chave.");
        }
        if (response.status === 404) {
            throw new Error("Localização não encontrada. Verifique o nome e tente novamente.");
        }
        throw new Error("Não foi possível buscar os dados do tempo. Tente novamente mais tarde.");
    }

    return await response.json();
}

/**
 * Processa os dados brutos da API (que vêm em blocos de 3h) 
 * e os agrupa por dia, formatando-os para o nosso app.
 * @param {object} rawData - Dados brutos da API.
 * @returns {object} - Objeto formatado com locationName e array de forecast.
 */
function processWeatherData(rawData) {
    const locationName = `${rawData.city.name}, ${rawData.city.country}`;
    const dailyData = {}; // Objeto para agrupar dados por dia

    // 1. Agrupa os blocos de 3 horas por dia
    rawData.list.forEach(item => {
        const date = item.dt_txt.split(' ')[0]; // Pega a parte YYYY-MM-DD
        if (!dailyData[date]) {
            dailyData[date] = [];
        }
        dailyData[date].push(item);
    });

    // 2. Processa os dados agrupados para encontrar o resumo de cada dia
    const forecast = [];
    const weekdays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

    for (const date in dailyData) {
        const dayChunks = dailyData[date];

        // Encontra min/max das temperaturas do dia
        const temp_max = Math.max(...dayChunks.map(chunk => chunk.main.temp_max));
        const temp_min = Math.min(...dayChunks.map(chunk => chunk.main.temp_min));

        // Pega a maior probabilidade de precipitação (pop) do dia
        const precipitation = Math.max(...dayChunks.map(chunk => chunk.pop)); // Valor de 0 a 1

        // Pega a maior velocidade de vento do dia (convertido de m/s para km/h)
        const wind_speed_ms = Math.max(...dayChunks.map(chunk => chunk.wind.speed));
        const wind_speed_kmh = wind_speed_ms * 3.6;

        // Pega a menor visibilidade do dia (em metros)
        const visibility_m = Math.min(...dayChunks.map(chunk => chunk.visibility));

        // Pega a condição do tempo do meio-dia (ou o primeiro bloco, se não houver)
        const middayChunk = dayChunks.find(chunk => chunk.dt_txt.includes("12:00:00")) || dayChunks[0];
        let condition = middayChunk.weather[0].description;
        condition = condition.charAt(0).toUpperCase() + condition.slice(1); // Capitaliza

        // Formata data e dia da semana
        const dateObj = new Date(`${date}T12:00:00`); // Usa T12:00 para evitar problemas de fuso
        const formattedDate = dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        const weekday = weekdays[dateObj.getDay()];

        forecast.push({
            date: formattedDate,
            weekday: weekday,
            condition: condition,
            temp_max: Math.round(temp_max),
            temp_min: Math.round(temp_min),
            precipitation: Math.round(precipitation * 100), // Converte para %
            wind_speed: Math.round(wind_speed_kmh), // Converte para km/h
            visibility: visibility_m // Adiciona visibilidade em metros
        });
    }

    // Ajusta o primeiro dia para "Hoje"
    if (forecast.length > 0) {
        const today = new Date();
        const firstDate = new Date(`${Object.keys(dailyData)[0]}T12:00:00`);
        if (today.getDate() === firstDate.getDate()) {
            forecast[0].weekday = "Hoje";
        }
    }

    return { locationName, forecast };
}

/**
 * Retorna um emoji com base na condição do tempo (descrições do OWM).
 * @param {string} condition - A descrição da condição (em português).
 * @returns {string} - Um emoji.
 */
function getWeatherIcon(condition) {
    const cond = condition.toLowerCase();

    if (cond.includes("trovoada")) return "⛈️";
    if (cond.includes("chuva forte") || cond.includes("chuva extrema")) return "🌧️";
    if (cond.includes("chuva")) return "🌦️"; // Inclui leve, moderada
    if (cond.includes("neve")) return "❄️";
    if (cond.includes("névoa") || cond.includes("neblina")) return "🌫️";
    if (cond.includes("céu limpo")) return "☀️";
    if (cond.includes("poucas nuvens")) return "🌤️";
    if (cond.includes("nuvens dispersas")) return "⛅";
    if (cond.includes("nublado")) return "☁️";

    return "🌍"; // Padrão
}

/**
 * Retorna a categoria da visibilidade (Boa, Moderada, Baixa).
 * @param {number} visibility_m - Visibilidade em metros.
 * @returns {string} - A categoria.
 */
function getVisibilityCategory(visibility_m) {
    if (visibility_m < 2000) return "Baixa";
    if (visibility_m < 5000) return "Moderada";
    return "Boa";
}

/**
 * Define a recomendação para a aula prática com base nos critérios.
 * @param {object} day - Dados da previsão do dia.
 * @returns {object} - Objeto com texto e cores da recomendação.
 */
function getRecommendation(day) {
    // Apenas extrai os dados necessários para a nova lógica
    const { wind_speed, condition } = day;
    const cond = condition.toLowerCase();

    // --- LÓGICA BASEADA NA NOVA TABELA SIMPLIFICADA ---

    // 1. Critérios para "Crítico"
    // "Chuva forte" (incluindo trovoada, etc.) OU "vento > 30km/h"
    const isBadWeather = cond.includes("forte") || cond.includes("trovoada") || cond.includes("extrema") || cond.includes("tempestade");

    if (isBadWeather || wind_speed > 30) {
        return {
            text: "Crítico",
            bgColor: "bg-red-100",
            textColor: "text-red-800",
            borderColor: "border-red-400"
        };
    }

    // 2. Critérios para "Moderado"
    // "Nublado" OU "chuva leve" (qualquer chuva que não seja "forte")
    const isCloudy = cond.includes("nublado") || cond.includes("nuvens dispersas");
    // Pega "chuva", "chuva leve", "chuva moderada", mas não "chuva forte" (já pego acima)
    const isLightRain = cond.includes("chuva") && !isBadWeather;

    if (isCloudy || isLightRain) {
        return {
            text: "Moderado",
            bgColor: "bg-yellow-100",
            textColor: "text-yellow-800",
            borderColor: "border-yellow-400"
        };
    }

    // 3. Critérios para "Ideal"
    // "Sol" (céu limpo, poucas nuvens) E "vento < 15 km/h"
    const isSunny = cond.includes("céu limpo") || cond.includes("poucas nuvens") || cond.includes("sol");

    if (isSunny && wind_speed < 15) {
        return {
            text: "Ideal",
            bgColor: "bg-green-100",
            textColor: "text-green-800",
            borderColor: "border-green-400"
        };
    }

    // 4. Caso Padrão (Se não se encaixar em nada, ex: névoa, ou sol com vento > 15)
    return {
        text: "Moderado",
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-800",
        borderColor: "border-yellow-400"
    };
}


// --- COMPONENTE DO CARTÃO DO DIA ---
function DayCard({ day }) {
    const recommendation = getRecommendation(day);

    return (
        <div className={`border rounded-lg p-4 bg-white shadow-sm flex flex-col ${recommendation.borderColor} border-l-4`}>
            <div className="flex-grow">
                <p className="font-bold text-lg text-gray-800">{day.weekday}</p>
                <p className="text-sm text-gray-500 mb-3">{day.date}</p>

                <div className="text-4xl text-center my-4">{getWeatherIcon(day.condition)}</div>

                <p className="text-2xl font-bold text-center text-gray-800">{day.temp_max}°C</p>
                <p className="text-center text-gray-500 mb-4">Min: {day.temp_min}°C</p>

                <div className="space-y-2 text-sm mb-4">
                    <p className="text-gray-700">☔ Precipitação: <strong>{day.precipitation}%</strong></p>
                    <p className="text-gray-700">💨 Vento: <strong>{day.wind_speed} km/h</strong></p>
                    <p className="text-gray-700">👁️ Visibilidade: <strong>{getVisibilityCategory(day.visibility)}</strong></p>
                </div>

                {/* Recomendação */}
                <div className={`p-2 rounded-md text-center font-semibold ${recommendation.bgColor} ${recommendation.textColor}`}>
                    {recommendation.text}
                </div>
            </div>

            {/* Planejamento (Notas) */}
            <div className="mt-4 pt-4 border-t">
                <label className="text-sm font-medium text-gray-600 mb-1 block">Notas da Aula:</label>
                <textarea
                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    rows="3"
                    placeholder="Ex: Aula de biologia no pátio..."
                ></textarea>
            </div>
        </div>
    );
}

// --- COMPONENTE PRINCIPAL APP ---
export default function App() {
    // --- ESTADOS ---
    const [location, setLocation] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // --- ESTILOS INLINE PARA ANIMAÇÃO (Substitui a tag <style>) ---
    // React não suporta <style> global diretamente em JSX.
    // Para a animação de spin, a melhor abordagem em um projeto React
    // seria usar um arquivo .css ou styled-components.
    // Para manter em um único arquivo, podemos usar um <style> tag.
    const styles = `
        .loader {
            border-top-color: #3498db;
            -webkit-animation: spin 1s linear infinite;
            animation: spin 1s linear infinite;
        }
        @-webkit-keyframes spin {
            0% { -webkit-transform: rotate(0deg); }
            100% { -webkit-transform: rotate(360deg); }
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        /* Opcional: Garante que o App use a fonte Inter se importada no index.html/css */
        /* .weather-app-container { font-family: 'Inter', sans-serif; } */
    `;

    // --- MANIPULADORES DE EVENTOS ---

    /**
     * Função principal que orquestra a busca.
     */
    async function handleSearch() {
        if (!location) {
            setError("Por favor, insira um nome de localização válido.");
            return;
        }

        if (apiKey === "SEU_API_KEY_AQUI") {
            setError("Por favor, insira sua chave de API do OpenWeatherMap no código (const 'apiKey') para continuar.");
            return;
        }

        // 1. Resetar UI
        setIsLoading(true);
        setError(null);
        setWeatherData(null);

        try {
            // 2. Buscar dados reais da API
            const rawData = await fetchRealWeather(location);

            // 3. Processar e formatar os dados
            const processedData = processWeatherData(rawData);

            // 4. Renderizar resultados
            setWeatherData(processedData);

        } catch (error) {
            // 5. Lidar com erros
            setError(error.message);
        } finally {
            // 6. Parar carregamento
            setIsLoading(false);
        }
    }

    /**
     * Permite a busca ao pressionar 'Enter'.
     */
    function handleKeyPress(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    }

    // --- RENDERIZAÇÃO ---
    return (
        <>
            {/* Adiciona os estilos de animação ao DOM */}
            <style>{styles}</style>

            {/* Container principal do módulo */}
            {/* Adicionei padding e centralização aqui, assumindo que este é o componente da rota */}
            <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-6 md:p-8 weather-app-container">

                    {/* Cabeçalho */}
                    <header className="mb-6">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                            Previsão do Tempo e Planejamento de Aulas Práticas
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Insira uma localização para ver a previsão e recomendações para atividades ao ar livre.
                        </p>
                    </header>

                    {/* Seção de Busca */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-6">
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ex: São Paulo, BR"
                            className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                        <button
                            onClick={handleSearch}
                            disabled={isLoading}
                            className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400"
                        >
                            {isLoading ? 'Buscando...' : 'Buscar Previsão'}
                        </button>
                    </div>

                    {/* Área de Conteúdo (Resultados) */}
                    <div id="resultsContainer">

                        {/* Estado de Carregamento */}
                        {isLoading && (
                            <div className="flex justify-center items-center py-10">
                                <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
                                <p className="ml-4 text-gray-600">Buscando previsão...</p>
                            </div>
                        )}

                        {/* Estado de Erro */}
                        {error && (
                            <div className="text-center p-6 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                                <p>{error}</p>
                            </div>
                        )}

                        {/* Estado Inicial / Boas-vindas */}
                        {!isLoading && !error && !weatherData && (
                            <div className="text-center p-6 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg">
                                <p>Por favor, insira uma localização para começar.</p>
                                {apiKey === "SEU_API_KEY_AQUI" && (
                                    <p className="text-sm mt-2 text-red-600 font-semibold">
                                        <strong>Atenção:</strong> Você ainda precisa inserir sua chave de API
                                        na constante `apiKey` no topo do arquivo `App.jsx`.
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Resultados da Previsão */}
                        {weatherData && (
                            <div id="forecastContainer">
                                <h2 className="text-xl font-bold text-gray-700 mb-4" id="locationTitle">
                                    {`Previsão para ${weatherData.locationName}`}
                                </h2>

                                {/* Grid responsivo para os dias */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                    {weatherData.forecast.map((day, index) => (
                                        <DayCard key={index} day={day} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </>
    );
}
