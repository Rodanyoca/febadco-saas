import {DashboardLayout} from "@/components/dashboard/dashboard-layout"
import {Header} from "@/components/dashboard/header"
import {DashboardRefreshButton} from "@/components/dashboard/dashboard-refresh-button"
import {actorKinds,loadActors,type ActorKind} from "@/lib/febadco/actors-domain"
import {readFebadcoSheets} from "@/lib/febadco/sheets-server"
import {FebadcoActorsClient} from "./febadco-actors-client"

export async function FebadcoActorsPage({kind}:{kind:ActorKind}){
  let data:Awaited<ReturnType<typeof loadActors>>|null=null
  try{data=await loadActors(kind,readFebadcoSheets)}catch{/* No demo fallback, credentials or raw source errors in the response. */}
  return <DashboardLayout><Header title={actorKinds[kind].title} subtitle="Registre des acteurs affiliés à la FEBADCO"/><div className="min-w-0 space-y-5 p-4 sm:p-6"><div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4"><p className="text-sm text-muted-foreground">Consultation du registre fédéral</p><DashboardRefreshButton/></div>{data?<>{data.anomalies>0&&<p role="alert" className="rounded-lg border p-3 text-sm">{data.anomalies} ligne(s) sans identifiant ou en doublon exclue(s). Les données source doivent être vérifiées.</p>}<FebadcoActorsClient kind={kind} actors={data.actors}/></>:<div role="alert" className="rounded-xl border border-destructive/40 p-4 text-sm">Lecture du registre impossible. Vérifiez l’accès aux classeurs et leurs en-têtes, puis utilisez Actualiser. Aucune donnée fictive n’est utilisée.</div>}</div></DashboardLayout>
}
