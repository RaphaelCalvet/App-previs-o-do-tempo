import { useState } from "react";
import { Search, Cloud, CloudRain, Sun, CloudSnow, CloudDrizzle, Wind } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
}

const Index = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const API_KEY = "YOUR_API_KEY_HERE"; // Users will need to add their OpenWeatherMap API key here

  const getWeatherIcon = (weatherMain: string) => {
    switch (weatherMain.toLowerCase()) {
      case "clear":
        return <Sun className="w-24 h-24 text-accent" />;
      case "clouds":
        return <Cloud className="w-24 h-24 text-muted-foreground" />;
      case "rain":
        return <CloudRain className="w-24 h-24 text-primary" />;
      case "snow":
        return <CloudSnow className="w-24 h-24 text-secondary" />;
      case "drizzle":
        return <CloudDrizzle className="w-24 h-24 text-primary" />;
      default:
        return <Cloud className="w-24 h-24 text-muted-foreground" />;
    }
  };

  const fetchWeather = async () => {
    if (!city.trim()) {
      toast({
        title: "Digite uma cidade",
        description: "Por favor, insira o nome de uma cidade para buscar.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=pt_br`
      );

      if (!response.ok) {
        throw new Error("Cidade não encontrada");
      }

      const data = await response.json();
      setWeather(data);
    } catch (error) {
      toast({
        title: "Erro ao buscar previsão",
        description: "Não foi possível encontrar a cidade. Verifique o nome e tente novamente.",
        variant: "destructive",
      });
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      fetchWeather();
    }
  };

  return (
    <div className="min-h-screen sky-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8 animate-in fade-in duration-700">
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground drop-shadow-sm">
            Previsão do Tempo
          </h1>
          <p className="text-lg text-foreground/80">
            Consulte o clima de qualquer cidade do mundo
          </p>
        </div>

        <Card className="weather-card p-8 smooth-transition hover:shadow-2xl">
          <div className="flex gap-3">
            <Input
              type="text"
              placeholder="Digite o nome da cidade..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyPress={handleKeyPress}
              className="text-lg h-12"
              disabled={loading}
            />
            <Button
              onClick={fetchWeather}
              disabled={loading}
              size="lg"
              className="min-w-[120px] h-12"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-3 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  <span>Buscando...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  <span>Buscar</span>
                </div>
              )}
            </Button>
          </div>
        </Card>

        {weather && (
          <Card className="weather-card p-8 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-foreground">{weather.name}</h2>
              <div className="flex justify-center">
                {getWeatherIcon(weather.weather[0].main)}
              </div>
              <div className="space-y-2">
                <p className="text-6xl font-bold text-foreground">
                  {Math.round(weather.main.temp)}°C
                </p>
                <p className="text-xl text-muted-foreground capitalize">
                  {weather.weather[0].description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
              <div className="text-center space-y-1">
                <p className="text-sm text-muted-foreground">Sensação</p>
                <p className="text-2xl font-semibold text-foreground">
                  {Math.round(weather.main.feels_like)}°C
                </p>
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm text-muted-foreground">Umidade</p>
                <p className="text-2xl font-semibold text-foreground">
                  {weather.main.humidity}%
                </p>
              </div>
              <div className="text-center space-y-1">
                <div className="flex items-center justify-center gap-1">
                  <Wind className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Vento</p>
                </div>
                <p className="text-2xl font-semibold text-foreground">
                  {Math.round(weather.wind.speed * 3.6)} km/h
                </p>
              </div>
            </div>
          </Card>
        )}

        {!weather && !loading && (
          <div className="text-center space-y-2 animate-in fade-in duration-500">
            <Cloud className="w-16 h-16 mx-auto text-foreground/40" />
            <p className="text-lg text-foreground/60">
              Digite uma cidade acima para ver a previsão do tempo
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
