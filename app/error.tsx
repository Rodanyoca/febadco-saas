"use client"

import {DashboardLayout} from "@/components/dashboard/dashboard-layout"
import {Header} from "@/components/dashboard/header"
import {Button} from "@/components/ui/button"

export default function ErrorPage({reset}:{reset:()=>void}) {
  return <DashboardLayout><Header title="Données indisponibles"/><div className="space-y-4 p-4 sm:p-6"><div role="alert" className="rounded-lg border p-4 text-sm">Ce parcours ne peut pas charger ses données. Les modules en cours de raccordement ne présentent aucun exemple fictif.</div><Button variant="outline" onClick={reset}>Réessayer</Button></div></DashboardLayout>
}
