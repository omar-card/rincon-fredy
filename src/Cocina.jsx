import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

function Cocina() {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "pedidos"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map((documento) => ({
        id: documento.id,
        ...documento.data(),
      }));

      setPedidos(lista);
    });

    return () => unsubscribe();
  }, []);

  const marcarListo = async (id) => {
    await updateDoc(doc(db, "pedidos", id), {
      estado: "listo",
    });
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>🍟 Cocina</h1>

      {pedidos.length === 0 ? (
        <p>No hay pedidos.</p>
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
            <h3>
              Estado: {pedido.estado || "pendiente"}
            </h3>

            <ul>
              {pedido.items?.map((item, index) => (
                <li key={index}>{item.nombre}</li>
              ))}
            </ul>

            <strong>
              Total: ${pedido.total?.toLocaleString()}
            </strong>

            <br />
            <br />

            {pedido.estado !== "listo" && (
              <button onClick={() => marcarListo(pedido.id)}>
                ✅ Marcar como Listo
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Cocina;