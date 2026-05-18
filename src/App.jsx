import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase";

const PRODUCTOS_COCINA = ["Papas", "Patacones", "Yuca"];

function App() {
  const [pedido, setPedido] = useState([]);
  const [pedidosActivos, setPedidosActivos] = useState([]);

  const agregarProducto = (nombre, precio) => {
    setPedido([...pedido, { nombre, precio }]);
  };

  const total = pedido.reduce((sum, item) => sum + item.precio, 0);

  const enviarPedido = async () => {
    if (pedido.length === 0) {
      alert("Agrega al menos un producto");
      return;
    }

    // Filtrar solo productos que debe preparar la cocina
    const cocinaItems = pedido
      .filter((item) => PRODUCTOS_COCINA.includes(item.nombre))
      .reduce((acc, item) => {
        const existente = acc.find((x) => x.nombre === item.nombre);

        if (existente) {
          existente.cantidad += 1;
        } else {
          acc.push({
            nombre: item.nombre,
            cantidad: 1,
          });
        }

        return acc;
      }, []);

    // Número consecutivo simple
    const numero = Date.now();

    await addDoc(collection(db, "pedidos"), {
      numero,
      items: pedido,
      cocinaItems,
      total,
      estado: "pendiente",
      createdAt: serverTimestamp(),
    });

    setPedido([]);
  };

  useEffect(() => {
    const q = query(
      collection(db, "pedidos"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPedidosActivos(lista.slice(0, 5));
    });

    return () => unsubscribe();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>🍔 El Rincón de Fredy</h1>
      <h2>Tomar Pedido</h2>

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <button onClick={() => agregarProducto("Alita 18", 18000)}>
          Alita 18
        </button>

        <button onClick={() => agregarProducto("Papas", 0)}>
          Papas
        </button>

        <button onClick={() => agregarProducto("Patacones", 0)}>
          Patacones
        </button>

        <button onClick={() => agregarProducto("Yuca", 0)}>
          Yuca
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

      <button onClick={enviarPedido}>
        Enviar Pedido
      </button>

      <hr style={{ margin: "30px 0" }} />

      <h2>Pedidos Activos</h2>

      {pedidosActivos.map((p) => (
        <div
          key={p.id}
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <strong>Pedido #{p.numero}</strong>

          <ul>
            {p.items?.map((item, index) => (
              <li key={index}>{item.nombre}</li>
            ))}
          </ul>

          <strong>
            {p.estado === "listo"
              ? "✅ Listo para entregar"
              : "⏳ En preparación"}
          </strong>
        </div>
      ))}
    </div>
  );
}

export default App;