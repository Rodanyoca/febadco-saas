import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Header } from "@/components/dashboard/header"
import { AnalyticsTable, DashboardSection, StatGrid, StatValue } from "@/components/dashboard/analytics"
import { DashboardRefreshButton } from "@/components/dashboard/dashboard-refresh-button"
import { loadRealDashboard } from "@/lib/febadco/dashboard-server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
const labels = { acteurs:"Acteurs", competitions:"Compétitions", activites:"Activités", documents:"Documents" }
export default async function DashboardPage() {
  const blocks=await loadRealDashboard()
  const refreshedAt=new Intl.DateTimeFormat("fr-FR",{dateStyle:"short",timeStyle:"medium",timeZone:"Africa/Kinshasa"}).format(new Date())
  const actors=blocks.find(item=>item.block==="acteurs")!
  const errors=blocks.filter(item=>item.error)
  const anomalies=blocks.flatMap(block=>block.rows).reduce((total,row)=>total+row.duplicates+row.missingId,0)
  return <DashboardLayout><Header title="Tableau de bord" subtitle="Synthèse des données FEBADCO"/><div className="min-w-0 space-y-6 p-4 sm:p-6">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-5"><p className="text-sm text-muted-foreground">Dernière lecture : <strong className="text-foreground">{refreshedAt}</strong> · Kinshasa</p><DashboardRefreshButton/></div>
    {errors.length>0 && <div role="alert" className="rounded-lg border border-destructive/40 p-4 text-sm">Lecture indisponible : {errors.map(item=>labels[item.block]).join(", ")}. Les compteurs concernés restent indisponibles. Réessayez avec Actualiser.</div>}
    {anomalies>0 && <p role="status" className="rounded-lg border border-amber-500/40 p-3 text-sm">Des lignes sans identifiant ou avec un identifiant dupliqué ont été exclues des compteurs ({anomalies}).</p>}
    <DashboardSection title="Synthèse générale" description="Enregistrements des quatre blocs, sans données de démonstration ni cycle de licence."><StatGrid>{blocks.map(block=><StatValue key={block.block} label={labels[block.block]} value={block.error?"Indisponible":block.rows.reduce((sum,row)=>sum+row.total,0)} detail={block.error?"Source non disponible":"Identifiants distincts enregistrés"}/>)}</StatGrid></DashboardSection>
    <DashboardSection title="Acteurs" description="Affiliation directe à la fédération. L’identifiant fédéral sert de référence de licence permanente.">{actors.error?<p className="text-sm text-muted-foreground">Les données des acteurs ne sont pas disponibles.</p>:<AnalyticsTable rows={actors.rows} columns={[{key:"label",label:"Catégorie"},{key:"total",label:"Total",align:"right"},{key:"active",label:"Actifs",align:"right"},{key:"inactive",label:"Inactifs",align:"right"},{key:"suspended",label:"Suspendus",align:"right"},{key:"other",label:"Autres statuts",align:"right"},{key:"unknown",label:"Non renseigné",align:"right"}]}/>}</DashboardSection>
    <DashboardSection title="Suivi des blocs" description="Les statuts ne déduisent aucune qualification, certification ou validité de licence."><AnalyticsTable rows={blocks.filter(block=>block.block!=="acteurs").map(block=>({label:labels[block.block],total:block.error?"Indisponible":block.rows[0].total,unknown:block.error?"—":block.rows[0].unknown}))} columns={[{key:"label",label:"Bloc"},{key:"total",label:"Enregistrements",align:"right"},{key:"unknown",label:"Statut non renseigné",align:"right"}]}/></DashboardSection>
  </div></DashboardLayout>
}
