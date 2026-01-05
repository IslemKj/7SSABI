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


# Traductions
TRANSLATIONS = {
    'fr': {
        'invoice': 'FACTURE',
        'quote': 'DEVIS',
        'invoice_number': 'Facture N°',
        'quote_number': 'Devis N°',
        'date': 'Date',
        'due_date': 'Date d\'échéance',
        'company': 'Entreprise',
        'client': 'Client',
        'description': 'Description',
        'quantity': 'Quantité',
        'unit_price': 'Prix unitaire',
        'total': 'Total',
        'subtotal': 'Total HT',
        'vat': 'TVA',
        'total_incl_vat': 'Total TTC',
        'notes': 'Notes',
        'status': 'Statut',
        'paid': 'Payée',
        'unpaid': 'Non payée',
        'partial': 'Partiellement payée',
        'cancelled': 'Annulée'
    },
    'en': {
        'invoice': 'INVOICE',
        'quote': 'QUOTE',
        'invoice_number': 'Invoice No.',
        'quote_number': 'Quote No.',
        'date': 'Date',
        'due_date': 'Due Date',
        'company': 'Company',
        'client': 'Client',
        'description': 'Description',
        'quantity': 'Quantity',
        'unit_price': 'Unit Price',
        'total': 'Total',
        'subtotal': 'Subtotal',
        'vat': 'VAT',
        'total_incl_vat': 'Total Incl. VAT',
        'notes': 'Notes',
        'status': 'Status',
        'paid': 'Paid',
        'unpaid': 'Unpaid',
        'partial': 'Partially Paid',
        'cancelled': 'Cancelled'
    }
}


class PDFGenerator:
    """Générateur de factures PDF"""
    
    def __init__(self, output_path: str, language: str = 'fr'):
        self.output_path = output_path
        self.language = language
        self.translations = TRANSLATIONS.get(language, TRANSLATIONS['fr'])
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
        # Logo en haut à gauche si disponible
        if user_data.get('logo_url') and os.path.exists(user_data['logo_url']):
            try:
                logo = Image(user_data['logo_url'], width=3*cm, height=3*cm, kind='proportional')
                logo.hAlign = 'LEFT'
                self.elements.append(logo)
                self.elements.append(Spacer(1, 0.3*cm))
            except:
                pass  # Si le logo ne peut pas être chargé, continuer sans
        
        # Titre
        doc_type = self.translations['quote'] if invoice_data.get('is_quote') else self.translations['invoice']
        title = Paragraph(f"<b>{doc_type}</b>", self.title_style)
        self.elements.append(title)
        self.elements.append(Spacer(1, 0.5*cm))
        
        # Informations entreprise et client
        company_label = self.translations['company']
        client_label = self.translations['client']
        
        # Construire les infos utilisateur
        user_info = f"<b>{user_data['entreprise_name']}</b><br/>{user_data.get('address', '')}<br/>"
        if user_data.get('nif'):
            user_info += f"NIF: {user_data['nif']}<br/>"
        if user_data.get('rc_number'):
            user_info += f"RC/CAE: {user_data['rc_number']}<br/>"
        user_info += f"Tél: {user_data.get('phone', '')}"
        
        # Construire les infos client
        client_info = f"<b>{client_label}</b><br/>{invoice_data['client_name']}<br/>{invoice_data.get('client_address', '')}<br/>"
        if invoice_data.get('client_nif'):
            client_info += f"NIF: {invoice_data['client_nif']}<br/>"
        if invoice_data.get('client_rc_number'):
            client_info += f"RC/CAE: {invoice_data['client_rc_number']}<br/>"
        
        info_data = [
            [
                Paragraph(user_info, self.header_style),
                Paragraph(client_info, self.header_style)
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
        number_label = self.translations['quote_number'] if invoice_data.get('is_quote') else self.translations['invoice_number']
        date_label = self.translations['date']
        due_date_label = self.translations['due_date']
        invoice_info = [
            [f"{number_label} {invoice_data['invoice_number']}", f"{date_label}: {invoice_data['date']}"],
            ["", f"{due_date_label}: {invoice_data.get('due_date', 'N/A')}"]
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
    
    def add_items_table(self, items: List[Dict], totals: Dict, currency: str = 'EUR'):
        """Ajouter le tableau des articles"""
        # Symboles de devises
        currency_symbols = {'EUR': '€', 'GBP': '£', 'USD': '$', 'DZD': 'DA'}
        symbol = currency_symbols.get(currency, currency)
        
        # En-tête du tableau
        desc_label = self.translations['description']
        qty_label = self.translations['quantity']
        unit_price_label = self.translations['unit_price']
        total_label = self.translations['total']
        table_data = [
            [desc_label, qty_label, f'{unit_price_label} ({symbol})', f'{total_label} ({symbol})']
        ]
        
        # Articles
        for item in items:
            table_data.append([
                item['description'],
                str(item['quantity']),
                f"{symbol}{item['unit_price']:.2f}",
                f"{symbol}{item['total']:.2f}"
            ])
        
        # Ligne vide
        table_data.append(['', '', '', ''])
        
        # Totaux
        subtotal_label = self.translations['subtotal']
        vat_label = self.translations['vat']
        total_incl_vat_label = self.translations['total_incl_vat']
        table_data.append(['', '', f'{subtotal_label}:', f"{symbol}{totals['total_ht']:.2f}"])
        table_data.append(['', '', f"{vat_label} ({totals['tva_rate']}%):", f"{symbol}{totals['tva_amount']:.2f}"])
        table_data.append(['', '', f'{total_incl_vat_label}:', f"{symbol}{totals['total_ttc']:.2f}"])
        
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
            notes_label = self.translations['notes']
            self.elements.append(Paragraph(f"<b>{notes_label}:</b><br/>{notes}", self.styles['Normal']))
            self.elements.append(Spacer(1, 0.5*cm))
        
        thank_you_msg = "Thank you for your business!" if self.language == 'en' else "Merci de votre confiance !"
        footer_text = Paragraph(
            f"{thank_you_msg}<br/>"
            "<i>Document generated by Involeo - Accounting Management</i>" if self.language == 'en' 
            else "<i>Document généré par Involeo - Gestion Comptabilité</i>",
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
    
    # Récupérer la langue (par défaut français)
    language = invoice_data.get('language', 'fr')
    
    # Créer le générateur PDF
    pdf = PDFGenerator(filepath, language)
    
    # Préparer les données
    invoice_info = {
        'invoice_number': invoice_data['invoice_number'],
        'date': invoice_data['date'].strftime('%d/%m/%Y'),
        'due_date': invoice_data.get('due_date').strftime('%d/%m/%Y') if invoice_data.get('due_date') else 'N/A',
        'is_quote': invoice_data.get('is_quote', False),
        'client_name': client_data['name'],
        'client_address': client_data.get('address', ''),
        'client_nif': client_data.get('nif', ''),
        'client_rc_number': client_data.get('rc_number', ''),
    }
    
    totals = {
        'total_ht': invoice_data['total_ht'],
        'tva_rate': invoice_data['tva_rate'],
        'tva_amount': invoice_data['tva_amount'],
        'total_ttc': invoice_data['total_ttc']
    }
    
    # Récupérer la devise (par défaut EUR)
    currency = invoice_data.get('currency', 'EUR')
    
    # Construire le PDF
    pdf.add_header(user_data, invoice_info)
    pdf.add_items_table(items, totals, currency)
    pdf.add_footer(invoice_data.get('notes'))
    pdf.build()
    
    return filepath
