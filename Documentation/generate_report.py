import os
import webbrowser

def generate_report():
    input_file = "STREETBITE_EXECUTIVE_SUMMARY.md"
    output_file = "StreetBite_Report.html"
    
    if not os.path.exists(input_file):
        print(f"Error: {input_file} not found!")
        return

    with open(input_file, "r", encoding="utf-8") as f:
        md_content = f.read()

    escaped_content = md_content.replace("`", "\\`").replace("${", "\\${")

    html_template = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>StreetBite Executive Report</title>
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <script type="module">
      import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
      mermaid.initialize({{ startOnLoad: true, theme: 'base', themeVariables: {{ primaryColor: '#f97316', secondaryColor: '#ffedd5', tertiaryColor: '#fff', mainBkg: '#fff', nodeBorder: '#f97316' }} }});
    </script>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
        :root {{
            --primary: #ea580c;
            --secondary: #f97316;
            --dark: #1f2937;
            --light: #fff7ed;
            --text: #374151;
        }}
        body {{
            font-family: 'Inter', sans-serif;
            line-height: 1.7;
            color: var(--text);
            background: #f3f4f6;
            margin: 0;
            padding: 40px;
        }}
        #container {{
            max-width: 900px;
            margin: 0 auto;
            background: #fff;
            padding: 60px 80px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.05);
            border-radius: 16px;
        }}
        h1, h2, h3, h4 {{
            font-family: 'Outfit', sans-serif;
            color: var(--dark);
        }}
        h1 {{
            font-size: 3em;
            font-weight: 800;
            color: var(--primary);
            margin-bottom: 0.2em;
            letter-spacing: -0.02em;
            border-bottom: 3px solid var(--primary);
            padding-bottom: 20px;
        }}
        h2 {{
            font-size: 1.8em;
            color: var(--secondary);
            margin-top: 50px;
            border-left: 5px solid var(--secondary);
            padding-left: 15px;
        }}
        h3 {{
            font-size: 1.4em;
            margin-top: 30px;
        }}
        p {{
            margin-bottom: 20px;
            font-size: 1.1em;
        }}
        img {{
            max-width: 100%;
            border-radius: 12px;
            box-shadow: 0 8px 20px rgba(0,0,0,0.1);
            margin: 30px 0;
            border: 1px solid #e5e7eb;
        }}
        blockquote {{
            background: var(--light);
            border-left: 5px solid var(--primary);
            margin: 30px 0;
            padding: 20px 30px;
            font-size: 1.2em;
            color: var(--dark);
            font-family: 'Outfit', serif;
            font-style: italic;
            border-radius: 8px;
        }}
        code {{
            background: #f3f4f6;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: monospace;
            color: var(--primary);
        }}
        .mermaid {{
            margin: 40px 0;
            text-align: center;
            background: #fafafa;
            padding: 20px;
            border-radius: 12px;
            border: 1px dashed #e5e7eb;
        }}
        table {{
            width: 100%;
            border-collapse: collapse;
            margin: 30px 0;
            font-size: 0.95em;
        }}
        th, td {{
            padding: 15px;
            border-bottom: 1px solid #e5e7eb;
            text-align: left;
        }}
        th {{
            background: var(--light);
            color: var(--primary);
            font-weight: 600;
            text-transform: uppercase;
            font-size: 0.85em;
            letter-spacing: 0.05em;
        }}
        tr:last-child td {{ border-bottom: none; }}
        
        @media print {{
            body {{ background: #fff; padding: 0; }}
            #container {{ 
                box-shadow: none; 
                padding: 40px; 
                max-width: 100%;
            }}
            .no-print {{ display: none; }}
            h2 {{ page-break-before: always; margin-top: 20px; }}
            h1 {{ page-break-before: avoid; }}
        }}
    </style>
</head>
<body>
    <div id="container">
        <div id="content"></div>
    </div>

    <script>
        const md = `{escaped_content}`;
        document.getElementById('content').innerHTML = marked.parse(md);
        
        document.querySelectorAll('code.language-mermaid').forEach(el => {{
            const div = document.createElement('div');
            div.className = 'mermaid';
            div.textContent = el.textContent;
            el.parentElement.replaceWith(div);
        }});
    </script>
    
    <div class="no-print" style="position: fixed; bottom: 30px; right: 30px; background: #fff; padding: 15px 25px; border-radius: 50px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); border: 1px solid #e5e7eb; display: flex; align-items: center; gap: 10px; cursor: pointer; transition: transform 0.2s;" onclick="window.print()">
        <span style="font-size: 20px">🖨️</span>
        <span style="font-weight: 600; color: #374151;">Print to PDF</span>
    </div>
</body>
</html>
    """

    with open(output_file, "w", encoding="utf-8") as f:
        f.write(html_template)
    
    print(f"Successfully generated {output_file}")
    
    abs_path = os.path.abspath(output_file)
    webbrowser.open(f"file://{{abs_path}}")

if __name__ == "__main__":
    generate_report()
