"""
Utilitaire pour générer des factures PDF
"""
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_RIGHT, TA_CENTER
from datetime import datetime
from decimal import Decimal
from typing import List, Dict
import os


class PDFGenerator:
    """Générateur de factures PDF"""
    
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
        
        self.header_style = ParagraphStyle(
            'CustomHeader',
            parent=self.styles['Normal'],
            fontSize=10,
            textColor=colors.HexColor('#34495E'),
        )
    
    def add_header(self, user_data: Dict, invoice_data: Dict):
        """Ajouter l'en-tête de la facture"""
        # Titre
        doc_type = "DEVIS" if invoice_data.get('is_quote') else "FACTURE"
        title = Paragraph(f"<b>{doc_type}</b>", self.title_style)
        self.elements.append(title)
        self.elements.append(Spacer(1, 0.5*cm))
        
        # Informations entreprise et client
        info_data = [
            [
                Paragraph(f"<b>{user_data['entreprise_name']}</b><br/>"
                         f"{user_data.get('address', '')}<br/>"
                         f"NIF: {user_data.get('nif', '')}<br/>"
                         f"Tél: {user_data.get('phone', '')}", self.header_style),
                Paragraph(f"<b>Client</b><br/>"
                         f"{invoice_data['client_name']}<br/>"
                         f"{invoice_data.get('client_address', '')}<br/>"
                         f"NIF: {invoice_data.get('client_nif', '')}", self.header_style)
            ]
        ]
        
        info_table = Table(info_data, colWidths=[9*cm, 9*cm])
        info_table.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('LEFTPADDING', (0, 0), (-1, -1), 0),
            ('RIGHTPADDING', (0, 0), (-1, -1), 0),
        ]))
        
        self.elements.append(info_table)
        self.elements.append(Spacer(1, 1*cm))
        
        # Numéro et date
        invoice_info = [
            [f"N° {invoice_data['invoice_number']}", f"Date: {invoice_data['date']}"],
            ["", f"Échéance: {invoice_data.get('due_date', 'N/A')}"]
        ]
        
        invoice_table = Table(invoice_info, colWidths=[9*cm, 9*cm])
        invoice_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (0, -1), 'LEFT'),
            ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 11),
        ]))
        
        self.elements.append(invoice_table)
        self.elements.append(Spacer(1, 1*cm))
    
    def add_items_table(self, items: List[Dict], totals: Dict):
        """Ajouter le tableau des articles"""
        # En-tête du tableau
        table_data = [
            ['Description', 'Quantité', 'Prix unitaire', 'Total']
        ]
        
        # Articles
        for item in items:
            table_data.append([
                item['description'],
                str(item['quantity']),
                f"{item['unit_price']:.2f} DZD",
                f"{item['total']:.2f} DZD"
            ])
        
        # Ligne vide
        table_data.append(['', '', '', ''])
        
        # Totaux
        table_data.append(['', '', 'Total HT:', f"{totals['total_ht']:.2f} DZD"])
        table_data.append(['', '', f"TVA ({totals['tva_rate']}%):", f"{totals['tva_amount']:.2f} DZD"])
        table_data.append(['', '', 'Total TTC:', f"{totals['total_ttc']:.2f} DZD"])
        
        # Créer le tableau
        table = Table(table_data, colWidths=[8*cm, 3*cm, 4*cm, 3*cm])
        table.setStyle(TableStyle([
            # En-tête
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#3498DB')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 11),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            
            # Articles
            ('ALIGN', (1, 1), (-1, -1), 'RIGHT'),
            ('FONTNAME', (0, 1), (-1, -4), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -4), 10),
            ('GRID', (0, 0), (-1, -4), 1, colors.grey),
            
            # Totaux
            ('FONTNAME', (2, -3), (-1, -1), 'Helvetica-Bold'),
            ('BACKGROUND', (2, -1), (-1, -1), colors.HexColor('#ECF0F1')),
            ('FONTSIZE', (2, -1), (-1, -1), 12),
        ]))
        
        self.elements.append(table)
        self.elements.append(Spacer(1, 1*cm))
    
    def add_footer(self, notes: str = None):
        """Ajouter le pied de page"""
        if notes:
            self.elements.append(Paragraph(f"<b>Notes:</b><br/>{notes}", self.styles['Normal']))
            self.elements.append(Spacer(1, 0.5*cm))
        
        footer_text = Paragraph(
            "Merci de votre confiance !<br/>"
            "<i>Document généré par 7SSABI - Gestion Comptabilité</i>",
            ParagraphStyle('Footer', parent=self.styles['Normal'], alignment=TA_CENTER, fontSize=9)
        )
        self.elements.append(footer_text)
    
    def build(self):
        """Construire le PDF"""
        self.doc.build(self.elements)


def generate_invoice_pdf(
    invoice_data: Dict,
    user_data: Dict,
    client_data: Dict,
    items: List[Dict],
    output_dir: str = "invoices"
) -> str:
    """
    Générer une facture PDF
    
    Args:
        invoice_data: Données de la facture
        user_data: Données de l'utilisateur
        client_data: Données du client
        items: Liste des articles
        output_dir: Répertoire de sortie
    
    Returns:
        Chemin du fichier PDF généré
    """
    # Créer le répertoire si nécessaire
    os.makedirs(output_dir, exist_ok=True)
    
    # Nom du fichier
    filename = f"{invoice_data['invoice_number']}.pdf"
    filepath = os.path.join(output_dir, filename)
    
    # Créer le générateur PDF
    pdf = PDFGenerator(filepath)
    
    # Préparer les données
    invoice_info = {
        'invoice_number': invoice_data['invoice_number'],
        'date': invoice_data['date'].strftime('%d/%m/%Y'),
        'due_date': invoice_data.get('due_date').strftime('%d/%m/%Y') if invoice_data.get('due_date') else 'N/A',
        'is_quote': invoice_data.get('is_quote', False),
        'client_name': client_data['name'],
        'client_address': client_data.get('address', ''),
        'client_nif': client_data.get('nif', ''),
    }
    
    totals = {
        'total_ht': invoice_data['total_ht'],
        'tva_rate': invoice_data['tva_rate'],
        'tva_amount': invoice_data['tva_amount'],
        'total_ttc': invoice_data['total_ttc']
    }
    
    # Construire le PDF
    pdf.add_header(user_data, invoice_info)
    pdf.add_items_table(items, totals)
    pdf.add_footer(invoice_data.get('notes'))
    pdf.build()
    
    return filepath
