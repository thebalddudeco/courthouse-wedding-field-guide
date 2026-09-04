from pathlib import Path
from shutil import copy2
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
BRAND = ROOT / "brand"
FONTS = BRAND / "fonts"
LOGOS = BRAND / "logos"
ICONS = BRAND / "icons"
SOCIAL = BRAND / "social"
ILLUSTRATIONS = BRAND / "illustrations" / "png"
ILLUSTRATED_MARK = ILLUSTRATIONS / "activeshot-illustrated-mark-1024.png"
APP_ICON = ILLUSTRATIONS / "activeshot-app-icon-1024.png"

INK = "#1A1A1A"
ORANGE = "#E47B28"
MOSS = "#476E3D"
PAPER = "#E8E6E0"
CREAM = PAPER
GRAY = INK
WHITE = PAPER

ALFA = FONTS / "AlfaSlabOne-Regular.ttf"
INTER = FONTS / "Inter-Variable.ttf"

for folder in [LOGOS / "svg", LOGOS / "png", ICONS / "png", SOCIAL / "svg", SOCIAL / "png"]:
    folder.mkdir(parents=True, exist_ok=True)


def font(path, size):
    return ImageFont.truetype(str(path), size)


def save_text(path, text):
    path.write_text(text, encoding="utf-8")


def mark_svg(fg=INK, accent=ORANGE, bg=None, rounded=False):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" role="img" aria-label="ActiveShot framed A mark">
<rect width="256" height="256" fill="{MOSS}"/>
<g fill="none" stroke-linecap="butt" stroke-linejoin="round">
  <g stroke="{INK}" stroke-width="18"><path d="M35 78V35h43"/><path d="M178 35h43v43"/><path d="M221 178v43h-43"/><path d="M78 221H35v-43"/></g>
  <g stroke="{PAPER}" stroke-width="8"><path d="M35 78V35h43"/><path d="M178 35h43v43"/><path d="M221 178v43h-43"/><path d="M78 221H35v-43"/></g>
</g>
<path d="M62 194 108 55h40l46 139h-35l-10-30h-42l-10 30Z" fill="{ORANGE}" stroke="{INK}" stroke-width="8" stroke-linejoin="round"/>
<path d="m128 99-15 43h30Z" fill="{MOSS}" stroke="{INK}" stroke-width="7" stroke-linejoin="round"/>
</svg>'''


def app_icon_svg():
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" role="img" aria-label="ActiveShot A app icon">
<rect width="256" height="256" fill="{MOSS}"/>
<path d="M42 224 101 32h54l59 192h-47l-13-42h-54l-13 42Z" fill="{ORANGE}" stroke="{INK}" stroke-width="9" stroke-linejoin="round"/>
<path d="m128 91-19 58h38Z" fill="{MOSS}" stroke="{INK}" stroke-width="8" stroke-linejoin="round"/>
</svg>'''


def mark_group_svg(x, y, size, fg, accent):
    s = size / 256
    content = mark_svg().replace('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" role="img" aria-label="ActiveShot framed A mark">', '').replace('</svg>', '')
    return f'''<g transform="translate({x} {y}) scale({s})">{content}</g>'''


def mark_bitmap(size):
    return Image.open(ILLUSTRATED_MARK).convert("RGB").resize((size, size), Image.Resampling.NEAREST)


def paste_mark(canvas, x, y, size):
    canvas.paste(mark_bitmap(size), (round(x), round(y)))


