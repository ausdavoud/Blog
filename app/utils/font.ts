import { NextFont } from "next/dist/compiled/@next/font"
import { EB_Garamond, Nunito, Vazirmatn } from "next/font/google"
const nunito = Nunito({ subsets: ['latin'] })
const vazirmant = Vazirmatn({ subsets: ['arabic'] })
const eb_garamond = EB_Garamond({subsets: ['latin']})

const fonts: NextFont[] | NextFont = [eb_garamond, nunito, vazirmant]

export default fonts