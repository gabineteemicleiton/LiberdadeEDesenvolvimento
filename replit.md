# Gabinete Digital - Emicleiton Rubem da Conceição

## Overview

This project is a static website for the "Gabinete Digital" (Digital Office) of Vereador Emicleiton Rubem da Conceição. Its main purpose is to serve as a digital platform for citizen engagement in Monte Santo, BA, Brazil. Key capabilities include sections for contact, news, projects, a public agenda, and information about the councilman. The project aims to provide a comprehensive and transparent digital space for constituents to interact with their representative, fostering greater participation and access to information.

**Current Contact Information (Updated Jan 2025):**
- Phone: +55 75 998264065 (Real number - not example)
- Email: gabinete.emicleiton@gmail.com (Changed from government domain)
- Instagram: @emicleitonemys
- Mandate Period: 2025-2028 (First mandate as councilman)

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

### 2025-08-08 - CORREÇÃO COMPLETA DO CALENDÁRIO MOBILE
- **Problema da agenda aparecendo em todas as telas resolvido:**
  - Sistema de visibilidade baseado na classe 'active' implementado
  - CSS `mobile-agenda-visibility-fix.css` criado para controlar exibição
  - Scripts de correção atualizados para só funcionar quando agenda ativa
  - JavaScript `agenda-visibility-manager.js` para gerenciar visibilidade automaticamente

- **Calendário mobile IGUAL AO DESKTOP implementado:**
  - Arquivos `calendar-mobile-fix.css` com estilos idênticos ao desktop
  - CSS Grid 7×6 com 44px de altura para cada célula
  - Container 400px com bordas arredondadas e sombra elegante
  - Gradientes nos dias atuais e com eventos (azul/verde)
  - Botões de navegação funcionais com hover effects
  - Layout responsivo que mantém proporções do desktop

### 2025-08-07 - SISTEMA COMPLETO FINALIZADO
- **Sistema unificado implementado:**
  - Arquivo `system-fix-complete.js` criado com todas as correções integradas
  - Cadastro funciona e salva tanto no servidor quanto localmente
  - Login funciona com dados persistentes do servidor
  - Dados aparecem automaticamente no painel administrativo
  - Sistema de boas-vindas personalizado funcionando
  - Calendário mobile corrigido com CSS específico e JavaScript

- **Correções técnicas implementadas:**
  - API de login `/api/login-eleitor` criada no server.js
  - API de cadastro corrigida com campos compatíveis para login
  - Sistema de fallback: servidor primeiro, localStorage como backup
  - Integração completa entre todas as páginas
  - Correção final do calendário mobile com grid responsivo

### 2025-08-07 - Correções e Melhorias Importantes (Histórico)
- **Sistema de login duplo implementado:**
  - **Cidadãos**: Fazem cadastro e login para acessar o site principal com boas-vindas personalizadas
  - **Admin**: Login separado (`admin@gabinete.com` / `123456`) para acesso ao painel administrativo
  - Botões de login admin removidos da página principal conforme solicitado
  - Sistema de boas-vindas no cabeçalho com nome do cidadão logado e botão de logout

- **Gestão de Eleitores corrigida:**
  - Painel administrativo agora mostra todos os dados dos cidadãos cadastrados
  - Compatibilidade entre `registeredUsers` (cadastro) e `eleitores` (painel admin)
  - Migração automática de dados entre os sistemas
  - Tabela completa com nome, idade, gênero, bairro, telefone e controle de presença

- **Calendário mobile com múltiplas correções:**
  - CSS específico no `mobile-emergency-fix.css` com !important para forçar exibição
  - JavaScript adicional para reconstruir calendário no mobile automaticamente
  - Estilos forçados para números dos dias aparecerem corretamente
  - Eventos de resize e orientationchange para garantir funcionamento

- **Melhorias técnicas:**
  - Sistema unificado de dados entre cadastro e painel admin
  - Verificação automática de login do cidadão no carregamento da página
  - Função de logout integrada no cabeçalho do site

**August 6, 2025 - Supabase Integration Improvements:**
- Fixed URL inconsistency in Supabase configuration across files
- Enhanced automatic site synchronization when admin panel saves data
- Added manual "Sync Site" button in admin panel header for forcing updates
- Improved real-time data loading system with localStorage communication
- Enhanced error handling and user feedback for Supabase operations

