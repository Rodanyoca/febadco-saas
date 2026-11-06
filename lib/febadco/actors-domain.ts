import type {Matrix} from "./read-client.ts"
// @ts-expect-error Explicit extension required by the Node test runner.
import {columnName} from "./dashboard-domain.ts"
export const actorKinds={
  athletes:{title:"Athlètes",sheet:"ATHLETES",id:"id_athlete",field:"",reference:"",referenceId:"",referenceLabel:"",qualificationLabel:""},
  coachs:{title:"Entraîneurs",sheet:"COACHS",id:"id_coach",field:"id_niveau",reference:"NIVEAU_COACH",referenceId:"id_niveau",referenceLabel:"nom_niveau",qualificationLabel:"Niveau"},
  arbitres:{title:"Arbitres",sheet:"ARBITRES",id:"id_arbitre",field:"id_grade_arbitre",reference:"GRADES_ARBITRES",referenceId:"id_grade_arbitre",referenceLabel:"nom_grade_arbitre",qualificationLabel:"Grade"},
  officiels:{title:"Officiels",sheet:"OFFICIELS",id:"id_officiel",field:"",reference:"",referenceId:"",referenceLabel:"",qualificationLabel:""},
  medecins:{title:"Médecins",sheet:"MEDECINS",id:"id_medecin",field:"id_specialite",reference:"SPECIALITES_MEDECIN",referenceId:"id_specialite",referenceLabel:"nom_specialite",qualificationLabel:"Spécialité"},
  "autres-acteurs":{title:"Autres acteurs",sheet:"AUTRES",id:"id_autre_acteur",field:"id_type_autre_acteur",reference:"TYPES_AUTRES_ACTEURS",referenceId:"id_type_autre_acteur",referenceLabel:"nom_type_autre_acteur",qualificationLabel:"Type"},
} as const
export type ActorKind=keyof typeof actorKinds
export type Actor={id:string;bwf:string;name:string;sex:string;birth:string;nationality:string;affiliation:string;status:string;qualification:string}
export type SheetProjection={sheet:string;required:string[];optional:string[]}
export function planProjection(spec:SheetProjection,header:Matrix){
  const names=(header[0]??[]).map(cell=>String(cell??"").trim())
  for(const field of spec.required)if(names.filter(name=>name===field).length!==1)throw new Error("SCHEMA_INCOMPATIBLE")
  return [...new Set([...spec.required,...spec.optional])].flatMap(field=>{
    const index=names.indexOf(field)
    if(index<0)return []
    if(names.lastIndexOf(field)!==index)throw new Error("SCHEMA_INCOMPATIBLE")
    const column=columnName(index)
    return [{field,range:`'${spec.sheet}'!${column}2:${column}`}]
  })
}
export type Read=(book:"acteurs"|"referentiel",ranges:string[])=>Promise<Record<string,Matrix>>
export async function loadActorContact(kind:ActorKind,id:string,read:Read){
  const config=actorKinds[kind],headerRange=`'${config.sheet}'!1:1`
  const headers=await read("acteurs",[headerRange])
  const fields=planProjection({sheet:config.sheet,required:[config.id],optional:["lieu_naissance","telephone","email","adresse","observations"]},headers[headerRange]??[])
  const idField=fields.find(field=>field.field===config.id)!
  const identifiers=(await read("acteurs",[idField.range]))[idField.range]
  if(!identifiers)throw new Error("SOURCE_INCOMPLETE")
  const matches=identifiers.flatMap((row,index)=>String(row[0]??"").trim()===id?[index+2]:[])
  if(matches.length!==1)throw new Error(matches.length?"ACTOR_AMBIGUOUS":"ACTOR_NOT_FOUND")
  const plan=fields.filter(field=>field.field!==config.id).map(field=>({...field,range:field.range.replace(/2:[A-Z]+$/,String(matches[0]))}))
  if(!plan.length)return {}
  const data=await read("acteurs",plan.map(field=>field.range))
  if(plan.some(field=>!data[field.range]))throw new Error("SOURCE_INCOMPLETE")
  return Object.fromEntries(plan.map(field=>[field.field,String(data[field.range]?.[0]?.[0]??"").trim()]))
}
async function projected(read:Read,book:"acteurs"|"referentiel",specs:SheetProjection[]){
  const headers=await read(book,specs.map(spec=>`'${spec.sheet}'!1:1`))
  const plans=specs.map(spec=>({spec,fields:planProjection(spec,headers[`'${spec.sheet}'!1:1`]??[])}))
  const data=await read(book,plans.flatMap(plan=>plan.fields.map(field=>field.range)))
  return Object.fromEntries(plans.map(({spec,fields})=>{
    if(fields.some(field=>!data[field.range]))throw new Error("SOURCE_INCOMPLETE")
    const count=Math.max(0,...fields.map(field=>data[field.range].length))
    return [spec.sheet,Array.from({length:count},(_,i)=>Object.fromEntries(fields.map(field=>[field.field,String(data[field.range][i]?.[0]??"").trim()]))) ]
  }))
}
export async function loadActors(kind:ActorKind,read:Read){
  const config=actorKinds[kind]
  const refs:SheetProjection[]=[{sheet:"SEXES",required:["id_sexe","nom_sexe"],optional:[]},{sheet:"STATUTS_ACTEURS",required:["id_statut_acteur","nom_statut_acteur"],optional:[]}]
  if(config.reference)refs.push({sheet:config.reference,required:[config.referenceId,config.referenceLabel],optional:[]})
  const [data,references]=await Promise.all([
    projected(read,"acteurs",[{sheet:config.sheet,required:[config.id,"nom_complet","statut","date_affiliation"],optional:["id_bwf","id_sexe","date_naissance","nationalite",...(config.field?[config.field]:[])]}]),
    projected(read,"referentiel",refs),
  ])
  const index=(sheet:string,id:string,label:string)=>new Map((references[sheet]??[]).filter(row=>row[id]).map(row=>[row[id],row[label]]))
  const sexes=index("SEXES","id_sexe","nom_sexe"),statuses=index("STATUTS_ACTEURS","id_statut_acteur","nom_statut_acteur")
  const qualifications=config.reference?index(config.reference,config.referenceId,config.referenceLabel):new Map<string,string>()
  const label=(map:Map<string,string>,id:string)=>!id?"":map.get(id)||`Non référencé (${id})`
  const actors:Actor[]=[],seen=new Set<string>();let anomalies=0
  for(const row of data[config.sheet]){
    const id=row[config.id]
    if(!id){if(Object.values(row).some(Boolean))anomalies++;continue}
    if(seen.has(id)){anomalies++;continue}seen.add(id)
    actors.push({id,bwf:row.id_bwf??"",name:row.nom_complet,sex:label(sexes,row.id_sexe??""),birth:row.date_naissance??"",nationality:row.nationalite??"",affiliation:row.date_affiliation,status:label(statuses,row.statut),qualification:config.field?label(qualifications,row[config.field]??""):""})
  }
  return {actors,anomalies}
}
