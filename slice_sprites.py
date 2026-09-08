"""
slice_sprites.py — Fatiamento Automático de Sprites de Móveis
=============================================================

Fatia spritesheets agrupados em grades regulares (tiles 16×16) e
salva cada frame não-vazio como PNG individual na pasta de saída.

Spritesheets alvo (descobertos na inspeção de assets):
  - public/assets/tilesets/clinic/spritesheet_hospital_01.png   (128×128, grid 8×8 @16px)
  - public/assets/tilesets/clinic/spritesheet_hospital_02.png   (128×128, grid 8×8 @16px)
  - public/assets/tilesets/clinic/spritesheet_hospital_lab.png  (128×128, grid 8×8 @16px)
  - public/assets/tilesets/clinic/spritesheet_hospital_maternity.png (128×128, grid 8×8 @16px)
  - public/assets/tilesets/Pixel_16_interiors_v2_free/tiles and items.png (200×200, grid 12×12 @16px)
  - public/assets/tilesets/interiors/interiors_16x16.png        (256×1424, grid 16×89 @16px)
  - public/assets/tilesets/interiors/room-builder_16x16.png     (272×368,  grid 17×23 @16px)

Saída: public/assets/furniture/<nome_do_sheet>/furniture_NNN.png
"""

from PIL import Image
import os


# ── Configuração dos sheets a fatiar ─────────────────────────────────────────
BASE_PUBLIC = os.path.join(os.path.dirname(__file__), "public", "assets")

SHEETS = [
    {
        "path":        os.path.join(BASE_PUBLIC, "tilesets", "clinic", "spritesheet_hospital_01.png"),
        "output_dir":  os.path.join(BASE_PUBLIC, "furniture", "hospital_01"),
        "tile_w":      16,
        "tile_h":      16,
        "label":       "Hospital Pack 01 (camas, equipamentos)",
    },
    {
        "path":        os.path.join(BASE_PUBLIC, "tilesets", "clinic", "spritesheet_hospital_02.png"),
        "output_dir":  os.path.join(BASE_PUBLIC, "furniture", "hospital_02"),
        "tile_w":      16,
        "tile_h":      16,
        "label":       "Hospital Pack 02 (CT Scanner, equipamentos avançados)",
    },
    {
        "path":        os.path.join(BASE_PUBLIC, "tilesets", "clinic", "spritesheet_hospital_lab.png"),
        "output_dir":  os.path.join(BASE_PUBLIC, "furniture", "hospital_lab"),
        "tile_w":      16,
        "tile_h":      16,
        "label":       "Hospital Lab (microscópio, armários, laboratório)",
    },
    {
        "path":        os.path.join(BASE_PUBLIC, "tilesets", "clinic", "spritesheet_hospital_maternity.png"),
        "output_dir":  os.path.join(BASE_PUBLIC, "furniture", "hospital_maternity"),
        "tile_w":      16,
        "tile_h":      16,
        "label":       "Hospital Maternidade (cadeira, cama, maca)",
    },
    {
        "path":        os.path.join(BASE_PUBLIC, "tilesets", "Pixel_16_interiors_v2_free", "tiles and items.png"),
        "output_dir":  os.path.join(BASE_PUBLIC, "furniture", "pixel16_interiors"),
        "tile_w":      16,
        "tile_h":      16,
        "label":       "Pixel 16 Interiors (cama, sofá, decoração)",
    },
    {
        "path":        os.path.join(BASE_PUBLIC, "tilesets", "interiors", "interiors_16x16.png"),
        "output_dir":  os.path.join(BASE_PUBLIC, "furniture", "modern_interiors_16"),
        "tile_w":      16,
        "tile_h":      16,
        "label":       "Modern Interiors 16×16 (móveis variados, clínica estética)",
    },
    {
        "path":        os.path.join(BASE_PUBLIC, "tilesets", "interiors", "room-builder_16x16.png"),
        "output_dir":  os.path.join(BASE_PUBLIC, "furniture", "room_builder_16"),
        "tile_w":      16,
        "tile_h":      16,
        "label":       "Room Builder 16×16 (paredes, pisos, estrutura)",
    },
]


