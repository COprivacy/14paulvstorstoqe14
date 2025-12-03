import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, AlertTriangle, Calendar, Barcode, Lock } from "lucide-react";
import { getDaysUntilExpiry, getExpiryStatus, formatDate } from "@/lib/dateUtils";
import { cn } from "@/lib/utils";

interface Bloqueio {
  quantidade_bloqueada: number;
  numero_orcamento: string;
  orcamento_id: number;
}

interface ProductCardProps {
  id: number;
  nome: string;
  categoria: string;
  preco: number;
  quantidade: number;
  estoque_minimo: number;
  codigo_barras?: string | null;
  vencimento?: string | null;
  quantidadeBloqueada?: number;
  bloqueios?: Bloqueio[];
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  localizacao?: string | null; // Added localizacao prop
}

function ProductCard({ 
  id, 
  nome, 
  categoria, 
  preco, 
  quantidade, 
  estoque_minimo,
  codigo_barras,
  vencimento,
  quantidadeBloqueada = 0,
  bloqueios = [],
  onEdit,
  onDelete,
  localizacao // Destructure localizacao prop
}: ProductCardProps) {
  const isLowStock = quantidade < estoque_minimo;
  const expiryStatus = getExpiryStatus(vencimento || null);
  const daysUntilExpiry = getDaysUntilExpiry(vencimento || null);
  const hasBloqueios = quantidadeBloqueada > 0;

  return (
    <Card className={cn(
      "group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br backdrop-blur-sm",
      isLowStock 
        ? "from-orange-500/10 via-orange-500/5 to-transparent" 
        : "from-blue-500/5 via-purple-500/5 to-transparent"
    )} data-testid={`card-product-${id}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-start gap-2 flex-wrap">
              <h3 className="font-semibold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" data-testid={`text-product-name-${id}`}>{nome}</h3>
              {isLowStock && (
                <Badge variant="destructive" className="flex items-center gap-1" data-testid={`badge-low-stock-${id}`}>
                  <AlertTriangle className="h-3 w-3" />
                  Estoque Baixo
                </Badge>
              )}
              {expiryStatus === 'critical' && daysUntilExpiry !== null && (
                <Badge variant="destructive" className="flex items-center gap-1" data-testid={`badge-expiry-critical-${id}`}>
                  <Calendar className="h-3 w-3" />
                  Vence em {daysUntilExpiry} dia{daysUntilExpiry !== 1 ? 's' : ''}
                </Badge>
              )}
              {expiryStatus === 'warning' && daysUntilExpiry !== null && (
                <Badge className="flex items-center gap-1 bg-orange-500 text-white" data-testid={`badge-expiry-warning-${id}`}>
                  <Calendar className="h-3 w-3" />
                  Vence em {daysUntilExpiry} dias
                </Badge>
              )}
              {expiryStatus === 'expired' && (
                <Badge variant="destructive" className="flex items-center gap-1" data-testid={`badge-expired-${id}`}>
                  <Calendar className="h-3 w-3" />
                  Vencido
                </Badge>
              )}
              {hasBloqueios && (
                <Badge variant="secondary" className="flex items-center gap-1 bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30" data-testid={`badge-bloqueado-${id}`}>
                  <Lock className="h-3 w-3" />
                  {quantidadeBloqueada} Bloqueado{quantidadeBloqueada > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{categoria}</p>
            {hasBloqueios && bloqueios.length > 0 && (
              <div className="text-xs text-muted-foreground space-y-1">
                <p className="font-medium">Bloqueado em:</p>
                {bloqueios.map((bloqueio, index) => (
                  <p key={index} data-testid={`text-bloqueio-${id}-${index}`}>
                    • Orçamento {bloqueio.numero_orcamento}: {bloqueio.quantidade_bloqueada} un.
                  </p>
                ))}
              </div>
            )}
            <div className="flex items-center gap-4 text-sm flex-wrap">
              <div>
                <span className="text-muted-foreground">Preço: </span>
                <span className="font-medium" data-testid={`text-price-${id}`}>R$ {preco.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Qtd: </span>
                <span className={`font-medium ${isLowStock ? 'text-destructive' : ''}`} data-testid={`text-quantity-${id}`}>
                  {quantidade}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Mín: </span>
                <span className="font-medium">{estoque_minimo}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 flex-wrap text-sm mt-2">
              {codigo_barras && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                  <Barcode className="h-3.5 w-3.5" />
                  <span>{codigo_barras}</span>
                </div>
              )}
              {localizacao && (
                <div className="flex items-center gap-1.5 text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-1 rounded font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <span>Loc: {localizacao}</span>
                </div>
              )}
              {vencimento && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                  <Calendar className="h-3.5 w-3.5" />
                  <span data-testid={`text-expiry-${id}`}>Venc: {formatDate(vencimento)}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              size="icon" 
              variant="outline" 
              onClick={() => onEdit?.(id)}
              data-testid={`button-edit-${id}`}
              className="bg-transparent hover:bg-accent border-accent/50 hover:border-accent text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button 
              size="icon" 
              variant="outline" 
              onClick={() => onDelete?.(id)}
              data-testid={`button-delete-${id}`}
              className="bg-transparent hover:bg-accent border-accent/50 hover:border-accent text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default memo(ProductCard);