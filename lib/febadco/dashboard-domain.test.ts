import test from "node:test"
import assert from "node:assert/strict"
// @ts-expect-error Explicit extension required by the Node test runner.
import {projection,summarize,loadDashboard,dashboardSources,columnName} from "./dashboard-domain.ts"
import type {Matrix} from "./read-client.ts"
const source=dashboardSources.acteurs[0]
test("projection réelle par en-tête réordonné, aucun champ personnel",()=>{
  assert.deepEqual(projection(source,[["numero_passeport","statut","nom_complet","id_athlete"]]),[{field:"id_athlete",range:"'ATHLETES'!D2:D"},{field:"statut",range:"'ATHLETES'!B2:B"}])
  assert.equal(columnName(26),"AA")
  assert.throws(()=>projection(source,[["id_athlete"]]))
  assert.throws(()=>projection(source,[["id_athlete","statut","statut"]]))
})
test("zéros, doublons, lignes incomplètes et statuts inconnus distincts",()=>{
  const r=summarize(source,{id_athlete:[["001"],["001"],["002"],["003"],["004"],["005"],[""],["006"]],statut:[["ACTIF"],["ACTIF"],["INACTIF"],["SUSPENDU"],["DECEDE"],[""],["ACTIF"],["INCONNU"]]})
  assert.deepEqual(r,{label:"Athlètes",total:6,active:1,inactive:1,suspended:1,other:2,unknown:1,duplicates:1,missingId:1})
  assert.equal(summarize(source,{id_athlete:[],statut:[]}).total,0)
})
function mockRead(fail?:string){const calls:string[][]=[];return {calls,read:async(block:string,ranges:string[])=>{
  calls.push(ranges)
  if(block===fail)throw new Error("403 SOURCE_UNAVAILABLE")
  return Object.fromEntries(ranges.map(range=>{
    const sheet=range.split("'")[1]
    const spec=Object.values(dashboardSources).flat().find(item=>item.sheet===sheet)!
    const matrix:Matrix=range.endsWith("1:1")?[[spec.id,"statut"]]:range.includes("A2:A")?[["00001"]]:[["ACTIF"]]
    return [range,matrix]
  }))
}}}
test("huit batchs au total, six catégories incluses, résultat agrégé sans identité",async()=>{
  const m=mockRead();const rows=await loadDashboard(m.read)
  assert.equal(m.calls.length,8);assert.equal(rows[0].rows.reduce((sum,r)=>sum+r.total,0),6)
  assert.ok(rows.every(r=>!r.error));assert.ok(!JSON.stringify(rows).includes("00001"))
  assert.ok(m.calls.flat().every(range=>/1:1|[AB]2:[AB]/.test(range)))
})
test("refus/panne d'un bloc : indisponible, autres sources conservées",async()=>{
  const m=mockRead("acteurs"),rows=await loadDashboard(m.read)
  assert.equal(rows[0].error,true);assert.deepEqual(rows[0].rows,[])
  assert.ok(rows.slice(1).every(r=>!r.error&&r.rows[0].total===1));assert.equal(m.calls.length,7)
})
test("configuration absente : quatre blocs indisponibles, aucune donnée fictive",async()=>{
  const rows=await loadDashboard(async()=>{throw new Error("MISSING_CONFIG")})
  assert.ok(rows.every(r=>r.error&&r.rows.length===0))
})