def fatiar_spritesheet(caminho_imagem, pasta_saida, largura_tile=16, altura_tile=16, label=""):
    """
    Fatia um spritesheet em grade regular e salva frames não-vazios.

    Parâmetros
    ----------
    caminho_imagem : str   Caminho absoluto do PNG de entrada.
    pasta_saida    : str   Pasta onde os PNGs individuais serão salvos.
    largura_tile   : int   Largura de cada frame em pixels.
    altura_tile    : int   Altura de cada frame em pixels.
    label          : str   Descrição legível para log.

    Retorna
    -------
    int  Número de sprites extraídos (frames não-vazios).
    """
    if not os.path.exists(caminho_imagem):
        print(f"  [AVISO] Imagem não encontrada: {caminho_imagem}")
        return 0

    os.makedirs(pasta_saida, exist_ok=True)

    img = Image.open(caminho_imagem).convert("RGBA")
    largura, altura = img.size

    colunas = largura  // largura_tile
    linhas  = altura   // altura_tile

    print(f"\n{'─'*60}")
    print(f"  {label}")
    print(f"  Arquivo : {os.path.basename(caminho_imagem)}")
    print(f"  Tamanho : {largura}×{altura} px")
    print(f"  Grade   : {colunas} colunas × {linhas} linhas = {colunas * linhas} frames brutos")
    print(f"  Saída   : {pasta_saida}")

    count     = 0
    ignorados = 0

    for y in range(linhas):
        for x in range(colunas):
            box  = (
                x * largura_tile,
                y * altura_tile,
                (x + 1) * largura_tile,
                (y + 1) * altura_tile,
            )
            tile = img.crop(box)

            # Ignora quadros totalmente transparentes (vazios)
            extremos = tile.getextrema()          # [(r_min,r_max), (g_min,g_max), (b_min,b_max), (a_min,a_max)]
            alpha_max = extremos[3][1]             # canal alpha — 0 = completamente transparente
            if alpha_max == 0:
                ignorados += 1
                continue

            nome_arquivo = f"furniture_{count:03d}.png"
            tile.save(os.path.join(pasta_saida, nome_arquivo))
            count += 1

    print(f"  Extraídos : {count} sprites  ({ignorados} frames vazios ignorados)")
    return count


def gerar_relatorio(resultados):
    """Imprime tabela-resumo de todos os sheets processados."""
    print(f"\n{'═'*60}")
    print(f"  RELATÓRIO FINAL")
    print(f"{'═'*60}")
    total = 0
    for r in resultados:
        status = "✓" if r["count"] > 0 else "✗"
        print(f"  {status}  {r['nome']:<40} {r['count']:>4} sprites")
        total += r["count"]
    print(f"{'─'*60}")
    print(f"  TOTAL: {total} sprites extraídos")
    print(f"{'═'*60}\n")


# ── Execução ─────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("╔══════════════════════════════════════════════════════════╗")
    print("║   slice_sprites.py — Fatiamento de Sprites de Móveis    ║")
    print("║   Projeto: RPG 2D Clínica Estética BC                   ║")
    print("╚══════════════════════════════════════════════════════════╝")

    resultados = []
    for sheet in SHEETS:
        count = fatiar_spritesheet(
            caminho_imagem = sheet["path"],
            pasta_saida    = sheet["output_dir"],
            largura_tile   = sheet["tile_w"],
            altura_tile    = sheet["tile_h"],
            label          = sheet["label"],
        )
        resultados.append({
            "nome":  os.path.basename(sheet["path"]),
            "count": count,
        })

    gerar_relatorio(resultados)
    print("Fatiamento concluído. Verifique public/assets/furniture/ para os resultados.")
