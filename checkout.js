export default async function handler(req, res) {
  const access_token = process.env.MP_ACCESS_TOKEN;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const items = req.body;

    const preference = {
      items: items.map(item => ({
        title: item.nome,
        quantity: Number(item.qtd),
        unit_price: Number(item.preco),
        currency_id: "BRL"
      })),

      back_urls: {
        success: "https://SEU-SITE.vercel.app/sucesso.html",
        failure: "https://SEU-SITE.vercel.app/cancelado.html",
        pending: "https://SEU-SITE.vercel.app/pendente.html"
      },

      auto_return: "approved"
    };

    const response = await fetch(
      "https://api.mercadopago.com/checkout/preferences",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${access_token}`
        },
        body: JSON.stringify(preference)
      }
    );

    const data = await response.json();

    if (!data.init_point) {
      return res.status(500).json({ error: "Erro ao criar pagamento" });
    }

    return res.status(200).json({
      url: data.init_point
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}
