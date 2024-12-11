import express from 'express';
import { Client } from 'pg';

const port = 4000;
const app = express();

// Configurações dos bancos de dados
const databases = [
  {
    name: 'Primary',
    host: 'localhost',
    port: 5432,
    user: 'primary_user',
    password: 'primary_password',
    database: 'primary_db',
  },
  {
    name: 'Secondary',
    host: 'localhost',
    port: 5433,
    user: 'secondary_user',
    password: 'secondary_password',
    database: 'secondary_db',
  },
  {
    name: 'Tertiary',
    host: 'localhost',
    port: 5434,
    user: 'tertiary_user',
    password: 'tertiary_password',
    database: 'tertiary_db',
  },
];

async function testDatabases() {
  for (const db of databases) {
    const client = new Client({
      host: db.host,
      port: db.port,
      user: db.user,
      password: db.password,
      database: db.database,
    });

    try {
      await client.connect();
      const res = await client.query('SELECT $1::text as message', [`Mensagem do servidor ${db.name}`]);
      console.log(`Servidor ${db.name}:`, res.rows[0].message);
    } catch (error : any) {
      console.error(`Erro no servidor ${db.name}:`, error.message);
    } finally {
      await client.end();
    }
  }
}

// Rota para testar conexões
app.get('/test', async (_req: any, res: any) => {
  await testDatabases();
  res.send('Conexões testadas. Verifique o console.');
});

app.listen(port, () => console.log(`⚡ Server running on port ${port}`));
