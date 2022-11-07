const COIN_GECKO_IDS_BY_DENOM_ADDRESS: any = {
    "ukuji": "kujira",
    // mainnet
    // ATOM
    "ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2": "cosmos",

    // USK
    "factory/kujira1qk00h5atutpsv900x202pxx42npjr9thg58dnqpa72f2p7m2luase444a7/uusk": "usk",

    // axlUSDC
    "ibc/295548A78785A1007F232DE286149A6FF512F180AF5657780FC89C009E2C348F": "usd-coin",

    // JUNO
    "ibc/EFF323CC632EC4F747C61BCE238A758EFDB7699C3226565F7C20DA06509D59A5": "juno-network",

    // OSMO
    "ibc/47BD209179859CDE4A2806763D7189B6E6FE13A17880FE2B42DE1E6C1E329E23": "osmosis",

    // wETH
    "ibc/1B38805B1C75352B28169284F96DF56BDEBD9E8FAC005BDCC8CF0378C82AA8E7": "weth",

    // testnet
    // DEMO (using evmos just to return some value)
    "factory/kujira1ltvwg69sw3c5z99c6rr08hal7v0kdzfxz07yj5/demo": "evmos",

    // USK
    "factory/kujira1r85reqy6h0lu02vyz0hnzhv5whsns55gdt4w0d7ft87utzk7u0wqr4ssll/uusk": "usk",

    // axlUSDC
    "ibc/F91EA2C0A23697A1048E08C2F787E3A58AC6F706A1CD2257A504925158CFC0F3": "usd-coin",

    // NBTC
    "ibc/784AEA7C1DC3C62F9A04EB8DC3A3D1DCB7B03BA8CB2476C5825FA0C155D3018E": "bitcoin",

    // LUNA
    "ibc/A1E1A20C1E4F2F76F301DA625CC476FBD0FCD8CA94DAF60814CA5257B6CD3E3E": "terra-luna",

    // OSMO
    "ibc/ED07A3391A112B175915CD8FAF43A2DA8E4790EDE12566649D0C2F97716B8518": "osmosis"
}

const coinGeckoUrl = 'https://api.coingecko.com/api/v3/simple/price'

// get all currencies because API is rate limited to 50 calls per minute
export async function getAllCoinGeckoPrices() {

    const query = `?ids=${Object
        .keys(COIN_GECKO_IDS_BY_DENOM_ADDRESS)
        .map(cgid => COIN_GECKO_IDS_BY_DENOM_ADDRESS[cgid])
        .join(',')}&vs_currencies=usd`

    const res = await fetch(
        coinGeckoUrl + query
    )
    return res.body
}