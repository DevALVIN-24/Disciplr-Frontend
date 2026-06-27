# Validation History Filters

The verifier validation history page supports client-side filtering, search, and
pagination for completed milestone decisions.

## Controls

- Outcome filter: `All outcomes`, `Approved`, or `Rejected`.
- Search: matches `vaultName` and `owner` text from each validation task.
- Page size: verifier-selectable page size values of 5, 10, or 25.
- Pagination: Previous and Next buttons expose explicit `aria-label` text and
  disabled states at the first and last pages.

## Empty States

- When there is no validation history at all, the page renders the existing
  "No History Found" message.
- When filters match no history records, the page renders "No matching
  validations" with guidance to adjust filters.

## Token Usage

The surface uses semantic tokens:

- `--surface` and `--bg` for panels and nested note blocks.
- `--border` for panel, row, and control borders.
- `--muted` for labels and helper text.
- `--success` for approved status.
- `--danger` for rejected status.

## Security Considerations

### CSV Injection Mitigation
To prevent spreadsheet formula injection vulnerabilities, the exported CSV utility (`src/utils/csv.ts`) neutralizes cell contents that begin with formula-triggering characters:
- `=` (equals sign)
- `+` (plus sign)
- `-` (minus sign)
- `@` (at sign)
- `\t` (tab character)
- `\r` (carriage return character)

Before applying standard quotes and formatting, any cell starting with one of these characters is prefixed with a single quote (`'`), in accordance with OWASP CSV Injection guidelines. This ensures spreadsheet software (like Microsoft Excel or Google Sheets) treats the value as literal text rather than executing it as a formula.
