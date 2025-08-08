#!/usr/bin/env python3
"""
Scraper para notícias de empreendedorismo do G1 PEGN
Extrai notícias atuais sobre pequenas e grandes empresas
"""

import requests
import trafilatura
import json
from datetime import datetime
import re
import time
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PEGNScraper:
    def __init__(self):
        self.base_url = "https://g1.globo.com/empreendedorismo/pegn/"
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
    
    def fetch_latest_news(self, max_articles=10):
        """Buscar últimas notícias do PEGN"""
        try:
            logger.info(f"Buscando notícias em: {self.base_url}")
            
            # Fazer requisição para página principal
            response = requests.get(self.base_url, headers=self.headers, timeout=30)
            response.raise_for_status()
            
            # Extrair conteúdo da página
            downloaded = response.text
            content = trafilatura.extract(downloaded, output_format='json')
            
            if not content:
                logger.error("Não foi possível extrair conteúdo da página")
                return []
            
            content_json = json.loads(content)
            
            # Buscar links de artigos na página HTML
            articles = self.extract_article_links(downloaded)
            
            # Processar cada artigo
            news_data = []
            for i, article_url in enumerate(articles[:max_articles]):
                try:
                    logger.info(f"Processando artigo {i+1}/{len(articles)}: {article_url}")
                    article_data = self.scrape_article(article_url)
                    if article_data:
                        news_data.append(article_data)
                    time.sleep(1)  # Delay para não sobrecarregar o servidor
                except Exception as e:
                    logger.error(f"Erro ao processar artigo {article_url}: {e}")
                    continue
            
            logger.info(f"Total de artigos processados: {len(news_data)}")
            return news_data
            
        except Exception as e:
            logger.error(f"Erro ao buscar notícias: {e}")
            return []
    
    def extract_article_links(self, html_content):
        """Extrair links de artigos da página principal"""
        # Padrões de URL do G1 PEGN
        patterns = [
            r'href="(https://g1\.globo\.com/empreendedorismo/[^"]+)"',
            r'href="(https://g1\.globo\.com/[^"]+/empreendedorismo/[^"]+)"',
        ]
        
        links = set()
        for pattern in patterns:
            matches = re.findall(pattern, html_content)
            for match in matches:
                if 'noticia' in match or 'artigo' in match or len(match.split('/')) > 6:
                    links.add(match)
        
        return list(links)[:20]  # Limitar a 20 links
    
    def scrape_article(self, url):
        """Extrair dados de um artigo específico"""
        try:
            response = requests.get(url, headers=self.headers, timeout=30)
            response.raise_for_status()
            
            # Usar trafilatura para extrair conteúdo estruturado
            content = trafilatura.extract(
                response.text, 
                output_format='json',
                include_comments=False,
                include_formatting=True
            )
            
            if not content:
                return None
            
            data = json.loads(content)
            
            # Extrair informações específicas do HTML se necessário
            html = response.text
            
            # Buscar tags e categorias
            tags = self.extract_tags(html)
            category = self.extract_category(url, html)
            
            article_data = {
                'title': data.get('title', '').strip(),
                'content': data.get('text', '').strip(),
                'author': data.get('author', 'G1 PEGN'),
                'date': data.get('date', datetime.now().isoformat()),
                'url': url,
                'category': category,
                'tags': tags,
                'summary': self.generate_summary(data.get('text', '')),
                'scraped_at': datetime.now().isoformat()
            }
            
            # Filtrar artigos sem conteúdo suficiente
            if len(article_data['content']) < 200 or not article_data['title']:
                return None
            
            return article_data
            
        except Exception as e:
            logger.error(f"Erro ao extrair artigo {url}: {e}")
            return None
    
    def extract_tags(self, html):
        """Extrair tags/palavras-chave do HTML"""
        tags = set()
        
        # Buscar palavras-chave comuns de empreendedorismo
        keywords = [
            'startup', 'empreendedorismo', 'negócio', 'empresa', 'inovação',
            'tecnologia', 'investimento', 'mercado', 'vendas', 'marketing',
            'gestão', 'liderança', 'pequena empresa', 'MEI', 'microempresa'
        ]
        
        html_lower = html.lower()
        for keyword in keywords:
            if keyword in html_lower:
                tags.add(keyword.title())
        
        return list(tags)
    
    def extract_category(self, url, html):
        """Determinar categoria do artigo"""
        if 'startup' in url.lower() or 'startup' in html.lower():
            return 'Startups'
        elif 'pequenas-empresas' in url.lower() or 'pequena empresa' in html.lower():
            return 'Pequenas Empresas'
        elif 'grandes-empresas' in url.lower() or 'grande empresa' in html.lower():
            return 'Grandes Empresas'
        elif 'investimento' in url.lower() or 'investimento' in html.lower():
            return 'Investimentos'
        else:
            return 'Empreendedorismo'
    
    def generate_summary(self, content):
        """Gerar resumo do artigo"""
        if not content or len(content) < 200:
            return ""
        
        # Pegar os primeiros 2 parágrafos ou até 300 caracteres
        paragraphs = content.split('\n\n')
        summary = paragraphs[0]
        
        if len(summary) < 150 and len(paragraphs) > 1:
            summary += " " + paragraphs[1]
        
        # Limitar a 300 caracteres
        if len(summary) > 300:
            summary = summary[:297] + "..."
        
        return summary.strip()

def main():
    """Função principal para executar o scraper"""
    scraper = PEGNScraper()
    
    try:
        print("🔍 Iniciando busca por notícias de empreendedorismo...")
        news = scraper.fetch_latest_news(max_articles=15)
        
        if news:
            # Salvar em arquivo JSON
            output_file = 'pegn_news.json'
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(news, f, ensure_ascii=False, indent=2)
            
            print(f"✅ {len(news)} notícias extraídas e salvas em {output_file}")
            
            # Mostrar preview
            for i, article in enumerate(news[:3]):
                print(f"\n📰 {i+1}. {article['title']}")
                print(f"   📅 {article['date']}")
                print(f"   🏷️  {article['category']}")
                print(f"   📝 {article['summary'][:100]}...")
        else:
            print("❌ Nenhuma notícia encontrada")
            
    except Exception as e:
        print(f"❌ Erro durante execução: {e}")

if __name__ == "__main__":
    main()