## System Architecture

The system is designed as a comprehensive digital platform with both frontend and backend components, integrating with PostgreSQL via Drizzle ORM.

**Technology Stack**:
- **Frontend**: HTML5, CSS3 (with custom properties), Vanilla JavaScript
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM, also integrates with Supabase for cloud database solutions.
- **API**: RESTful API endpoints for content management.
- **UI Libraries**: Google Fonts (Inter, Poppins), Font Awesome for icons.
- **Charting**: Chart.js for data visualization.
- **Mapping**: Leaflet.js for interactive maps.
- **PDF Generation**: jsPDF for report generation.
- **Excel Export**: SheetJS for data export.

**UI/UX Decisions**:
- **Color Palette**: Primarily blue and yellow campaign colors (#1e40af, #fbbf24) with neutral grays.
- **Typography**: Inter and Poppins font families for a modern, clean, and professional appearance.
- **Responsive Design**: Mobile-first approach with adaptive layouts for various screen sizes, including hamburger menus for mobile.
- **Visual Effects**: Extensive use of gradients, shadows, glassmorphism, shimmer effects, and smooth transitions for a premium, institutional look.
- **Interactive Elements**: Floating WhatsApp button, AI Assistant chatbot, dynamic content sections, and interactive forms.

**Technical Implementations & Feature Specifications**:
- **Single Page Application (SPA) Characteristics**: Content sections are dynamically shown/hidden via JavaScript for a fluid user experience.
- **Content Management System (CMS)**: Comprehensive administrative panel for full CRUD operations across all public site content (header, hero, footer, contact, projects, news, gallery, agenda, biography, action buttons, mandate cards, statistics cards). This allows for 100% code-free content management via a professional WYSIWYG editor, drag-and-drop image uploads, and structured JSON persistence (localStorage or Supabase).
- **Administrative Panel**: Secure login (`painel.html`, `login.html`) with password protection and session management. Features include:
    - **Voter Management**: Registration forms, administrative dashboard with Charts.js integration ("Termômetro de Envolvimento," "Aniversariantes"), and voter distribution maps (Leaflet.js).
    - **Reporting**: PDF reports (jsPDF) and CSV export (SheetJS/FileSaver.js).
    - **Configuration System**: Editable panel data (vereador info, mandate details, statistics) with `config.json` and localStorage persistence.
    - **Interaction Management**: System to track and manage citizen suggestions, complaints, photo uploads, and location markers with protocol generation.
    - **Content Editing**: Modules for editing site sections, projects, news, and gallery (photos/videos).
- **AI Assistant**: Interactive chatbot with predefined responses and quick actions for citizen queries.
- **Community Courses System**: A platform for displaying and managing educational courses (`cursos.html`, `painel_editor.html`), including certificate generation (PDF) and video integration.
- **Transparency System**: A dashboard for municipal data comparison, AI-powered insights (using OpenAI GPT-4o), municipal rankings, interactive AI chat for budget questions, and links to official data portals.
- **Enhanced Login Interface**: Modern, secure login with dark mode support, session management, visual enhancements, and accessibility features.
- **Digital Assistant System**: Interactive quick action buttons leading to forms for suggestions, complaints, photo uploads, and location marking, all with protocol generation and localStorage persistence.
- **API Architecture**: Separate API for transparency features, handling OpenAI integration and official data processing, with server-side API key management.

## External Dependencies

- **Google Fonts**: `Inter`, `Poppins` (loaded via CDN)
- **Font Awesome**: Icons (loaded via CDN, version 6.4.0)
- **Chart.js**: For various data visualizations and charts.
- **DataTables**: For enhanced table functionalities in the admin panel.
- **Leaflet.js**: For interactive mapping (e.g., voter distribution).
- **SheetJS**: For exporting data to Excel/CSV.
- **jsPDF**: For generating PDF reports and certificates.
- **EmailJS**: For sending emails from contact forms.
- **OpenAI**: GPT-4o for AI-powered comparisons and insights in the Transparency System.
- **OpenStreetMap Nominatim**: For reverse geocoding in location features.
- **Supabase**: Cloud database for dynamic content management and storage.
- **PostgreSQL**: Primary database integrated with Drizzle ORM.