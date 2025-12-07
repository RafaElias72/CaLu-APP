import { Link } from "react-router-dom";

const CardsAdm = () => {
    return (
        <>
            <div className="w-full flex justify-center mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl w-full px-4">
            <Link to={"/catalogo"}>
              <div className="text-white p-4 rounded-lg shadow-md flex flex-col items-center gap-4 hover:bg-yellow-500 transition-all" style={{ backgroundColor: "#F59E0B" }}>
                <div className="text-4xl">📄</div>
                <h2 className="text-sm font-bold">Catálogo</h2>
              </div>
            </Link>
            <Link to="/carrinho">
              <div className="text-white p-4 rounded-lg shadow-md flex flex-col items-center gap-4 hover:bg-yellow-500 transition-all" style={{ backgroundColor: "#F59E0B" }}>
                <div className="text-4xl">🛒</div>
                <h2 className="text-sm font-bold">Carrinho</h2>
              </div>
            </Link>
            <Link to={"/FAQ"}>
              <div className="text-white p-4 rounded-lg shadow-md flex flex-col items-center gap-4 hover:bg-yellow-500 transition-all" style={{ backgroundColor: "#F59E0B" }}>
                <div className="text-4xl">❓</div>
                <h2 className="text-sm font-bold">FAQ</h2>
              </div>
            </Link>
            <Link to={"/cadastrarproduto"}>
              <div className="text-white p-4 rounded-lg shadow-md flex flex-col items-center gap-4 hover:bg-yellow-500 transition-all" style={{ backgroundColor: "#F59E0B" }}>
                <div className="text-4xl">📝</div>
                <h2 className="text-sm font-bold">Cadastrar Produto</h2>
              </div>
            </Link>
          </div>
        </div>

        </>
    );
};

export default CardsAdm;