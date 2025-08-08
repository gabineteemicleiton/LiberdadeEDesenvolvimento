// testarDB.js
import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function testarConexao() {
  try {
    const resultado = await pool.query("SELECT NOW()");
    console.log("✅ Conexão com o banco de dados bem-sucedida!");
    console.log("🕒 Hora atual no banco:", resultado.rows[0].now);
    process.exit(0);
  } catch (err) {
    console.error("❌ Erro ao conectar com o banco:", err);
    process.exit(1);
  }
}

testarConexao();
