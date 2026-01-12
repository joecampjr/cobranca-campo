import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string
  icon: LucideIcon
  trend?: string
  trendUp?: boolean
}

export function StatsCard({ title, value, icon: Icon, trend, trendUp }: StatsCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <h3 className="text-2xl font-bold mb-2">{value}</h3>
          {trend && (
            <div className="flex items-center gap-1 text-sm">
              {trendUp !== undefined && (
                <>
                  {trendUp ? (
                    <TrendingUp className="h-4 w-4 text-accent" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-destructive" />
                  )}
                </>
              )}
              <span
                className={
                  trendUp !== undefined ? (trendUp ? "text-accent" : "text-destructive") : "text-muted-foreground"
                }
              >
                {trend}
              </span>
            </div>
          )}
        </div>
        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </Card>
  )
}
