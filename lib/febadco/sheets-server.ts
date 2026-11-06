import "server-only"
import {readConfiguration,type Workbook} from "./config"
import {createReadClient} from "./read-client"
const client=createReadClient(async(spreadsheetId,ranges)=>{
  const config=readConfiguration(process.env)
  const {sheets,auth:authClient}=await import("googleapis/build/src/apis/sheets")
  const auth=new authClient.JWT({email:config.email,key:config.privateKey,scopes:["https://www.googleapis.com/auth/spreadsheets.readonly"]})
  const response=await sheets({version:"v4",auth}).spreadsheets.values.batchGet({spreadsheetId,ranges,fields:"valueRanges(values)"},{timeout:15000,retry:false})
  return (response.data.valueRanges??[]).map(value=>value.values??[])
})
export function readFebadcoSheets(book:Workbook,ranges:string[]){
  const config=readConfiguration(process.env)
  return client.read(config.books[book],ranges)
}
