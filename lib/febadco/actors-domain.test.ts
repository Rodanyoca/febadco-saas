import test from "node:test"
import assert from "node:assert/strict"
// @ts-expect-error Explicit extension required by the Node test runner.
import {actorKinds,loadActors,loadActorContact,planProjection,type ActorKind} from "./actors-domain.ts"
import type {Matrix} from "./read-client.ts"
function fixture(kind:ActorKind){
  const config=actorKinds[kind],calls:Array<{book:string;ranges:string[]}>=[]
  const data:Record<string,Matrix>={
    SEXES:[["nom_sexe","id_sexe"],["FEMININ","S1"]],STATUTS_ACTEURS:[["id_statut_acteur","nom_statut_acteur"],["ACTIF","ACTIF"]],
    [config.sheet]:[["numero_passeport",config.id,"nom_complet","date_affiliation","statut","id_sexe","date_naissance","id_bwf",...(config.field?[config.field]:[])],["SECRET-NE-PAS-LIRE","000001","Test synthétique","2026-01-01","ACTIF","S1","2000-02-29","000012",...(config.field?["REF001"]:[])]],
  }
  if(config.reference)data[config.reference]=[[config.referenceId,config.referenceLabel],["REF001","LIBELLE TEST"]]
  const read=async(book:"acteurs"|"referentiel",ranges:string[])=>{
    calls.push({book,ranges})
    return Object.fromEntries(ranges.map(range=>{
      const name=range.split("'")[1],matrix=data[name]
      if(range.endsWith("1:1"))return [range,[matrix[0]]]
      const letters=range.split("!")[1].split("2:")[0]
      const index=[...letters].reduce((sum,char)=>sum*26+char.charCodeAt(0)-64,0)-1
      return [range,matrix.slice(1).map(row=>[row[index]??""]) ]
    }))
  }
  return {read,calls,data,config}
}
test("six catégories : vrais en-têtes, zéros, affiliation directe et libellés",async()=>{
  for(const kind of Object.keys(actorKinds) as ActorKind[]){
    const f=fixture(kind),r=await loadActors(kind,f.read)
    assert.equal(r.actors[0].id,"000001");assert.equal(r.actors[0].bwf,"000012");assert.equal(r.actors[0].affiliation,"2026-01-01")
    assert.equal(r.actors[0].sex,"FEMININ");assert.equal(r.actors[0].qualification,f.config.field?"LIBELLE TEST":"")
    assert.equal(f.calls.length,4);assert.ok(!JSON.stringify(r).includes("SECRET-NE-PAS-LIRE"))
    assert.ok(f.calls.filter(c=>c.book==="acteurs").flatMap(c=>c.ranges).every(range=>!range.includes("!A2:A")))
  }
})
test("vide réel, doublons et id absent sans fausses fiches",async()=>{
  const f=fixture("athletes"),matrix=f.data.ATHLETES
  matrix.push([...matrix[1]],["", "", "sans identifiant"])
  const r=await loadActors("athletes",f.read);assert.equal(r.actors.length,1);assert.equal(r.anomalies,2)
  f.data.ATHLETES=[matrix[0]];assert.deepEqual(await loadActors("athletes",f.read),{actors:[],anomalies:0})
})
test("référence inconnue conservée, champ facultatif vide et dates non inventées",async()=>{
  const f=fixture("coachs");f.data.COACHS[1][6]="";f.data.NIVEAU_COACH=[f.data.NIVEAU_COACH[0]]
  const r=await loadActors("coachs",f.read);assert.equal(r.actors[0].birth,"");assert.equal(r.actors[0].qualification,"Non référencé (REF001)")
})
test("en-tête obligatoire absent/dupliqué et panne source : échec sans démo",async()=>{
  assert.throws(()=>planProjection({sheet:"X",required:["id"],optional:[]},[["id","id"]]))
  const f=fixture("athletes");f.data.ATHLETES[0][1]="ancien_id";await assert.rejects(loadActors("athletes",f.read))
  await assert.rejects(loadActors("athletes",async()=>{throw new Error("403 SOURCE_UNAVAILABLE")}))
})
test("coordonnées à la demande : une seule ligne, jamais le passeport",async()=>{
  const calls:string[][]=[]
  const result=await loadActorContact("athletes","B",async(_book,ranges)=>{
    calls.push(ranges)
    return Object.fromEntries(ranges.map(range=>[range,range.endsWith("1:1")?[["id_athlete","nom_complet","email","numero_passeport","telephone"]]:range.endsWith("A2:A")?[["A"],["B"]]:range.endsWith("C3")?[["synth@example.invalid"]]:[["0000"]]]))
  })
  assert.equal(calls.length,3);assert.deepEqual(calls[2],["'ATHLETES'!E3","'ATHLETES'!C3"])
  assert.deepEqual(result,{telephone:"0000",email:"synth@example.invalid"})
})
test("fiche inconnue ou identifiant ambigu : coordonnées non chargées",async()=>{
  for(const ids of [[["OTHER"]],[["B"],["B"]]]){
    let calls=0
    await assert.rejects(loadActorContact("athletes","B",async(_book,ranges)=>{
      calls++;return {[ranges[0]]:ranges[0].endsWith("1:1")?[["id_athlete","email"]]:ids}
    }),/ACTOR_NOT_FOUND|ACTOR_AMBIGUOUS/)
    assert.equal(calls,2)
  }
})
