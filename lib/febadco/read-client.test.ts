import test from "node:test"
import assert from "node:assert/strict"
// @ts-expect-error Explicit extension required by the Node test runner.
import {createReadClient, mapHeaderRows} from "./read-client.ts"
// @ts-expect-error Explicit extension required by the Node test runner.
import {readConfiguration} from "./config.ts"
test("configuration absente : arrêt avant accès source", () => {
  assert.throws(()=>readConfiguration({}), /GOOGLE_CLIENT_EMAIL/)
  assert.throws(()=>readConfiguration({GOOGLE_CLIENT_EMAIL:"exemple"}), /GOOGLE_CLIENT_EMAIL/)
})
test("mapping par en-tête, zéros et cellules vides", () => {
  assert.deepEqual(mapHeaderRows([["nom","id","date"],["Test","0001"],[null,null,null]]),[{nom:"Test",id:"0001",date:""}])
  assert.throws(()=>mapHeaderRows([["id","id"]]), /dupliqués/)
  assert.throws(()=>mapHeaderRows([]), /absents/)
})
test("concurrence : une lecture identique mutualisée, sans cache persistant", async () => {
  let calls=0
  const client=createReadClient(async()=>{calls++;await new Promise(r=>setTimeout(r,5));return [[["id"],["001"]],[["id"],["002"]]]})
  const [a,b]=await Promise.all([client.read("SOURCE",["B","A","A"]),client.read("SOURCE",["A","B"])])
  assert.equal(calls,1);assert.deepEqual(a,b)
  await client.read("SOURCE",["A","B"]);assert.equal(calls,2)
})
test("panne source : aucun repli et promesse rejetée libérée", async () => {
  let calls=0
  const client=createReadClient(async()=>{calls++;throw new Error("SOURCE_UNAVAILABLE")})
  const results=await Promise.allSettled([client.read("SOURCE",["A"]),client.read("SOURCE",["A"])])
  assert.ok(results.every(r=>r.status==="rejected"));assert.equal(calls,1)
  await assert.rejects(client.read("SOURCE",["A"]));assert.equal(calls,2)
})
test("sources distinctes, réponse incomplète et plages invalides", async () => {
  let calls=0
  const client=createReadClient(async()=>{calls++;return []})
  await Promise.all([assert.rejects(client.read("ONE",["A"]),/incomplète/),assert.rejects(client.read("TWO",["A"]),/incomplète/)])
  assert.equal(calls,2);await assert.rejects(client.read("",["A"]));assert.equal(calls,2)
})
