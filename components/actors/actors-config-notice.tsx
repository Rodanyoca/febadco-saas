import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Database } from "lucide-react"

export function ActorsConfigNotice() {
  return (
    <Alert>
      <Database className="h-4 w-4" />
      <AlertTitle>Raccordement en cours</AlertTitle>
      <AlertDescription>
        Ce parcours reste à adapter au référentiel badminton FEBADCO. Aucun exemple fictif n’est utilisé ; le tableau de bord est déjà connecté aux données réelles.
      </AlertDescription>
    </Alert>
  )
}
