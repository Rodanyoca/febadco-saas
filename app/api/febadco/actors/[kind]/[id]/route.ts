import {NextResponse} from "next/server"
import {actorKinds,loadActorContact,type ActorKind} from "@/lib/febadco/actors-domain"
import {readFebadcoSheets} from "@/lib/febadco/sheets-server"
export async function GET(_request:Request,{params}:{params:Promise<{kind:string;id:string}>}){
  const {kind,id}=await params
  if(!Object.prototype.hasOwnProperty.call(actorKinds,kind)||!id.trim())return NextResponse.json({error:"Acteur introuvable."},{status:404})
  try{return NextResponse.json({contact:await loadActorContact(kind as ActorKind,id,readFebadcoSheets)},{headers:{"Cache-Control":"private, no-store"}})}catch(error){
    const code=error instanceof Error?error.message:""
    const status=code==="ACTOR_NOT_FOUND"?404:code==="ACTOR_AMBIGUOUS"?409:503
    return NextResponse.json({error:status===404?"Acteur introuvable.":status===409?"Identifiant dupliqué : fiche à vérifier.":"Lecture de la fiche impossible. Réessayez dans quelques instants."},{status})
  }
}
