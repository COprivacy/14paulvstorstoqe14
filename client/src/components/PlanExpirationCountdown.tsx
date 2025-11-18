
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, AlertTriangle, CheckCircle } from "lucide-react";

interface PlanExpirationCountdownProps {
  expirationDate: string | null;
  planName: string;
  status: string;
}

export function PlanExpirationCountdown({ expirationDate, planName, status }: PlanExpirationCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    expired: boolean;
  } | null>(null);

  useEffect(() => {
    if (!expirationDate) {
      setTimeLeft(null);
      return;
    }

    const calculateTimeLeft = () => {
      const now = new Date();
      const expiry = new Date(expirationDate);
      const diff = expiry.getTime() - now.getTime();

      if (diff <= 0) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          expired: true,
        };
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      return {
        days,
        hours,
        minutes,
        seconds,
        expired: false,
      };
    };

    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [expirationDate]);

  if (!expirationDate) {
    return (
      <Card className="border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-600">Plano Ativo</p>
              <p className="text-xs text-muted-foreground">Sem data de expiração</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!timeLeft) {
    return null;
  }

  const isExpired = timeLeft.expired || status === "bloqueado";
  const isCritical = !isExpired && timeLeft.days <= 3;

  return (
    <Card className={`${isExpired ? "border-red-500 bg-red-50 dark:bg-red-950/20" : isCritical ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20" : "border-blue-200"}`}>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            {isExpired ? (
              <AlertTriangle className="h-5 w-5 text-red-600" />
            ) : (
              <Clock className="h-5 w-5 text-blue-600" />
            )}
            <div>
              <p className="text-sm font-medium">{planName}</p>
              <p className="text-xs text-muted-foreground">
                {isExpired ? "Expirado" : "Tempo Restante"}
              </p>
            </div>
          </div>

          {!isExpired && (
            <>
              <div className="text-center mb-2">
                <p className="text-sm text-muted-foreground">
                  Vence em {timeLeft.days} dia{timeLeft.days !== 1 ? 's' : ''}
                  {timeLeft.hours > 0 && ` e ${timeLeft.hours}h`}
                </p>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <div className="text-center p-2 bg-background rounded border">
                  <div className="text-2xl font-bold">{timeLeft.days}</div>
                  <div className="text-xs text-muted-foreground">Dias</div>
                </div>
              <div className="text-center p-2 bg-background rounded border">
                <div className="text-2xl font-bold">{timeLeft.hours}</div>
                <div className="text-xs text-muted-foreground">Horas</div>
              </div>
              <div className="text-center p-2 bg-background rounded border">
                <div className="text-2xl font-bold">{timeLeft.minutes}</div>
                <div className="text-xs text-muted-foreground">Min</div>
              </div>
              <div className="text-center p-2 bg-background rounded border">
                <div className="text-2xl font-bold">{timeLeft.seconds}</div>
                <div className="text-xs text-muted-foreground">Seg</div>
              </div>
            </div>
            </>
          )}

          {isExpired && (
            <div className="text-center py-2 px-3 bg-red-100 dark:bg-red-900/30 rounded border border-red-300 dark:border-red-700">
              <p className="text-sm font-medium text-red-700 dark:text-red-300">
                Plano Expirado - Conta Bloqueada
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
