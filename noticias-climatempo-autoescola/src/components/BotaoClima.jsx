import React from "react";
import clsx from "clsx";

/**
 * BotaoClima
 * Props:
 * - clima: string atual selecionado
 * - setClima: função para atualizar o estado
 * - tipoClima: string do clima deste botão (ex: "Sol", "Chuva")
 * - infoClima: objeto contendo classes para cada clima
 */
export function BotaoClima({ clima, setClima, tipoClima, infoClima }) {
    const classeBotaoPadrao =
        "px-4 py-2 rounded-xl font-medium transition-all duration-300 focus:outline-none cursor-pointer";

    const classes = clsx(
        classeBotaoPadrao,
        clima === tipoClima
            ? infoClima[tipoClima]?.classesBotao
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
    );

    return (
        <button
            className={classes}
            onClick={() => setClima(tipoClima)}
        >
            {infoClima[tipoClima]?.label || tipoClima}
        </button>
    );
}
