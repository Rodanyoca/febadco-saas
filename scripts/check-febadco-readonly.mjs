/* eslint-env node */
import nextEnv from '@next/env'
import {readConfiguration} from '../lib/febadco/config.ts'
import {createReadClient, mapHeaderRows} from '../lib/febadco/read-client.ts'
nextEnv.loadEnvConfig(process.cwd())
async function main() {
  const config = readConfiguration(process.env)
  // Validate presence first: missing values cause zero Google calls.
  const {google} = await import('googleapis')
  const auth = new google.auth.JWT({email:config.email,key:config.privateKey,scopes:['https://www.googleapis.com/auth/spreadsheets.readonly']})
  const sheets = google.sheets({version:'v4',auth})
  let calls = 0
  const client = createReadClient(async (id,ranges) => {
    calls++
    const r = await sheets.spreadsheets.values.batchGet({spreadsheetId:id,ranges},{timeout:15000,retry:false})
    return (r.data.valueRanges ?? []).map(item=>item.values ?? [])
  })
  const expected = {referentiel:['PARAMETRES_SYSTEME','FORMATS_ID'],acteurs:['ATHLETES','COACHS','ARBITRES','OFFICIELS','MEDECINS','AUTRES'],competitions:['COMPETITIONS','COMPETITIONS_RESULTATS','COMPETITIONS_SETS','COMPETITIONS_RENCONTRES_EQUIPES'],activites:['ACTIVITES','ACTIVITES_ENTITES','ACTIVITES_PARTICIPANTS'],documents:['DOCUMENTS','DOCUMENTS_FICHIERS','DOCUMENTS_RELATIONS']}
  for(const [book,id] of Object.entries(config.books)) {
    calls++
    const r = await sheets.spreadsheets.get({spreadsheetId:id,fields:'properties(title),sheets(properties(title,gridProperties(columnCount)))'},{timeout:15000,retry:false})
    if(!r.data.properties?.title?.includes('FEBADCO')) throw new Error('WRONG_FEDERATION')
    const tabs = r.data.sheets.map(s=>s.properties)
    if(expected[book].some(name=>!tabs.some(tab=>tab.title===name))) throw new Error('MISSING_SHEETS')
    const ranges = expected[book].map(name=>"'"+name+"'!A1:"+column(tabs.find(t=>t.title===name).gridProperties.columnCount)+'1')
    const data = await client.read(id,ranges)
    for(const matrix of Object.values(data)) mapHeaderRows(matrix)
    console.log(JSON.stringify({bloc:book,connexion:'OK',entetes:'OK',feuilles:expected[book].length}))
  }
  console.log(JSON.stringify({lecturesGoogle:calls,ecritures:0,lignesMetierLues:0}))
}
function column(n) { let s='';for(;n;n=Math.floor((n-1)/26))s=String.fromCharCode(65+(n-1)%26)+s;return s }
main().catch(error=>{
  const known=String(error?.message??'').match(/^Configuration manquante : [A-Z_]+$/)?.[0]
  console.error(known ?? JSON.stringify({connexion:'ECHEC',code:String(error?.code??'SOURCE_UNAVAILABLE').replace(/[^A-Z0-9_]/gi,'').slice(0,40)}))
  process.exitCode=1
})
