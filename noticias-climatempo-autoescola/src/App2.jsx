import React, { useState } from 'react';
import { clsx } from "clsx";
import {BotaoClima } from "./components/BotaoClima";
// Todo o seu aplicativo está neste componente 'App'
// Não precisamos importar CSS porque estamos usando classes do Tailwind.
function App2() {

    // --- Lógica do Módulo de Clima ---

    // 1. O "Estado" (State) do React
    // Esta é a variável JavaScript que vai controlar nosso módulo.
const [clima, setClima] = useState('Sol'); // O valor inicial é 'Sol'

    // 2. Lógica JavaScript para definir o conteúdo
    // Um objeto que guarda as classes do Tailwind e os textos para cada clima.
const infoClima = {
  'Sol': {
     titulo: '☀️ Sol Intenso',
     texto: 'Com sol forte, o asfalto quente pode desgastar pneus. O reflexo pode ofuscar a visão. Use óculos de sol e mantenha distância!',
     classesCard: 'bg-yellow-50 border-yellow-300 text-yellow-800',
     classesBotao: 'bg-yellow-500 text-white'
  },
  'Chuva': {
     titulo: '🌧️ Chuva e Pista Molhada',
     texto: 'Pista molhada diminui a aderência e a visibilidade. Risco de aquaplanagem. Reduza a velocidade e acenda o farol baixo!',
     classesCard: 'bg-blue-50 border-blue-300 text-blue-800',
     classesBotao: 'bg-blue-500 text-white'
   },
  'Neblina': {
     titulo: '🌫️ Neblina Densa',
     texto: 'Visibilidade drasticamente reduzida. Use o farol de neblina (se tiver) e nunca o farol alto. Redobre a atenção e reduza a velocidade.',
     classesCard: 'bg-gray-100 border-gray-300 text-gray-800',
     classesBotao: 'bg-gray-500 text-white'
    }
    };

  //const infoClima = {
  //      Sol: {
  //          classesBotao:
  //              "bg-yellow-400 text-yellow-900 hover:bg-yellow-500",
  //      },
  //      Chuva: {
  //          classesBotao:
  //              "bg-blue-500 text-white hover:bg-blue-600",
  //      },
  //      Neblina: {
  //          classesBotao:
  //              "bg-gray-400 text-white hover:bg-gray-500",
  //      },
  //  };

    // 3. Seleciona o conteúdo atual com base no estado 'clima'
const infoAtual = infoClima[clima];
//const classeBotaoPadrao = "px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700";
 //   interface ButtonProps {
 //       disabled?: boolean;
 //       children: React.ReactNode;
 //   }

 //   export const Button = ({ disabled, children }: ButtonProps) => {
 //       const buttonClass = clsx(
 //           "px-4 py-2 rounded-lg transition",
 //           disabled
 //               ? "bg-gray-400 text-gray-700 cursor-not-allowed"
 //               : "bg-blue-600 text-white hover:bg-blue-700 cursor-[url('/cursor-hand.png'),pointer]"
 //       );

 //       return <button className={buttonClass} disabled={disabled}>{children}</button>;
 //   };        disabled?: boolean;
 //       children: React.ReactNode;
 //};

 //   export const Button = ({ disabled, children }: ButtonProps) => {
 //       const buttonClass = clsx(
 //           "px-4 py-2 rounded-lg transition",
 //           disabled
 //               ? "bg-gray-400 text-gray-700 cursor-not-allowed"
 //               : "bg-blue-600 text-white hover:bg-blue-700 cursor-[url('/cursor-hand.png'),pointer]"
 //       );
 //   };

    // --- Fim da Lógica ---

    // O 'return' contém seu HTML convertido para JSX (class -> className)
return (
    <div className="bg-gray-50 min-h-screen font-sans">
            {/* ============================= */}
            {/* 👑 Cabeçalho (Header) */}
            {/* ============================= */}
        {/*<header className="bg-white shadow-md">*/}
       
        {/*</header>*/}

            {/* ============================= */}
            {/* 🧱 Conteúdo Principal */}
            {/* ============================= */}
        <main className="max-w-6xl mx-auto p-6 space-y-12">

                {/* 🌦️ NOVO MÓDULO INTERATIVO DE CLIMA 🌦️ */}
                {/* ============================================= */}
            <section id="clima" className="bg-white shadow-lg rounded-lg p-6 md:p-8 space-y-6">
                <h3 className="text-2xl font-bold text-center text-blue-700 mb-4">Dica de Segurança: Clima e Direção</h3>

                    {/* 4. Controles (Botões)
            Estes botões usam JavaScript (onClick) para chamar a função 
            'setClima', que atualiza o estado 'clima'.
            As classes mudam dinamicamente com base em qual clima está ativo.
          */}
                <div className="flex gap-3 justify-center mt-6">
                    {Object.keys(infoClima).map((tipo) => (
                        <BotaoClima
                            key={tipo}
                            clima={clima}
                            setClima={setClima}
                            tipoClima={tipo}
                            infoClima={infoClima}
                        />
                    ))}
                </div>
                
                    {/* 5. Caixa de Informação Dinâmica
            Aqui, as classes do Tailwind (infoAtual.classesCard) e o 
            conteúdo (infoAtual.titulo, infoAtual.texto) são
            inseridos dinamicamente usando JavaScript (JSX).
          */}
                    <div className={`p-6 rounded-lg border-2 text-left transition-all duration-500 ease-in-out ${infoAtual.classesCard}`}>
                        <h4 className="font-bold text-lg mb-2">{infoAtual.titulo}</h4>
                        <p className="leading-relaxed">{infoAtual.texto}</p>
                    </div>


                </section>

             
            </main>
    </div>
    );
}

// Isso torna o componente 'App' disponível para ser usado no 'index.js'
export default App2;
