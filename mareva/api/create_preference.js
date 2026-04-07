// api/create_preference.js
import mercadopago from "mercadopago";

mercadopago.configurations.setAccessToken(process.env.MP_ACCESS_TOKEN);

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { items } = req.body; // Array de produtos do carrinho

      if (!items || items.length === 0) {
        return res.status(400).json({ error: "Carrinho vazio" });
      }

      const preference = {
        items: items.map(i => ({
          title: i.nome,
          quantity: Number(i.qtd),
          unit_price: Number(i.preco),
          picture_url: i.img || "", // opcional
          currency_id: "BRL"
        })),
        back_urls: {
          success: `${process.env.SITE_URL}/success.html`,
          failure: `${process.env.SITE_URL}/failure.html`,
          pending: `${process.env.SITE_URL}/pending.html`,
        },
        auto_return: "approved",
      };

      const response = await mercadopago.preferences.create(preference);

      res.status(200).json({
        id: response.body.id,
        init_point: response.body.init_point
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao criar preferência de pagamento" });
    }
  } else {
    res.status(405).json({ error: "Método não permitido" });
  }
}