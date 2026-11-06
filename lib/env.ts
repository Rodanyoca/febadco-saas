/** Local FEBADCO interface preview. No credentials or remote resources are loaded. */
export const env = { googleSheets: {
  spreadsheetId: "local-febadco-spreadsheetId",
  territorialSpreadsheetId: "",
  acteursSpreadsheetId: "local-febadco-acteursSpreadsheetId",
  affiliationsSpreadsheetId: "",
  licencesSpreadsheetId: "",
  competitionsSpreadsheetId: "local-febadco-competitionsSpreadsheetId",
  activitiesSpreadsheetId: "local-febadco-activitiesSpreadsheetId",
  documentsSpreadsheetId: "local-febadco-documentsSpreadsheetId",
  equipeNationaleSpreadsheetId: "",
  referentielsSpreadsheetId: "local-febadco-referentielsSpreadsheetId",
  documentsDriveFolderId: "", clubLogosDriveFolderId: "", clientEmail: "", privateKey: "",
} } as const
export function isGoogleSheetsConfigured(): boolean { return false }
export function isTerritorialGoogleSheetsConfigured(): boolean { return false }
export function isActeursGoogleSheetsConfigured(): boolean { return false }
export function isAffiliationsGoogleSheetsConfigured(): boolean { return false }
export function isLicencesGoogleSheetsConfigured(): boolean { return false }
export function isCompetitionsGoogleSheetsConfigured(): boolean { return false }
export function isActivitiesGoogleSheetsConfigured(): boolean { return false }
export function isDocumentsGoogleSheetsConfigured(): boolean { return false }
export function isEquipeNationaleGoogleSheetsConfigured(): boolean { return false }
