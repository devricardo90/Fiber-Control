# Pendências para Refazer / Implementar Futuramente

## Dashboard Page
1. **Recent Activity (Atividades Recentes)**:
   - Atualmente listando fluxo falso de pagamentos/inscrições no arquivo `page.tsx` no canto inferior.
   - **Ação:** Criar o novo endpoint no backend (`/reports/recent-activity` ou puxar no feed de eventos) e transformar a interface em um componente `<RecentActivityList data={...} />`.
2. **Fiscal Reminders (Agenda Tributária)**:
   - Atualmente o card no rodapé ilustra o vencimento das taxas trimestrais, que é estático.
   - **Ação:** Plugar no sistema de calendários e avisos, mudando de card para o componente interativo que exibe próximos vencimentos de forma calculada.

## Settings Page
1. **Company Information (Dados da Empresa)**:
   - Atualmente os campos (Nome, CNPJ, Email, Endereço, Timezone, Moeda) estão em estado local (`useState`) no frontend.
   - **Ação:** Criar modelo `Organization` ou `CompanyConfig` no Prisma, gerar migration, e criar endpoints CRUD no backend para persistência real desses dados.
2. **Branding & Security Sections**:
   - Abas laterais ainda são placeholders visuais.
   - **Ação:** Implementar sub-rotas ou renderização condicional para troca de logo (Branding) e troca de senha/2FA (Security).
