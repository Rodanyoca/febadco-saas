import test from "node:test"
import assert from "node:assert/strict"
// @ts-expect-error Node's transform-types runner requires an explicit TypeScript extension.
import { dashboardNavigation, hydrationSafePathname, isNavigationItemActive } from "./navigation.ts"

test("le premier rendu de navigation est stable entre serveur et client", () => {
  const serverPath = hydrationSafePathname("/licences", false)
  const firstClientPath = hydrationSafePathname("/licences/entourage", false)
  assert.equal(serverPath, "")
  assert.equal(firstClientPath, serverPath)
  assert.equal(hydrationSafePathname("/licences/entourage", true), "/licences/entourage")
})

test("chaque page de navigation est rendue comme un lien stable", () => {
  const leaves = dashboardNavigation.flatMap((item) => item.children ?? [item])
  assert.ok(leaves.every((item) => Boolean(item.href)))
})

test("Activités et Documents appartiennent à la section Administration", () => {
  const administration = dashboardNavigation.find((item) => item.name === "Administration")
  assert.deepEqual(administration?.children?.map((item) => item.href), ["/activites", "/documents"])
  assert.equal(administration?.icon, undefined)
})

test("le profil simplifié ne propose que les quatre blocs autorisés", () => {
  assert.deepEqual(dashboardNavigation.map(item => item.name), ["Tableau de bord", "Acteurs", "Compétitions", "Administration"])
  const leaves = dashboardNavigation.flatMap(item => item.children ?? [item])
  assert.deepEqual(leaves.map(item => item.href), ["/", "/athletes", "/coachs", "/arbitres", "/medecins", "/officiels", "/autres-acteurs", "/competitions", "/activites", "/documents"])
})

test("une entrée non exacte reste active sur ses vues détaillées", () => {
  const athletes = dashboardNavigation.find((item) => item.name === "Acteurs")?.children?.find((item) => item.name === "Athlètes")
  assert.ok(athletes)
  assert.equal(isNavigationItemActive(athletes, "/athletes/ATH001"), true)
})

test("Autres acteurs suit Officiels dans la section Acteurs", () => {
  const acteurs = dashboardNavigation.find((item) => item.name === "Acteurs")
  assert.deepEqual(acteurs?.children?.map((item) => item.name), ["Athlètes", "Entraîneurs", "Arbitres", "Médecins", "Officiels", "Autres acteurs"])
  assert.equal(acteurs?.children?.at(-1)?.href, "/autres-acteurs")
})
