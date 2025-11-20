export const submitEmail = async (req, res) => {
  const { emailSubject, message, subject } = req.body;

  if (!emailSubject || !message || !subject) {
    return res
      .status(400)
      .json({ error: "Parâmetros insuficientes para enviar o e-mail" });
  }

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const requestOptions = {
    method: "post",
    headers: myHeaders,
    redirect: "follow",
  };
  const urlBase = process.env.URL_BASE_EMAIL;
  const fromAddress = "naoresponda@colabora.blog.br";
  const urlFinal = `${urlBase}?fromAddress=${fromAddress}&toAddress=${emailSubject}&content=${message}&subject=${subject}`;

  try {
    const response = await fetch(urlFinal, requestOptions);

    if (!response.ok) {
      return res
        .status(500)
        .json({ success: false, error: "Erro ao enviar o e-mail" });
    }

    return res
      .status(200)
      .json({ success: true, message: "E-mail enviado com sucesso" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: "Erro ao enviar o e-mail" });
  }
};
