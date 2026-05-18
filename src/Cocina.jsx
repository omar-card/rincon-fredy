import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "./firebase";

function Cocina() {
  const [pedidos, setPedidos] = useState([]);

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

      setPedidos(lista);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>🍟 Cocina</h1>

      {pedidos.length === 0 ? (
        <p>No hay pedidos pendientes.</p>
      ) : (
        pedidos.map((pedido) => (
          <div
            key={pedido.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "15px",
              marginBottom: "10px",
            }}
          >
            <h3>Pedido</h3>

            <ul>
              {pedido.cocinaItems?.map((item, index) => (
                <li key={index}>
                    {item.nombre} x{item.cantidad}
                </li>
            ))}
            </ul>

            <strong>
              Total: ${pedido.total?.toLocaleString()}
            </strong>
          </div>
        ))
      )}
    </div>
  );
}

export default Cocina;