def lockup_svg(mode="light", stacked=False):
    bg = PAPER if mode == "light" else INK
    fg = INK if mode == "light" else PAPER
    accent = ORANGE
    if stacked:
        w, h = 720, 700
        symbol = mark_svg(fg, accent).replace('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" role="img" aria-label="ActiveShot active frame mark">', '<g transform="translate(232 70) scale(1)">').replace('</svg>', '</g>')
        body = f'''{symbol}<text x="360" y="420" text-anchor="middle" fill="{fg}" font-family="Alfa Slab One" font-size="86">Active<tspan fill="{accent}">Shot</tspan></text><text x="360" y="474" text-anchor="middle" fill="{fg}" font-family="Inter" font-size="21" letter-spacing="5">PHOTOGRAPHY FIELD GUIDE</text>'''
    else:
        w, h = 1200, 320
        symbol = mark_svg(fg, accent).replace('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" role="img" aria-label="ActiveShot active frame mark">', '<g transform="translate(42 32) scale(.98)">').replace('</svg>', '</g>')
        body = f'''{symbol}<text x="330" y="154" fill="{fg}" font-family="Alfa Slab One" font-size="104">Active<tspan fill="{accent}">Shot</tspan></text><text x="336" y="207" fill="{fg}" font-family="Inter" font-size="22" letter-spacing="6">PHOTOGRAPHY FIELD GUIDE</text>'''
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}" role="img" aria-label="ActiveShot logo">
<style>@font-face{{font-family:'Alfa Slab One';src:url('../../fonts/AlfaSlabOne-Regular.ttf')}}@font-face{{font-family:'Inter';src:url('../../fonts/Inter-Variable.ttf')}}</style>
<rect width="100%" height="100%" fill="{bg}"/>{body}</svg>'''


def draw_mark(draw, box, fg, accent):
    x, y, size = box
    s = size / 256
    width = max(4, round(12 * s))
    def line(points, fill=fg, width=width):
        draw.line([(x + px * s, y + py * s) for px, py in points], fill=fill, width=width)
    line([(48, 92), (48, 48), (92, 48)])
    line([(164, 48), (208, 48), (208, 92)])
    line([(208, 164), (208, 208), (164, 208)])
    line([(92, 208), (48, 208), (48, 164)])
    outer = [(78,184),(124,70),(134,70),(180,184),(155,184),(145,157),(111,157),(101,184)]
    draw.polygon([(x+px*s,y+py*s) for px,py in outer], fill=fg)
    draw.polygon([(x+119*s,y+136*s),(x+137*s,y+136*s),(x+128*s,y+109*s)], fill=accent)
    r = 14*s
    draw.ellipse((x+183*s-r,y+75*s-r,x+183*s+r,y+75*s+r),fill=accent)


def save_icon(size, name, bg=ORANGE, fg=INK, accent=MOSS, radius=.22, source=None):
    source = source or APP_ICON
    if source.exists():
        Image.open(source).convert("RGB").resize((size, size), Image.Resampling.NEAREST).save(ICONS / "png" / name, optimize=True)
        return
    scale = 4
    canvas = Image.new("RGB", (size*scale, size*scale), bg)
    draw = ImageDraw.Draw(canvas)
    if radius:
        mask = Image.new("L", canvas.size, 0)
        md = ImageDraw.Draw(mask)
        md.rounded_rectangle((0,0,size*scale-1,size*scale-1), radius=round(size*scale*radius), fill=255)
    pad = size*scale*.12
    draw_mark(draw, (pad, pad, size*scale-pad*2), fg, accent)
    canvas = canvas.resize((size,size), Image.Resampling.LANCZOS)
    if radius:
        final_mask = mask.resize((size,size), Image.Resampling.LANCZOS)
        canvas.putalpha(final_mask)
    canvas.save(ICONS / "png" / name, optimize=True)


def fit_text(draw, text, max_width, start, typeface=ALFA):
    size = start
    while size > 20:
        f = font(typeface, size)
        if draw.textbbox((0,0), text, font=f)[2] <= max_width:
            return f
        size -= 2
    return font(typeface, size)


def draw_wordmark(draw, x, y, size, light=False):
    f = font(ALFA, size)
    active = "Active"
    draw.text((x,y), active, font=f, fill=PAPER if light else INK)
    active_w = draw.textlength(active, font=f)
    draw.text((x+active_w,y), "Shot", font=f, fill=ORANGE)


def social_image(name, width, height, headline, subhead="PHOTOGRAPHY FIELD GUIDE", layout="split"):
    scale = 1
    im = Image.new("RGB", (width*scale,height*scale), PAPER)
    d = ImageDraw.Draw(im)
    if layout == "split":
        d.rectangle((0,0,width,int(height*.62)), fill=ORANGE)
        d.rectangle((0,int(height*.62),width,height), fill=INK)
        mark_fg, mark_accent = INK, MOSS
        text_fill = INK
    elif layout == "dark":
        d.rectangle((0,0,width,height), fill=INK)
        d.rectangle((int(width*.70),0,width,height), fill=ORANGE)
        d.ellipse((int(width*.64),int(height*.12),int(width*.78),int(height*.12)+int(width*.14)), fill=MOSS)
        mark_fg, mark_accent = PAPER, ORANGE
        text_fill = PAPER
    else:
        d.rectangle((0,0,width,height), fill=CREAM)
        d.rectangle((0,0,int(width*.16),height), fill=MOSS)
        d.rectangle((int(width*.16),0,int(width*.19),height), fill=ORANGE)
        mark_fg, mark_accent = INK, ORANGE
        text_fill = INK
    margin = max(32, int(min(width,height)*.075))
    mark_size = max(64, int(min(width,height)*.18))
    paste_mark(im, margin, margin, mark_size)
    label_font = font(INTER,max(18,int(min(width,height)*.025)))
    d.text((margin+mark_size+max(18,int(mark_size*.2)),margin+int(mark_size*.30)),"ACTIVE SHOT",font=label_font,fill=mark_fg,stroke_width=0)
    maxw = width-margin*2
    headline_font = fit_text(d,headline,maxw,int(min(width,height)*.12))
    lines = headline.split("\n")
    line_h = int(headline_font.size*1.02)
    total_h = line_h*len(lines)
    y = max(margin+mark_size+margin, int(height*.48-total_h/2))
    for line in lines:
        d.text((margin,y),line,font=headline_font,fill=text_fill)
        y += line_h
    sub_font = font(INTER,max(18,int(min(width,height)*.025)))
    sub_y = height-margin-sub_font.size*2
    sub_color = PAPER if layout in ("split","dark") and sub_y > height*.62 else GRAY
    d.text((margin,sub_y),subhead,font=sub_font,fill=sub_color)
    d.line((margin,height-margin,width-margin,height-margin),fill=ORANGE if layout!="split" else PAPER,width=max(2,int(min(width,height)*.004)))
    im.save(SOCIAL / "png" / f"{name}.png", optimize=True)
    svg_lines = []
    for i,line_text in enumerate(lines):
        svg_lines.append(f'<text x="{margin}" y="{y-total_h+i*line_h}" fill="{text_fill}" font-family="Alfa Slab One" font-size="{headline_font.size}">{line_text}</text>')
    if layout == "split":
        svg_bg = f'<rect width="100%" height="{int(height*.62)}" fill="{ORANGE}"/><rect y="{int(height*.62)}" width="100%" height="{height-int(height*.62)}" fill="{INK}"/>'
    elif layout == "dark":
        svg_bg = f'<rect width="100%" height="100%" fill="{INK}"/><rect x="{int(width*.70)}" width="{width-int(width*.70)}" height="100%" fill="{ORANGE}"/><circle cx="{int(width*.71)}" cy="{int(height*.12)+int(width*.07)}" r="{int(width*.07)}" fill="{MOSS}"/>'
    else:
        svg_bg = f'<rect width="100%" height="100%" fill="{CREAM}"/><rect width="{int(width*.16)}" height="100%" fill="{MOSS}"/><rect x="{int(width*.16)}" width="{int(width*.03)}" height="100%" fill="{ORANGE}"/>'
    save_text(SOCIAL / "svg" / f"{name}.svg", f'''<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}"><style>@font-face{{font-family:'Alfa Slab One';src:url('../../fonts/AlfaSlabOne-Regular.ttf')}}@font-face{{font-family:'Inter';src:url('../../fonts/Inter-Variable.ttf')}}</style>{svg_bg}{mark_group_svg(margin,margin,mark_size,mark_fg,mark_accent)}<text x="{margin+mark_size+max(18,int(mark_size*.2))}" y="{margin+int(mark_size*.48)}" fill="{mark_fg}" font-family="Inter" font-size="{label_font.size}" letter-spacing="2">ACTIVE SHOT</text>{''.join(svg_lines)}<text x="{margin}" y="{sub_y+sub_font.size}" fill="{sub_color}" font-family="Inter" font-size="{sub_font.size}" letter-spacing="2">{subhead}</text><line x1="{margin}" y1="{height-margin}" x2="{width-margin}" y2="{height-margin}" stroke="{ORANGE if layout!='split' else PAPER}" stroke-width="4"/></svg>''')


