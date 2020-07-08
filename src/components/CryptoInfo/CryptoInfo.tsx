import React, { useEffect, useState } from "react";

interface Props {
    cryptoSymbol: string;
    convertTo: string;
}

interface CryptoData {
    currentPrice: string;
    netChange: string;
}

function netChange(num1: number, num2: number) {
    return (((num2 - num1) / num1) * 100).toFixed(2).toString() + "%";
}

const CryptoInfo: React.FC<Props> = ({ cryptoSymbol, convertTo }) => {
    const [cryptoData, setCryptoData] = useState<CryptoData>({
        currentPrice: "Loading...",
        netChange: "Loading...",
    });
    const CURRENT_PRICE = `https://min-api.cryptocompare.com/data/price?fsym=${cryptoSymbol}&tsyms=${convertTo}`;
    const CRYPTO_API = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${cryptoSymbol}&tsym=${convertTo}&limit=100`;
    //[X] Current Price
    //[] Change(In percentage how much does the price change)
    useEffect(() => {
        fetch(CURRENT_PRICE)
            .then((resp) => resp.json())
            .then((resp) => {
                const currentPrice =
                    Object.values<string>(resp)[0] + " " + convertTo;
                setCryptoData((prev) => ({
                    ...prev,
                    currentPrice,
                }));
            });
        return () => {};
    }, [CURRENT_PRICE, convertTo, cryptoSymbol]);

    useEffect(() => {
        fetch(CRYPTO_API)
            .then((resp) => resp.json())
            .then(({ Data }) => {
                const latest: number = Data.Data[0].close;
                const oldest: number = Data.Data[Data.Data.length - 1].close;
                const calcNetChange = netChange(latest, oldest);
                setCryptoData((prev) => ({
                    ...prev,
                    netChange: calcNetChange,
                }));
            });
        return () => {};
    }, [CRYPTO_API, convertTo, cryptoSymbol]);
    return (
        <>
            <h1>Current price: {cryptoData.currentPrice}</h1>
            <h1>
                Change:{" "}
                <span
                    style={{
                        color:
                            cryptoData.netChange[0] !== "-"
                                ? cryptoData.netChange === "Loading..."
                                    ? "black"
                                    : "green"
                                : "red",
                    }}
                >
                    {cryptoData.netChange}
                </span>
            </h1>
        </>
    );
};
export default CryptoInfo;
