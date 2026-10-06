import re

html = open("index.html", encoding="utf-8").read()
hrefs = set(re.findall(r'href="#([^"]+)"', html))
ids = set(re.findall(r'id="([^"]+)"', html))

missing = hrefs - ids
print(f"Total internal links: {len(hrefs)}")
print(f"Missing targets: {missing}")
