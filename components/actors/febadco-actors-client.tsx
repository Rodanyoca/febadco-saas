"use client"
import {useEffect,useMemo,useState} from "react"
import {ActorTable} from "./actor-table"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue} from "@/components/ui/select"
import {Button} from "@/components/ui/button"
import {Sheet,SheetContent,SheetDescription,SheetHeader,SheetTitle} from "@/components/ui/sheet"
import {StatusBadge} from "@/components/dashboard/status-badge"
import {formatDateForDisplay} from "@/lib/compact-date"
import {compareLabels} from "@/lib/sort-utils"
import {actorKinds,type Actor,type ActorKind} from "@/lib/febadco/actors-domain"

const normalized=(value:string)=>value.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase("fr")
const date=(value:string)=>formatDateForDisplay(value)||"Non renseignée"
export function FebadcoActorsClient({kind,actors}:{kind:ActorKind;actors:Actor[]}){
  const config=actorKinds[kind]
  const [query,setQuery]=useState(""),[sex,setSex]=useState("all"),[status,setStatus]=useState("all"),[qualification,setQualification]=useState("all"),[sort,setSort]=useState("name-asc"),[page,setPage]=useState(1),[size,setSize]=useState(10),[selected,setSelected]=useState<Actor|null>(null)
  const selectedId=selected?.id??""
  const [contact,setContact]=useState<{id:string;data:Record<string,string>|null;error:string}>({id:"",data:null,error:""})
  const [retry,setRetry]=useState(0)
  useEffect(()=>{
    if(!selectedId)return
    const controller=new AbortController();let active=true
    setContact({id:selectedId,data:null,error:""})
    void fetch(`/api/febadco/actors/${kind}/${encodeURIComponent(selectedId)}`,{cache:"no-store",credentials:"same-origin",signal:controller.signal}).then(async response=>{
      const json=await response.json()
      if(!response.ok)throw new Error(typeof json.error==="string"?json.error:"Lecture impossible.")
      if(active)setContact({id:selectedId,data:json.contact,error:""})
    }).catch(error=>{if(active)setContact({id:selectedId,data:null,error:error instanceof Error?error.message:"Lecture impossible."})})
    return ()=>{active=false;controller.abort()}
  },[kind,selectedId,retry])
  const choices=(field:"sex"|"status"|"qualification")=>[...new Set(actors.map(actor=>actor[field]).filter(Boolean))].sort(compareLabels)
  const rows=useMemo(()=>actors.filter(actor=>(!query.trim()||normalized(`${actor.id} ${actor.name} ${actor.bwf}`).includes(normalized(query.trim())))&&(sex==="all"||actor.sex===sex)&&(status==="all"||actor.status===status)&&(qualification==="all"||actor.qualification===qualification)).sort((a,b)=>compareLabels(sort.startsWith("id")?a.id:a.name,sort.startsWith("id")?b.id:b.name)*(sort.endsWith("desc")?-1:1)),[actors,query,sex,status,qualification,sort])
  const pages=Math.max(1,Math.ceil(rows.length/size)),current=Math.min(page,pages),start=(current-1)*size,visible=rows.slice(start,start+size)
  const field=(label:string,value:string)=><div><dt className="text-xs font-semibold uppercase text-muted-foreground">{label}</dt><dd className="mt-1 break-words text-sm">{value||"Non renseigné"}</dd></div>
  return <div className="space-y-5">
    <div className="grid gap-3 rounded-xl border bg-card p-4 sm:grid-cols-2 xl:grid-cols-4"><div className="space-y-2"><Label htmlFor="actor-search">Rechercher</Label><Input id="actor-search" placeholder="Nom, licence ou ID BWF" value={query} onChange={event=>{setQuery(event.target.value);setPage(1)}}/></div>
      {([{label:"Sexe",value:sex,set:setSex,options:choices("sex")},{label:"Statut",value:status,set:setStatus,options:choices("status")},...(config.field?[{label:config.qualificationLabel,value:qualification,set:setQualification,options:choices("qualification")}]:[])]).map(filter=><div key={filter.label} className="space-y-2"><Label>{filter.label}</Label><Select value={filter.value} onValueChange={value=>{filter.set(value);setPage(1)}}><SelectTrigger className="w-full" aria-label={filter.label}><SelectValue/></SelectTrigger><SelectContent><SelectItem value="all">Tous</SelectItem>{filter.options.map(option=><SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent></Select></div>)}
      <div className="space-y-2"><Label>Trier par</Label><Select value={sort} onValueChange={value=>{setSort(value);setPage(1)}}><SelectTrigger className="w-full" aria-label="Trier par"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="name-asc">Nom A → Z</SelectItem><SelectItem value="name-desc">Nom Z → A</SelectItem><SelectItem value="id-asc">Licence croissante</SelectItem><SelectItem value="id-desc">Licence décroissante</SelectItem></SelectContent></Select></div>
    </div>
    <ActorTable title={config.title} items={visible} onView={setSelected} emptyMessage={actors.length?"Aucun acteur ne correspond à la recherche et aux filtres.":"Aucun acteur enregistré dans cette catégorie."} showId={false} showCount={false} firstColumn={{label:"Licence",value:actor=>actor.id}} nationalIdLabel="ID BWF" personPlaceholder stackSexAge showNiveau={kind==="coachs"} showGrade={kind==="arbitres"} showSpecialite={kind==="medecins"} toRow={actor=>({id:actor.id,nomComplet:actor.name,sexe:actor.sex,dateNaissance:actor.birth,idNational:actor.bwf,idFivb:"",avatarDriveId:"",avatarDriveUrl:"",statut:actor.status,niveau:actor.qualification,grade:actor.qualification,specialite:actor.qualification})}/>
    <div className="flex flex-wrap items-center justify-between gap-3 text-sm"><p role="status">{rows.length?start+1:0}–{Math.min(start+size,rows.length)} sur {rows.length}</p><div className="flex items-center gap-2"><Label htmlFor="actor-page-size">Lignes par page</Label><Select value={String(size)} onValueChange={value=>{setSize(Number(value));setPage(1)}}><SelectTrigger id="actor-page-size" className="w-20"><SelectValue/></SelectTrigger><SelectContent>{[10,25,50,100].map(value=><SelectItem key={value} value={String(value)}>{value}</SelectItem>)}</SelectContent></Select></div><div className="flex items-center gap-2"><Button variant="outline" disabled={current===1} onClick={()=>setPage(current-1)}>Précédent</Button><span>Page {current} / {pages}</span><Button variant="outline" disabled={current===pages} onClick={()=>setPage(current+1)}>Suivant</Button></div></div>
    <Sheet open={selected!==null} onOpenChange={open=>{if(!open)setSelected(null)}}><SheetContent className="w-full overflow-y-auto sm:max-w-xl"><SheetHeader><SheetTitle>{selected?.name||"Fiche acteur"}</SheetTitle><SheetDescription>Fiche fédérale FEBADCO · {selected?.id}</SheetDescription></SheetHeader>{selected&&<div className="space-y-6 p-4"><section className="space-y-4 rounded-xl border p-4"><h2 className="font-semibold">Général</h2><dl className="grid gap-4 sm:grid-cols-2">{field("Licence fédérale",selected.id)}{field("ID BWF",selected.bwf)}{field("Sexe",selected.sex)}{field("Date de naissance",date(selected.birth))}{field("Nationalité",selected.nationality)}</dl><StatusBadge status={selected.status}/></section><section className="space-y-4 rounded-xl border p-4"><h2 className="font-semibold">Coordonnées</h2>{contact.id!==selected.id||!contact.data&&!contact.error?<p role="status">Chargement des coordonnées…</p>:contact.error?<div role="alert"><p className="text-sm">{contact.error}</p><Button variant="outline" className="mt-3" onClick={()=>setRetry(value=>value+1)}>Réessayer</Button></div>:<dl className="grid gap-4 sm:grid-cols-2">{field("Lieu de naissance",contact.data?.lieu_naissance||"")}{field("Téléphone",contact.data?.telephone||"")}{field("Email",contact.data?.email||"")}{field("Adresse",contact.data?.adresse||"")}{field("Observations",contact.data?.observations||"")}</dl>}</section><section className="space-y-4 rounded-xl border p-4"><h2 className="font-semibold">Affiliation à la fédération</h2><dl>{field("Date d’affiliation",date(selected.affiliation))}</dl><p className="text-sm text-muted-foreground">L’identifiant fédéral est la référence de licence, gratuite et permanente.</p></section>{config.field&&<section className="space-y-4 rounded-xl border p-4"><h2 className="font-semibold">{config.qualificationLabel}</h2><dl>{field(config.qualificationLabel,selected.qualification)}</dl></section>}</div>}</SheetContent></Sheet>
  </div>
}
