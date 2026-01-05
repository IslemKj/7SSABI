"""
Générateur de PDF pour les rapports d'analytics
"""
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from datetime import datetime
from typing import List, Dict
import os


class AnalyticsPDFGenerator:
    """Générateur de rapports analytics PDF"""
    
    def __init__(self, output_path: str):
        self.output_path = output_path
        self.doc = SimpleDocTemplate(output_path, pagesize=A4)
        self.styles = getSampleStyleSheet()
        self.elements = []
        
        # Styles personnalisés
        self.title_style = ParagraphStyle(
            'CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#2C3E50'),
            spaceAfter=30,
            alignment=TA_CENTER
        )
        
        self.heading_style = ParagraphStyle(
            'CustomHeading',
            parent=self.styles['Heading2'],
            fontSize=16,
            textColor=colors.HexColor('#6366f1'),
            spaceAfter=12,
            spaceBefore=12,
        )
        
        self.normal_style = ParagraphStyle(
            'CustomNormal',
            parent=self.styles['Normal'],
            fontSize=10,
        )
    
    def add_header(self, company_name: str, period: str):
        """Ajouter l'en-tête du rapport"""
        title = Paragraph("<b>Rapport d'Analytics</b>", self.title_style)
        self.elements.append(title)
        
        subtitle = Paragraph(f"<b>{company_name}</b>", self.normal_style)
        self.elements.append(subtitle)
        
        date_info = Paragraph(
            f"Période: {period}<br/>Généré le: {datetime.now().strftime('%d/%m/%Y à %H:%M')}",
            self.normal_style
        )
        self.elements.append(date_info)
        self.elements.append(Spacer(1, 1*cm))
    
    def add_kpis(self, kpis: Dict):
        """Ajouter les KPIs"""
        heading = Paragraph("<b>Indicateurs Clés de Performance</b>", self.heading_style)
        self.elements.append(heading)
        
        kpi_data = [
            ['Indicateur', 'Valeur'],
            ['CA Mois Actuel', f"{kpis.get('current_month_revenue', 0):,.2f} DA"],
            ['CA Mois Précédent', f"{kpis.get('previous_month_revenue', 0):,.2f} DA"],
            ['Croissance', f"{kpis.get('growth_percentage', 0):+.1f}%"],
            ['Facture Moyenne', f"{kpis.get('average_invoice', 0):,.2f} DA"],
            ['Taux de Conversion', f"{kpis.get('conversion_rate', 0):.1f}%"],
        ]
        
        kpi_table = Table(kpi_data, colWidths=[10*cm, 7*cm])
        kpi_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#6366f1')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.grey),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 10),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.whitesmoke, colors.lightgrey]),
        ]))
        
        self.elements.append(kpi_table)
        self.elements.append(Spacer(1, 1*cm))
    
    def add_revenue_trend(self, trend_data: List[Dict]):
        """Ajouter l'évolution du CA"""
        heading = Paragraph("<b>Évolution du Chiffre d'Affaires</b>", self.heading_style)
        self.elements.append(heading)
        
        table_data = [['Mois', 'Revenus', 'Dépenses', 'Profit']]
        
        for item in trend_data:
            table_data.append([
                item['month'],
                f"{item['revenue']:,.2f} DA",
                f"{item['expenses']:,.2f} DA",
                f"{item['profit']:,.2f} DA"
            ])
        
        trend_table = Table(table_data, colWidths=[4*cm, 4.5*cm, 4.5*cm, 4.5*cm])
        trend_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#6366f1')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 11),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('GRID', (0, 0), (-1, -1), 1, colors.grey),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 9),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.whitesmoke, colors.lightgrey]),
        ]))
        
        self.elements.append(trend_table)
        self.elements.append(Spacer(1, 1*cm))
    
    def add_top_clients(self, clients_data: List[Dict]):
        """Ajouter les meilleurs clients"""
        heading = Paragraph("<b>Meilleurs Clients</b>", self.heading_style)
        self.elements.append(heading)
        
        if not clients_data:
            no_data = Paragraph("Aucune donnée disponible", self.normal_style)
            self.elements.append(no_data)
            self.elements.append(Spacer(1, 1*cm))
            return
        
        table_data = [['#', 'Client', 'CA Total', 'Nb Factures']]
        
        for idx, client in enumerate(clients_data, 1):
            table_data.append([
                str(idx),
                client['name'],
                f"{client['revenue']:,.2f} DA",
                str(client['invoice_count'])
            ])
        
        clients_table = Table(table_data, colWidths=[1.5*cm, 8*cm, 4.5*cm, 3.5*cm])
        clients_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#10b981')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('ALIGN', (0, 0), (0, -1), 'CENTER'),
            ('ALIGN', (2, 0), (-1, -1), 'RIGHT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 11),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('GRID', (0, 0), (-1, -1), 1, colors.grey),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 9),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.whitesmoke, colors.lightgrey]),
        ]))
        
        self.elements.append(clients_table)
        self.elements.append(Spacer(1, 1*cm))
    
    def add_top_products(self, products_data: List[Dict]):
        """Ajouter les produits les plus vendus"""
        heading = Paragraph("<b>Produits/Services les Plus Vendus</b>", self.heading_style)
        self.elements.append(heading)
        
        if not products_data:
            no_data = Paragraph("Aucune donnée disponible", self.normal_style)
            self.elements.append(no_data)
            self.elements.append(Spacer(1, 1*cm))
            return
        
        table_data = [['#', 'Produit', 'Catégorie', 'Quantité', 'CA Total']]
        
        for idx, product in enumerate(products_data, 1):
            table_data.append([
                str(idx),
                product['name'],
                product.get('category', 'N/A'),
                str(product['quantity']),
                f"{product['revenue']:,.2f} DA"
            ])
        
        products_table = Table(table_data, colWidths=[1.5*cm, 6*cm, 3*cm, 2.5*cm, 4.5*cm])
        products_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f59e0b')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('ALIGN', (0, 0), (0, -1), 'CENTER'),
            ('ALIGN', (3, 0), (-1, -1), 'RIGHT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 11),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('GRID', (0, 0), (-1, -1), 1, colors.grey),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 9),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.whitesmoke, colors.lightgrey]),
        ]))
        
        self.elements.append(products_table)
    
    def build(self):
        """Construire le PDF"""
        self.doc.build(self.elements)


def generate_analytics_pdf(
    company_name: str,
    period: str,
    kpis: Dict,
    revenue_trend: List[Dict],
    top_clients: List[Dict],
    top_products: List[Dict],
    output_dir: str = "reports"
) -> str:
    """
    Générer un rapport analytics PDF
    
    Args:
        company_name: Nom de l'entreprise
        period: Période du rapport
        kpis: Indicateurs clés
        revenue_trend: Évolution du CA
        top_clients: Meilleurs clients
        top_products: Produits les plus vendus
        output_dir: Répertoire de sortie
    
    Returns:
        Chemin du fichier PDF généré
    """
    # Créer le répertoire si nécessaire
    os.makedirs(output_dir, exist_ok=True)
    
    # Nom du fichier
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    filename = f"rapport_analytics_{timestamp}.pdf"
    filepath = os.path.join(output_dir, filename)
    
    # Créer le générateur PDF
    pdf = AnalyticsPDFGenerator(filepath)
    
    # Ajouter les sections
    pdf.add_header(company_name, period)
    pdf.add_kpis(kpis)
    pdf.add_revenue_trend(revenue_trend)
    pdf.add_top_clients(top_clients)
    pdf.add_top_products(top_products)
    
    # Construire le PDF
    pdf.build()
    
    return filepath
