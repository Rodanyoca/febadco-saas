/* eslint-env node */
/* global document, innerWidth */
import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'
// Tooling only, no business source imported from these repositories.
const {buildSync}=await import(process.env.ESBUILD_MODULE||'../../fecot-managment/node_modules/esbuild/lib/main.js')
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'../../fevoco-managment/node_modules/playwright/index.mjs')
const source=`import React from 'react';import{createRoot}from'react-dom/client';import{FebadcoActorsClient}from'./components/actors/febadco-actors-client';const actors=Array.from({length:32},(_,i)=>({id:'TEST-'+String(i+1).padStart(4,'0'),bwf:'BWF-'+(i+1),name:'Synthétique '+String(i+1).padStart(2,'0'),sex:i%2?'FEMININ':'MASCULIN',birth:'2000-01-01',nationality:'TEST',affiliation:'2026-01-01',status:i%2?'INACTIF':'ACTIF',qualification:''}));createRoot(document.getElementById('root')).render(<FebadcoActorsClient kind="athletes" actors={actors}/>);`
const js=buildSync({stdin:{contents:source,loader:'tsx',resolveDir:process.cwd()},bundle:true,write:false,platform:'browser',jsx:'automatic',define:{'process.env.NODE_ENV':'"production"'},tsconfig:'tsconfig.json'}).outputFiles[0].text
const cssDir='.next/dev/static/chunks',css=fs.readdirSync(cssDir).filter(file=>file.endsWith('.css')).map(file=>fs.readFileSync(path.join(cssDir,file),'utf8')).join('\n')
;(async()=>{
 const browser=await chromium.launch()
 try{
  for(const viewport of [{width:1440,height:900},{width:390,height:844}]){
   const page=await browser.newPage({viewport}),errors=[];let calls=0
   page.on('pageerror',e=>errors.push(e.message))
   await page.route('**/__febadco-ui-check',r=>r.fulfill({contentType:'text/html',body:`<html lang="fr"><head><style>${css}</style></head><body><main class="p-4"><div id="root"></div></main><script src="/synthetic-actors.js"></script></body></html>`}))
   await page.route('**/synthetic-actors.js',r=>r.fulfill({contentType:'application/javascript',body:js}))
   await page.route('**/api/febadco/actors/**',async r=>{calls++;const id=r.request().url().split('/').at(-1);if(id==='TEST-0001')await new Promise(resolve=>setTimeout(resolve,700));await r.fulfill({json:{contact:{telephone:'TEST',email:id+'@example.invalid'}}}).catch(()=>{})})
   await page.goto('http://localhost:3006/__febadco-ui-check')
   await page.getByText('1–10 sur 32',{exact:true}).waitFor()
   await page.getByRole('button',{name:'Suivant',exact:true}).click()
   await page.getByText('11–20 sur 32',{exact:true}).waitFor()
   await page.getByRole('combobox',{name:'Lignes par page'}).click();await page.getByRole('option',{name:'25',exact:true}).click()
   await page.getByText('1–25 sur 32',{exact:true}).waitFor()
   await page.getByLabel('Rechercher',{exact:true}).fill('ABSENT')
   await page.getByText('0–0 sur 0',{exact:true}).waitFor()
   await page.getByLabel('Rechercher',{exact:true}).fill('BWF-32')
   await page.getByText('1–1 sur 1',{exact:true}).waitFor()
   assert.equal(calls,0)
   await page.getByRole('button',{name:'Voir Synthétique 32',exact:true}).filter({visible:true}).click()
   await page.getByRole('dialog').getByText('TEST-0032@example.invalid',{exact:true}).waitFor()
   assert.equal(calls,1)
   await page.keyboard.press('Escape')
   await page.getByLabel('Rechercher',{exact:true}).fill('')
   await page.getByRole('combobox',{name:'Statut',exact:true}).click();await page.getByRole('option',{name:'ACTIF',exact:true}).click()
   await page.getByText('1–16 sur 16',{exact:true}).waitFor()
   assert.equal(calls,1)
   await page.getByRole('button',{name:'Voir Synthétique 01',exact:true}).filter({visible:true}).click()
   await page.keyboard.press('Escape')
   await page.getByRole('button',{name:'Voir Synthétique 03',exact:true}).filter({visible:true}).click()
   await page.getByRole('dialog').getByText('TEST-0003@example.invalid',{exact:true}).waitFor()
   await page.waitForTimeout(800)
   assert.equal(await page.getByRole('dialog').getByText('TEST-0001@example.invalid',{exact:true}).count(),0)
   await page.keyboard.press('Escape')
   assert.equal(calls,3);assert.deepEqual(errors,[])
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false)
   fs.mkdirSync('docs/performance/actors',{recursive:true});await page.screenshot({path:'docs/performance/actors/synthetic-'+viewport.width+'.png',fullPage:true})
   console.log(JSON.stringify({viewport,search:true,pagination:true,pageSize:true,empty:true,filters:true,detailCalls:calls,errors:errors.length}))
   await page.close()
  }
 }finally{await browser.close()}
})().catch(error=>{console.error(error.message);process.exitCode=1})
