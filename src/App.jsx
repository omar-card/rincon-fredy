import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

function App() {
  const [pedido, setPedido] = useState([]);

  const agregarProducto = (nombre, precio) => {
    setPedido([...pedido, { nombre, precio }]);
  };

  const total = pedido.reduce((sum, item) => sum + item.precio, 0);

  const enviarPedido = async () => {
    if (pedido.length === 0) {
      alert("Agrega al menos un producto");
      return;
    }

    try {
      await addDoc(collection(db, "pedidos"), {
        items: pedido,
        total,
        estado: "pendiente",
        createdAt: serverTimestamp(),
      });

      alert("Pedido guardado correctamente");
      setPedido([]);
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al guardar el pedido");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>🍔 El Rincón de Fredy</h1>
      <h2>Tomar Pedido</h2>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        <button onClick={() => agregarProducto("Alita 18", 18000)}>
          Alita 18
        </button>

        <button onClick={() => agregarProducto("Papas", 0)}>
          Papas
        </button>

        <button onClick={() => agregarProducto("Coca-Cola", 4000)}>
          Coca-Cola
        </button>
      </div>

      <h3>Pedido Actual</h3>

      <ul>
        {pedido.map((item, index) => (
          <li key={index}>
            {item.nombre} - ${item.precio.toLocaleString()}
          </li>
        ))}
      </ul>

      <h2>Total: ${total.toLocaleString()}</h2>

      <button
        onClick={enviarPedido}
        style={{
          padding: "15px 30px",
          fontSize: "18px",
          marginTop: "20px",
        }}
      >
        Enviar Pedido
      </button>
    </div>
  );
}

export default App;