def brand_board():
    width, height = 1920, 1080
    im = Image.new("RGB", (width, height), PAPER)
    d = ImageDraw.Draw(im)
    d.rectangle((0,0,690,height), fill=ORANGE)
    if ILLUSTRATED_MARK.exists():
        illustrated_mark = Image.open(ILLUSTRATED_MARK).convert("RGB").resize((330,330), Image.Resampling.NEAREST)
        im.paste(illustrated_mark, (110,55))
    else:
        draw_mark(d,(110,95,270),INK,MOSS)
    d.text((110,425),"ActiveShot",font=font(ALFA,88),fill=INK)
    d.text((116,555),"WALK IN READY.",font=font(ALFA,50),fill=INK)
    d.text((116,640),"PHOTOGRAPHY FIELD GUIDES,\nBUILT FOR THE SHOOT.",font=font(INTER,28),fill=INK,spacing=14)
    colors=[("SURFACE",PAPER),("INK",INK),("ACTION",ORANGE),("CONFIRMED",MOSS)]
    x0,y0=790,110
    d.text((x0,y0),"ACTIVE SHOT / CORE SYSTEM",font=font(INTER,24),fill=GRAY)
    d.text((x0,y0+58),"Decisive. Practical.\nCreatively credible.",font=font(ALFA,68),fill=INK,spacing=2)
    sw,sh=460,155
    for i,(label,color) in enumerate(colors):
        x=x0+(i%2)*(sw+24); y=430+(i//2)*(sh+75)
        d.rectangle((x,y,x+sw,y+sh),fill=color,outline=INK,width=2)
        label_color=PAPER if color in (INK,MOSS) else INK
        d.text((x+18,y+18),label,font=font(INTER,22),fill=label_color)
        d.text((x+18,y+sh-45),color.upper(),font=font(INTER,20),fill=label_color)
    d.line((x0,890,1780,890),fill=INK,width=2)
    d.text((x0,930),"PREP.  SHOOT.  WRAP.",font=font(ALFA,46),fill=INK)
    im.save(BRAND / "active-shot-brand-board.png",optimize=True)


# Editable vector masters
save_text(LOGOS / "svg" / "activeshot-mark-ink.svg", mark_svg(INK, ORANGE))
save_text(LOGOS / "svg" / "activeshot-mark-reversed.svg", mark_svg(PAPER, ORANGE))
save_text(LOGOS / "svg" / "activeshot-logo-horizontal-light.svg", lockup_svg("light", False))
save_text(LOGOS / "svg" / "activeshot-logo-horizontal-dark.svg", lockup_svg("dark", False))
save_text(LOGOS / "svg" / "activeshot-logo-stacked-light.svg", lockup_svg("light", True))
save_text(LOGOS / "svg" / "activeshot-logo-stacked-dark.svg", lockup_svg("dark", True))

# Core icons and app-ready files
for size in [16, 32, 48, 180, 192, 512, 1024]:
    save_icon(size, f"activeshot-icon-{size}.png")
save_icon(512, "activeshot-maskable-512.png", radius=0)
save_icon(1080, "activeshot-social-avatar-1080.png", source=ILLUSTRATED_MARK)

# Social channel templates
social_image("instagram-post-square-1080",1080,1080,"WALK IN\nREADY.",layout="split")
social_image("instagram-post-portrait-1080x1350",1080,1350,"THE SHOT LIST\nTHAT MOVES\nWITH YOU.",layout="dark")
social_image("instagram-story-reel-1080x1920",1080,1920,"PREP.\nSHOOT.\nWRAP.",layout="split")
social_image("x-header-1500x500",1500,500,"WALK IN READY.",layout="dark")
social_image("facebook-cover-1640x624",1640,624,"PREP. SHOOT. WRAP.",layout="split")
social_image("linkedin-company-cover-1128x191",1128,191,"PHOTOGRAPHY FIELD GUIDES.",layout="light")
social_image("youtube-channel-art-2560x1440",2560,1440,"WALK IN READY.",layout="dark")
social_image("website-social-card-1200x630",1200,630,"PREP. SHOOT.\nWRAP.",layout="split")

# Horizontal logo PNGs for common use
for mode in ["light","dark"]:
    im = Image.new("RGB",(1800,480),PAPER if mode=="light" else INK)
    d = ImageDraw.Draw(im)
    paste_mark(im,54,72,336)
    draw_wordmark(d,440,132,150,light=(mode=="dark"))
    d.text((450,315),"PHOTOGRAPHY FIELD GUIDE",font=font(INTER,30),fill=GRAY if mode=="light" else CREAM)
    im.save(LOGOS / "png" / f"activeshot-logo-horizontal-{mode}.png",optimize=True)

# Transparent logo and symbol exports for placement over photography and color fields.
for mode in ["ink","reversed"]:
    fg = INK if mode == "ink" else PAPER
    transparent = Image.new("RGBA",(1800,480),(0,0,0,0))
    td = ImageDraw.Draw(transparent)
    transparent.paste(mark_bitmap(336).convert("RGBA"),(54,72))
    draw_wordmark(td,440,132,150,light=(mode=="reversed"))
    td.text((450,315),"PHOTOGRAPHY FIELD GUIDE",font=font(INTER,30),fill=GRAY if mode=="ink" else CREAM)
    transparent.save(LOGOS / "png" / f"activeshot-logo-horizontal-transparent-{mode}.png",optimize=True)
    symbol = Image.new("RGBA",(1024,1024),(0,0,0,0))
    symbol.paste(mark_bitmap(844).convert("RGBA"),(90,90))
    symbol.save(LOGOS / "png" / f"activeshot-mark-transparent-{mode}-1024.png",optimize=True)

# Put production icons and share card into the live app.
copy2(ICONS / "png" / "activeshot-icon-180.png", ROOT / "docs" / "icon-180.png")
copy2(ICONS / "png" / "activeshot-icon-192.png", ROOT / "docs" / "icon-192.png")
copy2(ICONS / "png" / "activeshot-icon-512.png", ROOT / "docs" / "icon-512.png")
copy2(SOCIAL / "png" / "website-social-card-1200x630.png", ROOT / "docs" / "active-shot-social-card.png")
save_text(ROOT / "docs" / "icon.svg", app_icon_svg())
live_illustrations = ROOT / "docs" / "illustrations"
live_illustrations.mkdir(parents=True, exist_ok=True)
for illustration in ILLUSTRATIONS.glob("*.png"):
    copy2(illustration, live_illustrations / illustration.name)
brand_board()

print("ActiveShot brand suite generated")
