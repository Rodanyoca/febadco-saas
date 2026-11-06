/* eslint-env node */
/* global structuredClone */
import {performance} from 'node:perf_hooks'
import {writeFileSync,mkdirSync} from 'node:fs'
import {createReadClient} from '../lib/febadco/read-client.ts'
const matrix=[['id','nom'],...Array.from({length:1000},(_,i)=>[String(i).padStart(6,'0'),'Synthetique '+i])]
async function sample(shared) {
  let calls=0
  const raw=async()=>{calls++;await new Promise(r=>setImmediate(r));return [structuredClone(matrix)]}
  const reader=createReadClient(raw),cpu=process.cpuUsage(),t=performance.now()
  const result=shared?await Promise.all([reader.read('SYNTH',['A']),reader.read('SYNTH',['A'])]):await Promise.all([raw(),raw()])
  const usage=process.cpuUsage(cpu)
  const first=shared?Object.values(result[0])[0]:result[0][0]
  return {mode:shared?'dedup':'independent',cpuMs:(usage.user+usage.system)/1000,elapsedMs:performance.now()-t,simulatedReads:calls,sourceRows:calls*1000,returnedRows:2000,responseBytes:Buffer.byteLength(JSON.stringify(first)),equivalent:JSON.stringify(first)===JSON.stringify(matrix)}
}
for(let i=0;i<5;i++){await sample(false);await sample(true)}
const results=[]
for(let i=0;i<8;i++)for(const mode of (i%2?[true,false]:[false,true]))results.push(await sample(mode))
const report={synthetic:true,googleCalls:0,warmupPairs:5,alternatingPairs:8,limitations:'No Google or network latency; process CPU timer is coarse; no application baseline or Vercel CPU claim.',results}
mkdirSync('docs/performance/lot1',{recursive:true})
writeFileSync('docs/performance/lot1/synthetic.json',JSON.stringify(report,null,2)+'\n')
console.log(JSON.stringify(report))
