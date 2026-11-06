import type {Matrix} from "./read-client.ts"
export const dashboardSources = {
  acteurs: [
    {sheet:"ATHLETES",id:"id_athlete",label:"Athlètes"},
    {sheet:"COACHS",id:"id_coach",label:"Entraîneurs"},
    {sheet:"ARBITRES",id:"id_arbitre",label:"Arbitres"},
    {sheet:"OFFICIELS",id:"id_officiel",label:"Officiels"},
    {sheet:"MEDECINS",id:"id_medecin",label:"Médecins"},
    {sheet:"AUTRES",id:"id_autre_acteur",label:"Autres acteurs"},
  ],
  competitions:[{sheet:"COMPETITIONS",id:"id_competition",label:"Compétitions"}],
  activites:[{sheet:"ACTIVITES",id:"id_activite",label:"Activités"}],
  documents:[{sheet:"DOCUMENTS",id:"id_document",label:"Documents"}],
} as const
export type DashboardBlock = keyof typeof dashboardSources
export const dashboardBlocks = Object.keys(dashboardSources) as DashboardBlock[]
type Source = {sheet:string;id:string;label:string}
export function columnName(index:number) {
  let name=""
  for(let n=index+1;n>0;n=Math.floor((n-1)/26))name=String.fromCharCode(65+(n-1)%26)+name
  return name
}
export function projection(source:Source,header:Matrix) {
  const names=(header[0]??[]).map(value=>String(value??"").trim())
  return [source.id,"statut"].map(field=>{
    if(names.filter(name=>name===field).length!==1)throw new Error("SCHEMA_INVALID")
    const column=columnName(names.indexOf(field))
    return {field,range:`'${source.sheet}'!${column}2:${column}`}
  })
}
export function summarize(source:Source,columns:Record<string,Matrix>) {
  const ids=columns[source.id],statuses=columns.statut
  if(!ids||!statuses)throw new Error("SOURCE_INCOMPLETE")
  const seen=new Set<string>()
  const summary={label:source.label,total:0,active:0,inactive:0,suspended:0,other:0,unknown:0,duplicates:0,missingId:0}
  const length=Math.max(ids.length,statuses.length)
  for(let row=0;row<length;row++){
    const id=String(ids[row]?.[0]??"").trim(),status=String(statuses[row]?.[0]??"").trim().toUpperCase()
    if(!id){if(status)summary.missingId++;continue}
    if(seen.has(id)){summary.duplicates++;continue}
    seen.add(id);summary.total++
    if(status==="ACTIF"||status==="ACTIVE")summary.active++
    else if(status==="INACTIF"||status==="INACTIVE")summary.inactive++
    else if(status==="SUSPENDU"||status==="SUSPENDUE")summary.suspended++
    else if(!status)summary.unknown++
    else summary.other++
  }
  return summary
}
export type DashboardSummary = ReturnType<typeof summarize>
export type DashboardResult = {block:DashboardBlock;rows:DashboardSummary[];error:boolean}
export async function loadDashboard(read:(block:DashboardBlock,ranges:string[])=>Promise<Record<string,Matrix>>) {
  return Promise.all(dashboardBlocks.map(async (block):Promise<DashboardResult>=>{
    const sources=dashboardSources[block]
    try{
      const headers=await read(block,sources.map(source=>`'${source.sheet}'!1:1`))
      const plans=sources.map(source=>({source,fields:projection(source,headers[`'${source.sheet}'!1:1`]??[])}))
      const data=await read(block,plans.flatMap(plan=>plan.fields.map(field=>field.range)))
      const rows=plans.map(({source,fields})=>summarize(source,Object.fromEntries(fields.map(field=>[field.field,data[field.range]]))))
      return {block,rows,error:false}
    }catch{return {block,rows:[],error:true}}
  }))
}
