import React from 'react';

const certificateStyles = `
  .certificate-page {
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 32px;
    box-sizing: border-box;
    background: #eef1f4;
    color: #20252b;
    font-family: Georgia, 'Times New Roman', serif;
  }

  .certificate-shell {
    width: min(100%, 980px);
    padding: 12px;
    background: #b78a3d;
    box-shadow: 0 18px 45px rgba(32, 37, 43, 0.18);
  }

  .certificate {
    position: relative;
    min-height: 620px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 56px 72px 48px;
    box-sizing: border-box;
    text-align: center;
    border: 1px solid #d8b66d;
    background: #fffdf8;
    overflow: hidden;
  }

  .certificate::before,
  .certificate::after {
    content: '';
    position: absolute;
    width: 150px;
    height: 150px;
    border: 1px solid rgba(183, 138, 61, 0.42);
    transform: rotate(45deg);
  }

  .certificate::before {
    top: -102px;
    left: -102px;
  }

  .certificate::after {
    right: -102px;
    bottom: -102px;
  }

  .certificate-logo {
    width: 124px;
    height: auto;
    object-fit: contain;
  }

  .certificate-kicker {
    margin: 22px 0 10px;
    color: #9b712e;
    font-family: Arial, sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
  }

  .certificate-title {
    margin: 0;
    color: #263943;
    font-size: clamp(34px, 6vw, 62px);
    font-weight: 400;
    line-height: 1.05;
  }

  .certificate-intro {
    margin: 30px 0 16px;
    color: #59636a;
    font-family: Arial, sans-serif;
    font-size: 15px;
  }

  .certificate-name {
    margin: 0;
    padding: 0 18px 10px;
    color: #1d3038;
    font-size: clamp(28px, 4vw, 44px);
    font-style: italic;
    font-weight: 400;
    border-bottom: 1px solid #b78a3d;
  }

  .certificate-description {
    max-width: 620px;
    margin: 20px 0 0;
    color: #59636a;
    font-family: Arial, sans-serif;
    font-size: 14px;
    line-height: 1.6;
  }

  .certificate-signatures {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 36px;
    width: 100%;
    margin-top: 48px;
  }

  .certificate-signature {
    min-width: 0;
    padding-top: 12px;
    border-top: 1px solid #6e777b;
    color: #263943;
    font-family: Arial, sans-serif;
    font-size: 12px;
    line-height: 1.5;
  }

  .certificate-signature strong {
    display: block;
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 15px;
    font-weight: 700;
  }

  .certificate-print {
    display: block;
    margin: 24px auto 0;
    padding: 12px 20px;
    border: 0;
    border-radius: 3px;
    background: #263943;
    color: #fffdf8;
    cursor: pointer;
    font-family: Arial, sans-serif;
    font-size: 14px;
    font-weight: 700;
  }

  .certificate-print:hover {
    background: #9b712e;
  }

  @media (max-width: 640px) {
    .certificate-page {
      padding: 16px;
    }

    .certificate {
      min-height: 0;
      padding: 40px 24px 32px;
    }

    .certificate-signatures {
      grid-template-columns: 1fr;
      gap: 22px;
      margin-top: 36px;
    }
  }

  @media print {
    @page {
      size: landscape;
      margin: 0;
    }

    .certificate-page {
      min-height: auto;
      padding: 0;
      background: #fff;
    }

    .certificate-shell {
      width: 100%;
      padding: 0;
      box-shadow: none;
    }

    .certificate {
      min-height: 100vh;
      border: 1px solid #b78a3d;
      box-shadow: none;
    }

    .certificate-print {
      display: none;
    }
  }
`;

export default function Certificate({ playerName }) {
  return (
    <>
      <style>{certificateStyles}</style>
      <main className="certificate-page">
        <section className="certificate-shell" aria-label="Certificado de conclusão">
          <div className="certificate">
            <div>
              <img
                className="certificate-logo"
                src="/assets/ui/LogodaClinica.png"
                alt="Logo da Clínica Estética BC"
              />
              <p className="certificate-kicker">Certificado de Conclusão</p>
              <h1 className="certificate-title">Clínica Estética BC</h1>
              <p className="certificate-intro">Certificamos que</p>
              <p className="certificate-name">{playerName}</p>
              <p className="certificate-description">
                concluiu com êxito o treinamento completo da Clínica Estética BC,
                demonstrando conhecimento nas áreas de estética, protocolos e gestão clínica.
              </p>
            </div>

            <div className="certificate-signatures">
              <div className="certificate-signature">
                <strong>Bianca Cirilo</strong>
                Diretora
              </div>
              <div className="certificate-signature">
                <strong>Ryan Amorim</strong>
                Coordenador
              </div>
              <div className="certificate-signature">
                <strong>Nicolle Rocha</strong>
                Coordenadora
              </div>
            </div>
          </div>

          <button className="certificate-print" type="button" onClick={() => window.print()}>
            Imprimir / Salvar Certificado em PDF
          </button>
        </section>
      </main>
    </>
  );
}
