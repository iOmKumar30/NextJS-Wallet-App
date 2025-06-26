
import { requireAuth } from "../../lib/requireAuth"


export default async function () {
    const userId = await requireAuth();
    return (
        <div>
            Dashboard Page
        </div>
    )
}