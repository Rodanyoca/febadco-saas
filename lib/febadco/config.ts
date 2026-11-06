export const workbookVariables = {
  referentiel: "FEBADCO_REFERENTIELS_SPREADSHEET_ID",
  acteurs: "FEBADCO_ACTEURS_SPREADSHEET_ID",
  competitions: "FEBADCO_COMPETITIONS_SPREADSHEET_ID",
  activites: "FEBADCO_ACTIVITES_SPREADSHEET_ID",
  documents: "FEBADCO_DOCUMENTS_SPREADSHEET_ID",
} as const
export type Workbook = keyof typeof workbookVariables
export function readConfiguration(source: Record<string, string | undefined>) {
  const required = (key: string) => {
    const value = source[key]?.trim() ?? ""
    if (!value || /^(exemple|example|a_renseigner|fictif|local-)/i.test(value)) throw new Error(`Configuration manquante : ${key}`)
    return value
  }
  return {
    email: required("GOOGLE_CLIENT_EMAIL"),
    privateKey: required("GOOGLE_PRIVATE_KEY").replace(/\\n/g, "\n"),
    books: Object.fromEntries(Object.entries(workbookVariables).map(([key, name]) => [key, required(name)])) as Record<Workbook, string>,
  }
}
