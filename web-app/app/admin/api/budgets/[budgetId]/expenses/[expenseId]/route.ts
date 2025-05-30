import { verifySession } from "@/src/auth/dal"
import getToken from "@/src/auth/token"

interface RouteParams {
    budgetId: string
    expenseId: string
}

export async function GET(
    request: Request,
    { params }: { params: Promise<RouteParams> }
) {
    await verifySession()

    const token = await getToken()
    const { budgetId, expenseId } = await params

    const url = `${process.env.API_URL}/budgets/${budgetId}/expenses/${expenseId}`
    const req = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    const json = await req.json()

    if (!req.ok) {
        return Response.json(json.error, { status: 403 })
    }

    return Response.json(json)
}